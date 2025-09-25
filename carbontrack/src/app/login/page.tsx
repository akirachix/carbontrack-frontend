"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import Image from "next/image";
import Button from "../sharedComponents/Button";
import { useLogin } from "../hooks/useFetchLogin";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
   const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    const user = await login(email, password);
    if (user) {
      setSuccessMessage("Signup successful! Redirecting to dashboard...");
    if (!user) return; 
    router.push(user.user_type === "factory" ? "/factory-dashboard" : "/ktda-dashboard");
  };
}
  return (
    <div className="flex h-screen w-screen bg-[#D9D9D9]">
      <div className="flex flex-col items-center flex-1 bg-gray-200 text-center 2xl:p-10 2xl:pt-40">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
          <Image src="/images/logo.png" alt="carbon-track logo" width={0} height={0} sizes="100vw" className="w-100 h-100 mx-auto object-contain 2xl:w-[400px] 2xl:h-[400px]" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: "easeOut" }} className="text-5xl md:text-3xl lg:text-4xl font-black text-[#2A4759] 2xl:text-[60px]">
          Carbon Track
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1, ease: "easeOut" }} className="text-base md:text-lg lg:text-xl 2xl:text-[35px] 2xl:py-2 font-semibold text-[#F79B72]">
        Welcome Back
        </motion.p>
      </div>
      <div className="flex-1 flex items-center justify-center bg-[#234052]">
        <div className="max-w-2xl w-1/2 bg-[#E7E7E7] rounded-2xl p-12" style={{ boxShadow: "0 2px 10px 0 #f79b72" }}>
          <h2 className="text-4xl font-bold mb-8 text-[#F7A77B] text-center">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#2A4759] text-[20px] font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eg, mark@gmail.com"
                className="w-full p-3 border border-[#234052] bg-transparent rounded-md text-[#234052]"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-[#2A4759] text-[20px] font-medium mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="eg, 0@HGY4"
                className="w-full p-3 border border-[#234052] bg-transparent rounded-md text-[#234052]"
                required
              />
              <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute top-14 right-3 -translate-y-1/2 text-[#2A4759]">
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>
            <div className="flex justify-end">
              <a href="/forgot-password" className="text-[#234052] font-medium hover:underline text-[20px]">Forgot Password?</a>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {successMessage && (
              <p className="text-green-600 text-sm text-center">{successMessage}</p>
            )}

            <Button type="submit" variant="secondary" buttonText={loading ? "Logging in..." : "Sign In"} />
            <p className="text-[#2A4759] text-[20px] text-center mt-2">
              Don’t have an account?
              <a href="/get-started" className="ml-1 text-[#F7A77B] font-semibold hover:underline">Sign Up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}