
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client['stock_verification']
    collections = await db.list_collection_names()
    print(f"Collections: {collections}")
    
    if 'erp_config' in collections:
        config = await db.erp_config.find_one({})
        print(f"ERP Config: {config}")
    else:
        print("erp_config collection missing")
        
    if 'erp_items' in collections:
        count = await db.erp_items.count_documents({})
        print(f"ERP Items count: {count}")
    else:
        print("erp_items collection missing")
        
    if client:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())
