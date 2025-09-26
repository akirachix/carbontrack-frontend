"use client";
import React from "react";
interface RecordType {
  energy_type: string;
  energy_amount: string;
  tea_processed_amount: string;
  created_at: string;
  co2_equivalent: string;
  factory?: number;
}
interface RecordsTableProperties {
  records: RecordType[];
  emptyMessage?: string;
}
const RecordsTable = ({ records, emptyMessage = "No records found." }: RecordsTableProperties) => {
  return (
    <div className="overflow-x-auto">
      <table className="2xl:min-w-full xl:min-w-full lg:w-[65vw] bg-[#183040] border border-gray-700 border-collapse">
        <thead>
          <tr className="bg-[#2A4759] text-white">
            <th className="2xl:p-3 xl:p-2 lg:p-1.5 border border-gray-700 w-1/8 text-left text-[16px] xl:text-[15px] lg:text-[11px]">Energy Type</th>
            <th className="2xl:p-3 xl:p-2 lg:p-1.5 border border-gray-700 w-1/8 text-left text-[16px] xl:text-[15px] lg:text-[11px]">Energy Amount</th>
            <th className="2xl:p-3 xl:p-2 lg:p-1.5 border border-gray-700 w-1/8 text-left text-[16px] xl:text-[15px] lg:text-[11px]">Tea Processed</th>
            <th className="2xl:p-3 xl:p-2 lg:p-1.5 border border-gray-700 w-1/8 text-left text-[16px] xl:text-[15px] lg:text-[11px]">Created At</th>
            <th className="2xl:p-3 xl:p-2 lg:p-1.5 border border-gray-700 w-1/8 text-left text-[16px] xl:text-[15px] lg:text-[11px]">CO2 Equivalent</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={5} className="p>-4 text-white text-center">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            records.map((item, index) => (
              <tr key={index} className={`border border-gray-700 ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"} 2xl:text-[16px] xl:text-[14px] lg:text-[10px]`}>
                <td className="2xl:p-3 xl:p-2 lg:p-2 font-semibold border border-gray-700 text-white">
                  {item.energy_type.charAt(0).toUpperCase() + item.energy_type.slice(1).toLowerCase()}
                </td>
                <td className="2xl:p-3 xl:p-2 lg:p-1.5 border border-gray-700 text-white">{item.energy_amount}</td>
                <td className="2xl:p-3 xl:p-2 lg:p-1.5 border border-gray-700 text-white">{item.tea_processed_amount}</td>
                <td className="2xl:p-3 xl:p-2 lg:p-1.5 border border-gray-700 text-white">
                  {new Date(item.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                </td>
                <td className="2xl:p-3 xl:p-2 lg:p-1.5 border border-gray-700 text-white">{item.co2_equivalent}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
export default RecordsTable;