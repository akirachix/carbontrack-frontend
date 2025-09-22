import { fetchEnergy } from "./fetchEnergyEntries";

describe('fetchEnergy', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns data when fetch is successful and response is ok', async () => {
    const mockData = { energy: 100 };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
    );

    const result = await fetchEnergy();
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('/api/energy_entries');
  });

  it('throws error when response is not ok', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Not Found',
      } as Response)
    );

    await expect(fetchEnergy()).rejects.toThrow(
      'Something went wrongNot Found'
    );
    expect(fetch).toHaveBeenCalledWith('/api/energy_entries');
  });

  it('throws error when fetch rejects', async () => {
    const fetchError = new Error('Network Error');
    global.fetch = jest.fn(() => Promise.reject(fetchError));

    await expect(fetchEnergy()).rejects.toThrow(
      'Failed to fetch usersNetwork Error'
    );
    expect(fetch).toHaveBeenCalledWith('/api/energy_entries');
  });
});
