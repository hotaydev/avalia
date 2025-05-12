import ArrowBack from "@/components/ArrowBack/ArrowBack";
import EvaluatorLogoutComponent from "@/components/EvaluatorLogout/EvaluatorLogout";
import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { Evaluation } from "@/lib/models/evaluation";
import type { Evaluator } from "@/lib/models/evaluator";
import type { ProjectForEvaluator } from "@/lib/models/project";
import type { Question } from "@/lib/models/question";
import type { ScienceFair } from "@/lib/models/scienceFair";
import capitalizeFirstLetters from "@/lib/utils/capitalize";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// TODO: validate fair start and end times before allowing this page and the previous page.

export default function ProjectToEvaluator() {
  const { push, query } = useRouter();
  const [project, setProject] = useState<ProjectForEvaluator | undefined>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [buttonEnabled, setButtonEnabled] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const _evaluator = localStorage.getItem("evaluator");
    const _fairInfo = localStorage.getItem("fairInfo");

    if (!(_evaluator && _fairInfo)) {
      push("/evaluator");
      return;
    }

    const evaluator: Evaluator = JSON.parse(_evaluator);
    const fairInfo: ScienceFair = JSON.parse(_fairInfo);

    const outOfDateMessage = outOfEvaluationDates(fairInfo);
    if (outOfDateMessage) {
      push(`/evaluator/projects?error=${outOfDateMessage}`);
      return;
    }

    const _project = getProjectFromList(evaluator);
    if (!_project) {
      (async () => {
        fetch(`/api/auth/evaluator/?sheetId=${fairInfo.spreadsheetId}&code=${evaluator.id}`)
          .then((res) => {
            if (res.status === 429) {
              throw new Error("Nós evitamos muitas requisições seguidas. Espere um pouco e tente novamente.");
            }
            return res.json();
          })
          .then((data: AvaliaApiResponse) => {
            if (isMounted) {
              if (data.status === "success" && data.data) {
                localStorage.setItem("evaluator", JSON.stringify(data.data));
                setProject((data.data as Evaluator).projects.filter((proj) => proj.id === query.project)[0]);
              } else {
                toast.error("Não foi possível obter informações sobre o projeto. Tente novamente mais tarde.");
              }
            }
          })
          .catch((error) => {
            toast.error(error.message);
          });
      })();
    }

    const localQuestions = localStorage.getItem("fairQuestions");
    if (localQuestions) {
      setQuestions(JSON.parse(localQuestions));
    } else {
      (async () => {
        fetch("/api/evaluator/questions/")
          .then((res) => {
            if (res.status === 429) {
              throw new Error("Nós evitamos muitas requisições seguidas. Espere um pouco e tente novamente.");
            }
            return res.json();
          })
          .then((data: AvaliaApiResponse) => {
            if (isMounted) {
              if (data.status === "success") {
                setQuestions(data.data as Question[]);
                localStorage.setItem("fairQuestions", JSON.stringify(data.data));
              } else {
                toast.error("Não foi possível obter as questões de avaliação. Tente novamente mais tarde.");
              }
            }
          })
          .catch((error) => {
            toast.error(error.message);
          });
      })();
    }

    return () => {
      isMounted = false;
    };
  }, [query, push]);

  const handleQuestionScore = (id: number, value: number | string): void => {
    const newQuestions = questions.map((quest) => (quest.id === id ? { ...quest, value } : quest));
    setButtonEnabled(!newQuestions.some((q) => q.value === undefined && q.type !== "text"));
    setQuestions(newQuestions);
  };

  const getProjectFromList = (evaluator: Evaluator): ProjectForEvaluator | undefined => {
    let _project: ProjectForEvaluator | undefined;
    if (evaluator.projects.length > 0) {
      _project = evaluator.projects.filter((proj) => proj.id === query.project)[0] ?? undefined;
      setProject(_project);
    }

    return _project;
  };

  const outOfEvaluationDates = (fairInfo: ScienceFair): string | undefined => {
    // If dates weren't configured, then we allow the evaluations (because we don't know when they should occur)
    if (!(fairInfo.endDate || fairInfo.startDate)) {
      return;
    }

    const startDate = new Date(fairInfo.startDate ?? "").getTime();
    const endDate = new Date(fairInfo.endDate ?? "").getTime();
    const now = Date.now();

    if (endDate < now) {
      return "A feira já se encerrou.";
    }

    if (startDate > now) {
      return "A feira ainda não iniciou. Em breve você poderá avaliar os projetos.";
    }

    return;
  };

  const sendScores = (): void => {
    if (questions.some((q) => q.value === undefined && q.type !== "text")) {
      toast.error("Alguma questão não está preenchida.");
      return;
    }

    const evaluator: Evaluator = JSON.parse(localStorage.getItem("evaluator") ?? "{}");
    const fairInfo: ScienceFair = JSON.parse(localStorage.getItem("fairInfo") ?? "{}");

    setButtonEnabled(false);
    const toastId = toast.loading("Enviando avaliação...");
    fetch("/api/evaluator/evaluate/", {
      method: "POST",
      body: JSON.stringify({
        evaluator: evaluator.id,
        project: query.project,
        sheetId: fairInfo.spreadsheetId,
        questions: questions,
      }),
    })
      .then((res) => {
        if (res.status === 429) {
          throw new Error("Nós evitamos muitas requisições seguidas. Espere um pouco e tente novamente.");
        }
        return res.json();
      })
      .then(async (data: AvaliaApiResponse) => {
        toast.dismiss(toastId);
        if (data.status === "success") {
          toast.success("Avaliação enviada com sucesso!");

          const newProjects: ProjectForEvaluator[] = [];
          for (const proj of evaluator.projects) {
            if (proj.id.toUpperCase() === (query.project as string).toUpperCase()) {
              newProjects.push({
                ...proj,
                evaluation: data.data as Evaluation,
              });
            } else {
              newProjects.push(proj);
            }
          }

          localStorage.setItem(
            "evaluator",
            JSON.stringify({
              ...evaluator,
              projects: newProjects,
            }),
          );

          await new Promise((r) => setTimeout(r, 1600)); // sleep
          push("/evaluator/projects");
        } else {
          toast.error(data.message ?? "Ocorreu algum erro. Tente novamente.");
          setButtonEnabled(true);
        }
      })
      .catch((error) => {
        toast.dismiss(toastId);
        toast.error(error.message);
      });
  };

  return (
    <main className="z-10 flex flex-col items-center relative px-6 pt-20 pb-10 sm:pb-10 md:pb-14 lg:pb-20">
      <Head>
        <title>Avaliação do Projeto | Avalia</title>
      </Head>
      <Toaster />
      <HeaderTitle />
      <div className="bg-white shadow-md rounded-lg px-4 pt-12 pb-6 mb-12 max-w-lg w-full text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Avaliação do projeto</h2>
        <h3 className="font-normal text-gray-500 mb-6">
          {project?.title ? (
            capitalizeFirstLetters(project.title)
          ) : (
            <span className="rounded-lg bg-gray-100 text-gray-100">------------------------------</span>
          )}

          {questions.length === 0 && <QuestionsListplaceholder />}
          {questions.length > 0 && (
            <QuestionsList
              questions={questions}
              handleQuestionScore={handleQuestionScore}
              buttonEnabled={buttonEnabled}
              sendScores={sendScores}
            />
          )}
        </h3>
      </div>
      <EvaluatorLogoutComponent />
      <Footer fixed={false} />
      <ArrowBack route="/evaluator/projects" />
    </main>
  );
}

