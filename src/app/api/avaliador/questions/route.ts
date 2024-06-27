import { Question } from "@/lib/models/question";

const mockData: Question[] = [
  {
    title: "METODOLOGIA",
    id: 1,
    description:
      "Foram apresentados justificativa, problema de pesquisa, objetivo, metodologia, resultados e conclusão?",
    score: undefined,
  },
  {
    title: "DOCUMENTOS",
    id: 2,
    description:
      "Relatório de Pesquisa, Caderno de Campo e Pasta de Documentos (quando houver). Apresentou clareza e redação adequada? Os textos expressaram adequadamente o trabalho desenvolvido, em linguagem apropriada, considerando a faixa etária da turma e estava coerente com a pesquisa apresentada pelo grupo? O grupo apresentou Caderno de Campo e/ou outros registros, como Pasta de Documentos, gráficos, que evidenciam a coleta de dados sistemática ao longo da execução da pesquisa?",
    score: undefined,
  },
  {
    title: "APRESENTAÇÃO VISUAL",
    id: 3,
    description:
      "O espaço destinado a apresentação encontra-se organizado e limpo? O conteúdo do banner está adequado à pesquisa, apresentando clareza no texto, criatividade e exemplificando as atividades e materiais mencionados ao longo da pesquisa?",
    score: undefined,
  },
  {
    title: "APRESENTAÇÃO ORAL",
    id: 4,
    description:
      "O grupo demonstrou domínio, sequência lógica, capacidade de síntese e clareza do conteúdo trabalhado? Demonstrou autonomia, desenvoltura, disposição para defesa do trabalho e respondeu aos questionamentos com a participação de todos os integrantes? Houve relação entre a apresentação oral e os documentos da pesquisa?",
    score: undefined,
  },
  {
    title: "RELEVÂNCIA",
    id: 5,
    description:
      "A pesquisa representou uma contribuição para a comunidade e aquisição de conhecimentos significativos para os pesquisadores?",
    score: undefined,
  },
];

export async function GET() {
  return Response.json(mockData);
}

export async function POST(
  request: Request
) {
  return Response.json({ success: true });
}