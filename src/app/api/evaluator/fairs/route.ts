import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { ScienceFair } from "@/lib/models/scienceFair";
import AvaliaSpreadsheet from "@/lib/services/avaliaSpreadsheets";

export async function GET() {
  try {
    const fairs: ScienceFair[] = await new AvaliaSpreadsheet().getAllFairs();

    return Response.json({
      status: "success",
      message: "Got all Science Fairs",
      data: fairs,
    } as AvaliaApiResponse);
  } catch (error) {
    return Response.json({
      status: "error",
      message: (error as Error).message,
    } as AvaliaApiResponse);
  }
}
