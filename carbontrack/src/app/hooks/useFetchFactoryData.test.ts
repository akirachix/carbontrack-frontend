import { renderHook, waitFor, act } from '@testing-library/react';
import useFactoryEmissions from './useFetchFactoryData';
import { fetchEmissions } from '../utils/fetchEmissions';
import { fetchFactories } from '../utils/fetchFactories';
import { fetchMcus } from '../utils/fetchMcu';
import { fetchEnergyEntries } from '../utils/fetchEnergyEntries';

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
  fetchEnergyEntries: jest.fn(),
}));

const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

describe('useFactoryEmissions', () => {
  const mockEmissions = [
    { emissions_id: 1, mcu: '101', mcu_device_id: '101', emission_rate: '0.5', created_at: '2023-01-01T10:00:00Z', updated_at: '2023-01-01T10:00:00Z' },
    { emissions_id: 2, mcu: '102', mcu_device_id: '102', emission_rate: '0.3', created_at: '2023-01-01T10:00:00Z', updated_at: '2023-01-01T10:00:00Z' }
  ];

  const mockFactories = [
    { factory_id: 1, factory_name: 'Factory A', factory_location: 'Location A', created_at: '2023-01-01T10:00:00Z', updated_at: '2023-01-01T10:00:00Z' },
    { factory_id: 2, factory_name: 'Factory B', factory_location: 'Location B', created_at: '2023-01-01T10:00:00Z', updated_at: '2023-01-01T10:00:00Z' }
  ];

  const mockMcus = [
    { mcu_id: '101', factory: 1, created_at: '2023-01-01T10:00:00Z', updated_at: '2023-01-01T10:00:00Z' },
    { mcu_id: '102', factory: 2, created_at: '2023-01-01T10:00:00Z', updated_at: '2023-01-01T10:00:00Z' }
  ];

  const mockEnergyEntries = [
    { factory: 1, co2_equivalent: '10.2', created_at: '2023-01-01T10:00:00Z', updated_at: '2023-01-01T10:00:00Z' },
    { factory: 2, co2_equivalent: '5.7', created_at: '2023-01-01T10:00:00Z', updated_at: '2023-01-01T10:00:00Z' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (fetchEmissions as jest.Mock).mockResolvedValue(mockEmissions);
    (fetchFactories as jest.Mock).mockResolvedValue(mockFactories);
    (fetchMcus as jest.Mock).mockResolvedValue(mockMcus);
    (fetchEnergyEntries as jest.Mock).mockResolvedValue(mockEnergyEntries);
  });

  test('should initialize with loading state', () => {
    const { result } = renderHook(() => useFactoryEmissions());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.factoryEmissions).toEqual([]);
  });

  test('should fetch and process data on mount', async () => {
    const { result } = renderHook(() => useFactoryEmissions());
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchEmissions).toHaveBeenCalled();
    expect(fetchFactories).toHaveBeenCalled();
    expect(fetchMcus).toHaveBeenCalled();
    expect(fetchEnergyEntries).toHaveBeenCalled();
    expect(result.current.factoryEmissions).toHaveLength(2);
    expect(result.current.factoryEmissions[0].factoryId).toBe(1);
    expect(result.current.factoryEmissions[0].factoryName).toBe('Factory A');
    expect(result.current.factoryEmissions[0].totalEmission).toBeCloseTo(10.7); 
    expect(result.current.factoryEmissions[0].changePercent).toBe(0); 
    
    expect(result.current.factoryEmissions[1].factoryId).toBe(2);
    expect(result.current.factoryEmissions[1].factoryName).toBe('Factory B');
    expect(result.current.factoryEmissions[1].totalEmission).toBeCloseTo(6.0); 
    expect(result.current.factoryEmissions[1].changePercent).toBe(0);
    expect(result.current.factoryEmissions[0].totalEmission).toBeGreaterThan(result.current.factoryEmissions[1].totalEmission);
    
    expect(result.current.error).toBe(null);
  });

  test('should handle errors when fetching data', async () => {
    (fetchEmissions as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    const { result } = renderHook(() => useFactoryEmissions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.factoryEmissions).toEqual([]);
  });

  test('should filter data when selectedDate is provided', async () => {
    const { result } = renderHook(() => useFactoryEmissions('2023-01-01'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(fetchEmissions).toHaveBeenCalled();
    expect(fetchFactories).toHaveBeenCalled();
    expect(fetchMcus).toHaveBeenCalled();
    expect(fetchEnergyEntries).toHaveBeenCalled();

    expect(result.current.factoryEmissions).toHaveLength(2);
    expect(result.current.factoryEmissions[0].factoryId).toBe(1);
    expect(result.current.factoryEmissions[0].factoryName).toBe('Factory A');
    expect(result.current.factoryEmissions[0].totalEmission).toBeCloseTo(10.7);
    expect(result.current.error).toBe(null);
  });

  test('should return only energy data when no emissions match selected date', async () => {
    const differentDateEmissions = [
      { emissions_id: 1, mcu: '101', mcu_device_id: '101', emission_rate: '0.5', created_at: '2023-02-01T10:00:00Z', updated_at: '2023-01-01T10:00:00Z' },
    ];
    
    const differentDateEnergyEntries = [
      { factory: 1, co2_equivalent: '10.2', created_at: '2023-02-01T10:00:00Z', updated_at: '2023-01-01T10:00:00Z' },
      { factory: 2, co2_equivalent: '5.7', created_at: '2023-02-01T10:00:00Z', updated_at: '2023-01-01T10:00:00Z' },
    ];
    
    (fetchEmissions as jest.Mock).mockResolvedValue(differentDateEmissions);
    (fetchEnergyEntries as jest.Mock).mockResolvedValue(differentDateEnergyEntries);
    
    const { result } = renderHook(() => useFactoryEmissions('2023-01-02')); 
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.factoryEmissions).toHaveLength(2);
    expect(result.current.factoryEmissions[0].totalEmission).toBeCloseTo(10.2);
    expect(result.current.factoryEmissions[1].totalEmission).toBeCloseTo(5.7);
  });
});