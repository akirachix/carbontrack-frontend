"use client";
import { useState } from "react";
import { verifyOtp } from "../utils/fetchVerifyOTP";

export function useVerifyOtp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleVerifyOtp = async (payload: { email: string; otp: string }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await verifyOtp(payload);
      setSuccess("OTP verified successfully!");
    } catch (error) {
      let errorMessage = "Something went wrong";
      try {
        const errorData: { [key: string]: any } = JSON.parse((error as Error).message);
        errorMessage =
          errorData.non_field_errors?.[0] || Object.values(errorData)[0]?.[0] || "Validation failed";
      } catch {
        errorMessage = (error as Error).message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { handleVerifyOtp, loading, error, success };
}
