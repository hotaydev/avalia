import { evaluatorsMock } from "@/lib/mock/evaluators";

// biome-ignore lint/suspicious/useAwait: Needs to be async
export async function GET() {
  return Response.json(evaluatorsMock);
}
