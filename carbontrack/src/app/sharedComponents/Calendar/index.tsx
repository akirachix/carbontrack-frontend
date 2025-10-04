import React from "react";
import { FiCalendar } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CalendarProperties {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  filterType: "day" | "month" | "year";
  setFilterType: (type: "day" | "month" | "year") => void;
}

const filterOptions = [
  { value: "day", label: "Day" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

const Calendar = ({
  selectedDate,
  setSelectedDate,
  filterType,
  setFilterType,
}: CalendarProperties) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => setIsOpen(!isOpen);

  const CustomInput = ({
    value,
    onClick,
  }: { value?: string; onClick?: () => void }) => (
    <div
      onClick={onClick}
      className="bg-transparent text-gray-400 cursor-pointer border-none outline-none w-[120px]"
    >
      {value || "Choose a date"}
    </div>
  );

  let dateFormat = "yyyy/MM/dd";
  let showMonthYearPicker = false;
  let showYearPicker = false;

  if (filterType === "month") {
    dateFormat = "yyyy/MM";
    showMonthYearPicker = true;
  } else if (filterType === "year") {
    dateFormat = "yyyy";
    showYearPicker = true;
  }

  return (
    <div className="flex items-center mb-6 gap-4 relative">
      <div
        className="flex items-center 2xl:px-3 2xl:py-1 xl:px-1 xl:py-0 lg:px-1 lg:py-0 rounded"
        style={{ background: "#2A4759" }}
      >
        <select
          id="calendar-filter"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as "day" | "month" | "year")}
          className="bg-transparent text-white border-none outline-none px-2 py-1"
        >
          {filterOptions.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ color: "black", background: "white" }}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center relative">
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
          dateFormat={dateFormat}
          maxDate={new Date()}
          customInput={<CustomInput />}
          open={isOpen}
          onClickOutside={() => setIsOpen(false)}
          onCalendarOpen={() => setIsOpen(true)}
          onCalendarClose={() => setIsOpen(false)}
          showMonthYearPicker={showMonthYearPicker}
          showYearPicker={showYearPicker}
        />
      </div>
    </div>
  );
};

export default Calendar;