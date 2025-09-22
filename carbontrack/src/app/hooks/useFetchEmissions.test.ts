import { renderHook, act, waitFor } from "@testing-library/react";
import useFetchEmissions from "../hooks/useFetchEmissions";
import { fetchEmissions } from "../utils/fetchEmissions";

jest.mock("../utils/fetchEmissions");

const mockEmissions = [
  {
    emissions_id: 1,
    emission_rate: "2.5",
    updated_at: "2025-09-19T10:00:00Z",
  },
  {
    emissions_id: 2,
    emission_rate: "1.5",
    updated_at: "2025-09-19T14:00:00Z",
  },
];

describe("useFetchEmissions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });


  it("handles API failure", async () => {
    (fetchEmissions as jest.Mock).mockRejectedValue(new Error("fail"));

    const { result } = renderHook(() => useFetchEmissions());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("fail");
    expect(result.current.todayTotal).toBeNull();
    expect(result.current.monthTotal).toBeNull();
    expect(result.current.barData).toEqual([]);
    expect(result.current.lineData).toEqual([]);
  });

  it("recalculates totals when selectedDate changes", async () => {
    (fetchEmissions as jest.Mock).mockResolvedValue(mockEmissions);
    const { result } = renderHook(() => useFetchEmissions());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setSelectedDate(new Date("2025-09-18T00:00:00Z"));
    });

    expect(result.current.todayTotal).toBe(0);
    expect(result.current.lineData.every(d => d.value === 0)).toBe(true);
  });

 it("handles empty response", async () => {
  (fetchEmissions as jest.Mock).mockResolvedValue([]); 
  const { result } = renderHook(() => useFetchEmissions());
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.error).toBeNull();
  expect(result.current.todayTotal).toBe(null);
  expect(result.current.monthTotal).toBe(null);
  expect(result.current.barData).toEqual([]);
  expect(result.current.lineData).toEqual([]);
});


  it("shows loading state initially", () => {
    (fetchEmissions as jest.Mock).mockImplementation(() => new Promise(() => {}));
     
    const { result } = renderHook(() => useFetchEmissions());
    expect(result.current.loading).toBe(true);
  });
  
  it("sets error state correctly when fetchEmissions fails", async () => {
    (fetchEmissions as jest.Mock).mockRejectedValue(new Error("Network Error"));
    const { result } = renderHook(() => useFetchEmissions());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Network Error");
    expect(result.current.todayTotal).toBeNull();
    expect(result.current.monthTotal).toBeNull();
    expect(result.current.barData).toEqual([]);
    expect(result.current.lineData).toEqual([]);
  });


});