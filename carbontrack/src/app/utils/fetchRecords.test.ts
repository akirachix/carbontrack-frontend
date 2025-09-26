import { fetchRecords, saveRecord } from './fetchRecords';
import { EnergyEntryData } from '../types';

global.fetch = jest.fn();

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0,
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('API Functions', () => {
  const mockFactoryId = 123;
  const mockRecords: EnergyEntryData[] = [
    {
      data_id: 1,
      created_at: '2023-05-15T10:30:00',
      updated_at: '2023-05-15T10:30:00',
      energy_type: 'electricity',
      energy_amount: '100',
      tea_processed_amount: '50',
      co2_equivalent: '50',
      factory: mockFactoryId
    },
    {
      data_id: 2,
      created_at: '2023-05-15T14:45:00',
      updated_at: '2023-05-15T14:45:00',
      energy_type: 'diesel',
      energy_amount: '200',
      tea_processed_amount: '75',
      co2_equivalent: '100',
      factory: mockFactoryId
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(mockFactoryId.toString());
  });

  describe('fetchRecords', () => {
    test('should fetch records successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockRecords),
      } as any;
      
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchRecords();

      expect(fetch).toHaveBeenCalledWith(`/api/energy_entries?factory=${mockFactoryId}`);
      expect(mockResponse.json).toHaveBeenCalled();
      expect(result).toEqual(mockRecords);
    });

    test('should throw error when factoryId is not found in localStorage', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      await expect(fetchRecords()).rejects.toThrow('Factory ID not found in localStorage');
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should throw error when response is not ok', async () => {
      const mockResponse = {
        ok: false,
        statusText: 'Not Found',
      } as any;
      
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(fetchRecords()).rejects.toThrow('Something went wrong: Not Found');
    });

    test('should throw error when fetch fails', async () => {
      const errorMessage = 'Network error';
      (fetch as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(fetchRecords()).rejects.toThrow(`Failed to fetch records: ${errorMessage}`);
    });
  });

  describe('saveRecord', () => {
    const mockNewRecord = {
      energy_type: 'firewood',
      energy_amount: '300',
      tea_processed_amount: '100',
      co2_equivalent: '150',
      factory: mockFactoryId
    };

    test('should save record successfully', async () => {
      const mockSavedRecord = {
        ...mockNewRecord,
        data_id: 3,
        created_at: '2023-05-16T09:15:00',
        updated_at: '2023-05-16T09:15:00',
      };
      
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockSavedRecord),
      } as any;
      
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await saveRecord(mockNewRecord);

      expect(fetch).toHaveBeenCalledWith('/api/energy_entries/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockNewRecord),
      });
      expect(mockResponse.json).toHaveBeenCalled();
      expect(result).toEqual(mockSavedRecord);
    });

    test('should throw error when factoryId is not found in localStorage', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      await expect(saveRecord(mockNewRecord)).rejects.toThrow('Factory ID not found in localStorage');
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should throw error when response is not ok', async () => {
      const errorText = 'Invalid data';
      const mockResponse = {
        ok: false,
        status: 400,
        text: jest.fn().mockResolvedValue(errorText),
      } as any;
      
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(saveRecord(mockNewRecord)).rejects.toThrow(`HTTP 400: ${errorText}`);
      expect(mockResponse.text).toHaveBeenCalled();
    });

    test('should throw error when fetch fails', async () => {
      const errorMessage = 'Network error';
      (fetch as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(saveRecord(mockNewRecord)).rejects.toThrow(`Failed to save record: ${errorMessage}`);
    });
  });
});