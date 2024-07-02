import { Evaluator } from "@/lib/models/evaluator";

const mockData: Evaluator[] = [
  {
    id: 1,
    name: "Avaliador Exemplo 1",
    email: "avaliador@exemplo.com",
    phone: "+55 (00) 9xxxx-xxxx",
    field: "Ciências Tecnológicas",
  },
  {
    id: 2,
    name: "Avaliador Exemplo 2",
    email: "avaliador@exemplo.com",
    phone: "+55 (00) 9xxxx-xxxx",
    field: "Ciências Tecnológicas",
  },
  {
    id: 3,
    name: "Avaliador Exemplo 3",
    email: "avaliador@exemplo.com",
    phone: "+55 (00) 9xxxx-xxxx",
    field: "Ciências Tecnológicas",
  },
  {
    id: 4,
    name: "Avaliador Exemplo 4",
    email: "avaliador@exemplo.com",
    phone: "+55 (00) 9xxxx-xxxx",
    field: "Ciências Tecnológicas",
  },
];

export async function GET() {
  return Response.json(mockData);
}