import { renderHook, act } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { useFetchEmission } from '../hooks/useFetchEmissions';


jest.mock('../utils/fetchEmissions');
import { fetchEmissions } from '../utils/fetchEmissions';
describe('useFetchEmission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('initially sets loading to true', () => {
    (fetchEmissions as jest.Mock).mockResolvedValue([]);
    const { result } = renderHook(() => useFetchEmission());
    expect(result.current.loading).toBe(true);
  });
  it('fetches empty emissions array and resets computed data', async () => {
    (fetchEmissions as jest.Mock).mockResolvedValue([]);
    const { result } = renderHook(() => useFetchEmission());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.todayTotal).toBeNull();
    expect(result.current.monthTotal).toBeNull();
    expect(result.current.barData).toEqual([]);
    expect(result.current.lineData).toEqual([]);
  });
  it('sets error on fetch failure', async () => {
    (fetchEmissions as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    const { result } = renderHook(() => useFetchEmission());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Failed to fetch');
    expect(result.current.todayTotal).toBeNull();
    expect(result.current.monthTotal).toBeNull();
  });
  it('updates totals when selectedDate changes', async () => {
    const mockData = [
      { emissions_id: 1, emission_rate: '15', updated_at: '2025-09-23T10:00:00Z' },
      { emissions_id: 2, emission_rate: '25', updated_at: '2025-09-24T10:00:00Z' }
    ];
    (fetchEmissions as jest.Mock).mockResolvedValue(mockData);
    const { result } = renderHook(() => useFetchEmission());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => {
      result.current.setSelectedDate(new Date('2025-09-24T00:00:00Z'));
    });
    expect(result.current.todayTotal).toBeCloseTo(25);
    expect(result.current.monthTotal).toBeCloseTo(40);
  });
});