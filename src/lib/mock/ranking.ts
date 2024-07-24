import type { Category } from "../models/category";
import type { ProjectForAdmin } from "../models/project";
import { mockedProjects } from "./projects";

function getRandomProjects(): ProjectForAdmin[] {
  return [
    mockedProjects[Math.floor(Math.random() * mockedProjects.length)],
    mockedProjects[Math.floor(Math.random() * mockedProjects.length)],
    mockedProjects[Math.floor(Math.random() * mockedProjects.length)],
    mockedProjects[Math.floor(Math.random() * mockedProjects.length)],
    mockedProjects[Math.floor(Math.random() * mockedProjects.length)],
  ];
}

export const rankingMock: Category[] = [
  {
    title: "Fundamental Anos iniciais",
    projects: getRandomProjects(),
  },
  {
    title: "Fundamental Anos finais",
    projects: getRandomProjects(),
  },
  {
    title: "Ensino Médio",
    projects: getRandomProjects(),
  },
];
