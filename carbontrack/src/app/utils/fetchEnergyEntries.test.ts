import { fetchEnergy } from "../utils/fetchEnergyEntries";

describe("fetchEnergy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches energy entries successfully", async () => {
    const mockData = [
      { id: 1, factory: 10, co2_equivalent: "5.2", created_at: "2025-09-18T10:00:00Z" },
      { id: 2, factory: 10, co2_equivalent: "3.4", created_at: "2025-09-18T14:00:00Z" },
    ];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    }) as unknown as typeof fetch;

    const result = await fetchEnergy();

    expect(global.fetch).toHaveBeenCalledWith("/api/energy_entries");
    expect(result).toEqual(mockData);
  });

  it("throws an error if response is not ok", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: "Not Found",
    }) as unknown as typeof fetch;

    await expect(fetchEnergy()).rejects.toThrow(
      "Something went wrongNot Found"
    );
  });

  it("throws an error if fetch fails", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    await expect(fetchEnergy()).rejects.toThrow(
      "Failed to fetch usersNetwork error"
    );
  });

  it("throws an error if response.json fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
    }) as unknown as typeof fetch;

    await expect(fetchEnergy()).rejects.toThrow(
      "Failed to fetch usersInvalid JSON"
    );
  });
});
