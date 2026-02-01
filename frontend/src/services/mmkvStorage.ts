import { createLogger } from "./logging";
import { Platform } from "react-native";

const log = createLogger("mmkvStorage");

// Storage initialization
let storage: any;

// Detect if we are likely in a native environment that supports MMKV
const isNative = Platform.OS === "ios" || Platform.OS === "android";

if (isNative) {
  try {
    // Dynamic require prevents top-level import crashes in environments where NitroModules aren't linked (like Expo Go)
    const { MMKV } = require("react-native-mmkv");
    storage = new MMKV({
      id: "stock-verify-storage",
    });
    log.info("MMKV native storage initialized");
  } catch (e) {
    log.warn(
      "MMKV native initialization failed (likely Expo Go). Falling back to memory storage.",
      { error: String(e) }
    );
  }
}

// Fallback logic if native storage is unavailable or failed
// Fallback logic if native storage is unavailable or failed (e.g. Expo Go)
if (!storage) {
  const AsyncStorage = require("@react-native-async-storage/async-storage").default;
  // Create a synchronous-like wrapper for AsyncStorage (async operations will be fire-and-forget or handled gracefully)
  // NOTE: This shim is imperfect because AsyncStorage is async, but MMKV API is sync.
  // For critical config, this means initial load might need to be awaited elsewhere or accept defaults.

  log.warn("Using AsyncStorage fallback (Expo Go mode). Note: Data persistence is async.");

  // Simple in-memory cache to mimic sync behavior for current session
  const memoryCache = new Map<string, string>();

  // Try to hydrate cache from AsyncStorage on start (best effort)
  AsyncStorage.getAllKeys().then((keys: string[]) => {
    if (keys.length > 0) {
      AsyncStorage.multiGet(keys).then((pairs: [string, string | null][]) => {
        pairs.forEach(([key, value]) => {
          if (value) memoryCache.set(key, value);
        });
      });
    }
  });

  storage = {
    set: (key: string, value: string) => {
      memoryCache.set(key, value);
      AsyncStorage.setItem(key, value).catch((e: any) => log.error("AsyncStorage set failed", e));
    },
    getString: (key: string) => memoryCache.get(key),
    remove: (key: string) => {
      memoryCache.delete(key);
      AsyncStorage.removeItem(key).catch((e: any) => log.error("AsyncStorage remove failed", e));
    },
    clearAll: () => {
      memoryCache.clear();
      AsyncStorage.clear().catch((e: any) => log.error("AsyncStorage clear failed", e));
    },
  };
}

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
