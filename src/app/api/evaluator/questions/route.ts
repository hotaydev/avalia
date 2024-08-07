import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { Evaluation } from "@/lib/models/evaluation";
import type { Question } from "@/lib/models/question";
import FairSpreadsheet from "@/lib/services/fairSpreadsheets";

const defaultQuestions: Question[] = [
  {
    title: "METODOLOGIA",
    id: 1,
    description:
      "Foram apresentados justificativa, problema de pesquisa, objetivo, metodologia, resultados e conclusão?",
    value: undefined,
    type: "score",
  },
  {
    title: "DOCUMENTOS",
    id: 2,
    description:
      "Relatório de Pesquisa, Caderno de Campo e Pasta de Documentos (quando houver). Apresentou clareza e redação adequada? Os textos expressaram adequadamente o trabalho desenvolvido, em linguagem apropriada, considerando a faixa etária da turma e estava coerente com a pesquisa apresentada pelo grupo? O grupo apresentou Caderno de Campo e/ou outros registros, como Pasta de Documentos, gráficos, que evidenciam a coleta de dados sistemática ao longo da execução da pesquisa?",
    value: undefined,
    type: "score",
  },
  {
    title: "APRESENTAÇÃO VISUAL",
    id: 3,
    description:
      "O espaço destinado a apresentação encontra-se organizado e limpo? O conteúdo do banner está adequado à pesquisa, apresentando clareza no texto, criatividade e exemplificando as atividades e materiais mencionados ao longo da pesquisa?",
    value: undefined,
    type: "score",
  },
  {
    title: "APRESENTAÇÃO ORAL",
    id: 4,
    description:
      "O grupo demonstrou domínio, sequência lógica, capacidade de síntese e clareza do conteúdo trabalhado? Demonstrou autonomia, desenvoltura, disposição para defesa do trabalho e respondeu aos questionamentos com a participação de todos os integrantes? Houve relação entre a apresentação oral e os documentos da pesquisa?",
    value: undefined,
    type: "score",
  },
  {
    title: "RELEVÂNCIA",
    id: 5,
    description:
      "A pesquisa representou uma contribuição para a comunidade e aquisição de conhecimentos significativos para os pesquisadores?",
    value: undefined,
    type: "score",
  },
  {
    title: "CONSIDERAÇÕES FINAIS",
    id: 6,
    description: "(opcional) Suas considerações extras sobre o projeto.",
    value: undefined,
    type: "text",
  },
];

// biome-ignore lint/suspicious/useAwait: Needs to be async
export async function GET() {
  return Response.json({
    status: "success",
    message: "Perguntas do projeto obtidas com sucesso.",
    data: defaultQuestions,
  } as AvaliaApiResponse);
}

export async function POST(request: Request) {
  const { sheetId, evaluator, questions, project } = await request.json();

  if (!(sheetId && evaluator && questions && project)) {
    return Response.json({
      status: "error",
      message: "Parâmetros necessários não foram passados.",
    } as AvaliaApiResponse);
  }

  try {
    const evaluated: Evaluation = await new FairSpreadsheet({ spreadsheetId: sheetId }).createEvaluatorAnswer({
      evaluator,
      project,
      questions,
    });

    return Response.json({
      status: "success",
      message: "Avaliação salva com sucesso!",
      data: evaluated,
    } as AvaliaApiResponse);
  } catch (error) {
    return Response.json({
      status: "error",
      message: (error as Error).message,
    } as AvaliaApiResponse);
  }
}
