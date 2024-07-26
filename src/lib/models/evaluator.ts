import type { ProjectForEvaluator } from "./project";

export interface Evaluator {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  field?: string;
  projects: ProjectForEvaluator[];
}
