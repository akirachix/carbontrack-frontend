import { fetchCompliance } from "./fetchCompliance";

describe('fetchCompliance', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns data when fetch is successful and response is ok', async () => {
    const mockData = { compliance: true };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
    );

    const result = await fetchCompliance();
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('/api/compliance');
  });

  it('throws error when response is not ok', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Internal Server Error',
      } as Response)
    );

    await expect(fetchCompliance()).rejects.toThrow(
      'Something went wrongInternal Server Error'
    );
    expect(fetch).toHaveBeenCalledWith('/api/compliance');
  });

  it('throws error when fetch rejects', async () => {
    const fetchError = new Error('Network Failure');
    global.fetch = jest.fn(() => Promise.reject(fetchError));

    await expect(fetchCompliance()).rejects.toThrow(
      'Failed to fetch usersNetwork Failure'
    );
    expect(fetch).toHaveBeenCalledWith('/api/compliance');
  });
});
