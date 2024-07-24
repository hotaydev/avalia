import { mockedProjectsForEvaluator } from "@/lib/mock/projects";

// biome-ignore lint/suspicious/useAwait: Needs to be async
export async function GET() {
  return Response.json(mockedProjectsForEvaluator);
}
