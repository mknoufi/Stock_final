import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys

MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "stock_verification"


async def list_items():
    print(f"Connecting to MongoDB at {MONGO_URL}...")
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    # Try erp_items first, then items
    collections = ["erp_items", "items"]

    for coll_name in collections:
        coll = db[coll_name]
        count = await coll.count_documents({})
        if count > 0:
            print(f"\n=== Collection: '{coll_name}' ({count} items) ===")
            cursor = coll.find({}).limit(5)
            items = await cursor.to_list(length=5)

            for item in items:
                code = item.get("item_code", "N/A")
                barcode = item.get("barcode", "N/A")
                name = item.get("item_name", item.get("name", "N/A"))
                print(f"Code: {code} | Barcode: {barcode} | Name: {name}")

            return  # Just need one valid source

    print("No items found in 'erp_items' or 'items'.")
    client.close()


if __name__ == "__main__":
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(list_items())
    loop.close()