function QuestionsListplaceholder() {
  return (
    <div className="flex flex-col justify-center items-center px-4 mt-10">
      <SingleQuestionPlaceholder />
      <SingleQuestionPlaceholder />
      <SingleQuestionPlaceholder />
      <SingleQuestionPlaceholder />
      <SingleQuestionPlaceholder />
    </div>
  );
}

function QuestionsList({
  questions,
  handleQuestionScore,
  buttonEnabled,
  sendScores,
}: {
  questions: Question[];
  handleQuestionScore: (id: number, score: number | string) => void;
  buttonEnabled: boolean;
  sendScores: () => void;
}) {
  return (
    <div className="flex flex-col justify-center items-center px-4 mt-10 mb-2">
      {questions.map((quest) => (
        <SingleQuestion
          key={quest.id}
          title={quest.title}
          id={quest.id}
          description={quest.description}
          isText={quest.type === "text"}
          handleQuestionScore={handleQuestionScore}
        />
      ))}
      <button
        className="bg-blue-500 mt-8 text-white rounded-lg px-6 py-2 flex items-center justify-between hover:bg-blue-600 transition-all cursor-pointer group disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
        disabled={!buttonEnabled}
        onClick={() => sendScores()}
        type="button"
      >
        Enviar{" "}
        <span className={`ml-2 transform transition-transform ${buttonEnabled ? "group-hover:translate-x-2" : ""}`}>
          &rarr;
        </span>
      </button>
    </div>
  );
}

