import { renderHook, waitFor } from '@testing-library/react';
import { requestPasswordReset } from '../utils/fetchForgotPassword';
import { useForgotPassword } from './useFetchForgotPassword'; 
import { act } from '@testing-library/react';


jest.mock('../utils/fetchForgotPassword');

describe('useForgotPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles successful forgot password call', async () => {
    (requestPasswordReset as jest.Mock).mockResolvedValue({ message: 'OTP sent' });

    const { result } = renderHook(() => useForgotPassword());

    expect(result.current.loading).toBe(false);
    await act(async () => {
      result.current.forgotPassword('girmaayemebet@gmail.com');
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.success).toBe('OTP sent');
    expect(result.current.error).toBeNull();
  });

  it('handles error in forgot password call', async () => {
    (requestPasswordReset as jest.Mock).mockRejectedValue(new Error('Failed request'));

    const { result } = renderHook(() => useForgotPassword());

    await act(async () => {
      result.current.forgotPassword('girmaayemebet@gmail.com');
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Failed request');
    expect(result.current.success).toBeNull();
  });
});
