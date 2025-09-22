import { fetchFactories } from "./fetchFactories";

global.fetch = jest.fn();

describe('fetchFactories', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test('successfully fetches factories', async () => {
    const mockData = { factories: [{ id: 1, name: 'Factory A' }] };
    const mockResponse = {
      ok: true,
      json: async () => mockData
    };
    
    (fetch as jest.Mock).mockResolvedValue(mockResponse);
    const result = await fetchFactories();

    expect(fetch).toHaveBeenCalledWith('/api/factories/');

    expect(result).toEqual(mockData);
  });

  test('handles HTTP error response', async () => {
    const mockResponse = {
      ok: false,
      statusText: 'Not Found'
    };
    
    (fetch as jest.Mock).mockResolvedValue(mockResponse);
    await expect(fetchFactories()).rejects.toThrow(
      'Something went wrong: Not Found'
    );
  });

  test('handles network error', async () => {
    const mockError = new Error('Network error');
    (fetch as jest.Mock).mockRejectedValue(mockError);

    await expect(fetchFactories()).rejects.toThrow(
      'Failed to fetch factories: Network error'
    );
  });
});