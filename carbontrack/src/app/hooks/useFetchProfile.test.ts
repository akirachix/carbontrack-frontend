import * as fetchProfileModule from "../utils/fetchProfile";
import { renderHook, waitFor } from "@testing-library/react";
import useFetchUsers from "./useFetchProfile";

jest.mock("../utils/fetchProfile");

describe("useFetchUsers", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should fetch and set user data successfully", async () => {
    type User = {
      email: string;
      first_name: string;
      last_name: string;
      created_at: string;
      profile_image: string;
      user_type: string;
      phone_number: string;
      password: string;
    };

    const mockUser: User = {
      email: "test@example.com",
      first_name: "John",
      last_name: "Doe",
      created_at: "2024-01-01",
      profile_image: "img.png",
      user_type: "admin",
      phone_number: "1234567890",
      password: "secret",
    };

    const fetchProfileMock = fetchProfileModule.fetchProfile as jest.MockedFunction<typeof fetchProfileModule.fetchProfile>;
    fetchProfileMock.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useFetchUsers());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.user).toEqual(mockUser);
  });

  it("should set error if fetchProfile throws", async () => {
    const fetchProfileMock = fetchProfileModule.fetchProfile as jest.MockedFunction<typeof fetchProfileModule.fetchProfile>;
    fetchProfileMock.mockRejectedValue(new Error("Failed to fetch"));

    const { result } = renderHook(() => useFetchUsers());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe("Failed to fetch");
  });

  it("should initially set loading to true", () => {
    const fetchProfileMock = fetchProfileModule.fetchProfile as jest.MockedFunction<typeof fetchProfileModule.fetchProfile>;
    fetchProfileMock.mockResolvedValue(null as unknown as ReturnType<typeof fetchProfileModule.fetchProfile>);

    const { result } = renderHook(() => useFetchUsers());

    expect(result.current.loading).toBe(true);
  });
});
