"use client";
import React, { useState, useEffect } from "react";
import FactoryLayout from "../components/FactoryLayout";
import ModalForm from "./components/Modal";
import RecordsTable from "./components/RecordsTable";
import { useFetchRecords } from "../hooks/useFetchRecords";
import { saveRecord } from "../utils/fetchRecords";
import Button from "../sharedComponents/Button";
import Pagination from "../sharedComponents/Pagination";
import Calendar from "../sharedComponents/Calendar";
import DownloadPDFButton from "../sharedComponents/DownloadPdfButton";
import type { EnergyEntryData } from "../types";

export default function RecordsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState<EnergyEntryData[]>([]);
  const [userFactoryId, setUserFactoryId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterType, setFilterType] = useState<"day" | "month" | "year">("day");

  useEffect(() => {
    const storedFactory = localStorage.getItem("factory");
    if (storedFactory) {
      setUserFactoryId(Number(storedFactory));
    }
  }, []);

  const {
    records: hookRecords,
    loading,
    error: RecordError,
    noDataForDate,
  } = useFetchRecords(userFactoryId, selectedDate, filterType);

  useEffect(() => {
    setRecords(hookRecords);
  }, [hookRecords]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedDate, filterType]);

  const filteredRecords = records.filter((record) => {
    const matchesSearch = Object.values(record).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredRecords.length / pageSize);

  const paginatedRecords = filteredRecords.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleAdd = () => setModalOpen(true);

  const getEmptyMessage = () => {
    if (!noDataForDate) return "No energy type found.";
    switch (filterType) {
      case "day":
        return "No records found on selected date.";
      case "month":
        return "No records found on selected month.";
      case "year":
        return "No records found on selected year.";
      default:
        return "No records found.";
    }
  };

  const pdfHeaders = [
    "Energy Type",
    "Energy Amount",
    "CO2 Equivalent (kg)",
    "Tea Processed (kg)",
    "Created At",
  ];
  const pdfRows = filteredRecords.map((record) => [
    record.energy_type,
    record.energy_amount,
    record.co2_equivalent,
    record.tea_processed_amount,
    record.created_at ? new Date(record.created_at).toLocaleDateString() : "",
  ]);

  let subtitle = "";
  if (filterType === "day" && selectedDate)
    subtitle = `Date: ${selectedDate.toLocaleDateString()}`;
  else if (filterType === "month" && selectedDate)
    subtitle = `Month: ${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}`;
  else if (filterType === "year" && selectedDate)
    subtitle = `Year: ${selectedDate.getFullYear()}`;

  let filename = "EnergyRecords";
  if (filterType === "day" && selectedDate) {
    filename += `_${selectedDate.toLocaleDateString()}`;
  } else if (filterType === "month" && selectedDate) {
    filename += `_${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}`;
  } else if (filterType === "year" && selectedDate) {
    filename += `_${selectedDate.getFullYear()}`;
  }

  let content;
  if (loading) {
    content = (
      <div className="flex justify-center items-center h-full">
        <span>Loading...</span>
      </div>
    );
  } else if (RecordError) {
    content = (
      <div className="flex justify-center items-center h-full">
        <span className="text-red-400">{RecordError}</span>
      </div>
    );
  } else {
    content = (
      <RecordsTable records={paginatedRecords} emptyMessage={getEmptyMessage()} />
    );
  }

  return (
    <FactoryLayout>
      <div className="flex min-h-screen bg-black text-[#FCFCFC]">
        <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <div className="flex items-center justify-between px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pt-8 pb-2">
            <div>
              <h2 className="text-xl 2xl:text-5xl xl:text-5xl lg:text-2xl font-500 2xl:pt-15 xl:pt-10">
                Records
              </h2>
              <p className="2xl:text-lg xl:text-lg lg:text-sm text-white mt-1">
                Data on energy consumption and production.
              </p>
            </div>
            <DownloadPDFButton
              headers={pdfHeaders}
              rows={pdfRows}
              filename={filename}
              subtitle={subtitle}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 xl:pb-6 xl:pb-5 lg:pb-1">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(item) => setSearchTerm(item.target.value)}
                placeholder="Search energy type..."
                className="w-full 2xl:w-120 xl:w-120 lg:w-70 2xl:p-3 xl:p-3 lg:p-2 border rounded bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A4759]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                filterType={filterType}
                setFilterType={setFilterType}
              />
            </div>
            <div>
              <Button buttonText="+Create" variant="create" onclickHandler={handleAdd} />
            </div>
          </div>
          <div className="flex-1 min-h-0 flex flex-col justify-between px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 w-full">
            {content}
            {filteredRecords.length > 0 && (
              <div className="mb-6">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  isDark
                  onPageChange={(newPage) => {
                    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
                  }}
                />
              </div>
            )}
          </div>
          <ModalForm
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={async (data) => {
              try {
                const newRecord = await saveRecord(
                  data as Omit<
                    EnergyEntryData,
                    "data_id" | "created_at" | "updated_at"
                  >
                );
                setRecords((prev) => [newRecord, ...prev]);
                setPage(1);
                return { success: true };
              } catch (error) {
                return {
                  success: false,
                  message: (error as Error).message || "Failed to save record.",
                };
              }
            }}
            userFactoryId={userFactoryId ?? 0}
          />
        </main>
      </div>
    </FactoryLayout>
  );
}