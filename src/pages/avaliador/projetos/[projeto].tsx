import ArrowBack from "@/components/ArrowBack/ArrowBack";
import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import LogoutComponent from "@/components/Logout/Logout";
import { Project } from "@/lib/models/project";
import { Question } from "@/lib/models/question";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ProjetosAvaliador() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [project, setProject] = useState<Project | undefined>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [buttonEnabled, setButtonEnabled] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const projeto = router.query.projeto;
      fetch("/api/avaliador/projects/" + projeto)
        .then((res) => res.json())
        .then(async (data) => {
          if (isMounted) setProject(data);

          // It really needs to be inside the other fetch
          // because we need to first get the project data
          // for then get the questions about that project
          if (isMounted)
            fetch("/api/avaliador/questions/")
              .then((res) => res.json())
              .then((data) => {
                if (isMounted) setQuestions(data);
                if (isMounted) setLoading(false);
              });
        });
    })();
    return () => {
      isMounted = false;
    };
  }, [router.query.projeto]);

  const handleQuestionScore = (id: number, score: number) => {
    const newQuestions = questions.map((quest) =>
      quest.id === id ? { ...quest, score } : quest
    );
    setButtonEnabled(!newQuestions.some((q) => !q.score));
    setQuestions(newQuestions);
  };

  const sendScores = () => {
    if (questions.some((q) => !q.score)) {
      toast.error("Alguma questão não está preenchida.");
      return;
    }

    setButtonEnabled(false);
    fetch("/api/avaliador/questions/", {
      method: "POST",
      body: JSON.stringify(questions),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.success) {
          toast.success("Avaliação enviada com sucesso!");
          await new Promise((r) => setTimeout(r, 1600)); // sleep
          router.push("/avaliador/projetos");
        } else {
          toast.error("Ocorreu algum erro. Tente novamente.");
          setButtonEnabled(true);
        }
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Avaliação do projeto
        </h2>
        <h3 className="font-normal text-gray-500 mb-6">
          {project && project?.title ? (
            project?.title
          ) : loading ? (
            <span className="rounded-lg bg-gray-100 text-gray-100">
              ------------------------------
            </span>
          ) : (
            "Projeto não encontrado"
          )}
          {loading && <QuestionsListplaceholder />}
          {!loading && questions.length > 0 && (
            <QuestionsList
              questions={questions}
              handleQuestionScore={handleQuestionScore}
              buttonEnabled={buttonEnabled}
              sendScores={sendScores}
            />
          )}
        </h3>
      </div>
      <LogoutComponent />
      <Footer fixed={false} />
      <ArrowBack />
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
  handleQuestionScore: Function;
  buttonEnabled: boolean;
  sendScores: Function;
}) {
  return (
    <div className="flex flex-col justify-center items-center px-4 mt-10">
      {questions.map((quest) => (
        <SingleQuestion
          key={quest.id}
          title={quest.title}
          id={quest.id}
          description={quest.description}
          handleQuestionScore={handleQuestionScore}
        />
      ))}
      <button
        className="bg-blue-500 mt-8 text-white rounded-lg px-6 py-2 flex items-center justify-between hover:bg-blue-600 transition-all cursor-pointer group disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
        disabled={!buttonEnabled}
        onClick={() => sendScores()}
      >
        Enviar{" "}
        <span
          className={`ml-2 transform transition-transform ${
            buttonEnabled ? "group-hover:translate-x-2" : ""
          }`}
        >
          &rarr;
        </span>
      </button>
      <div className="text-center mt-4 font-normal text-xs text-gray-500">
        Respostas podem ser editadas por até 12h após o envio.
      </div>
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
  handleQuestionScore,
}: {
  title: string;
  description: string;
  id: number;
  handleQuestionScore: Function;
}) {
  const handle = (value: number) => handleQuestionScore(id, value);

  return (
    <div className="border border-gray-200 border-b-blue-500 border-b-4 px-5 py-4 rounded-lg mb-2 w-full text-left">
      <h3 className="font-bold text-gray-700">
        {title[title.length - 1] === ":" ? title : `${title}:`}
      </h3>
      <p className="text-sm font-light">{description}</p>
      <PossibleScores questionId={id} handle={handle} />
    </div>
  );
}

function PossibleScores({
  questionId,
  handle,
}: {
  questionId: number;
  handle: Function;
}) {
  return (
    <div className="flex items-center justify-between px-10 mt-8 mb-2">
      <SinglePossibleScore
        score={5}
        id={`score-option-5-${questionId}`}
        questionId={questionId}
        handle={handle}
      />
      <SinglePossibleScore
        score={4}
        id={`score-option-4-${questionId}`}
        questionId={questionId}
        handle={handle}
      />
      <SinglePossibleScore
        score={3}
        id={`score-option-3-${questionId}`}
        questionId={questionId}
        handle={handle}
      />
      <SinglePossibleScore
        score={2}
        id={`score-option-2-${questionId}`}
        questionId={questionId}
        handle={handle}
      />
      <SinglePossibleScore
        score={1}
        id={`score-option-6-${questionId}`}
        questionId={questionId}
        handle={handle}
      />
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
  handle: Function;
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
      <label
        htmlFor={id}
        className="block mt-2 text-sm font-medium text-gray-700"
      >
        {score}
      </label>
    </div>
  );
}
