"""Check MongoDB items after sync"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient


async def check():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["stock_verification"]

    # Count items
    count = await db.erp_items.count_documents({})
    print(f"Total items in MongoDB: {count}")

    # Count items with barcodes
    with_barcode = await db.erp_items.count_documents({"barcode": {"$exists": True, "$ne": None}})
    print(f"Items with barcodes: {with_barcode}")

    # Get sample with barcode
    sample = await db.erp_items.find_one({"barcode": {"$exists": True, "$ne": None}})
    if sample:
        print(f"\nSample item with barcode:")
        print(f"  Name: {sample.get('item_name', 'N/A')}")
        print(f"  Barcode: {sample.get('barcode', 'N/A')}")
        print(f"  Item Code: {sample.get('item_code', 'N/A')}")
        print(f"  Stock Qty: {sample.get('stock_qty', 'N/A')}")
        print(f"  Location: {sample.get('location', 'N/A')}")
    else:
        print("No items found")

    # Get 5 barcodes for testing
    print("\n5 sample barcodes for testing:")
    async for item in db.erp_items.find({"barcode": {"$exists": True, "$ne": None}}).limit(5):
        print(f"  - {item.get('barcode')}: {item.get('item_name', 'N/A')[:40]}")

    client.close()


if __name__ == "__main__":
    asyncio.run(check())
