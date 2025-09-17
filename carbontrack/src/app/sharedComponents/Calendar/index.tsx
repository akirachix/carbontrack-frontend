import React, { useState } from "react";
import { FiCalendar } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CalendarProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

const Calendar = ({ selectedDate, setSelectedDate }: CalendarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleIconClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex items-center mb-6 relative">
      <FiCalendar
        size={20}
        className="mr-2 text-gray-400 cursor-pointer"
        onClick={handleIconClick}
      />
      <DatePicker
        selected={selectedDate ?? new Date()} 
        onChange={(date: Date | null) => {
          setSelectedDate(date);
          setIsOpen(false); 
        }}
        dateFormat="yyyy/MM/dd"
        placeholderText="Choose a date"
        maxDate={new Date()}
        isClearable
        open={isOpen}
        onClickOutside={() => setIsOpen(false)}
        className="p-2 rounded-md bg-white border border-gray-600 text-gray-800"
        popperPlacement="bottom-start"
        showPopperArrow={false}
      />
    </div>
  );
};

export default Calendar;
