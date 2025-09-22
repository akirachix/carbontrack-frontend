import { renderHook, waitFor } from "@testing-library/react";
import { useFetchEnergyEntries } from "../hooks/useFetchEnergyEntries";
import * as fetchEnergyModule from "../utils/fetchEnergyEntries";

jest.mock("../utils/fetchEnergyEntries", () => ({
  fetchEnergy: jest.fn(),
}));

const mockEnergyData = [
  {
    factory: 10,
    co2_equivalent: "2.5",
    created_at: "2025-09-18T10:00:00.000Z",
  },
  {
    factory: 10,
    co2_equivalent: "1.5",
    created_at: "2025-09-18T14:00:00.000Z",
  },
  {
    factory: 11,
    co2_equivalent: "5.0",
    created_at: "2025-09-18T09:00:00.000Z",
  },
];

describe("useFetchEnergyEntries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn((key) => (key === "factoryId" ? "10" : null)),
        setItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  it("loads and sums CO₂ emissions for factoryId 10", async () => {
    (fetchEnergyModule.fetchEnergy as jest.Mock).mockResolvedValue(mockEnergyData);

    const selectedDate = new Date("2025-09-18");

    const { result } = renderHook(() => useFetchEnergyEntries(selectedDate));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.totalCO2).toBeCloseTo(4.0);
  });

  it("filters by selectedDate", async () => {
    (fetchEnergyModule.fetchEnergy as jest.Mock).mockResolvedValue(mockEnergyData);

    const selectedDate = new Date("2025-09-18");

    const { result } = renderHook(() => useFetchEnergyEntries(selectedDate));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.totalCO2).toBeCloseTo(4.0);
  });

  it("returns 0 if no entries match factoryId 10", async () => {
    (fetchEnergyModule.fetchEnergy as jest.Mock).mockResolvedValue([
      { factory: 11, co2_equivalent: "5.0", created_at: "2025-09-18T09:00:00.000Z" },
    ]);

    const selectedDate = new Date("2025-09-18");
    const { result } = renderHook(() => useFetchEnergyEntries(selectedDate));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.totalCO2).toBe(0);
  });


  it("handles missing factoryId in localStorage", async () => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });

    (fetchEnergyModule.fetchEnergy as jest.Mock).mockResolvedValue(mockEnergyData);
    const selectedDate = new Date("2025-09-18");
    const { result } = renderHook(() => useFetchEnergyEntries(selectedDate));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBe("Factory ID not found in local storage");
    expect(result.current.totalCO2).toBeNull();
  });

  it("sets error state when fetchEnergy throws an error", async () => {
  const errorMsg = "Network error";
  (fetchEnergyModule.fetchEnergy as jest.Mock).mockRejectedValue(new Error(errorMsg));
  const selectedDate = new Date("2025-09-18");
  const { result } = renderHook(() => useFetchEnergyEntries(selectedDate));

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.error).toBe(errorMsg);
  expect(result.current.totalCO2).toBeNull();
});

it("loading state is true initially", async () => {
  (fetchEnergyModule.fetchEnergy as jest.Mock).mockResolvedValue(mockEnergyData);
  const selectedDate = new Date("2025-09-18");
  const { result } = renderHook(() => useFetchEnergyEntries(selectedDate));
  expect(result.current.loading).toBe(true);
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
});

it("handles empty response", async () => {
  (fetchEnergyModule.fetchEnergy as jest.Mock).mockResolvedValue([]); 
  const selectedDate = new Date("2025-09-18");
  const { result } = renderHook(() => useFetchEnergyEntries(selectedDate));
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
  expect(result.current.error).toBeNull();
  expect(result.current.totalCO2).toBe(0);
});
});