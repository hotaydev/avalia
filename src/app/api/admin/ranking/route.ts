import { rankingMock } from "@/lib/mock/ranking";

export async function GET() {
  return Response.json(rankingMock);
}
