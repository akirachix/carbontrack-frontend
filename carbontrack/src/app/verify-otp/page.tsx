"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useVerifyOtp } from "../hooks/useFetchVerifyOTP";
import { useResendOtp } from "../hooks/useFetchResendOTP";
import Image from "next/image";
import { motion } from "framer-motion";
import Button from "../sharedComponents/Button";
import { useRouter } from "next/navigation";

function VerifyCodeClient({ email }: { email: string }) {
  const { handleVerifyOtp, loading, error, success } = useVerifyOtp();
  const { resendOtp, loading: resendLoading, error: resendError, success: resendSuccess } = useResendOtp();
  const router = useRouter();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(600);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    }
  }, [success, email, router]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
    if (!value && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleResend = async () => {
    setOtp(["", "", "", ""]);
    setTimer(600);
    if (email) {
      await resendOtp(email);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleVerifyOtp({ email, otp: otp.join("") });
    } catch {}
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <>
      {resendSuccess && (
        <div className="w-full text-green-600 text-center mb-4 font-medium">{resendSuccess}</div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="flex space-x-5 mb-6">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={inputRefs[idx]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-12 h-12 text-center text-2xl border-2 border-[#234052] rounded-md bg-transparent text-[#234052] font-medium"
              required
            />
          ))}
        </div>
        <div className="text-[#234052] text-lg mb-4">{formatTimer(timer)}</div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}
        {resendError && <p className="text-red-500 text-sm">{resendError}</p>}
        <div className="mb-7 text-[#234052] text-lg">
          Didn’t receive the code?{" "}
          <button
            type="button"
            className="text-[#F7A77B] font-semibold hover:underline disabled:opacity-60"
            onClick={handleResend}
            disabled={resendLoading || !email}
          >
            Resend
          </button>
        </div>
        <Button type="submit" buttonText={loading ? "Verifying..." : "Verify"} variant="secondary" />
      </form>
    </>
  );
}

export default function VerifyCodePage({ searchParams }: { searchParams: URLSearchParams }) {
  const email = searchParams.get("email") || "";

  return (
    <div className="h-screen w-screen flex">
      <div className="flex flex-col items-center justify-center flex-1 bg-[#E7E7E7]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/images/logo.png"
            alt="carbon-track logo"
            width={0}
            height={0}
            sizes="100vw"
            className="w-100 h-100 mx-auto object-contain 2xl:w-[400px] 2xl:h-[400px]"
          />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="text-5xl md:text-3xl lg:text-4xl font-black text-[#2A4759] 2xl:text-[60px]"
        >
          Carbon Track
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          className="text-base md:text-lg lg:text-xl 2xl:text-[35px] 2xl:py-2 font-semibold text-[#F79B72]"
        >
          Welcome Back
        </motion.p>
      </div>
      <div className="flex-1 flex items-center justify-center bg-[#234052]">
        <div
          className="max-w-2xl w-1/2 bg-[#E7E7E7] rounded-2xl p-12"
          style={{ boxShadow: "0 2px 10px 0 #f79b72" }}
        >
          <h2 className="text-4xl font-bold mb-4 text-[#F7A77B] text-center">Forgot Password?</h2>
          <div className="text-[#234052] text-[22px] text-center mb-6 font-medium">Enter your verification code</div>
          <Suspense fallback={<div>Loading...</div>}>
            <VerifyCodeClient email={email} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
