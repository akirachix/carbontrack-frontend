import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isDark: boolean;
}
const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange, isDark }) => {
  const [edit, setEdit] = useState(false);
  const [draftValue, setDraftValue] = useState(page);
  const handleEdit = () => {
    setEdit(true);
    setDraftValue(page);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setDraftValue(Number(value));
  };
  const handleSubmit = () => {
    if (draftValue >= 1 && draftValue <= totalPages) {
      onPageChange(draftValue);
    }
    setEdit(false);
  };
  const handleBlur = () => {
    handleSubmit();
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") setEdit(false);
  };
  return (
    <div className="flex items-center justify-center 2xl:mt-7 2xl:gap-6 xl:mt-7 xl:gap-6 lg:mt-5 lg:gap-2">
      <button
        className={`rounded-full p-2 ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => page > 1 && onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous"
        style={{ background: isDark ? "#214A5A" : "#F4F6FA", color: isDark ? "#fff" : "#214A5A" }}
      >
        <FiChevronLeft size={22} />
      </button>
      <span className={`text-lg ${isDark ? "text-white" : "text-[#214A5A]"} font-medium`}>
        Page{" "}
        {edit ? (
          <input
            type="number"
            value={draftValue}
            min={1}
            max={totalPages}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`mx-1 w-10 bg-transparent border-b-2 outline-none text-center ${isDark ? "border-[#F79B72] text-white" : "border-[#214A5A] text-[#214A5A]"}`}
            autoFocus
          />
        ) : (
          <span
            className={`mx-1 border-b-2 cursor-pointer ${isDark ? "border-[#F79B72] text-white" : "border-[#214A5A] text-[#214A5A]"}`}
            onClick={handleEdit}
            tabIndex={0}
          >
            {page}
          </span>
        )}
        {" "}of {totalPages}
      </span>
      <button
        className={`rounded-full p-2 ${page === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => page < totalPages && onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next"
        style={{ background: isDark ? "#214A5A" : "#F4F6FA", color: isDark ? "#fff" : "#214A5A" }}
      >
        <FiChevronRight size={22} />
      </button>
    </div>
  );
};
export default Pagination;