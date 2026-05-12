import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import mongomock
from unittest.mock import patch
import time

async def main():
    db = mongomock.MongoClient().test_db

    # insert 10000 items
    items = [{"item_code": f"ITEM{i}", "name": f"Item {i}", "warehouse": "W1"} for i in range(10000)]
    db.erp_items.insert_many(items)

    # insert 100 count lines with variance
    lines = [{"item_code": f"ITEM{i}", "variance": 1, "counted_qty": 5} for i in range(100)]
    db.count_lines.insert_many(lines)

    start = time.time()
    # Old way
    item_docs = {
        item.get("item_code"): item
        for item in db.erp_items.find({})
        if item.get("item_code")
    }
    lines_cursor = db.count_lines.find({"variance": {"$ne": 0}})
    results = []
    for line in lines_cursor:
        info = item_docs.get(line.get("item_code")) or {}
        results.append(line)
    print("Old way:", time.time() - start)

    start = time.time()
    # New way
    lines = list(db.count_lines.find({"variance": {"$ne": 0}}))
    item_codes = list({line.get("item_code") for line in lines if line.get("item_code")})
    item_docs = {
        item.get("item_code"): item
        for item in db.erp_items.find({"item_code": {"$in": item_codes}})
        if item.get("item_code")
    }
    results2 = []
    for line in lines:
        info = item_docs.get(line.get("item_code")) or {}
        results2.append(line)
    print("New way:", time.time() - start)

if __name__ == "__main__":
    asyncio.run(main())
