import { mockedProjectsForEvaluator } from "@/lib/mock/projects";

export async function GET() {
  return Response.json(mockedProjectsForEvaluator[0]);
}
