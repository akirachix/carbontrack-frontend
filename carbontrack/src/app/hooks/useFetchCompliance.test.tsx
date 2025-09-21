import { renderHook, act } from "@testing-library/react";
import useFetchCompliance from "../hooks/useFetchCompliance";
import { fetchCompliance } from "../utils/fetchCompliance";

jest.mock("../utils/fetchCompliance", () => ({
  fetchCompliance: jest.fn(),
}));

global.fetch = jest.fn();

describe("useFetchCompliance Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch compliance successfully", async () => {
    (fetchCompliance as jest.Mock).mockResolvedValueOnce({
      results: [
        {
          compliance_id: 1,
          compliance_target: "20",
          compliance_status: "compliant",
          created_at: "2025-01-01",
          updated_at: "2025-01-02",
          factory: 1,
        },
      ],
    });
    const { result } = renderHook(() => useFetchCompliance());
    await act(async () => {
      await Promise.resolve(); 
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.compliance).toHaveLength(1);
    expect(result.current.compliance[0].compliance_status).toBe("compliant");
  });

  it("should handle fetch error", async () => {
    (fetchCompliance as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));
    const { result } = renderHook(() => useFetchCompliance());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.compliance).toEqual([]);
    expect(result.current.error).toBe("Network Error");
  });

  it("should handle empty compliance data", async () => {
    (fetchCompliance as jest.Mock).mockResolvedValueOnce({ results: [] });
    const { result } = renderHook(() => useFetchCompliance());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.compliance).toEqual([]);
    expect(result.current.error).toBeNull();
  });

});
