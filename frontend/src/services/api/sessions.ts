import api from "../httpClient";
import { createLogger } from "../logging";
import { getNetworkStatus } from "../../utils/network";
import { generateOfflineId } from "../../utils/uuid";
import { useAuthStore } from "../../store/authStore";
import { isOnline, DataSource } from "./core";
import {
  addToOfflineQueue,
  cacheSession,
  removeSessionFromCache,
  getSessionsCache,
  getSessionFromCache,
  getCountLinesBySessionFromCache,
} from "../offline/offlineStorage";

const log = createLogger("SessionApi");

export interface CreateSessionParams {
  warehouse?: string; // Legacy support
  type?: string;
  location_type?: string;
  location_name?: string;
  rack_no?: string;
}

// Create session (with offline support)
export const createSession = async (params: string | CreateSessionParams) => {
  const warehouse = typeof params === "string" ? params : params.warehouse;
  const sessionType = typeof params !== "string" ? params.type : undefined;

  // Structured fields
  const locationType = typeof params !== "string" ? params.location_type : undefined;
  const locationName = typeof params !== "string" ? params.location_name : undefined;
  const rackNo = typeof params !== "string" ? params.rack_no : undefined;

  const networkStatus = getNetworkStatus();

  log.debug("Create session requested", {
    warehouse,
    type: sessionType,
    networkStatus: networkStatus.status,
  });

  // Helper to create offline session - single source of truth
  const createOfflineSession = () => ({
    id: generateOfflineId(),
    warehouse,
    location_type: locationType,
    location_name: locationName,
    rack_no: rackNo,
    status: "OPEN",
    type: sessionType || "STANDARD",
    staff_user: "offline_user",
    staff_name: "Offline User",
    started_at: new Date().toISOString(),
    total_items: 0,
    total_variance: 0,
    _source: "offline" as DataSource,
    _createdOffline: true,
  });

  try {
    if (!isOnline()) {
      log.info("Creating offline session", { warehouse, type: sessionType });
      const offlineSession = createOfflineSession();
      await cacheSession(offlineSession);
      await addToOfflineQueue("session", offlineSession);
      log.debug("Created offline session", {
        id: offlineSession.id,
        source: offlineSession._source,
      });
      return offlineSession;
    }

    const payload = {
      warehouse,
      location_type: locationType,
      location_name: locationName,
      rack_no: rackNo,
      ...(sessionType && { type: sessionType }),
    };

    const response = await api.post("/api/sessions", payload, {
      timeout: 3000, // Fail fast (3s) to fallback to offline mode if server is slow
      skipOfflineQueue: true,
    } as any);
    await cacheSession(response.data);
    log.debug("Created session via API", {
      id: response.data?.id,
      status: response.data?.status,
    });
    return response.data;
  } catch (error: unknown) {
    // Check if this is a business logic error (e.g., session limit reached)
    // These should be re-thrown so the UI can display the error message
    const axiosError = error as {
      response?: { status?: number; data?: { detail?: string } };
      code?: string;
    };

    if (axiosError?.response?.status === 400) {
      // Re-throw business logic errors (like session limit)
      const errorMessage = axiosError.response.data?.detail || "Session creation failed";
      log.warn("Session creation rejected by server", { error: errorMessage });
      throw new Error(errorMessage);
    }

    // For network errors or other issues, fall back to offline mode
    log.warn("Error creating session, switching to offline mode", {
      error: error instanceof Error ? error.message : String(error),
    });

    // Fallback to offline mode using same helper
    const offlineSession = createOfflineSession();
    await cacheSession(offlineSession);
    await addToOfflineQueue("session", offlineSession);
    log.debug("Created offline session after API error", {
      id: offlineSession.id,
      source: offlineSession._source,
    });
    return offlineSession;
  }
};

// Get sessions (with offline support and pagination)
/**
 * Get sessions with pagination. Falls back to local cache when offline or on errors.
 * @param page Page number (1-based)
 * @param pageSize Page size (1-100)
 */
export interface SessionsFilterOptions {
  startTime?: string;
  endTime?: string;
}

