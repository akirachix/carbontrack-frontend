import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { useVerifyOtp } from '../hooks/useFetchVerifyOTP';
import { useResendOtp } from '../hooks/useFetchResendOTP';
import VerifyCodePage from './page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: jest.fn((key) => (key === 'email' ? 'girmaayemebet@gmail.com' : null)),
  })),
}));

jest.mock('../hooks/useFetchVerifyOTP', () => ({
  useVerifyOtp: jest.fn(),
}));

jest.mock('../hooks/useFetchResendOTP', () => ({
  useResendOtp: jest.fn(),
}));

describe('VerifyCodePage — Core Functionality', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  const setupComponent = async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<VerifyCodePage />);
    const inputs = await screen.findAllByRole('textbox');
    return { inputs, user };
  };

  it('renders 4 OTP inputs and timer', async () => {
    (useVerifyOtp as jest.Mock).mockReturnValue({
      handleVerifyOtp: jest.fn(),
      loading: false,
      error: null,
      success: null,
    });
    (useResendOtp as jest.Mock).mockReturnValue({
      resendOtp: jest.fn(),
      loading: false,
      error: null,
      success: null,
    });

    const { inputs } = await setupComponent();
    expect(inputs).toHaveLength(4);
    expect(screen.getByText('10:00')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Verify' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resend' })).toBeInTheDocument();
  }, 10000);

  it('typing a digit moves focus to the next input', async () => {
    (useVerifyOtp as jest.Mock).mockReturnValue({
      handleVerifyOtp: jest.fn(),
      loading: false,
      error: null,
      success: null,
    });
    (useResendOtp as jest.Mock).mockReturnValue({
      resendOtp: jest.fn(),
      loading: false,
      error: null,
      success: null,
    });

    const { inputs, user } = await setupComponent();

    await act(async () => {
      await user.type(inputs[0], '5');
    });

    await waitFor(() => {
      expect(document.activeElement).toBe(inputs[1]);
    }, { timeout: 5000 });
  }, 10000);

  it('backspace on empty input moves focus to previous input', async () => {
    (useVerifyOtp as jest.Mock).mockReturnValue({
      handleVerifyOtp: jest.fn(),
      loading: false,
      error: null,
      success: null,
    });
    (useResendOtp as jest.Mock).mockReturnValue({
      resendOtp: jest.fn(),
      loading: false,
      error: null,
      success: null,
    });

    const { inputs, user } = await setupComponent();

    await act(async () => {
      await user.type(inputs[1], '3');
      await user.clear(inputs[1]);
      await user.keyboard('{Backspace}');
    });

    await waitFor(() => {
      expect(document.activeElement).toBe(inputs[0]);
    }, { timeout: 5000 });
  }, 10000);

  it('submit calls handleVerifyOtp with correct OTP and email', async () => {
    const mockHandleVerifyOtp = jest.fn().mockResolvedValue(undefined);
    (useVerifyOtp as jest.Mock).mockReturnValue({
      handleVerifyOtp: mockHandleVerifyOtp,
      loading: false,
      error: null,
      success: null,
    });
    (useResendOtp as jest.Mock).mockReturnValue({
      resendOtp: jest.fn(),
      loading: false,
      error: null,
      success: null,
    });

    const { inputs, user } = await setupComponent();

    await act(async () => {
      for (let i = 0; i < 4; i++) {
        await user.type(inputs[i], (i + 1).toString());
      }
      await user.click(screen.getByRole('button', { name: 'Verify' }));
    });

    await waitFor(() => {
      expect(mockHandleVerifyOtp).toHaveBeenCalledWith({
        email: 'girmaayemebet@gmail.com',
        otp: '1234',
      });
    }, { timeout: 5000 });
  }, 10000);

  it('on success, redirects to reset-password after 2s', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useVerifyOtp as jest.Mock).mockReturnValue({
      handleVerifyOtp: jest.fn().mockResolvedValue(undefined),
      loading: false,
      error: null,
      success: 'Verification successful!',
    });
    (useResendOtp as jest.Mock).mockReturnValue({
      resendOtp: jest.fn(),
      loading: false,
      error: null,
      success: null,
    });

    render(<VerifyCodePage />);

    await waitFor(() => {
      expect(screen.getByText('Verification successful!')).toBeInTheDocument();
    }, { timeout: 5000 });

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockPush).toHaveBeenCalledWith('/reset-password?email=girmaayemebet%40gmail.com');
  }, 10000);

  it('resend button calls resendOtp, resets inputs and timer', async () => {
    const mockResendOtp = jest.fn().mockResolvedValue(undefined);
    (useResendOtp as jest.Mock).mockReturnValue({
      resendOtp: mockResendOtp,
      loading: false,
      error: null,
      success: 'OTP resent successfully',
    });
    (useVerifyOtp as jest.Mock).mockReturnValue({
      handleVerifyOtp: jest.fn(),
      loading: false,
      error: null,
      success: null,
    });

    const { inputs, user } = await setupComponent();

    await act(async () => {
      for (let i = 0; i < 4; i++) {
        await user.type(inputs[i], (i + 1).toString());
      }
      await user.click(screen.getByRole('button', { name: 'Resend' }));
    });

    await waitFor(() => {
      expect(mockResendOtp).toHaveBeenCalledWith('girmaayemebet@gmail.com');
      inputs.forEach((input) => expect(input).toHaveValue(''));
      expect(screen.getByText('10:00')).toBeInTheDocument();
      expect(screen.getByText('OTP resent successfully')).toBeInTheDocument();
    }, { timeout: 5000 });
  }, 10000);

  it('displays error message when verification fails', async () => {
    (useVerifyOtp as jest.Mock).mockReturnValue({
      handleVerifyOtp: jest.fn().mockRejectedValue(new Error('Invalid OTP')),
      loading: false,
      error: 'Invalid OTP',
      success: null,
    });
    (useResendOtp as jest.Mock).mockReturnValue({
      resendOtp: jest.fn(),
      loading: false,
      error: null,
      success: null,
    });

    const { inputs, user } = await setupComponent();

    await act(async () => {
      for (let i = 0; i < 4; i++) {
        await user.type(inputs[i], (i + 1).toString());
      }
      await user.click(screen.getByRole('button', { name: 'Verify' }));
    });

    await waitFor(() => {
      expect(screen.getByText('Invalid OTP')).toBeInTheDocument();
    }, { timeout: 5000 });
  }, 10000);

  it('disables resend button when loading', async () => {
    (useVerifyOtp as jest.Mock).mockReturnValue({
      handleVerifyOtp: jest.fn(),
      loading: false,
      error: null,
      success: null,
    });
    (useResendOtp as jest.Mock).mockReturnValue({
      resendOtp: jest.fn(),
      loading: true,
      error: null,
      success: null,
    });

    await setupComponent();

    const resendButton = screen.getByRole('button', { name: 'Resend' });
    expect(resendButton).toBeDisabled();
  }, 10000);
});