import { fetchEnergyEntries } from "./fetchEnergyEntries";

global.fetch = jest.fn();

describe('fetchEnergyEntries', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test('successfully fetches energy entries', async () => {
    const mockData = { entries: [{ id: 1, value: 200 }] };
    const mockResponse = {
      ok: true,
      json: async () => mockData
    };
    
    (fetch as jest.Mock).mockResolvedValue(mockResponse);
    const result = await fetchEnergyEntries();

    expect(fetch).toHaveBeenCalledWith('/api/energy_entries/');

    expect(result).toEqual(mockData);
  });

  test('handles HTTP error response', async () => {

    const mockResponse = {
      ok: false,
      statusText: 'Not Found'
    };
    
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(fetchEnergyEntries()).rejects.toThrow(
      'Something went wrong: Not Found'
    );
  });

  test('handles network error', async () => {
    const mockError = new Error('Network error');
    (fetch as jest.Mock).mockRejectedValue(mockError);

    await expect(fetchEnergyEntries()).rejects.toThrow(
      'Failed to fetch energy entries: Network error'
    );
  });
});