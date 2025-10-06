import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from './page';
import { useFetchEmission } from '../hooks/useFetchEmissions';
import { useFetchEnergyEntries } from '../hooks/useFetchEnergyEntries';

jest.mock('mqtt', () => ({
  connect: jest.fn(() => ({
    on: jest.fn(),
    subscribe: jest.fn(),
    publish: jest.fn(),
    end: jest.fn(),
  })),
}));

jest.mock('../hooks/useFetchEmissions');
jest.mock('../hooks/useFetchEnergyEntries');

jest.mock('../components/FactoryLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('recharts', () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid={`link-${href}`}>
      {children}
    </a>
  )
}));

jest.mock('../sharedComponents/CalendarFactory', () => ({
  __esModule: true,
  default: ({
    selectedDate,
    setSelectedDate,
  }: {
    selectedDate: Date | null;
    setSelectedDate: (date: Date) => void;
  }) => (
    <input
      data-testid="date-picker"
      value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
      onChange={(e) => setSelectedDate(new Date((e.target as HTMLInputElement).value))}
    />
  ),
}));

jest.mock('../hivemq/mqtt_client', () => ({
  __esModule: true,
  default: () => <div data-testid="mqtt-subscriber"></div>,
}));

describe('DashboardPage Component', () => {
  const mockSetSelectedDate = jest.fn();
  const mockSelectedDate = new Date('2023-05-15');

  beforeEach(() => {
    jest.clearAllMocks();
    (useFetchEmission as jest.Mock).mockReturnValue({
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
    expect(screen.getByText("Today's total CO2 emissions")).toBeInTheDocument();
    expect(screen.getByText("This month total CO2 emissions")).toBeInTheDocument();
    expect(screen.getByText("Indirect Emissions")).toBeInTheDocument();
    expect(screen.getByText('0.123456 kgs')).toBeInTheDocument();
    expect(screen.getByText('3.456789 kgs')).toBeInTheDocument();
    expect(screen.getByText('2.345678 kgs')).toBeInTheDocument();
  });

  test('handles no data state', () => {
    (useFetchEmission as jest.Mock).mockReturnValue({
      selectedDate: mockSelectedDate,
      setSelectedDate: mockSetSelectedDate,
      barData: [{ month: 'Jan', value: 10 }, { month: 'Feb', value: 20 }],
      lineData: [{ time: '00:00', value: 5 }, { time: '01:00', value: 7 }],
      loading: false,
      todayTotal: null,
      monthTotal: null,
    });

    (useFetchEnergyEntries as jest.Mock).mockReturnValue({
      totalCO2: null,
      error: null,
    });

    render(<DashboardPage />);
    expect(screen.getAllByText('No data')).toHaveLength(3);
  });

  test('handles energy loading state', () => {
    (useFetchEnergyEntries as jest.Mock).mockReturnValue({
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
    expect(screen.getAllByTestId('line-chart').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getAllByTestId('x-axis').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByTestId('y-axis').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByTestId('grid').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByTestId('tooltip').length).toBeGreaterThanOrEqual(1);
  });

  test('formats numbers correctly', () => {
    render(<DashboardPage />);
    expect(screen.getByText('0.123456 kgs')).toBeInTheDocument();
    expect(screen.getByText('3.456789 kgs')).toBeInTheDocument();
    expect(screen.getByText('2.345678 kgs')).toBeInTheDocument();
  });

  test('handles empty chart data', () => {
    (useFetchEmission as jest.Mock).mockReturnValue({
      selectedDate: mockSelectedDate,
      setSelectedDate: mockSetSelectedDate,
      barData: [],
      lineData: [],
      loading: false,
      todayTotal: 0.123456,
      monthTotal: 3.456789,
    });
    render(<DashboardPage />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getAllByTestId('line-chart').length).toBeGreaterThanOrEqual(1);
  });
});
