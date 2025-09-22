import React, { useState } from "react";
import { FiCalendar } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


interface CalendarProperties {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}
const Calendar = ({ selectedDate, setSelectedDate }: CalendarProperties) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const CustomInput = ({ value, onClick }: { value?: string; onClick?: () => void }) => (
    <div
      onClick={onClick}
      className="bg-transparent text-gray-400 cursor-pointer border-none outline-none w-[120px]">
      {value || "Choose a date"}
    </div>
  );
  return (
    <div className="flex items-center mb-6 relative">
      <FiCalendar
        size={20}
        className="mr-2 text-gray-400 cursor-pointer"
        onClick={handleClick}
      />
      <DatePicker
        selected={selectedDate ?? new Date()}
        onChange={(date: Date | null) => {
          setSelectedDate(date);
          setIsOpen(false);
        }}
        dateFormat="yyyy/MM/dd"
        maxDate={new Date()}
        customInput={<CustomInput />}
        open={isOpen}
        onClickOutside={() => {
          setIsOpen(false);
        }}
        onCalendarOpen={() => {
          setIsOpen(true);
        }}
        onCalendarClose={() => {
          setIsOpen(false);
        }}
       
      />
    </div>
  );
};
export default Calendar;