import React, { useEffect } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";

const SuccessToast = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed top-6 left-1/2 z-50 flex items-center justify-center w-auto" style={{ transform: "translateX(-50%)" }}>
      <div className="bg-white rounded-lg shadow-lg px-6 py-4 flex items-center gap-3 min-w-[320px] max-w-md border-2 border-[#214A5A] relative pointer-events-auto">
        <AiOutlineCheckCircle className="text-[#214A5A]" size={32} />
        <span className="text-[#214A5A] text-lg">{message}</span>
        <button onClick={onClose} className="ml-auto text-gray-400 hover:text-[#214A5A] text-2xl font-bold transition-colors">&times;</button>
        <div className="absolute bottom-0 left-0 h-1 bg-[#214A5A] w-full animate-success-bar"></div>
      </div>
      <style>{`
        @keyframes success-bar {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-success-bar {
          animation: success-bar 2.3s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default SuccessToast;