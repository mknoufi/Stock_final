import api from "../httpClient";
import { createLogger } from "../logging";
import { CreateCountLinePayload } from "../../types/scan";
import { useAuthStore } from "../../store/authStore";
import { isOnline, DataSource } from "./core";
import { ItemVerificationAPI } from "../../domains/inventory/services/itemVerificationApi";
import {
  cacheCountLine,
  addToOfflineQueue,
  getItemFromCache,
  getCountLinesBySessionFromCache,
} from "../offline/offlineStorage";
import { createOfflineCountLine } from "../offline/offlineCountLine";

const log = createLogger("CountApi");

// Create count line (with offline support)
/**
 * Create a count line with offline fallback.
 * Uses createOfflineCountLine helper for consistent offline object creation.
 */
const buildDraftLineId = (payload: CreateCountLinePayload): string => {
  if (payload.line_id) return payload.line_id;
  const parts = [payload.item_code, payload.floor_no || "", payload.rack_no || ""].filter(Boolean);
  return parts.join("|") || payload.item_code;
};

// Save draft for real-time dashboard
export const saveDraft = async (lineData: CreateCountLinePayload) => {
  try {
    if (!isOnline()) return null;
    const payload = {
      ...lineData,
      line_id: buildDraftLineId(lineData),
    };
    const response = await api.post("/api/draft/save", payload);
    return response.data;
  } catch (error: any) {
    log.warn("Failed to save draft", {
      error: error?.message || String(error),
    });
    return null;
  }
};

export const getDraftsForSession = async (sessionId: string) => {
  try {
    if (!isOnline()) return null;
    const response = await api.get(`/api/draft/${sessionId}`);
    return response.data;
  } catch (error: any) {
    log.warn("Failed to fetch drafts", {
      error: error?.message || String(error),
    });
    return null;
  }
};

export const createCountLine = async (
  countData: CreateCountLinePayload
): Promise<any & { _source?: DataSource; _offline?: boolean }> => {
  const normalizePhotoProofsForApi = (
    proofs: unknown
  ): { id: string; url: string; timestamp: string }[] | undefined => {
    if (!Array.isArray(proofs) || proofs.length === 0) {
      return undefined;
    }

    const normalized = proofs
      .map((proof, index) => {
        if (!proof || typeof proof !== "object") return null;

        const candidate = proof as Record<string, unknown>;
        const rawId = candidate.id;
        const rawUrl = candidate.url ?? candidate.uri;
        const rawTimestamp = candidate.timestamp ?? candidate.capturedAt;

        if (typeof rawUrl !== "string" || rawUrl.trim().length === 0) {
          return null;
        }

        const safeIndex = index + 1;
        const timestamp =
          typeof rawTimestamp === "string" && rawTimestamp.trim().length > 0
            ? rawTimestamp
            : new Date().toISOString();
        const id =
          typeof rawId === "string" && rawId.trim().length > 0
            ? rawId
            : `proof_${Date.now()}_${safeIndex}`;

        return {
          id,
          url: rawUrl,
          timestamp,
        };
      })
      .filter((proof): proof is { id: string; url: string; timestamp: string } => !!proof);

    return normalized.length > 0 ? normalized : undefined;
  };

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
  const normalizedCountData: CreateCountLinePayload = {
    ...countData,
    photo_proofs: normalizePhotoProofsForApi(countData.photo_proofs) as any,
  };

  try {
    // If offline OR working with an offline-created session, use local logic
    const isOfflineSession = String(normalizedCountData.session_id || "").startsWith("offline_");

    if (!isOnline() || isOfflineSession) {
      log.debug("Offline mode or offline session - creating offline count line", {
        isOnline: isOnline(),
        isOfflineSession,
      });

      const itemName = await resolveItemName();
      const offlineCountLine = (await createOfflineCountLine(normalizedCountData, {
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
    const response = await api.post("/api/count-lines", normalizedCountData, {
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
      console.error("DIAGNOSTIC: Server Error during createCountLine", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
        method: error.config?.method,
        payload_keys: Object.keys(normalizedCountData),
      });
      log.error("Server returned error, NOT falling back to offline", {
        status: error.response.status,
        data: error.response.data,
      });
      // Propagate the server error so the UI can show the real reason
      throw error;
    }

    console.error("DIAGNOSTIC: Network/Other Error during createCountLine", {
      message: error.message,
      code: error.code,
      isAxiosError: error.isAxiosError,
    });
    log.error("Network error creating count line, falling back to offline", {
      error: error instanceof Error ? error.message : String(error),
    });

    // Fallback to offline mode using the same helper
    const itemName = await resolveItemName();
    const offlineCountLine = (await createOfflineCountLine(normalizedCountData, {
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

    // Cache count lines
    if (response.data?.items && Array.isArray(response.data.items)) {
      for (const countLine of response.data.items) {
        await cacheCountLine(countLine);
      }
    } else if (Array.isArray(response.data)) {
      // Handle legacy format
      for (const countLine of response.data) {
        await cacheCountLine(countLine);
      }
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
  return ItemVerificationAPI.approveVariance(lineId);
};

// Reject count line
export const rejectCountLine = async (lineId: string) => {
  return ItemVerificationAPI.requestRecount(lineId);
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

// Stock Verification
export const verifyStock = async (countLineId: string) => {
  return ItemVerificationAPI.verifyCountLine(countLineId);
};

export const unverifyStock = async (countLineId: string) => {
  return ItemVerificationAPI.unverifyCountLine(countLineId);
};
