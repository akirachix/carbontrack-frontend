import { useEffect, useState, useCallback } from "react";
import { fetchCompliance } from "../utils/fetchCompliance";
export interface ComplianceType {
  compliance_id: number;
  factory: number;
  compliance_status: string;
  compliance_target: string;
  created_at: string;
  updated_at?: string;
}
const useFetchCompliance = () => {
  const [compliance, setCompliance] = useState<ComplianceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCompliance();
      setCompliance(data?.results || data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return { compliance, loading, error, refetch: fetchData };
};
export default useFetchCompliance;