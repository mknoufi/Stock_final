from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, Any
from unittest.mock import AsyncMock

class SyncRecord(BaseModel):
    client_record_id: str
    session_id: str
    rack_id: Optional[str] = None
    floor: Optional[str] = None
    item_code: str
    verified_qty: float
    damaged_qty: float = 0
    serial_numbers: list[str] = []

class SyncConflict(BaseModel):
    client_record_id: str
    conflict_type: str
    message: str
    details: dict = {}

async def validate_record(record, db):
    # Check for duplicate serial numbers
    if record.serial_numbers:
        for serial in record.serial_numbers:
            existing = await db.item_serials.find_one({"serial_number": serial})
            if existing and existing.get("client_record_id") != record.client_record_id:
                return SyncConflict(
                    client_record_id=record.client_record_id,
                    conflict_type="duplicate_serial",
                    message=f"Serial number '{serial}' already exists",
                    details={"serial": serial}
                )

async def test():
    db = AsyncMock()
    record = SyncRecord(
        client_record_id="client_1",
        session_id="session_1",
        item_code="ITEM_1",
        verified_qty=5,
        serial_numbers=["SERIAL_1", "SERIAL_2", "SERIAL_3", "SERIAL_4", "SERIAL_5"]
    )

    db.item_serials.find_one = AsyncMock(return_value=None)
    await validate_record(record, db)
    print("find_one calls:", db.item_serials.find_one.call_count)

import asyncio
asyncio.run(test())
