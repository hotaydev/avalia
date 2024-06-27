import ArrowBack from "@/components/ArrowBack/ArrowBack";
import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import LogoutComponent from "@/components/Logout/Logout";
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
          {!loading && project && <QuestionsList />}
          {loading && <QuestionsListplaceholder />}
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

function QuestionsList() {
  return (
    <div className="flex flex-col justify-center items-center px-4 mt-10">
      <SingleQuestion
        title="METODOLOGIA"
        id={1}
        description="Foram apresentados justificativa, problema de pesquisa, objetivo, metodologia, resultados e conclusão?"
      />
      <SingleQuestion
        title="DOCUMENTOS"
        id={2}
        description="Relatório de Pesquisa, Caderno de Campo e Pasta de Documentos (quando houver). Apresentou clareza e redação adequada? Os textos expressaram adequadamente o trabalho desenvolvido, em linguagem apropriada, considerando a faixa etária da turma e estava coerente com a pesquisa apresentada pelo grupo? O grupo apresentou Caderno de Campo e/ou outros registros, como Pasta de Documentos, gráficos, que evidenciam a coleta de dados sistemática ao longo da execução da pesquisa?"
      />
      <SingleQuestion
        title="APRESENTAÇÃO VISUAL"
        id={3}
        description="O espaço destinado a apresentação encontra-se organizado e limpo? O conteúdo do banner está adequado à pesquisa, apresentando clareza no texto, criatividade e exemplificando as atividades e materiais mencionados ao longo da pesquisa?"
      />
      <SingleQuestion
        title="APRESENTAÇÃO ORAL"
        id={4}
        description="O grupo demonstrou domínio, sequência lógica, capacidade de síntese e clareza do conteúdo trabalhado? Demonstrou autonomia, desenvoltura, disposição para defesa do trabalho e respondeu aos questionamentos com a participação de todos os integrantes? Houve relação entre a apresentação oral e os documentos da pesquisa?"
      />
      <SingleQuestion
        title="RELEVÂNCIA"
        id={5}
        description="A pesquisa representou uma contribuição para a comunidade e aquisição de conhecimentos significativos para os pesquisadores?"
      />
      <div className="bg-blue-500 mt-8 text-white rounded-lg px-6 py-2 flex items-center justify-between hover:bg-blue-600 transition-all cursor-pointer group">
        Enviar{" "}
        <span className="ml-2 transform group-hover:translate-x-2 transition-transform">
          &rarr;
        </span>
      </div>
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
}: {
  title: string;
  description: string;
  id: number;
}) {
  return (
    <div className="border border-gray-100 px-4 py-2 rounded-lg mb-4 w-full text-left">
      <h3 className="font-bold text-gray-700">
        {title[title.length - 1] === ":" ? title : `${title}:`}
      </h3>
      <p className="text-sm font-light">{description}</p>
      <PossibleScores questionId={id} />
    </div>
  );
}

function PossibleScores({ questionId }: { questionId: number }) {
  return (
    <div className="flex items-center justify-between px-10 mt-8 mb-2">
      <SinglePossibleScore
        score={10}
        id={`score-option-10-${questionId}`}
        questionId={questionId}
      />
      <SinglePossibleScore
        score={9}
        id={`score-option-9-${questionId}`}
        questionId={questionId}
      />
      <SinglePossibleScore
        score={8}
        id={`score-option-8-${questionId}`}
        questionId={questionId}
      />
      <SinglePossibleScore
        score={7}
        id={`score-option-7-${questionId}`}
        questionId={questionId}
      />
      <SinglePossibleScore
        score={6}
        id={`score-option-6-${questionId}`}
        questionId={questionId}
      />
      <SinglePossibleScore
        score={5}
        id={`score-option-5-${questionId}`}
        questionId={questionId}
      />
    </div>
  );
}

function SinglePossibleScore({
  score,
  id,
  questionId,
}: {
  score: number;
  id: string;
  questionId: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center mb-2">
      <input
        id={id}
        name={questionId.toString()}
        type="radio"
        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
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
