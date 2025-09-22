
import { renderHook, act } from '@testing-library/react';
import { useResetPassword } from './useFetchResetPassword';
import { resetPassword } from '../utils/fetchResetPassword';


jest.mock('../utils/fetchResetPassword');

describe('useResetPassword hook', () => {
  const mockResetPassword = resetPassword as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('resets password successfully', async () => {
    mockResetPassword.mockResolvedValueOnce({ message: 'Password reset successfully' });

    const { result } = renderHook(() => useResetPassword());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBeNull();

    await act(async () => {
      await result.current.handleResetPassword({
        email: 'girmaayemebet@gmail.com',
        password: 'girmaayemebet',
      });
    });

    expect(mockResetPassword).toHaveBeenCalledWith({
      email: 'girmaayemebet@gmail.com',
      password: 'girmaayemebet',
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe('Password reset successfully');
    expect(result.current.error).toBeNull();
  }, 10000);

  it('handles error during password reset', async () => {
    mockResetPassword.mockRejectedValueOnce(new Error('Invalid token'));

    const { result } = renderHook(() => useResetPassword());

    await act(async () => {
      await result.current.handleResetPassword({
        email: 'girmaayemebet@gmail.com',
        password: 'girmaayemebet',
      });
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Invalid token');
    expect(result.current.success).toBeNull();
  }, 10000);
});