import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { act } from 'react';
import EmissionsHeatmapPage from './page';
import { useEmissionsData } from '../hooks/useFetchEmissionData';
import { blendColors } from '../utils/fetchEmissionData';

jest.mock('../hooks/useFetchEmissionData', () => ({
  useEmissionsData: jest.fn()
}));

jest.mock('../utils/fetchEmissionData', () => ({
  blendColors: jest.fn()
}));

jest.mock('../components/SideBarLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-layout">{children}</div>
  )
}));

jest.mock('../sharedComponents/Calendar', () => ({
  __esModule: true,
  default: ({
    selectedDate,
    setSelectedDate,
  }: {
    selectedDate: Date | null;
    setSelectedDate: (date: Date) => void;
  }) => (
    <div data-testid="calendar">
      <button 
        data-testid="calendar-button"
        onClick={() => setSelectedDate(new Date('2023-01-15'))}
      >
        Select Date
      </button>
      <div>
        Selected: {selectedDate ? 
          `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` 
          : 'None'}
      </div>
    </div>
  )
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid={`link-${href}`}>
      {children}
    </a>
  )
}));

jest.mock('react-icons/io5', () => ({
  IoSettingsOutline: () => <div data-testid="settings-icon">Settings</div>,
  IoPersonOutline: () => <div data-testid="person-icon">Person</div>
}));

