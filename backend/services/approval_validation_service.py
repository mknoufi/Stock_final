"""
Approval Validation Service

Centralised pre-approval / pre-rejection validation for count lines.
Handles: snapshot-based variance checks, photo enforcement, serial
integrity, barcode proof, optimistic locking helpers, and recount-limit
guards.
"""

import logging
from dataclasses import dataclass, field
from typing import Any, Dict, Optional

from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Validation result
# ---------------------------------------------------------------------------


@dataclass
class ValidationResult:
    """Outcome of a single validation check."""

    valid: bool = True
    error: Optional[str] = None
    error_code: Optional[str] = None
    warnings: list[str] = field(default_factory=list)


# ---------------------------------------------------------------------------
# Service
# ---------------------------------------------------------------------------


class ApprovalValidationService:
    """
    Encapsulates all checks that must pass before a count-line can be
    approved or rejected.  Used by:
      - supervisor_workflow_api  (batch approve / reject)
      - count_line_command_service  (bulk_approve_count_lines)
      - item_verification_api  (snapshot variance on verify)
    """

    MAX_RECOUNT_ATTEMPTS = 5

    def __init__(self, db: AsyncIOMotorDatabase) -> None:
        self.db = db

    # ------------------------------------------------------------------
    # Public: approval validation
    # ------------------------------------------------------------------

    async def validate_for_approval(
        self,
        count_line: dict,
        *,
        require_photos: bool = True,
        barcode_scan_proof: Optional[str] = None,
    ) -> ValidationResult:
        """
        Run all pre-approval checks on *count_line*.

        Checks performed (in order – first failure short-circuits):
        1. Immutability guard (already approved/rejected)
        2. Snapshot hash integrity
        3. Photo proof requirement (when *require_photos* is True)
        4. Serial-number consistency
        5. Barcode scan proof (if supplied)
        """
        result = ValidationResult()

        # 1. Immutability guard
        status = (count_line.get("status") or "").lower()
        if status in ("approved", "locked"):
            result.valid = False
            result.error = f"Count line is already {status}"
            result.error_code = "ALREADY_APPROVED"
            return result

        # 2. Snapshot / baseline-hash integrity
        baseline_hash = count_line.get("baseline_hash")
        if baseline_hash:
            current_hash = await self._compute_current_baseline_hash(count_line)
            if current_hash and current_hash != baseline_hash:
                result.valid = False
                result.error = (
                    "ERP data has changed since this count was submitted. Re-count may be required."
                )
                result.error_code = "BASELINE_HASH_MISMATCH"
                return result

        # 3. Photo proof
        if require_photos:
            has_photos = bool(count_line.get("photo_proofs") or count_line.get("photo_base64"))
            variance = abs(count_line.get("variance", 0))
            erp_qty = count_line.get("erp_qty", 0)
            variance_pct = (variance / erp_qty * 100) if erp_qty else 0
            mrp = count_line.get("mrp_erp", 0) or 0
            has_damage = (count_line.get("damaged_qty", 0) or 0) > 0

            needs_photo = variance > 100 or variance_pct > 50 or mrp > 10000 or has_damage

            if needs_photo and not has_photos:
                result.valid = False
                result.error = "Photo proof required for high-variance / high-value items"
                result.error_code = "PHOTO_REQUIRED"
                return result

        # 4. Serial-number consistency
        serial_entries = count_line.get("serial_entries") or []
        serial_numbers = count_line.get("serial_numbers") or []
        counted_qty = float(count_line.get("counted_qty", 0))
        if serial_entries and len(serial_entries) != int(counted_qty):
            result.warnings.append(
                f"Serial count ({len(serial_entries)}) does not match "
                f"counted qty ({int(counted_qty)})"
            )

        # 5. Barcode scan proof (optional extra check)
        if barcode_scan_proof is not None:
            item_barcode = count_line.get("barcode") or ""
            if barcode_scan_proof.strip() != item_barcode.strip():
                result.valid = False
                result.error = "Barcode scan proof does not match item barcode"
                result.error_code = "BARCODE_MISMATCH"
                return result

        return result

    # ------------------------------------------------------------------
    # Public: rejection validation
    # ------------------------------------------------------------------

    async def validate_for_rejection(
        self,
        count_line: dict,
        *,
        assignee: Optional[str] = None,
    ) -> ValidationResult:
        """
        Run pre-rejection checks on *count_line*.

        Checks:
        1. Immutability guard (already rejected / locked)
        2. Recount-attempt limit
        """
        result = ValidationResult()

        status = (count_line.get("status") or "").lower()
        if status in ("rejected", "locked"):
            result.valid = False
            result.error = f"Count line is already {status}"
            result.error_code = "ALREADY_REJECTED"
            return result

        # Recount limit
        recount_attempts = int(count_line.get("recount_attempts", 0))
        if recount_attempts >= self.MAX_RECOUNT_ATTEMPTS:
            result.valid = False
            result.error = (
                f"Recount limit reached ({self.MAX_RECOUNT_ATTEMPTS} attempts). "
                f"Escalation required."
            )
            result.error_code = "RECOUNT_LIMIT_REACHED"
            return result

        return result

    # ------------------------------------------------------------------
    # Public: optimistic-lock helpers
    # ------------------------------------------------------------------

    def build_optimistic_filter(
        self,
        count_line: dict,
        base_filter: dict,
    ) -> dict:
        """
        Extend *base_filter* with the document's current ``version``
        so that only un-modified documents are updated.
        """
        version = count_line.get("version", 1)
        merged = dict(base_filter)
        merged["version"] = version
        return merged

    def build_version_increment(self) -> Dict[str, Any]:
        """
        Return a MongoDB update document that bumps the ``version``
        field by 1.
        """
        return {
            "$inc": {"version": 1},
            "$set": {},
        }

    # ------------------------------------------------------------------
    # Public: snapshot variance
    # ------------------------------------------------------------------

    async def get_snapshot_variance(
        self,
        session_id: str,
        item_code: str,
        counted_qty: float,
    ) -> Dict[str, Any]:
        """
        Compute variance using the *snapshot* ERP quantity captured at
        session creation rather than the live value from ``erp_items``.

        Falls back gracefully when no snapshot is available.
        """
        try:
            snapshot = await self.db.session_snapshots.find_one(
                {"session_id": session_id, "item_code": item_code},
            )
            if not snapshot:
                # Try the sessions collection for embedded snapshots
                session_doc = await self.db.sessions.find_one(
                    {"id": session_id},
                    {"snapshot_quantities": 1},
                )
                snap_map = (session_doc or {}).get("snapshot_quantities") or {}
                snap_qty = snap_map.get(item_code)
                if snap_qty is not None:
                    return {
                        "variance": counted_qty - float(snap_qty),
                        "snapshot_qty": float(snap_qty),
                        "source": "session_embedded",
                        "error": None,
                    }
                return {"error": "no_snapshot", "variance": None}

            snap_qty = float(snapshot.get("erp_qty", 0))
            return {
                "variance": counted_qty - snap_qty,
                "snapshot_qty": snap_qty,
                "source": "session_snapshots",
                "error": None,
            }
        except Exception as exc:
            logger.warning("Snapshot variance lookup failed: %s", exc)
            return {"error": str(exc), "variance": None}

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    async def _compute_current_baseline_hash(self, count_line: dict) -> Optional[str]:
        """
        Re-compute the baseline hash from the current ERP data so we
        can detect drift since the count was submitted.

        Returns ``None`` when comparison is not possible (e.g. missing
        item in erp_items).
        """
        item_code = count_line.get("item_code")
        if not item_code:
            return None

        try:
            import hashlib

            erp_item = await self.db.erp_items.find_one(
                {"item_code": item_code},
                {"stock_qty": 1, "mrp": 1, "_id": 0},
            )
            if not erp_item:
                return None

            raw = f"{erp_item.get('stock_qty', 0)}:{erp_item.get('mrp', 0)}"
            return hashlib.sha256(raw.encode()).hexdigest()
        except Exception:
            return None
