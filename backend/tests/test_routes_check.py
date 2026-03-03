import pytest
from httpx import AsyncClient

from backend.server import app


def _route_count(path: str, method: str) -> int:
    return sum(
        1
        for route in app.routes
        if getattr(route, "path", None) == path and method.upper() in (getattr(route, "methods", set()))
    )


def test_api_router_paths_registered_once():
    # Routes declared on api_router in backend/server.py
    assert _route_count("/api/auth/refresh", "POST") == 1
    assert _route_count("/api/auth/logout", "POST") == 1


@pytest.mark.asyncio
async def test_openapi_contains_auth_refresh(async_client: AsyncClient, test_db):
    response = await async_client.get("/openapi.json")
    assert response.status_code == 200
    assert "/api/auth/refresh" in response.json().get("paths", {})
