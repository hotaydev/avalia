import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import AvaliaSpreadsheet from "@/lib/services/avaliaSpreadsheets";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fairId = searchParams.get("fairId");
  const user = searchParams.get("user");

  if (!(fairId && user)) {
    return Response.json({
      status: "error",
      message: "Não foi possível obter dados de usuários pois faltam informações da feira.",
    } as AvaliaApiResponse);
  }

  try {
    const fairUsers = await new AvaliaSpreadsheet().getFairUsers(fairId, user);

    return Response.json({
      status: "success",
      message: "Got fair users from the same fair",
      data: fairUsers,
    } as AvaliaApiResponse);
  } catch (error) {
    return Response.json({
      status: "error",
      message: (error as Error).message,
    } as AvaliaApiResponse);
  }
}
