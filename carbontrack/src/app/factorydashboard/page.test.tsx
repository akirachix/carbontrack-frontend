import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardPage from "./page";
import useFetchEmissions from "../hooks/useFetchEmissions";
import { useFetchEnergyEntries } from "../hooks/useFetchEnergyEntries";
import '@testing-library/jest-dom';

jest.mock("../sharedComponents/FactorySidebar", () => () => (
  <div data-testid="sidebar">Sidebar</div>
));

jest.mock("recharts", () => {
  const Original = jest.requireActual("recharts");
  return {
    ...Original,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

jest.mock("react-datepicker", () => (props: any) => (
  <input
    data-testid="date-picker"
    value={props.selected || ""}
    onChange={(e) => props.onChange?.(e.target.value)}
  />
));

jest.mock("../hooks/useFetchEmissions");
jest.mock("../hooks/useFetchEnergyEntries");
const mockUseFetchEmissions = useFetchEmissions as jest.Mock;
const mockUseFetchEnergyEntries = useFetchEnergyEntries as jest.Mock;
beforeEach(() => {
  mockUseFetchEmissions.mockReturnValue({
    selectedDate: new Date("2025-01-01"),
    setSelectedDate: jest.fn(),
    barData: [{ month: "Jan", value: 10 }],
    lineData: [{ time: "10:00", value: 5 }],
    error: null,
    loading: false,
    todayTotal: 2.53,
    monthTotal: 50.1,
  });
  mockUseFetchEnergyEntries.mockReturnValue({
    totalCO2: 100,
    loading: false,
    error: null,
  });
});

describe("DashboardPage", () => {
  it("renders sidebar and headings", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByText("Factory Dashboard")).toBeInTheDocument();
  });
});