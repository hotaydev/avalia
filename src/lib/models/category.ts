import type { ProjectForAdmin } from "./project";

// TODO: usar uma média para as notas dos projetos
export interface Category {
  title: string;
  projects: ProjectForAdmin[];
}
