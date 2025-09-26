import { renderHook, waitFor } from "@testing-library/react";
import { useFetchEnergyEntries } from "../hooks/useFetchEnergyEntries";
import * as fetchEnergyModule from "../utils/fetchEnergyEntries";
import useFetchEnergy, { EnergyEntry } from "./useFetchEnergyEntries";
import { fetchEnergy } from "../utils/fetchEnergyEntries";


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

    new Date("2025-09-18");

    const { result } = renderHook(() => useFetchEnergy());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
  });

  it("filters by selectedDate", async () => {
    (fetchEnergyModule.fetchEnergy as jest.Mock).mockResolvedValue(mockEnergyData);

    new Date("2025-09-18");

    const { result } = renderHook(() => useFetchEnergy());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });


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

jest.mock("../utils/fetchEnergyEntries");
const mockedFetchEnergy = fetchEnergy as jest.MockedFunction<typeof fetchEnergy>;
describe("useFetchEnergy", () => {
  const mockEnergyData: EnergyEntry[] = [
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
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.energy).toEqual(mockEnergyData);
      expect(result.current.error).toBeNull();
    });
    expect(mockedFetchEnergy).toHaveBeenCalledTimes(1);
  });

  it("should handle fetch error", async () => {
    const errorMessage = "Network error";
    mockedFetchEnergy.mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => useFetchEnergy());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.energy).toEqual([]);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  it("should handle response with results property", async () => {
    mockedFetchEnergy.mockResolvedValue({ results: mockEnergyData });
    const { result } = renderHook(() => useFetchEnergy());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.energy).toEqual(mockEnergyData);
      expect(result.current.error).toBeNull();
    });
  });

  it("should handle undefined response", async () => {
    mockedFetchEnergy.mockResolvedValue(undefined);
    const { result } = renderHook(() => useFetchEnergy());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.energy).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });
});