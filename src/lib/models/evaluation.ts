export interface Evaluation {
  project: string;
  evaluator: string;
  notes: {
    metodology?: number;
    documents?: number;
    visualApresentation?: number;
    oralApresentation?: number;
    relevancy?: number;
  };
  finalConsiderations?: string;
}
