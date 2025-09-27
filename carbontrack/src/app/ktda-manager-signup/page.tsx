"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Button from "../sharedComponents/Button";
import { useFetchSignup } from "../hooks/useFetchSignup";
export default function SignupPage() {
  const router = useRouter();
  const { signup, loading: loadingSignup, error: signupError } = useFetchSignup();
  const defaultFormState = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
    user_type: "manager" as const,
  };
  const [formData, setFormData] = useState(defaultFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof defaultFormState, string>>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [show, setShow] = useState({
    password: false,
    confirmPassword: false,
  });
  useEffect(() => {
    if (signupError) setGeneralError(signupError);
  }, [signupError]);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
   const { name, value:originalValue  } = e.target;
   let value= originalValue
    if (name === "phone_number") {
      value = value.replace(/\D/g, "").slice(0, 15);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password" || name === "confirmPassword") {
      const updatedFormData = { ...formData, [name]: value };
      if (updatedFormData.password.length > 0 && updatedFormData.password.length < 8) {
        setErrors((prev) => ({ ...prev, password: "Password has to be at least 8 characters" }));
      } else {
        setErrors((prev) => {
          const { password, ...rest } = prev;
          return rest;
        });
      }
      if (
        updatedFormData.confirmPassword &&
        updatedFormData.confirmPassword !== updatedFormData.password
      ) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors((prev) => {
          const { confirmPassword, ...rest } = prev;
          return rest;
        });
      }
    }
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);
    setSuccessMessage(null);
    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      return;
    }
    const { confirmPassword, ...payload } = formData;
    const result = await signup(payload);
    if (result) {
      setSuccessMessage("Signup successful!");
      setFormData(defaultFormState);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
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
          Welcome to Carbon Track
        </motion.p>
      </div>
      <div className="flex items-center justify-center p-4 lg:w-1/2 bg-[#234052]">
        <div
          className="w-full max-w-md bg-[#E7E7E7] rounded-2xl p-6 shadow-lg "
          style={{ boxShadow: "0 2px 10px 0 #F79B72" }}
        >
          <h2 className="text-xl sm:text-2xl md:mb-2 font-bold mb-6 text-[#F7A77B] text-center">Sign Up</h2>
          <form onSubmit={handleSubmit} className="w-full space-y-4 md:space-y-1 md:h-[80vh] xl:space-y-4">
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <div className="flex-1">
                <label className="block text-[#2A4759] text-sm sm:text-base font-medium mb-1  xl:text-[20px]">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="eg, Mark"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full p-3 md:h-10 xl:py-6  text-sm sm:text-base border border-[#2A4759] bg-transparent rounded-md text-[#234052]"
                  required
                />
                {errors.first_name && <p className="text-red-500 text-xs sm:text-sm">{errors.first_name}</p>}
              </div>
              <div className="flex-1">
                <label className="block text-[#2A4759] text-sm sm:text-base font-medium mb-1  xl:text-[20px]">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="eg, Mathew"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full p-3 text-sm xl:py-6 sm:text-base md:h-10 border border-[#2A4759] bg-transparent rounded-md text-[#234052]"
                  required
                />
                {errors.last_name && <p className="text-red-500 text-xs sm:text-sm">{errors.last_name}</p>}
              </div>
            </div>
            <div>
              <label className="block text-[#2A4759] text-sm sm:text-base font-medium mb-1  xl:text-[20px]">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="eg, mark@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 text-sm  xl:py-6 md:h-10 sm:text-base border border-[#2A4759] bg-transparent rounded-md text-[#234052]"
                required
              />
              {errors.email && <p className="text-red-500 text-xs sm:text-sm">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-[#2A4759] text-sm sm:text-base font-medium mb-1 xl:text-[20px]">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                placeholder="eg, 0747839864"
                value={formData.phone_number}
                onChange={handleChange}
                maxLength={15}
                inputMode="numeric"
                className="w-full p-3 text-sm md:h-10 xl:py-6 sm:text-base border border-[#2A4759] bg-transparent rounded-md text-[#234052]"
                required
              />
              {errors.phone_number && <p className="text-red-500 text-xs sm:text-sm">{errors.phone_number}</p>}
            </div>
            <div className="relative">
              <label className="block text-[#2A4759] text-sm sm:text-base font-medium mb-1 xl:text-[20px]">
                Password
              </label>
              <input
                type={show.password ? "text" : "password"}
                name="password"
                placeholder="eg, 0@HGY4"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3  xl:py-6 text-sm  md:h-10 sm:text-base border border-[#2A4759] bg-transparent rounded-md text-[#234052]"
                required
              />
              <button
                type="button"
                onClick={() => setShow((prev) => ({ ...prev, password: !prev.password }))}
                className="absolute right-3 -translate-y-2 top-15 md:top-12  xl:top-15 text-[#2A4759]"
              >
                {show.password ? <FiEye /> : <FiEyeOff />}
              </button>
              {errors.password && <p className="text-red-500 text-xs sm:text-sm">{errors.password}</p>}
            </div>
            <div className="relative">
              <label className="block text-[#2A4759] text-sm sm:text-base font-medium mb-1 xl:text-[20px]">
                Confirm Password
              </label>
              <input
                type={show.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="eg, 0@HGY4"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 text-sm md:h-10 xl:py-6   sm:text-base border border-[#2A4759] bg-transparent rounded-md text-[#234052]"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShow((prev) => ({ ...prev, confirmPassword: !prev.confirmPassword }))
                }
                className="absolute right-3 -translate-y-2 top-15 md:top-12 xl:top-15 text-[#2A4759] "
              >
                {show.confirmPassword ? <FiEye /> : <FiEyeOff />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs sm:text-sm">{errors.confirmPassword}</p>
              )}
            </div>
            {generalError && <p className="text-red-500 text-xs sm:text-sm text-center">{generalError}</p>}
            {successMessage && (
              <p className="text-green-600 text-xs sm:text-sm text-center">{successMessage}</p>
            )}
            <Button
              type="submit"
              variant="secondary"
              buttonText={loadingSignup ? "Signing Up..." : "Sign Up"}
            />
            <p className="text-[#2A4759] text-sm sm:text-base text-center mt-4 xl:text-[20px] xl:mt-2">
              Already have an account?
              <a href="/login" className="ml-1 text-[#F7A77B] font-semibold hover:underline ">
                Sign In
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}