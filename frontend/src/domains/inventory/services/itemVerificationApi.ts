/**
 * Item Verification API Service
 * Handles verification, filtering, CSV export, and variance tracking
 */
import api from "@/services/httpClient";
import NetInfo from "@react-native-community/netinfo";
import { ReliableItemVerificationAPI } from "./ReliableItemVerificationAPI";

export interface VerificationRequest {
  verified: boolean;
  verified_qty?: number;
  damaged_qty?: number;
  non_returnable_damaged_qty?: number;
  item_condition?: string;
  serial_number?: string;
  notes?: string;
  floor?: string;
  rack?: string;
  session_id?: string;
  count_line_id?: string;
}

export interface WorkflowEvent {
  timestamp: string;
  actor_id: string;
  action: string;
  from_state?: string;
  to_state?: string;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface TransitionMetricsSnapshot {
  counters: Record<string, number>;
  histograms: Record<
    string,
    {
      count: number;
      sum: number;
      min: number;
      max: number;
      avg: number;
    }
  >;
}

export interface DeadLetterEvent {
  event_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  attempts: number;
  last_error: string;
  dead_lettered_at: string;
  created_at?: string;
  updated_at?: string;
}

export interface DeadLetterListResponse {
  items: DeadLetterEvent[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    has_more: boolean;
  };
}

export interface ItemUpdateRequest {
  mrp?: number;
  sales_price?: number;
  category?: string;
  subcategory?: string;
  uom?: string;
}

export interface Item {
  id: string;
  item_code: string;
  item_name: string;
  barcode: string;
  stock_qty: number;
  mrp: number;
  category?: string;
  subcategory?: string;
  warehouse?: string;
  floor?: string;
  rack?: string;
  verified?: boolean;
  verified_at?: string;
  verified_by?: string;
  [key: string]: unknown;
}

export interface VerificationResponse {
  success: boolean;
  item: Item;
  variance?: number;
  message: string;
}

export interface FilteredItemsParams {
  category?: string;
  subcategory?: string;
  floor?: string;
  rack?: string;
  warehouse?: string;
  uom_code?: string;
  verified?: boolean;
  search?: string;
  limit?: number;
  skip?: number;
}

export interface FilteredItemsResponse {
  success: boolean;
  items: Item[];
  pagination: {
    total: number;
    limit: number;
    skip: number;
    returned: number;
  };
  statistics: {
    total_items: number;
    verified_items: number;
    unverified_items: number;
    total_stock_qty: number;
    total_verified_qty: number;
    total_counted_cost: number;
    total_stock_cost: number;
  };
}

export interface VarianceItem {
  item_code: string;
  item_name: string;
  system_qty: number;
  verified_qty: number;
  variance: number;
  counted_by?: string;
  verified_by: string;
  verified_at: string;
  approval_status?: string;
  workflow_status?: string;
  category?: string;
  subcategory?: string;
  floor?: string;
  rack?: string;
  warehouse?: string;
  session_id?: string;
  count_line_id?: string;
  details?: {
    photo_base64?: string;
    photo_proofs?: any[];
    risk_flags?: string[];
    correction_reason?: any;
    variance_reason?: string;
    approval_status?: string;
    status?: string;
    is_misplaced?: boolean;
    expected_location?: string;
    found_location?: string;
  };
}

export interface LiveUser {
  username: string;
  last_activity: string;
  items_verified: number;
}

export interface SupervisorStaffMember {
  username: string;
  full_name?: string | null;
}

export interface LiveVerification {
  item_code: string;
  item_name: string;
  verified_by: string;
  verified_at: string;
  floor?: string;
  rack?: string;
  category?: string;
  variance?: number;
}

export interface LiveVerificationsResponse {
  success: boolean;
  verifications: LiveVerification[];
  count: number;
}

// Explicit response type to avoid inline generic parsing issues
export interface LiveUsersResponse {
  success: boolean;
  users: LiveUser[];
  count: number;
}

interface ApiError {
  response?: {
    status?: number;
    data?: {
      detail?: string | { message: string };
    };
  };
  message?: string;
}

interface RetryableApiError {
  response?: {
    status?: number;
  };
  message?: string;
}

export class ItemVerificationAPI {
  private static async isOffline(): Promise<boolean> {
    const networkState = await NetInfo.fetch();
    return !networkState.isConnected || networkState.isInternetReachable === false;
  }

