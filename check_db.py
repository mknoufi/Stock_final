
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_session():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.stock_verification
    
    session_id = "f30b9508-4512-4612-b1fd-18132d5e544b"
    
    print(f"Checking session: {session_id}")
    
    # Check verification_sessions
    v_session = await db.verification_sessions.find_one({"session_id": session_id})
    print(f"verification_sessions: {v_session}")
    
    # Check legacy sessions
    session = await db.sessions.find_one({"session_id": session_id})
    if not session:
        session = await db.sessions.find_one({"id": session_id})
    print(f"sessions: {session}")
    
    # Check all sessions count
    v_count = await db.verification_sessions.count_documents({})
    s_count = await db.sessions.count_documents({})
    print(f"Total verification_sessions: {v_count}")
    print(f"Total sessions: {s_count}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_session())
