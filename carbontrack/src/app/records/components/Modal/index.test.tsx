import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModalForm from ".";

describe("ModalForm Component", () => {
  const userFactoryId = 123;
  const onClose = jest.fn();
  const onSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    render(
      <ModalForm isOpen={false} onClose={onClose} onSave={onSave} userFactoryId={userFactoryId} />
    );
    expect(screen.queryByText(/Add Record/i)).toBeNull();
  });

  it("renders and displays form fields when open", () => {
    render(
      <ModalForm isOpen={true} onClose={onClose} onSave={onSave} userFactoryId={userFactoryId} />
    );

    expect(screen.getByText("Add Record")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g., 500")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g., 200")).toBeInTheDocument();
  });

  it("changes inputs and selects correctly", () => {
    render(
      <ModalForm isOpen={true} onClose={onClose} onSave={onSave} userFactoryId={userFactoryId} />
    );

    const energyTypeSelect = screen.getByRole("combobox");
    fireEvent.change(energyTypeSelect, { target: { value: "diesel" } });
    expect(energyTypeSelect).toHaveValue("diesel");

    const energyAmountInput = screen.getByPlaceholderText("e.g., 500");
    fireEvent.change(energyAmountInput, { target: { value: "100" } });
    expect(energyAmountInput).toHaveValue(100);

    const teaProcessedInput = screen.getByPlaceholderText("e.g., 200");
    fireEvent.change(teaProcessedInput, { target: { value: "50" } });
    expect(teaProcessedInput).toHaveValue(50);
  });

  it("shows error if factory ID is missing on submit", async () => {
    render(
      <ModalForm isOpen={true} onClose={onClose} onSave={onSave} userFactoryId={0} />
    );

    fireEvent.change(screen.getByPlaceholderText("e.g., 500"), { target: { value: "200" } });
    fireEvent.change(screen.getByPlaceholderText("e.g., 200"), { target: { value: "150" } });

    fireEvent.click(screen.getByText(/Save/i));
    expect(
      await screen.findByText("Factory ID is missing.")
    ).toBeInTheDocument();

    expect(onSave).not.toHaveBeenCalled();
  });

  it("calls onSave and handles success", async () => {
    onSave.mockResolvedValue({ success: true });
    render(
      <ModalForm isOpen={true} onClose={onClose} onSave={onSave} userFactoryId={userFactoryId} />
    );

    fireEvent.change(screen.getByPlaceholderText("e.g., 500"), { target: { value: "200" } });
    fireEvent.change(screen.getByPlaceholderText("e.g., 200"), { target: { value: "150" } });

    fireEvent.click(screen.getByText(/Save/i));
    
    expect(screen.getByText(/Saving.../i)).toBeDisabled();

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        energy_type: "electricity",
        energy_amount: "200",
        tea_processed_amount: "150",
        factory: userFactoryId,
      });
    });

    expect(
      await screen.findByText((content) => content.includes("Record saved successfully"))
    ).toBeInTheDocument();

    await waitFor(() => expect(onClose).toHaveBeenCalled(), { timeout: 4000 });
  });

  it("handles save failure with error message", async () => {
    onSave.mockResolvedValue({ success: false, message: "Failed to save" });
    render(
      <ModalForm isOpen={true} onClose={onClose} onSave={onSave} userFactoryId={userFactoryId} />
    );

    fireEvent.change(screen.getByPlaceholderText("e.g., 500"), { target: { value: "200" } });
    fireEvent.change(screen.getByPlaceholderText("e.g., 200"), { target: { value: "150" } });

    fireEvent.click(screen.getByText(/Save/i));

    expect(
      await screen.findByText((content) => content.includes("Failed to save"))
    ).toBeInTheDocument();

    expect(onClose).not.toHaveBeenCalled();
  });

  it("handles save throwing an error", async () => {
    onSave.mockRejectedValue(new Error("Network error"));
    render(
      <ModalForm isOpen={true} onClose={onClose} onSave={onSave} userFactoryId={userFactoryId} />
    );

    fireEvent.change(screen.getByPlaceholderText("e.g., 500"), { target: { value: "200" } });
    fireEvent.change(screen.getByPlaceholderText("e.g., 200"), { target: { value: "150" } });

    fireEvent.click(screen.getByText(/Save/i));

    expect(
      await screen.findByText((content) => content.includes("Failed to save record"))
    ).toBeInTheDocument();

    expect(onClose).not.toHaveBeenCalled();
  });

  it("resets and closes form when Cancel clicked", () => {
    render(
      <ModalForm isOpen={true} onClose={onClose} onSave={onSave} userFactoryId={userFactoryId} />
    );

    fireEvent.change(screen.getByPlaceholderText("e.g., 500"), { target: { value: "200" } });
    fireEvent.change(screen.getByPlaceholderText("e.g., 200"), { target: { value: "150" } });

    fireEvent.click(screen.getByText(/Cancel/i));

    expect(onClose).toHaveBeenCalled();
  });
});