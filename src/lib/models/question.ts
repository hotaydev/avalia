export interface Question {
  title: string;
  id: number;
  description: string;
  value?: number | string;
  type: "score" | "text";
}
