import { render, screen } from '@testing-library/react';
import RecordsTable from './index';

const mockRecords = [
  {
    energy_type: 'Electricity',
    energy_amount: '100',
    tea_processed_amount: '50',
    created_at: '1/15/2023',
    co2_equivalent: '25',
  },
  {
    energy_type: 'Natural gas',
    energy_amount: '200',
    tea_processed_amount: '75',
    created_at: '2/20/2023',
    co2_equivalent: '40',
  },
  {
    energy_type: 'Solar',
    energy_amount: '150',
    tea_processed_amount: '60',
    created_at: '3/25/2023',
    co2_equivalent: '0',
  },
];

describe('RecordsTable', () => {
  it('displays records correctly', () => {
    render(<RecordsTable records={mockRecords} />);

    // Header columns
    expect(screen.getByText('Energy Type')).toBeInTheDocument();
    expect(screen.getByText('Energy Amount')).toBeInTheDocument();
    expect(screen.getByText('Tea Processed')).toBeInTheDocument();
    expect(screen.getByText('Created At')).toBeInTheDocument();
    expect(screen.getByText('CO2 Equivalent')).toBeInTheDocument();

    // Row values (with " kg" for processed and CO2)
    expect(screen.getByText('Electricity')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('50 kg')).toBeInTheDocument();
    expect(screen.getByText('1/15/2023')).toBeInTheDocument();
    expect(screen.getByText('25 kg')).toBeInTheDocument();

    expect(screen.getByText('Natural gas')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('75 kg')).toBeInTheDocument();
    expect(screen.getByText('2/20/2023')).toBeInTheDocument();
    expect(screen.getByText('40 kg')).toBeInTheDocument();

    expect(screen.getByText('Solar')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('60 kg')).toBeInTheDocument();
    expect(screen.getByText('3/25/2023')).toBeInTheDocument();
    expect(screen.getByText('0 kg')).toBeInTheDocument();
  });

  it('displays empty message when no records', () => {
    render(<RecordsTable records={[]} />);
    expect(screen.getByText('No records found.')).toBeInTheDocument();
  });
});