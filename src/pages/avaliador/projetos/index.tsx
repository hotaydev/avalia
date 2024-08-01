import EvaluatorLogoutComponent from "@/components/EvaluatorLogout/EvaluatorLogout";
import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import type { ProjectForEvaluator } from "@/lib/models/project";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FcOk } from "react-icons/fc";

// TODO: salvar localmente os projetos, de forma que a cada 10x novas requisições ele atualize os dados dos projetos.
//       isso implica na necessidade de, ao avaliar um projeto, os valores da avaliação sejama tualizados na lista local.

export default function ProjetosAvaliador() {
  const { push } = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<ProjectForEvaluator[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      fetch("/api/evaluator/projects/")
        .then((res) => res.json())
        .then((data) => {
          if (isMounted) {
            setProjects(data);
            setLoading(false);
          }
        });
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // TODO: verify if the evaluatorCode is really from an evaluator
    const evaluatorCode = localStorage.getItem("evaluatorCode");

    if (!evaluatorCode) {
      push("/avaliador/");
    }
  }, [push]);

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
        {projects.length > 0 && <ProjectsList projects={projects} push={goToProject} />}
        {projects.length === 0 && !loading && <NoProjectsFound />}
        {loading && <LoadingComponent />}
        {projects.some((q) => !q.evaluated) ? (
          <div className="text-center mt-10 font-normal text-sm text-gray-500">
            {/* TODO: get this date correctly from admin's configuration */}
            As avaliações encerram amanhã, às 10h
          </div>
        ) : (
          <span className="text-center flex justify-center items-center mt-10 font-normal text-sm text-gray-500">
            <FcOk className="mr-2" />
            Seus projetos já foram avaliados. Ótimo trabalho!
          </span>
        )}
      </div>
      <EvaluatorLogoutComponent />
      <Footer fixed={projects.length <= 6} />
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
    if (a.evaluated === b.evaluated) {
      return 0;
    }
    return a.evaluated ? -1 : 1;
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
      onClick={() => push(project.id)}
    >
      <div className="flex flex-col items-start justify-center">
        <h3 className={`text-normal text-gray-700 ${project.evaluated ? "line-through" : ""}`}>{project.title}</h3>
        <p className={`text-xs text-gray-500 font-light ${project.evaluated ? "line-through" : ""}`}>
          {project.category}
        </p>
      </div>
      <div>
        {project.evaluated ? (
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
