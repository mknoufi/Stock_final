import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient


async def run():
    mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(mongo_url)
    db = client.stock_verification
    user = await db.users.find_one()
    if user:
        print(f"USER_FOUND: {user['username']}")
    else:
        print("NO_USER_FOUND")
    client.close()


if __name__ == "__main__":
    asyncio.run(run())
