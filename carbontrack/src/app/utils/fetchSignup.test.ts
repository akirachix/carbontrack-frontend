import { fetchSignup } from './fetchSignup';

describe('fetchSignup util', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('returns data on successful signup', async () => {
    const mockResponse = { user: { id: 1, first_name: 'Emebet' } };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchSignup({
      first_name: 'Emebet',
      last_name: 'Girmay',
      email: 'girmaayemebet@gmail.com',
      phone_number: '+251939235242',
      password: 'girmaayemebet',
      user_type: 'manager',
    });

    expect(result).toEqual(mockResponse);
  });

  it('throws error on failed response', async () => {
    const errorMsg = 'Email already exists';
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: errorMsg }),
    });

    await expect(fetchSignup({
      first_name: 'Emebet',
      last_name: 'Girmay',
      email: 'girmaayemebet@gmail.com',
      phone_number: '+251939235242',
      password: 'girmaayemebet',
      user_type: 'manager',
    })).rejects.toThrow(JSON.stringify({ message: errorMsg }));
  });

  it('throws error on fetch failure', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    await expect(fetchSignup({
      first_name: 'Emebet',
      last_name: 'Girmay',
      email: 'girmaayemebet@gmail.com',
      phone_number: '+251939235242',
      password: 'girmaayemebet',
      user_type: 'manager',
    })).rejects.toThrow('Network error');
  });
});
