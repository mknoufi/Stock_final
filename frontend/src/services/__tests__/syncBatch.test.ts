import { syncOfflineQueue } from "../syncService";
import * as coreApi from "../api/core";
import * as syncApi from "../api/sync";
import * as offlineStorage from "../offline/offlineStorage";

// Mock dependencies
jest.mock("../api/sync", () => ({ syncBatch: jest.fn() }));
jest.mock("../api/core", () => ({ isOnline: jest.fn(() => true) }));
jest.mock("../offline/offlineStorage");
jest.mock("../connectionManager", () => ({
  __esModule: true,
  default: {
    getInstance: jest.fn(() => ({
      isHealthy: true,
      backendUrl: "http://mock:8001",
      backendPort: 8001,
      backendIp: "mock",
      lastChecked: new Date().toISOString(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      initialize: jest.fn().mockResolvedValue(undefined),
    })),
  },
  ConnectionManager: {
    getInstance: jest.fn(() => ({
      isHealthy: true,
      backendUrl: "http://mock:8001",
      backendPort: 8001,
      backendIp: "mock",
      lastChecked: new Date().toISOString(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      initialize: jest.fn().mockResolvedValue(undefined),
    })),
  },
}));

jest.mock("../../store/authStore", () => ({
  useAuthStore: {
    getState: () => ({
      isAuthenticated: true,
      user: { username: "e2e", role: "staff" },
    }),
  },
}));
jest.mock(
  "@react-native-async-storage/async-storage",
  () =>
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
      .default,
);

describe("syncOfflineQueue", () => {
  const mockOperations = [
    {
      id: "op_1",
      type: "count_line",
      data: {
        session_id: "sess_1",
        item_code: "ITEM001",
        verified_qty: 10,
      },
      timestamp: "2023-01-01T00:00:00Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementations
    (offlineStorage.getOfflineQueue as jest.Mock).mockResolvedValue(
      mockOperations,
    );
    (offlineStorage.getCacheStats as jest.Mock).mockResolvedValue({
      queuedOperations: 1,
    });
    (coreApi.isOnline as jest.Mock).mockReturnValue(true);
    (syncApi.syncBatch as jest.Mock).mockResolvedValue({
      results: [{ id: "op_1", success: true }],
    });
    (offlineStorage.removeManyFromOfflineQueue as jest.Mock).mockResolvedValue(
      undefined,
    );
    (offlineStorage.updateQueueItemRetries as jest.Mock).mockResolvedValue(
      undefined,
    );
  });

  it("should sync operations from offline queue", async () => {
    const result = await syncOfflineQueue();

    // Verify API called with transformed operations
    expect(syncApi.syncBatch).toHaveBeenCalledWith([
      expect.objectContaining({
        id: "op_1",
        type: "count_line",
        data: expect.objectContaining({
          session_id: "sess_1",
          item_code: "ITEM001",
          verified_qty: 10,
        }),
      }),
    ]);

    // Verify success handling
    expect(result.success).toBe(1);
    expect(result.failed).toBe(0);
    expect(offlineStorage.removeManyFromOfflineQueue).toHaveBeenCalledWith([
      "op_1",
    ]);
  });

  it("should handle ignored operations (empty queue)", async () => {
    (offlineStorage.getOfflineQueue as jest.Mock).mockResolvedValue([]);

    const result = await syncOfflineQueue();

    expect(syncApi.syncBatch).not.toHaveBeenCalled();
    expect(result.total).toBe(0);
  });

  it("should handle partial failures", async () => {
    (syncApi.syncBatch as jest.Mock).mockResolvedValue({
      results: [{ id: "op_1", success: false, message: "Duplicate record" }],
    });

    const result = await syncOfflineQueue();

    expect(result.failed).toBe(1);
    expect(result.success).toBe(0);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        id: "op_1",
        error: "Duplicate record",
      }),
    );
    // Should NOT remove failed items
    expect(offlineStorage.removeManyFromOfflineQueue).not.toHaveBeenCalled();
    // Should update retries
    expect(offlineStorage.updateQueueItemRetries).toHaveBeenCalledWith("op_1");
  });

  it("should not sync when offline", async () => {
    (coreApi.isOnline as jest.Mock).mockReturnValue(false);

    const result = await syncOfflineQueue();

    expect(syncApi.syncBatch).not.toHaveBeenCalled();
    expect(result.total).toBe(0);
  });
});
