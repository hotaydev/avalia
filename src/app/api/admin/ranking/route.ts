import { rankingMock } from "@/lib/mock/ranking";

// biome-ignore lint/suspicious/useAwait: Needs to be async
export async function GET() {
  return Response.json(rankingMock);
}
