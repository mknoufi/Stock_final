import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient


async def run():
    mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(mongo_url)
    db = client.stock_verification

    username = "supervisor"

    # Delete from sessions and refresh_tokens
    res1 = await db.security_sessions.delete_many({"username": username})
    res2 = await db.refresh_tokens.delete_many({"username": username})

    print(
        f"CLEANUP_SUCCESS: Deleted {res1.deleted_count} sessions and {res2.deleted_count} refresh tokens."
    )
    client.close()


if __name__ == "__main__":
    asyncio.run(run())
