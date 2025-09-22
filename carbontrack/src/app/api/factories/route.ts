const baseUrl = process.env.BASE_URL;
export async function GET() {
  try {
    const response = await fetch(`${baseUrl}/factories/`);
    if (!response.ok) {
      const error = await response.json();
      return new Response(
        JSON.stringify({ message: error.message || "Failed to load factories" }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }
    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: (error as Error).message || "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