const toSessionDate = (session: any): Date | null => {
  const candidates = [
    session?.started_at,
    session?.created_at,
    session?.updated_at,
    session?.closed_at,
    session?.completed_at,
  ];

  for (const value of candidates) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value;
    }
    if (typeof value === "number") {
      const ms = value > 1e12 ? value : value * 1000;
      const d = new Date(ms);
      if (!Number.isNaN(d.getTime())) return d;
    }
    if (typeof value === "string" && value.trim()) {
      const d = new Date(value);
      if (!Number.isNaN(d.getTime())) return d;
      const numeric = Number(value);
      if (!Number.isNaN(numeric)) {
        const ms = numeric > 1e12 ? numeric : numeric * 1000;
        const parsed = new Date(ms);
        if (!Number.isNaN(parsed.getTime())) return parsed;
      }
    }
  }

  return null;
};

const applySessionTimeFilters = (sessions: any[], startTime?: string, endTime?: string) => {
  const from = startTime ? new Date(startTime) : null;
  const to = endTime ? new Date(endTime) : null;

  const hasFrom = !!from && !Number.isNaN(from.getTime());
  const hasTo = !!to && !Number.isNaN(to.getTime());
  if (!hasFrom && !hasTo) return sessions;

  return sessions.filter((session) => {
    const dt = toSessionDate(session);
    if (!dt) return false;
    if (hasFrom && dt < (from as Date)) return false;
    if (hasTo && dt > (to as Date)) return false;
    return true;
  });
};

export const getSessions = async (
  page: number = 1,
  pageSize: number = 20,
  filters: SessionsFilterOptions = {}
) => {
  try {
    const hasTimeFilter = !!(filters.startTime || filters.endTime);

    if (!isOnline()) {
      // Return cached sessions
      const cache = await getSessionsCache();
      const allSessions = applySessionTimeFilters(
        Object.values(cache),
        filters.startTime,
        filters.endTime
      );

      // Apply pagination to cached data
      const skip = (page - 1) * pageSize;
      const paginatedSessions = allSessions.slice(skip, skip + pageSize);

      return {
        items: paginatedSessions,
        pagination: {
          page,
          page_size: pageSize,
          total: allSessions.length,
          total_pages: Math.ceil(allSessions.length / pageSize),
          has_next: skip + pageSize < allSessions.length,
          has_prev: page > 1,
        },
      };
    }

    // Ensure page and pageSize are valid numbers (convert to integers explicitly)
    const validPage = Math.max(1, Math.floor(Number(page)) || 1);
    const validPageSize = Math.max(1, Math.min(100, Math.floor(Number(pageSize)) || 20));

    const response = await api.get("/api/sessions", {
      params: {
        page: validPage,
        page_size: validPageSize,
        ...(filters.startTime ? { start_time: filters.startTime } : {}),
        ...(filters.endTime ? { end_time: filters.endTime } : {}),
      },
    });

    const responseData = response.data?.data ?? response.data;
    // Handle old format (array), new format (object with items), and wrapped data
    const sessions = Array.isArray(responseData?.items)
      ? responseData.items
      : Array.isArray(responseData)
        ? responseData
        : [];
    const pagination = responseData?.pagination ||
      response.data?.pagination || {
        page,
        page_size: pageSize,
        total: sessions.length,
        total_pages: 1,
        has_next: false,
        has_prev: false,
      };

    // Cache sessions
    if (Array.isArray(sessions)) {
      for (const session of sessions) {
        await cacheSession(session);
      }
    }

    // Merge in cached sessions not returned by the API (e.g., offline-created).
    // Skip merge when explicit server-side time filters are applied.
    let mergedSessions = sessions;
    if (!hasTimeFilter) {
      try {
        const cache = await getSessionsCache();
        const cachedSessions = Object.values(cache);
        const user = useAuthStore.getState().user;
        const isSupervisor = user?.role === "supervisor";
        const visibleCached = isSupervisor
          ? cachedSessions
          : cachedSessions.filter((session) => session.staff_user === user?.username);

        if (visibleCached.length > 0) {
          const seenIds = new Set(
            sessions
              .map((session: any) => session?.id || session?.session_id || session?._id)
              .filter(Boolean)
          );
          const missingCached = visibleCached.filter((session) => !seenIds.has(session.id));
          if (missingCached.length > 0) {
            mergedSessions = [...sessions, ...missingCached];
          }
        }
      } catch (cacheError) {
        __DEV__ && console.warn("Unable to merge cached sessions:", cacheError);
      }
    }

    const timeFilteredSessions = applySessionTimeFilters(
      mergedSessions,
      filters.startTime,
      filters.endTime
    );

    const filteredPagination = hasTimeFilter
      ? {
          ...pagination,
          total: timeFilteredSessions.length,
          total_pages: Math.max(1, Math.ceil(timeFilteredSessions.length / validPageSize)),
          has_next: false,
          has_prev: validPage > 1,
        }
      : pagination;

    return {
      items: timeFilteredSessions,
      pagination: filteredPagination,
    };
  } catch (error: any) {
    // Suppress logging for 401 errors as they are handled by the interceptor
    if (error?.response?.status !== 401) {
      __DEV__ && console.error("Error getting sessions:", error);
    }

    // Fallback to cache
    const cache = await getSessionsCache();
    const allSessions = applySessionTimeFilters(
      Object.values(cache),
      filters.startTime,
      filters.endTime
    );
    const skip = (page - 1) * pageSize;
    const paginatedSessions = allSessions.slice(skip, skip + pageSize);

    return {
      items: paginatedSessions,
      pagination: {
        page,
        page_size: pageSize,
        total: allSessions.length,
        total_pages: Math.ceil(allSessions.length / pageSize),
        has_next: skip + pageSize < allSessions.length,
        has_prev: page > 1,
      },
    };
  }
};

