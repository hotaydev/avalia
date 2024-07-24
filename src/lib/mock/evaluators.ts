import type { Evaluator } from "../models/evaluator";
import type { ProjectForEvaluator } from "../models/project";

const mockedProjectsForEvaluator: ProjectForEvaluator[] = [
  {
    title: "Fontes de Energia Renovável",
    evaluated: false,
    category: "Fundamental Anos Iniciais",
    id: "abt3",
  },
  {
    title: "IA na Saúde",
    evaluated: false,
    category: "Ensino Médio",
    id: "a2tr",
  },
  {
    title: "Técnicas de Purificação de Água",
    evaluated: false,
    category: "Fundamental Anos Finais",
    id: "vb43",
  },
  {
    title: "Computação Quântica",
    evaluated: false,
    category: "Ensino Médio",
    id: "ut5b",
  },
];

export const evaluatorsMock: Evaluator[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@exemplo.com",
    phone: "555-1234",
    field: "Física",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@exemplo.com",
    phone: "555-5678",
    field: "Química",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: 3,
    name: "Carol White",
    field: "Biologia",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: 4,
    name: "David Brown",
    email: "david.brown@exemplo.com",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: 5,
    name: "Profa. Emily Green",
    phone: "555-8765",
    field: "Matemática",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: 6,
    name: "Frank Black",
    email: "frank.black@exemplo.com",
    phone: "555-4321",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: 7,
    name: "Grace Lee",
    email: "grace.lee@exemplo.com",
    phone: "555-9988",
    field: "Ciência da Computação",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: 8,
    name: "Henry Wilson",
    phone: "555-7766",
    field: "Engenharia",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: 9,
    name: "Isabella Martinez",
    email: "isabella.martinez@exemplo.com",
    field: "Ciências Ambientais",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: 10,
    name: "Jack Davis",
    phone: "555-3344",
    field: "Geologia",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: 11,
    name: "Karen Rodriguez",
    email: "karen.rodriguez@exemplo.com",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: 12,
    name: "Liam Harris",
    email: "liam.harris@exemplo.com",
    phone: "555-4455",
    field: "Astronomia",
    projects: mockedProjectsForEvaluator,
  },
];
