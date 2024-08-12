import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { Evaluation } from "@/lib/models/evaluation";
import type { ScienceFair } from "@/lib/models/scienceFair";
import AvaliaSpreadsheet from "@/lib/services/avaliaSpreadsheets";
import FairSpreadsheet from "@/lib/services/fairSpreadsheets";

export async function POST(request: Request) {
  const { sheetId, evaluator, questions, project } = await request.json();

  if (!(sheetId && evaluator && questions && project)) {
    return Response.json({
      status: "error",
      message: "Parâmetros necessários não foram passados.",
    } as AvaliaApiResponse);
  }

  try {
    const fairInfo: ScienceFair = await new AvaliaSpreadsheet().getFairFromSheetId(sheetId);

    const startDate = new Date(fairInfo.startDate ?? "").getTime();
    const endDate = new Date(fairInfo.endDate ?? "").getTime();
    const now = Date.now();

    if (endDate < now || startDate > now) {
      return Response.json({
        status: "error",
        message: "Não podem ser enviadas notas fora do período de avaliações da feira.",
      } as AvaliaApiResponse);
    }

    const evaluated: Evaluation = await new FairSpreadsheet({ spreadsheetId: sheetId }).createEvaluatorAnswer({
      evaluator,
      project,
      questions,
    });

    return Response.json({
      status: "success",
      message: "Avaliação salva com sucesso!",
      data: evaluated,
    } as AvaliaApiResponse);
  } catch (error) {
    return Response.json({
      status: "error",
      message: (error as Error).message,
    } as AvaliaApiResponse);
  }
}
