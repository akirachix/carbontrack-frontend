const baseUrl = process.env.BASE_URL;
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; 
    const body = await request.json();
    const response = await fetch(`${baseUrl}/compliance/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: response.status,
    });
  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
    });
  }
}