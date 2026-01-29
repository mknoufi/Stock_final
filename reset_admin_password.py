import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

# Config
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "stock_verification"

# Password context
pwd_context = CryptContext(
    schemes=["argon2", "bcrypt"],
    deprecated="auto",
    argon2__memory_cost=65536,
    argon2__time_cost=3,
    argon2__parallelism=4,
)


async def reset_admin():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    # Check current doc
    user = await db.users.find_one({"username": "admin"})
    if user:
        print(f"Current Admin Doc Keys: {list(user.keys())}")
        if "hashed_password" in user:
            print("Found existing 'hashed_password' field.")

    new_hash = pwd_context.hash("admin123")

    # Update hashed_password (and clear legacy password field to be clean)
    result = await db.users.update_one(
        {"username": "admin"},
        {"$set": {"hashed_password": new_hash, "is_active": True}, "$unset": {"password": ""}},
    )

    if result.modified_count > 0:
        print("SUCCESS: Admin 'hashed_password' reset to 'admin123' (legacy 'password' removed).")
    elif result.matched_count > 0:
        print("INFO: Admin password matched current. Updated fields anyway.")
    else:
        print("ERROR: Admin user not found to update.")

    client.close()


if __name__ == "__main__":
    asyncio.run(reset_admin())
