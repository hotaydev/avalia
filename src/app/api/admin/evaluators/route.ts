import { evaluatorsMock } from "@/lib/mock/evaluators";

export async function GET() {
  return Response.json(evaluatorsMock);
}
