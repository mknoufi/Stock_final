import { createCountLine, getWarehouses, updateSessionStatus } from "./api";
import api from "../httpClient";

// Mock dependencies
jest.mock("../httpClient", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
}));

jest.mock("../../utils/network", () => ({
  isOnline: jest.fn().mockReturnValue(true),
  getNetworkStatus: jest
    .fn()
    .mockReturnValue({ status: "ONLINE", isOnline: true }),
}));

jest.mock("../offline/offlineStorage", () => ({
  getWarehousesCache: jest.fn().mockReturnValue([]),
  cacheCountLine: jest.fn(),
  addToOfflineQueue: jest.fn(),
  getItemFromCache: jest.fn(),
}));

describe("API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getWarehouses", () => {
    it("should URL encode zone parameter", async () => {
      const mockZone = "Showroom Space";
      (api.get as jest.Mock).mockResolvedValue({ data: [] });

      await getWarehouses(mockZone);

      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining("zone=Showroom%20Space"),
      );
    });

    it("should handle empty zone parameter", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: [] });

      await getWarehouses();

      expect(api.get).toHaveBeenCalledWith("/api/v2/locations/warehouses");
    });
  });

  describe("updateSessionStatus", () => {
    it("should route close requests to complete endpoint even with lowercase status", async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: { success: true } });

      await updateSessionStatus("session-1", "closed");

      expect(api.post).toHaveBeenCalledWith("/api/sessions/session-1/complete");
      expect(api.put).not.toHaveBeenCalled();
    });

    it("should normalize and encode non-close statuses", async () => {
      (api.put as jest.Mock).mockResolvedValue({ data: { success: true } });

      await updateSessionStatus("session-2", "pending review");

      expect(api.put).toHaveBeenCalledWith(
        "/api/sessions/session-2/status?status=PENDING%20REVIEW",
      );
    });
  });

  describe("createCountLine", () => {
    it("should normalize draft photo_proofs shape to backend schema", async () => {
      (api.post as jest.Mock).mockResolvedValue({
        data: { id: "line_1", item_code: "15496" },
      });

      await createCountLine({
        session_id: "session_1",
        item_code: "15496",
        counted_qty: 1,
        photo_proofs: [
          {
            type: "ITEM",
            uri: "file:///tmp/test-photo.jpg",
            base64: "abc123",
            capturedAt: "2026-02-10T08:44:40.188Z",
          } as any,
        ],
      });

      expect(api.post).toHaveBeenCalledWith(
        "/api/count-lines",
        expect.objectContaining({
          photo_proofs: [
            expect.objectContaining({
              id: expect.any(String),
              url: "file:///tmp/test-photo.jpg",
              timestamp: "2026-02-10T08:44:40.188Z",
            }),
          ],
        }),
        expect.any(Object),
      );
    });
  });
});
