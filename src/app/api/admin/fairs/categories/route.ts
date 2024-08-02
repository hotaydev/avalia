import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import FairSpreadsheet from "@/lib/services/fairSpreadsheets";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sheetId = searchParams.get("sheetId");

  if (!sheetId) {
    return Response.json({
      status: "error",
      message: "Os parâmetros devem ser passados",
    } as AvaliaApiResponse);
  }

  try {
    const categories: string[] = await new FairSpreadsheet({ spreadsheetId: sheetId }).getCategories();

    return Response.json({
      status: "success",
      message: "Categorias Obtidas",
      data: categories,
    } as AvaliaApiResponse);
  } catch (error) {
    return Response.json({
      status: "error",
      message: (error as Error).message,
    } as AvaliaApiResponse);
  }
}
