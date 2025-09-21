import { renderHook, waitFor } from "@testing-library/react";
import useFetchEmissions from "./useFetchEmissions";
import { fetchEmissions } from "../utils/fetchEmissions";
jest.mock("../utils/fetchEmissions");
const mockEmissionsData = [
  {
    emissions_id: 1,
    emission_rate: "2.5",
    mcu: "MCU-001",
    mcu_device_id: "DEV-001",
    updated_at: "2025-09-18T10:00:00.000Z",
  },
  {
    emissions_id: 2,
    emission_rate: "1.8",
    mcu: "MCU-002",
    mcu_device_id: "DEV-002",
    updated_at: "2025-09-18T14:00:00.000Z",
  },
];
describe("useFetchEmissions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("Loading State", () => {
    it("should have loading state initially", () => {
      const { result } = renderHook(() => useFetchEmissions());
      expect(result.current.loading).toBe(true);
      expect(result.current.emissions).toEqual([]);
      expect(result.current.error).toBeNull();
    });
    it("should set loading to false after data fetch", async () => {
      (fetchEmissions as jest.Mock).mockResolvedValue(mockEmissionsData);
      const { result } = renderHook(() => useFetchEmissions());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.emissions).toEqual(mockEmissionsData);
      });
    });
  });
  describe("Empty State", () => {
    it("should return empty array when API returns empty data", async () => {
      (fetchEmissions as jest.Mock).mockResolvedValue([]);
      const { result } = renderHook(() => useFetchEmissions());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.emissions).toEqual([]);
        expect(result.current.error).toBeNull();
      });
    });
    it("should return empty array when API returns null", async () => {
      (fetchEmissions as jest.Mock).mockResolvedValue(null);
      const { result } = renderHook(() => useFetchEmissions());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.emissions).toEqual([]);
        expect(result.current.error).toBeNull();
      });
    });
  });
  describe("Error State", () => {
    it("should handle API fetch error", async () => {
      const errorMessage = "Network error";
      (fetchEmissions as jest.Mock).mockRejectedValue(new Error(errorMessage));
      const { result } = renderHook(() => useFetchEmissions());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.emissions).toEqual([]);
      });
    });
    it("should handle API server error with custom message", async () => {
      const errorMessage = "Server error: 500";
      (fetchEmissions as jest.Mock).mockRejectedValue(new Error(errorMessage));
      const { result } = renderHook(() => useFetchEmissions());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.emissions).toEqual([]);
      });
    });
  });
  describe("Success State", () => {
    it("should load emissions data successfully", async () => {
      (fetchEmissions as jest.Mock).mockResolvedValue(mockEmissionsData);
      const { result } = renderHook(() => useFetchEmissions());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.emissions).toEqual(mockEmissionsData);
        expect(result.current.error).toBeNull();
      });
    });
    it("should handle data with emissions property", async () => {
      const dataWithEmissions = { emissions: mockEmissionsData };
      (fetchEmissions as jest.Mock).mockResolvedValue(dataWithEmissions);
      const { result } = renderHook(() => useFetchEmissions());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.emissions).toEqual(mockEmissionsData);
        expect(result.current.error).toBeNull();
      });
    });
    it("should handle data without emissions property", async () => {
      (fetchEmissions as jest.Mock).mockResolvedValue(mockEmissionsData);
      const { result } = renderHook(() => useFetchEmissions());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.emissions).toEqual(mockEmissionsData);
        expect(result.current.error).toBeNull();
      });
    });
  });
});






