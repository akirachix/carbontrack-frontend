import { renderHook, act } from '@testing-library/react';
import { useResendOtp } from './useFetchResendOTP'; 
import { requestPasswordReset } from '../utils/fetchForgotPassword';

jest.mock('../utils/fetchForgotPassword', () => ({
  requestPasswordReset: jest.fn(),
}));

describe('useFetchResendOTP', () => {
  const mockEmail = 'girmaayemebet@gmail.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useResendOtp());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBeNull();
  });

it('should set loading to true during execution and reset to false after completion', async () => {
  (requestPasswordReset as jest.Mock).mockResolvedValue({ message: 'OTP resent!' });

  const { result } = renderHook(() => useResendOtp());


  expect(result.current.loading).toBe(false);

  await act(async () => {
    await result.current.resendOtp(mockEmail);
  });

  expect(result.current.loading).toBe(false);
  expect(requestPasswordReset).toHaveBeenCalledWith(mockEmail);
});

  it('should set success message from API response', async () => {
    const successMessage = 'Check your email for new OTP.';
    (requestPasswordReset as jest.Mock).mockResolvedValue({ message: successMessage });

    const { result } = renderHook(() => useResendOtp());

    await act(async () => {
      await result.current.resendOtp(mockEmail);
    });

    expect(result.current.success).toBe(successMessage);
    expect(result.current.error).toBeNull();
  });

  it('should set fallback success message if API response has no message', async () => {
    (requestPasswordReset as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useResendOtp());

    await act(async () => {
      await result.current.resendOtp(mockEmail);
    });

    expect(result.current.success).toBe('OTP resent successfully!');
    expect(result.current.error).toBeNull();
  });

  it('should set error message if request fails with Error instance', async () => {
    const errorMessage = 'Network error';
    (requestPasswordReset as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useResendOtp());

    await act(async () => {
      await result.current.resendOtp(mockEmail);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.success).toBeNull();
  });

  it('should set fallback error message if request fails with non-Error value', async () => {
    (requestPasswordReset as jest.Mock).mockRejectedValue({});

    const { result } = renderHook(() => useResendOtp());

    await act(async () => {
      await result.current.resendOtp(mockEmail);
    });

    expect(result.current.error).toBe('Failed to resend OTP.');
    expect(result.current.success).toBeNull();
  });

  it('should always set loading to false after completion (even on error)', async () => {
    (requestPasswordReset as jest.Mock).mockRejectedValue(new Error('Boom!'));

    const { result } = renderHook(() => useResendOtp());

    expect(result.current.loading).toBe(false);

    await act(async () => {
      await result.current.resendOtp(mockEmail);
    });

    expect(result.current.loading).toBe(false);
  });
});