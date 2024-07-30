import { mockedScienceFairs } from "@/lib/mock/scienceFair";
import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import AvaliaSpreadsheet from "@/lib/services/avaliaSpreadsheets";

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
export async function POST(request: Request) {
  const { fairSchool, fairName, adminEmail } = await request.json();

  const adminSpreadsheet = new AvaliaSpreadsheet();

  try {
    const fairId = await adminSpreadsheet.saveNewFair(fairName, fairSchool, adminEmail);

    return Response.json({
      status: "success",
      message: "Science Fair created with success",
      data: fairId,
    } as AvaliaApiResponse);
  } catch (error) {
    return Response.json({
      status: "error",
      message: error,
    } as AvaliaApiResponse);
  }
}
