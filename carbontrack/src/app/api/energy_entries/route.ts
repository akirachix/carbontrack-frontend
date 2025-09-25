const baseUrl = process.env.BASE_URL;

export async function GET() {
  try {
    const response = await fetch(`${baseUrl}/energy_entries`);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const result = await response.json();
    return new Response(JSON.stringify(result), {
       status: 200 
      });
  } catch (error) {
    return new Response((error as Error).message, { 
      status: 500
     });
  }
}



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { energy_type, energy_amount, tea_processed_amount, factory } = body;
    if (!energy_type || !energy_amount || !tea_processed_amount || !factory) {
      return new Response(
        'Missing required values: energy_type, energy_amount, tea_processed_amount, factory',
        { status: 400 }
      );
    }
    const response = await fetch(`${baseUrl}/energy_entries/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 201,
      statusText: 'Record created successfully',
    });
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}
