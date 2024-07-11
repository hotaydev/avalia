import { ProjectForAdmin } from "@/lib/models/project";

const mockData: ProjectForAdmin[] = [
  {
    id: 1,
    title: "Renewable Energy Sources",
    description: "Exploring various sources of renewable energy and their impact on the environment.",
    category: "Environmental Science",
    field: "Energy",
    evaluatorsNumber: 3
  },
  {
    id: 2,
    title: "AI in Healthcare",
    description: "Implementing artificial intelligence to improve diagnostic accuracy in healthcare.",
    category: "Computer Science",
    field: "Artificial Intelligence",
    evaluatorsNumber: 4
  },
  {
    id: 3,
    title: "Water Purification Techniques",
    description: "Analyzing different methods for purifying water and their effectiveness.",
    category: "Chemistry",
    field: "Environmental Chemistry",
    evaluatorsNumber: 2
  },
  {
    id: 4,
    title: "Quantum Computing",
    description: "A study on the principles of quantum computing and its potential applications.",
    category: "Physics",
    field: "Quantum Mechanics",
    evaluatorsNumber: 5
  },
  {
    id: 5,
    title: "Biodiversity Conservation",
    description: "Strategies for conserving biodiversity in tropical rainforests.",
    category: "Biology",
    field: "Ecology",
    evaluatorsNumber: 3
  },
  {
    id: 6,
    title: "Nanotechnology in Medicine",
    description: "Using nanotechnology for targeted drug delivery systems.",
    category: "Engineering",
    field: "Biomedical Engineering",
    evaluatorsNumber: 4
  },
  {
    id: 7,
    title: "Smart Home Automation",
    description: "Developing a smart home automation system using IoT devices.",
    category: "Computer Science",
    field: "Internet of Things",
    evaluatorsNumber: 2
  },
  {
    id: 8,
    title: "Climate Change Impact",
    description: "Assessing the impact of climate change on coastal regions.",
    category: "Environmental Science",
    field: "Climate Science",
    evaluatorsNumber: 3
  },
  {
    id: 9,
    title: "Renewable Materials",
    description: "Creating sustainable materials from renewable resources.",
    category: "Chemistry",
    field: "Materials Science",
    evaluatorsNumber: 4
  },
  {
    id: 10,
    title: "Robotics in Agriculture",
    description: "Designing robots to assist in agricultural tasks to improve efficiency.",
    category: "Engineering",
    field: "Robotics",
    evaluatorsNumber: 5
  },
  {
    id: 11,
    title: "Genetic Engineering",
    description: "Exploring the potential and ethics of genetic engineering in humans.",
    category: "Biology",
    field: "Genetics",
    evaluatorsNumber: 3
  },
  {
    id: 12,
    title: "Space Exploration",
    description: "The future of human space exploration and potential colonization of other planets.",
    category: "Physics",
    field: "Astrophysics",
    evaluatorsNumber: 4
  },
];

export async function GET() {
  return Response.json(mockData);
}