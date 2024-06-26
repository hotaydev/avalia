interface Project {
  title: string;
  evaluated: boolean;
  category: string;
  id: number;
}

const mockData: Project[] = [
  {
    title: "Projeto exemplo 1",
    evaluated: false,
    category: "Categoria exemplo",
    id: 1,
  },
  {
    title: "Projeto exemplo 2",
    evaluated: false,
    category: "Categoria exemplo",
    id: 2,
  },
  {
    title: "Projeto exemplo 3",
    evaluated: false,
    category: "Categoria exemplo",
    id: 3,
  },
  {
    title: "Projeto exemplo 4",
    evaluated: false,
    category: "Categoria exemplo",
    id: 4,
  },
];

export async function GET() {
  return Response.json(mockData);
}