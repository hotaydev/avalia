import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { ProjectForAdmin } from "@/lib/models/project";
import type { ScienceFair } from "@/lib/models/scienceFair";
import AvaliaSpreadsheet from "@/lib/services/avaliaSpreadsheets";
import FairSpreadsheet from "@/lib/services/fairSpreadsheets";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fairId = searchParams.get("fairId");

  if (!fairId) {
    return Response.json({
      status: "error",
      message: "Impossível retornar a feira sem especificar o ID da feira.",
    } as AvaliaApiResponse);
  }

  try {
    const fairInfo: ScienceFair = await new AvaliaSpreadsheet().getFairFromUserOrId(null, fairId);
    const projects: ProjectForAdmin[] = await new FairSpreadsheet({
      spreadsheetId: fairInfo.spreadsheetId,
    }).getProjects();

    return Response.json({
      status: "success",
      message: "Got fair projects",
      data: projects,
    } as AvaliaApiResponse);
  } catch (error) {
    return Response.json({
      status: "error",
      message: (error as Error).message,
    } as AvaliaApiResponse);
  }
}
