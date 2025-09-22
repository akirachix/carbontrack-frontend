import { useEffect, useState } from "react";
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
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCompliance();
        setCompliance(data?.results || data || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return { compliance, loading, error };
};
export default useFetchCompliance;