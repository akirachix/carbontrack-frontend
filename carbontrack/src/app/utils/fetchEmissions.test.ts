import { fetchEmissions } from "../utils/fetchEmissions";

describe("fetchEmissions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches emissions successfully", async () => {
    const mockData = [
      { emissions_id: 1, emission_rate: "2.5", updated_at: "2025-09-18T10:00:00Z" },
      { emissions_id: 2, emission_rate: "1.5", updated_at: "2025-09-18T14:00:00Z" },
    ];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    }) as unknown as typeof fetch;

    const result = await fetchEmissions();

    expect(global.fetch).toHaveBeenCalledWith("/api/emissions");
    expect(result).toEqual(mockData);
  });

  it("throws an error if response is not ok", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: "Internal Server Error",
    }) as unknown as typeof fetch;

    await expect(fetchEmissions()).rejects.toThrow(
      "Something went wrongInternal Server Error"
    );
  });

  it("throws an error if fetch fails", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network failure"));

    await expect(fetchEmissions()).rejects.toThrow(
      "Failed to fetch usersNetwork failure"
    );
  });
});