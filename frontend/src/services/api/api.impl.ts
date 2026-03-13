/**
 * API service layer: network-aware endpoints with offline fallbacks and caching.
 * Most functions prefer online calls and transparently fall back to cache.
 */
import api from "../httpClient";
import { retryWithBackoff } from "../../utils/retry";
import { validateBarcode } from "../../utils/validation";
import { CreateCountLinePayload, Item } from "../../types/scan";
import { useAuthStore } from "../../store/authStore";
import {
  addToOfflineQueue,
  cacheItem,
  searchItemsInCache,
  getItemFromCache,
  cacheCountLine,
  cacheCountLines,
  getCountLinesBySessionFromCache,
  isCacheStale,
  type DataSource,
} from "../offline/offlineStorage";
import { createOfflineCountLine } from "../offline/offlineCountLine";
import { AppError } from "../../utils/errors";
import { createLogger } from "../logging";
import type { TokenResponse } from "./models";
import * as adminOperationsApi from "./adminOperationsApi";
import {
  bulkCloseSessions,
  bulkExportSessions,
  bulkReconcileSessions,
  createSession,
  getRackProgress,
  getSession,
  getSessions,
  getSessionsAnalytics,
  getSessionStats,
  isOnline,
} from "./sessionManagementApi";

const {
  batchResolveSyncConflicts,
  clearServiceLogs,
  configureSQLConnection,
  createExportSchedule,
  deleteExportSchedule,
  downloadExportResult,
  generateReport,
  getAvailableReports,
  getExportResults,
  getExportSchedule,
  getExportSchedules,
  getFailedLogins,
  getIpTracking,
  getLoginDevices,
  getMetrics,
  getMetricsHealth,
  getMetricsStats,
  getSecurityAuditLog,
  getSecuritySessions,
  getSecuritySummary,
  getServiceLogs,
  getServicesStatus,
  getSettingsCategories,
  getSQLConnectionHistory,
  getSQLStatus,
  getSqlServerConfig,
  getSuspiciousActivity,
  getSyncConflictDetail,
  getSyncConflictStats,
  getSyncConflicts,
  getSyncStats,
  getSyncStatus,
  getSystemHealthScore,
  getSystemIssues,
  getSystemParameters,
  getSystemSettings,
  getSystemStats,
  resetSettingsToDefaults,
  resolveSyncConflict,
  startService,
  stopService,
  testSQLConnection,
  testSqlServerConnection,
  triggerExportSchedule,
  triggerManualSync,
  updateExportSchedule,
  updateSqlServerConfig,
  updateSystemParameters,
  updateSystemSettings,
} = adminOperationsApi;

const log = createLogger("ApiService");

/**
 * Response with source metadata for transparency about data freshness
 */
export interface ApiResponseWithSource<T> {
  data: T;
  _source: DataSource;
  _cachedAt?: string | null;
  _stale?: boolean;
  _degraded?: boolean;
}

export {
  isOnline,
  createSession,
  getSessions,
  getSession,
  getSessionStats,
  getRackProgress,
  bulkCloseSessions,
  bulkReconcileSessions,
  bulkExportSessions,
  getSessionsAnalytics,
};
export type {
  CreateSessionParams,
  SessionStatsResponse,
} from "./sessionManagementApi";
export * from "./adminOperationsApi";

// --- Unknown Items Management (Admin) ---

/**
 * List reported unknown items
 */
export const getUnknownItems = async (params: {
  session_id?: string;
  reported_by?: string;
  limit?: number;
  skip?: number;
}) => {
  try {
    const response = await api.get("/api/admin/unknown-items", { params });
    return response.data;
  } catch (error: any) {
    log.error("Error fetching unknown items", error);
    throw error;
  }
};

/**
 * Map an unknown item to an existing SKU
 */
export const mapUnknownToSku = async (itemId: string, itemCode: string, notes?: string) => {
  try {
    const response = await api.post(`/api/admin/unknown-items/${itemId}/map`, {
      item_code: itemCode,
      resolve_notes: notes,
    });
    return response.data;
  } catch (error: any) {
    log.error(`Error mapping unknown item ${itemId}`, error);
    throw error;
  }
};

/**
 * Create a new SKU from an unknown item report
 */
export const createSkuFromUnknown = async (
  itemId: string,
  data: {
    item_code: string;
    item_name: string;
    category: string;
    subcategory?: string;
    mrp: number;
    uom_code: string;
    resolve_notes?: string;
  }
) => {
  try {
    const response = await api.post(`/api/admin/unknown-items/${itemId}/create-sku`, data);
    return response.data;
  } catch (error: any) {
    log.error(`Error creating SKU from unknown item ${itemId}`, error);
    throw error;
  }
};

/**
 * Delete/Dismiss an unknown item report
 */
export const deleteUnknownItem = async (itemId: string) => {
  try {
    const response = await api.delete(`/api/admin/unknown-items/${itemId}`);
    return response.data;
  } catch (error: any) {
    log.error(`Error deleting unknown item ${itemId}`, error);
    throw error;
  }
};

// Get item by barcode (with offline support, retry, and auto recovery)
/**
 * Lookup an item by barcode with validation, retry and cache fallback.
 * Returns item with source metadata indicating freshness.
 * @param barcode Barcode string scanned/entered
 * @param retryCount Number of retries for transient failures
 */
