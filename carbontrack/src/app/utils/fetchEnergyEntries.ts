const baseUrl = '/api/energy_entries/';

export async function fetchEnergyEntries() {
  try {
    const response = await fetch(`${baseUrl}`);
    if (!response.ok) {
      throw new Error('Something went wrong: ' + response.statusText);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error('Failed to fetch energy entries: ' + (error as Error).message);
  }
}