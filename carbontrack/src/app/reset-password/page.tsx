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
        <div
          className="max-w-xl w-1/2 bg-[#E7E7E7] rounded-2xl p-14 flex flex-col items-center md:w-100"
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
