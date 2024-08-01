import type { ProjectForAdmin } from "./project";

export interface Category {
  title: string;
  projects: ProjectForAdmin[];
}
