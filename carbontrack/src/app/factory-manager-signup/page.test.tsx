import React from "react";
import { render, screen } from "@testing-library/react";
import SignupPage from "./page";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));


const mockSignup = jest.fn().mockResolvedValue(true);

let mockLoadingFactories = false;
let mockFactoryError: string | null = null;
const mockFactories = [
  { factory_id: "1", factory_name: "Factory A" },
  { factory_id: "2", factory_name: "Factory B" },
];


jest.mock("../hooks/useFetchFactories", () =>
  jest.fn(() => ({
    factories: mockFactories,
    loading: mockLoadingFactories,
    error: mockFactoryError,
  }))
);


let mockSignupError: string | null = null;
let mockLoadingSignup = false;

jest.mock("../hooks/useFetchSignup", () => ({
  __esModule: true,
  useFetchSignup: () => ({
    signup: mockSignup,
    loading: mockLoadingSignup,
    error: mockSignupError,
  }),
}));

describe("SignupPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignupError = null;
    mockLoadingSignup = false;
  });

  it("renders signup form with expected fields", () => {
    render(<SignupPage />);
    expect(screen.getByAltText("carbon-track logo")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sign Up" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("eg, Mark")).toBeInTheDocument();
  });
  it("displays API error message from useFetchFactories", async () => {
    mockFactoryError = "Failed to fetch factories";
    render(<SignupPage />);

    const errorMessage = await screen.findByText("Failed to fetch factories");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-500");

    mockFactoryError = null; 
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
});

  it("shows loading state on button when signing up", () => {
    jest.mock("../hooks/useFetchSignup", () => ({
      __esModule: true,
      useFetchSignup: () => ({
        signup: mockSignup,
        loading: true,
        error: null,
      }),
    }));
    render(<SignupPage />);
    const button = screen.getByRole("button", { name: /Signing Up.../i });
    expect(button).toBeInTheDocument();
  });

  it("disables factory select when loading factories", () => {
    mockLoadingFactories = true;
    render(<SignupPage />);
    const factorySelect = screen.getByRole("combobox");
    expect(factorySelect).toBeDisabled();
    mockLoadingFactories = false; 
  });

