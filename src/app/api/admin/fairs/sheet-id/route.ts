import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import AvaliaSpreadsheet from "@/lib/services/avaliaSpreadsheets";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fairId = searchParams.get("fairId");
  const sheetId = searchParams.get("sheetId");

  if (!(fairId && sheetId)) {
    return Response.json({
      status: "error",
      message: "Os parâmetros devem ser passados",
    } as AvaliaApiResponse);
  }

  try {
    const linkSaved = await new AvaliaSpreadsheet().saveFairSpreadsheetId(fairId, sheetId);

    return Response.json({
      status: "success",
      message: "Science Fair changed",
      data: linkSaved,
    } as AvaliaApiResponse);
  } catch (error) {
    return Response.json({
      status: "error",
      message: (error as Error).message,
    } as AvaliaApiResponse);
  }
}
