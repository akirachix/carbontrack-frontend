const baseUrl = "/api/login";
export async function fetchLogin(credentials: { email: string; password: string }) {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error (data.message || "Invalid password or email")
    }
 return data;
  } catch (error) {
    throw new Error( (error as Error).message);
  }
}



