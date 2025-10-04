const baseUrl = "/api/energy_entries";

import { EnergyEntryData } from "../types";

export async function fetchRecords(factoryId: number): Promise<EnergyEntryData[]> {
  try {
    const response = await fetch(`${baseUrl}?factory=${factoryId}`);
    if (!response.ok) {
      throw new Error("Something went wrong: " + response.statusText);
    }
    return await response.json();
  } catch (error) {
    throw new Error("Failed to fetch records: " + (error as Error).message);
  }
}

export async function saveRecord(data: Omit<EnergyEntryData, "data_id" | "created_at" | "updated_at">) {
  try {
    const stored = localStorage.getItem("factory");
    if (!stored) throw new Error("Factory ID not found in localStorage");
    const factoryId = Number(stored);
    const payload = { ...data, factory: factoryId };
    const response = await fetch(`${baseUrl}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      if (response.status === 500) {
        throw new Error("Internal server error occurred. Please try again later.");
      }
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error("Failed to save record: " + (error as Error).message);
  }
}