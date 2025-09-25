"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { useResetPassword } from "../hooks/useFetchResetPassword";
import Image from "next/image";
import { motion } from "framer-motion";
import Button from "../sharedComponents/Button";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const { handleResetPassword, loading, error, success } = useResetPassword();
  const [formData, setFormData] = useState({ password: "" });
  const [errors, setErrors] = useState<{ password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const getEmailFromUrl = () => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    return params.get("email") || "";
  };
  const email = getEmailFromUrl();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const validationErrors: { password?: string } = {};

    if (formData.password.length > 0 && formData.password.length < 8) {
      validationErrors.password = "Password has to be at least 8 characters";
    }
    setErrors(validationErrors);
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      return;
    }
    try {
      const result = await handleResetPassword({
        email,
        password: formData.password,
      });
      if (result) {
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch {
    }
  };

  return (
    <div className="flex min-h-screen w-screen">
      <div className="flex flex-col items-center justify-center flex-1 bg-[#E7E7E7]">
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
      </div>
      <div className="flex-1 flex items-center justify-center bg-[#234052]">
        <div
          className="max-w-xl w-1/2 bg-[#E7E7E7] rounded-2xl p-14 flex flex-col items-center"
          style={{ boxShadow: "0 1px 10px 0 #f79b72" }}
        >
          <h2 className="text-4xl font-bold mb-8 text-[#F7A77B] text-center">
            New Password
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div>
              <label className="block text-[#2A4759] text-[20px] font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="eg,0@HGY4"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md text-[#2A4759] placeholder:text-[#B2B2B2] font-medium ${
                    errors.password ? "border-red-500" : "border-[#2A4759]"
                  } bg-transparent`}
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#2A4759]"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FiEye size={22} /> : <FiEyeOff size={22} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-600 text-sm text-center">{success}</p>
            )}

            <Button
              type="submit"
              buttonText={loading ? "Resetting..." : "Submit"}
              variant="secondary"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
