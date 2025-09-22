import { useEffect, useState } from "react";
import { fetchEnergy } from "../utils/fetchEnergyEntries";

export function useFetchEnergyEntries(selectedDate: Date) {
  const [totalCO2, setTotalCO2] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("factoryId", "11");
  }, []);

  useEffect(() => {
    async function fetchFactoryEmissions() {
      setLoading(true);
      setError(null);
      try {
        const factoryId = localStorage.getItem("factoryId");
        if (!factoryId) {
          throw new Error("Factory ID not found in local storage");
        }
        const factoryIdNum = parseInt(factoryId);
        const data = await fetchEnergy();

        if (!Array.isArray(data)) {
          throw new Error("Fetched data is not an array");
        }

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