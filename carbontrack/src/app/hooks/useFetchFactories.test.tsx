import { renderHook, waitFor } from "@testing-library/react";
import useFetchEnergy from "./useFetchEnergyEntries";
import { EnergyType } from "./useFetchEnergyEntries";
import { fetchEnergy } from "../utils/fetchEnergyEntries";
jest.mock("../utils/fetchEnergyEntries");
const mockedFetchEnergy = fetchEnergy as jest.MockedFunction<typeof fetchEnergy>;
describe("useFetchEnergy", () => {
  const mockEnergyData: EnergyType[] = [
    {
      data_id: 1,
      energy_type: "Electricity",
      energy_amount: "1000",
      co2_equivalent: "500",
      tea_processed_amount: "200",
      created_at: "2023-01-01",
      updated_at: "2023-01-02",
      factory: 1,
    },
    {
      data_id: 2,
      energy_type: "Biomass",
      energy_amount: "2000",
      co2_equivalent: "800",
      tea_processed_amount: "300",
      created_at: "2023-02-01",
      updated_at: "2023-02-02",
      factory: 2,
    },
  ];
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should initialize with default state", () => {
    const { result } = renderHook(() => useFetchEnergy());
    expect(result.current.energy).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });
  it("should fetch energy data on mount", async () => {
    mockedFetchEnergy.mockResolvedValue(mockEnergyData);
    const { result } = renderHook(() => useFetchEnergy());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockedFetchEnergy).toHaveBeenCalledTimes(1);
    expect(result.current.energy).toEqual(mockEnergyData);
    expect(result.current.error).toBeNull();
  });
  it("should handle fetch error", async () => {
    const errorMessage = "Network error";
    mockedFetchEnergy.mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => useFetchEnergy());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.energy).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });
  it("should handle empty response", async () => {
    mockedFetchEnergy.mockResolvedValue(null);
    const { result } = renderHook(() => useFetchEnergy());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.energy).toEqual([]);
    expect(result.current.error).toBeNull();
  });
  it("should handle response with results property", async () => {
    mockedFetchEnergy.mockResolvedValue({ results: mockEnergyData });
    const { result } = renderHook(() => useFetchEnergy());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.energy).toEqual(mockEnergyData);
    expect(result.current.error).toBeNull();
  });
  it("should handle response without results property", async () => {
    mockedFetchEnergy.mockResolvedValue(mockEnergyData);
    const { result } = renderHook(() => useFetchEnergy());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.energy).toEqual(mockEnergyData);
    expect(result.current.error).toBeNull();
  });
  it("should handle undefined response", async () => {
    mockedFetchEnergy.mockResolvedValue(undefined);
    const { result } = renderHook(() => useFetchEnergy());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.energy).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});






