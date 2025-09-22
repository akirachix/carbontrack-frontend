import { fetchEmissions } from "./fetchEmissions";

describe('fetchEmissions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns data when fetch is successful and response is ok', async () => {
    const mockData = { emissions: 50 };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
    );

    const result = await fetchEmissions();
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('/api/emissions');
  });

  it('throws error when response is not ok', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Internal Server Error',
      } as Response)
    );

    await expect(fetchEmissions()).rejects.toThrow(
      'Something went wrongInternal Server Error'
    );
    expect(fetch).toHaveBeenCalledWith('/api/emissions');
  });

  it('throws error when fetch rejects', async () => {
    const fetchError = new Error('Network Failure');
    global.fetch = jest.fn(() => Promise.reject(fetchError));

    await expect(fetchEmissions()).rejects.toThrow(
      'Failed to fetch usersNetwork Failure'
    );
    expect(fetch).toHaveBeenCalledWith('/api/emissions');
  });
});
