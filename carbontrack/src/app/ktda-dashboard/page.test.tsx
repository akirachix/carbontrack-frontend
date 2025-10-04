import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DashboardPage from "./page";
import { useRouter } from "next/navigation";
import useFetchCompliance from "../hooks/useFetchCompliance";
import useFetchEnergyEntries from "../hooks/useFetchEnergyEntries";
import useFetchEmissions from "../hooks/useFetchEmissions";
import useFetchFactories from "../hooks/useFetchFactories";
import {
  EmissionData,
  FactoryData,
  EnergyEntryData,
  ComplianceType,
  Alert,
} from "../types";

interface HighEmissionAlertProps {
  alerts: Alert[];
  onClose: () => void;
  onAlertViewed: (alert: Alert) => void;
  viewedFactories: string[];
}

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../components/SideBarLayout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar">{children}</div>
  ),
}));

jest.mock("../hooks/useFetchCompliance", () =>
  jest.fn(() => ({
    compliance: [
      {
        compliance_target: "20",
        compliance_status: "compliant",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-02T00:00:00Z",
        factory: 1,
      } as ComplianceType,
    ],
    loading: false,
  }))
);

jest.mock("../hooks/useFetchEnergyEntries", () =>
  jest.fn(() => ({
    energy: [
      {
        data_id: 1,
        energy_type: "firewood",
        energy_amount: "100",
        co2_equivalent: "20",
        tea_processed_amount: "50",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
        factory: 1,
      } as EnergyEntryData,
    ],
    loading: false,
  }))
);

jest.mock("../hooks/useFetchEmissions", () =>
  jest.fn(() => ({
    emissions: [
      {
        emissions_id: 1,
        emission_rate: "300",
        mcu: "mcu_1",
        mcu_device_id: "dev1",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      } as EmissionData,
    ],
    loading: false,
  }))
);

jest.mock("../hooks/useFetchFactories", () =>
  jest.fn(() => ({
    factories: [
      {
        factory_id: 1,
        factory_name: "maramba",
        factory_location: "location1",
        created_at: "2025-01-01T00:00:00Z",
      } as FactoryData,
    ],
    loading: false,
  }))
);

jest.mock("../sharedComponents/Calendar", () => {
  const MockCalendar = ({
    setSelectedDate,
  }: {
    setSelectedDate: (date: Date) => void;
  }) => (
    <button
      onClick={() => setSelectedDate(new Date("2025-01-01"))}
      data-testid="calendar"
    >
      Mock Calendar
    </button>
  );
  MockCalendar.displayName = "MockCalendar";
  return MockCalendar;
});

jest.mock("./component/HighEmissionAlerts", () => {
  const MockHighEmissionAlerts = ({
    alerts,
    onClose,
    onAlertViewed,
    viewedFactories,
  }: HighEmissionAlertProps) => (
    <div data-testid="alert-modal">
      <p>Mock Alerts: {alerts.length}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
  MockHighEmissionAlerts.displayName = "MockHighEmissionAlerts";
  return MockHighEmissionAlerts;
});

jest.mock("recharts", () => {
  return {
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    PieChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Pie: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Cell: () => <div />,
    Line: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    Tooltip: () => <div />,
  };
});

describe("DashboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    });
  });

  it("renders dashboard header", () => {
    render(<DashboardPage />);
    expect(screen.getByText("KTDA Dashboard")).toBeInTheDocument();
  });

  it("displays compliant factories count and percent", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Compliant Factories (filtered)")).toBeInTheDocument();
    expect(screen.getByText("1 / 1")).toBeInTheDocument();
    expect(screen.getByText("Compliant Factories In Percent")).toBeInTheDocument();
    expect(screen.getByText("100.0 %")).toBeInTheDocument();
  });

  it("displays emission trend title", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Emission Trend")).toBeInTheDocument();
  });

  it("opens and closes the alert modal", async () => {
    render(<DashboardPage />);
    const alertCard = screen.getByTitle("Click to view high emission alerts");
    fireEvent.click(alertCard);
    expect(screen.getByTestId("alert-modal")).toBeInTheDocument();
    expect(screen.getByText(/Mock Alerts:/)).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close"));
    await waitFor(() => {
      expect(screen.queryByTestId("alert-modal")).not.toBeInTheDocument();
    });
  });

  it("updates date when calendar button clicked", () => {
    render(<DashboardPage />);
    const calendarBtn = screen.getByTestId("calendar");
    fireEvent.click(calendarBtn);
    expect(screen.getByText("KTDA Dashboard")).toBeInTheDocument();
  });

  it("shows loading state when any hook is loading", () => {
    (useFetchCompliance as jest.Mock).mockReturnValue({
      compliance: [],
      loading: true,
    });
    (useFetchEnergyEntries as jest.Mock).mockReturnValue({
      energy: [],
      loading: true,
    });
    (useFetchEmissions as jest.Mock).mockReturnValue({
      emissions: [],
      loading: true,
    });
    (useFetchFactories as jest.Mock).mockReturnValue({
      factories: [],
      loading: true,
    });
    render(<DashboardPage />);
    expect(screen.getByText((content) => content.includes("Loading data"))).toBeInTheDocument();
  });
});