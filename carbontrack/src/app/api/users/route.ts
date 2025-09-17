const baseUrl = process.env.BASE_URL;
export async function PUT(request: Request) {
    const body = await request.json();
    const { firstName, lastName, age } = body;

     if (!firstName || !lastName || !age ) {
      return new Response(
        'Missing required values: firstName, lastName, age, password, user_type',
        { status: 400 }
      );
    }

       const userId = body.userId;
       
    if (!userId) {
      return new Response('User ID is required', { status: 400 });
    }

      const password = body.password;
      const user_type = body.user_type;
  
    try {
     const response = await fetch(`${baseUrl}/users/${userId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        age,
        password,
        user_type,
      }),
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      statusText: 'User updated successfully',
    });
  } catch (error) {
    return new Response(error instanceof Error ? error.message : String(error), {
      status: 500,
    });
  }
}
