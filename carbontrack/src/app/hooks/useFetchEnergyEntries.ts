import { useEffect, useState } from "react";
import { fetchEnergy } from "../utils/fetchEnergyEntries";

interface EnergyEntry {
  factory: number;
  created_at: string;
  co2_equivalent: string;
}

export function useFetchEnergyEntries(selectedDate: Date) {
  const [totalCO2, setTotalCO2] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("factoryId", "3");
  }, []);

  
  useEffect(() => {
    async function fetchFactoryEmissions() {
      setLoading(true);
      setError(null);
      try {
        const factoryId = localStorage.getItem("factoryId");        
        if (!factoryId) {
          setError("Factory ID not found in local storage");
          return;
        }
        const factoryIdNum = parseInt(factoryId);
        const data: EnergyEntry[] = await fetchEnergy();

        let filteredData = data.filter(entry => entry.factory === factoryIdNum);

        if (selectedDate) {
          filteredData = filteredData.filter(entry => {
            const createdAt = new Date(entry.created_at);
            return (
              createdAt.getFullYear() === selectedDate.getFullYear() &&
              createdAt.getMonth() === selectedDate.getMonth() &&
              createdAt.getDate() === selectedDate.getDate()
            );
          });
        }

        const total = filteredData.reduce(
          (acc, entry) => acc + parseFloat(entry.co2_equivalent),
          0
        );
        setTotalCO2(total);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchFactoryEmissions();
  }, [selectedDate]);

  return { totalCO2, loading, error };
}