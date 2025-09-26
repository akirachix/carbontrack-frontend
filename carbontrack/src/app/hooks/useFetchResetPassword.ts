"use client"
import { useState } from "react";
import { resetPassword } from "../utils/fetchResetPassword";

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleResetPassword = async (payload: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await resetPassword(payload);
      setSuccess(data.message);
      setLoading(false);
      return data;
    } catch (error) {
      setError((error as Error).message);    
      setLoading(false);  
    }
  };

  return { handleResetPassword, loading, error, success };
}
