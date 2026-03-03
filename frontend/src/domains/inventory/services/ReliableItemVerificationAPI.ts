import type { VerificationRequest, VerificationResponse } from "./itemVerificationApi";
import { transitionQueue } from "@/services/sync/TransitionQueue";
import * as Crypto from "expo-crypto";

export class ReliableItemVerificationAPI {
  /**
   * Optimistically verify an item by queuing the request.
   */
  static async verifyItem(
    itemCode: string,
    request: VerificationRequest
  ): Promise<VerificationResponse> {
    const tempId = Crypto.randomUUID();

    transitionQueue.enqueue({
      id: tempId,
      type: "verify",
      url: `/api/v2/erp/items/${encodeURIComponent(itemCode)}/verify`,
      method: "PATCH",
      payload: request,
      metadata: { itemId: itemCode },
    });

    // Return optimistic response
    return {
      success: true,
      message: "Verification queued (Offline)",
      item: {
        id: "temp-offline-id",
        item_code: itemCode,
        item_name: "Optimistic Update", // We don't have the name if offline, UI should handle this
        barcode: "",
        stock_qty: 0,
        mrp: 0,
        verified: true,
        verified_at: new Date().toISOString(),
      },
    };
  }

  /**
   * Optimistically approve a variance.
   */
  static async approveVariance(
    countLineId: string,
    notes?: string,
    barcodeScanProof?: string
  ): Promise<Record<string, unknown>> {
    const tempId = Crypto.randomUUID();

    transitionQueue.enqueue({
      id: tempId,
      type: "approve",
      url: `/api/v1/supervisor/batch-approve`,
      method: "POST",
      payload: {
        count_line_ids: [countLineId],
        approval_notes: notes,
        barcode_scan_proof: barcodeScanProof,
      },
      metadata: { countLineId },
    });

    return { success: true, message: "Approval queued" };
  }

  /**
   * Optimistically reject/request recount.
   */
  static async requestRecount(
    countLineId: string,
    notes?: string
  ): Promise<Record<string, unknown>> {
    const tempId = Crypto.randomUUID();

    transitionQueue.enqueue({
      id: tempId,
      type: "reject",
      url: `/api/count-lines/${countLineId}/reject`,
      method: "PUT",
      payload: { notes },
      metadata: { countLineId },
    });

    return { success: true, message: "Recount requested (queued)" };
  }

  /**
   * Optimistically verify an existing count line.
   */
  static async verifyCountLine(countLineId: string): Promise<Record<string, unknown>> {
    const tempId = Crypto.randomUUID();

    transitionQueue.enqueue({
      id: tempId,
      type: "verify",
      url: `/api/count-lines/${countLineId}/verify`,
      method: "PUT",
      metadata: { countLineId },
    });

    return { success: true, message: "Verification queued" };
  }

  /**
   * Optimistically unverify an existing count line.
   */
  static async unverifyCountLine(countLineId: string): Promise<Record<string, unknown>> {
    const tempId = Crypto.randomUUID();

    transitionQueue.enqueue({
      id: tempId,
      type: "unverify",
      url: `/api/count-lines/${countLineId}/unverify`,
      method: "PUT",
      metadata: { countLineId },
    });

    return { success: true, message: "Unverify queued" };
  }

  /**
   * Optimistically bulk reject variances.
   */
  static async bulkRejectVariances(
    countLineIds: string[],
    notes?: string,
    assignTo?: string
  ): Promise<{ success: boolean; modified_count: number }> {
    const tempId = Crypto.randomUUID();

    transitionQueue.enqueue({
      id: tempId,
      type: "reject",
      url: `/api/v1/supervisor/batch-reject`,
      method: "POST",
      payload: {
        count_line_ids: countLineIds,
        rejection_reason: notes,
        assign_to: assignTo,
      },
      metadata: { countLineIds },
    });

    return { success: true, modified_count: countLineIds.length };
  }

  /**
   * Optimistically bulk approve variances.
   */
  static async bulkApproveVariances(
    countLineIds: string[],
    notes?: string
  ): Promise<{ success: boolean; modified_count: number }> {
    const tempId = Crypto.randomUUID();

    transitionQueue.enqueue({
      id: tempId,
      type: "approve",
      url: `/api/count-lines/bulk/approve`,
      method: "POST",
      payload: {
        count_line_ids: countLineIds,
        notes,
      },
      metadata: { countLineIds },
    });

    return { success: true, modified_count: countLineIds.length };
  }
}
