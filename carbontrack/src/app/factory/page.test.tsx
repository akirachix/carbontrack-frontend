import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import FactoryEmissionLeaderboard from './page';
import useFactoryEmissions from '../hooks/useFetchFactoryData';

jest.mock('../hooks/useFetchFactoryData', () => ({
  __esModule: true,
  default: jest.fn()
}));
jest.mock('../components/SideBarLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-layout">{children}</div>
  )
}));
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}
jest.mock('../sharedComponents/Pagination', () => ({
  __esModule: true,
  default: ({ page, totalPages, onPageChange }: PaginationProps) => (
    <div data-testid="pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        data-testid="prev-page"
      >
        Previous
      </button>
      <span>Page {page} of {totalPages}</span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        data-testid="next-page"
      >
        Next
      </button>
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

describe('FactoryEmissionLeaderboard', () => {
  const mockFactoryEmissions = [
    { factoryId: 1, factoryName: 'Factory A', totalEmission: 10.5, changePercent: 5.2 },
    { factoryId: 2, factoryName: 'Factory B', totalEmission: 7.8, changePercent: -3.1 },
    { factoryId: 3, factoryName: 'Factory C', totalEmission: 12.3, changePercent: 0 },
    { factoryId: 4, factoryName: 'Factory D', totalEmission: 9.1, changePercent: 2.7 },
    { factoryId: 5, factoryName: 'Factory E', totalEmission: 6.4, changePercent: -1.5 },
    { factoryId: 6, factoryName: 'Factory F', totalEmission: 11.2, changePercent: 4.3 },
    { factoryId: 7, factoryName: 'Factory G', totalEmission: 8.7, changePercent: -2.9 },
    { factoryId: 8, factoryName: 'Factory H', totalEmission: 10.0, changePercent: 1.8 },
    { factoryId: 9, factoryName: 'Factory I', totalEmission: 5.5, changePercent: -0.7 },
    { factoryId: 10, factoryName: 'Factory J', totalEmission: 9.9, changePercent: 3.2 },
  ];
  beforeEach(() => {
    jest.clearAllMocks();
    (useFactoryEmissions as jest.Mock).mockReturnValue({
      factoryEmissions: mockFactoryEmissions,
      loading: false,
      error: null
    });
  });

  test('renders the component with title', () => {
    render(<FactoryEmissionLeaderboard />);
    expect(screen.getByText('Factory Emission Leaderboard')).toBeInTheDocument();
  });

  test('displays loading state', () => {
    (useFactoryEmissions as jest.Mock).mockReturnValue({
      factoryEmissions: [],
      loading: true,
      error: null
    });
    render(<FactoryEmissionLeaderboard />);
    expect(screen.getByText('Loading factories...')).toBeInTheDocument();
  });

  test('displays error state', () => {
    const errorMessage = 'Failed to fetch factory data';
    (useFactoryEmissions as jest.Mock).mockReturnValue({
      factoryEmissions: [],
      loading: false,
      error: errorMessage
    });
    render(<FactoryEmissionLeaderboard />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('renders factory data correctly', () => {
    render(<FactoryEmissionLeaderboard />);
    expect(screen.getByText('Factory')).toBeInTheDocument();
  
    expect(
      screen.getByText((content: string, node: Element | null) => {
        if (!node) return false;
        const hasText = (n: Element) => n.textContent === 'Total Emission(kg)';
        const nodeHasText = hasText(node);
        const childrenDontHaveText = Array.from(node.children || []).every(
          child => !hasText(child)
        );
        return nodeHasText && childrenDontHaveText;
      })
    ).toBeInTheDocument();
    expect(screen.getByText('Change from last month')).toBeInTheDocument();
    expect(screen.getByText('Factory A')).toBeInTheDocument();
    expect(screen.getByText('10.5000')).toBeInTheDocument();
    expect(screen.getByText('+5.2%')).toBeInTheDocument();
    const negativeChange = screen.getByText('-3.1%');
    expect(negativeChange).toHaveClass('text-green-400');
    const positiveChange = screen.getByText('+5.2%');
    expect(positiveChange).toHaveClass('text-red-400');
  });

  test('filters factories based on search term', async () => {
    render(<FactoryEmissionLeaderboard />);
    const searchInput = screen.getByPlaceholderText('Search factory names...');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Factory A' } });
    });
    expect(screen.getByText('Factory A')).toBeInTheDocument();
    expect(screen.queryByText('Factory B')).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: '' } });
    });
    expect(screen.getByText('Factory A')).toBeInTheDocument();
    expect(screen.getByText('Factory B')).toBeInTheDocument();
  });

  test('shows no results message when no factories match search', async () => {
    render(<FactoryEmissionLeaderboard />);
    const searchInput = screen.getByPlaceholderText('Search factory names...');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Nonexistent Factory' } });
    });
    expect(screen.getByText('No matching factory found')).toBeInTheDocument();
  });

  test('handles pagination correctly', async () => {
    render(<FactoryEmissionLeaderboard />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('Factory A')).toBeInTheDocument();
    expect(screen.getByText('Factory H')).toBeInTheDocument();
    expect(screen.queryByText('Factory I')).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByTestId('next-page'));
    });
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    expect(screen.getByText('Factory I')).toBeInTheDocument();
    expect(screen.getByText('Factory J')).toBeInTheDocument();
    expect(screen.queryByText('Factory A')).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByTestId('prev-page'));
    });
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('Factory A')).toBeInTheDocument();
  });

  test('resets to first page when search term changes', async () => {
    render(<FactoryEmissionLeaderboard />);
    await act(async () => {
      fireEvent.click(screen.getByTestId('next-page'));
    });
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    const searchInput = screen.getByPlaceholderText('Search factory names...');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Factory' } });
    });
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });

  test('renders sidebar layout and icons correctly', () => {
    render(<FactoryEmissionLeaderboard />);
    expect(screen.getByTestId('sidebar-layout')).toBeInTheDocument();
  });

  test('handles empty emissions data', () => {
    (useFactoryEmissions as jest.Mock).mockReturnValue({
      factoryEmissions: [],
      loading: false,
      error: null
    });
    render(<FactoryEmissionLeaderboard />);
    expect(screen.getByText('No matching factory found')).toBeInTheDocument();
  });

  test('displays appropriate message when no data is available', () => {
    (useFactoryEmissions as jest.Mock).mockReturnValue({
      factoryEmissions: [],
      loading: false,
      error: null
    });
    render(<FactoryEmissionLeaderboard />);
    expect(screen.getByText('No matching factory found')).toBeInTheDocument();
    expect(screen.queryByText('Loading factories...')).not.toBeInTheDocument();
    expect(screen.queryByText('Failed to fetch factory data')).not.toBeInTheDocument();
  });

  test('displays error message when data fetch fails', () => {
    const errorMessage = 'Network error: Unable to connect to server';
    (useFactoryEmissions as jest.Mock).mockReturnValue({
      factoryEmissions: [],
      loading: false,
      error: errorMessage
    });
    render(<FactoryEmissionLeaderboard />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByText('Loading factories...')).not.toBeInTheDocument();
    expect(screen.queryByText('No matching factory found')).not.toBeInTheDocument();
  });
});