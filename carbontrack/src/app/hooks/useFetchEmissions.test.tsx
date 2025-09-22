import { renderHook, act, waitFor } from "@testing-library/react";
import useFetchEmissions from "./useFetchEmissions";
import { fetchEmissions } from "../utils/fetchEmissions";

jest.mock("../utils/fetchEmissions");
const mockedFetchEmissions = fetchEmissions as jest.MockedFunction<typeof fetchEmissions>;

describe("useFetchEmissions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch emissions successfully", async () => {
    const mockData = [
      {
        emissions_id: 1,
        emission_rate: "20",
        mcu: "MCU1",
        mcu_device_id: "DEVICE1",
        updated_at: "2025-09-22T00:00:00Z",
      },
    ];
    mockedFetchEmissions.mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useFetchEmissions());

    expect(result.current.loading).toBe(true);

    await act(async () => {});
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.emissions).toEqual(mockData);
  });

  it("should handle errors", async () => {
    mockedFetchEmissions.mockRejectedValueOnce(new Error("Failed to fetch"));
    const { result } = renderHook(() => useFetchEmissions());

    expect(result.current.loading).toBe(true);
    await act(async () => {});
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Failed to fetch");
    expect(result.current.emissions).toEqual([]);
  });

  it("should handle empty response", async () => {
    mockedFetchEmissions.mockResolvedValueOnce(null);
    const { result } = renderHook(() => useFetchEmissions());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.emissions).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});
