"use client";
import { useState } from "react";
import { useForgotPassword } from "../hooks/useFetchForgotPassword";
import Image from "next/image";
import { motion } from "framer-motion";
import Button from "../sharedComponents/Button";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const { forgotPassword, loading, error, success } = useForgotPassword();
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const data = await forgotPassword(email);

    if(data && !error) {
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      }, 2000);
    }
  } catch {
  }
};

  return (
    <div className="h-screen w-screen flex ">
      <div className="flex flex-col items-center justify-center flex-1 bg-[#e7e7e7]">
                    <div className="flex flex-col items-center flex-1 bg-gray-200 text-center 2xl:p-10 2xl:pt-40">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
                      <Image src="/images/logo.png" alt="carbon-track logo" width={0} height={0} sizes="100vw" className="w-100 h-100 mx-auto object-contain 2xl:w-[400px] 2xl:h-[400px]" />
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}  className="text-5xl md:text-3xl lg:text-4xl font-black text-[#2A4759] 2xl:text-[60px]">Carbon Track</motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1, ease: "easeOut" }}  className="text-base md:text-lg lg:text-xl 2xl:text-[35px] 2xl:py-2 font-semibold text-[#F79B72]">Welcome Back</motion.p>
                  </div>
      </div>
     <div className="flex-1 flex items-center justify-center bg-[#234052]">
        <div className="max-w-2xl w-1/2 bg-[#E7E7E7] rounded-2xl p-12  " style={{ boxShadow: "0 2px 10px 0 #f79b72" }}>
          <h2 className="text-4xl font-bold mb-8 text-[#F7A77B] text-center">Forgot Password?</h2>
          <div className="mb-6 font-medium text-[#2A4759] text-[20px] text-center">Enter your email address below</div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#2A4759] font-medium text-[20px] mb-1">Email</label>
              <input type="email"  placeholder="eg,0@HGY4" value={email}  onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-[#234052] bg-transparent rounded-md text-[#234052] placeholder:text-[#b2b2b2] font-medium " required />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <Button type="submit" buttonText={loading ? "Sending..." : "Send"}  variant="secondary"  />
          </form>
        </div>
      </div>
    </div>
  );
}