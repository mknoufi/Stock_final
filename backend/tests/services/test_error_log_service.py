"""
Tests for ErrorLogService
"""

import pytest
from datetime import datetime, timezone

from backend.services.error_log import ErrorLogService

@pytest.mark.asyncio
async def test_mark_resolved_success(test_db):
    """
    Test marking an error as resolved.
    """
    service = ErrorLogService(test_db)

    # Create an initial error
    error_id = await service.log_error(
        ValueError("test error"),
        user="test_user"
    )
    assert error_id

    # Mark as resolved
    resolved_by = "admin_user"
    resolution_note = "Fixed by restarting the server"
    result = await service.mark_resolved(error_id, resolved_by, resolution_note)

    assert result is True

    # Verify the update
    updated_error = await service.get_error_by_id(error_id)
    assert updated_error["resolved"] is True
    assert updated_error["resolved_by"] == resolved_by
    assert updated_error["resolution_note"] == resolution_note
    assert isinstance(updated_error["resolved_at"], datetime)

    # Ensure resolved_at is recent (within last minute)
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    assert (now - updated_error["resolved_at"]).total_seconds() < 60


@pytest.mark.asyncio
async def test_mark_resolved_not_found(test_db):
    """
    Test marking a non-existent error as resolved.
    """
    service = ErrorLogService(test_db)

    # Use a fake ID
    fake_id = "000000000000000000000000"

    result = await service.mark_resolved(fake_id, "admin_user", "Should fail")

    assert result is False


@pytest.mark.asyncio
async def test_mark_resolved_already_resolved(test_db):
    """
    Test marking an already resolved error as resolved again (updating details).
    """
    service = ErrorLogService(test_db)

    # Create an initial error
    error_id = await service.log_error(
        ValueError("test error"),
        user="test_user"
    )

    # First resolution
    await service.mark_resolved(error_id, "user1", "note1")

    # Get first resolved_at
    first_update = await service.get_error_by_id(error_id)
    first_resolved_at = first_update["resolved_at"]

    # Second resolution
    new_resolved_by = "user2"
    new_note = "note2"
    result = await service.mark_resolved(error_id, new_resolved_by, new_note)

    assert result is True

    # Verify update
    second_update = await service.get_error_by_id(error_id)
    assert second_update["resolved_by"] == new_resolved_by
    assert second_update["resolution_note"] == new_note
    assert second_update["resolved_at"] > first_resolved_at
