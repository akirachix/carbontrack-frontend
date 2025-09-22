import { fetchEmissions } from "./fetchEmissions";

describe('fetchEmissions', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test('should return data on successful fetch', async () => {
    const mockData = { emissions: [{ id: 1, value: 100 }] };
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => mockData
    };
    
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await fetchEmissions();

    expect(fetch).toHaveBeenCalledWith('/api/emissions/');

    expect(result).toEqual(mockData);
  });

  test('should throw error when response is not ok', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found'
    };
    
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(fetchEmissions()).rejects.toThrow(
      'Something went wrong: Not Found'
    );
  });

  test('should throw error when fetch fails', async () => {
    const mockError = new Error('Network error');
    (fetch as jest.Mock).mockRejectedValue(mockError);

    await expect(fetchEmissions()).rejects.toThrow(
      'Failed to fetch emissions: Network error'
    );
  });
});