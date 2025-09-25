import { render, screen, act } from '@testing-library/react';
import { useFetchRecords } from '../hooks/useFetchRecords';
import { fetchRecords } from '../utils/fetchRecords';

jest.mock('../utils/fetchRecords');

const TestComponent = () => {
  const { records, loading, error } = useFetchRecords();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {records.map(record => (
        <div key={record.data_id}>{record.energy_type}</div>
      ))}
    </div>
  );
};

describe('useFetchRecords', () => {

  const mockRecords = [
    { 
      data_id: 1, 
      energy_type: 'Electricity',
      energy_amount: '100',
      energy_amount_unit: 'kWh',
      tea_processed_amount: '50',
      tea_processed_amount_unit: 'kg',
      created_at: '1/15/2023',
      co2_equivalent: '25',
      co2_equivalent_unit: 'kg',
    },
    { 
      data_id: 2, 
      energy_type: 'Natural Gas',
      energy_amount: '200',
      energy_amount_unit: 'm³',
      tea_processed_amount: '75',
      tea_processed_amount_unit: 'kg',
      created_at: '2/20/2023',
      co2_equivalent: '40',
      co2_equivalent_unit: 'kg',
    },
  ];

  beforeEach(() => {
    (fetchRecords as jest.Mock).mockClear();
  });

  it('fetches records successfully', async () => {
    (fetchRecords as jest.Mock).mockResolvedValue(mockRecords);
    
    await act(async () => {
      render(<TestComponent />);
    });
    
    expect(screen.getByText('Electricity')).toBeInTheDocument();
    expect(screen.getByText('Natural Gas')).toBeInTheDocument();
  });

  it('handles loading state', async () => {
    (fetchRecords as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockRecords), 100))
    );
    
    await act(async () => {
      render(<TestComponent />);
    });
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });
    
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByText('Electricity')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    const errorMessage = 'Failed to fetch records';
    (fetchRecords as jest.Mock).mockRejectedValue(new Error(errorMessage));
    
    await act(async () => {
      render(<TestComponent />);
    });
    
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });
});