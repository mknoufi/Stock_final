import asyncio
from unittest.mock import AsyncMock, patch, MagicMock
from httpx import ASGITransport, AsyncClient
from datetime import datetime
from backend.server import app


async def test_create_session():
    mock_user_staff = {"username": "staff1", "role": "staff", "full_name": "Staff User"}

    # Mock DB
    mock_db = AsyncMock()
    mock_db.sessions = AsyncMock()
    mock_db.sessions.find_one = AsyncMock(return_value=None)
    mock_db.sessions.count_documents = AsyncMock(return_value=0)
    mock_db.sessions.update_many = AsyncMock()
    mock_db.sessions.insert_one = AsyncMock(return_value=AsyncMock(inserted_id="sess_123"))
    mock_db.verification_sessions = AsyncMock()
    mock_db.verification_sessions.update_many = AsyncMock()
    mock_db.verification_sessions.insert_one = AsyncMock(
        return_value=AsyncMock(inserted_id="vsess_123")
    )

    # Mock Governance collections
    mock_db.config_versions = AsyncMock()
    mock_db.config_versions.find_one = AsyncMock(
        return_value={"id": "v1", "created_at": datetime.utcnow()}
    )

    mock_db.erp_items = AsyncMock()

    # Create an async generator for the cursor
    async def mock_items_gen():
        yield {"item_code": "ITEM-001", "stock_qty": 50, "warehouse": "WH001", "_id": "item_1"}

    mock_cursor = MagicMock()
    mock_cursor.__aiter__ = mock_items_gen

    # IMPORTANT: find needs to be MagicMock to return cursor immediately (not awaitable)
    mock_db.erp_items.find = MagicMock(return_value=mock_cursor)

    mock_db.session_snapshots = AsyncMock()
    mock_db.session_snapshots.insert_one = AsyncMock()

    async def override_get_db():
        return mock_db

    async def override_get_current_user():
        return mock_user_staff

    # Mock refresh token service
    mock_refresh_service = AsyncMock()
    mock_refresh_service.revoke_all_user_tokens = AsyncMock(return_value=0)

    from backend.auth.dependencies import get_current_user_async
    from backend.db.runtime import get_db

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user_async] = override_get_current_user

    try:
        # Patch the direct call to get_refresh_token_service which might be causing issues
        with patch(
            "backend.api.session_management_api.get_refresh_token_service",
            return_value=mock_refresh_service,
        ):
            async with AsyncClient(
                transport=ASGITransport(app=app), base_url="http://test"
            ) as client:
                print("Sending POST /api/sessions/")
                response = await client.post(
                    "/api/sessions/",
                    json={"warehouse": "WH001", "type": "STANDARD"},
                )
                print(f"Status Code: {response.status_code}")
                if response.status_code != 200:
                    print(f"Response: {response.text}")

    except Exception as e:
        print(f"Exception: {e}")
        import traceback

        traceback.print_exc()
    finally:
        app.dependency_overrides.clear()


if __name__ == "__main__":
    asyncio.run(test_create_session())
