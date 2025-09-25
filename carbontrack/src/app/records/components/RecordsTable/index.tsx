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
      <table className="min-w-full bg-[#183040] border border-gray-700 border-collapse">
        <thead>
          <tr className="bg-[#2A4759] text-white">
            <th className="p-3 border border-gray-700 w-1/8 text-left">Energy Type</th>
            <th className="p-3 border border-gray-700 w-1/8 text-left">Energy Amount</th>
            <th className="p-3 border border-gray-700 w-1/8 text-left">Tea Processed</th>
            <th className="p-3 border border-gray-700 w-1/8 text-left">Created At</th>
            <th className="p-3 border border-gray-700 w-1/8 text-left">CO2 Equivalent</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-4 text-white text-center">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            records.map((item, index) => (
              <tr key={index} className={`border border-gray-700 ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}`}>
                <td className="p-3 font-semibold border border-gray-700 text-white">
                  {item.energy_type.charAt(0).toUpperCase() + item.energy_type.slice(1).toLowerCase()}
                </td>
                <td className="p-3 border border-gray-700 text-white">{item.energy_amount}</td>
                <td className="p-3 border border-gray-700 text-white">{item.tea_processed_amount}</td>
                <td className="p-3 border border-gray-700 text-white">
                  {new Date(item.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                </td>
                <td className="p-3 border border-gray-700 text-white">{item.co2_equivalent}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecordsTable;