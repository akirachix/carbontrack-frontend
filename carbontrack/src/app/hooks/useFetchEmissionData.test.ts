import { renderHook, act, waitFor } from '@testing-library/react';
import { useEmissionsData } from './useFetchEmissionData';
import { fetchEmissions } from '../utils/fetchEmissions';
import { fetchFactories } from '../utils/fetchFactories';
import { fetchMcus } from '../utils/fetchMcu';
import { fetchEnergy } from '../utils/fetchEnergyEntries';
import { processEmissionData } from '../utils/fetchEmissionData';

jest.mock('../utils/fetchEmissions', () => ({
  fetchEmissions: jest.fn(),
}));
jest.mock('../utils/fetchFactories', () => ({
  fetchFactories: jest.fn(),
}));
jest.mock('../utils/fetchMcu', () => ({
  fetchMcus: jest.fn(),
}));
jest.mock('../utils/fetchEnergyEntries', () => ({
  fetchEnergy: jest.fn(),
}));
jest.mock('../utils/fetchEmissionData', () => ({
  processEmissionData: jest.fn(),
}));

describe('useEmissionsData', () => {
  const mockEmissions = [
    { emissions_id: 1, mcu: '101', mcu_device_id: '101', emission_rate: '0.5', created_at: '2023-01-01T10:00:00Z', updated_at: '2023-01-01T10:00:00Z' },
    { emissions_id: 2, mcu: '102', mcu_device_id: '102', emission_rate: '0.3', created_at: '2023-01-01T10:00:00Z', updated_at: '2023-01-01T10:00:00Z' }
  ];

  const mockFactories = [
    { factory_id: 1, factory_name: 'Factory A', factory_location: 'Location A', created_at: '2023-01-01T10:00:00Z', updated_at: '2023-01-01T10:00:00Z' },
    { factory_id: 2, factory_name: 'Factory B', factory_location: 'Location B', created_at: '2023-01-01T10:00:00Z', updated_at: '2023-01-01T10:00:00Z' }
  ];

  const mockMcus = [
    { mcu_id: 101, factory: 1, created_at: '2023-01-01T10:00:00Z', updated_at: '2023-01-01T10:00:00Z' },
    { mcu_id: 102, factory: 2, created_at: '2023-01-01T10:00:00Z', updated_at: '2023-01-01T10:00:00Z' }
  ];

  const mockEnergyEntries = [
    { factory: 1, co2_equivalent: '10.2', created_at: '2023-01-01T10:00:00Z', updated_at: '2023-01-01T10:00:00Z' },
    { factory: 2, co2_equivalent: '5.7', created_at: '2023-01-01T10:00:00Z', updated_at: '2023-01-01T10:00:00Z' }
  ];

  const mockProcessedData = [
    { factoryId: 1, factoryName: 'Factory A', totalEmission: 14.5 },
    { factoryId: 2, factoryName: 'Factory B', totalEmission: 6.0 }
  ];

  beforeEach(() => {
    (fetchEmissions as jest.Mock).mockResolvedValue(mockEmissions);
    (fetchFactories as jest.Mock).mockResolvedValue(mockFactories);
    (fetchMcus as jest.Mock).mockResolvedValue(mockMcus);
    (fetchEnergy as jest.Mock).mockResolvedValue(mockEnergyEntries);
    (processEmissionData as jest.Mock).mockReturnValue(mockProcessedData);
  });

  test('should initialize with loading state', () => {
    const { result } = renderHook(() => useEmissionsData());
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.factoryEmissions).toEqual([]);
    expect(result.current.noDataForDate).toBe(false);
  });

  test('should fetch and process data on mount', async () => {
    const { result } = renderHook(() => useEmissionsData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchEmissions).toHaveBeenCalled();
    expect(fetchFactories).toHaveBeenCalled();
    expect(fetchMcus).toHaveBeenCalled();
    expect(fetchEnergy).toHaveBeenCalled();
    expect(processEmissionData).toHaveBeenCalledWith(
      mockEmissions,
      mockFactories,
      mockMcus,
      mockEnergyEntries
    );

    expect(result.current.factoryEmissions).toEqual(mockProcessedData);
    expect(result.current.error).toBe(null);
    expect(result.current.noDataForDate).toBe(false);
  });

  test('should handle errors when fetching data', async () => {
    const errorMessage = 'Failed to fetch data';
    (fetchEmissions as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    (fetchFactories as jest.Mock).mockResolvedValueOnce(mockFactories);
    (fetchMcus as jest.Mock).mockResolvedValueOnce(mockMcus);
    (fetchEnergy as jest.Mock).mockResolvedValueOnce(mockEnergyEntries);

    const { result } = renderHook(() => useEmissionsData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.factoryEmissions).toEqual([]);
  });

  test('should filter data when setSelectedDate is called', async () => {
    const { result } = renderHook(() => useEmissionsData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Use a real Date object as per the hook's API
    act(() => {
      result.current.setSelectedDate(new Date("2023-01-01T10:00:00Z"));
    });

    await waitFor(() => {
      expect(processEmissionData).toHaveBeenCalled();
      expect(result.current.factoryEmissions).toEqual(mockProcessedData);
      expect(result.current.noDataForDate).toBe(false);
    });
  });

  test('should set noDataForDate to true when no data exists for selected date', async () => {
    (processEmissionData as jest.Mock).mockReturnValue([]);
    const { result } = renderHook(() => useEmissionsData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setSelectedDate(new Date("2023-02-01T10:00:00Z"));
    });

    await waitFor(() => {
      expect(result.current.noDataForDate).toBe(true);
      expect(result.current.factoryEmissions).toEqual([]);
    });
  });

  test('should allow changing filterType', async () => {
    const { result } = renderHook(() => useEmissionsData());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setFilterType('month');
    });

    expect(result.current.filterType).toBe('month');
  });
});