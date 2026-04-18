import asyncio
from unittest.mock import AsyncMock

async def validate_record_optimized(record, db):
    if record["serial_numbers"]:
        # Find all serials in one query
        cursor = AsyncMock()
        cursor.to_list = AsyncMock(return_value=[{"serial_number": "SERIAL_1", "client_record_id": "other_client"}])
        db.item_serials.find.return_value = cursor

        existing_serials = await cursor.to_list(length=None)

        # Build map
        existing_map = {s["serial_number"]: s for s in existing_serials}

        for serial in record["serial_numbers"]:
            existing = existing_map.get(serial)
            if existing and existing.get("client_record_id") != record["client_record_id"]:
                return "Conflict"
    return None

async def test():
    db = AsyncMock()
    record = {
        "client_record_id": "client_1",
        "serial_numbers": ["SERIAL_1", "SERIAL_2", "SERIAL_3", "SERIAL_4", "SERIAL_5"]
    }

    db.item_serials.find = AsyncMock()
    print(await validate_record_optimized(record, db))

    # Check calls
    print("Find calls:", db.item_serials.find.call_count)

asyncio.run(test())
