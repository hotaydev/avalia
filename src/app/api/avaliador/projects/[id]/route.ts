interface Project {
  title: string;
  evaluated: boolean;
  category: string;
  id: number;
}

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