import { renderHook, waitFor } from "@testing-library/react";
import useFetchFactories, { FactoryType } from "./useFetchFactories";
import { fetchFactories } from "../utils/fetchFactories";

jest.mock("../utils/fetchFactories");
const mockedFetchFactories = fetchFactories as jest.MockedFunction<typeof fetchFactories>;

describe("useFetchFactories", () => {
  const mockFactories: FactoryType[] = [
    {
      factory_id: 1,
      factory_name: "Factory A",
      factory_location: "Location A",
      created_at: "2025-01-01T00:00:00Z",
    },
    {
      factory_id: 2,
      factory_name: "Factory B",
      factory_location: "Location B",
      created_at: "2025-01-02T00:00:00Z",
    },
  ];
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns factories after successful fetch", async () => {
    mockedFetchFactories.mockResolvedValueOnce({ results: mockFactories });
    const { result } = renderHook(() => useFetchFactories());

    expect(result.current.loading).toBe(true);
    expect(result.current.factories).toEqual([]);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.factories).toEqual(mockFactories);
    expect(result.current.error).toBeNull();
  });

  it("handles fetch error", async () => {
    mockedFetchFactories.mockRejectedValueOnce(new Error("Failed to fetch"));
    const { result } = renderHook(() => useFetchFactories());
    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.factories).toEqual([]);
    expect(result.current.error).toBe("Failed to fetch");
  });

    it("should handle empty response", async () => {
    mockedFetchFactories.mockResolvedValue(null);
    const { result } = renderHook(() => useFetchFactories());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.factories).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });
});
