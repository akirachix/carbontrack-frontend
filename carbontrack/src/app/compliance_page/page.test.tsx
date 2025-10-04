import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ComplianceDashboard from "./page";
import useFetchCompliance from "../hooks/useFetchCompliance";
import useFetchFactories from "../hooks/useFetchFactories";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../components/SideBarLayout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar">{children}</div>
  ),
}));

jest.mock("./component/AddTarget", () => {
  return {
    __esModule: true,
    default: ({
      onSave,
      onClose,
      complianceId,
      factoryId,
    }: {
      onSave?: (id: number, newTarget: string, factory: number) => void;
      onClose?: () => void;
      complianceId: number;
      factoryId: number;
    }) =>
      React.createElement(
        "div",
        { "data-testid": "mock-modal" },
        React.createElement(
          "button",
          {
            type: "button",
            onClick: () => onSave?.(complianceId, "2.00", factoryId),
          },
          "Save"
        ),
        React.createElement(
          "button",
          { type: "button", onClick: onClose },
          "Close"
        )
      ),
  };
});

jest.mock("../hooks/useFetchCompliance");
jest.mock("../hooks/useFetchFactories");
jest.mock("../utils/fetchCompliance", () => ({
  updateCompliance: jest.fn(),
}));

const mockUseFetchCompliance = useFetchCompliance as jest.Mock;
const mockUseFetchFactories = useFetchFactories as jest.Mock;

describe("ComplianceDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const useRouter = jest.requireMock("next/navigation").useRouter;
    useRouter.mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    });
  });

  test("renders loading state", () => {
    mockUseFetchCompliance.mockReturnValue({
      compliance: [],
      loading: true,
      error: null,
    });
    mockUseFetchFactories.mockReturnValue({
      factories: [],
      loading: true,
      error: null,
    });
    render(<ComplianceDashboard />);
    expect(screen.getByText(/Loading compliance data/i)).toBeInTheDocument();
  });

  test("renders compliance error", () => {
    mockUseFetchCompliance.mockReturnValue({
      compliance: [],
      loading: false,
      error: "Failed to fetch compliance",
    });
    mockUseFetchFactories.mockReturnValue({
      factories: [],
      loading: false,
      error: null,
    });
    render(<ComplianceDashboard />);
    expect(
      screen.getByText(/Compliance Error: Failed to fetch compliance/i)
    ).toBeInTheDocument();
  });

  test("renders factories error", () => {
    mockUseFetchCompliance.mockReturnValue({
      compliance: [],
      loading: false,
      error: null,
    });
    mockUseFetchFactories.mockReturnValue({
      factories: [],
      loading: false,
      error: "Failed to fetch factories",
    });
    render(<ComplianceDashboard />);
    expect(
      screen.getByText(/Factories Error: Failed to fetch factories/i)
    ).toBeInTheDocument();
  });

  test("renders summary cards and table", () => {
    mockUseFetchCompliance.mockReturnValue({
      compliance: [
        {
          compliance_id: 1,
          compliance_status: "Compliant",
          compliance_target: "1.20",
          factory: 101,
          created_at: "2025-09-20T12:00:00Z",
        },
      ],
      loading: false,
      error: null,
    });
    mockUseFetchFactories.mockReturnValue({
      factories: [{ factory_id: 101, factory_name: "Maramba" }],
      loading: false,
      error: null,
    });
    render(<ComplianceDashboard />);
    expect(screen.getByText("Compliance Target")).toBeInTheDocument();
    expect(screen.getByText("1.20")).toBeInTheDocument();
    expect(screen.getByText("Compliant Factories (%)")).toBeInTheDocument();
    expect(screen.getByText("Maramba")).toBeInTheDocument();
    expect(screen.getByText("Compliant Status")).toBeInTheDocument();
    expect(screen.getByText("Compliant")).toBeInTheDocument();
  });

  test("filters compliance data by search term", () => {
    mockUseFetchCompliance.mockReturnValue({
      compliance: [
        {
          compliance_id: 1,
          compliance_status: "Compliant",
          compliance_target: "1.2",
          factory: 101,
          created_at: "2025-09-20T12:00:00Z",
        },
        {
          compliance_id: 2,
          compliance_status: "Non-Compliant",
          compliance_target: "1.2",
          factory: 102,
          created_at: "2025-09-20T12:00:00Z",
        },
      ],
      loading: false,
      error: null,
    });
    mockUseFetchFactories.mockReturnValue({
      factories: [
        { factory_id: 101, factory_name: "Maramba" },
        { factory_id: 102, factory_name: "Tombe" },
      ],
      loading: false,
      error: null,
    });
    render(<ComplianceDashboard />);
    const searchInput = screen.getByPlaceholderText(/Search by factory name or status/i);
    fireEvent.change(searchInput, { target: { value: "Tombe" } });
    expect(screen.getByText("Tombe")).toBeInTheDocument();
    expect(screen.queryByText("Maramba")).not.toBeInTheDocument();
  });

});