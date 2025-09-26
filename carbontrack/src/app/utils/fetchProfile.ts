type ProfileUpdatePayload = {
  email: string;
  first_name: string;
  last_name: string;
  password?: string;
  role: string;
};

export async function fetchProfile() {
  if (typeof window === "undefined") {
    throw new Error("fetchProfile can only run in the browser");
  }
  const token = localStorage.getItem("accessToken");
  const userString = localStorage.getItem("user");
  let userId: string | null = null;

  if (userString) {
    try {
      const userObj = JSON.parse(userString);
      userId = userObj.id ? String(userObj.id) : null;
    } catch (error) {
      throw new Error("Failed to parse user from localStorage: " + (error as Error).message);
    }
  }

  if (!token) {
    throw new Error("No token found in localStorage.");
  }
  if (!userId) {
    throw new Error("No user ID found in localStorage.");
  }

  try {
    const response = await fetch(`/api/profile?userId=${userId}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch profile");
    }
    return await response.json(); 
  } catch (error) {
    throw new Error((error as Error).message || "Network or parsing error");
  }
}

export async function updateUser(data: FormData | ProfileUpdatePayload) {
  if (typeof window === "undefined") {
    throw new Error("updateUser can only run in the browser");
  }
  const token = localStorage.getItem("accessToken");
  const userString = localStorage.getItem("user");
  let userId: string | null = null;

  if (userString) {
    try {
      const userObj = JSON.parse(userString);
      userId = userObj.id ? String(userObj.id) : null;
    } catch {
      
    }
  }

  if (!token) {
    throw new Error("No token found in localStorage. Please set it.");
  }
  if (!userId) {
    throw new Error("No user ID found in localStorage. Please set it.");
  }

  try {
    let body;
    const headers: Record<string, string> = {
      Authorization: `Token ${token}`,
    };
    if (data instanceof FormData) {
      body = data;
    } else {
      body = JSON.stringify(data);
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`/api/profile?userId=${userId}`, {
      method: "PATCH",
      headers,
      body,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update profile");
    }
    return await response.json(); 
  } catch (error) {
    throw new Error((error as Error).message || "Network or parsing error");
  }
}
