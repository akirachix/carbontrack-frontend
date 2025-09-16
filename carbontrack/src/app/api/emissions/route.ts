const baseUrl = process.env.BASE_URL;

export async function GET(){
try {
    const responce = await fetch(`${baseUrl}/emissions/`)
    const result = await responce.json();

    return new Response(JSON.stringify(result), {
        status: 200
    })
    
} catch (error) {
    return new Response((error as Error).message, {
        status: 500
    });
}
}
