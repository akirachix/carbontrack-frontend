const baseUrl = process.env.BASE_URL;
export async function GET() {
    try {
        const response = await fetch(`${baseUrl}/factories/`);
        const result = await response.json();
        return new Response(JSON.stringify(result), {
            status: 200
        });
    } catch (error) {
        return new Response((error as Error).message, {
            status: 500,
        });
    }
}