function SingleQuestionPlaceholder() {
  return (
    <span className="flex items-center px-4 py-6 bg-gray-100 text-gray-100 rounded-lg w-full mb-4">
      ----------------------------------
      <br />
      ----------------------------------
      <br />
      ----------------------------------
      <br />
      ----------------------------------
      <br />
      ----------------------------------
    </span>
  );
}

function SingleQuestion({
  title,
  description,
  id,
  isText,
  handleQuestionScore,
}: {
  title: string;
  description: string;
  id: number;
  isText: boolean;
  handleQuestionScore: (id: number, value: number | string) => void;
}) {
  const handle = (value: number | string): void => handleQuestionScore(id, value);

  return (
    <div className="border border-gray-200 border-b-blue-500 border-b-4 px-5 py-4 rounded-lg mb-2 w-full text-left">
      <h3 className="font-bold text-gray-700">{title[title.length - 1] === ":" ? title : `${title}:`}</h3>
      <p className="text-sm font-light">{description}</p>
      {isText ? <TextQuestion handle={handle} /> : <PossibleScores questionId={id} handle={handle} />}
    </div>
  );
}

function TextQuestion({ handle }: { handle: (value: number | string) => void }) {
  return (
    <div className="flex items-center justify-between mt-4 mb-2">
      <textarea
        className="w-full p-2 border text-sm border-gray-200 rounded-lg bg-white text-gray-700 placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-transparent"
        rows={4}
        placeholder="Escreva aqui..."
        onChange={(e) => {
          handle(e.target.value);
        }}
      />
    </div>
  );
}

function PossibleScores({
  questionId,
  handle,
}: {
  questionId: number;
  handle: (value: number | string) => void;
}) {
  return (
    <div className="flex items-center justify-between px-10 mt-8 mb-2">
      <SinglePossibleScore score={10} id={`score-option-10-${questionId}`} questionId={questionId} handle={handle} />
      <SinglePossibleScore score={9} id={`score-option-9-${questionId}`} questionId={questionId} handle={handle} />
      <SinglePossibleScore score={8} id={`score-option-8-${questionId}`} questionId={questionId} handle={handle} />
      <SinglePossibleScore score={7} id={`score-option-7-${questionId}`} questionId={questionId} handle={handle} />
      <SinglePossibleScore score={6} id={`score-option-6-${questionId}`} questionId={questionId} handle={handle} />
      <SinglePossibleScore score={5} id={`score-option-5-${questionId}`} questionId={questionId} handle={handle} />
    </div>
  );
}

function SinglePossibleScore({
  score,
  id,
  questionId,
  handle,
}: {
  score: number;
  id: string;
  questionId: number;
  handle: (value: number | string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center mb-2">
      <input
        id={id}
        name={questionId.toString()}
        onChange={() => {
          handle(score);
        }}
        type="radio"
        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-500 text-blue-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-500 before:opacity-0 before:transition-opacity checked:border-blue-500 hover:before:opacity-10 accent-blue-500 before:accent-blue-500 checked:bg-blue-600"
      />
      <label htmlFor={id} className="block mt-2 text-sm font-medium text-gray-700">
        {score}
      </label>
    </div>
  );
}