  private static isRetryableFailure(error: unknown): boolean {
    const apiError = error as RetryableApiError;
    const status = apiError.response?.status;
    return status === undefined || status >= 500 || status === 429 || status === 408;
  }

  /**
   * Verify an item
   */
  static async verifyItem(
    itemCode: string,
    request: VerificationRequest
  ): Promise<VerificationResponse> {
    if (await this.isOffline()) {
      return ReliableItemVerificationAPI.verifyItem(itemCode, request);
    }

    try {
      const response = await api.patch(
        `/api/v2/erp/items/${encodeURIComponent(itemCode)}/verify`,
        request
      );
      return response.data;
    } catch (error: unknown) {
      if (this.isRetryableFailure(error)) {
        return ReliableItemVerificationAPI.verifyItem(itemCode, request);
      }
      __DEV__ && console.error("Verification failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Verification failed";
      throw new Error(errorMessage);
    }
  }

  /**
   * Get filtered items
   */
  static async getFilteredItems(params: FilteredItemsParams): Promise<FilteredItemsResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params.category) queryParams.append("category", params.category);
      if (params.subcategory) queryParams.append("subcategory", params.subcategory);
      if (params.floor) queryParams.append("floor", params.floor);
      if (params.rack) queryParams.append("rack", params.rack);
      if (params.warehouse) queryParams.append("warehouse", params.warehouse);
      if (params.uom_code) queryParams.append("uom_code", params.uom_code);
      if (params.verified !== undefined) queryParams.append("verified", params.verified.toString());
      if (params.search) queryParams.append("search", params.search);
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.skip) queryParams.append("skip", params.skip.toString());

