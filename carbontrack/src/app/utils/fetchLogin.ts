const baseUrl = "/api/login";
interface User {
  factory: number | null;
  user_type: string;
}
interface LoginSuccessResponse {
  access: string;
  user: User;
}
interface LoginErrorResponse {
  message: string;

}
export async function fetchLogin(credentials: { email: string; password: string }) {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = (data as LoginErrorResponse).message || "Invalid email or password";
      throw new Error(errorMessage);
    }
    onUserSignIn(data.user);

    return data as LoginSuccessResponse; 
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

function onUserSignIn(user: User) {
  const factoryId = user.factory != null ? user.factory.toString() : "";
  localStorage.setItem("factory", factoryId);
  localStorage.setItem("user", JSON.stringify(user));
}