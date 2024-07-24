import { mockedProjects } from "@/lib/mock/projects";

export async function GET() {
  return Response.json(mockedProjects);
}