describe('EmissionsHeatmapPage', () => {
  const mockFactoryEmissions = [
    { factoryName: 'Factory A', totalEmission: 10.5 },
    { factoryName: 'Factory B', totalEmission: 5.2 },
    { factoryName: 'Factory C', totalEmission: 15.8 },
    { factoryName: 'Factory D', totalEmission: 0 },
    { factoryName: 'Factory E', totalEmission: 3.1 },
  ];

  let mockUseEmissionsData = {
    factoryEmissions: mockFactoryEmissions,
    loading: false,
    error: null,
    selectedDate: null as Date | null,
    setSelectedDate: jest.fn(),
    noDataForDate: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useEmissionsData as jest.Mock).mockReturnValue(mockUseEmissionsData);

    (blendColors as jest.Mock).mockImplementation(
      (color1: string, color2: string, ratio: number): string => {
        if (ratio > 0.7) return '#2A4759';
        if (ratio > 0.4) return '#53BAFA';
        if (ratio > 0.1) return '#BEE3FA';
        return '#FFFFFF';
      }
    );
  });

  test('renders the page title', () => {
    render(<EmissionsHeatmapPage />);
    expect(screen.getByText('Factory Emissions')).toBeInTheDocument();
  });

  test('displays loading state', () => {
    (useEmissionsData as jest.Mock).mockReturnValue({
      ...mockUseEmissionsData,
      loading: true,
    });
    
    render(<EmissionsHeatmapPage />);
    expect(screen.getByText('Loading emissions data...')).toBeInTheDocument();
  });

  test('displays error state', () => {
    const errorMessage = 'Failed to fetch emissions data';
    (useEmissionsData as jest.Mock).mockReturnValue({
      ...mockUseEmissionsData,
      error: errorMessage,
    });
    
    render(<EmissionsHeatmapPage />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('displays no data message', () => {
    (useEmissionsData as jest.Mock).mockReturnValue({
      ...mockUseEmissionsData,
      noDataForDate: true,
    });
    
    render(<EmissionsHeatmapPage />);
    expect(screen.getByText('No emissions data available for the selected date')).toBeInTheDocument();
  });

  test('renders heatmap with factory boxes', () => {
    render(<EmissionsHeatmapPage />);
    const boxes = document.querySelectorAll('.rounded-\\[10px\\]');
    expect(boxes.length).toBeGreaterThan(0);
  });

  test('shows tooltip on hover', async () => {
    render(<EmissionsHeatmapPage />);
    const boxes = document.querySelectorAll('.rounded-\\[10px\\]');
    await act(async () => {
      fireEvent.mouseEnter(boxes[0]);
    });

    expect(screen.getByText('Factory A')).toBeInTheDocument();
    expect(screen.getByText('Emissions: 10.5000 kg/s')).toBeInTheDocument();

    await act(async () => {
      fireEvent.mouseLeave(boxes[0]);
    });

    await waitFor(() => {
      expect(screen.queryByText('Factory A')).not.toBeInTheDocument();
    });
  });

  test('renders legend items', () => {
    render(<EmissionsHeatmapPage />);
    
    expect(screen.getByText('High Emissions')).toBeInTheDocument();
    expect(screen.getByText('Average Emissions')).toBeInTheDocument();
    expect(screen.getByText('Low Emissions')).toBeInTheDocument();
    expect(screen.getByText('No Emissions')).toBeInTheDocument();
  });

  test('renders gradient scale with labels', () => {
    render(<EmissionsHeatmapPage />);

    const totalEmission = mockFactoryEmissions.reduce((sum, item) => sum + item.totalEmission, 0);
    const avgEmission = totalEmission / mockFactoryEmissions.length;
    expect(screen.getByText(`${(avgEmission * 2).toFixed(0)} kg/s`)).toBeInTheDocument();
    expect(screen.getByText(`${avgEmission.toFixed(0)} kg/s`)).toBeInTheDocument();
    expect(screen.getByText(`${(avgEmission * 0.5).toFixed(0)} kg/s`)).toBeInTheDocument();
    const gradientScaleContainer = document.querySelector('.relative.h-\\[320px\\]') as HTMLElement | null;

    if (gradientScaleContainer) {
      const zeroKgS = within(gradientScaleContainer).getByText('0 kg/s');
      expect(zeroKgS).toBeInTheDocument();
    } else {
      const zeroKgSElements = screen.getAllByText('0 kg/s');
      const gradientScaleZero = zeroKgSElements.find(el => 
        el.classList.contains('absolute') && el.classList.contains('left-\\[70px\\]')
      );
      expect(gradientScaleZero).toBeInTheDocument();
    }
  });

  test('handles date selection correctly', async () => {
    render(<EmissionsHeatmapPage />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('calendar-button'));
    });

    expect(mockUseEmissionsData.setSelectedDate).toHaveBeenCalledWith('2023-01-15');
  });

  test('renders sidebar layout and icons correctly', () => {
    render(<EmissionsHeatmapPage />);

    expect(screen.getByTestId('sidebar-layout')).toBeInTheDocument();
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
    expect(screen.getByTestId('person-icon')).toBeInTheDocument();
  });

  test('handles empty emissions data', () => {
    (useEmissionsData as jest.Mock).mockReturnValue({
      ...mockUseEmissionsData,
      factoryEmissions: [],
      noDataForDate: false,
    });
    
    render(<EmissionsHeatmapPage />);

    const boxes = document.querySelectorAll('.rounded-\\[10px\\]');
    expect(boxes.length).toBe(67); 
  });

  test('calculates average emission correctly', () => {
    render(<EmissionsHeatmapPage />);

    const totalEmission = mockFactoryEmissions.reduce((sum, item) => sum + item.totalEmission, 0);
    const avgEmission = totalEmission / mockFactoryEmissions.length;

    expect(screen.getByText(`≥${(avgEmission * 2).toFixed(0)} kg/s`)).toBeInTheDocument();
    expect(screen.getByText(`≥${avgEmission.toFixed(0)} kg/s`)).toBeInTheDocument();
    expect(screen.getByText(`≥${(avgEmission * 0.5).toFixed(0)} kg/s`)).toBeInTheDocument();
  });

  test('calls blendColors utility with correct parameters', () => {
    render(<EmissionsHeatmapPage />);
    
    expect((blendColors as jest.Mock)).toHaveBeenCalled();
    const calls: [string, string, number][] = (blendColors as jest.Mock).mock.calls as [string, string, number][];
    expect(calls.length).toBeGreaterThan(0);

    calls.forEach(([color1, color2, ratio]: [string, string, number]) => {
      expect(typeof color1).toBe('string');
      expect(typeof color2).toBe('string');
      expect(typeof ratio).toBe('number');
    });
  });

  test('renders correct number of boxes based on factory data', () => {
    render(<EmissionsHeatmapPage />);

    const boxes = document.querySelectorAll('.rounded-\\[10px\\]');
    expect(boxes.length).toBe(67);
  });

  test('does not show tooltip when noDataForDate is true', async () => {
    (useEmissionsData as jest.Mock).mockReturnValue({
      ...mockUseEmissionsData,
      noDataForDate: true,
    });
    
    render(<EmissionsHeatmapPage />);
    const boxes = document.querySelectorAll('.rounded-\\[10px\\]');

    await act(async () => {
      fireEvent.mouseEnter(boxes[0]);
    });

    expect(screen.queryByText('Factory A')).not.toBeInTheDocument();
  });

  test('renders correct colors for emission levels', () => {
    render(<EmissionsHeatmapPage />);

    const calls: [string, string, number][] = (blendColors as jest.Mock).mock.calls as [string, string, number][];
    const totalEmission = mockFactoryEmissions.reduce((sum, item) => sum + item.totalEmission, 0);
    const avgEmission = totalEmission / mockFactoryEmissions.length;

    const factoryA = mockFactoryEmissions.find(f => f.factoryName === 'Factory A');
    const factoryB = mockFactoryEmissions.find(f => f.factoryName === 'Factory B');
    const factoryC = mockFactoryEmissions.find(f => f.factoryName === 'Factory C');
    
    if (factoryA && factoryB && factoryC) {
      const ratioA = factoryA.totalEmission / avgEmission;
      const ratioB = factoryB.totalEmission / avgEmission;
      const ratioC = factoryC.totalEmission / avgEmission;
      
      if (ratioA >= 1.0) {
        expect(calls.some(([color1, color2, ratio]) => 
          color1 === '#53BAFA' && color2 === '#2A4759' && Math.abs(ratio - (ratioA - 1)) < 0.01
        )).toBe(true);
      }
      
      if (ratioB >= 0.5) {
        expect(calls.some(([color1, color2, ratio]) => 
          color1 === '#BEE3FA' && color2 === '#53BAFA' && Math.abs(ratio - ((ratioB - 0.5) * 2)) < 0.01
        )).toBe(true);
      }
      
      if (ratioC < 0.5) {
        expect(calls.some(([color1, color2, ratio]) => 
          color1 === '#FFFFFF' && color2 === '#BEE3FA' && Math.abs(ratio - (ratioC * 2)) < 0.01
        )).toBe(true);
      }
    }
  });

  test('handles empty data without crashing', () => {
    (useEmissionsData as jest.Mock).mockReturnValue({
      ...mockUseEmissionsData,
      factoryEmissions: [],
      loading: false,
      error: null,
      noDataForDate: false
    });
    
    render(<EmissionsHeatmapPage />);
    
    const boxes = document.querySelectorAll('.rounded-\\[10px\\]');
    expect(boxes.length).toBe(67);
  });

  test('tooltip behavior with empty data', async () => {
    (useEmissionsData as jest.Mock).mockReturnValue({
      ...mockUseEmissionsData,
      factoryEmissions: [],
      loading: false,
      error: null,
      noDataForDate: false
    });
    
    render(<EmissionsHeatmapPage />);
    const boxes = document.querySelectorAll('.rounded-\\[10px\\]');
    
    await act(async () => {
      fireEvent.mouseEnter(boxes[0]);
    });

    expect(screen.queryByText('Factory A')).not.toBeInTheDocument();
    expect(screen.queryByText('Factory B')).not.toBeInTheDocument();
    expect(screen.queryByText('Factory C')).not.toBeInTheDocument();
    expect(screen.queryByText('Factory D')).not.toBeInTheDocument();
    expect(screen.queryByText('Factory E')).not.toBeInTheDocument();

    expect(screen.queryByText(/Emissions: \d+\.\d+ kg\/s/)).not.toBeInTheDocument();
  });

  test('handles fetch error without crashing', () => {
    (useEmissionsData as jest.Mock).mockReturnValue({
      ...mockUseEmissionsData,
      factoryEmissions: [],
      loading: false,
      error: 'Network error',
      noDataForDate: false
    });
    
    render(<EmissionsHeatmapPage />);

    expect(screen.getByText('Network error')).toBeInTheDocument();
    
    const boxes = document.querySelectorAll('.rounded-\\[10px\\]');
    expect(boxes.length).toBe(0);
  });

  test('tooltip behavior when fetch fails', async () => {
    (useEmissionsData as jest.Mock).mockReturnValue({
      ...mockUseEmissionsData,
      factoryEmissions: [],
      loading: false,
      error: 'API error',
      noDataForDate: false
    });
    
    render(<EmissionsHeatmapPage />);
    
    const boxes = document.querySelectorAll('.rounded-\\[10px\\]');
    expect(boxes.length).toBe(0);
    
    expect(screen.queryByText('Factory A')).not.toBeInTheDocument();
    expect(screen.queryByText('Factory B')).not.toBeInTheDocument();
    expect(screen.queryByText('Factory C')).not.toBeInTheDocument();
    expect(screen.queryByText('Factory D')).not.toBeInTheDocument();
    expect(screen.queryByText('Factory E')).not.toBeInTheDocument();
    expect(screen.queryByText(/Emissions: \d+\.\d+ kg\/s/)).not.toBeInTheDocument();
  });
});
