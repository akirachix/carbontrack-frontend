export async function fetchFactories() {
  try {
    const response = await fetch("/api/factories/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to load factories");
    }
    return await response.json();
  } catch (error) {
    throw new Error((error as Error).message || "Something went wrong");
  }
}