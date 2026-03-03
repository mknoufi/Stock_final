import api from "../httpClient";
import { createLogger } from "../logging";
import { AppError } from "../../utils/errors";
import { validateBarcode } from "../../utils/validation";
import { retryWithBackoff } from "../../utils/retry";
import { Item } from "../../types/scan";
import { isOnline, DataSource } from "./core";
import {
  cacheItem,
  searchItemsInCache,
  getCountLinesBySessionFromCache,
  isCacheStale,
  addToOfflineQueue,
} from "../offline/offlineStorage";

const log = createLogger("InventoryApi");

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
      uom: cached.uom_name ?? cached.uom,
      mrp: cached.mrp,
      sales_price: cached.sales_price,
      sale_price: cached.sales_price,
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
      // SQL sync timestamp fields for real-time freshness display
      sql_last_checked_at: itemData.sql_last_checked_at,
      last_synced: itemData.last_synced,
      sql_sync_status: itemData.sql_sync_status,
      last_sql_verified_at: itemData.last_sql_verified_at,
      sql_verified_qty: itemData.sql_verified_qty,
      sync_status: response.data.metadata?.sync_status,
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
  subcategories: string[];
  subcategoriesByCategory: Record<string, string[]>;
  warehouses: string[];
}> => {
  try {
    if (!isOnline()) {
      return { categories: [], subcategories: [], subcategoriesByCategory: {}, warehouses: [] };
    }

    const response = await api.get("/api/items/search/filters");
    const apiResponse = response.data;
    const data = apiResponse?.data || {};
    return {
      categories: Array.isArray(data.categories) ? data.categories : [],
      subcategories: Array.isArray(data.subcategories) ? data.subcategories : [],
      subcategoriesByCategory:
        data.subcategories_by_category && typeof data.subcategories_by_category === "object"
          ? data.subcategories_by_category
          : {},
      warehouses: Array.isArray(data.warehouses) ? data.warehouses : [],
    };
  } catch (error) {
    __DEV__ && console.error("Error fetching search filters:", error);
    return { categories: [], subcategories: [], subcategoriesByCategory: {}, warehouses: [] };
  }
};

export const searchItemsManual = async (
  query: string,
  options?: {
    category?: string;
    subcategory?: string;
    limit?: number;
    offset?: number;
  }
): Promise<{
  items: (Item & { _source?: DataSource })[];
  total: number;
  hasMore: boolean;
  nextCursor?: string;
}> => {
  try {
    if (!isOnline()) {
      const cachedItems = await searchItemsInCache(query || "");
      const filtered = cachedItems.filter((item) => {
        const categoryOk = options?.category
          ? String(item.category || "").toLowerCase() === options.category.toLowerCase()
          : true;
        const subcategoryOk = options?.subcategory
          ? String(item.subcategory || "").toLowerCase() === options.subcategory.toLowerCase()
          : true;
        return categoryOk && subcategoryOk;
      });

      return {
        items: filtered.map((item) => ({
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
        total: filtered.length,
        hasMore: false,
      };
    }

    const response = await api.get("/api/items/search/manual", {
      params: {
        q: query || "",
        category: options?.category || undefined,
        subcategory: options?.subcategory || undefined,
        limit: options?.limit ?? 30,
        offset: options?.offset ?? 0,
      },
    });

    const apiResponse = response.data;
    const data = apiResponse?.data || {};
    const items = Array.isArray(data.items) ? data.items : [];
    const metadata = data.metadata || {};

    const mappedItems: (Item & { _source?: DataSource })[] = items.map(
      (item: Record<string, unknown>) => ({
        id: (item.id as string) || (item._id as string) || (item.item_code as string),
        item_code: item.item_code as string,
        barcode: item.barcode as string,
        name: item.item_name as string,
        item_name: item.item_name as string,
        description: item.description as string,
        uom: (item.uom_name as string) || (item.uom as string),
        uom_name: (item.uom_name as string) || (item.uom as string),
        stock_qty: (item.stock_qty as number) ?? 0,
        mrp: item.mrp as number,
        sale_price: item.sale_price as number,
        sales_price: (item.sale_price as number) || (item.sales_price as number),
        category: item.category as string,
        subcategory: item.subcategory as string,
        warehouse: item.warehouse as string,
        manual_barcode: item.manual_barcode as string,
        unit2_barcode: item.unit2_barcode as string,
        unit_m_barcode: item.unit_m_barcode as string,
        batch_id: item.batch_id as string,
        relevance_score: item.relevance_score as number,
        match_type: item.match_type as string,
        _source: "api",
      })
    );

    return {
      items: mappedItems,
      total: Number(data.total ?? mappedItems.length),
      hasMore: Boolean(metadata.has_more),
      nextCursor: undefined,
    };
  } catch (error: any) {
    log.error("searchItemsManual failed", { error: error?.message });
    return {
      items: [],
      total: 0,
      hasMore: false,
      nextCursor: undefined,
    };
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
  locked?: boolean;
  total_qty: number;
  item_variance?: number;
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
        return { scanned: false, locked: false, total_qty: 0, item_variance: 0, locations: [] };
      }

      const totalQty = itemLines.reduce((sum, line) => sum + (line.counted_qty || 0), 0);
      const locations = itemLines.map((line) => ({
        floor_no: (line.floor_no as string) || null,
        rack_no: (line.rack_no as string) || null,
        counted_qty: line.counted_qty || 0,
        counted_by: line.counted_by || "offline_user",
        counted_at: (line.created_at as string) || new Date().toISOString(),
      }));

      return { scanned: true, locked: false, total_qty: totalQty, item_variance: 0, locations };
    }

    const response = await api.get(`/api/sessions/${sessionId}/items/${itemCode}/scan-status`);
    return response.data;
  } catch (error) {
    console.error("Error checking item scan status:", error);
    return { scanned: false, locked: false, total_qty: 0, item_variance: 0, locations: [] };
  }
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

export interface ItemBatch {
  item_code: string;
  item_name?: string;
  batch_no: string;
  barcode?: string;
  manufacturing_date?: string;
  expiry_date?: string;
  stock_qty: number;
  warehouse?: string;
  mrp?: number;
}

export const getItemBatches = async (
  itemCode: string
): Promise<{ batches: ItemBatch[]; source?: string }> => {
  try {
    const response = await api.get(`/api/item-batches/${encodeURIComponent(itemCode)}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.warn("Get item batches error:", error);
    // Return empty matches on error to allow graceful degradation
    return { batches: [] };
  }
};
