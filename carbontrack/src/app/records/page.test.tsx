import { render, screen, act, fireEvent } from '@testing-library/react';
import RecordsPage from './page';
import { useFetchRecords } from '../hooks/useFetchRecords';
import { saveRecord } from '../utils/fetchRecords';
import { EnergyEntryData } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<EnergyEntryData, "data_id" | "created_at" | "updated_at">) => void;
  userFactoryId?: number;
}

interface CalendarProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  filterType: "day" | "month" | "year";
  setFilterType: (type: "day" | "month" | "year") => void;
}

jest.mock('../hooks/useFetchRecords');
jest.mock('../utils/fetchRecords');
jest.mock('../components/FactoryLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="factory-layout">{children}</div>,
}));
jest.mock('./components/Modal', () => ({
  __esModule: true,
  default: (props: ModalProps) => (
    props.isOpen ? (
      <div data-testid="modal">
        <button data-testid="close-modal" onClick={props.onClose}>Close</button>
        <button data-testid="save-modal" onClick={() => props.onSave({
          energy_type: 'Test',
          energy_amount: '10',
          tea_processed_amount: '5',
          co2_equivalent: '2',
          factory: 1
        })}>Save</button>
      </div>
    ) : null
  ),
}));
jest.mock('./components/RecordsTable', () => ({
  __esModule: true,
  default: ({ records, emptyMessage }: { records: EnergyEntryData[]; emptyMessage: string }) => (
    <div data-testid="records-table">
      {records.length === 0 ? <div>{emptyMessage}</div> : records.map((r) => <div key={r.data_id}>{r.energy_type}</div>)}
    </div>
  ),
}));
jest.mock('../sharedComponents/Button', () => ({
  __esModule: true,
  default: ({ buttonText, onclickHandler }: { buttonText: string; onclickHandler: () => void }) => (
    <button data-testid="create-btn" onClick={onclickHandler}>{buttonText}</button>
  )
}));
jest.mock('../sharedComponents/Pagination', () => ({
  __esModule: true,
  default: ({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) => (
    <div data-testid="pagination">
      <button data-testid="prev-page" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>Prev</button>
      <span>{page}/{totalPages}</span>
      <button data-testid="next-page" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>Next</button>
    </div>
  )
}));
jest.mock('../sharedComponents/Calendar', () => ({
  __esModule: true,
  default: ({ selectedDate, setSelectedDate, filterType, setFilterType }: CalendarProps) => (
    <div data-testid="calendar">
      <button data-testid="set-day" onClick={() => setFilterType("day")}>Day</button>
      <button data-testid="set-month" onClick={() => setFilterType("month")}>Month</button>
      <button data-testid="set-year" onClick={() => setFilterType("year")}>Year</button>
      <button data-testid="set-date" onClick={() => setSelectedDate(new Date('2023-05-15'))}>Set Date</button>
    </div>
  ),
}));
jest.mock('../sharedComponents/DownloadPdfButton', () => ({
  __esModule: true,
  default: () => <button data-testid="download-pdf">Download PDF</button>,
}));

const mockRecords: EnergyEntryData[] = [
  {
    data_id: 1,
    energy_type: "Electricity",
    energy_amount: "100",
    tea_processed_amount: "50",
    co2_equivalent: "25",
    factory: 1,
    created_at: "2023-01-15",
    updated_at: "2023-01-15"
  },
  {
    data_id: 2,
    energy_type: "Natural Gas",
    energy_amount: "200",
    tea_processed_amount: "75",
    co2_equivalent: "40",
    factory: 1,
    created_at: "2023-02-20",
    updated_at: "2023-02-20"
  },
];

describe('RecordsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useFetchRecords as jest.Mock).mockReturnValue({
      records: mockRecords,
      loading: false,
      error: null,
      noDataForDate: false,
    });
    window.localStorage.setItem("factory", "1");
  });

  it('renders records table and displays energy types', () => {
    render(<RecordsPage />);
    expect(screen.getByTestId('records-table')).toBeInTheDocument();
    expect(screen.getByText('Electricity')).toBeInTheDocument();
    expect(screen.getByText('Natural Gas')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    (useFetchRecords as jest.Mock).mockReturnValue({
      records: [],
      loading: true,
      error: null,
      noDataForDate: false,
    });
    render(<RecordsPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays error state', () => {
    (useFetchRecords as jest.Mock).mockReturnValue({
      records: [],
      loading: false,
      error: "Fetch error",
      noDataForDate: false,
    });
    render(<RecordsPage />);
    expect(screen.getByText('Fetch error')).toBeInTheDocument();
  });

  it('pagination works', () => {
    render(<RecordsPage />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('next-page'));
    expect(screen.getByTestId('pagination')).toHaveTextContent('1/1');
  });

  it('search filters records', () => {
    render(<RecordsPage />);
    const search = screen.getByPlaceholderText('Search energy type...');
    fireEvent.change(search, { target: { value: 'gas' } });
    expect(screen.queryByText('Electricity')).not.toBeInTheDocument();
    expect(screen.getByText('Natural Gas')).toBeInTheDocument();
  });

  it('calendar filter changes filterType and selectedDate', () => {
    render(<RecordsPage />);
    fireEvent.click(screen.getByTestId('set-month'));
    fireEvent.click(screen.getByTestId('set-date'));
    expect(screen.getByTestId('calendar')).toBeInTheDocument();
  });

  it('can open and close modal', () => {
    render(<RecordsPage />);
    fireEvent.click(screen.getByTestId('create-btn'));
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('close-modal'));
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('can save record via modal', async () => {
    (saveRecord as jest.Mock).mockResolvedValue({
      data_id: 3,
      energy_type: 'Test',
      energy_amount: '10',
      tea_processed_amount: '5',
      co2_equivalent: '2',
      factory: 1,
      created_at: '2023-05-15',
      updated_at: '2023-05-15'
    });
    render(<RecordsPage />);
    fireEvent.click(screen.getByTestId('create-btn'));
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByTestId('save-modal'));
      await Promise.resolve();
    });
    expect(saveRecord).toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('close-modal'));
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('download pdf button renders', () => {
    render(<RecordsPage />);
    expect(screen.getByTestId('download-pdf')).toBeInTheDocument();
  });
});