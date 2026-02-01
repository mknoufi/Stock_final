import time
from unittest.mock import AsyncMock, MagicMock

import pytest
from httpx import ASGITransport, AsyncClient

from backend.server import app
from backend.services.session_state_machine import SessionStateMachine


@pytest.mark.governance
def test_session_state_machine_guard():
    assert SessionStateMachine.can_transition("ACTIVE", "RECONCILE") is True
    assert SessionStateMachine.can_transition("COMPLETED", "ACTIVE") is False
    assert SessionStateMachine.can_transition("CLOSED", "ACTIVE") is False


@pytest.mark.asyncio
@pytest.mark.governance
async def test_update_session_status_rejects_invalid_transition():
    session = {
        "session_id": "sess_123",
        "user_id": "staff1",
        "status": "CLOSED",
        "started_at": time.time(),
        "last_heartbeat": time.time(),
    }

    mock_db = MagicMock()
    mock_db.verification_sessions = MagicMock()
    mock_db.verification_sessions.find_one = AsyncMock(return_value=session)
    mock_db.verification_sessions.update_one = AsyncMock(return_value=MagicMock(modified_count=1))

    async def override_get_db():
        return mock_db

    async def override_get_current_user():
        return {"username": "staff1", "role": "staff", "full_name": "Staff User"}

    from backend.auth.dependencies import get_current_user_async
    from backend.db.runtime import get_db

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user_async] = override_get_current_user

    try:
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
        ) as client:
            response = await client.put("/api/sessions/sess_123/status?status=ACTIVE")
            assert response.status_code == 409
            assert "Invalid session transition" in response.json()["detail"]
        mock_db.verification_sessions.update_one.assert_not_called()
    finally:
        app.dependency_overrides.clear()
