
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

async def main():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client['stock_verification']
    
    # Check if config exists
    config = await db.erp_config.find_one({})
    
    if not config:
        print("Creating default erp_config...")
        default_config = {
            "use_sql_server": True,
            "host": "192.168.1.109",
            "port": 1433,
            "database": "E_MART_KITCHEN_CARE",
            "user": "stockapp",
            "password": "your-sql-password", # Still a placeholder, but enables the logic
            "sync_interval": 3600,
            "last_sync": None
        }
        await db.erp_config.insert_one(default_config)
        print("erp_config created.")
    else:
        print(f"erp_config already exists: {config}")
        if not config.get("use_sql_server"):
            print("Updating use_sql_server to True...")
            await db.erp_config.update_one({"_id": config["_id"]}, {"$set": {"use_sql_server": True}})
            print("Updated.")

    if client:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())
