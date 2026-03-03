import pytest
from unittest.mock import MagicMock, AsyncMock
from backend.services.reporting.compare_engine import CompareEngine
import time

@pytest.fixture
def mock_db():
    db = MagicMock()
    # Mock collections
    db.report_snapshots = MagicMock()
    db.report_snapshots.find_one = AsyncMock()

    db.report_compare_jobs = MagicMock()
    db.report_compare_jobs.insert_one = AsyncMock()
    db.report_compare_jobs.find_one = AsyncMock()
    db.report_compare_jobs.find = MagicMock()

    # Allow accessing collections by name like db["collection_name"]
    def get_collection(name):
        if name == "report_snapshots":
            return db.report_snapshots
        if name == "report_compare_jobs":
            return db.report_compare_jobs
        return MagicMock()

    db.__getitem__.side_effect = get_collection

    return db

@pytest.fixture
def compare_engine(mock_db):
    return CompareEngine(mock_db)

@pytest.mark.asyncio
async def test_compare_snapshots_success(compare_engine, mock_db):
    """Test comparing two valid snapshots"""
    snapshot_a_id = "snap_a"
    snapshot_b_id = "snap_b"
    created_by = "user1"

    snapshot_a = {
        "snapshot_id": snapshot_a_id,
        "name": "Snapshot A",
        "created_at": 1000,
        "collection": "items",
        "query_spec": {"group_by": ["category"]},
        "summary": {"total_items": 100, "total_value": 5000},
        "row_data": [
            {"category": "A", "count": 50, "value": 2500},
            {"category": "B", "count": 50, "value": 2500},
        ]
    }

    snapshot_b = {
        "snapshot_id": snapshot_b_id,
        "name": "Snapshot B",
        "created_at": 2000,
        "collection": "items",
        "query_spec": {"group_by": ["category"]},
        "summary": {"total_items": 110, "total_value": 5500},
        "row_data": [
            {"category": "A", "count": 55, "value": 2750},
            {"category": "B", "count": 55, "value": 2750},
        ]
    }

    def find_one_side_effect(query):
        if query.get("snapshot_id") == snapshot_a_id:
            return snapshot_a
        if query.get("snapshot_id") == snapshot_b_id:
            return snapshot_b
        return None

    mock_db.report_snapshots.find_one.side_effect = find_one_side_effect

    result = await compare_engine.compare_snapshots(
        snapshot_a_id, snapshot_b_id, created_by
    )

    assert result["snapshot_a_id"] == snapshot_a_id
    assert result["snapshot_b_id"] == snapshot_b_id
    assert result["created_by"] == created_by
    assert result["status"] == "completed"

    comparison = result["comparison_result"]

    # Check summary diff
    summary_diff = comparison["summary_diff"]
    assert summary_diff["total_items"]["baseline"] == 100
    assert summary_diff["total_items"]["comparison"] == 110
    assert summary_diff["total_items"]["absolute_diff"] == 10
    assert summary_diff["total_items"]["percent_diff"] == 10.0
    assert summary_diff["total_items"]["trend"] == "up"

    # Check row diff
    row_diff = comparison["row_diff"]
    assert row_diff["changed_count"] == 2
    assert row_diff["added_count"] == 0
    assert row_diff["removed_count"] == 0

    # Verify DB interaction
    mock_db.report_compare_jobs.insert_one.assert_called_once()


@pytest.mark.asyncio
async def test_compare_snapshots_not_found(compare_engine, mock_db):
    """Test error when snapshot not found"""
    mock_db.report_snapshots.find_one.return_value = None

    with pytest.raises(ValueError, match="Snapshot snap_missing not found"):
        await compare_engine.compare_snapshots("snap_missing", "snap_b", "user1")

@pytest.mark.asyncio
async def test_compare_snapshots_mismatch_collection(compare_engine, mock_db):
    """Test error when snapshots are from different collections"""
    snapshot_a = {
        "snapshot_id": "snap_a",
        "collection": "items"
    }
    snapshot_b = {
        "snapshot_id": "snap_b",
        "collection": "users"
    }

    def find_one_side_effect(query):
        if query.get("snapshot_id") == "snap_a":
            return snapshot_a
        if query.get("snapshot_id") == "snap_b":
            return snapshot_b
        return None

    mock_db.report_snapshots.find_one.side_effect = find_one_side_effect

    with pytest.raises(ValueError, match="Snapshots must be from the same collection"):
        await compare_engine.compare_snapshots("snap_a", "snap_b", "user1")

