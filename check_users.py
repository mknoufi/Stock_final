import asyncio
from backend.core.lifespan import db
from backend.utils.auth_utils import get_password_hash
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def check_users():
    try:
        users = await db.users.find({}).to_list(None)
        if not users:
            print("No users found in database.")
            # Create default user
            logger.info("Creating default admin user...")
            await db.users.insert_one(
                {
                    "username": "admin",
                    "hashed_password": get_password_hash("admin123"),
                    "full_name": "Administrator",
                    "role": "admin",
                    "is_active": True,
                    "permissions": [],
                    "created_at": datetime.utcnow(),
                }
            )
            print("Created user: admin / admin123")
        else:
            print(f"Found {len(users)} users:")
            for user in users:
                print(f"- {user.get('username')} (Role: {user.get('role')})")

            # Check if passwords work for admin
            admin = next((u for u in users if u["username"] == "admin"), None)
            if admin:
                # We can't verify hash easily without importing verify_password but we can reset it if needed
                print("Admin user exists.")

    except Exception as e:
        print(f"Error accessing database: {e}")


if __name__ == "__main__":
    asyncio.run(check_users())
