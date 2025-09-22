import { renderHook, waitFor } from '@testing-library/react';
import {fetchFactories} from '../utils/fetchFactories';
import { useFetchFactories } from './useFetchFactories';

jest.mock('../utils/fetchFactories');

describe('useFetchFactories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads factories successfully', async () => {
    const mockData = [{ factory_id: '1', factory_name: 'Factory A' }];
    (fetchFactories as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useFetchFactories());

    expect(result.current.loadingFactories).toBe(true);

    await waitFor(() => expect(result.current.loadingFactories).toBe(false));

    expect(result.current.factories).toEqual(mockData);
    expect(result.current.factoryError).toBeNull();
  });

  it('sets error when fetchFactories throws', async () => {
    (fetchFactories as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

    const { result } = renderHook(() => useFetchFactories());

    expect(result.current.loadingFactories).toBe(true);

    await waitFor(() => expect(result.current.loadingFactories).toBe(false));

    expect(result.current.factoryError).toBe('Failed to fetch');
    expect(result.current.factories).toEqual([]);
  });
});
