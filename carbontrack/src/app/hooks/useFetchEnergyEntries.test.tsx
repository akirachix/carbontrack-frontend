import { renderHook, waitFor } from '@testing-library/react';
import useFetchEnergy from './useFetchEnergyEntries';
import { fetchEnergy } from '../utils/fetchEnergyEntries';
import { EnergyType } from './useFetchEnergyEntries';
jest.mock('../utils/fetchEnergyEntries');
const mockedFetchEnergy = fetchEnergy as jest.MockedFunction<typeof fetchEnergy>;
describe('useFetchEnergy', () => {
  const mockEnergyData: EnergyType[] = [
    {
      data_id: 1,
      energy_type: 'Electricity',
      energy_amount: '1000',
      co2_equivalent: '500',
      tea_processed_amount: '200',
      created_at: '2023-01-01',
      updated_at: '2023-01-02',
      factory: 1,
    },
    {
      data_id: 2,
      energy_type: 'Natural Gas',
      energy_amount: '500',
      co2_equivalent: '300',
      tea_processed_amount: '150',
      created_at: '2023-02-01',
      updated_at: '2023-02-02',
      factory: 2,
    },
  ];
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useFetchEnergy());
    expect(result.current.energy).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });
  it('should fetch energy data on mount', async () => {
    mockedFetchEnergy.mockResolvedValue(mockEnergyData);
    const { result } = renderHook(() => useFetchEnergy());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockedFetchEnergy).toHaveBeenCalledTimes(1);
    expect(result.current.energy).toEqual(mockEnergyData);
    expect(result.current.error).toBeNull();
  });
  it('should handle fetch error', async () => {
    mockedFetchEnergy.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useFetchEnergy());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.energy).toEqual([]);
    expect(result.current.error).toBe('Network error');
  });
  it('should handle empty response', async () => {
    mockedFetchEnergy.mockResolvedValue(null);
    const { result } = renderHook(() => useFetchEnergy());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.energy).toEqual([]);
    expect(result.current.error).toBeNull();
  });
  it('should handle response with results property', async () => {
    mockedFetchEnergy.mockResolvedValue({ results: mockEnergyData });
    const { result } = renderHook(() => useFetchEnergy());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.energy).toEqual(mockEnergyData);
    expect(result.current.error).toBeNull();
  });
  it('should handle response without results property', async () => {
    mockedFetchEnergy.mockResolvedValue(mockEnergyData);
    const { result } = renderHook(() => useFetchEnergy());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.energy).toEqual(mockEnergyData);
    expect(result.current.error).toBeNull();
  });
  it('should handle undefined response', async () => {
    mockedFetchEnergy.mockResolvedValue(undefined);
    const { result } = renderHook(() => useFetchEnergy());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.energy).toEqual([]);
    expect(result.current.error).toBeNull();
  });
  it('should handle empty array response', async () => {
    mockedFetchEnergy.mockResolvedValue([]);
    const { result } = renderHook(() => useFetchEnergy());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.energy).toEqual([]);
    expect(result.current.error).toBeNull();
  });
  it('should handle response with empty results property', async () => {
    mockedFetchEnergy.mockResolvedValue({ results: [] });
    const { result } = renderHook(() => useFetchEnergy());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.energy).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});






