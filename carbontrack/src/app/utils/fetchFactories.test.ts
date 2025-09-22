import { fetchFactories } from "./fetchFactories";

describe('fetchFactories', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns data when fetch is successful and response is ok', async () => {
    const mockData = { factories: [{ id: 1, name: 'Factory A' }] };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
    );

    const result = await fetchFactories();
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('/api/factories');
  });

  it('throws error when response is not ok', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Not Found',
      } as Response)
    );

    await expect(fetchFactories()).rejects.toThrow(
      'Something went wrongNot Found'
    );
    expect(fetch).toHaveBeenCalledWith('/api/factories');
  });

  it('throws error when fetch rejects', async () => {
    const fetchError = new Error('Network Error');
    global.fetch = jest.fn(() => Promise.reject(fetchError));

    await expect(fetchFactories()).rejects.toThrow(
      'Failed to fetch usersNetwork Error'
    );
    expect(fetch).toHaveBeenCalledWith('/api/factories');
  });
});
