import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ComplianceDashboard from "./page";
import useFetchCompliance from "../hooks/useFetchCompliance";
import useFetchFactories from "../hooks/useFetchFactories";
import { updateCompliance } from "../utils/fetchCompliance";

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
    expect(
      screen.getByText("Compliant Factories In Percent")
    ).toBeInTheDocument();
    expect(screen.getByText("Maramba")).toBeInTheDocument();
    expect(screen.getByText("Compliant status")).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Compliant" })).toBeInTheDocument();
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
    const searchInput = screen.getByPlaceholderText(/Search by factory name/i);
    fireEvent.change(searchInput, { target: { value: "Tombe" } });
    expect(screen.getByText("Tombe")).toBeInTheDocument();
    expect(screen.queryByText("Maramba")).not.toBeInTheDocument();
  });
 
  test("shows error message when updateCompliance fails", async () => {
    mockUseFetchCompliance.mockReturnValue({
      compliance: [
        {
          compliance_id: 1,
          compliance_status: "Compliant",
          compliance_target: "1.2",
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
    (updateCompliance as jest.Mock).mockRejectedValue(
      new Error("Failed to update")
    );
    render(<ComplianceDashboard />);

    fireEvent.click(screen.getByText(/Update Target/i));

    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/Error saving compliance target/i)
      ).toBeInTheDocument();
    });
  });
});






