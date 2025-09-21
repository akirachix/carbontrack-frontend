import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DashboardPage from "./page";


jest.mock("../components/SideBarLayout/layout", () => ({ children }: any) => <>{children}</>);

jest.mock("../hooks/useFetchCompliance", () =>
  jest.fn(() => ({
    compliance: [
      { compliance_id: 1, compliance_status: "compliant", compliance_target: "20", created_at: "2025-01-01", updated_at: "2025-01-02", factory: 1 },
    ],
    loading: false,
  }))
);
jest.mock("../hooks/useFetchEnergyEntries", () =>
  jest.fn(() => ({
    energy: [
      { id: 1, firewood: "100", electricity: "200", diesel: "50", date: "2025-01-01" },
    ],
    loading: false,
  }))
);
jest.mock("../hooks/useFetchEmissions", () =>
  jest.fn(() => ({
    emissions: [
      { id: 1, emission_rate: "300", date: "2025-01-01" },
    ],
    loading: false,
  }))
);
jest.mock("../hooks/useFetchFactories", () =>
  jest.fn(() => ({
    factories: [
      { factory_id: 1, name: "Factory A" },
    ],
    loading: false,
  }))
);

jest.mock("../sharedComponents/Calendar", () => ({ setSelectedDate }: any) => (
  <button onClick={() => setSelectedDate(new Date("2025-01-01"))} data-testid="calendar">
    Mock Calendar
  </button>
));

jest.mock("./component/HighEmissionAlerts", () => ({ alerts, onClose }: any) => (
  <div data-testid="alert-modal">
    <p>Mock Alerts: {alerts.length}</p>
    <button onClick={onClose}>Close</button>
  </div>
));

jest.mock("recharts", () => {
  const Original = jest.requireActual("recharts");
  return {
    ...Original,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});


import useFetchEnergyEntries from "../hooks/useFetchEnergyEntries";

describe("DashboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the dashboard header", () => {
    render(<DashboardPage />);
    expect(screen.getByText("KTDA Dashboard")).toBeInTheDocument();
  });

  it("displays the count of compliant factories", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Compliant Factories")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("displays the emission trend title", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Emission Trend")).toBeInTheDocument();
  });

  it("opens and closes the alert modal", async () => {
    render(<DashboardPage />);
    const alertCard = screen.getByTitle("Click to view high emission alerts");
    fireEvent.click(alertCard);
    expect(screen.getByTestId("alert-modal")).toBeInTheDocument();
    expect(screen.getByText("Mock Alerts: 0")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close"));
    await waitFor(() => {
      expect(screen.queryByTestId("alert-modal")).not.toBeInTheDocument();
    });
  });

  it("updates date when calendar is clicked", () => {
    render(<DashboardPage />);
    const calendarBtn = screen.getByTestId("calendar");
    fireEvent.click(calendarBtn);
    expect(screen.getByText("KTDA Dashboard")).toBeInTheDocument(); 
  });

  it("shows loading state when any hook is loading", () => {
    (useFetchEnergyEntries as jest.Mock).mockReturnValueOnce({
      energy: [],
      loading: true,
    });

    render(<DashboardPage />);
    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });
});
