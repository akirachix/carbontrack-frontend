import { fetchMcus } from "./fetchMcu";

global.fetch = jest.fn();

describe('fetchMcus', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test('successfully fetches MCUs', async () => {
    const mockData = { mcus: [{ id: 1, name: 'MCU A' }] };
    const mockResponse = {
      ok: true,
      json: async () => mockData
    };
    
    (fetch as jest.Mock).mockResolvedValue(mockResponse);
    const result = await fetchMcus();
    expect(fetch).toHaveBeenCalledWith('/api/mcus/');

    expect(result).toEqual(mockData);
  });

  test('handles HTTP error response', async () => {
    const mockResponse = {
      ok: false,
      statusText: 'Not Found'
    };
    
    (fetch as jest.Mock).mockResolvedValue(mockResponse);
    await expect(fetchMcus()).rejects.toThrow(
      'Something went wrong: Not Found'
    );
  });

  test('handles network error', async () => {
    const mockError = new Error('Network error');
    (fetch as jest.Mock).mockRejectedValue(mockError);
    
    await expect(fetchMcus()).rejects.toThrow(
      'Failed to fetch MCUs: Network error'
    );
  });
});