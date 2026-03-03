import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  cacheItem,
  getItemsCache,
  getItemFromCache,
  clearItemsCache,
  clearAllCache,
  __resetMemoryCache,
} from "../offlineStorage";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

const mockSetItem = AsyncStorage.setItem as jest.Mock<any>;
const mockGetItem = AsyncStorage.getItem as jest.Mock<any>;
const mockMultiGet = AsyncStorage.multiGet as jest.Mock<any>;
const mockMultiSet = AsyncStorage.multiSet as jest.Mock<any>;
const mockMultiRemove = AsyncStorage.multiRemove as jest.Mock<any>;
const mockRemoveItem = AsyncStorage.removeItem as jest.Mock<any>;

describe("OfflineStorage - Split Key Optimization", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    __resetMemoryCache();
  });

  describe("cacheItem", () => {
    it("should store item with individual key and update index", async () => {
      const item = {
        item_code: "ITEM001",
        item_name: "Test Item 1",
      };

      await cacheItem(item);

      // Verify individual storage
      expect(mockSetItem).toHaveBeenCalledWith(
        expect.stringContaining("item_cache:ITEM001"),
        expect.stringContaining("ITEM001")
      );

      // Verify index update
      expect(mockSetItem).toHaveBeenCalledWith(
        "items_cache_index",
        expect.stringContaining('["ITEM001"]')
      );
    });
  });

  describe("getItemsCache and Migration", () => {
    it("should migrate legacy monolithic cache if index is missing", async () => {
      const legacyData = {
        ITEM001: {
          item_code: "ITEM001",
          item_name: "Legacy Item 1",
          cached_at: new Date().toISOString(),
        },
      };

      // Mock sequence: index is null, legacy exists
      mockGetItem.mockImplementation((key: string) => {
        if (key === "items_cache_index") return Promise.resolve(null);
        if (key === "items_cache") return Promise.resolve(JSON.stringify({ value: legacyData }));
        return Promise.resolve(null);
      });

      const cache = await getItemsCache();

      expect(cache["ITEM001"]).toBeDefined();
      expect(cache["ITEM001"]?.item_name).toBe("Legacy Item 1");

      // Verify migration triggers multiSet and index update
      expect(mockMultiSet).toHaveBeenCalled();
      expect(mockSetItem).toHaveBeenCalledWith("items_cache_index", expect.any(String));
      expect(mockRemoveItem).toHaveBeenCalledWith("items_cache");
    });

    it("should load items via multiGet when index exists", async () => {
      mockGetItem.mockResolvedValueOnce(JSON.stringify({ value: ["ITEM_A", "ITEM_B"] }));

      mockMultiGet.mockResolvedValue([
        [
          "item_cache:ITEM_A",
          JSON.stringify({ value: { item_code: "ITEM_A", item_name: "Item A" } }),
        ],
        [
          "item_cache:ITEM_B",
          JSON.stringify({ value: { item_code: "ITEM_B", item_name: "Item B" } }),
        ],
      ]);

      const cache = await getItemsCache();

      expect(Object.keys(cache)).toHaveLength(2);
      expect(cache["ITEM_A"]?.item_name).toBe("Item A");
      expect(mockMultiGet).toHaveBeenCalledWith(
        expect.arrayContaining(["item_cache:ITEM_A", "item_cache:ITEM_B"])
      );
    });
  });

  describe("getItemFromCache", () => {
    it("should retrieve item from memory if already loaded", async () => {
      // Warm up cache
      mockGetItem.mockResolvedValueOnce(JSON.stringify({ value: ["ITEM_C"] }));
      mockMultiGet.mockResolvedValue([
        ["item_cache:ITEM_C", JSON.stringify({ value: { item_code: "ITEM_C" } })],
      ]);

      await getItemsCache();
      const item = await getItemFromCache("ITEM_C");

      expect(item).toBeDefined();
      expect(item?.item_code).toBe("ITEM_C");
      // items_cache_index should only have been read once
      expect(mockGetItem).toHaveBeenCalledTimes(1);
    });
  });

  describe("clearItemsCache", () => {
    it("should remove individual keys and index", async () => {
      // Set some data in memory
      mockGetItem.mockResolvedValueOnce(JSON.stringify({ value: ["X"] }));
      mockMultiGet.mockResolvedValue([
        ["item_cache:X", JSON.stringify({ value: { item_code: "X" } })],
      ]);
      await getItemsCache();

      await clearItemsCache();

      expect(mockMultiRemove).toHaveBeenCalledWith(
        expect.arrayContaining(["item_cache:X", "items_cache_index"])
      );
    });
  });
});
