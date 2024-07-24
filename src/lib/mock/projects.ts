import type { ProjectForAdmin, ProjectForEvaluator } from "../models/project";

export const mockedProjects: ProjectForAdmin[] = [
  {
    id: "abt3",
    title: "Fontes de Energia Renovável",
    description: "Explorando várias fontes de energia renovável e seu impacto no meio ambiente.",
    category: "Fundamental Anos Iniciais",
    field: "Energia",
    evaluatorsNumber: 3,
  },
  {
    id: "a2tr",
    title: "IA na Saúde",
    description: "Implementando inteligência artificial para melhorar a precisão diagnóstica na saúde.",
    category: "Ensino Médio",
    field: "Inteligência Artificial",
    evaluatorsNumber: 4,
  },
  {
    id: "vb43",
    title: "Técnicas de Purificação de Água",
    description: "Analisando diferentes métodos de purificação de água e sua eficácia.",
    category: "Fundamental Anos Finais",
    field: "Química Ambiental",
    evaluatorsNumber: 2,
  },
  {
    id: "ut5b",
    title: "Computação Quântica",
    description: "Um estudo sobre os princípios da computação quântica e suas potenciais aplicações.",
    category: "Ensino Médio",
    field: "Mecânica Quântica",
    evaluatorsNumber: 5,
  },
  {
    id: "kl4d",
    title: "Conservação da Biodiversidade",
    description: "Estratégias para conservar a biodiversidade em florestas tropicais.",
    category: "Fundamental Anos Iniciais",
    field: "Ecologia",
    evaluatorsNumber: 3,
  },
  {
    id: "aab7",
    title: "Nanotecnologia na Medicina",
    description: "Usando nanotecnologia para sistemas de entrega de medicamentos direcionados.",
    category: "Ensino Médio",
    field: "Engenharia Biomédica",
    evaluatorsNumber: 4,
  },
  {
    id: "pp67",
    title: "Automação de Casas Inteligentes",
    description: "Desenvolvendo um sistema de automação residencial inteligente usando dispositivos IoT.",
    category: "Fundamental Anos Finais",
    field: "Internet das Coisas",
    evaluatorsNumber: 2,
  },
  {
    id: "pqr1",
    title: "Impacto das Mudanças Climáticas",
    description: "Avaliando o impacto das mudanças climáticas em regiões costeiras.",
    category: "Fundamental Anos Iniciais",
    field: "Ciência do Clima",
    evaluatorsNumber: 3,
  },
  {
    id: "akrt",
    title: "Materiais Renováveis",
    description: "Criando materiais sustentáveis a partir de recursos renováveis.",
    category: "Ensino Médio",
    field: "Ciência dos Materiais",
    evaluatorsNumber: 4,
  },
  {
    id: "athl",
    title: "Robótica na Agricultura",
    description: "Projetando robôs para auxiliar em tarefas agrícolas para melhorar a eficiência.",
    category: "Fundamental Anos Finais",
    field: "Robótica",
    evaluatorsNumber: 5,
  },
  {
    id: "309f",
    title: "Engenharia Genética",
    description: "Explorando o potencial e a ética da engenharia genética em humanos.",
    category: "Ensino Médio",
    field: "Genética",
    evaluatorsNumber: 3,
  },
  {
    id: "ahr6",
    title: "Exploração Espacial",
    description: "O futuro da exploração espacial humana e a potencial colonização de outros planetas.",
    category: "Fundamental Anos Iniciais",
    field: "Astrofísica",
    evaluatorsNumber: 4,
  },
];

export const mockedProjectsForEvaluator: ProjectForEvaluator[] = [
  {
    title: "Projeto exemplo 1",
    evaluated: false,
    category: "Categoria exemplo",
    id: "abt3",
  },
  {
    title: "Projeto exemplo 2",
    evaluated: false,
    category: "Categoria exemplo",
    id: "a2tr",
  },
  {
    title: "Projeto exemplo 3",
    evaluated: false,
    category: "Categoria exemplo",
    id: "vb43",
  },
  {
    title: "Projeto exemplo 4",
    evaluated: false,
    category: "Categoria exemplo",
    id: "ut5b",
  },
];