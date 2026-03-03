import AsyncStorage from "@react-native-async-storage/async-storage";
import { storage } from "../storage/asyncStorageService";
import { levenshteinDistance } from "../../utils/algorithms";
import { createLogger } from "../logging";

const log = createLogger("OfflineStorage");

/**
 * Generate a deterministic idempotency key from a stable payload string.
 * Uses SHA-256 via SubtleCrypto when available, falls back to a simple
 * DJB2-based hex hash for environments without SubtleCrypto.
 */
async function generateIdempotencyKey(payload: string): Promise<string> {
  try {
    if (typeof globalThis.crypto?.subtle?.digest === "function") {
      const encoder = new TextEncoder();
      const data = encoder.encode(payload);
      const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }
  } catch {
    // SubtleCrypto unavailable — fall through to simple hash
  }
  // DJB2 fallback (non-crypto, but deterministic)
  let h = 5381;
  for (let i = 0; i < payload.length; i++) {
    h = ((h << 5) + h + payload.charCodeAt(i)) >>> 0;
  }
  return `djb2-${h.toString(16)}`;
}

// MMKV fallback handling
// const _MMKV_FALLBACK_WARNING = `  MMKV native initialization failed. Using AsyncStorage fallback.
// * Data persistence is async in Expo Go mode
// * For better performance, build the app with native code
// * See: https://docs.expo.dev/bare/using-expo-client/`;

const STORAGE_KEYS = {
  ITEM_CACHE_PREFIX: "item_cache:",
  ITEMS_CACHE_INDEX: "items_cache_index", // List of keys for bulk loading
  OFFLINE_QUEUE: "offline_queue",
  SESSIONS_CACHE: "sessions_cache",
  COUNT_LINES_CACHE: "count_lines_cache",
  LAST_SYNC: "last_sync",
  USER_DATA: "user_data",
};

// In-Memory Cache Layer
// Prevents synchronous JSON parsing of massive blobs on every read
let _memoryItemsCache: Record<string, CachedItem> | null = null;
let _memorySessionsCache: Record<string, CachedSession> | null = null;
let _memoryCountLinesCache: Record<string, CachedCountLine[]> | null = null;
let _memoryOfflineQueue: OfflineQueueItem[] | null = null;

const MAX_ITEMS_CACHE_SIZE = 2000; // Limit total items to prevent OOM
const PRUNE_BATCH_SIZE = 200; // Remove 200 oldest items when limit reached

/**
 * Data source metadata for cached items
 */
export type DataSource = "api" | "cache" | "offline" | "sql";

/**
 * Extended result with source metadata
 */
export interface CacheResult<T> {
  data: T;
  _source: DataSource;
  _cachedAt: string | null;
  _stale: boolean;
}

/**
 * Check if cached data is stale (older than threshold)
 * Default: 1 hour
 */
export function isCacheStale(cachedAt: string | null, maxAgeMs: number = 60 * 60 * 1000): boolean {
  if (!cachedAt) return true;
  const cacheTime = new Date(cachedAt).getTime();
  return Date.now() - cacheTime > maxAgeMs;
}

export interface CachedItem {
  item_code: string;
  barcode?: string;
  item_name: string;
  description?: string;
  uom?: string;
  uom_name?: string;
  mrp?: number;
  sales_price?: number;
  sale_price?: number;
  category?: string;
  subcategory?: string;
  current_stock?: number;
  warehouse?: string;
  manual_barcode?: string;
  unit2_barcode?: string;
  unit_m_barcode?: string;
  batch_id?: string;
  is_serialized?: boolean;
  cached_at: string;
}

export interface OfflineQueueItem {
  id: string;
  type: "count_line" | "session" | "unknown_item";
  data: Record<string, unknown>;
  timestamp: string;
  retries: number;
  idempotency_key: string;
}

export interface CachedSession {
  id: string;
  warehouse: string;
  staff_user: string;
  staff_name: string;
  status: string;
  type: string;
  started_at: string;
  closed_at?: string;
  reconciled_at?: string;
  total_items?: number;
  total_variance?: number;
  notes?: string;
  cached_at: string;
  // Legacy fields fallback
  session_id?: string;
  created_by?: string;
  created_at?: string;
}

