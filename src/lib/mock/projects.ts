import type { Evaluator } from "../models/evaluator";
import type { ProjectForAdmin, ProjectForEvaluator } from "../models/project";
import { evaluatorsMock } from "./evaluators";

function getRandomEvaluators(): Evaluator[] {
  return [
    evaluatorsMock[Math.floor(Math.random() * evaluatorsMock.length)],
    evaluatorsMock[Math.floor(Math.random() * evaluatorsMock.length)],
    evaluatorsMock[Math.floor(Math.random() * evaluatorsMock.length)],
  ];
}

export const mockedProjects: ProjectForAdmin[] = [
  {
    id: "abt3",
    title: "Fontes de Energia Renovável",
    description: "Explorando várias fontes de energia renovável e seu impacto no meio ambiente.",
    category: "Fundamental Anos Iniciais",
    field: "Energia",
    evaluators: getRandomEvaluators(),
    score: 4.9,
  },
  {
    id: "a2tr",
    title: "IA na Saúde",
    description: "Implementando inteligência artificial para melhorar a precisão diagnóstica na saúde.",
    category: "Ensino Médio",
    field: "Inteligência Artificial",
    evaluators: getRandomEvaluators(),
    score: 4.2,
  },
  {
    id: "vb43",
    title: "Técnicas de Purificação de Água",
    description: "Analisando diferentes métodos de purificação de água e sua eficácia.",
    category: "Fundamental Anos Finais",
    field: "Química Ambiental",
    evaluators: getRandomEvaluators(),
    score: 3.6,
  },
  {
    id: "ut5b",
    title: "Computação Quântica",
    description: "Um estudo sobre os princípios da computação quântica e suas potenciais aplicações.",
    category: "Ensino Médio",
    field: "Mecânica Quântica",
    evaluators: getRandomEvaluators(),
    score: 2.9,
  },
  {
    id: "kl4d",
    title: "Conservação da Biodiversidade",
    description: "Estratégias para conservar a biodiversidade em florestas tropicais.",
    category: "Fundamental Anos Iniciais",
    field: "Ecologia",
    evaluators: getRandomEvaluators(),
    score: 2.9,
  },
  {
    id: "aab7",
    title: "Nanotecnologia na Medicina",
    description: "Usando nanotecnologia para sistemas de entrega de medicamentos direcionados.",
    category: "Ensino Médio",
    field: "Engenharia Biomédica",
    evaluators: getRandomEvaluators(),
    score: 4.1,
  },
  {
    id: "pp67",
    title: "Automação de Casas Inteligentes",
    description: "Desenvolvendo um sistema de automação residencial inteligente usando dispositivos IoT.",
    category: "Fundamental Anos Finais",
    field: "Internet das Coisas",
    evaluators: getRandomEvaluators(),
    score: 3,
  },
  {
    id: "pqr1",
    title: "Impacto das Mudanças Climáticas",
    description: "Avaliando o impacto das mudanças climáticas em regiões costeiras.",
    category: "Fundamental Anos Iniciais",
    field: "Ciência do Clima",
    evaluators: getRandomEvaluators(),
    score: 2.7,
  },
  {
    id: "akrt",
    title: "Materiais Renováveis",
    description: "Criando materiais sustentáveis a partir de recursos renováveis.",
    category: "Ensino Médio",
    field: "Ciência dos Materiais",
    evaluators: getRandomEvaluators(),
    score: 2.1,
  },
  {
    id: "athl",
    title: "Robótica na Agricultura",
    description: "Projetando robôs para auxiliar em tarefas agrícolas para melhorar a eficiência.",
    category: "Fundamental Anos Finais",
    field: "Robótica",
    evaluators: getRandomEvaluators(),
    score: 3.4,
  },
  {
    id: "309f",
    title: "Engenharia Genética",
    description: "Explorando o potencial e a ética da engenharia genética em humanos.",
    category: "Ensino Médio",
    field: "Genética",
    evaluators: getRandomEvaluators(),
    score: 3.7,
  },
  {
    id: "ahr6",
    title: "Exploração Espacial",
    description: "O futuro da exploração espacial humana e a potencial colonização de outros planetas.",
    category: "Fundamental Anos Iniciais",
    field: "Astrofísica",
    evaluators: getRandomEvaluators(),
    score: 4.3,
  },
];

export const mockedProjectsForEvaluator: ProjectForEvaluator[] = [
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
