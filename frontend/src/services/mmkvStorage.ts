import { createMMKV } from "react-native-mmkv";
import { createLogger } from "./logging";

const log = createLogger("mmkvStorage");

// Create the MMKV instance using the factory function (Nitro modules API)
const storage = createMMKV({
  id: "stock-verify-storage",
});

/**
 * MMKV Storage engine
 * Provides synchronous, high-performance key-value storage.
 * Direct drop-in replacement for the previous shim.
 */
export const mmkvStorage = {
  /**
   * Synchronously get an item
   */
  getItem: (key: string): string | null => {
    try {
      const value = storage.getString(key);
      return value ?? null;
    } catch (err) {
      log.warn("Failed to get item", { key, error: String(err) });
      return null;
    }
  },

  /**
   * Async version for compatibility with high-level code thinking storage might be slow
   */
  getItemAsync: async (key: string): Promise<string | null> => {
    return mmkvStorage.getItem(key);
  },

  /**
   * Synchronously set an item
   */
  setItem: (key: string, value: string): void => {
    try {
      storage.set(key, value);
    } catch (err) {
      log.warn("Failed to set item", { key, error: String(err) });
    }
  },

  /**
   * Synchronously remove an item
   */
  removeItem: (key: string): void => {
    try {
      storage.remove(key);
    } catch (err) {
      log.warn("Failed to remove item", { key, error: String(err) });
    }
  },

  /**
   * Flush all items (noop for MMKV as it's already synchronous and thread-safe)
   */
  flush: async (): Promise<void> => {
    // MMKV is already synchronous
    return Promise.resolve();
  },

  /**
   * Initialize (noop for MMKV, maintained for API compatibility)
   */
  initialize: async (): Promise<void> => {
    log.debug("MMKV storage ready");
    return Promise.resolve();
  },

  /**
   * Clear all storage (use with caution)
   */
  clearAll: (): void => {
    try {
      storage.clearAll();
    } catch (err) {
      log.warn("Failed to clear storage", { error: String(err) });
    }
  },
};
