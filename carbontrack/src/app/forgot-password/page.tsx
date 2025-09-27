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
        <div className="flex h-screen w-screen flex-col lg:flex-row bg-[#D9D9D9]">
             <div className="flex flex-col items-center justify-center p-6 bg-gray-200 text-center lg:w-1/2">
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                 className="mb-6"
               >
                 <Image
                   src="/images/logo.png"
                   alt="carbon-track logo"
                   width={200}
                   height={200}
                   className="mx-auto object-contain w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 xl:w-90"
                 />
               </motion.div>
               <motion.h1
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2A4759] xl:text-5xl"
               >
                 Carbon Track
               </motion.h1>
               <motion.p
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                 className="text-sm sm:text-base md:text-lg font-semibold text-[#F79B72] mt-2 px-4 xl:text-2xl"
               >
                 Welcome back
               </motion.p>
             </div>
     <div className="flex-1 flex items-center justify-center bg-[#234052]">
        <div className="max-w-2xl w-1/2 bg-[#E7E7E7] rounded-2xl p-12 xl:w-120 md:w-100 " style={{ boxShadow: "0 2px 10px 0 #f79b72" }}>
          <h2 className="text-4xl font-bold mb-8 text-[#F7A77B] text-center">Forgot Password?</h2>
          <div className="mb-6 font-medium text-[#2A4759] text-[20px] text-center">Enter your email address below</div>
          <form onSubmit={handleSubmit} className="space-y-5 xl:space-y-10">
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