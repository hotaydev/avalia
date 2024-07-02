import { ProjectForAdmin } from "@/lib/models/project";

const mockData: ProjectForAdmin[] = [
  {
    title: "Projeto exemplo 1",
    score: undefined,
    field: "Ciências Tecnológicas",
    category: "Categoria exemplo",
    id: 1,
  },
  {
    title: "Projeto exemplo 2",
    score: undefined,
    field: "Ciências Tecnológicas",
    category: "Categoria exemplo",
    id: 2,
  },
  {
    title: "Projeto exemplo 3",
    score: undefined,
    field: "Ciências Tecnológicas",
    category: "Categoria exemplo",
    id: 3,
  },
  {
    title: "Projeto exemplo 4",
    score: undefined,
    field: "Ciências Tecnológicas",
    category: "Categoria exemplo",
    id: 4,
  },
];

export async function GET() {
  return Response.json(mockData);
}