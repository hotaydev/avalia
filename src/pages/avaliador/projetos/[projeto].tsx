import ArrowBack from "@/components/ArrowBack/ArrowBack";
import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import { Project } from "@/lib/models/projects";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProjetosAvaliador() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const projeto = router.query.projeto;
      fetch("/api/avaliador/projects/" + projeto)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted) setProject(data);
          if (isMounted) setLoading(false);
        });
    })();
    return () => {
      isMounted = false;
    };
  }, [router.query.projeto]);

  return (
    <main className="z-10 flex flex-col items-center relative px-6 pt-20 pb-10 sm:pb-10 md:pb-14 lg:pb-20">
      <HeaderTitle />
      <div className="bg-white shadow-md rounded-lg px-4 pt-12 pb-6 mb-12 max-w-lg w-full text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Avaliação do projeto
        </h2>
        <h3 className="font-normal text-gray-500 mb-10">
          {project && project?.title ? (
            project?.title
          ) : loading ? (
            <span className="rounded-lg bg-gray-100 text-gray-100">
              ------------------------------
            </span>
          ) : (
            "Projeto não encontrado"
          )}
        </h3>
      </div>
      <Footer />
      <ArrowBack />
    </main>
  );
}
