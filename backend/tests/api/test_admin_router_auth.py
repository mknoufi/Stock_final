import pytest
from fastapi import status
from httpx import AsyncClient

from backend.auth.dependencies import get_current_user
from backend.server import app


async def mock_get_current_staff():
    return {
        "_id": "staff_id",
        "username": "staff1",
        "role": "staff",
        "full_name": "Staff Member",
        "is_active": True,
        "permissions": [],
    }


@pytest.mark.asyncio
async def test_admin_settings_requires_auth(async_client: AsyncClient):
    response = await async_client.get("/api/admin/settings/parameters")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.asyncio
async def test_service_logs_requires_auth(async_client: AsyncClient):
    response = await async_client.get("/api/admin/logs/backend")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.asyncio
async def test_service_logs_forbids_staff(async_client: AsyncClient):
    app.dependency_overrides[get_current_user] = mock_get_current_staff

    response = await async_client.get("/api/admin/logs/backend")

    assert response.status_code == status.HTTP_403_FORBIDDEN