// Get session by ID (with offline support)
/**
 * Get a single session by id. Uses cache offline.
 * @param sessionId Session identifier
 */
export const getSession = async (sessionId: string) => {
  try {
    if (!isOnline()) {
      // Return cached session
      return await getSessionFromCache(sessionId);
    }

    // If this is an offline session, use cache directly
    if (sessionId.startsWith("offline_")) {
      return await getSessionFromCache(sessionId);
    }

    const response = await api.get(`/api/sessions/${sessionId}`);
    await cacheSession(response.data);
    return response.data;
  } catch (error: any) {
    __DEV__ && console.error("Error getting session:", error);

    if (error?.response?.status === 404) {
      // Only remove if it's NOT an offline session
      if (!sessionId.startsWith("offline_")) {
        await removeSessionFromCache(sessionId);
        return null;
      }
    }

    // Fallback to cache
    return await getSessionFromCache(sessionId);
  }
};

// Update session status
export const updateSessionStatus = async (sessionId: string, status: string) => {
  const normalizedStatus = String(status).toUpperCase();

  // Use the specific complete endpoint for closing sessions to ensure locks are released
  if (normalizedStatus === "CLOSED") {
    const response = await api.post(`/api/sessions/${sessionId}/complete`);
    return response.data;
  }

  // For other statuses (like RECONCILE), use the generic status endpoint
  const response = await api.put(
    `/api/sessions/${sessionId}/status?status=${encodeURIComponent(normalizedStatus)}`
  );
  return response.data;
};

/**
 * Session statistics response from the API
 */
export interface SessionStatsResponse {
  id: string;
  totalItems: number;
  scannedItems: number;
  verifiedItems: number;
  pendingItems: number;
  damageItems?: number;
  durationSeconds?: number;
  itemsPerMinute?: number;
}

/**
 * Get session statistics from the API
 * Returns verified/pending/scanned counts for progress tracking
 */
export const getSessionStats = async (sessionId: string): Promise<SessionStatsResponse | null> => {
  try {
    if (!isOnline()) {
      log.debug("Offline - cannot fetch session stats from API");
      return null;
    }

    // If this is an offline session, don't query the API
    if (sessionId.startsWith("offline_")) {
      return null;
    }

    const response = await api.get(`/api/sessions/${sessionId}/stats`);
    const data = response.data;

    // Normalize snake_case to camelCase
    return {
      id: data.id,
      totalItems: data.total_items ?? 0,
      scannedItems: (data.verified_items ?? 0) + (data.pending_items ?? 0),
      verifiedItems: data.verified_items ?? 0,
      pendingItems: data.pending_items ?? 0,
      damageItems: data.damage_items ?? 0,
      durationSeconds: data.duration_seconds ?? 0,
      itemsPerMinute: data.items_per_minute ?? 0,
    };
  } catch (error: any) {
    if (error?.response?.status === 404) {
      // Vital: Do not remove offline sessions from cache just because API can't find them
      if (!sessionId.startsWith("offline_")) {
        log.warn(`Session ${sessionId} not found on server, removing from cache`);
        await removeSessionFromCache(sessionId);
      }
    } else {
      log.warn("Error fetching session stats:", error);
    }
    return null;
  }
};

