import { useEffect, useState } from "react";
import { fetchEnergy } from "../utils/fetchEnergyEntries";

export interface EnergyEntry {
  factory: number;
  data_id: number;
  energy_type: string;
  energy_amount: string;
  co2_equivalent: string;
  tea_processed_amount: string;
  created_at: string;
  updated_at: string;
}

export function useFetchEnergyEntries(selectedDate: Date) {
  const [totalCO2, setTotalCO2] = useState<number | null>(null);
  const [energy, setEnergy] = useState<EnergyEntry[]>([]);
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
          setLoading(false);
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

        setEnergy(filteredData);

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

  return { totalCO2, loading, error, energy };
}


export const useFetchEnergy = () => {
  const [energy, setEnergy] = useState<EnergyEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchEnergy();
        setEnergy(data?.results || data || []);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { energy, loading, error };
};

export default useFetchEnergy;
