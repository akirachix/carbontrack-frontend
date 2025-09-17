const API_BASE = "https://carbon-track-680e7cff8d27.herokuapp.com/api";

export async function fetchUser(userId: string) {
  try {
    const res = await fetch(`${API_BASE}/users/${userId}/`);
    if (!res.ok) {
      throw new Error("Failed to fetch user: " + res.statusText);
    }
    return await res.json();
  } catch (error) {
    throw new Error("Failed to fetch user: " + (error as Error).message);
  }
}

export async function fetchFactory(factoryId: string) {
  try {
    const res = await fetch(`${API_BASE}/factories/${factoryId}/`);
    if (!res.ok) {
      throw new Error("Failed to fetch factory: " + res.statusText);
    }
    return await res.json();
  } catch (error) {
    throw new Error("Failed to fetch factory: " + (error as Error).message);
  }
}

export async function updateUser(userId: string, updatedData: any) {
  try {
    const res = await fetch(`${API_BASE}/users/${userId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
    if (!res.ok) {
      let errorMsg = "Failed to update user";
      try {
        const errorData = await res.json();
        if (errorData.detail) errorMsg = errorData.detail;
        else if (typeof errorData === "string") errorMsg = errorData;
        else if (errorData.errors) errorMsg = JSON.stringify(errorData.errors);
        else errorMsg = JSON.stringify(errorData);
      } catch {}
      throw new Error(errorMsg);
    }
    return await res.json();
  } catch (error) {
    throw new Error("Failed to update user: " + (error as Error).message);
  }
}
