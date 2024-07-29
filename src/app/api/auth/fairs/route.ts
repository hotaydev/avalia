import { mockedScienceFairs } from "@/lib/mock/scienceFair";

// biome-ignore lint/suspicious/useAwait: Needs to be async
export async function GET() {
  return Response.json(mockedScienceFairs);
}
