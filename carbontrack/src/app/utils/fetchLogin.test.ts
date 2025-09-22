import { fetchLogin } from './fetchLogin';

describe('fetchLogin utility', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('resolves with data on successful login', async () => {
    const mockData = { access: 'token', user: { user_type: 'factory' } };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchLogin({ email: 'girmaayemebet@gmail.com', password: 'girmaayemebet' });
    expect(result).toEqual(mockData);
  });

  it('throws error on failed login response', async () => {
    const errorMessage = 'Invalid credentials';
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: errorMessage }),
    });

    await expect(fetchLogin({ email: 'girmaayemebet@gmail.com', password: 'girmaayemebet' })).rejects.toThrow(errorMessage);
  });

  it('throws error on network failure', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    await expect(fetchLogin({ email: 'girmaayemebet@gmail.com', password: 'girmaayemebet' })).rejects.toThrow('Network error');
  });
});
