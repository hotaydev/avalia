import type { ProjectForEvaluator } from "@/lib/models/project";

const mockData: ProjectForEvaluator[] = [
  {
    title: "Projeto exemplo 1",
    evaluated: false,
    category: "Categoria exemplo",
    id: "abt3",
  },
  {
    title: "Projeto exemplo 2",
    evaluated: false,
    category: "Categoria exemplo",
    id: "a2tr",
  },
  {
    title: "Projeto exemplo 3",
    evaluated: false,
    category: "Categoria exemplo",
    id: "vb43",
  },
  {
    title: "Projeto exemplo 4",
    evaluated: false,
    category: "Categoria exemplo",
    id: "ut5b",
  },
];

export async function GET() {
  return Response.json(mockData);
}
