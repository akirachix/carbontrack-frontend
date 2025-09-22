import { useEffect, useState } from "react";
import { fetchFactories } from "../utils/fetchFactories";

export interface FactoryType {
  factory_id: number;
  factory_name: string;
  factory_location: string;
  created_at: string;
}

const useFetchFactories = () => {
  const [factories, setFactories] = useState<FactoryType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchFactories();
        setFactories(data?.results || data || []);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { factories, loading, error };
};
export default useFetchFactories;