export const getItemByBarcode = async (
  barcode: string,
  retryCount: number = 3,
  sessionId?: string,
  rackNo?: string
): Promise<Item & { _source?: DataSource; _cachedAt?: string; _stale?: boolean }> => {
  // Validate and normalize barcode before making API call
  const validation = validateBarcode(barcode);
  if (!validation.valid || !validation.value) {
    throw new AppError({
      code: "INVALID_BARCODE",
      severity: "USER",
      message: validation.error || "Invalid barcode format",
      userMessage: "Please check the barcode and try again.",
      context: { barcode },
    });
  }

  // Use normalized barcode if available (6-digit format for numeric barcodes)
  const trimmedBarcode = validation.value;

  log.debug(`Looking up barcode: ${trimmedBarcode}`, { original: barcode });

  // Helper to return cached item with source metadata
  const returnCachedItem = (
    cached: any
  ): Item & { _source: DataSource; _cachedAt: string; _stale: boolean } => {
    const stale = isCacheStale(cached.cached_at);
    const stockValue = cached.current_stock ?? cached.stock_qty ?? 0;
    return {
      id: cached.item_code,
      name: cached.item_name,
      item_code: cached.item_code,
      barcode: cached.barcode,
      item_name: cached.item_name,
      description: cached.description,
      stock_qty: stockValue,
      current_stock: stockValue, // Also set current_stock for item-detail.tsx compatibility
      uom_name: cached.uom_name ?? cached.uom,
      mrp: cached.mrp,
      sales_price: cached.sales_price,
      category: cached.category,
      subcategory: cached.subcategory,
      // Serialized item flag
      is_serialized: cached.is_serialized ?? false,
      // Source metadata
      _source: "cache",
      _cachedAt: cached.cached_at,
      _stale: stale,
    };
  };

  // Check if offline first - only use cache if truly offline
  if (!isOnline()) {
    log.debug("Offline mode - searching cache");
    const items = await searchItemsInCache(trimmedBarcode);
    if (items.length > 0 && items[0]) {
      log.debug("Found in cache", { itemCode: items[0].item_code });
      return returnCachedItem(items[0]);
    }
    throw new AppError({
      code: "ITEM_CACHE_MISS",
      severity: "USER",
      message: `Item not found in offline cache: ${trimmedBarcode}`,
      userMessage: "Item not found in offline cache. Connect to internet to search.",
      context: { barcode: trimmedBarcode },
    });
  }

  // Online - try API first, then cache as fallback
  try {
    log.debug("Online mode - calling API");

    // Direct API call with retry (only retries transient errors)
    const response = await retryWithBackoff(
      () =>
        api.get(`/api/v2/erp/items/barcode/${encodeURIComponent(trimmedBarcode)}/enhanced`, {
          params: {
            session_id: sessionId,
            rack_no: rackNo,
          },
        }),
      {
        retries: retryCount,
        backoffMs: 1000,
        // Only retry on server errors and network issues, not client errors
        shouldRetry: (error: any) => {
          const status = error?.response?.status;
          // Don't retry 4xx errors (client errors like 404, 400)
          if (status && status >= 400 && status < 500) {
            return false;
          }
          // Retry network errors and 5xx server errors
          return true;
        },
      }
    );

    // Handle v2 response format { item: ..., metadata: ... }
    const itemData = response.data.item || response.data;

    // Check if we actually got an item
    if (!itemData || !itemData.item_code) {
      throw new AppError({
        code: "ITEM_NOT_FOUND",
        severity: "USER",
        message: `Item not found: Barcode '${trimmedBarcode}' not in database`,
        userMessage: `No item found for barcode ${trimmedBarcode}`,
        context: { barcode: trimmedBarcode },
      });
    }

    // Normalize backend fields to the canonical frontend Item interface.
    const displayName = itemData.item_name || itemData.category || `Item ${itemData.item_code}`;

    // Fix: Use proper fallback chain without redundancy
    const stockQty = itemData.stock_qty ?? itemData.current_stock ?? 0;

    // Detect Source from response metadata
    let dataSource: DataSource = "api";
    if (response.data.metadata?.source === "sql_server_sync") {
      dataSource = "sql";
    } else if (response.data.metadata?.source === "cache") {
      dataSource = "cache";
    }

    const normalizedItem: Item & { _source: DataSource } = {
      id: itemData.id || itemData._id || itemData.item_code,
      name: itemData.name || displayName,
      item_code: itemData.item_code,
      barcode: itemData.barcode,
      item_name: itemData.item_name || displayName,
      uom_name: itemData.uom_name ?? itemData.uom ?? itemData.uom_code,
      uom: itemData.uom_name ?? itemData.uom ?? itemData.uom_code,
      sales_price: itemData.sales_price ?? itemData.sale_price ?? itemData.standard_rate,
      sale_price: itemData.sale_price ?? itemData.sales_price,
      mrp: itemData.mrp,
      category: itemData.category,
      subcategory: itemData.subcategory,
      warehouse: itemData.warehouse,
      stock_qty: stockQty,
      current_stock: stockQty, // Also set current_stock for item-detail.tsx compatibility
      batch_id: itemData.batch_id,
      manual_barcode: itemData.manual_barcode,
      unit2_barcode: itemData.unit2_barcode,
      unit_m_barcode: itemData.unit_m_barcode,
      manufacturing_date: itemData.manufacturing_date || itemData.mfg_date,
      expiry_date: itemData.expiry_date,
      mrp_variants: itemData.mrp_variants,
      // Serialized item flag - when true, serial number capture is required
      is_serialized: itemData.is_serialized ?? false,
      // Pass through misplaced status
      is_misplaced: itemData.is_misplaced,
      expected_location: itemData.expected_location,
      // Source metadata
      _source: dataSource,
    };

    log.debug("Found via API", { itemCode: normalizedItem.item_code });

    // Cache the item for future offline use
    try {
      await cacheItem({
        item_code: normalizedItem.item_code,
        barcode: normalizedItem.barcode,
        item_name:
          normalizedItem.item_name || normalizedItem.name || normalizedItem.item_code || "",
        description: (normalizedItem as any).description,
        uom: normalizedItem.uom ?? normalizedItem.uom_code ?? normalizedItem.uom_name,
        uom_name: normalizedItem.uom_name,
        mrp: normalizedItem.mrp,
        sales_price: normalizedItem.sales_price,
        sale_price: normalizedItem.sale_price ?? normalizedItem.sales_price,
        category: normalizedItem.category,
        subcategory: normalizedItem.subcategory,
        warehouse: normalizedItem.warehouse,
        manual_barcode: normalizedItem.manual_barcode,
        unit2_barcode: normalizedItem.unit2_barcode,
        unit_m_barcode: normalizedItem.unit_m_barcode,
        batch_id: normalizedItem.batch_id,
        current_stock: normalizedItem.current_stock || normalizedItem.stock_qty,
        is_serialized: normalizedItem.is_serialized,
      });
    } catch (cacheError) {
      log.warn("Failed to cache item", {
        error: cacheError instanceof Error ? cacheError.message : String(cacheError),
      });
      // Don't fail the whole operation for cache errors
    }

    return normalizedItem;
  } catch (apiError: any) {
    const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);

    // Check for 404 status (Item not found) - log as info/warn instead of error
    const isNotFound = apiError?.response?.status === 404 || errorMessage.includes("404");

    if (isNotFound) {
      log.info("Item not found via API", { barcode: trimmedBarcode });
    } else {
      log.error("API call failed", { error: errorMessage });
    }

    // Only fallback to cache if API fails (degraded mode)
    log.debug("API failed, trying cache fallback");
    try {
      const items = await searchItemsInCache(trimmedBarcode);
      if (items.length > 0 && items[0]) {
        log.debug("Found in cache fallback", { itemCode: items[0].item_code });
        // Return with degraded metadata to indicate stale data
        return {
          ...returnCachedItem(items[0]),
          _source: "cache" as DataSource,
          _degraded: true, // API failed, cache fallback
        } as any;
      }
      // Cache is empty too
      throw new AppError({
        code: "ITEM_NOT_FOUND",
        severity: "USER",
        message: "Item not found in cache",
        userMessage: `Barcode ${trimmedBarcode} not found. Please try again when online.`,
        context: { barcode: trimmedBarcode },
      });
    } catch (cacheError: any) {
      // If it's already an AppError, just rethrow
      if (cacheError instanceof AppError) {
        throw cacheError;
      }

      log.error("Cache fallback also failed", { error: cacheError.message });

      // Provide helpful error message based on API error type
      throw AppError.fromApiError(apiError, {
        barcode: trimmedBarcode,
        fallbackAttempted: true,
      });
    }
  }
};

