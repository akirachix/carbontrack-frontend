const baseUrl = "/api/forgot-password";

export async function requestPasswordReset(email: string) {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send reset otp");
    }
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
