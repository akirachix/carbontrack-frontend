"use client";
import { useState } from "react";
import { requestPasswordReset } from "../utils/fetchForgotPassword";

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await requestPasswordReset(email);
      setSuccess(data.message || "Password reset OTP sent!");
      return data;
    } catch (error) {
       setError((error as Error).message);
      
    } finally {
      setLoading(false);
    }
  };

  return { forgotPassword, loading, error, success };
}
