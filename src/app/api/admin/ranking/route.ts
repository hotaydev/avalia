import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { Category } from "@/lib/models/category";
import FairSpreadsheet from "@/lib/services/fairSpreadsheets";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sheetId = searchParams.get("sheetId");

  if (!sheetId) {
    return Response.json({
      status: "error",
      message: "Impossível retornar a feira sem especificar o ID da feira.",
    } as AvaliaApiResponse);
  }

  try {
    const categories: Category[] = await new FairSpreadsheet({
      spreadsheetId: sheetId,
    }).getRanking();

    return Response.json({
      status: "success",
      message: "Got Ranking",
      data: categories,
    } as AvaliaApiResponse);
  } catch (error) {
    return Response.json({
      status: "error",
      message: (error as Error).message,
    } as AvaliaApiResponse);
  }
}