def test_compare_summaries_logic(compare_engine):
    """Test logic for summary comparison"""
    summary_a = {
        "count": 100,
        "value": 500.0,
        "zero_base": 0,
        "zero_comp": 50,
        "zero_both": 0,
        "string_diff": "old",
        "string_same": "same"
    }
    summary_b = {
        "count": 80,
        "value": 500.0,
        "zero_base": 10,
        "zero_comp": 0,
        "zero_both": 0,
        "string_diff": "new",
        "string_same": "same"
    }

    diff = compare_engine._compare_summaries(summary_a, summary_b)

    # Numeric down
    assert diff["count"]["absolute_diff"] == -20
    assert diff["count"]["percent_diff"] == -20.0
    assert diff["count"]["trend"] == "down"

    # Numeric stable
    assert diff["value"]["absolute_diff"] == 0.0
    assert diff["value"]["percent_diff"] == 0.0
    assert diff["value"]["trend"] == "stable"

    # Zero base (division by zero protection)
    assert diff["zero_base"]["percent_diff"] == 100.0

    # Zero comp
    assert diff["zero_comp"]["percent_diff"] == -100.0

    # Zero both
    assert diff["zero_both"]["percent_diff"] == 0.0

    # Non-numeric
    assert diff["string_diff"]["changed"] is True
    assert diff["string_same"]["changed"] is False

def test_compare_rows_logic(compare_engine):
    """Test logic for row comparison"""
    rows_a = [
        {"id": 1, "name": "Item 1", "qty": 10},
        {"id": 2, "name": "Item 2", "qty": 20},
    ]
    rows_b = [
        {"id": 1, "name": "Item 1", "qty": 15}, # Changed
        {"id": 3, "name": "Item 3", "qty": 30}, # Added
    ]
    # Item 2 is removed

    group_by = ["id"]

    result = compare_engine._compare_rows(rows_a, rows_b, group_by)

    assert result["added_count"] == 1
    assert result["removed_count"] == 1
    assert result["changed_count"] == 1
    assert result["unchanged_count"] == 0

    assert result["added"][0]["id"] == 3
    assert result["removed"][0]["id"] == 2

    changed_item = result["changed"][0]
    assert changed_item["key"] == "1"
    assert changed_item["diff"]["qty"]["change"] == 5
    assert changed_item["diff"]["qty"]["from"] == 10
    assert changed_item["diff"]["qty"]["to"] == 15

def test_compare_rows_logic_grouped(compare_engine):
    """Test row comparison with composite key grouping"""
    rows_a = [
        {"_id": {"cat": "A", "sub": "1"}, "qty": 10},
        {"_id": {"cat": "A", "sub": "2"}, "qty": 20},
    ]
    rows_b = [
        {"_id": {"cat": "A", "sub": "1"}, "qty": 10}, # Unchanged
        {"_id": {"cat": "A", "sub": "2"}, "qty": 25}, # Changed
    ]

    group_by = ["cat", "sub"]

    result = compare_engine._compare_rows(rows_a, rows_b, group_by)

    assert result["unchanged_count"] == 1
    assert result["changed_count"] == 1

    changed_item = result["changed"][0]
    # key should be "A|2"
    assert changed_item["key"] == "A|2"
    assert changed_item["diff"]["qty"]["change"] == 5

@pytest.mark.asyncio
async def test_get_comparison(compare_engine, mock_db):
    """Test retrieving a comparison job"""
    job_id = "job_1"
    expected_job = {"job_id": job_id, "status": "completed"}

    mock_db.report_compare_jobs.find_one.return_value = expected_job

    result = await compare_engine.get_comparison(job_id)

    assert result == expected_job
    mock_db.report_compare_jobs.find_one.assert_called_with({"job_id": job_id})

@pytest.mark.asyncio
async def test_list_comparisons(compare_engine, mock_db):
    """Test listing comparisons with filters"""
    # Mock cursor chain
    mock_cursor = MagicMock()
    mock_cursor.sort.return_value = mock_cursor
    mock_cursor.limit.return_value = mock_cursor
    mock_cursor.to_list = AsyncMock(return_value=[{"job_id": "1"}, {"job_id": "2"}])

    mock_db.report_compare_jobs.find.return_value = mock_cursor

    # Execute
    result = await compare_engine.list_comparisons(
        created_by="user1",
        limit=20
    )

    # Verify
    assert len(result) == 2
    mock_db.report_compare_jobs.find.assert_called_with(
        {"created_by": "user1"}
    )
    mock_cursor.sort.assert_called_with("created_at", -1)
    mock_cursor.limit.assert_called_with(20)
    mock_cursor.to_list.assert_called_with(length=20)
