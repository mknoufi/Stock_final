import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def clear_sessions():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.stock_verify
    
    # Check active sessions
    sessions = await db.sessions.find({'username': 'staff1'}).to_list(None)
    print(f'Active sessions for staff1: {len(sessions)}')
    
    # Check user document
    user = await db.users.find_one({'username': 'staff1'})
    if user:
        print(f'User has active_session_id: {bool(user.get("active_session_id"))}')
        print(f'User last_login: {user.get("last_login")}')
    
    # Clear all sessions for staff1
    result = await db.sessions.delete_many({'username': 'staff1'})
    print(f'Deleted {result.deleted_count} sessions')
    
    # Clear user session flags
    await db.users.update_one(
        {'username': 'staff1'},
        {'$unset': {'active_session_id': '', 'last_login': ''}}
    )
    print('Cleared user session flags')
    
    client.close()

if __name__ == "__main__":
    asyncio.run(clear_sessions())
