import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar } from "react-icons/fi";

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  isDark: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ selected, onChange, isDark }) => (
  <div className="flex items-center">
    <FiCalendar className={`mr-2 ${isDark ? "text-[#F79B72]" : "text-[#214A5A]"}`} size={20} />
    <label className={`mr-2 ${isDark ? "text-gray-300" : "text-[#214A5A]"}`}>Select date:</label>
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      dateFormat="yyyy/MM/dd"
      placeholderText="Choose a date"
      maxDate={new Date()}
      isClearable
      className={`p-2 rounded-md border ${isDark ? "bg-[#214A5A] border-[#F79B72] text-white" : "bg-[#FBE5DB] border-[#214A5A] text-[#214A5A]"}`}
      calendarClassName={isDark ? "bg-[#214A5A] text-white" : "bg-white text-[#214A5A]"}
    />
  </div>
);

export default DatePicker;