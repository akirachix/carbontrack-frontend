
import { useState, useEffect } from "react";
import { fetchRecords } from "../utils/fetchRecords";
import { EnergyEntryData } from "../types";

export function useFetchRecords() {
  const [records, setRecords] = useState<EnergyEntryData[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<EnergyEntryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [noDataForDate, setNoDataForDate] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchRecords();
        setRecords(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (records.length === 0) return;

    let filtered = records;

    if (selectedDate) {
      filtered = records.filter(
        (item) => {
          const fieldValue = item.created_at;
          return fieldValue && fieldValue.startsWith(selectedDate);
        }
      );
      
      if (filtered.length === 0) {
        setNoDataForDate(true);
        setFilteredRecords([]);
        return;
      }
    }
    
    setNoDataForDate(false);
    setFilteredRecords(filtered);
  }, [selectedDate, records]);

  return {
    records: filteredRecords,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    noDataForDate,
  };
}