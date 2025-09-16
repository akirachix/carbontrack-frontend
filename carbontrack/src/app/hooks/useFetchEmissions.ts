import { useEffect, useState } from "react";
import { fetchEmissions } from "../utils/fetchEmissions";

export interface EmissionType {
  emissions_id: number;
  emission_rate: string;
  mcu: string;
  mcu_device_id: string;
  updated_at: string;
}

const useFetchEmissions = () => {
  const [emissions, setEmissions] = useState<EmissionType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchEmissions();
        setEmissions(data?.emissions || data || []);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { emissions, loading, error };
};

export default useFetchEmissions;
