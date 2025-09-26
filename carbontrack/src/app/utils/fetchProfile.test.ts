import { fetchProfile } from "./fetchProfile";

describe("fetchProfile", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(),
      },
      writable: true,
    });

    global.fetch = jest.fn();
  });

  it("throws if called outside browser", async () => {
    const originalWindow = globalThis.window;

    if ("window" in globalThis) {
      delete (globalThis as Omit<typeof globalThis, "window"> & { window?: typeof window }).window; 
    }

    await expect(fetchProfile()).rejects.toThrow("No token found in localStorage.");

    globalThis.window = originalWindow;
  });

  it("throws if no access token in localStorage", async () => {
    (window.localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === "accessToken") return null;
      if (key === "user") return JSON.stringify({ id: "123" });
      return null;
    });

    await expect(fetchProfile()).rejects.toThrow("No token found in localStorage.");
  });

  it("throws if no user ID in localStorage", async () => {
    (window.localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === "accessToken") return "token";
      if (key === "user") return null;
      return null;
    });

    await expect(fetchProfile()).rejects.toThrow("No user ID found in localStorage.");
  });

  it("fetches and returns user profile data correctly", async () => {
    (window.localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === "accessToken") return "token";
      if (key === "user") return JSON.stringify({ id: "123" });
      return null;
    });

    const mockData = { email: "test@example.com" };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const data = await fetchProfile();

    expect(global.fetch).toHaveBeenCalledWith("/api/profile?userId=123", {
      headers: { Authorization: "Token token" },
    });
    expect(data).toEqual(mockData);
  });

  it("throws error from server if response not ok", async () => {
    (window.localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === "accessToken") return "token";
      if (key === "user") return JSON.stringify({ id: "123" });
      return null;
    });

    const mockError = { message: "Not found" };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue(mockError),
    });

    await expect(fetchProfile()).rejects.toThrow("Not found");
  });
});
