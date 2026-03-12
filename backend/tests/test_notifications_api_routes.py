from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
import pytest

from backend.api import notifications_api


class _DummyNotificationService:
    def __init__(self, db):
        self.db = db

    async def get_user_notifications(self, user_id: str, unread_only: bool, limit: int):
        return [
            {
                "id": "notif-1",
                "type": "recount_assigned",
                "title": "Recount Requested",
                "message": "Please recount ITEM-1",
                "priority": "high",
                "read": False,
                "created_at": "2026-03-12T10:00:00Z",
            }
        ]

    async def get_unread_count(self, user_id: str):
        return 1


@pytest.fixture
def notifications_app(monkeypatch: pytest.MonkeyPatch) -> FastAPI:
    app = FastAPI()
    app.include_router(notifications_api.router)
    app.dependency_overrides[notifications_api.get_current_user] = lambda: {
        "username": "staff1",
        "role": "staff",
    }
    app.dependency_overrides[notifications_api.get_db] = lambda: object()
    monkeypatch.setattr(notifications_api, "NotificationService", _DummyNotificationService)
    return app


@pytest.mark.asyncio
@pytest.mark.parametrize("path", ["/api/notifications", "/api/notifications/"])
async def test_get_notifications_accepts_both_route_forms(
    notifications_app: FastAPI, path: str
):
    async with AsyncClient(
        transport=ASGITransport(app=notifications_app),
        base_url="http://test",
    ) as client:
        response = await client.get(path, params={"limit": 5})

    assert response.status_code == 200
    payload = response.json()
    assert payload["total"] == 1
    assert payload["unread_count"] == 1
    assert payload["notifications"][0]["id"] == "notif-1"
