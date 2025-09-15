import React from "react";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  isDark: boolean;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, isDark, placeholder }) => (
  <div
    className={`flex items-center gap-2 rounded-md px-3 py-2 w-[320px] border ${isDark ? "bg-white border-white" : "bg-white border-[#214A5A]"}`}
    style={{ boxShadow: isDark ? "0 0 0 1px #fff" : undefined }}
  >
    <FiSearch className={`w-5 h-5 ${isDark ? "text-black" : "text-[#214A5A]"}`} />
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`flex-1 bg-transparent outline-none text-base placeholder:italic ${isDark ? "text-black" : "text-[#214A5A]"}`}
      placeholder={placeholder ?? "Search"}
    />
  </div>
);

export default SearchBar;