import type { Category } from "../models/category";
import type { ProjectForAdmin } from "../models/project";

const exampleProjects: ProjectForAdmin[] = [
  {
    id: "abt3",
    title: "Fontes de Energia Renovável",
    description: "Explorando várias fontes de energia renovável e seu impacto no meio ambiente.",
    category: "Fundamental Anos Iniciais",
    field: "Energia",
    evaluatorsNumber: 3,
    score: 4.5,
  },
  {
    id: "a2tr",
    title: "IA na Saúde",
    description: "Implementando inteligência artificial para melhorar a precisão diagnóstica na saúde.",
    category: "Ensino Médio",
    field: "Inteligência Artificial",
    evaluatorsNumber: 4,
    score: 3,
  },
  {
    id: "vb43",
    title: "Técnicas de Purificação de Água",
    description: "Analisando diferentes métodos de purificação de água e sua eficácia.",
    category: "Fundamental Anos Finais",
    field: "Química Ambiental",
    evaluatorsNumber: 2,
    score: 4.9,
  },
  {
    id: "ut5b",
    title: "Computação Quântica",
    description: "Um estudo sobre os princípios da computação quântica e suas potenciais aplicações.",
    category: "Ensino Médio",
    field: "Mecânica Quântica",
    evaluatorsNumber: 5,
    score: 4.9,
  },
  {
    id: "kl4d",
    title: "Conservação da Biodiversidade",
    description: "Estratégias para conservar a biodiversidade em florestas tropicais.",
    category: "Fundamental Anos Iniciais",
    field: "Ecologia",
    evaluatorsNumber: 3,
    score: 4.7,
  },
  {
    id: "aab7",
    title: "Nanotecnologia na Medicina",
    description: "Usando nanotecnologia para sistemas de entrega de medicamentos direcionados.",
    category: "Ensino Médio",
    field: "Engenharia Biomédica",
    evaluatorsNumber: 4,
    score: 4.8,
  },
  {
    id: "pp67",
    title: "Automação de Casas Inteligentes",
    description: "Desenvolvendo um sistema de automação residencial inteligente usando dispositivos IoT.",
    category: "Fundamental Anos Finais",
    field: "Internet das Coisas",
    evaluatorsNumber: 2,
    score: 3.1,
  },
];

export const rankingMock: Category[] = [
  {
    title: "Fundamental Anos iniciais",
    projects: exampleProjects,
  },
  {
    title: "Fundamental Anos finais",
    projects: exampleProjects,
  },
  {
    title: "Ensino Médio",
    projects: exampleProjects,
  },
];