/**
 * Check if a serial number has already been used in this session (global check)
 */
export const checkSerialUniqueness = async (
  sessionId: string,
  serialNumber: string
): Promise<{
  exists: boolean;
  item_code?: string;
  item_name?: string;
  counted_by?: string;
  floor_no?: string;
  rack_no?: string;
  status?: string;
}> => {
  try {
    const response = await api.get(`/api/v2/count-lines/check-serial/${sessionId}/${serialNumber}`);
    return response.data;
  } catch (error) {
    console.error("Error checking serial uniqueness:", error);
    // In case of error (e.g. offline), default to not exists to allow work,
    // but log it. Real validation will happen at submission.
    return { exists: false };
  }
};

// Search items (with offline support)
/**
 * Search items by query with offline fallback.
 * Returns items with source metadata.
 */
export const searchItems = async (
  query: string,
  cursor?: string,
  limit: number = 10
): Promise<{
  items: (Item & { _source?: DataSource })[];
  nextCursor?: string;
  total: number;
  hasMore: boolean;
}> => {
  try {
    const result = await searchItemsOptimized(query, 1, limit, cursor);
    return {
      items: result.items as (Item & { _source?: DataSource })[],
      nextCursor: result.next_cursor,
      total: result.total,
      hasMore: !!result.has_more,
    };
  } catch (error: any) {
    log.error("searchItems failed, falling back to cache", {
      error: error.message,
    });
    const cachedItems = await searchItemsInCache(query);
    return {
      items: cachedItems.map((item) => ({
        id: item.item_code,
        name: item.item_name,
        item_code: item.item_code,
        barcode: item.barcode,
        item_name: item.item_name,
        description: item.description,
        uom: item.uom,
        stock_qty: item.current_stock,
        mrp: item.mrp,
        sale_price: item.sale_price,
        sales_price: item.sales_price,
        category: item.category,
        subcategory: item.subcategory,
        warehouse: item.warehouse,
        manual_barcode: item.manual_barcode,
        unit2_barcode: item.unit2_barcode,
        unit_m_barcode: item.unit_m_barcode,
        batch_id: item.batch_id,
        _source: "cache",
      })),
      total: cachedItems.length,
      hasMore: false,
    };
  }
};

// Optimized search with relevance scoring and pagination
export interface OptimizedSearchResult {
  items: Item[];
  total: number;
  page: number;
  page_size: number;
  query: string;
  search_time_ms: number;
  next_cursor?: string;
  has_more?: boolean;
}

