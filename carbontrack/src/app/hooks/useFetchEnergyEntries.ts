import { useEffect, useState } from "react";
import { fetchEnergyEntries } from "../utils/fetchEnergyEntries";
import { EnergyEntryData } from "../types";

const useFetchEnergy = () => {
  const [energy, setEnergy] = useState<EnergyEntryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchEnergyEntries();
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