// Get Rack Progress
export const getRackProgress = async (sessionId: string) => {
  try {
    if (!isOnline()) {
      // Offline: Calculate rack progress from cached count lines
      // Implementation: Provides meaningful progress data using available cached information
      const cachedLines = await getCountLinesBySessionFromCache(sessionId);

      if (cachedLines.length === 0) {
        return {
          data: [],
          message: "Offline mode - no cached count data available for this session",
          offline: true,
        };
      }

      // Group counted items by rack with enhanced calculation
      const rackStats: Record<
        string,
        {
          counted: number;
          uniqueItems: Set<string>;
          totalQuantity: number;
          lastUpdated: string;
          hasDiscrepancies: boolean;
        }
      > = {};

      for (const line of cachedLines) {
        // Extract rack information from count line data
        const rack = line.rack_no || line.rack || line.rack_id || "Unknown";

        // Create stats object if it doesn't exist
        let stats = rackStats[rack];
        if (!stats) {
          stats = {
            counted: 0,
            uniqueItems: new Set(),
            totalQuantity: 0,
            lastUpdated: line.counted_at || new Date().toISOString(),
            hasDiscrepancies: false,
          };
          rackStats[rack] = stats;
        }

        // Track unique items and quantities
        if (!stats.uniqueItems.has(line.item_code)) {
          stats.uniqueItems.add(line.item_code);
          stats.counted++;
        }

        // Accumulate total quantity counted
        stats.totalQuantity += line.counted_qty || 1;

        // Check for discrepancies (if variance data is available)
        if (line.variance && Math.abs(line.variance) > 0) {
          stats.hasDiscrepancies = true;
        }

        // Update last modified time
        const lineTime = line.counted_at;
        if (lineTime && lineTime > stats.lastUpdated) {
          stats.lastUpdated = lineTime;
        }
      }

      // Build comprehensive rack progress array
      const rackProgress = Object.entries(rackStats)
        .filter(([rack]) => rack !== "Unknown")
        .map(([rack, stats]) => ({
          rack,
          total: null, // Unknown offline - would require full ERP data cache
          counted: stats.counted,
          counted_quantity: stats.totalQuantity,
          percentage: null, // Cannot calculate without total items per rack
          offline: true,
          last_updated: stats.lastUpdated,
          has_discrepancies: stats.hasDiscrepancies,
          status: stats.hasDiscrepancies ? "discrepancies" : "counting",
          estimated_completion: null, // Would need historical data for estimation
        }))
        .sort((a, b) => a.rack.localeCompare(b.rack));

      // Provide detailed offline status information
      const totalItems = rackProgress.reduce((sum, rack) => sum + rack.counted, 0);
      const totalQuantity = rackProgress.reduce((sum, rack) => sum + rack.counted_quantity, 0);
      const racksWithDiscrepancies = rackProgress.filter((r) => r.has_discrepancies).length;

      return {
        data: rackProgress,
        message: `Offline mode - ${rackProgress.length} racks with ${totalItems} counted items (${totalQuantity} total quantity)${racksWithDiscrepancies > 0 ? `, ${racksWithDiscrepancies} racks with discrepancies` : ""}`,
        offline: true,
        summary: {
          total_racks: rackProgress.length,
          total_counted_items: totalItems,
          total_counted_quantity: totalQuantity,
          racks_with_discrepancies: racksWithDiscrepancies,
          last_sync: new Date().toISOString(),
        },
      };
    }
    const response = await api.get(`/api/v2/sessions/${sessionId}/rack-progress`);
    // Return just the data part which is the array of racks
    return response.data;
  } catch (error) {
    __DEV__ && console.error("Error getting rack progress:", error);
    return { data: [] };
  }
};

// Bulk close sessions
export const bulkCloseSessions = async (sessionIds: string[]) => {
  try {
    const response = await api.post("/api/sessions/bulk/close", sessionIds, {
      skipOfflineQueue: true,
    } as any);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Bulk close sessions error:", error);
    throw error;
  }
};

// Bulk reconcile sessions
export const bulkReconcileSessions = async (sessionIds: string[]) => {
  try {
    const response = await api.post("/api/sessions/bulk/reconcile", sessionIds, {
      skipOfflineQueue: true,
    } as any);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Bulk reconcile sessions error:", error);
    throw error;
  }
};

// Bulk export sessions
export const bulkExportSessions = async (sessionIds: string[], format: string = "excel") => {
  try {
    const response = await api.post("/api/sessions/bulk/export", sessionIds, {
      params: { format },
    });
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Bulk export sessions error:", error);
    throw error;
  }
};

// Get sessions analytics (aggregated server-side)
export const getSessionsAnalytics = async () => {
  try {
    const response = await api.get("/api/sessions/analytics");
    return response.data;
  } catch (error: unknown) {
    log.error("Get sessions analytics error", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};
