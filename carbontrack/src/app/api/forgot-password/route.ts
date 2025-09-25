const BASE_URL = process.env.BASE_URL;
export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;

  if (!email) {
    return new Response(
      JSON.stringify({ message: 'Missing required value: email' }),
      { status: 400, statusText: "Bad Request", headers: { "Content-Type": "application/json" }}
    );
  }
  try {
    const response = await fetch(`${BASE_URL}/forgot-password/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if(!response.ok) {
      return new Response(JSON.stringify({ message: result.message || 'Failed to send reset OTP' }), {
        status: response.status,
        statusText: response.statusText,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(result), {
      status: response.status,
      statusText: response.statusText,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: (error as Error).message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
