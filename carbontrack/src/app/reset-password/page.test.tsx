
import  React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import ResetPasswordPage from "./page";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));


jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt || "mocked image"} />,
}));


jest.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props} />,
    h1: (props: any) => <h1 {...props} />,
    p: (props: any) => <p {...props} />,
  },
}));

jest.mock("react-icons/fi", () => ({
  FiEye: () => <span data-testid="eye-icon" aria-label="Show password"></span>,
  FiEyeOff: () => <span data-testid="eye-off-icon" aria-label="Hide password"></span>,
}));

let mockLoading = false;
let mockError: string | null = null;
let mockSuccess: string | null = null;
const mockHandleResetPassword = jest.fn();

jest.mock("../hooks/useFetchResetPassword", () => ({
  useResetPassword: () => ({
    handleResetPassword: mockHandleResetPassword,
    loading: mockLoading,
    error: mockError,
    success: mockSuccess,
  }),
}));

describe("ResetPasswordPage", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLoading = false;
    mockError = null;
    mockSuccess = null;
    mockHandleResetPassword.mockResolvedValue({ success: true });


    delete (window as any).location; 
  });

  it("renders reset password form with logo and title", () => {
    render(<ResetPasswordPage />);

    expect(screen.getByAltText("carbon-track logo")).toBeInTheDocument();
    expect(screen.getByText("Carbon Track")).toBeInTheDocument();
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "New Password" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("eg,0@HGY4")).toBeInTheDocument();
  });

  it("updates password state on input", async () => {
    render(<ResetPasswordPage />);

    const passwordInput = screen.getByPlaceholderText("eg,0@HGY4");
    await user.type(passwordInput, "12345");

    expect(passwordInput).toHaveValue("12345");
  });

  it("toggles password visibility", async () => {
    render(<ResetPasswordPage />);

    const toggleButton = screen.getByRole("button", { name: "Hide password" });

    expect(screen.getByTestId("eye-off-icon")).toBeInTheDocument();

    await user.click(toggleButton);
    expect(screen.getByTestId("eye-icon")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show password" })).toBeInTheDocument();

    await user.click(toggleButton);
    expect(screen.getByTestId("eye-off-icon")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hide password" })).toBeInTheDocument();
  });

  it("shows validation error if password is less than 8 characters", async () => {
    render(<ResetPasswordPage />);

    const passwordInput = screen.getByPlaceholderText("eg,0@HGY4");
    await user.type(passwordInput, "12345");

    const errorMessage = await screen.findByText("Password has to be at least 8 characters");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-500");
  });

  it("does not submit if validation fails", async () => {
    render(<ResetPasswordPage />);

    const passwordInput = screen.getByPlaceholderText("eg,0@HGY4");
    const submitButton = screen.getByRole("button", { name: /Submit/i });

    await user.type(passwordInput, "123");

    await user.click(submitButton);

    expect(mockHandleResetPassword).not.toHaveBeenCalled();
  });

  it("displays API error message", async () => {
    mockError = "Failed to reset password";
    render(<ResetPasswordPage />);

    const errorMessage = await screen.findByText("Failed to reset password");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-500");
  });

  it("displays API success message", async () => {
    mockSuccess = "Password reset successfully!";
    render(<ResetPasswordPage />);

    const successMessage = await screen.findByText("Password reset successfully!");
    expect(successMessage).toBeInTheDocument();
    expect(successMessage).toHaveClass("text-green-600");
  });

  it("shows loading state on button when loading is true", () => {
    mockLoading = true;
    render(<ResetPasswordPage />);

    const button = screen.getByRole("button", { name: /Resetting.../i });
    expect(button).toBeInTheDocument();
  });
});