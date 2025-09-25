import { verifyOtp } from "./fetchVerifyOTP";

global.fetch = jest.fn();

describe("verifyOtp", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("sends POST request and returns data on success", async () => {
    const mockResponse = { message: "OTP verified" };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const payload = { email: "test@example.com", otp: "1234" };
    const result = await verifyOtp(payload);

    expect(fetch).toHaveBeenCalledWith("/api/verify-otp", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }));
    expect(result).toEqual(mockResponse);
  });

  it("throws error with parsed message on failure", async () => {
    const errorData = { non_field_errors: ["Invalid OTP"] };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => errorData,
    });

    await expect(verifyOtp({ email: "test@example.com", otp: "0000" })).rejects.toThrow(
      JSON.stringify(errorData)
    );
  });
});