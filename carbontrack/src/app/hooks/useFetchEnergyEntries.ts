import { useEffect, useState } from "react";
import { fetchEnergy } from "../utils/fetchEnergyEntries";

export interface EnergyType {
  data_id: number;
  energy_type: string;
  energy_amount: string;
  co2_equivalent: string;
  tea_processed_amount: string;
  created_at: string;
  updated_at: string;
  factory: number;
}

const useFetchEnergy = () => {
  const [energy, setEnergy] = useState<EnergyType[]>([]);
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
