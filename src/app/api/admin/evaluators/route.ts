import type { Evaluator } from "@/lib/models/evaluator";

const mockData: Evaluator[] = [
  {
    id: 1,
    name: "Dra. Alice Johnson",
    email: "alice.johnson@exemplo.com",
    phone: "555-1234",
    field: "Física",
    projects: 5,
  },
  {
    id: 2,
    name: "Prof. Bob Smith",
    email: "bob.smith@exemplo.com",
    phone: "555-5678",
    field: "Química",
    projects: 3,
  },
  {
    id: 3,
    name: "Dra. Carol White",
    field: "Biologia",
    projects: 4,
  },
  {
    id: 4,
    name: "Dr. David Brown",
    email: "david.brown@exemplo.com",
    projects: 2,
  },
  {
    id: 5,
    name: "Profa. Emily Green",
    phone: "555-8765",
    field: "Matemática",
    projects: 1,
  },
  {
    id: 6,
    name: "Dr. Frank Black",
    email: "frank.black@exemplo.com",
    phone: "555-4321",
    projects: 0,
  },
  {
    id: 7,
    name: "Dra. Grace Lee",
    email: "grace.lee@exemplo.com",
    phone: "555-9988",
    field: "Ciência da Computação",
    projects: 6,
  },
  {
    id: 8,
    name: "Prof. Henry Wilson",
    phone: "555-7766",
    field: "Engenharia",
    projects: 2,
  },
  {
    id: 9,
    name: "Dra. Isabella Martinez",
    email: "isabella.martinez@exemplo.com",
    field: "Ciências Ambientais",
    projects: 3,
  },
  {
    id: 10,
    name: "Prof. Jack Davis",
    phone: "555-3344",
    field: "Geologia",
    projects: 4,
  },
  {
    id: 11,
    name: "Dra. Karen Rodriguez",
    email: "karen.rodriguez@exemplo.com",
    projects: 5,
  },
  {
    id: 12,
    name: "Prof. Liam Harris",
    email: "liam.harris@exemplo.com",
    phone: "555-4455",
    field: "Astronomia",
    projects: 0,
  },
];

export async function GET() {
  return Response.json(mockData);
}
