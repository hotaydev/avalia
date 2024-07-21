export interface Project {
  title: string;
  description?: string;
  category?: string;
  id: string;
}

export interface ProjectForEvaluator extends Project {
  evaluated: boolean;
}

export interface ProjectForAdmin extends Project {
  field?: string;
  score?: number;
  evaluatorsNumber: number;
}
