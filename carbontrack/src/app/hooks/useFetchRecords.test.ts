import { renderHook, act } from "@testing-library/react";
import { useFetchRecords } from "./useFetchRecords";
import { fetchRecords } from "../utils/fetchRecords";
import { EnergyEntryData } from "../types";

jest.mock("../utils/fetchRecords");

const mockFetchRecords = fetchRecords as jest.MockedFunction<typeof fetchRecords>;

const mockRecords: EnergyEntryData[] = [
  {
    data_id: 1,
    created_at: "2023-05-15T10:30:00",
    updated_at: "2023-05-15T10:30:00",
    energy_type: "electricity",
    energy_amount: "100",
    tea_processed_amount: "50",
    co2_equivalent: "50",
    factory: 123,
  },
  {
    data_id: 2,
    created_at: "2023-05-15T14:45:00",
    updated_at: "2023-05-15T14:45:00",
    energy_type: "diesel",
    energy_amount: "200",
    tea_processed_amount: "75",
    co2_equivalent: "100",
    factory: 123,
  },
  {
    data_id: 3,
    created_at: "2023-05-16T09:15:00",
    updated_at: "2023-05-16T09:15:00",
    energy_type: "firewood",
    energy_amount: "300",
    tea_processed_amount: "100",
    co2_equivalent: "150",
    factory: 456,
  },
];

describe("useFetchRecords Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should initialize with default values", () => {
    const { result } = renderHook(() =>
      useFetchRecords(null, null, "day")
    );
    expect(result.current.records).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.noDataForDate).toBe(false);
  });

  test("should fetch records organized", async () => {
    mockFetchRecords.mockResolvedValue(mockRecords);

    const { result } = renderHook(() =>
      useFetchRecords(123, null, "day")
    );
    expect(result.current.loading).toBe(true);
    expect(result.current.records).toEqual([]);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.records).toEqual(mockRecords);
    expect(result.current.error).toBeNull();
    expect(mockFetchRecords).toHaveBeenCalledTimes(1);
  });

  test("should handle fetch error", async () => {
    const errorMessage = "Failed to fetch records";
    mockFetchRecords.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() =>
      useFetchRecords(123, null, "day")
    );
    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.records).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
    expect(mockFetchRecords).toHaveBeenCalledTimes(1);
  });

  test("should handle empty records from API", async () => {
    mockFetchRecords.mockResolvedValue([]);

    const { result } = renderHook(() => useFetchRecords(123, null, "day"));

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.records).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.noDataForDate).toBe(false);
  });
});