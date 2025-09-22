import { fetchFactories } from './fetchFactories';

describe('fetchFactories', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('returns data on success', async () => {
    const mockData = [{ factory_id: '1', factory_name: 'Factory A' }];
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchFactories();
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('/api/factories/', expect.any(Object));
  });

  it('throws error with message on failure response', async () => {
    const errorMessage = 'Failed to load factories';
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: errorMessage }),
    });

    await expect(fetchFactories()).rejects.toThrow(errorMessage);
  });

  it('throws error on fetch exception', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(fetchFactories()).rejects.toThrow('Network error');
  });
});