export const searchItemsOptimized = async (
  query: string,
  page: number = 1,
  pageSize: number = 10,
  cursor?: string
): Promise<OptimizedSearchResult> => {
  try {
    if (!isOnline()) {
      const cachedItems = await searchItemsInCache(query);
      const mappedItems = cachedItems.map((item) => ({
        id: item.item_code,
        name: item.item_name,
        item_code: item.item_code,
        barcode: item.barcode,
        item_name: item.item_name,
        description: item.description,
        uom: item.uom,
        stock_qty: item.current_stock,
        mrp: item.mrp,
        sale_price: item.sale_price,
        sales_price: item.sales_price,
        category: item.category,
        subcategory: item.subcategory,
        warehouse: item.warehouse,
        manual_barcode: item.manual_barcode,
        unit2_barcode: item.unit2_barcode,
        unit_m_barcode: item.unit_m_barcode,
        batch_id: item.batch_id,
        _source: "cache" as DataSource,
      }));
      return {
        items: mappedItems,
        total: mappedItems.length,
        page: 1,
        page_size: mappedItems.length,
        query,
        search_time_ms: 0,
        has_more: false,
      };
    }

    const response = await api.get("/api/items/search/optimized", {
      params: {
        q: query,
        limit: pageSize,
        cursor: cursor || undefined,
        offset: cursor ? undefined : Math.max(0, (page - 1) * pageSize),
      },
    });

    const apiResponse = response.data;
    const data = apiResponse.data || { items: [] };
    const items = data.items || [];
    const metadata = data.metadata || {};

    const mappedItems: Item[] = items.map((item: Record<string, unknown>) => ({
      id: (item.id as string) || (item._id as string) || (item.item_code as string),
      item_code: item.item_code as string,
      barcode: item.barcode as string,
      name: item.item_name as string,
      item_name: item.item_name as string,
      description: item.description as string,
      uom: (item.uom_name as string) || (item.uom as string),
      uom_name: (item.uom_name as string) || (item.uom as string),
      stock_qty: (item.stock_qty as number) ?? (item.current_stock as number) ?? 0,
      mrp: item.mrp as number,
      sale_price: item.sale_price as number,
      sales_price: (item.sale_price as number) || (item.sales_price as number),
      manual_barcode: item.manual_barcode as string,
      unit2_barcode: item.unit2_barcode as string,
      unit_m_barcode: item.unit_m_barcode as string,
      batch_id: item.batch_id as string,
      category: item.category as string,
      subcategory: item.subcategory as string,
      warehouse: item.warehouse as string,
      relevance_score: item.relevance_score as number,
      match_type: item.match_type as string,
      _source: "api" as DataSource,
    }));

    // Cache top items
    for (const item of mappedItems.slice(0, 10)) {
      await cacheItem(item as any);
    }

    return {
      items: mappedItems,
      total: data.total || items.length,
      page: data.page || 1,
      page_size: data.page_size || pageSize,
      query,
      search_time_ms: data.search_time_ms || 0,
      next_cursor: metadata.next_cursor,
      has_more: metadata.has_more,
    };
  } catch (error: any) {
    log.error("searchItemsOptimized failed", { error: error.message });
    throw error;
  }
};

// Get search suggestions for autocomplete
export const getSearchSuggestions = async (query: string, limit: number = 5): Promise<string[]> => {
  try {
    if (!isOnline() || query.length < 2) {
      return [];
    }

    const response = await api.get("/api/items/search/suggestions", {
      params: { q: query, limit },
    });

    const apiResponse = response.data;
    return apiResponse?.data?.suggestions || apiResponse?.suggestions || [];
  } catch (error) {
    __DEV__ && console.error("Error fetching suggestions:", error);
    return [];
  }
};

export const getSearchFilters = async (): Promise<{
  categories: string[];
  warehouses: string[];
}> => {
  try {
    if (!isOnline()) {
      return { categories: [], warehouses: [] };
    }

    const response = await api.get("/api/items/search/filters");
    const apiResponse = response.data;
    const data = apiResponse?.data || {};
    return {
      categories: Array.isArray(data.categories) ? data.categories : [],
      warehouses: Array.isArray(data.warehouses) ? data.warehouses : [],
    };
  } catch (error) {
    __DEV__ && console.error("Error fetching search filters:", error);
    return { categories: [], warehouses: [] };
  }
};

// Semantic Search (AI-Powered)
export const searchItemsSemantic = async (query: string, limit: number = 20): Promise<Item[]> => {
  try {
    if (!isOnline()) {
      return []; // Semantic search requires server-side model
    }

    const response = await api.get("/api/v2/items/semantic", {
      params: { query, limit },
    });

    const items = response.data.data?.items || [];
    return items.map((item: any) => ({
      ...item,
      id: item.id || item._id,
      name: item.name || item.item_name,
    }));
  } catch (error) {
    __DEV__ && console.error("Error in semantic search:", error);
    return [];
  }
};

// AI Variance Risk Predictions
export const getRiskPredictions = async (sessionId: string, limit: number = 10) => {
  try {
    if (!isOnline()) return [];

    const response = await api.get("/api/v2/supervisor/predictions", {
      params: { session_id: sessionId, limit },
    });

    return response.data.data || [];
  } catch (error) {
    __DEV__ && console.error("Error fetching risk predictions:", error);
    return [];
  }
};

// Visual Search / Identify Item
export const identifyItem = async (imageUri: string): Promise<Item[]> => {
  try {
    if (!isOnline()) {
      throw new Error("Visual search requires internet connection");
    }

    // Create form data for image upload
    const formData = new FormData();
    const filename = imageUri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename || "");
    const type = match ? `image/${match[1]}` : `image`;

    formData.append("file", {
      uri: imageUri,
      name: filename || "upload.jpg",
      type,
    } as any);

    const response = await api.post("/api/v2/items/identify", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000, // Recognition might take longer
    });

    const items = response.data.data?.items || [];
    return items.map((item: any) => ({
      ...item,
      id: item.id || item._id,
      name: item.name || item.item_name,
    }));
  } catch (error) {
    __DEV__ && console.error("Error in visual search:", error);
    throw error;
  }
};

export interface ItemScanStatus {
  scanned: boolean;
  total_qty: number;
  locations: {
    floor_no: string | null;
    rack_no: string | null;
    counted_qty: number;
    counted_by: string;
    counted_at: string;
  }[];
}

