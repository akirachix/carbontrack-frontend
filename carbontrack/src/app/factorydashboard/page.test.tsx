import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from './page';
import useFetchEmissions from '../hooks/useFetchEmissions';
import { useFetchEnergyEntries } from '../hooks/useFetchEnergyEntries';

jest.mock('../hooks/useFetchEmissions');
jest.mock('../hooks/useFetchEnergyEntries');
jest.mock('../components/FactoryLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('react-datepicker', () => ({
  __esModule: true,
  default: ({ selected, onChange }: any) => (
    <input
      data-testid="date-picker"
      value={selected ? selected.toISOString().split('T')[0] : ''}
      onChange={(e) => onChange(new Date(e.target.value))}
    />
  ),
}));

jest.mock('recharts', () => ({
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
}));

describe('DashboardPage Component', () => {
  const mockSetSelectedDate = jest.fn();
  const mockSelectedDate = new Date('2023-05-15');

  beforeEach(() => {
    jest.clearAllMocks();
    (useFetchEmissions as jest.Mock).mockReturnValue({
      selectedDate: mockSelectedDate,
      setSelectedDate: mockSetSelectedDate,
      barData: [{ month: 'Jan', value: 10 }, { month: 'Feb', value: 20 }],
      lineData: [{ time: '00:00', value: 5 }, { time: '01:00', value: 7 }],
      loading: false,
      todayTotal: 0.123456,
      monthTotal: 3.456789,
    });

    (useFetchEnergyEntries as jest.Mock).mockReturnValue({
      totalCO2: 2.345678,
      error: null,
    });
  });

  test('displays emission data correctly', () => {
    render(<DashboardPage />);
    expect(screen.getByText('0.123456 kgs')).toBeInTheDocument();
    expect(screen.getByText('3.456789 kgs')).toBeInTheDocument();
    expect(screen.getByText('2.345678 kgs')).toBeInTheDocument();
  });


  test('handles no data state', () => {
    (useFetchEmissions as jest.Mock).mockReturnValue({
      ...useFetchEmissions(),
      todayTotal: null,
      monthTotal: null,
    });

    (useFetchEnergyEntries as jest.Mock).mockReturnValue({
      ...useFetchEnergyEntries(mockSelectedDate),
      totalCO2: null,
    });
    render(<DashboardPage />);
    expect(screen.getAllByText('No data')).toHaveLength(3);
  });

  test('handles energy loading state', () => {
    (useFetchEnergyEntries as jest.Mock).mockReturnValue({
      ...useFetchEnergyEntries(mockSelectedDate),
      totalCO2: null,
      error: true,
    });
    render(<DashboardPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('updates date when date picker changes', () => {
    render(<DashboardPage />);
    const datePicker = screen.getByTestId('date-picker');
    fireEvent.change(datePicker, { target: { value: '2023-06-20' } });
    expect(mockSetSelectedDate).toHaveBeenCalledWith(new Date('2023-06-20'));
  });


  test('renders charts with data', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getAllByTestId('x-axis')).toHaveLength(2);
    expect(screen.getAllByTestId('y-axis')).toHaveLength(2);
    expect(screen.getAllByTestId('grid')).toHaveLength(2);
    expect(screen.getAllByTestId('tooltip')).toHaveLength(2);
  });

  test('formats numbers correctly', () => {
    render(<DashboardPage />);
    expect(screen.getByText('0.123456 kgs')).toBeInTheDocument();
    expect(screen.getByText('3.456789 kgs')).toBeInTheDocument();
    expect(screen.getByText('2.345678 kgs')).toBeInTheDocument();
  });

  test('handles empty chart data', () => {
    (useFetchEmissions as jest.Mock).mockReturnValue({
      ...useFetchEmissions(),
      barData: [],
      lineData: [],
    });
    render(<DashboardPage />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });
});