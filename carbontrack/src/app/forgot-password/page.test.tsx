import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import ForgotPasswordPage from "./page";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
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
let mockLoading = false;
let mockError: string | null = null;
let mockSuccess: string | null = null;
const mockForgotPassword = jest.fn();

jest.mock("../hooks/useFetchForgotPassword", () => ({
  useForgotPassword: () => ({
    forgotPassword: mockForgotPassword,
    loading: mockLoading,
    error: mockError,
    success: mockSuccess,
  }),
}));

describe("ForgotPasswordPage", () => {
  const user = userEvent.setup();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLoading = false;
    mockError = null;
    mockSuccess = null;
    mockForgotPassword.mockResolvedValue(true);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("renders all required elements", () => {
    render(<ForgotPasswordPage />);

    expect(screen.getByAltText("carbon-track logo")).toBeInTheDocument();
    expect(screen.getByText("Carbon Track")).toBeInTheDocument();
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Forgot Password?" })).toBeInTheDocument();
    expect(screen.getByText("Enter your email address below")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("eg,0@HGY4")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send/i })).toBeInTheDocument();
  });

  it("allows email input", async () => {
    render(<ForgotPasswordPage />);

    const emailInput = screen.getByPlaceholderText("eg,0@HGY4");
    await user.type(emailInput, "girmaayemebet@gmail.com");

    expect(emailInput).toHaveValue("girmaayemebet@gmail.com");
  });

  it("calls forgotPassword and redirects on success", async () => {
    mockSuccess = "Password reset email sent!";
    render(<ForgotPasswordPage />);

    const emailInput = screen.getByPlaceholderText("eg,0@HGY4");
    const submitButton = screen.getByRole("button", { name: /Send/i });

    await user.type(emailInput, "girmaayemebet@gmail.com");
    await user.click(submitButton);

    expect(mockForgotPassword).toHaveBeenCalledWith("girmaayemebet@gmail.com");

    await waitFor(() => {
      expect(screen.getByText("Password reset email sent!")).toBeInTheDocument();
    });
    expect(screen.getByText("Password reset email sent!")).toHaveClass("text-green-500");

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/verify-otp?email=girmaayemebet%40gmail.com");
    }, { timeout: 3000 });
  });

  it("shows loading state during reset", () => {
    mockLoading = true;
    render(<ForgotPasswordPage />);

    expect(screen.getByRole("button", { name: /Sending.../i })).toBeInTheDocument();
  });

  it("displays reset error", async () => {
    mockError = "Failed to send reset email";
    render(<ForgotPasswordPage />);

    const errorMessage = await screen.findByText("Failed to send reset email");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-500");
  });
});