export const checkItemScanStatus = async (
  sessionId: string,
  itemCode: string
): Promise<ItemScanStatus> => {
  try {
    if (!isOnline()) {
      // Offline fallback: check local cache
      const cachedLines = await getCountLinesBySessionFromCache(sessionId);
      const itemLines = cachedLines.filter((line) => line.item_code === itemCode);

      if (itemLines.length === 0) {
        return { scanned: false, total_qty: 0, locations: [] };
      }

      const totalQty = itemLines.reduce((sum, line) => sum + (line.counted_qty || 0), 0);
      const locations = itemLines.map((line) => ({
        floor_no: (line.floor_no as string) || null,
        rack_no: (line.rack_no as string) || null,
        counted_qty: line.counted_qty || 0,
        counted_by: line.counted_by || "offline_user",
        counted_at: (line.created_at as string) || new Date().toISOString(),
      }));

      return { scanned: true, total_qty: totalQty, locations };
    }

    const response = await api.get(`/api/sessions/${sessionId}/items/${itemCode}/scan-status`);
    return response.data;
  } catch (error) {
    console.error("Error checking item scan status:", error);
    return { scanned: false, total_qty: 0, locations: [] };
  }
};

// Create count line (with offline support)
/**
 * Create a count line with offline fallback.
 * Uses createOfflineCountLine helper for consistent offline object creation.
 */
// Save draft for real-time dashboard
export const saveDraft = async (lineData: CreateCountLinePayload) => {
  try {
    if (!isOnline()) return null;
    const response = await api.post("/api/count-lines/draft", lineData);
    return response.data;
  } catch (error: any) {
    log.warn("Failed to save draft", {
      error: error?.message || String(error),
    });
    return null;
  }
};

export const createCountLine = async (
  countData: CreateCountLinePayload
): Promise<any & { _source?: DataSource; _offline?: boolean }> => {
  // Helper to resolve item name from cache
  const resolveItemName = async (): Promise<string> => {
    try {
      const cachedItem = await getItemFromCache(countData.item_code);
      if (cachedItem) return cachedItem.item_name;
    } catch {
      // Ignore cache lookup error
    }
    return "Unknown Item";
  };

  // Get user context once
  const user = useAuthStore.getState().user;

  try {
    // If offline OR working with an offline-created session, use local logic
    const isOfflineSession = String(countData.session_id || "").startsWith("offline_");

    if (!isOnline() || isOfflineSession) {
      log.debug("Offline mode or offline session - creating offline count line", {
        isOnline: isOnline(),
        isOfflineSession,
      });

      const itemName = await resolveItemName();
      const offlineCountLine = (await createOfflineCountLine(countData, {
        username: user?.username,
        itemName,
      })) as any;

      await cacheCountLine(offlineCountLine);
      await addToOfflineQueue("count_line", offlineCountLine);

      log.debug("Created offline count line", { id: offlineCountLine._id });
      return {
        ...offlineCountLine,
        _source: "local" as DataSource,
        _offline: true,
      };
    }

    // Online - make API call
    log.debug("Online mode - creating count line via API");
    const response = await api.post("/api/count-lines", countData, {
      skipOfflineQueue: true,
    } as any);
    await cacheCountLine(response.data);

    log.debug("Created count line via API", {
      id: response.data._id || response.data.id,
    });
    return {
      ...response.data,
      _source: "api" as DataSource,
    };
  } catch (error: any) {
    // CRITICAL FIX: Only fallback to offline if it's a network error.
    // If the server responded with an error (e.g. 400 Validation Error, 401 Auth, 500 Server Error),
    // we must NOT hide it behind a "success" offline save.
    if (error.response) {
      log.error("Server returned error, NOT falling back to offline", {
        status: error.response.status,
        data: error.response.data,
      });
      // Propagate the server error so the UI can show the real reason
      throw error;
    }

    log.error("Network error creating count line, falling back to offline", {
      error: error instanceof Error ? error.message : String(error),
    });

    // Fallback to offline mode using the same helper
    const itemName = await resolveItemName();
    const offlineCountLine = (await createOfflineCountLine(countData, {
      username: user?.username,
      itemName,
    })) as any; // Cast to any to avoid double Promise confusion

    await cacheCountLine(offlineCountLine);
    await addToOfflineQueue("count_line", offlineCountLine);

    log.debug("Created offline count line as fallback", {
      id: offlineCountLine._id,
    });
    return {
      ...offlineCountLine,
      _source: "local" as DataSource,
      _offline: true,
      _degraded: true, // API failed, fallback
    } as any;
  }
};

// Get count lines by session (with offline support)
/**
 * Get count lines for a session with proper pagination support (including offline).
 */
