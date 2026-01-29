import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient

# Config
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "stock_verification"


async def grant_permissions():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    # Check admin
    user = await db.users.find_one({"username": "admin"})
    print(f"Current role: {user.get('role')}")
    print(f"Current permissions: {user.get('permissions', [])}")

    # Grant explicit permissions - using correct string values from Permissions enum
    new_permissions = ["export.schedule", "export.all", "export.own"]

    result = await db.users.update_one(
        {"username": "admin"}, {"$addToSet": {"permissions": {"$each": new_permissions}}}
    )

    print(
        f"Updated permissions. Matched: {result.matched_count}, Modified: {result.modified_count}"
    )

    # verify
    updated = await db.users.find_one({"username": "admin"})
    print(f"New permissions: {updated.get('permissions', [])}")

    client.close()


if __name__ == "__main__":
    asyncio.run(grant_permissions())
