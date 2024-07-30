import { mockedScienceFairs } from "@/lib/mock/scienceFair";

/**
 * Get a fair by it's ID
 */
// biome-ignore lint/suspicious/useAwait: Needs to be async
export async function GET() {
  return Response.json(mockedScienceFairs);
}

/**
 * Create a new fair entry
 */
// biome-ignore lint/suspicious/useAwait: Needs to be async
export async function POST() {
  return Response.json({});
}
