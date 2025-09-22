"use client";
import { useState } from "react";
import { requestPasswordReset } from "../utils/fetchForgotPassword";

export function useResendOtp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); 

  const resendOtp = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await requestPasswordReset(email);
      setSuccess(data.message || "OTP resent successfully!");
    } catch (error) {
      setError((error as Error).message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return { resendOtp, loading, error, success };
}
