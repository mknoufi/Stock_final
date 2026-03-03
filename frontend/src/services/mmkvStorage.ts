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
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
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
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const AsyncStorage = require("@react-native-async-storage/async-storage").default;
  // Create a synchronous-like wrapper for AsyncStorage (async operations will be fire-and-forget or handled gracefully)
  // NOTE: This shim is imperfect because AsyncStorage is async, but MMKV API is sync.
  // For critical config, this means initial load might need to be awaited elsewhere or accept defaults.

  log.warn("Using AsyncStorage fallback (Expo Go mode). Note: Data persistence is async.");

  // Simple in-memory cache to mimic sync behavior for current session
  const memoryCache = new Map<string, string>();
  let hydrationPromise: Promise<void> | null = null;

  const hydrate = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      if (keys.length > 0) {
        const pairs = await AsyncStorage.multiGet(keys);
        pairs.forEach(([key, value]: [string, string | null]) => {
          if (value) memoryCache.set(key, value);
        });
      }
    } catch (e) {
      log.error("AsyncStorage hydration failed", e);
    }
  };

  hydrationPromise = hydrate();

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
    // Internal helper to wait for hydration
    _waitForHydration: () => hydrationPromise,
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
    if (storage._waitForHydration) {
      await storage._waitForHydration();
    }
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
    if (storage._waitForHydration) {
      await storage._waitForHydration();
    }
    return Promise.resolve();
  },

  /**
   * Initialize (waits for hydration if in fallback mode)
   */
  initialize: async (): Promise<void> => {
    if (storage._waitForHydration) {
      log.debug("Waiting for storage hydration...");
      await storage._waitForHydration();
    }
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