export interface CachedCountLine {
  _id: string;
  session_id: string;
  item_code: string;
  item_name: string;
  counted_qty: number;
  system_qty?: number;
  variance?: number;
  counted_by: string;
  counted_at: string;
  cached_at: string;
  rack_no?: string;
  rack?: string;
  rack_id?: string;
  verified?: boolean;
  // Allow any additional audit fields
  [key: string]: unknown;
}

/**
 * Validation result for cache operations
 */
export interface CacheValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate that an item has the minimum required fields for caching.
 * Prevents corrupt cache entries.
 */
export function assertValidCachedItem(item: Partial<CachedItem>): CacheValidationResult {
  const errors: string[] = [];

  if (!item.item_code || typeof item.item_code !== "string") {
    errors.push("item_code is required and must be a string");
  }
  if (!item.item_name || typeof item.item_name !== "string") {
    errors.push("item_name is required and must be a string");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate that a count line has the minimum required fields for caching.
 */
export function assertValidCachedCountLine(line: Partial<CachedCountLine>): CacheValidationResult {
  const errors: string[] = [];

  if (!line._id || typeof line._id !== "string") {
    errors.push("_id is required and must be a string");
  }
  if (!line.session_id || typeof line.session_id !== "string") {
    errors.push("session_id is required and must be a string");
  }
  if (!line.item_code || typeof line.item_code !== "string") {
    errors.push("item_code is required and must be a string");
  }
  if (typeof line.counted_qty !== "number") {
    errors.push("counted_qty is required and must be a number");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function normalizeCountLineForCache(countLine: any): any {
  if (!countLine || typeof countLine !== "object") return countLine;

  // Backend responses may use `id` (UUID) while offline cache expects `_id`.
  // Normalize to `_id` to keep cache keys consistent and prevent validation warnings.
  const normalized = { ...countLine };

  // Explicitly resolve the best candidate for the primary key
  const candidateId = normalized._id || normalized.id || normalized.line_id;

  if (candidateId) {
    normalized._id = String(candidateId);
  } else {
    // Generate a temporary ID to prevent validation failures (e.g. optimistic UI updates)
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    normalized._id = tempId;

    // Log warning but allow proceeding
    log.warn("normalizeCountLineForCache: No ID found, generated temp ID", {
      item_code: normalized.item_code,
      session_id: normalized.session_id,
      generated_id: tempId,
    });
  }

  // Ensure type consistency for other core fields
  if (normalized.session_id != null && typeof normalized.session_id !== "string") {
    normalized.session_id = String(normalized.session_id);
  }
  if (normalized.item_code != null && typeof normalized.item_code !== "string") {
    normalized.item_code = String(normalized.item_code);
  }
  if (typeof normalized.counted_qty === "string" && normalized.counted_qty.trim() !== "") {
    const parsed = Number(normalized.counted_qty);
    if (Number.isFinite(parsed)) normalized.counted_qty = parsed;
  }

  return normalized;
}

// Internal: Prune items cache if too large
const pruneItemsCache = (cache: Record<string, CachedItem>): Record<string, CachedItem> => {
  const keys = Object.keys(cache);
  if (keys.length <= MAX_ITEMS_CACHE_SIZE) {
    return cache;
  }

  log.warn(
    `Items cache exceeded limit (${keys.length} > ${MAX_ITEMS_CACHE_SIZE}). Pruning ${PRUNE_BATCH_SIZE} oldest items.`
  );

  // Sort by cached_at ascending (oldest first)
  const sortedKeys = keys.sort((a, b) => {
    const itemA = cache[a];
    const itemB = cache[b];
    const timeA = itemA ? new Date(itemA.cached_at).getTime() : 0;
    const timeB = itemB ? new Date(itemB.cached_at).getTime() : 0;
    return timeA - timeB;
  });

  // Remove oldest items
  const keysToRemove = sortedKeys.slice(0, PRUNE_BATCH_SIZE);
  const newCache = { ...cache };
  keysToRemove.forEach((key) => delete newCache[key]);

  return newCache;
};

// Item Cache Operations
export const cacheItem = async (item: Omit<CachedItem, "cached_at">) => {
  try {
    // Validate before caching
    const validation = assertValidCachedItem(item);
    if (!validation.valid) {
      log.warn("Attempted to cache invalid item", {
        errors: validation.errors,
        itemCode: item.item_code,
      });
      return null;
    }

    const cachedItem: CachedItem = {
      ...item,
      cached_at: new Date().toISOString(),
    };

    // Update memory
    if (!_memoryItemsCache) {
      await getItemsCache();
    }

    _memoryItemsCache = {
      ...(_memoryItemsCache || {}),
      [item.item_code]: cachedItem,
    };

    // Prune memory if needed (limit RAM usage)
    _memoryItemsCache = pruneItemsCache(_memoryItemsCache);

    // Persist INDIVIDUAL key to storage (extremely fast)
    const itemKey = `${STORAGE_KEYS.ITEM_CACHE_PREFIX}${item.item_code}`;
    await storage.set(itemKey, cachedItem);

    // Update index of cached keys
    const index = Object.keys(_memoryItemsCache);
    await storage.set(STORAGE_KEYS.ITEMS_CACHE_INDEX, index);

    return cachedItem;
  } catch (error) {
    log.error("Error caching item", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

export const getItemsCache = async (): Promise<Record<string, CachedItem>> => {
  // Optimization: Return memory cache if warm
  if (_memoryItemsCache) {
    return _memoryItemsCache;
  }

  try {
    // Load index first
    const index = await storage.get<string[]>(STORAGE_KEYS.ITEMS_CACHE_INDEX, {
      defaultValue: [],
    });

    if (!index || index.length === 0) {
      // Check for legacy monolithic cache and migrate if found
      const legacyCache = await storage.get<Record<string, CachedItem>>("items_cache");
      if (legacyCache && Object.keys(legacyCache).length > 0) {
        log.info(`Migrating ${Object.keys(legacyCache).length} items from legacy cache...`);
        _memoryItemsCache = legacyCache;

        // Background migration: save individual keys
        const migrationPairs: [string, CachedItem][] = Object.entries(legacyCache).map(
          ([code, item]) => [`${STORAGE_KEYS.ITEM_CACHE_PREFIX}${code}`, item]
        );
        await storage.setMultiple(migrationPairs);
        await storage.set(STORAGE_KEYS.ITEMS_CACHE_INDEX, Object.keys(legacyCache));
        await storage.remove("items_cache"); // Remove legacy key

        return _memoryItemsCache;
      }

      _memoryItemsCache = {};
      return {};
    }

    // Bulk load using multiGet (efficient)
    const itemKeys = index.map((code) => `${STORAGE_KEYS.ITEM_CACHE_PREFIX}${code}`);
    const results = await storage.getMultiple<CachedItem>(itemKeys);

    const cache: Record<string, CachedItem> = {};
    Object.entries(results).forEach(([key, value]) => {
      if (value) {
        const itemCode = key.replace(STORAGE_KEYS.ITEM_CACHE_PREFIX, "");
        cache[itemCode] = value;
      }
    });

    _memoryItemsCache = cache;
    return _memoryItemsCache;
  } catch (error) {
    log.error("Error loading items cache", { error });
    return {};
  }
};

export const getItemFromCache = async (itemCode: string): Promise<CachedItem | null> => {
  try {
    const cache = await getItemsCache();
    return cache[itemCode] || null;
  } catch (error) {
    __DEV__ && console.error("Error getting item from cache:", error);
    return null;
  }
};

export const searchItemsInCache = async (query: string): Promise<CachedItem[]> => {
  try {
    // getItemsCache now serves from memory, making this fast
    const cache = await getItemsCache();
    const items = Object.values(cache);

    if (!query) return items.slice(0, 50); // Return first 50 if no query

    const lowerQuery = query.toLowerCase();

    return items.filter((item) => {
      const code = (item.item_code || "").toLowerCase();
      const name = (item.item_name || "").toLowerCase();
      const barcode = (item.barcode || "").toLowerCase();

      // Direct includes check (fast path)
      if (code.includes(lowerQuery) || name.includes(lowerQuery) || barcode.includes(lowerQuery)) {
        return true;
      }

      // Levenshtein distance check (slower path for typos)
      // Only check if query is long enough to matter
      if (lowerQuery.length > 3) {
        const distName = levenshteinDistance(name, lowerQuery);
        // Allow 2 edits for name
        if (distName <= 2) return true;
      }

      return false;
    });
  } catch (error) {
    __DEV__ && console.error("Error searching items in cache:", error);
    return [];
  }
};

export const clearItemsCache = async () => {
  try {
    const cache = await getItemsCache();
    const itemKeys = Object.keys(cache).map((code) => `${STORAGE_KEYS.ITEM_CACHE_PREFIX}${code}`);

    _memoryItemsCache = null; // Clear memory

    await AsyncStorage.multiRemove([...itemKeys, STORAGE_KEYS.ITEMS_CACHE_INDEX]);
  } catch (error) {
    __DEV__ && console.error("Error clearing items cache:", error);
  }
};

// Offline Queue Operations
export const addToOfflineQueue = async (
  type: OfflineQueueItem["type"],
  data: Record<string, unknown>
) => {
  try {
    const queue = await getOfflineQueue();
    const ts = new Date().toISOString();
    // Idempotency key excludes timestamp so identical logical operations
    // produce the same key (prevents duplicate sync on double-tap).
    const idempotencyPayload = [
      type,
      data.session_id ?? "",
      data.item_code ?? "",
      data.counted_qty ?? "",
    ].join("|");
    const idempotencyKey = await generateIdempotencyKey(idempotencyPayload);

    // Duplicate guard: prevent re-queueing the same logical operation
    const existingDup = queue.find((q) => q.idempotency_key === idempotencyKey);
    if (existingDup) {
      if (__DEV__) {
        console.warn("OfflineQueue: Duplicate idempotency key, skipping enqueue", idempotencyKey);
      }
      return existingDup;
    }

    const queueItem: OfflineQueueItem = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: ts,
      retries: 0,
      idempotency_key: idempotencyKey,
    };

    const newQueue = [...queue, queueItem];
    _memoryOfflineQueue = newQueue; // Update memory

    await storage.set(STORAGE_KEYS.OFFLINE_QUEUE, newQueue);
    return queueItem;
  } catch (error) {
    __DEV__ && console.error("Error adding to offline queue:", error);
    throw error;
  }
};

export const getOfflineQueue = async (): Promise<OfflineQueueItem[]> => {
  if (_memoryOfflineQueue) return _memoryOfflineQueue;

  try {
    const queue = await storage.get<OfflineQueueItem[]>(STORAGE_KEYS.OFFLINE_QUEUE, {
      defaultValue: [],
    });
    _memoryOfflineQueue = queue ?? [];
    return _memoryOfflineQueue;
  } catch (error) {
    __DEV__ && console.error("Error getting offline queue:", error);
    return [];
  }
};

export const removeFromOfflineQueue = async (id: string) => {
  try {
    const queue = await getOfflineQueue();
    const updatedQueue = queue.filter((item) => item.id !== id);
    _memoryOfflineQueue = updatedQueue; // Update memory
    await storage.set(STORAGE_KEYS.OFFLINE_QUEUE, updatedQueue);
  } catch (error) {
    __DEV__ && console.error("Error removing from offline queue:", error);
  }
};

export const removeManyFromOfflineQueue = async (ids: string[]) => {
  try {
    const queue = await getOfflineQueue();
    const updatedQueue = queue.filter((item) => !ids.includes(item.id));

    if (queue.length !== updatedQueue.length) {
      log.debug("Removed confirmed items from offline queue", {
        removed: queue.length - updatedQueue.length,
        remaining: updatedQueue.length,
      });
    }

    _memoryOfflineQueue = updatedQueue; // Update memory
    await storage.set(STORAGE_KEYS.OFFLINE_QUEUE, updatedQueue);
  } catch (error) {
    __DEV__ && console.error("Error removing many from offline queue:", error);
  }
};

export const updateQueueItemRetries = async (id: string) => {
  try {
    const queue = await getOfflineQueue();
    const updatedQueue = queue.map((item) =>
      item.id === id ? { ...item, retries: item.retries + 1 } : item
    );
    _memoryOfflineQueue = updatedQueue; // Update memory
    await storage.set(STORAGE_KEYS.OFFLINE_QUEUE, updatedQueue);
  } catch (error) {
    __DEV__ && console.error("Error updating queue item retries:", error);
  }
};

export const clearOfflineQueue = async () => {
  try {
    _memoryOfflineQueue = null; // Clear memory
    await storage.remove(STORAGE_KEYS.OFFLINE_QUEUE);
  } catch (error) {
    __DEV__ && console.error("Error clearing offline queue:", error);
  }
};

// Session Cache Operations
export const cacheSession = async (session: Omit<CachedSession, "cached_at"> | any) => {
  try {
    const normalizedSession: CachedSession = {
      id: session.id || session.session_id || `temp_${Date.now()}`,
      warehouse: session.warehouse,
      status: session.status,
      type: session.type || "STANDARD",
      staff_user: session.staff_user || session.created_by || "unknown",
      staff_name: session.staff_name || "Staff",
      started_at: session.started_at || session.created_at || new Date().toISOString(),
      closed_at: session.closed_at,
      reconciled_at: session.reconciled_at,
      total_items: session.total_items,
      total_variance: session.total_variance,
      notes: session.notes,
      cached_at: new Date().toISOString(),
    };

    if (!normalizedSession.id || normalizedSession.id === "undefined") {
      log.warn("Attempted to cache session with invalid ID", {
        session_id: session?.session_id,
        id: session?.id,
      });
      return normalizedSession;
    }

    const existingCache = await getSessionsCache();
    const updatedCache = {
      ...existingCache,
      [normalizedSession.id]: normalizedSession,
    };

    // Remove any undefined keys if present
    delete (updatedCache as any)["undefined"];

    _memorySessionsCache = updatedCache; // Update memory
    await storage.set(STORAGE_KEYS.SESSIONS_CACHE, updatedCache);
    return normalizedSession;
  } catch (error) {
    __DEV__ && console.error("Error caching session:", error);
    throw error;
  }
};

export const removeSessionFromCache = async (sessionId: string) => {
  try {
    const cache = await getSessionsCache();
    if (cache[sessionId]) {
      const { [sessionId]: _removed, ...rest } = cache;
      _memorySessionsCache = rest; // Update memory
      await storage.set(STORAGE_KEYS.SESSIONS_CACHE, rest);
      log.debug("Removed session from cache", { sessionId });
    }
  } catch (error) {
    log.error("Error removing session from cache", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getSessionsCache = async (): Promise<Record<string, CachedSession>> => {
  if (_memorySessionsCache) return _memorySessionsCache;

  try {
    const cache = await storage.get<Record<string, CachedSession>>(STORAGE_KEYS.SESSIONS_CACHE, {
      defaultValue: {},
    });

    // Self-healing
    if (cache && (cache as any)["undefined"]) {
      const cleanCache = { ...cache };
      delete (cleanCache as any)["undefined"];
      _memorySessionsCache = cleanCache;
      await storage.set(STORAGE_KEYS.SESSIONS_CACHE, cleanCache);
      return cleanCache;
    }

    _memorySessionsCache = cache ?? {};
    return _memorySessionsCache;
  } catch (error) {
    __DEV__ && console.error("Error getting sessions cache:", error);
    return {};
  }
};

export const getSessionFromCache = async (sessionId: string): Promise<CachedSession | null> => {
  try {
    const cache = await getSessionsCache();
    return cache[sessionId] || null;
  } catch (error) {
    __DEV__ && console.error("Error getting session from cache:", error);
    return null;
  }
};

// Count Lines Cache Operations
export const cacheCountLine = async (countLine: Omit<CachedCountLine, "cached_at">) => {
  try {
    const normalizedCountLine = normalizeCountLineForCache(countLine) as Omit<
      CachedCountLine,
      "cached_at"
    >;
    const validation = assertValidCachedCountLine(normalizedCountLine);
    if (!validation.valid) {
      log.warn("Attempted to cache invalid count line", {
        errors: validation.errors,
        lineId: (normalizedCountLine as any)?._id,
      });
      return null;
    }

    const sessionId = String(normalizedCountLine.session_id);
    const cachedCountLine: CachedCountLine = {
      ...(normalizedCountLine as any),
      cached_at: new Date().toISOString(),
    };

    const existingCache = await getCountLinesCache();
    const sessionLines: CachedCountLine[] = existingCache[sessionId] || [];

    const existingIndex = sessionLines.findIndex(
      (line: CachedCountLine) => line._id === normalizedCountLine._id
    );
    if (existingIndex >= 0) {
      sessionLines[existingIndex] = cachedCountLine;
    } else {
      sessionLines.push(cachedCountLine);
    }

    const updatedCache: Record<string, CachedCountLine[]> = {
      ...existingCache,
      [sessionId]: sessionLines,
    };

    _memoryCountLinesCache = updatedCache; // Update memory
    await storage.set(STORAGE_KEYS.COUNT_LINES_CACHE, updatedCache);
    return cachedCountLine;
  } catch (error) {
    log.error("Error caching count line", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

export const getCountLinesCache = async (): Promise<Record<string, CachedCountLine[]>> => {
  if (_memoryCountLinesCache) return _memoryCountLinesCache;

  try {
    const cache = await storage.get<Record<string, CachedCountLine[]>>(
      STORAGE_KEYS.COUNT_LINES_CACHE,
      { defaultValue: {} }
    );
    _memoryCountLinesCache = cache ?? {};
    return _memoryCountLinesCache;
  } catch (error) {
    __DEV__ && console.error("Error getting count lines cache:", error);
    return {};
  }
};

export const getCountLinesBySessionFromCache = async (
  sessionId: string
): Promise<CachedCountLine[]> => {
  try {
    const cache = await getCountLinesCache();
    return cache[sessionId] || [];
  } catch (error) {
    __DEV__ && console.error("Error getting count lines by session from cache:", error);
    return [];
  }
};

// Last Sync Operations
export const updateLastSync = async () => {
  try {
    await storage.set(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  } catch (error) {
    __DEV__ && console.error("Error updating last sync:", error);
  }
};

export const getLastSync = async (): Promise<string | null> => {
  try {
    return await storage.get(STORAGE_KEYS.LAST_SYNC);
  } catch (error) {
    __DEV__ && console.error("Error getting last sync:", error);
    return null;
  }
};

// Internal helper for testing
export const __resetMemoryCache = () => {
  _memoryItemsCache = null;
  _memoryOfflineQueue = null;
  _memorySessionsCache = null;
  _memoryCountLinesCache = null;
};

// Clear all cache
export const clearAllCache = async () => {
  try {
    // Clear all memory caches
    __resetMemoryCache();

    const cache = await getItemsCache();
    const itemKeys = Object.keys(cache).map((code) => `${STORAGE_KEYS.ITEM_CACHE_PREFIX}${code}`);

    await AsyncStorage.multiRemove([
      ...itemKeys,
      STORAGE_KEYS.ITEMS_CACHE_INDEX,
      STORAGE_KEYS.OFFLINE_QUEUE,
      STORAGE_KEYS.SESSIONS_CACHE,
      STORAGE_KEYS.COUNT_LINES_CACHE,
      STORAGE_KEYS.LAST_SYNC,
    ]);
  } catch (error) {
    __DEV__ && console.error("Error clearing all cache:", error);
  }
};

// Get cache statistics
export const getCacheStats = async () => {
  try {
    const itemsCache = await getItemsCache();
    const offlineQueue = await getOfflineQueue();
    const sessionsCache = await getSessionsCache();
    const countLinesCache = await getCountLinesCache();
    const lastSync = await getLastSync();

    return {
      itemsCount: Object.keys(itemsCache).length,
      queuedOperations: offlineQueue.length,
      sessionsCount: Object.keys(sessionsCache).length,
      countLinesCount: Object.values(countLinesCache).reduce(
        (total, lines) => total + lines.length,
        0
      ),
      lastSync,
      cacheSizeKB: Math.round(
        (JSON.stringify(itemsCache).length +
          JSON.stringify(offlineQueue).length +
          JSON.stringify(sessionsCache).length +
          JSON.stringify(countLinesCache).length) /
          1024
      ),
      // Add MMKV status for debugging
      mmkvStatus: __DEV__ ? "Using AsyncStorage fallback (Expo Go mode)" : undefined,
    };
  } catch (error) {
    __DEV__ && console.error("Error getting cache stats:", error);
    return {
      itemsCount: 0,
      queuedOperations: 0,
      sessionsCount: 0,
      countLinesCount: 0,
      lastSync: null,
      cacheSizeKB: 0,
      mmkvStatus: "Error checking MMKV status",
    };
  }
};
