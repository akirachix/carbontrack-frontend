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
import Link from "next/link";
import { IoSettingsOutline, IoPersonOutline } from "react-icons/io5";
import type { EnergyEntryData } from "../types";

export default function RecordsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState<any[]>([]);
  const [userFactoryId, setUserFactoryId] = useState<number | null>(null);

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
    selectedDate,
    setSelectedDate,
    noDataForDate,
  } = useFetchRecords();

  useEffect(() => {
    setRecords(hookRecords);
  }, [hookRecords]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedDate]);

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

  const handleAdd = () => {
    setModalOpen(true);
  };

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
      <RecordsTable
        records={paginatedRecords}
        emptyMessage={
          noDataForDate
            ? "No records found for the selected date."
            : "No energy type found."
        }
      />
    );
  }

  const selectedDateObj = selectedDate ? new Date(selectedDate) : null;

  return (
    <FactoryLayout>
      <div className="flex min-h-screen overflow-hidden bg-black text-[#fcfcfc] relative">
        <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <div className="flex justify-end w-16 ml-350 space-x-4 mt-15">
            <Link href="">
              <IoSettingsOutline className="text-[#F79B72] w-7 h-7 cursor-pointer hover:text-[#2A4759]" />
            </Link>
            <Link href="#">
              <IoPersonOutline className="text-[#F79B72] w-7 h-7 cursor-pointer hover:text-[#2A4759]" />
            </Link>
          </div>
          <div className="mb-6 px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
            <h2 className="text-xl md:text-5xl font-500">Records</h2>
            <p className="text-lg text-white mt-1">
              Data on energy consumption and production.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mb-8 px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(item) => setSearchTerm(item.target.value)}
                placeholder="Search energy type..."
                className="w-120 p-3 border rounded bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A4759]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar
                selectedDate={selectedDateObj}
                setSelectedDate={(date) => {
                  if (date) {
                    const yyyy = date.getFullYear();
                    const mm = String(date.getMonth() + 1).padStart(2, "0");
                    const dd = String(date.getDate()).padStart(2, "0");
                    setSelectedDate(`${yyyy}-${mm}-${dd}`);
                  } else {
                    setSelectedDate("");
                  }
                }}
              />
            </div>
            <div>
              <Button
                buttonText="+Create"
                variant="create"
                onclickHandler={handleAdd}
              />
            </div>
          </div>

          <div className="px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 flex-1 min-h-0">
            {content}
          </div>

          {filteredRecords.length > 0 && (
            <div className=" mb-6 px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
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
        </main>
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
      </div>
    </FactoryLayout>
  );
}
