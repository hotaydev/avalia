export async function POST(request: Request) {
  const { error, errorInfo } = await request.json();
  console.error(error, errorInfo);

  return Response.json({ reported: true });
}
