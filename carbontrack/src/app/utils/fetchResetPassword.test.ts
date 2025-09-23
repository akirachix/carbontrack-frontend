import { resetPassword } from './fetchResetPassword';

global.fetch = jest.fn();

describe('resetPassword util', () => {
  const mockEmail = 'girmaayemebet@gmail.com';
  const mockPassword = 'girmaayemebet';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('successfully resets password', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ message: 'Password reset successfully' }),
    });

    const result = await resetPassword({ email: mockEmail, password: mockPassword });

    expect(fetch).toHaveBeenCalledWith('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: mockEmail, password: mockPassword }),
    });

    expect(result).toEqual({ message: 'Password reset successfully' });
  }, 10000);

  it('throws error on non-OK response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ message: 'Invalid email or token' }),
    });

    await expect(resetPassword({ email: mockEmail, password: mockPassword }))
      .rejects
      .toThrow('Invalid email or token');
  }, 10000);

  it('throws generic error on network failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(resetPassword({ email: mockEmail, password: mockPassword }))
      .rejects
      .toThrow('Network error');
  }, 10000);
});