import type { ProjectForAdmin } from "@/lib/models/project";

const mockData: ProjectForAdmin[] = [
  {
    id: 1,
    title: "Fontes de Energia Renovável",
    description: "Explorando várias fontes de energia renovável e seu impacto no meio ambiente.",
    category: "Ciências Ambientais",
    field: "Energia",
    evaluatorsNumber: 3,
  },
  {
    id: 2,
    title: "IA na Saúde",
    description: "Implementando inteligência artificial para melhorar a precisão diagnóstica na saúde.",
    category: "Ciência da Computação",
    field: "Inteligência Artificial",
    evaluatorsNumber: 4,
  },
  {
    id: 3,
    title: "Técnicas de Purificação de Água",
    description: "Analisando diferentes métodos de purificação de água e sua eficácia.",
    category: "Química",
    field: "Química Ambiental",
    evaluatorsNumber: 2,
  },
  {
    id: 4,
    title: "Computação Quântica",
    description: "Um estudo sobre os princípios da computação quântica e suas potenciais aplicações.",
    category: "Física",
    field: "Mecânica Quântica",
    evaluatorsNumber: 5,
  },
  {
    id: 5,
    title: "Conservação da Biodiversidade",
    description: "Estratégias para conservar a biodiversidade em florestas tropicais.",
    category: "Biologia",
    field: "Ecologia",
    evaluatorsNumber: 3,
  },
  {
    id: 6,
    title: "Nanotecnologia na Medicina",
    description: "Usando nanotecnologia para sistemas de entrega de medicamentos direcionados.",
    category: "Engenharia",
    field: "Engenharia Biomédica",
    evaluatorsNumber: 4,
  },
  {
    id: 7,
    title: "Automação de Casas Inteligentes",
    description: "Desenvolvendo um sistema de automação residencial inteligente usando dispositivos IoT.",
    category: "Ciência da Computação",
    field: "Internet das Coisas",
    evaluatorsNumber: 2,
  },
  {
    id: 8,
    title: "Impacto das Mudanças Climáticas",
    description: "Avaliando o impacto das mudanças climáticas em regiões costeiras.",
    category: "Ciências Ambientais",
    field: "Ciência do Clima",
    evaluatorsNumber: 3,
  },
  {
    id: 9,
    title: "Materiais Renováveis",
    description: "Criando materiais sustentáveis a partir de recursos renováveis.",
    category: "Química",
    field: "Ciência dos Materiais",
    evaluatorsNumber: 4,
  },
  {
    id: 10,
    title: "Robótica na Agricultura",
    description: "Projetando robôs para auxiliar em tarefas agrícolas para melhorar a eficiência.",
    category: "Engenharia",
    field: "Robótica",
    evaluatorsNumber: 5,
  },
  {
    id: 11,
    title: "Engenharia Genética",
    description: "Explorando o potencial e a ética da engenharia genética em humanos.",
    category: "Biologia",
    field: "Genética",
    evaluatorsNumber: 3,
  },
  {
    id: 12,
    title: "Exploração Espacial",
    description: "O futuro da exploração espacial humana e a potencial colonização de outros planetas.",
    category: "Física",
    field: "Astrofísica",
    evaluatorsNumber: 4,
  },
];

export async function GET() {
  return Response.json(mockData);
}
