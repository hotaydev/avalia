import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import AvaliaSpreadsheet from "@/lib/services/avaliaSpreadsheets";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fairId = searchParams.get("fairId");
  const userEmail = searchParams.get("user");

  if (!(fairId && userEmail)) {
    return Response.json({
      status: "error",
      message: "Os parâmetros devem ser passados",
    } as AvaliaApiResponse);
  }

  try {
    const newUserSaved = await new AvaliaSpreadsheet().addNewNonAdminUser(fairId, userEmail);

    return Response.json({
      status: "success",
      message: "Usuário adicionado. Copie o link de convite e envie para ele.",
      data: newUserSaved,
    } as AvaliaApiResponse);
  } catch (error) {
    return Response.json({
      status: "error",
      message: (error as Error).message,
    } as AvaliaApiResponse);
  }
}
