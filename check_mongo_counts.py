import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from bson import ObjectId

MONGO_URL = "mongodb://localhost:27017"
DB_NAMES = ["stock_verification", "stock_count"]


async def check_counts():
    client = AsyncIOMotorClient(MONGO_URL)
    found_any = False

    for db_name in DB_NAMES:
        db = client[db_name]
        try:
            count = await db.count_lines.count_documents({})
            if count > 0:
                cursor = db.count_lines.find({}).sort("counted_at", -1).limit(5)
                docs = await cursor.to_list(length=5)

                print(f"\nShowing last 5 records from '{db_name}':")
                for doc in docs:
                    # Convert ObjectId and datetime to string for printing
                    if "_id" in doc and isinstance(doc["_id"], ObjectId):
                        doc["_id"] = str(doc["_id"])
                    if "counted_at" in doc and isinstance(doc["counted_at"], datetime):
                        doc["counted_at"] = doc["counted_at"].isoformat()
                    if "verified_at" in doc and isinstance(doc["verified_at"], datetime):
                        doc["verified_at"] = doc["verified_at"].isoformat()
                    if "approved_at" in doc and isinstance(doc["approved_at"], datetime):
                        doc["approved_at"] = doc["approved_at"].isoformat()
                    if "rejected_at" in doc and isinstance(doc["rejected_at"], datetime):
                        doc["rejected_at"] = doc["rejected_at"].isoformat()

                    print("-" * 40)
                    print(f"Item: {doc.get('item_code')} | User: {doc.get('counted_by')}")
                    print(doc)
                found_any = True
        except Exception as e:
            # Collection might not exist
            pass

    if not found_any:
        print("\nNo count records found in expected databases.")
    client.close()


if __name__ == "__main__":
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(check_counts())
    loop.close()
