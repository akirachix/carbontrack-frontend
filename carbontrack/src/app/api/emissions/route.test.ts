import { GET } from './route'
import fetchMock from 'jest-fetch-mock';
import 'jest';
const baseUrl = process.env.BASE_URL;

fetchMock.enableMocks();

describe('GET function', () => {

  beforeEach(() => {
    fetchMock.resetMocks();
    process.env.BASE_URL = baseUrl;
  });

  it('returns data when fetch succeeds', async () => {
    const mockData = [{ id: 1, emission: 100 }];
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const response = await GET();
    const responseData = await response.json();

    expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/emissions/`);
    expect(response.status).toBe(200);
    expect(responseData).toEqual(mockData);
  });

  it('returns error message when fetch fails', async () => {
    fetchMock.mockRejectOnce(new Error('Failed to fetch'));

    const response = await GET();
    const text = await response.text();

    expect(response.status).toBe(500);
    expect(text).toBe('Failed to fetch');
  });
});


