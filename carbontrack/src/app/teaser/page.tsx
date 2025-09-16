'use client';
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Teaser() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/getStarted"); 
    }, 4000);
    return () => clearTimeout(timer); 
  }, [router]);
  return (
    <main className="h-screen w-screen 2xl:py-10 justify-center bg-gray-100 ">
      <div>
        <Image
          src={"/images/Ellipse 11.png"}
          alt="side shape"
          width={0}
          height={0}
          sizes="100vw"
          className="absolute top-0 left-0 w-[40%] h-auto md:w-[30%] lg:w-[25%] xl:w-[15%] 2xl:w-[13.35%] 2xl:h-[100%] object-contain "
        />
      </div>
      <div className="flex flex-col text-center items-center space-y-3 2xl:space-y-3 pt-20 2xl:pt-30">
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/images/logo.png"
              alt="Carbon Track Logo"
              width={0}
              height={0}
              sizes="100vw"
              className="md:w-40 lg:h-48 lg:w-48 md:h-40 object-contain 2xl:w-90 2xl:h-100 "
            />
          </motion.div>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="text-5xl md:text-3xl lg:text-4xl font-black text-[#2A4759] 2xl:text-[50px]"
        >
          Carbon Track
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          className="text-base md:text-lg lg:text-xl 2xl:text-[40px] py-5 font-semibold text-[#F79B72]"
        >
          Track and Measure your Carbon Emissions with Us
        </motion.p>
      </div>
    </main>
  );
}
export default Teaser;

