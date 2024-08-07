import type { Evaluation } from "./evaluation";
import type { Evaluator } from "./evaluator";

export interface Project {
  title: string;
  description?: string;
  category?: string;
  id: string;
}

export interface ProjectForEvaluator extends Project {
  evaluation?: Evaluation;
}

export interface ProjectForAdmin extends Project {
  field?: string;
  score?: number; // This is used for the Ranking, not for the project listing
  evaluators?: Evaluator[];
  evaluations?: number;
}
