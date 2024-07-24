import type { ProjectForEvaluator } from "./project";

export interface Evaluator {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  field?: string;
  projects: ProjectForEvaluator[];
}