      const response = await api.get(`/api/v2/erp/items/filtered?${queryParams.toString()}`);
      return response.data;
    } catch (error: unknown) {
      __DEV__ && console.error("Get filtered items failed:", error);
      const err = error as ApiError;
      const detail = err.response?.data?.detail;
      const message =
        typeof detail === "object" && detail !== null
          ? detail.message
          : (detail as string) || err.message || "Failed to get filtered items";
      throw new Error(message);
    }
  }

  /**
   * Export items to CSV
   */
  static async exportItemsToCSV(params: FilteredItemsParams): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams();

      if (params.category) queryParams.append("category", params.category);
      if (params.subcategory) queryParams.append("subcategory", params.subcategory);
      if (params.floor) queryParams.append("floor", params.floor);
      if (params.rack) queryParams.append("rack", params.rack);
      if (params.warehouse) queryParams.append("warehouse", params.warehouse);
      if (params.verified !== undefined) queryParams.append("verified", params.verified.toString());
      if (params.search) queryParams.append("search", params.search);

      const response = await api.get(`/api/v2/erp/items/export/csv?${queryParams.toString()}`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error: unknown) {
      __DEV__ && console.error("CSV export failed:", error);
      const err = error as ApiError;
      const detail = err.response?.data?.detail;
      const message =
        typeof detail === "object" && detail !== null
          ? detail.message
          : (detail as string) || err.message || "CSV export failed";
      throw new Error(message);
    }
  }

  /**
   * Get variances
   */
  static async getVariances(params: {
    category?: string;
    floor?: string;
    rack?: string;
    warehouse?: string;
    search?: string;
    staff_name?: string;
    session_id?: string;
    approval_status?: string;
    misplaced_only?: boolean;
    sort_by?: "date" | "variance" | "abs_variance";
    sort_order?: "asc" | "desc";
    limit?: number;
    skip?: number;
  }): Promise<{
    success: boolean;
    variances: VarianceItem[];
    pagination: {
      total: number;
      limit: number;
      skip: number;
      returned: number;
    };
  }> {
    try {
      const queryParams = new URLSearchParams();

      if (params.category) queryParams.append("category", params.category);
      if (params.floor) queryParams.append("floor", params.floor);
      if (params.rack) queryParams.append("rack", params.rack);
      if (params.warehouse) queryParams.append("warehouse", params.warehouse);
      if (params.search) queryParams.append("search", params.search);
      if (params.staff_name) queryParams.append("staff_name", params.staff_name);
      if (params.session_id) queryParams.append("session_id", params.session_id);
      if (params.approval_status) queryParams.append("approval_status", params.approval_status);
      if (params.misplaced_only !== undefined) {
        queryParams.append("misplaced_only", String(params.misplaced_only));
      }
      if (params.sort_by) queryParams.append("sort_by", params.sort_by);
      if (params.sort_order) queryParams.append("sort_order", params.sort_order);
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.skip) queryParams.append("skip", params.skip.toString());

      const response = await api.get(`/api/v2/erp/items/variances?${queryParams.toString()}`);
      return response.data;
    } catch (error: unknown) {
      __DEV__ && console.error("Get variances failed:", error);
      const err = error as ApiError;
      const detail = err.response?.data?.detail;
      const message =
        typeof detail === "object" && detail !== null
          ? detail.message
          : (detail as string) || err.message || "Failed to get variances";
      throw new Error(message);
    }
  }

  /**
   * Get live users
   */
  static async getLiveUsers(): Promise<LiveUsersResponse> {
    try {
      const response = await api.get("/api/v2/erp/items/live/users");
      return response.data;
    } catch (error: unknown) {
      __DEV__ && console.error("Get live users failed:", error);
      const err = error as ApiError;
      const detail = err.response?.data?.detail;
      const message =
        typeof detail === "object" && detail !== null
          ? detail.message
          : (detail as string) || err.message || "Failed to get live users";
      throw new Error(message);
    }
  }

  /**
   * Get live verifications
   */
  static async getLiveVerifications(limit: number = 10): Promise<LiveVerificationsResponse> {
    try {
      const response = await api.get("/api/v2/erp/items/live/verifications", {
        params: { limit },
      });
      return response.data as LiveVerificationsResponse;
    } catch (error: unknown) {
      __DEV__ && console.error("Get live verifications failed:", error);
      const err = error as ApiError;
      const detail = err.response?.data?.detail;
      const message =
        typeof detail === "object" && detail !== null
          ? detail.message
          : (detail as string) || err.message || "Failed to get live verifications";
      throw new Error(message);
    }
  }

  /**
   * Get unique locations (floors and racks)
   */
  static async getLocations(): Promise<{ floors: string[]; racks: string[] }> {
    try {
      const response = await api.get("/api/v2/erp/items/locations");
      return response.data;
    } catch (error: unknown) {
      __DEV__ && console.error("Get locations failed:", error);
      // Return empty lists on error to prevent UI crash
      return { floors: [], racks: [] };
    }
  }

  /**
   * Get active staff members for supervisor assignment/filtering.
   */
  static async getSupervisorStaffMembers(): Promise<SupervisorStaffMember[]> {
    try {
      const response = await api.get<{ success?: boolean; staff?: SupervisorStaffMember[] }>(
        "/api/v1/supervisor/staff-members"
      );
      return Array.isArray(response.data?.staff) ? response.data.staff : [];
    } catch (error: unknown) {
      __DEV__ && console.error("Get supervisor staff members failed:", error);
      return [];
    }
  }

  /**
   * Get recent session IDs for supervisor filters.
   */
  static async getSessionFilterOptions(limit: number = 200): Promise<string[]> {
    try {
      const response = await api.get("/api/sessions", {
        params: { page: 1, page_size: limit },
      });

      const payload = response.data?.data ?? response.data;
      const items = Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload)
          ? payload
          : [];

      const ids = items
        .map((session: any) => session?.id || session?.session_id || session?._id)
        .filter((id: unknown): id is string => typeof id === "string" && id.length > 0);

      return Array.from(new Set(ids));
    } catch (error: unknown) {
      __DEV__ && console.error("Get session filter options failed:", error);
      return [];
    }
  }

  /**
   * Approve a variance (Supervisor)
   */
  static async approveVariance(
    countLineId: string,
    notes?: string,
    barcodeScanProof?: string
  ): Promise<Record<string, unknown>> {
    if (await this.isOffline()) {
      return ReliableItemVerificationAPI.approveVariance(countLineId, notes, barcodeScanProof);
    }

    try {
      const response = await api.post(`/api/v1/supervisor/batch-approve`, {
        count_line_ids: [countLineId],
        approval_notes: notes,
        barcode_scan_proof: barcodeScanProof,
      });
      return response.data;
    } catch (error) {
      if (this.isRetryableFailure(error)) {
        return ReliableItemVerificationAPI.approveVariance(countLineId, notes, barcodeScanProof);
      }
      throw error;
    }
  }

  /**
   * Request a recount / Reject a count (Supervisor)
   */
  static async requestRecount(
    countLineId: string,
    notes?: string
  ): Promise<Record<string, unknown>> {
    if (await this.isOffline()) {
      return ReliableItemVerificationAPI.requestRecount(countLineId, notes);
    }

    try {
      const response = await api.put(`/api/count-lines/${countLineId}/reject`, {
        notes,
      });
      return response.data;
    } catch (error) {
      if (this.isRetryableFailure(error)) {
        return ReliableItemVerificationAPI.requestRecount(countLineId, notes);
      }
      throw error;
    }
  }

  /**
   * Mark item as found in a different location.
   */
  static async markDifferentLocation(
    countLineId: string,
    payload: {
      found_location: string;
      expected_location?: string;
      notes?: string;
    }
  ): Promise<Record<string, unknown>> {
    try {
      const response = await api.patch(
        `/api/count-lines/${encodeURIComponent(countLineId)}/mark-different-location`,
        payload
      );
      return response.data;
    } catch (error: unknown) {
      __DEV__ && console.error("Mark different location failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to mark different location";
      throw new Error(errorMessage);
    }
  }

  /**
   * Verify a count line (supervisor workflow).
   */
  static async verifyCountLine(countLineId: string): Promise<Record<string, unknown>> {
    if (await this.isOffline()) {
      return ReliableItemVerificationAPI.verifyCountLine(countLineId);
    }

    try {
      const response = await api.put(`/api/count-lines/${countLineId}/verify`);
      return response.data;
    } catch (error) {
      if (this.isRetryableFailure(error)) {
        return ReliableItemVerificationAPI.verifyCountLine(countLineId);
      }
      throw error;
    }
  }

  /**
   * Remove verification from a count line (supervisor workflow).
   */
  static async unverifyCountLine(countLineId: string): Promise<Record<string, unknown>> {
    if (await this.isOffline()) {
      return ReliableItemVerificationAPI.unverifyCountLine(countLineId);
    }

    try {
      const response = await api.put(`/api/count-lines/${countLineId}/unverify`);
      return response.data;
    } catch (error) {
      if (this.isRetryableFailure(error)) {
        return ReliableItemVerificationAPI.unverifyCountLine(countLineId);
      }
      throw error;
    }
  }

  /**
   * Update item master details
   */
  static async updateItemMaster(
    itemCode: string,
    request: ItemUpdateRequest
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.patch(
        `/api/v2/erp/items/${encodeURIComponent(itemCode)}/update-master`,
        request
      );
      return response.data;
    } catch (error: unknown) {
      __DEV__ && console.error("Master update failed:", error);
      const err = error as ApiError;
      const detail = err.response?.data?.detail;
      const message =
        typeof detail === "object" && detail !== null
          ? detail.message
          : (detail as string) || err.message || "Failed to update item details";
      throw new Error(message);
    }
  }

  /**
   * Get variance details for a specific item in a session
   */
  static async getVarianceDetails(
    itemCode: string,
    sessionId: string
  ): Promise<VarianceItem | null> {
    try {
      // First try to find the count line
      const response = await api.get(`/api/count-lines`, {
        params: {
          item_code: itemCode,
          session_id: sessionId,
          limit: 1,
        },
      });

      if (response.data && response.data.items && response.data.items.length > 0) {
        const countLine = response.data.items[0];
        // Map to expected format if needed, or return as is
        // The UI expects: item_code, item_name, system_qty, verified_qty, variance, etc.
        // CountLine has: item_code, item_name, counted_qty, variance (if calculated)

        // We might need to fetch item details for system_qty if not in count line
        // But let's assume count line has enough info or we fetch item separately

        return {
          ...countLine,
          verified_qty: countLine.counted_qty,
          verified_by: countLine.username,
          verified_at: countLine.counted_at,
          count_line_id: countLine.id,
        } as VarianceItem;
      }

      // Fallback: fetch from verification logs or item master
      // This is less ideal for "approval" workflow which is based on CountLine
      return null;
    } catch (error) {
      __DEV__ && console.error("Failed to get variance details:", error);
      throw error;
    }
  }

  /**
   * Bulk approve variances
   */
  static async bulkApproveVariances(
    countLineIds: string[],
    notes?: string
  ): Promise<{ success: boolean; modified_count: number }> {
    if (await this.isOffline()) {
      return ReliableItemVerificationAPI.bulkApproveVariances(countLineIds, notes);
    }

    try {
      const response = await api.post(`/api/count-lines/bulk/approve`, {
        count_line_ids: countLineIds,
        notes,
      });
      return response.data;
    } catch (error: unknown) {
      if (this.isRetryableFailure(error)) {
        return ReliableItemVerificationAPI.bulkApproveVariances(countLineIds, notes);
      }
      __DEV__ && console.error("Bulk approve failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Bulk approve failed";
      throw new Error(errorMessage);
    }
  }

  /**
   * Bulk reject variances
   */
  static async bulkRejectVariances(
    countLineIds: string[],
    notes?: string
  ): Promise<{ success: boolean; modified_count: number }> {
    if (await this.isOffline()) {
      return ReliableItemVerificationAPI.bulkRejectVariances(countLineIds, notes);
    }

    try {
      const response = await api.post(`/api/count-lines/bulk/reject`, {
        count_line_ids: countLineIds,
        notes,
      });
      return response.data;
    } catch (error: unknown) {
      if (this.isRetryableFailure(error)) {
        return ReliableItemVerificationAPI.bulkRejectVariances(countLineIds, notes);
      }
      __DEV__ && console.error("Bulk reject failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Bulk reject failed";
      throw new Error(errorMessage);
    }
  }

  /**
   * Get item locations
   */
  static async getItemLocations(
    itemCode: string,
    sessionId?: string
  ): Promise<{
    item_code: string;
    total_qty: number;
    locations: {
      floor: string;
      rack: string;
      qty: number;
      scanned_by: string;
      timestamp: string;
      is_display_unit: boolean;
      bundle_id?: string;
      bundle_part?: string;
      session_id: string;
    }[];
  }> {
    const params = new URLSearchParams();
    if (sessionId) params.append("session_id", sessionId);

    try {
      const response = await api.get(
        `/api/v2/locations/item/${encodeURIComponent(itemCode)}?${params.toString()}`
      );
      return response.data;
    } catch (error: unknown) {
      __DEV__ && console.error("Get item locations failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch item locations";
      throw new Error(errorMessage);
    }
  }

  /**
   * Get workflow history for a count line
   */
  static async getWorkflowHistory(countLineId: string): Promise<WorkflowEvent[]> {
    try {
      const response = await api.get<WorkflowEvent[] | { history?: WorkflowEvent[] }>(
        `/api/v1/workflow/count-lines/${countLineId}/history`
      );
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (Array.isArray(response.data?.history)) {
        return response.data.history;
      }
      return [];
    } catch (error: unknown) {
      __DEV__ && console.error("Get workflow history failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch workflow history";
      throw new Error(errorMessage);
    }
  }

  /**
   * Get transition lock diagnostics metrics for supervisor dashboards.
   */
  static async getTransitionMetrics(): Promise<TransitionMetricsSnapshot> {
    try {
      const response = await api.get<{
        success?: boolean;
        data?: TransitionMetricsSnapshot;
      }>(`/api/v1/workflow/transition-metrics`);

      return (
        response.data?.data ?? {
          counters: {},
          histograms: {},
        }
      );
    } catch (error: unknown) {
      __DEV__ && console.error("Get transition metrics failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch transition metrics";
      throw new Error(errorMessage);
    }
  }

  /**
   * List dead-lettered domain events for workflow diagnostics.
   */
  static async getDeadLetterEvents(limit = 100, offset = 0): Promise<DeadLetterListResponse> {
    try {
      const response = await api.get<{
        success?: boolean;
        data?: DeadLetterListResponse;
      }>(`/api/v1/workflow/dead-letter`, { params: { limit, offset } });

      return (
        response.data?.data ?? {
          items: [],
          pagination: {
            limit,
            offset,
            total: 0,
            has_more: false,
          },
        }
      );
    } catch (error: unknown) {
      __DEV__ && console.error("Get dead-letter events failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch dead-letter events";
      throw new Error(errorMessage);
    }
  }

  /**
   * Retry one dead-letter event (admin-only).
   */
  static async retryDeadLetterEvent(eventId: string): Promise<boolean> {
    try {
      const response = await api.post<{
        success: boolean;
        requeued?: boolean;
      }>(`/api/v1/workflow/dead-letter/${encodeURIComponent(eventId)}/retry`);
      return !!response.data?.success && !!response.data?.requeued;
    } catch (error: unknown) {
      __DEV__ && console.error("Retry dead-letter event failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to retry dead-letter event";
      throw new Error(errorMessage);
    }
  }

  static async getItemLiveDetails(
    itemCode: string,
    sessionId?: string,
    batchId?: string
  ): Promise<{
    success: boolean;
    data: {
      item_code: string;
      item_name: string;
      last_purchase_cost: number;
      total_verified_value: number;
      is_locked: boolean;
      batches: {
        batch_id: string;
        stock_qty: number;
        last_synced?: string;
      }[];
      lines: {
        id: string;
        counted_at: string;
        staff_name: string;
        floor_no?: string;
        rack_no?: string;
        counted_qty: number;
        damaged_qty: number;
        non_returnable_damaged_qty: number;
        status: string;
        verified: boolean;
        verified_at?: string;
        verified_by?: string;
        batch_id?: string;
      }[];
    };
  }> {
    try {
      const params: any = {};
      if (sessionId) params.session_id = sessionId;
      if (batchId) params.batch_id = batchId;

      const response = await api.get(
        `/api/v2/erp/items/${encodeURIComponent(itemCode)}/live-details`,
        { params }
      );
      return response.data;
    } catch (error: unknown) {
      __DEV__ && console.error("Get item live details failed:", error);
      const err = error as ApiError;
      const detail = err.response?.data?.detail;
      const message =
        typeof detail === "object" && detail !== null
          ? detail.message
          : (detail as string) || err.message || "Failed to get item live details";
      throw new Error(message);
    }
  }
}
