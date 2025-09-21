
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

  

  return { compliance, loading, error, updateCompliance };
}

export async function updateCompliance(
  complianceId: number,
  compliance_target: string,
  factory: number
) {
  const res = await fetch(`/api/compliance/${complianceId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ compliance_target, factory }),
  });
  if (!res.ok) {
    throw new Error("Failed to update compliance");
  }
  return res.json();
}