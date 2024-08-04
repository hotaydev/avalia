import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import FairSpreadsheet from "@/lib/services/fairSpreadsheets";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sheetId = searchParams.get("sheetId");
  const evaluatorCode = searchParams.get("code");

  if (!(sheetId && evaluatorCode)) {
    return Response.json({
      status: "error",
      message: "Impossível retornar a feira sem especificar o ID da feira.",
    } as AvaliaApiResponse);
  }

  try {
    const evaluatorExist: boolean = await new FairSpreadsheet({
      spreadsheetId: sheetId,
    }).checkIfEvaluatorExists(evaluatorCode);

    return Response.json({
      status: "success",
      message: "Got an evaluator in the fair",
      data: evaluatorExist,
    } as AvaliaApiResponse);
  } catch (error) {
    return Response.json({
      status: "error",
      message: (error as Error).message,
    } as AvaliaApiResponse);
  }
}
