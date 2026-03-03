import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def clear_refresh_tokens():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.stock_verify
    
    # Check active refresh tokens for staff1
    tokens = await db.refresh_tokens.find({'username': 'staff1'}).to_list(None)
    print(f'Active refresh tokens for staff1: {len(tokens)}')
    for t in tokens:
        print(f'  Token ID: {t.get("_id")}, Expires: {t.get("expires_at")}, Revoked: {t.get("revoked")}')
    
    # Clear all refresh tokens for staff1
    result = await db.refresh_tokens.delete_many({'username': 'staff1'})
    print(f'Deleted {result.deleted_count} refresh tokens')
    
    client.close()

if __name__ == "__main__":
    asyncio.run(clear_refresh_tokens())