export const getCountLines = async (
  sessionId: string,
  page: number = 1,
  pageSize: number = 50,
  verified?: boolean
): Promise<{
  items: any[];
  pagination: any;
  _source?: DataSource;
  _stale?: boolean;
  _degraded?: boolean;
}> => {
  // Helper to create proper paginated response from array
  const paginateItems = (
    items: any[],
    requestedPage: number,
    requestedPageSize: number,
    source: DataSource = "cache",
    stale: boolean = false
  ) => {
    const total = items.length;
    const totalPages = Math.ceil(total / requestedPageSize);
    const startIndex = (requestedPage - 1) * requestedPageSize;
    const endIndex = startIndex + requestedPageSize;
    const pageItems = items.slice(startIndex, endIndex);

    return {
      items: pageItems,
      pagination: {
        page: requestedPage,
        page_size: requestedPageSize,
        total,
        total_pages: totalPages,
        has_next: requestedPage < totalPages,
        has_prev: requestedPage > 1,
      },
      _source: source,
      _stale: stale,
    };
  };

  try {
    if (!isOnline()) {
      log.debug("Offline mode - returning cached count lines with pagination");

      // Return cached count lines with proper pagination
      const cachedLines = await getCountLinesBySessionFromCache(sessionId);

      // Filter by verified status if provided
      const filteredLines =
        verified !== undefined
          ? cachedLines.filter((line) => line.verified === verified)
          : cachedLines;

      return paginateItems(filteredLines, page, pageSize, "cache", true);
    }

    let url = `/api/count-lines/session/${sessionId}?page=${page}&page_size=${pageSize}`;
    if (verified !== undefined) {
      url += `&verified=${verified}`;
    }

    log.debug("Fetching count lines from API", { sessionId, page, pageSize });
    const response = await api.get(url);

    // Batch cache count lines in a single write (avoids N+1 reads/writes)
    const countLinesToCache =
      response.data?.items && Array.isArray(response.data.items)
        ? response.data.items
        : Array.isArray(response.data)
          ? response.data
          : [];
    if (countLinesToCache.length > 0) {
      await cacheCountLines(countLinesToCache);
    }

    return {
      ...response.data,
      _source: "api" as DataSource,
    };
  } catch (error: any) {
    log.error("Error getting count lines, falling back to cache", {
      error: error instanceof Error ? error.message : String(error),
    });

    // Fallback to cache with proper pagination
    const cachedLines = await getCountLinesBySessionFromCache(sessionId);

    const filteredLines =
      verified !== undefined
        ? cachedLines.filter((line) => line.verified === verified)
        : cachedLines;

    return {
      ...paginateItems(filteredLines, page, pageSize, "cache", true),
      _degraded: true, // API failed, using cache
    };
  }
};

export const getCountLineById = async (lineId: string) => {
  const response = await api.get(`/api/count-lines/${encodeURIComponent(lineId)}`);
  return response.data;
};

export interface AssignableStaffUser {
  username: string;
  full_name?: string | null;
}

export const getAssignableStaffUsers = async (): Promise<AssignableStaffUser[]> => {
  const response = await api.get<AssignableStaffUser[]>("/api/users/assignable/staff");
  return Array.isArray(response.data) ? response.data : [];
};

// Check if item already counted
export const checkItemCounted = async (sessionId: string, itemCode: string) => {
  try {
    if (!isOnline()) {
      // Check in cached count lines
      const cachedLines = await getCountLinesBySessionFromCache(sessionId);
      const itemLines = cachedLines.filter((line) => line.item_code === itemCode);
      return { already_counted: itemLines.length > 0, count_lines: itemLines };
    }

    const response = await api.get(`/api/count-lines/check/${sessionId}/${itemCode}`);
    return response.data;
  } catch (error) {
    __DEV__ && console.error("Error checking item counted:", error);

    // Fallback to cache
    const cachedLines = await getCountLinesBySessionFromCache(sessionId);
    const itemLines = cachedLines.filter((line) => line.item_code === itemCode);
    return { already_counted: itemLines.length > 0, count_lines: itemLines };
  }
};

// Add quantity to existing count line
export const addQuantityToCountLine = async (
  lineId: string,
  additionalQty: number,
  batches?: any[]
) => {
  try {
    const payload: any = { additional_qty: additionalQty };
    if (batches) {
      payload.batches = batches;
    }

    // Use PATCH with body for batches, or just query params if simple
    const response = await api.patch(`/api/count-lines/${lineId}/add-quantity`, payload);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Error adding quantity to count line:", error);
    throw error;
  }
};

// Get variance reasons
export const getVarianceReasons = async () => {
  const response = await api.get("/api/variance-reasons");
  // Handle wrapped response format
  if (response.data && response.data.reasons && Array.isArray(response.data.reasons)) {
    return response.data.reasons.map((r: Record<string, unknown>) => ({
      ...r,
      code: r.id || r.code,
      label: r.label || r.name,
    }));
  }
  return response.data;
};

// Approve count line
export const approveCountLine = async (lineId: string) => {
  const response = await api.put(`/api/count-lines/${lineId}/approve`);
  return response.data;
};

// Reject count line
export const rejectCountLine = async (
  lineId: string,
  payload?: { notes?: string; assign_to?: string }
) => {
  const response = await api.put(`/api/count-lines/${lineId}/reject`, payload || {});
  return response.data;
};

// Update session status
export const updateSessionStatus = async (sessionId: string, status: string) => {
  // Use the specific complete endpoint for closing sessions to ensure locks are released
  if (status === "CLOSED") {
    const response = await api.post(`/api/sessions/${sessionId}/complete`);
    return response.data;
  }

  // For other statuses (like RECONCILE), use the generic status endpoint
  const response = await api.put(`/api/sessions/${sessionId}/status?status=${status}`);
  return response.data;
};

// Create unknown item (with offline support)
export const createUnknownItem = async (itemData: Record<string, unknown>) => {
  try {
    if (!isOnline()) {
      await addToOfflineQueue("unknown_item", itemData);
      return { success: true, offline: true };
    }

    const response = await api.post("/api/unknown-items", itemData, {
      skipOfflineQueue: true,
    } as any);
    return response.data;
  } catch (error) {
    __DEV__ && console.error("Error creating unknown item:", error);
    await addToOfflineQueue("unknown_item", itemData);
    return { success: true, offline: true };
  }
};

// Register user
export const registerUser = async (userData: {
  username: string;
  password: string;
  full_name: string;
  employee_id?: string;
  phone?: string;
}): Promise<TokenResponse> => {
  const response = await api.post("/api/auth/register", userData);
  return response.data;
};

// Refresh item stock from ERP (with longer timeout for slow ERP connections)
export const refreshItemStock = async (itemCode: string) => {
  try {
    const response = await api.post(
      `/api/erp/items/${encodeURIComponent(itemCode)}/refresh-stock`,
      {},
      { timeout: 30000 } // 30s timeout for slow ERP operations
    );
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Refresh stock error:", error);
    throw error;
  }
};

