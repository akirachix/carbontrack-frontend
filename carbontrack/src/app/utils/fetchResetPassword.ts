const baseUrl = "/api/reset-password";
export async function resetPassword(payload: { email: string; password: string }) {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Password reset failed");
    }
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

