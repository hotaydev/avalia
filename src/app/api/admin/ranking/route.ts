import { rankingMock } from "@/lib/mock/ranking";
import type { AvaliaApiResponse } from "@/lib/models/apiResponse";

// biome-ignore lint/suspicious/useAwait: Needs to be async
export async function GET() {
  return Response.json({
    status: "success",
    message: "Got Ranking",
    data: rankingMock,
  } as AvaliaApiResponse);
}
