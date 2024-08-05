import EvaluatorLogoutComponent from "@/components/EvaluatorLogout/EvaluatorLogout";
import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { Evaluator } from "@/lib/models/evaluator";
import type { ProjectForEvaluator } from "@/lib/models/project";
import type { ScienceFair } from "@/lib/models/scienceFair";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FcOk } from "react-icons/fc";

export default function ProjetosAvaliador() {
  const { push } = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [evaluator, setEvaluator] = useState<Evaluator | undefined>(undefined);
  const [fairInfo, setFairInfo] = useState<ScienceFair | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    const _evaluator = localStorage.getItem("evaluator");
    const _evaluatorLastUpdated = localStorage.getItem("evaluatorLastUpdated");
    const _fairInfo = localStorage.getItem("fairInfo");

    if (_evaluator && _fairInfo) {
      const localEvaluator: Evaluator = JSON.parse(_evaluator);
      const localFairInfo: ScienceFair = JSON.parse(_fairInfo);

      setEvaluator(localEvaluator);
      setFairInfo(localFairInfo);
      setLoading(false);

      if (_evaluatorLastUpdated) {
        // FUTURE: In the future this "future date" can be a environment variable or something configurable by the admins
        const futureDate = new Date(_evaluatorLastUpdated).setMinutes(new Date().getMinutes() + 10);
        if (futureDate < Date.now()) {
          // It have passed more than 10 minutes since the last update

          (async () => {
            await fetch(`/api/auth/evaluator/?sheetId=${localFairInfo.spreadsheetId}&code=${localEvaluator.id}`)
              .then((res) => res.json())
              .then((evaluatorResponse: AvaliaApiResponse) => {
                if (mounted) {
                  handleEvaluatorDataApiResponse(evaluatorResponse);
                }
              });
          })();
        }
      }
    } else {
      push("/avaliador"); // This page will handle the localStorage items
    }

    () => {
      mounted = false;
    };
  }, [push]);

  const handleEvaluatorDataApiResponse = (data: AvaliaApiResponse) => {
    // evaluatorResponse.data will be true if the evaluator was found
    if (data.status === "success" && data.data) {
      localStorage.setItem("evaluator", JSON.stringify(data.data));
      localStorage.setItem("evaluatorLastUpdated", Date.now().toString());
    }
  };

  const goToProject = (project: string): Promise<boolean> => {
    return push(`/avaliador/projetos/${project}`);
  };

  return (
    <main className="z-10 flex flex-col items-center relative px-6 pt-20 pb-10 sm:pb-10 md:pb-14 lg:pb-20">
      <Head>
        <title>Projetos | Avalia</title>
      </Head>
      <HeaderTitle />
      <div className="bg-white shadow-md rounded-lg px-4 pt-12 pb-6 mb-12 max-w-lg w-full text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-10">Seus projetos para avaliação:</h2>
        {(evaluator?.projects.length ?? 0) > 0 && (
          <ProjectsList projects={evaluator?.projects ?? []} push={goToProject} />
        )}
        {evaluator?.projects.length === 0 && !loading && <NoProjectsFound />}
        {loading && <LoadingComponent />}

        {/* Some project that have not been evaluated yet */}
        {evaluator?.projects.some((q) => !q.evaluation) ? (
          <div className="text-center mt-10 font-normal text-sm text-gray-500">
            <TimeRemainingString fairInfo={fairInfo} />
          </div>
        ) : (
          <span className="text-center flex justify-center items-center mt-10 font-normal text-sm text-gray-500">
            <FcOk className="mr-2" />
            Ótimo trabalho! Seus projetos já foram avaliados.
          </span>
        )}
      </div>
      <EvaluatorLogoutComponent />
      <Footer fixed={(evaluator?.projects.length ?? 0) <= 6} />
    </main>
  );
}

function LoadingComponent() {
  return (
    <div className="text-center px-4">
      <LoadingListItem />
      <LoadingListItem />
      <LoadingListItem />
      <LoadingListItem />
    </div>
  );
}

function LoadingListItem() {
  return (
    <span className="flex items-center px-4 py-4 bg-gray-100 text-gray-100 rounded-lg w-full mb-2">
      ----------------------------------
    </span>
  );
}

function NoProjectsFound() {
  return (
    <div className="text-center text-sm text-gray-500">
      Nenhum projeto encontrado.
      <br />
      Talvez a escola ainda não tenha atribuído nenhum projeto à você.
    </div>
  );
}

function ProjectsList({
  projects,
  push,
}: Readonly<{
  projects: ProjectForEvaluator[];
  push: (a: string) => Promise<boolean>;
}>) {
  const sortProjects = (a: ProjectForEvaluator, b: ProjectForEvaluator) => {
    if (!!a.evaluation === !!b.evaluation) {
      return 0;
    }
    return a.evaluation ? -1 : 1;
  };

  return (
    <div className="flex flex-col justify-center items-center px-4">
      {projects.toSorted(sortProjects).map((project) => (
        <ProjectListItem key={project.id} project={project} push={push} />
      ))}
    </div>
  );
}

function ProjectListItem({
  project,
  push,
}: Readonly<{
  project: ProjectForEvaluator;
  push: (a: string) => Promise<boolean>;
}>) {
  return (
    <div
      className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer rounded-lg w-full justify-between mb-2"
      onClick={() => {
        if (!project.evaluation) {
          push(project.id);
        }
      }}
    >
      <div className="flex flex-col items-start justify-center">
        <h3 className={`text-normal text-gray-700 ${project.evaluation ? "line-through" : ""}`}>{project.title}</h3>
        <p className={`text-xs text-gray-500 font-light ${project.evaluation ? "line-through" : ""}`}>
          {project.category}
        </p>
      </div>
      <div>
        {project.evaluation ? (
          <FcOk size={42} />
        ) : (
          <span className="bg-gray-300 rounded-full w-10 flex items-center justify-center h-10">
            <span className="bg-gray-200 rounded-full w-6 flex items-center justify-center h-6" />
          </span>
        )}
      </div>
    </div>
  );
}

function TimeRemainingString({ fairInfo }: { fairInfo?: ScienceFair }) {
  const days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const addZeroToDate = (date: number): string => {
    if (date < 10) {
      return `0${date}`;
    }
    return date.toString();
  };

  if (fairInfo?.endDate) {
    const date = new Date(fairInfo?.endDate);

    if (date.getTime() < new Date().getTime()) {
      return <p>As avaliações já encerraram. Agradecemos sua participação.</p>;
    }

    const weekday = days[date.getDay()];
    const month = months[date.getMonth()];
    const dayNumber = addZeroToDate(date.getDate());
    const time = `${addZeroToDate(date.getHours())}h${addZeroToDate(date.getMinutes())}`;

    return (
      <p>
        As avaliações encerram {weekday}, {dayNumber} de {month}, às {time}
      </p>
    );
  }

  return <p>Faça as avaliações antes do término da feira.</p>;
}