// Database Mapping API
export const getAvailableTables = async (
  host: string,
  port: number,
  database: string,
  user?: string,
  password?: string,
  schema: string = "dbo"
) => {
  try {
    const params = new URLSearchParams({
      host,
      port: port.toString(),
      database,
      schema,
    });
    if (user) params.append("user", user);
    if (password) params.append("password", password);

    const response = await api.get(`/api/mapping/tables?${params.toString()}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get tables error:", error);
    throw error;
  }
};

export const getTableColumns = async (
  host: string,
  port: number,
  database: string,
  tableName: string,
  user?: string,
  password?: string,
  schema: string = "dbo"
) => {
  try {
    const params = new URLSearchParams({
      host,
      port: port.toString(),
      database,
      table_name: tableName,
      schema,
    });
    if (user) params.append("user", user);
    if (password) params.append("password", password);

    const response = await api.get(`/api/mapping/columns?${params.toString()}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get columns error:", error);
    throw error;
  }
};

export const getCurrentMapping = async () => {
  try {
    const response = await api.get("/api/mapping/current");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get current mapping error:", error);
    throw error;
  }
};

export const testMapping = async (
  config: Record<string, unknown>,
  host: string,
  port: number,
  database: string,
  user?: string,
  password?: string
) => {
  try {
    const params = new URLSearchParams({
      host,
      port: port.toString(),
      database,
    });
    if (user) params.append("user", user);
    if (password) params.append("password", password);

    const response = await api.post(`/api/mapping/test?${params.toString()}`, config);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Test mapping error:", error);
    throw error;
  }
};

export const saveMapping = async (config: Record<string, unknown>) => {
  try {
    const response = await api.post("/api/mapping/save", config);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Save mapping error:", error);
    throw error;
  }
};

// Sync offline queue (enhanced version in syncService.ts)
export const syncOfflineQueue = async (options?: Record<string, unknown>) => {
  // Import sync service dynamically
  const syncService = await import("../syncService");
  return await syncService.syncOfflineQueue(options);
};

// Activity Log API
export const getActivityLogs = async (
  page: number = 1,
  pageSize: number = 50,
  user?: string,
  action?: string,
  status?: string,
  startDate?: string,
  endDate?: string
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (user) params.append("user", user);
    if (action) params.append("action", action);
    if (status) params.append("status_filter", status);
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    __DEV__ &&
      console.log("🔍 [Activity Logs] Fetching activity logs:", {
        page,
        pageSize,
        filters: { user, action, status, startDate, endDate },
        url: `/api/activity-logs?${params.toString()}`,
      });

    const response = await api.get(`/api/activity-logs?${params.toString()}`);

    __DEV__ &&
      console.log("✅ [Activity Logs] Success:", {
        activitiesReturned: response.data?.activities?.length || 0,
      });

    return response.data;
  } catch (error: any) {
    __DEV__ &&
      console.error("❌ [Activity Logs] Error fetching activity logs:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        filters: { page, pageSize, user, action, status, startDate, endDate },
      });
    throw error;
  }
};

// Verify Supervisor PIN
export const verifyPin = async (data: {
  supervisor_username: string;
  pin: string;
  action: string;
  reason: string;
  staff_username: string;
  entity_id?: string;
}) => {
  try {
    const response = await api.post("/api/supervisor/verify-pin", data);
    return response.data;
  } catch (error: any) {
    __DEV__ && console.error("Verify PIN error:", error);
    throw error;
  }
};

// Delete Count Line (Authorized)
export const deleteCountLine = async (lineId: string) => {
  try {
    const response = await api.delete(`/api/count-lines/${lineId}`);
    return response.data;
  } catch (error: any) {
    __DEV__ && console.error("Delete count line error:", error);
    throw error;
  }
};

export const getActivityStats = async (startDate?: string, endDate?: string) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    __DEV__ &&
      console.log("📊 [Activity Stats] Fetching statistics:", {
        filters: { startDate, endDate },
        url: `/api/activity-logs/stats?${params.toString()}`,
      });

    const response = await api.get(`/api/activity-logs/stats?${params.toString()}`);

    __DEV__ &&
      console.log("✅ [Activity Stats] Success:", {
        total: response.data?.total || 0,
        successCount: response.data?.by_status?.success || 0,
        errorCount: response.data?.by_status?.error || 0,
        warningCount: response.data?.by_status?.warning || 0,
      });

    return response.data;
  } catch (error: any) {
    __DEV__ &&
      console.error("❌ [Activity Stats] Error fetching statistics:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        filters: { startDate, endDate },
      });
    throw error;
  }
};

// Error Log API
export const getErrorLogs = async (
  page: number = 1,
  pageSize: number = 50,
  severity?: string,
  errorType?: string,
  endpoint?: string,
  resolved?: boolean,
  startDate?: string,
  endDate?: string
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (severity) params.append("severity", severity);
    if (errorType) params.append("error_type", errorType);
    if (endpoint) params.append("endpoint", endpoint);
    if (resolved !== undefined) params.append("resolved", resolved.toString());
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    __DEV__ &&
      console.log("🔍 [Error Logs] Fetching error logs:", {
        page,
        pageSize,
        filters: {
          severity,
          errorType,
          endpoint,
          resolved,
          startDate,
          endDate,
        },
        url: `/api/error-logs?${params.toString()}`,
      });

    const response = await api.get(`/api/error-logs?${params.toString()}`);

    __DEV__ &&
      console.log("✅ [Error Logs] Success:", {
        totalErrors: response.data?.pagination?.total || 0,
        page: response.data?.pagination?.page || page,
        errorsReturned: response.data?.errors?.length || 0,
      });

    return response.data;
  } catch (error: any) {
    __DEV__ &&
      console.error("❌ [Error Logs] Error fetching error logs:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        filters: {
          page,
          pageSize,
          severity,
          errorType,
          endpoint,
          resolved,
          startDate,
          endDate,
        },
      });
    throw error;
  }
};

