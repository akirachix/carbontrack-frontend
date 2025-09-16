const baseUrl = process.env.BASE_URL;

export async function GET(){
try {
    const responce = await fetch(`${baseUrl}/compliance`)
    const result = await responce.json();

    return new Response(JSON.stringify(result), {
        status: 200
    })
    
} catch (error) {
    return new Response((error as Error).message, {
        status: 500
    });
}
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {compliance_target, factory} = body
    
    const response = await fetch(`${baseUrl}/compliance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({compliance_target, factory}),
    });
    if (!response.ok) {
      throw new Error("Failed to create compliance");
    }
    const result = await response.json();
    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}










