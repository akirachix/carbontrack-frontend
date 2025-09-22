import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ComplianceTargetModal from ".";
const factories = [
  { factory_id: 1, factory_name: "Factory A" },
  { factory_id: 2, factory_name: "Factory B" },
];
describe("ComplianceTargetModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders modal with current target and factories", () => {
    render(
      <ComplianceTargetModal
        complianceId={101}
        currentTarget="1.08"
        factoryId={1}
        factories={factories}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );
    expect(screen.getByText(/Current target: 1.08/)).toBeInTheDocument();
    expect(screen.getByDisplayValue("1.08")).toBeInTheDocument();
    expect(screen.getByText("Factory A")).toBeInTheDocument();
    expect(screen.getByText("Factory B")).toBeInTheDocument();
  });
  it("closes modal when close button clicked", () => {
    render(
      <ComplianceTargetModal
        complianceId={101}
        currentTarget="1.08"
        factoryId={1}
        factories={factories}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );
    fireEvent.click(screen.getByLabelText(/Close modal/i));
    expect(mockOnClose).toHaveBeenCalled();
  });
  it("updates target input value", () => {
    render(
      <ComplianceTargetModal
        complianceId={101}
        currentTarget="1.08"
        factoryId={1}
        factories={factories}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );
    const input = screen.getByPlaceholderText(/kg CO2/i);
    fireEvent.change(input, { target: { value: "2.5" } });
    expect(input).toHaveValue("2.5");
  });
  it("changes selected factory", () => {
    render(
      <ComplianceTargetModal
        complianceId={101}
        currentTarget="1.08"
        factoryId={1}
        factories={factories}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );
    const select = screen.getByLabelText(/Factory/i);
    fireEvent.change(select, { target: { value: "2" } });
    expect(select).toHaveValue("2");
  });
  it("calls onSave with correct values when valid target entered", async () => {
    render(
      <ComplianceTargetModal
        complianceId={101}
        currentTarget="1.08"
        factoryId={1}
        factories={factories}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );
    const input = screen.getByPlaceholderText(/kg CO2/i);
    fireEvent.change(input, { target: { value: "2.5" } });
    fireEvent.click(screen.getByText(/Set target/i));
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(101, "2.5", 1);
    });
  });
  it("shows alert when invalid target is entered", () => {
    window.alert = jest.fn();
    render(
      <ComplianceTargetModal
        complianceId={101}
        currentTarget="1.08"
        factoryId={1}
        factories={factories}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );
    const input = screen.getByPlaceholderText(/kg CO2/i);
    fireEvent.change(input, { target: { value: "abc" } });
    fireEvent.click(screen.getByText(/Set target/i));
    expect(window.alert).toHaveBeenCalledWith(
      "Please enter a valid numeric target."
    );
  });
  it("shows alert when onSave throws error", async () => {
    window.alert = jest.fn();
    mockOnSave.mockRejectedValueOnce(new Error("Save failed"));
    render(
      <ComplianceTargetModal
        complianceId={101}
        currentTarget="1.08"
        factoryId={1}
        factories={factories}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );
    const input = screen.getByPlaceholderText(/kg CO2/i);
    fireEvent.change(input, { target: { value: "2.5" } });
    fireEvent.click(screen.getByText(/Set target/i));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Error saving target: Save failed");
    });
  });
});