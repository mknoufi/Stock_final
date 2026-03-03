import asyncio
import logging
import sys
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient

# Add project root to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from backend.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_data():
    try:
        logger.info(f"Connecting to MongoDB at {settings.MONGO_URL}...")
        client = AsyncIOMotorClient(settings.MONGO_URL)
        db = client[settings.DB_NAME]

        # Check connection
        await db.command("ping")
        logger.info("Connected to MongoDB")

        # 1. Seed Items (ERP Items)
        count = await db.erp_items.count_documents({})
        logger.info(f"Existing items count: {count}")

        if count == 0:
            mock_items = [
                {
                    "item_code": "ITEM001",
                    "item_name": "Rice Bag 25kg",
                    "barcode": "1234567890123",
                    "stock_qty": 150.0,
                    "mrp": 1200.0,
                    "category": "Food",
                    "warehouse": "Main",
                },
                {
                    "item_code": "ITEM002",
                    "item_name": "Cooking Oil 5L",
                    "barcode": "1234567890124",
                    "stock_qty": 80.0,
                    "mrp": 650.0,
                    "category": "Food",
                    "warehouse": "Main",
                },
                {
                    "item_code": "ITEM_TEST",
                    "item_name": "Test Item for Search",
                    "barcode": "523652",
                    "stock_qty": 100.0,
                    "mrp": 99.0,
                    "category": "Test",
                    "warehouse": "Main",
                },
                {
                    "item_code": "ITEM_SAMSUNG",
                    "item_name": "Samsung Galaxy S24",
                    "barcode": "8806090973321",
                    "stock_qty": 50.0,
                    "mrp": 79999.0,
                    "category": "Electronics",
                    "warehouse": "Electronics",
                },
            ]
            result = await db.erp_items.insert_many(mock_items)
            logger.info(f"Inserted {len(result.inserted_ids)} items into erp_items")

            # Create text index for search
            await db.erp_items.create_index(
                [("item_name", "text"), ("item_code", "text"), ("barcode", "text")]
            )
            logger.info("Created text index on erp_items")
        else:
            logger.info("Items already exist, skipping seed.")

        # 2. Check Session Persistence
        # We manually create a test session to verify writes work
        test_session = {
            "session_id": "test-persistence-check",
            "warehouse": "Test Warehouse",
            "staff_user": "admin",
            "staff_name": "Administrator",
            "type": "STANDARD",
            "status": "OPEN",
            "created_at": datetime.utcnow(),
        }

        # Upsert to avoid duplicates if run multiple times

        await db.sessions.update_one(
            {"session_id": "test-persistence-check"}, {"$set": test_session}, upsert=True
        )
        logger.info("Upserted test session")

        # Verify read
        saved = await db.sessions.find_one({"session_id": "test-persistence-check"})
        if saved:
            logger.info("✅ Session persistence check passed: Read back successfully")
        else:
            logger.error("❌ Session persistence check failed: Could not read back session")

    except Exception as e:
        logger.error(f"Error during seeding: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(seed_data())
