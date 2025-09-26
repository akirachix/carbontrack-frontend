
import { renderHook, act } from "@testing-library/react";
import { useVerifyOtp } from "./useFetchVerifyOTP";
import {verifyOtp} from "../utils/fetchVerifyOTP";

jest.mock("../utils/fetchVerifyOTP");

describe("useVerifyOtp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sets success when OTP verification succeeds", async () => {
    (verifyOtp as jest.Mock).mockResolvedValueOnce({ message: "Success" });

    const { result } = renderHook(() => useVerifyOtp());

    await act(async () => {
      await result.current.handleVerifyOtp({ email: "a@b.com", otp: "1234" });
    });

    expect(result.current.success).toBe("OTP verified successfully!");
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("sets error when OTP verification fails with validation error", async () => {
    const errorMessage = JSON.stringify({ non_field_errors: ["Invalid OTP"] });
    (verifyOtp as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useVerifyOtp());

    await act(async () => {
      await result.current.handleVerifyOtp({ email: "a@b.com", otp: "0000" });
    });

    expect(result.current.error).toBe("Invalid OTP");
    expect(result.current.success).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("sets generic error when error message is not JSON", async () => {
    (verifyOtp as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useVerifyOtp());

    await act(async () => {
      await result.current.handleVerifyOtp({ email: "a@b.com", otp: "0000" });
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.success).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
