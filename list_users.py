import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys

# Default to stock_verification, but check stock_count if empty
DB_NAMES = ["stock_verification", "stock_count"]
MONGO_URL = "mongodb://localhost:27017"


async def list_users():
    print(f"Connecting to MongoDB at {MONGO_URL}...")
    try:
        client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=2000)
        # Force connection verification
        await client.server_info()
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        return

    found_any = False

    for db_name in DB_NAMES:
        db = client[db_name]
        try:
            users_coll = db.users
            count = await users_coll.count_documents({})

            if count > 0:
                print(f"\n=== Database: '{db_name}' ({count} users) ===")
                cursor = users_coll.find({})
                users = await cursor.to_list(length=1000)

                # Header
                print(f"{'Username':<15} | {'Role':<10} | {'PIN':<8} | {'Password'}")
                print("-" * 80)

                for user in users:
                    username = user.get("username", "N/A")
                    role = user.get("role", "N/A")

                    # PIN Handling
                    pin_hash = user.get("pin_hash")
                    pin_display = "SET" if pin_hash else "NONE"

                    # Password Handling
                    pwd_hash = user.get("hashed_password")
                    # If it's the specific test password hash for 'staff123', we might identify it,
                    # but showing the hash prefix is standard.
                    pwd_display = (pwd_hash[:15] + "...") if pwd_hash else "NONE"

                    print(f"{username:<15} | {role:<10} | {pin_display:<8} | {pwd_display}")
                found_any = True
        except Exception as e:
            print(f"Error reading database {db_name}: {e}")

    if not found_any:
        print("\nNo users found in standard databases ('stock_verification', 'stock_count').")

    client.close()


if __name__ == "__main__":
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(list_users())
    loop.close()
