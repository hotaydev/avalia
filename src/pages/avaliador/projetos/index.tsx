// import ArrowBack from "@/components/ArrowBack/ArrowBack";
import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import { FcOk } from "react-icons/fc";

interface Project {
  title: string;
  evaluated: boolean;
  category: string;
}

export default function ProjetosAvaliador() {
  const projects: Project[] = [
    {
      title: "Projeto exemplo 1",
      evaluated: false,
      category: "Categoria exemplo",
    },
    {
      title: "Projeto exemplo 2",
      evaluated: true,
      category: "Categoria exemplo",
    },
    {
      title: "Projeto exemplo 3",
      evaluated: false,
      category: "Categoria exemplo",
    },
    {
      title: "Projeto exemplo 4",
      evaluated: true,
      category: "Categoria exemplo",
    },
  ];

  return (
    <main className="z-10 flex flex-col items-center relative px-6 pt-20 pb-10 sm:pb-10 md:pb-14 lg:pb-20">
      <HeaderTitle />
      <div className="bg-white shadow-md rounded-lg px-4 pt-12 pb-6 mb-12 max-w-lg w-full text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-10">
          Seus projetos para avaliação:
        </h2>
        {projects.length > 0 ? (
          <ProjectsList projects={projects} />
        ) : (
          <NoProjectsFound />
        )}
      </div>
      <Footer />
      {/* <ArrowBack /> */}
    </main>
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

function ProjectsList({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-col justify-center items-center px-4">
      {projects.map(({ title, category, evaluated }, index) => (
        <ProjectListItem
          key={index}
          title={title}
          category={category}
          evaluated={evaluated}
        />
      ))}
    </div>
  );
}

function ProjectListItem({ title, category, evaluated }: Project) {
  return (
    <div className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer rounded-lg w-full justify-between mb-2">
      <div className="flex flex-col items-start justify-center">
        <h3 className="text-normal">{title}</h3>
        <p className="text-xs text-gray-600 font-light">{category}</p>
      </div>
      <div>
        <FcOk size={32} />
        {/* <span className="bg-gray-300 rounded-full px-5 py-3 border-2 border-gray-400">
          x
        </span> */}
      </div>
    </div>
  );
}
