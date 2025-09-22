import { renderHook, act } from "@testing-library/react";
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
      created_at: "2023-01-01",
    },
    {
      factory_id: 2,
      factory_name: "Factory B",
      factory_location: "Location B",
      created_at: "2023-02-01",
    },
  ];
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should initialize with default state", () => {
    const { result } = renderHook(() => useFetchFactories());
    expect(result.current.factories).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });
  it("should fetch factories data on mount", async () => {
    mockedFetchFactories.mockResolvedValue(mockFactories);
    const { result } = renderHook(() => useFetchFactories());
    await act(async () => {});
    expect(mockedFetchFactories).toHaveBeenCalledTimes(1);
    expect(result.current.factories).toEqual(mockFactories);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });
  it("should handle fetch error", async () => {
    const errorMessage = "Network error";
    mockedFetchFactories.mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => useFetchFactories());
    await act(async () => {});
    expect(result.current.factories).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.loading).toBe(false);
  });
  it("should handle empty response (null)", async () => {
    mockedFetchFactories.mockResolvedValue(null);
    const { result } = renderHook(() => useFetchFactories());
    await act(async () => {});
    expect(result.current.factories).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });
  it("should handle response with results property", async () => {
    mockedFetchFactories.mockResolvedValue({ results: mockFactories });
    const { result } = renderHook(() => useFetchFactories());
    await act(async () => {});
    expect(result.current.factories).toEqual(mockFactories);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });
  it("should handle undefined response", async () => {
    mockedFetchFactories.mockResolvedValue(undefined);
    const { result } = renderHook(() => useFetchFactories());
    await act(async () => {});
    expect(result.current.factories).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});






