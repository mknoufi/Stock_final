import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_item_batches_offline_fallback(
    async_client: AsyncClient, authenticated_headers, test_db
):
    """
    Test that /api/item-batches falls back to MongoDB when SQL is offline.
    """
    item_code = "TEST001"

    # 1. Insert mock items using the test_db fixture
    await test_db.erp_items.delete_many({"item_code": item_code})

    await test_db.erp_items.insert_many(
        [
            {
                "item_code": item_code,
                "barcode": "510001",
                "item_name": "Test Item Batch 1",
                "batch_no": "B1",
                "stock_qty": 10,
                "mrp": 100,
                "warehouse": "WH1",
            },
            {
                "item_code": item_code,
                "barcode": "510002",
                "item_name": "Test Item Batch 2",
                "batch_no": "B2",
                "stock_qty": 5,
                "mrp": 100,
                "warehouse": "WH1",
            },
        ]
    )

    # 2. Call the endpoint
    response = await async_client.get(
        f"/api/item-batches/{item_code}", headers=authenticated_headers
    )

    # 3. Verify response
    assert response.status_code == 200, f"Response: {response.text}"
    data = response.json()

    assert "batches" in data
    assert len(data["batches"]) == 2
    assert data["source"] == "mongodb_offline_fallback"

    barcodes = sorted([b["barcode"] for b in data["batches"]])
    assert barcodes == ["510001", "510002"]


@pytest.mark.asyncio
async def test_get_item_batches_empty(async_client: AsyncClient, authenticated_headers):
    response = await async_client.get(
        "/api/item-batches/NONEXISTENT", headers=authenticated_headers
    )
    assert response.status_code == 200
    assert response.json()["batches"] == []
