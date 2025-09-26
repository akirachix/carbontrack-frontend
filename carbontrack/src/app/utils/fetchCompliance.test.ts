import { fetchCompliance, updateCompliance } from "./fetchCompliance";
const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;
describe("fetchCompliance util", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches compliance successfully", async () => {
    const mockData = [{ id: 1, compliance_target: "1.0", factory: 101 }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });
    const result = await fetchCompliance();
    expect(mockFetch).toHaveBeenCalledWith("/api/compliance");
    expect(result).toEqual(mockData);
  });
  it("throws error when response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Bad Request",
    });
    await expect(fetchCompliance()).rejects.toThrow(
      "Something went wrongBad Request"
    );
  });
  it("throws error on network failure", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    await expect(fetchCompliance()).rejects.toThrow(
      "Failed to fetch usersNetwork error"
    );
  });
});
describe("updateCompliance util", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("sends PUT request and returns updated compliance", async () => {
    const updatedData = { id: 1, compliance_target: "1.2", factory: 101 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedData,
    });
    const result = await updateCompliance(1, "1.2", 101);
    expect(mockFetch).toHaveBeenCalledWith("/api/compliance/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ compliance_target: "1.2", factory: 101 }),
    });
    expect(result).toEqual(updatedData);
  });
  it("throws error when update response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    await expect(updateCompliance(1, "1.2", 101)).rejects.toThrow(
      "Failed to update compliance"
    );
  });
});









