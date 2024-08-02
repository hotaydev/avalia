import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { ScienceFair } from "@/lib/models/scienceFair";
import AvaliaSpreadsheet from "@/lib/services/avaliaSpreadsheets";

/**
 * Get a fair by user email
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const fairId = searchParams.get("fairId");

  if (!(email || fairId)) {
    return Response.json({
      status: "error",
      message: "Nenhum dado de busca foi informado, não foi possível buscar informações sobre a feira.",
    } as AvaliaApiResponse);
  }

  try {
    const fairInfo: ScienceFair = await new AvaliaSpreadsheet().getFairFromUserOrId(email, fairId);

    return Response.json({
      status: "success",
      message: "Science Fair found within user",
      data: fairInfo,
    } as AvaliaApiResponse);
  } catch (error) {
    return Response.json({
      status: "error",
      message: (error as Error).message,
    } as AvaliaApiResponse);
  }
}

/**
 * Create a new fair entry
 */
export async function POST(request: Request) {
  const { fairSchool, fairName, adminEmail } = await request.json();

  try {
    const fairId = await new AvaliaSpreadsheet().saveNewFair(fairName, fairSchool, adminEmail);

    return Response.json({
      status: "success",
      message: "Science Fair created with success",
      data: fairId,
    } as AvaliaApiResponse);
  } catch (error) {
    return Response.json({
      status: "error",
      message: (error as Error).message,
    } as AvaliaApiResponse);
  }
}
