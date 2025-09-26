
const base_Url=process.env.BASE_URL;


export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${base_Url}/verify-otp/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Verify OTP route error:", error);

    return new Response(
      JSON.stringify((error as Error).message || "Internal server error"),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}