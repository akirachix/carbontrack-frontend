import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import SignupPage from "./page";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('framer-motion', () => {
  type MotionProps<T extends keyof React.JSX.IntrinsicElements> = React.PropsWithChildren<React.JSX.IntrinsicElements[T]> & {
    [key: string]: unknown;
  };

  const createMockComponent = <T extends keyof React.JSX.IntrinsicElements>(tag: T) => {
    const MockComponent = ({ children, ...props }: MotionProps<T>) =>
      React.createElement(tag, { ...props, "data-framer-motion": tag }, children);
    MockComponent.displayName = `MockFramerMotion.${tag}`;
    return MockComponent;
  };

  const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  AnimatePresence.displayName = "MockAnimatePresence";

  return {
    motion: {
      div: createMockComponent("div"),
      h1: createMockComponent("h1"),
      p: createMockComponent("p"),
    },
    AnimatePresence,
  };
});

jest.mock("react-icons/fi", () => {
  const FiEye = () => <span data-testid="eye-icon" aria-label="Show password"></span>;
  FiEye.displayName = "MockFiEye";
  const FiEyeOff = () => <span data-testid="eye-off-icon" aria-label="Hide password"></span>;
  FiEyeOff.displayName = "MockFiEyeOff";
  return {
    FiEye,
    FiEyeOff,
  };
});

let mockLoadingSignup = false;
let mockSignupError: string | null = null;
const mockSignup = jest.fn();

jest.mock("../hooks/useFetchSignup", () => ({
  useFetchSignup: () => ({
    signup: mockSignup,
    loading: mockLoadingSignup,
    error: mockSignupError,
  }),
}));

