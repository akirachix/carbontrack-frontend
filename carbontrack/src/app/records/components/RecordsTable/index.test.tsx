import { render, screen } from '@testing-library/react';
import RecordsTable from './index';

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
    energy_type: 'Natural gas',
    energy_amount: '200',
    energy_amount_unit: 'm³',
    tea_processed_amount: '75',
    tea_processed_amount_unit: 'kg',
    created_at: '2/20/2023',
    co2_equivalent: '40',
    co2_equivalent_unit: 'kg',
  },
  {
    data_id: 3,
    energy_type: 'Solar',
    energy_amount: '150',
    energy_amount_unit: 'kWh',
    tea_processed_amount: '60',
    tea_processed_amount_unit: 'kg',
    created_at: '3/25/2023',
    co2_equivalent: '0',
    co2_equivalent_unit: 'kg',
  },
];

describe('RecordsTable', () => {
  it('displays records correctly', () => {
    render(<RecordsTable records={mockRecords} />);

    expect(screen.getByText('Energy Type')).toBeInTheDocument();
    expect(screen.getByText('Energy Amount')).toBeInTheDocument();
    expect(screen.getByText('Tea Processed')).toBeInTheDocument();
    expect(screen.getByText('Created At')).toBeInTheDocument();
    expect(screen.getByText('CO2 Equivalent')).toBeInTheDocument();

    expect(screen.getByText('Electricity')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument(); 
    expect(screen.getByText('50')).toBeInTheDocument();  
    expect(screen.getByText('1/15/2023')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();  

    expect(screen.getByText('Natural gas')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();  
    expect(screen.getByText('75')).toBeInTheDocument(); 
    expect(screen.getByText('2/20/2023')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();  
    
    expect(screen.getByText('Solar')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();  
    expect(screen.getByText('60')).toBeInTheDocument();  
    expect(screen.getByText('3/25/2023')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();   
  });

  it('displays empty message when no records', () => {
    render(<RecordsTable records={[]} />);
    expect(screen.getByText('No records found.')).toBeInTheDocument(); 
  });
});