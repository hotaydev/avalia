export interface Question {
  title: string;
  id: number;
  description: string;
  score?: number;
  type: "score" | "text";
}
