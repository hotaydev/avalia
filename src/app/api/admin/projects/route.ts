import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { ProjectForAdmin } from "@/lib/models/project";
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
    const projects: ProjectForAdmin[] = await new FairSpreadsheet({
      spreadsheetId: sheetId,
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

export async function POST(request: Request) {
  const { sheetId, projectName, projectDescription, projectCategory, projectArea } = await request.json();

  if (!(sheetId && projectName && projectCategory)) {
    return Response.json({
      status: "error",
      message: "Parâmetros necessários não foram passados.",
    } as AvaliaApiResponse);
  }

  try {
    const createdId: string = await new FairSpreadsheet({ spreadsheetId: sheetId }).createProject({
      projectName,
      projectDescription,
      projectCategory,
      projectArea,
    });

    return Response.json({
      status: "success",
      message: "Projeto criado",
      data: createdId,
    } as AvaliaApiResponse);
  } catch (error) {
    return Response.json({
      status: "error",
      message: (error as Error).message,
    } as AvaliaApiResponse);
  }
}
