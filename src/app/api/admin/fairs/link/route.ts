import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import FairSpreadsheet from "@/lib/services/fairSpreadsheets";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sheetId = searchParams.get("sheetId");
  const evaluator = searchParams.get("evaluator");
  const projects = searchParams.get("projects");

  if (!(evaluator && projects && sheetId)) {
    return Response.json({
      status: "error",
      message: "Os parâmetros devem ser passados",
    } as AvaliaApiResponse);
  }

  try {
    const resultOfOperation = await new FairSpreadsheet({ spreadsheetId: sheetId }).attributeEvaluatorAndProject(
      evaluator,
      projects,
    );

    return Response.json({
      status: "success",
      message: "Atribuição salva",
      data: resultOfOperation,
    } as AvaliaApiResponse);
  } catch (error) {
    return Response.json({
      status: "error",
      message: (error as Error).message,
    } as AvaliaApiResponse);
  }
}
