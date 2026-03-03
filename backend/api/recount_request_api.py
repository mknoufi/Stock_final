"""
Recount Request API

REST endpoints for recount request lifecycle management.
Router prefix: /api/recount-requests  (set via tag, no explicit prefix here –
server.py registers it with tags=["Recount Requests"]).
"""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from backend.auth.dependencies import get_current_user
from backend.core import globals as g
from backend.services.recount_request_service import RecountRequestService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/recount-requests")


def _svc() -> RecountRequestService:
    if g.db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    return RecountRequestService(g.db)


# ------------------------------------------------------------------
# CRUD
# ------------------------------------------------------------------


@router.post("", status_code=201)
async def create_recount_request(
    payload: dict,
    current_user: dict = Depends(get_current_user),
):
    """Create a new recount request (supervisor / admin)."""
    if current_user["role"] not in ("supervisor", "admin"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    try:
        result = await _svc().create_request(payload, supervisor_id=current_user["username"])
        return {"success": True, "data": result}
    except Exception as exc:
        logger.error("Create recount request failed: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("")
async def list_recount_requests(
    status: Optional[str] = Query(None),
    assigned_to: Optional[str] = Query(None),
    session_id: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_user: dict = Depends(get_current_user),
):
    """List recount requests (filtered by role)."""
    try:
        kwargs = {"skip": skip, "limit": limit}
        if status:
            kwargs["status"] = status
        if session_id:
            kwargs["session_id"] = session_id

        # Staff only see their own assignments
        if current_user["role"] == "staff":
            kwargs["assigned_to"] = current_user["username"]
        elif assigned_to:
            kwargs["assigned_to"] = assigned_to

        items = await _svc().list_requests(**kwargs)
        return {"success": True, "data": items, "count": len(items)}
    except Exception as exc:
        logger.error("List recount requests failed: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/{request_id}")
async def get_recount_request(
    request_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Get a single recount request."""
    doc = await _svc().get_request(request_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Recount request not found")
    return {"success": True, "data": doc}


@router.get("/{request_id}/rejection-history")
async def get_rejection_history(
    request_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Return the full history for a recount request."""
    history = await _svc().get_rejection_history(request_id)
    return {"success": True, "data": history}


# ------------------------------------------------------------------
# State transitions
# ------------------------------------------------------------------


@router.post("/{request_id}/accept")
async def accept_request(
    request_id: str,
    payload: dict = {},
    current_user: dict = Depends(get_current_user),
):
    """Staff accepts a recount assignment."""
    result = await _svc().accept_request(request_id, current_user["username"], payload)
    if not result:
        raise HTTPException(status_code=404, detail="Recount request not found")
    return {"success": True, "data": result}


@router.post("/{request_id}/reject")
async def reject_request(
    request_id: str,
    payload: dict = {},
    current_user: dict = Depends(get_current_user),
):
    """Staff rejects a recount assignment."""
    result = await _svc().reject_request(request_id, current_user["username"], payload)
    if not result:
        raise HTTPException(status_code=404, detail="Recount request not found")
    return {"success": True, "data": result}


@router.post("/{request_id}/start")
async def start_recount(
    request_id: str,
    payload: dict = {},
    current_user: dict = Depends(get_current_user),
):
    """Staff starts working on the recount."""
    result = await _svc().start_recount(request_id, current_user["username"], payload)
    if not result:
        raise HTTPException(status_code=404, detail="Recount request not found")
    return {"success": True, "data": result}


@router.post("/{request_id}/submit")
async def submit_recount(
    request_id: str,
    payload: dict,
    current_user: dict = Depends(get_current_user),
):
    """Staff submits their recount result."""
    result = await _svc().submit_recount(request_id, current_user["username"], payload)
    if not result:
        raise HTTPException(status_code=404, detail="Recount request not found")
    return {"success": True, "data": result}


@router.post("/{request_id}/complete")
async def complete_request(
    request_id: str,
    payload: dict = {},
    current_user: dict = Depends(get_current_user),
):
    """Supervisor marks the recount as completed."""
    if current_user["role"] not in ("supervisor", "admin"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    result = await _svc().complete_request(request_id, current_user["username"], payload)
    if not result:
        raise HTTPException(status_code=404, detail="Recount request not found")
    return {"success": True, "data": result}


@router.post("/{request_id}/cancel")
async def cancel_request(
    request_id: str,
    payload: dict = {},
    current_user: dict = Depends(get_current_user),
):
    """Cancel a recount request (supervisor / admin)."""
    if current_user["role"] not in ("supervisor", "admin"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    result = await _svc().cancel_request(request_id, current_user["username"], payload)
    if not result:
        raise HTTPException(status_code=404, detail="Recount request not found")
    return {"success": True, "data": result}


@router.post("/{request_id}/reassign")
async def reassign_request(
    request_id: str,
    payload: dict,
    current_user: dict = Depends(get_current_user),
):
    """Reassign a recount request to a different staff member."""
    if current_user["role"] not in ("supervisor", "admin"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    result = await _svc().reassign_request(request_id, current_user["username"], payload)
    if not result:
        raise HTTPException(status_code=404, detail="Recount request not found")
    return {"success": True, "data": result}
