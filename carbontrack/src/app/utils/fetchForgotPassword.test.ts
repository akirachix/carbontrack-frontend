
import { requestPasswordReset } from './fetchForgotPassword';

describe('requestPasswordReset', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('returns data on successful response', async () => {
    const mockData = { message: 'OTP sent' };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await requestPasswordReset('girmaayemebet@gmail.com');

    expect(fetch).toHaveBeenCalledWith('/api/forgot-password', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'girmaayemebet@gmail.com' }),
    }));
    expect(result).toEqual(mockData);
  });

  it('throws an error on non-OK response', async () => {
    const errorMsg = 'Failed to send reset otp';
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: errorMsg }),
    });

    await expect(requestPasswordReset('girmaayemebet@gmail.com')).rejects.toThrow(errorMsg);
  });

  it('throws an error on fetch failure', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    await expect(requestPasswordReset('girmaayemebet@gmail.com')).rejects.toThrow('Network error');
  });
});
