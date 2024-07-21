import type { ProjectForEvaluator } from "@/lib/models/project";

const mockData: ProjectForEvaluator = {
  title: "Projeto exemplo 1",
  evaluated: false,
  category: "Categoria exemplo",
  id: "ut5b",
};

export async function GET() {
  return Response.json(mockData);
}
