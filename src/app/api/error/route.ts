export async function POST(request: Request) {
  const { error, errorInfo } = await request.json();
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.error(error, errorInfo);

  return Response.json({ reported: true });
}
