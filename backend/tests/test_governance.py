"""
Verification Script for Audit-Grade Governance.
Tests:
1. Uniqueness Gate (Duplicate Scans)
2. Atomic Locking (Race Conditions)
"""

import sys
import asyncio
import uuid
import logging
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient

# Add project root
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from backend.config import settings
from backend.services.lock_service import LockService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("governance_test")


async def test_uniqueness_gate():
    logger.info("--- Testing Uniqueness Gate ---")

    # Setup
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.DB_NAME]

    # Inject DB into runtime so API can use it
    from backend.db.runtime import set_db, set_client

    set_client(client)
    set_db(db)

    session_id = str(uuid.uuid4())
    item_code = "TEST_GOV_ITEM"
    floor = "F1"
    rack = "R1"

    # Create Session
    # Note: DB has index on session_id, app uses id. We insert both to be safe and satisfy unique constraint.
    await db.sessions.insert_one(
        {"id": session_id, "session_id": session_id, "status": "ACTIVE", "type": "STRICT"}
    )
    await db.erp_items.insert_one(
        {
            "item_code": item_code,
            "stock_qty": 100,
            "mrp": 50,
            "item_name": "Test",
            "barcode": "TEST_BC_" + str(uuid.uuid4())[:8],
        }
    )

    # We need to simulate API calls.
    # Since we can't easily spin up the full FastAPI app with overridden deps in this script without complexity,
    # we will use `httpx` against the RUNNING server if available,
    # OR we mock the API handler calls.
    # Given the complexity of dependencies (LockService injected via lifespan),
    # It is best to use `TestClient` with the app.

    from httpx import AsyncClient
    from backend.server import app
    from backend.auth.dependencies import get_current_user

    # Override Auth
    app.dependency_overrides[get_current_user] = lambda: {
        "username": "tester",
        "role": "supervisor",
    }

    # Ensure LockService is initialized in the app state or global
    # usage in API depends on `_lock_service` global in `count_lines_api`.
    # We need to manually initialize it for this test context if the app lifespan didn't run.
    from backend.api import count_lines_api

    if not count_lines_api._lock_service:
        logger.info("Initializing LockService manually for test...")
        ls = LockService(db)
        await ls.initialize()

        # We assume ActivityLogService is not critical for this test or mock it
        class MockLog:
            async def log_activity(self, *args, **kwargs):
                pass

        count_lines_api.init_count_lines_api(MockLog(), ls)

    async with AsyncClient(app=app, base_url="http://test") as client:
        payload = {
            "session_id": session_id,
            "item_code": item_code,
            "counted_qty": 10,
            "floor_no": floor,
            "rack_no": rack,
            "variance_reason": "TEST_REASON",  # satisfy validation
        }

        # 1. First Scan - Should Succeed
        resp1 = await client.post("/api/count-lines", json=payload)
        if resp1.status_code in [200, 201]:
            logger.info("✓ Scan 1 (New Location) -> Success")
        else:
            logger.error(f"Scan 1 Failed: {resp1.status_code} {resp1.text}")
            return

        # 2. Duplicate Scan (Same Loc) - Should Fail 409
        resp2 = await client.post("/api/count-lines", json=payload)
        if resp2.status_code == 409:
            logger.info("✓ Scan 2 (Duplicate Location) -> Blocked (409)")
            logger.info(f"  Message: {resp2.json()['detail']}")
        else:
            logger.error(f"Scan 2 Logic Incorrect: Got {resp2.status_code} (Expected 409)")

        # 3. Different Location - Should Succeed
        payload["rack_no"] = "R2"
        resp3 = await client.post("/api/count-lines", json=payload)
        if resp3.status_code in [200, 201]:
            logger.info("✓ Scan 3 (Different Rack) -> Success")
        else:
            logger.error(f"Scan 3 Failed: {resp3.status_code}")

        # 4. Misplaced Item Check
        misplaced_item_code = "MISPLACED_TEST_ITEM"
        # Cleanup potential stale data from crashed runs
        await db.erp_items.delete_many({"item_code": misplaced_item_code})

        await db.erp_items.insert_one(
            {
                "item_code": misplaced_item_code,
                "stock_qty": 10,
                "mrp": 100.0,
                "item_name": "Location Test",
                "floor": "F1",
                "rack": "R1",
                "barcode": "MISPLACED_BC_" + str(uuid.uuid4())[:8],
            }
        )

        mp_payload = {
            "session_id": session_id,
            "item_code": misplaced_item_code,
            "counted_qty": 1,
            "floor_no": "F1",
            "rack_no": "R99",  # WRONG RACK
            "variance_reason": "TEST",
        }

        resp4 = await client.post("/api/count-lines", json=mp_payload)
        if resp4.status_code in [200, 201]:
            # Verify flagged
            line = await db.count_lines.find_one(
                {"item_code": misplaced_item_code, "session_id": session_id}
            )
            if (
                line
                and line.get("is_misplaced") is True
                and line.get("approval_status") == "NEEDS_REVIEW"
            ):
                logger.info("✓ Scan 4 (Misplaced Item) -> Flagged Successfully")
            else:
                logger.error(
                    f"Scan 4 Failed Flagging: is_misplaced={line.get('is_misplaced')}, status={line.get('approval_status')}"
                )
        else:
            logger.error(f"Scan 4 API Failed: {resp4.status_code} {resp4.text}")

        await db.erp_items.delete_one({"item_code": misplaced_item_code})
        await db.count_lines.delete_many({"item_code": misplaced_item_code})

    # Cleanup
    await db.sessions.delete_one({"id": session_id})
    await db.erp_items.delete_one({"item_code": item_code})
    await db.count_lines.delete_many({"session_id": session_id})


async def test_race_condition():
    logger.info("\n--- Testing Atomic Race Locking ---")

    # Need to verify that we get 423 Locked when hitting endpoint concurrently.
    # TestClient is synchronous, so we can't truly test race conditions with it easily because it runs app in-thread.
    # However, logic verification: matching keys SHOULD lock.
    # To test this via script without running server is hard.
    # But we can unit test the LockService itself.

    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.DB_NAME]
    ls = LockService(db)
    await ls.initialize()

    key = "TEST_RACE_KEY"
    owner = "tester"

    # 1. Acquire Lock
    logger.info("Acquiring lock...")
    await ls.acquire_lock(key, owner)
    logger.info("✓ Lock acquired")

    # 2. Try Acquire Again (Same Owner) - Should fail or succeed depending on logic.
    # Our impl mimics Redis: if owned by same, maybe allow?
    # Code says: raises ResourceLockedError even if same owner (unless simple check passed).
    # Let's check implementation behavior.
    try:
        await ls.acquire_lock(key, "other_user")
        logger.error("❌ Lock failed to block other user!")
    except Exception as e:
        logger.info(f"✓ Lock correctly blocked other user: {e}")

    # 3. Release
    await ls.release_lock(key, owner)
    logger.info("Lock released")

    # 4. Acquire again
    try:
        await ls.acquire_lock(key, "other_user")
        logger.info("✓ Re-acquired lock successfully")
    except Exception as e:
        logger.error(f"❌ Failed to re-acquire lock: {e}")

    await ls.release_lock(key, "other_user")


if __name__ == "__main__":
    asyncio.run(test_uniqueness_gate())
    asyncio.run(test_race_condition())
