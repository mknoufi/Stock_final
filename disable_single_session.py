import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def disable_single_session():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.stock_verify
    
    # Update config to disable single session
    await db.config.update_one(
        {'key': 'AUTH_SINGLE_SESSION'},
        {'$set': {'value': 'false', 'updated_at': datetime.utcnow()}},
        upsert=True
    )
    print('Disabled single session mode')
    
    client.close()

if __name__ == "__main__":
    asyncio.run(disable_single_session())
