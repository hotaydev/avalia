import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { Evaluator } from "@/lib/models/evaluator";
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
    const evaluator: Evaluator | undefined = await new FairSpreadsheet({
      spreadsheetId: sheetId,
    }).getSingleEvaluator(evaluatorCode);

    if (!evaluator) {
      return Response.json({
        status: "error",
        message: "Não encontramos um convite para o avaliador na feira informada.",
      } as AvaliaApiResponse);
    }

    return Response.json({
      status: "success",
      message: "Got an evaluator in the fair",
      data: evaluator,
    } as AvaliaApiResponse);
  } catch (error) {
    return Response.json({
      status: "error",
      message: (error as Error).message,
    } as AvaliaApiResponse);
  }
}
