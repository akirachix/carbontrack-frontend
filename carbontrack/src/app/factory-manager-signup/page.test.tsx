import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import SignupPage from "./page";

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

let mockLoadingFactories = false;
let mockFactoryError: string | null = null;
let mockFactories = [
  { factory_id: "1", factory_name: "Factory A" },
  { factory_id: "2", factory_name: "Factory B" },
];
let mockLoadingSignup = false;
let mockSignupError: string | null = null;
const mockSignup = jest.fn();

jest.mock("../hooks/useFetchFactories", () => ({
  useFetchFactories: () => ({
    factories: mockFactories,
    loadingFactories: mockLoadingFactories,
    factoryError: mockFactoryError,
  }),
}));

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
    mockLoadingFactories = false;
    mockFactoryError = null;
    mockFactories = [
      { factory_id: "1", factory_name: "Factory A" },
      { factory_id: "2", factory_name: "Factory B" },
    ];
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
    expect(screen.getByRole("combobox")).toBeInTheDocument();
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
    const factorySelect = screen.getByRole("combobox");

    await user.type(firstNameInput, "Emebet");
    await user.type(lastNameInput, "Girmay");
    await user.type(emailInput, "girmaayemebet@gmail.com");
    await user.type(phoneInput, "+254709090909");
    await user.type(passwordInput, "girmaayemebet");
    await user.type(confirmPasswordInput, "girmaayemebet");
    await user.selectOptions(factorySelect, "1");

    expect(firstNameInput).toHaveValue("Emebet");
    expect(lastNameInput).toHaveValue("Girmay");
    expect(emailInput).toHaveValue("girmaayemebet@gmail.com");
    expect(phoneInput).toHaveValue("254709090909"); 
    expect(passwordInput).toHaveValue("girmaayemebet");
    expect(confirmPasswordInput).toHaveValue("girmaayemebet");
    expect(factorySelect).toHaveValue("1");
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
    const factorySelect = screen.getByRole("combobox");
    const submitButton = screen.getByRole("button", { name: /Sign Up/i });

    await user.type(firstNameInput, "Emebet");
    await user.type(lastNameInput, "Girmay");
    await user.type(emailInput, "girmaayemebet@gmail.com");
    await user.type(phoneInput, "+254709090909");
    await user.type(passwordInput, "girmaayemebet");
    await user.type(confirmPasswordInput, "girmaayemebet");
    await user.selectOptions(factorySelect, "1");
    await user.click(submitButton);

    expect(mockSignup).toHaveBeenCalledWith({
      first_name: "Emebet",
      last_name: "Girmay",
      email: "girmaayemebet@gmail.com",
      phone_number: "254709090909", 
      password: "girmaayemebet",
      user_type: "factory",
      factory: "1",
    });

    await waitFor(() => {
      expect(screen.getByText("Signup successful! Redirecting to dashboard...")).toBeInTheDocument();
    });
    expect(screen.getByText("Signup successful! Redirecting to dashboard...")).toHaveClass("text-green-600");

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/factory-dashboard");
    }, { timeout: 3000 });
  });

  it("displays API error message from useFetchFactories", async () => {
    mockFactoryError = "Failed to fetch factories";
    render(<SignupPage />);

    const errorMessage = await screen.findByText("Failed to fetch factories");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-500");
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

  it("disables factory select when loading factories", () => {
    mockLoadingFactories = true;
    render(<SignupPage />);

    const factorySelect = screen.getByRole("combobox");
    expect(factorySelect).toBeDisabled();
  });

  it("restricts phone number input to digits and limits length", async () => {
    render(<SignupPage />);

    const phoneInput = screen.getByPlaceholderText("eg, 0747839864");
    await user.type(phoneInput, "+254709090909abc");

    expect(phoneInput).toHaveValue("254709090909"); 
  });
});