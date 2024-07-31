import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import AvaliaSpreadsheet from "@/lib/services/avaliaSpreadsheets";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fairId = searchParams.get("fairId");
  const initDate = searchParams.get("initDate");
  const endDate = searchParams.get("endDate");
  const initTime = searchParams.get("initTime");
  const endTime = searchParams.get("endTime");

  if (!(initDate && endDate && fairId)) {
    return Response.json({
      status: "error",
      message: "Os parâmetros devem ser passados",
    } as AvaliaApiResponse);
  }

  try {
    const linkSaved = await new AvaliaSpreadsheet().saveFairDates(fairId, { initDate, endDate, initTime, endTime });

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
