import { useEffect, useState } from "react";
import { fetchCompliance } from "../utils/fetchCompliance";

export interface ComplianceType {
  compliance_id: number;
  compliance_target: string;
  compliance_status: string;
  created_at: string;
  updated_at: string;
  factory: number;
  error?: string;
}

const useFetchCompliance = () => {
  const [compliance, setCompliance] = useState<ComplianceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCompliance = async () => {
    setLoading(true);
    try {
      const data = await fetchCompliance();
      setCompliance(data?.results || data || []);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadCompliance();
  }, []);

  const postCompliance = async (newTarget: string, factory: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compliance_target: newTarget, factory }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to save compliance target');
      }
      await response.json();
      await loadCompliance();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { compliance, loading, error, postCompliance };
};

export default useFetchCompliance;
