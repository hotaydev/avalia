import { ProjectForEvaluator } from "@/lib/models/project";

const mockData: ProjectForEvaluator =
{
  title: "Projeto exemplo 1",
  evaluated: false,
  category: "Categoria exemplo",
  id: 1,
};

export async function GET() {
  return Response.json(mockData);
}