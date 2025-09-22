const baseUrl = '/api/compliance';

export  async function fetchCompliance() {
    try {
        const response= await fetch(baseUrl);
        if (!response.ok) {
            throw new Error("Something went wrong" + response.statusText);
    }
    const result= await response.json();
        return result;
}catch (error) {
        throw new Error('Failed to fetch users' + (error as Error).message)
    }}

export async function updateCompliance(
  complianceId: number,
  compliance_target: string,
  factory: number
) {
  const res = await fetch(`${baseUrl}/${complianceId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ compliance_target, factory }),
  });
  if (!res.ok) {
    throw new Error("Failed to update compliance");
  }
  return res.json();
}