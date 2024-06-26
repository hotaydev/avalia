import { Project } from "@/lib/models/projects";

const mockData: Project =
{
  title: "Projeto exemplo 1",
  evaluated: false,
  category: "Categoria exemplo",
  id: 1,
};

export async function GET() {
  return Response.json(mockData);
}