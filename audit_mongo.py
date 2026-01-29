import asyncio
import os
import json
from motor.motor_asyncio import AsyncIOMotorClient
from bson import json_util


async def audit_mongo():
    mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(mongo_url)
    db = client.stock_verification

    collections = await db.list_collection_names()
    inventory = {"collections": collections, "schemas": {}}

    for coll in collections:
        sample = await db[coll].find_one()
        if sample:
            # Mask sensitive data in sample
            sample_clean = json.loads(json_util.dumps(sample))
            inventory["schemas"][coll] = sample_clean

    print(json.dumps(inventory, indent=2))
    client.close()


if __name__ == "__main__":
    asyncio.run(audit_mongo())