describe("SignupPage", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLoadingSignup = false;
    mockSignupError = null;
    mockSignup.mockResolvedValue(true);
  });

  it("renders signup form with logo and title", () => {
    render(<SignupPage />);

    expect(screen.getByAltText("carbon-track logo")).toBeInTheDocument();
    expect(screen.getByText("Carbon Track")).toBeInTheDocument();
    expect(screen.getByText("Welcome to Carbon Track")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sign Up" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("eg, Mark")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("eg, Mathew")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("eg, mark@gmail.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("eg, 0747839864")).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("eg, 0@HGY4")).toHaveLength(2);
  });

  it("updates form state with provided user data", async () => {
    render(<SignupPage />);

    const firstNameInput = screen.getByPlaceholderText("eg, Mark");
    const lastNameInput = screen.getByPlaceholderText("eg, Mathew");
    const emailInput = screen.getByPlaceholderText("eg, mark@gmail.com");
    const phoneInput = screen.getByPlaceholderText("eg, 0747839864");
    const passwordInputs = screen.getAllByPlaceholderText("eg, 0@HGY4");
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = passwordInputs[1];

    await user.type(firstNameInput, "Emebet");
    await user.type(lastNameInput, "Girmay");
    await user.type(emailInput, "girmaayemebet@gmail.com");
    await user.type(phoneInput, "+254709090909");
    await user.type(passwordInput, "girmaayemebet");
    await user.type(confirmPasswordInput, "girmaayemebet");

    expect(firstNameInput).toHaveValue("Emebet");
    expect(lastNameInput).toHaveValue("Girmay");
    expect(emailInput).toHaveValue("girmaayemebet@gmail.com");
    expect(phoneInput).toHaveValue("254709090909");
    expect(passwordInput).toHaveValue("girmaayemebet");
    expect(confirmPasswordInput).toHaveValue("girmaayemebet");
  });

  it("toggles password visibility", async () => {
    render(<SignupPage />);

    const passwordToggle = screen.getAllByRole("button", { name: "Hide password" })[0];
    const confirmPasswordToggle = screen.getAllByRole("button", { name: "Hide password" })[1];

    expect(screen.getAllByTestId("eye-off-icon")[0]).toBeInTheDocument();
    expect(screen.getAllByTestId("eye-off-icon")[1]).toBeInTheDocument();

    await user.click(passwordToggle);
    expect(screen.getAllByTestId("eye-icon")[0]).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Show password" })[0]).toBeInTheDocument();

    await user.click(confirmPasswordToggle);
    expect(screen.getAllByTestId("eye-icon")[1]).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Show password" })[1]).toBeInTheDocument();
  });

  it("shows validation error if password is less than 8 characters", async () => {
    render(<SignupPage />);

    const passwordInput = screen.getAllByPlaceholderText("eg, 0@HGY4")[0];
    await user.type(passwordInput, "girmaay");

    const errorMessage = await screen.findByText("Password has to be at least 8 characters");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-500");
  });

  it("shows validation error if passwords do not match", async () => {
    render(<SignupPage />);

    const passwordInputs = screen.getAllByPlaceholderText("eg, 0@HGY4");
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = passwordInputs[1];
    await user.type(passwordInput, "girmaayemebet");
    await user.type(confirmPasswordInput, "girmaayemebet123");

    const errorMessage = await screen.findByText("Passwords do not match");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-500");
  });

  it("does not submit if passwords do not match", async () => {
    render(<SignupPage />);

    const passwordInputs = screen.getAllByPlaceholderText("eg, 0@HGY4");
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = passwordInputs[1];
    const submitButton = screen.getByRole("button", { name: /Sign Up/i });

    await user.type(passwordInput, "girmaayemebet");
    await user.type(confirmPasswordInput, "girmaayemebet123");
    await user.click(submitButton);

    expect(mockSignup).not.toHaveBeenCalled();
  });

  it("submits form successfully with provided user data and redirects", async () => {
    render(<SignupPage />);

    const firstNameInput = screen.getByPlaceholderText("eg, Mark");
    const lastNameInput = screen.getByPlaceholderText("eg, Mathew");
    const emailInput = screen.getByPlaceholderText("eg, mark@gmail.com");
    const phoneInput = screen.getByPlaceholderText("eg, 0747839864");
    const passwordInputs = screen.getAllByPlaceholderText("eg, 0@HGY4");
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = passwordInputs[1];
    const submitButton = screen.getByRole("button", { name: /Sign Up/i });

    await user.type(firstNameInput, "Emebet");
    await user.type(lastNameInput, "Girmay");
    await user.type(emailInput, "girmaayemebet@gmail.com");
    await user.type(phoneInput, "+254709090909");
    await user.type(passwordInput, "girmaayemebet");
    await user.type(confirmPasswordInput, "girmaayemebet");
    await user.click(submitButton);

    expect(mockSignup).toHaveBeenCalledWith({
      first_name: "Emebet",
      last_name: "Girmay",
      email: "girmaayemebet@gmail.com",
      phone_number: "254709090909",
      password: "girmaayemebet",
      user_type: "manager",
    });

    await waitFor(() => {
      expect(screen.getByText("Signup successful! Redirecting to dashboard...")).toBeInTheDocument();
    });
    expect(screen.getByText("Signup successful! Redirecting to dashboard...")).toHaveClass("text-green-600");

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/ktda-dashboard");
    }, { timeout: 3000 });
  });

  it("displays API error message from useFetchSignup", async () => {
    mockSignupError = "Failed to sign up";
    render(<SignupPage />);

    const errorMessage = await screen.findByText("Failed to sign up");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-500");
  });

  it("shows loading state on button when signing up", () => {
    mockLoadingSignup = true;
    render(<SignupPage />);

    const button = screen.getByRole("button", { name: /Signing Up.../i });
    expect(button).toBeInTheDocument();
  });

  it("restricts phone number input to digits and limits length", async () => {
    render(<SignupPage />);

    const phoneInput = screen.getByPlaceholderText("eg, 0747839864");
    await user.type(phoneInput, "+254709090909abc");

    expect(phoneInput).toHaveValue("254709090909");
  });
});
