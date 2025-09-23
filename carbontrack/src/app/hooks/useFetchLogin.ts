"use client";
import { useState } from "react";
import { fetchLogin } from "../utils/fetchLogin";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLogin({ email, password });
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("user", JSON.stringify(data.user));
      setLoading(false);
      return data.user;
    } catch (error) {
      const message = (error as Error).message;
      setError(message);
      setLoading(false);
      return null;
    }
  };
  return { login, loading, error };
}
