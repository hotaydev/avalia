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
    id: "art4",
    name: "Alice Johnson",
    email: "alice.johnson@exemplo.com",
    phone: "555-1234",
    field: "Física",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: "abo9",
    name: "Bob Smith",
    email: "bob.smith@exemplo.com",
    phone: "555-5678",
    field: "Química",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: "2dj5",
    name: "Carol White",
    field: "Biologia",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: "a20f",
    name: "David Brown",
    email: "david.brown@exemplo.com",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: "5fks",
    name: "Profa. Emily Green",
    phone: "555-8765",
    field: "Matemática",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: "s93k",
    name: "Frank Black",
    email: "frank.black@exemplo.com",
    phone: "555-4321",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: "0jsn",
    name: "Grace Lee",
    email: "grace.lee@exemplo.com",
    phone: "555-9988",
    field: "Ciência da Computação",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: "1wnj",
    name: "Henry Wilson",
    phone: "555-7766",
    field: "Engenharia",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: "iads",
    name: "Isabella Martinez",
    email: "isabella.martinez@exemplo.com",
    field: "Ciências Ambientais",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: "8asd",
    name: "Jack Davis",
    phone: "555-3344",
    field: "Geologia",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: "9sd2",
    name: "Karen Rodriguez",
    email: "karen.rodriguez@exemplo.com",
    projects: mockedProjectsForEvaluator,
  },
  {
    id: "s5hd",
    name: "Liam Harris",
    email: "liam.harris@exemplo.com",
    phone: "555-4455",
    field: "Astronomia",
    projects: mockedProjectsForEvaluator,
  },
];