export const getErrorStats = async (startDate?: string, endDate?: string) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    __DEV__ &&
      console.log("📊 [Error Stats] Fetching statistics:", {
        filters: { startDate, endDate },
        url: `/api/error-logs/stats?${params.toString()}`,
      });

    const response = await api.get(`/api/error-logs/stats?${params.toString()}`);

    __DEV__ &&
      console.log("✅ [Error Stats] Success:", {
        total: response.data?.total || 0,
        criticalCount: response.data?.by_severity?.critical || 0,
        errorCount: response.data?.by_severity?.error || 0,
        warningCount: response.data?.by_severity?.warning || 0,
      });

    return response.data;
  } catch (error: any) {
    __DEV__ &&
      console.error("❌ [Error Stats] Error fetching statistics:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        filters: { startDate, endDate },
      });
    throw error;
  }
};

export const getErrorDetail = async (errorId: string) => {
  try {
    __DEV__ && console.log("🔍 [Error Detail] Fetching error details:", { errorId });

    const response = await api.get(`/api/error-logs/${errorId}`);

    __DEV__ &&
      console.log("✅ [Error Detail] Success:", {
        errorId,
        severity: response.data?.severity,
        errorType: response.data?.error_type,
        timestamp: response.data?.timestamp,
      });

    return response.data;
  } catch (error: any) {
    __DEV__ &&
      console.error("❌ [Error Detail] Error fetching error details:", {
        errorId,
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
      });
    throw error;
  }
};

export const resolveError = async (errorId: string, resolutionNote?: string) => {
  try {
    const response = await api.put(`/api/error-logs/${errorId}/resolve`, {
      resolution_note: resolutionNote,
    });
    return response.data;
  } catch (error: any) {
    __DEV__ && console.error("Resolve error error:", error);
    throw error;
  }
};

export const clearErrorLogs = async () => {
  try {
    const response = await api.delete("/api/error-logs");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Clear error logs error:", error);
    throw error;
  }
};

// ERP Configuration
export const getERPConfig = async () => {
  try {
    const response = await api.get("/api/erp/config");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get ERP config error:", error);
    throw error;
  }
};

// Stock Verification
export const verifyStock = async (countLineId: string) => {
  try {
    const response = await api.put(`/api/count-lines/${countLineId}/verify`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Verify stock error:", error);
    throw error;
  }
};

export const unverifyStock = async (countLineId: string) => {
  try {
    const response = await api.put(`/api/count-lines/${countLineId}/unverify`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Unverify stock error:", error);
    throw error;
  }
};

// --- Modern grouped exports for logical access patterns ---
export const sessionsApi = {
  createSession,
  getSessions,
  getSession,
  bulkCloseSessions,
  bulkReconcileSessions,
  bulkExportSessions,
  getSessionsAnalytics,
  updateSessionStatus,
};

export const countLineApi = {
  createCountLine,
  getCountLines,
  checkItemCounted,
  addQuantityToCountLine,
  getVarianceReasons,
  approveCountLine,
  rejectCountLine,
  verifyStock,
  unverifyStock,
};

export const itemsApi = {
  getItemByBarcode,
  searchItems,
  searchItemsOptimized,
  getSearchSuggestions,
  createUnknownItem,
  refreshItemStock,
};

export const mappingApi = {
  getAvailableTables,
  getTableColumns,
  getCurrentMapping,
  testMapping,
  saveMapping,
};

export const exportsApi = {
  getExportSchedules,
  getExportSchedule,
  createExportSchedule,
  updateExportSchedule,
  deleteExportSchedule,
  triggerExportSchedule,
  getExportResults,
  downloadExportResult,
};

export const syncApi = {
  syncOfflineQueue,
  getSyncConflicts,
  getSyncConflictDetail,
  resolveSyncConflict,
  batchResolveSyncConflicts,
  getSyncConflictStats,
  getSyncStatus,
  getSyncStats,
  triggerManualSync,
};

export const metricsApi = {
  getMetrics,
  getMetricsHealth,
  getMetricsStats,
  getSystemHealthScore,
  getSystemStats,
};

export const adminControlApi = {
  getServicesStatus,
  startService,
  stopService,
  getSystemIssues,
  getLoginDevices,
  getServiceLogs,
  clearServiceLogs,
};

export const reportsApi = {
  getAvailableReports,
  generateReport,
};

export const sqlServerApi = {
  getSqlServerConfig,
  updateSqlServerConfig,
  testSqlServerConnection,
  getSQLStatus,
  testSQLConnection,
  configureSQLConnection,
  getSQLConnectionHistory,
};

export const securityApi = {
  getSecuritySummary,
  getFailedLogins,
  getSuspiciousActivity,
  getSecuritySessions,
  getSecurityAuditLog,
  getIpTracking,
};

export const settingsApi = {
  getSystemParameters,
  updateSystemParameters,
  getSettingsCategories,
  resetSettingsToDefaults,
  getSystemSettings,
  updateSystemSettings,
};

export {
  getVarianceTrend,
  getStaffPerformance,
} from "./api.advancedAnalytics";
export {
  getFieldDefinitions,
  createFieldDefinition,
  updateFieldDefinition,
  deleteFieldDefinition,
  setFieldValue,
  setBulkFieldValues,
  getItemFieldValues,
  getItemsWithFields,
  getFieldStatistics,
} from "./api.dynamicFields";
export {
  getDiagnosisHealth,
  getDiagnosisStats,
  diagnoseError,
  attemptAutoFixDiagnosis,
} from "./api.diagnosis";
export {
  syncBatch,
  getWatchtowerStats,
  getZones,
  getWarehouses,
} from "./api.misc";
export type { Notification } from "./api.notifications";
export {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./api.notifications";

export default api;
