"""
Quick script to create a default test session
Run this to fix "Session not found" errors during testing
"""

import asyncio
import sys
from datetime import datetime
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from backend.db.runtime import init_db, get_db


async def create_default_session():
    """Create a default test session"""
    try:
        # Initialize database
        await init_db()
        db = get_db()

        # Check if default session exists
        existing = await db.sessions.find_one({"id": "test-session-001"})

        if existing:
            print("ℹ️  Default test session already exists")
            print(f"   Session ID: {existing['id']}")
            print(f"   Warehouse: {existing['warehouse']}")
            print(f"   Status: {existing['status']}")
            return existing["id"]

        # Create default session
        session = {
            "id": "test-session-001",
            "warehouse": "Test Warehouse",
            "staff_user": "test_user",
            "staff_name": "Test User",
            "type": "STANDARD",
            "status": "OPEN",
            "started_at": datetime.utcnow(),
            "total_items": 0,
            "total_variance": 0,
        }

        await db.sessions.insert_one(session)

        print("✅ Default test session created successfully!")
        print(f"   Session ID: {session['id']}")
        print(f"   Warehouse: {session['warehouse']}")
        print(f"   Status: {session['status']}")
        print("\n📝 Use this session ID in your frontend or API calls")

        return session["id"]

    except Exception as e:
        print(f"❌ Error creating default session: {e}")
        raise


async def create_multiple_test_sessions():
    """Create multiple test sessions for different scenarios"""
    try:
        await init_db()
        db = get_db()

        sessions = [
            {
                "id": "showroom-floor1-001",
                "warehouse": "Main Showroom",
                "staff_user": "staff1",
                "staff_name": "Staff User 1",
                "type": "STANDARD",
                "status": "OPEN",
                "started_at": datetime.utcnow(),
            },
            {
                "id": "godown-main-001",
                "warehouse": "Main Godown",
                "staff_user": "staff2",
                "staff_name": "Staff User 2",
                "type": "STANDARD",
                "status": "OPEN",
                "started_at": datetime.utcnow(),
            },
        ]

        created = 0
        for session in sessions:
            existing = await db.sessions.find_one({"id": session["id"]})
            if not existing:
                await db.sessions.insert_one(session)
                print(f"✅ Created session: {session['id']}")
                created += 1
            else:
                print(f"ℹ️  Session already exists: {session['id']}")

        print(f"\n📊 Total sessions created: {created}")

    except Exception as e:
        print(f"❌ Error: {e}")
        raise


if __name__ == "__main__":
    print("🚀 Creating default test session...\n")
    asyncio.run(create_default_session())

    print("\n" + "=" * 50)
    print("Would you like to create additional test sessions? (y/n)")
    # For automation, just create the default one
    # Uncomment below to create multiple:
    # asyncio.run(create_multiple_test_sessions())
