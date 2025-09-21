
import { useState, useEffect } from "react";
export default function useFetchCompliance() {
  const [compliance, setCompliance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompliance = async () => {
      try {
        const res = await fetch("/api/compliance");
        if (!res.ok) throw new Error("Failed to fetch compliance");
        const data = await res.json();
        setCompliance(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompliance();
  }, []);

  

  return { compliance, loading, error };
}
