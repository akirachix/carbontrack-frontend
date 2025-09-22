const baseUrl = process.env.BASE_URL;
<<<<<<< HEAD

export async function GET(){
try {
    const responce = await fetch(`${baseUrl}/factories`)
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
=======
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
>>>>>>> 012c5b6fdbdd029277fd6666b3c569e178bf34c2
