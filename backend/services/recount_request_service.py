"""
Recount Request Service

Manages the lifecycle of recount requests — requested by supervisors
when a count line is rejected and needs to be re-counted by staff.
"""

import logging
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)


class RecountRequestService:
    """Service layer for recount request CRUD and state transitions."""

    VALID_STATUSES = {
        "pending",
        "accepted",
        "in_progress",
        "submitted",
        "completed",
        "rejected",
        "cancelled",
    }

    def __init__(self, db: AsyncIOMotorDatabase) -> None:
        self.db = db

    # ------------------------------------------------------------------
    # Create
    # ------------------------------------------------------------------

    async def create_request(
        self,
        payload: dict,
        supervisor_id: str,
    ) -> dict:
        """Create a new recount request."""
        request_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).replace(tzinfo=None)

        doc = {
            "request_id": request_id,
            "session_id": payload.get("session_id"),
            "count_line_id": payload.get("count_line_id"),
            "item_code": payload.get("item_code"),
            "item_name": payload.get("item_name"),
            "warehouse": payload.get("warehouse"),
            "reason": payload.get("reason", ""),
            "notes": payload.get("notes", ""),
            "priority": payload.get("priority", "normal"),
            "supervisor_id": supervisor_id,
            "assigned_to": payload.get("assigned_to"),
            "status": "pending",
            "created_at": now,
            "updated_at": now,
            "history": [
                {
                    "action": "created",
                    "by": supervisor_id,
                    "at": now,
                    "notes": payload.get("reason", ""),
                }
            ],
        }

        await self.db.recount_requests.insert_one(doc)
        doc.pop("_id", None)
        return doc

    # ------------------------------------------------------------------
    # Read
    # ------------------------------------------------------------------

    async def list_requests(
        self,
        *,
        status: Optional[str] = None,
        assigned_to: Optional[str] = None,
        session_id: Optional[str] = None,
        supervisor_id: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> List[dict]:
        """List recount requests with optional filters."""
        query: Dict[str, Any] = {}
        if status:
            query["status"] = status
        if assigned_to:
            query["assigned_to"] = assigned_to
        if session_id:
            query["session_id"] = session_id
        if supervisor_id:
            query["supervisor_id"] = supervisor_id

        cursor = (
            self.db.recount_requests.find(query, {"_id": 0})
            .sort("created_at", -1)
            .skip(skip)
            .limit(limit)
        )
        return await cursor.to_list(length=limit)

    async def get_request(self, request_id: str) -> Optional[dict]:
        """Get a single recount request by ID."""
        doc = await self.db.recount_requests.find_one({"request_id": request_id}, {"_id": 0})
        return doc

    async def get_rejection_history(self, request_id: str) -> List[dict]:
        """Return the history entries for a recount request."""
        doc = await self.db.recount_requests.find_one(
            {"request_id": request_id}, {"_id": 0, "history": 1}
        )
        if not doc:
            return []
        return doc.get("history", [])

    # ------------------------------------------------------------------
    # State transitions
    # ------------------------------------------------------------------

    async def _transition(
        self,
        request_id: str,
        action: str,
        new_status: str,
        actor: str,
        extra_set: Optional[dict] = None,
        notes: str = "",
    ) -> Optional[dict]:
        """Generic state-transition helper."""
        now = datetime.now(timezone.utc).replace(tzinfo=None)
        update: Dict[str, Any] = {
            "$set": {
                "status": new_status,
                "updated_at": now,
                **(extra_set or {}),
            },
            "$push": {
                "history": {
                    "action": action,
                    "by": actor,
                    "at": now,
                    "notes": notes,
                }
            },
        }

        result = await self.db.recount_requests.find_one_and_update(
            {"request_id": request_id},
            update,
            return_document=True,
        )
        if result:
            result.pop("_id", None)
        return result

    async def accept_request(self, request_id: str, actor: str, payload: dict) -> Optional[dict]:
        return await self._transition(
            request_id,
            "accepted",
            "accepted",
            actor,
            notes=payload.get("notes", ""),
        )

    async def reject_request(self, request_id: str, actor: str, payload: dict) -> Optional[dict]:
        return await self._transition(
            request_id,
            "rejected",
            "rejected",
            actor,
            notes=payload.get("reason", payload.get("notes", "")),
        )

    async def start_recount(self, request_id: str, actor: str, payload: dict) -> Optional[dict]:
        return await self._transition(
            request_id,
            "started",
            "in_progress",
            actor,
            notes=payload.get("notes", ""),
        )

    async def submit_recount(self, request_id: str, actor: str, payload: dict) -> Optional[dict]:
        extra = {}
        if "counted_qty" in payload:
            extra["counted_qty"] = payload["counted_qty"]
        if "photo_proofs" in payload:
            extra["photo_proofs"] = payload["photo_proofs"]
        return await self._transition(
            request_id,
            "submitted",
            "submitted",
            actor,
            extra_set=extra,
            notes=payload.get("notes", ""),
        )

    async def complete_request(self, request_id: str, actor: str, payload: dict) -> Optional[dict]:
        return await self._transition(
            request_id,
            "completed",
            "completed",
            actor,
            notes=payload.get("notes", ""),
        )

    async def cancel_request(self, request_id: str, actor: str, payload: dict) -> Optional[dict]:
        return await self._transition(
            request_id,
            "cancelled",
            "cancelled",
            actor,
            notes=payload.get("reason", payload.get("notes", "")),
        )

    async def reassign_request(self, request_id: str, actor: str, payload: dict) -> Optional[dict]:
        new_assignee = payload.get("assigned_to", "")
        return await self._transition(
            request_id,
            "reassigned",
            "pending",
            actor,
            extra_set={"assigned_to": new_assignee},
            notes=payload.get("notes", f"Reassigned to {new_assignee}"),
        )
