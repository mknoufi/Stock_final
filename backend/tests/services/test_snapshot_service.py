import pytest
from datetime import datetime, timezone
import uuid
from backend.services.snapshot_service import SnapshotService


@pytest.fixture
def mock_erp_items(test_db):
    return test_db.erp_items


@pytest.mark.asyncio
async def test_get_or_create_snapshot_creates_new(test_db):
    service = SnapshotService(test_db)

    # Setup ERP item
    item_code = "TEST-SNAP-001"
    await test_db.erp_items.insert_one(
        {"item_code": item_code, "stock_qty": 100.0, "barcode": "12345678"}
    )

    snapshot = await service.get_or_create_snapshot(
        session_id="session-1", item_code=item_code, current_user="tester"
    )

    assert snapshot is not None
    assert snapshot["item_code"] == item_code
    assert snapshot["erp_qty"] == 100.0
    assert "baseline_hash" in snapshot
    assert snapshot["session_id"] == "session-1"


@pytest.mark.asyncio
async def test_get_or_create_snapshot_returns_existing(test_db):
    service = SnapshotService(test_db)
    item_code = "TEST-SNAP-002"

    # Insert existing snapshot
    existing_id = str(uuid.uuid4())
    await test_db.stock_snapshots.insert_one(
        {
            "id": existing_id,
            "session_id": "session-1",
            "item_code": item_code,
            "erp_qty": 50.0,
            "baseline_hash": "existing-hash",
            "timestamp": datetime.now(timezone.utc),
        }
    )

    snapshot = await service.get_or_create_snapshot(
        session_id="session-1", item_code=item_code, current_user="tester"
    )

    assert snapshot["id"] == existing_id
    assert snapshot["baseline_hash"] == "existing-hash"


@pytest.mark.asyncio
async def test_verify_snapshot_integrity(test_db):
    service = SnapshotService(test_db)
    item_code = "TEST-SNAP-003"
    qty = 75.0
    now = datetime.now(timezone.utc).replace(
        tzinfo=None
    )  # naive for consistency if needed, but service uses replace

    # Generate valid hash
    valid_hash = service._generate_hash(item_code, qty, now)

    snapshot_id = "test-integrity-id"
    await test_db.stock_snapshots.insert_one(
        {
            "id": snapshot_id,
            "item_code": item_code,
            "erp_qty": qty,
            "timestamp": now,
            "baseline_hash": valid_hash,
        }
    )

    is_valid = await service.verify_snapshot_integrity(snapshot_id)
    assert is_valid is True


@pytest.mark.asyncio
async def test_verify_snapshot_integrity_detects_tampering(test_db):
    service = SnapshotService(test_db)
    item_code = "TEST-SNAP-004"
    qty = 75.0
    now = datetime.now(timezone.utc).replace(tzinfo=None)

    # Generate valid hash then modify data
    valid_hash = service._generate_hash(item_code, qty, now)

    snapshot_id = "test-tamper-id"
    await test_db.stock_snapshots.insert_one(
        {
            "id": snapshot_id,
            "item_code": item_code,
            "erp_qty": 999.0,  # Tampered quantity
            "timestamp": now,
            "baseline_hash": valid_hash,
        }
    )

    is_valid = await service.verify_snapshot_integrity(snapshot_id)
    assert is_valid is False
