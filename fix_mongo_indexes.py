"""
Fix MongoDB Index Conflicts
Drops and recreates conflicting indexes for stability
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/stock_verification")


async def fix_indexes():
    """Fix conflicting MongoDB indexes"""
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.stock_verification
    
    # List of indexes to fix (drop then let app recreate)
    indexes_to_fix = [
        ("erp_items", "idx_item_code"),
        ("erp_items", "idx_category"),
        ("refresh_tokens", "token_hash_1"),
    ]
    
    for collection_name, index_name in indexes_to_fix:
        try:
            collection = db[collection_name]
            await collection.drop_index(index_name)
            print(f"✓ Dropped index '{index_name}' on {collection_name}")
        except Exception as e:
            if "not found" in str(e).lower() or "IndexNotFound" in str(e):
                print(f"- Index '{index_name}' on {collection_name} doesn't exist (OK)")
            else:
                print(f"✗ Error dropping '{index_name}' on {collection_name}: {e}")
    
    print("\nDone! Indexes will be recreated when backend restarts.")
    client.close()


if __name__ == "__main__":
    asyncio.run(fix_indexes())
