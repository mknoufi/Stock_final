import pytest
from httpx import ASGITransport, AsyncClient

from backend.config import settings
from backend.server import app
from backend.tests.utils.in_memory_db import setup_server_with_in_memory_db


@pytest.mark.asyncio
async def test_single_session_enforcement(monkeypatch):
    setup_server_with_in_memory_db(monkeypatch)
    monkeypatch.setattr(settings, "AUTH_SINGLE_SESSION", True)

    login_payload = {"username": "supervisor", "password": "super123"}

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        resp1 = await client.post("/api/auth/login", json=login_payload)
        assert resp1.status_code == 200
        token1 = resp1.json()["data"]["access_token"]

        resp2 = await client.post("/api/auth/login", json=login_payload)
        assert resp2.status_code == 409
        detail = resp2.json().get("detail", {})
        assert "active session" in str(detail).lower()

        resp3 = await client.post(
            "/api/sessions/logout-all",
            headers={"Authorization": f"Bearer {token1}"},
        )
        assert resp3.status_code == 200

        resp4 = await client.post("/api/auth/login", json=login_payload)
        assert resp4.status_code == 200
