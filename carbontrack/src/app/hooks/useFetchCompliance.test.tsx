import { renderHook, waitFor } from "@testing-library/react";
import useFetchCompliance from "./useFetchCompliance";
import { fetchCompliance } from "../utils/fetchCompliance";

jest.mock("../utils/fetchCompliance");
const mockedFetchCompliance = fetchCompliance as jest.MockedFunction<
  typeof fetchCompliance
>;
describe("useFetchCompliance hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("fetches compliance data successfully", async () => {
    const mockData = [
      {
        compliance_id: 1,
        factory: 101,
        compliance_status: "Compliant",
        compliance_target: "1.0",
        created_at: "2023-01-01",
        updated_at: "2023-01-02",
      },
    ];
    mockedFetchCompliance.mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useFetchCompliance());
    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.compliance).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it("handles empty response", async () => {
    mockedFetchCompliance.mockResolvedValueOnce(null as any);
    const { result } = renderHook(() => useFetchCompliance());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.compliance).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("handles error during fetch", async () => {
    mockedFetchCompliance.mockRejectedValueOnce(new Error("Network error"));
    const { result } = renderHook(() => useFetchCompliance());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.compliance).toEqual([]);
    expect(result.current.error).toBe("Network error");
  });
  
  it("handles response with results property", async () => {
    const mockData = {
      results: [
        {
          compliance_id: 2,
          factory: 10,
          compliance_status: "non-compliant",
          compliance_target: "1.5",
          created_at: "2023-03-01",
        },
      ],
    };
    mockedFetchCompliance.mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useFetchCompliance());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.compliance).toEqual(mockData.results);
    expect(result.current.error).toBeNull();
  });

   it("should handle empty response", async () => {
    mockedFetchCompliance.mockResolvedValueOnce(null);
    const { result } = renderHook(() => useFetchCompliance());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.compliance).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});