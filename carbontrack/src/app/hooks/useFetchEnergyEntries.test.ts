import { renderHook, waitFor } from "@testing-library/react";
import { jest } from "@jest/globals";
import { fetchEmissions } from "../utils/fetchEmissions";
import { useFetchEmissions } from "./useFetchEmissions"; 
import useFetchEmission from "./useFetchEmissions"; 


jest.mock("../utils/fetchEmissions");

const mockedFetchEmissions = fetchEmissions as jest.MockedFunction<typeof fetchEmissions>;

describe("useFetchEmissions hook", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should set loading initially and then fetch emissions data", async () => {
    const mockData = [{ emissions_id: 1, emission_rate: "10", updated_at: "2023-01-01", mcu: "mcu1", mcu_device_id: "device1" }];
    mockedFetchEmissions.mockResolvedValue(mockData);

    const { result } = renderHook(() => useFetchEmissions());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.emissions).toEqual([]);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.emissions).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(mockedFetchEmissions).toHaveBeenCalledTimes(1);
  });

  it("should set error when fetchEmissions throws", async () => {
    const errorMessage = "API failed";
    mockedFetchEmissions.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useFetchEmissions());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.emissions).toEqual([]);
  });
});

jest.mock("../utils/fetchEmissions");


describe("useFetchEmission hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches data and calculates totals/chart data", async () => {
    const mockData = [
      { emissions_id: 1, emission_rate: "10", updated_at: new Date().toISOString() },
      { emissions_id: 2, emission_rate: "5", updated_at: new Date().toISOString() }
    ];
    mockedFetchEmissions.mockResolvedValue(mockData);

    const { result } = renderHook(() => useFetchEmission());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.todayTotal).toBeCloseTo(15);
    expect(result.current.monthTotal).toBeCloseTo(15);
    expect(result.current.barData.length).toBe(12); 
    expect(result.current.lineData.length).toBe(24); 
  });

  it("handles empty emission data", async () => {
    mockedFetchEmissions.mockResolvedValue([]);

    const { result } = renderHook(() => useFetchEmission());

    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(result.current.todayTotal).toBeNull();
    expect(result.current.monthTotal).toBeNull();
    expect(result.current.barData).toEqual([]);
    expect(result.current.lineData).toEqual([]);
  });

  it("sets error when fetch fails", async () => {
    const errorMessage = "Network failure";
    mockedFetchEmissions.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useFetchEmission());

    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(result.current.error).toBe(errorMessage);
  });
});

