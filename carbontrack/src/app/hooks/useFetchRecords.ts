import { useState, useEffect } from "react";
import { fetchRecords } from "../utils/fetchRecords";
import { EnergyEntryData } from "../types";

type FilterType = "day" | "month" | "year";

function matchesFilter(dateRaw: string | Date, filterDateRaw: Date | null, filterType: FilterType): boolean {
  const date = dateRaw instanceof Date ? dateRaw : new Date(dateRaw);
  const filterDate = filterDateRaw;
  if (!filterDate || isNaN(date.getTime()) || isNaN(filterDate.getTime())) return false;

  if (filterType === "year") {
    return date.getFullYear() === filterDate.getFullYear();
  }
  if (filterType === "month") {
    return (
      date.getFullYear() === filterDate.getFullYear() &&
      date.getMonth() === filterDate.getMonth()
    );
  }
  if (filterType === "day") {
    return (
      date.getFullYear() === filterDate.getFullYear() &&
      date.getMonth() === filterDate.getMonth() &&
      date.getDate() === filterDate.getDate()
    );
  }
  return false;
}

export function useFetchRecords(
  factoryId: number | null,
  selectedDate: Date | null,
  filterType: FilterType
) {
  const [records, setRecords] = useState<EnergyEntryData[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<EnergyEntryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noDataForDate, setNoDataForDate] = useState(false);

  useEffect(() => {
    if (typeof factoryId !== "number") {
      setRecords([]);
      setLoading(false);
      return; 
    }
    setLoading(true);
    setError(null);
    fetchRecords(factoryId)
      .then(data => setRecords(data))
      .catch(error => {
        setError((error as Error).message);
        setRecords([]);
      })
      .finally(() => setLoading(false));
  }, [factoryId]);

  useEffect(() => {
    if (!selectedDate) {
      setFilteredRecords(records);
      setNoDataForDate(false);
      return;
    }
    const filtered = records.filter((item) =>
      item.created_at && matchesFilter(item.created_at, selectedDate, filterType)
    );
    setFilteredRecords(filtered);
    setNoDataForDate(filtered.length === 0);
  }, [selectedDate, filterType, records]);

  return {
    records: filteredRecords,
    loading,
    error,
    noDataForDate,
  };
}