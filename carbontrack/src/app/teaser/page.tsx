'use client';
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Teaser() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/get-started");
    }, 4000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="2xl:pt-20 w-screen  flex flex-col justify-center items-center bg-gray-100 h-screen ">
      <div>
        <Image
          src={"/images/Ellipse 11.png"}
          alt="side shape"
          width={0}
          height={0}
          sizes="100vw"
          className="absolute top-0 left-0 w-[40%] h-auto md:w-[30%] lg:w-[25%] xl:w-[15%] 2xl:w-[13.35%] 2xl:h-[100%] object-contain"
        />
      </div>
      <div className="flex flex-col text-center items-center space-y-3 2xl:space-y-6 pt-20 md:pt-24 lg:pt-28 2xl:pt-30 px-5 md:px-10">
        <div className="flex justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} >
            <Image
              src="/images/logo.png"
              alt="Carbon Track Logo"
              width={0}
              height={0}
              sizes="100vw"
              className="w-36 h-36 md:w-40 md:h-40 lg:w-48 lg:h-48 2xl:w-100 2xl:h-85 object-contain"
            />
          </motion.div>
        </div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-[#2A4759] 2xl:text-[60px]"
        >
          Carbon Track
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          className="text-base md:text-lg lg:text-xl 2xl:text-4xl py-5 font-semibold text-[#F79B72] max-w-4xl px-4 md:px-0 "
        >
          Track And Measure Your Carbon Emissions With Us
        </motion.p> </div>
    </main>
  );
}
export default Teaser;