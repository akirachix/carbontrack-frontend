"use client";
import { useState } from "react";
import { verifyOtp } from "../utils/fetchVerifyOTP";

interface ErrorResponse {
  non_field_errors?: string[];
  [key: string]: string[] | undefined;
}

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
    } catch (err) {
      let errorMessage = "Something went wrong";
      if (typeof err === "object" && err !== null && "message" in err) {
        const message = (err as { message: string }).message;
        try {
          const errorData: ErrorResponse = JSON.parse(message);
          errorMessage =
            errorData.non_field_errors?.[0] ||
            Object.values(errorData)[0]?.[0] ||
            "Validation failed";
        } catch {
          errorMessage = message || errorMessage;
        }
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { handleVerifyOtp, loading, error, success };
}
