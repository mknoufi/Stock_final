import asyncio
import logging
import sys
import os
from motor.motor_asyncio import AsyncIOMotorClient

# Add project root to sys.path
sys.path.append(os.getcwd())

# Setup logging to capture TRACE logs
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s", stream=sys.stdout
)
logger = logging.getLogger(__name__)

from backend.services.count_state_machine import CountLineStateMachine


async def setup_test_data(db):
    """Setup a clean test count line"""
    await db.count_lines.delete_many({"id": "test-flow-123"})
    await db.count_lines.insert_one(
        {"id": "test-flow-123", "status": "draft", "counted_qty": 10, "counted_by": "user1"}
    )
    await db.activity_logs.delete_many({"resource_id": "test-flow-123"})


async def simulate_race_condition(db):
    """Scenario: Two supervisors trying to approve the same line simultaneously"""
    logger.info("\n--- SCENARIO: Race Condition (Concurrent Approvals) ---")
    await setup_test_data(db)
    sm = CountLineStateMachine(db)

    # Move to pending_approval (via submitted auto-transition)
    await sm.transition("test-flow-123", "submitted", "user1", "staff")

    # Check if auto-transition happened
    doc = await db.count_lines.find_one({"id": "test-flow-123"})
    current_status = doc.get("status")
    logger.info(f"Status after SUBMIT: {current_status}")

    if current_status != "pending_approval":
        logger.error("!!! DEFECT: Auto-transition to pending_approval failed!")
        return

    # Concurrent Approvals
    # Task 1 will succeed, Task 2 should fail with ValueError due to state conflict
    task1 = sm.transition("test-flow-123", "approved", "sup1", "supervisor")
    task2 = sm.transition("test-flow-123", "approved", "sup2", "supervisor")

    results = await asyncio.gather(task1, task2, return_exceptions=True)

    successes = [r for r in results if not isinstance(r, Exception)]
    errors = [r for r in results if isinstance(r, Exception)]

    logger.info(f"Successes: {len(successes)}")
    for e in errors:
        logger.info(f"Caught expected error: {e}")

    if len(successes) == 1 and any("State conflict" in str(e) for e in errors):
        logger.info("✅ VERIFIED: Atomic state transition prevented race condition.")
    else:
        logger.error("!!! FAILED: Atomic state transition check failed.")


async def simulate_lifecycle_flow(db):
    """Scenario: Full lifecycle from Draft -> Submitted -> Pending -> Approved"""
    logger.info("\n--- SCENARIO: Full Lifecycle Flow ---")
    await setup_test_data(db)
    sm = CountLineStateMachine(db)

    # 1. Draft -> Submitted (should auto-move to pending_approval)
    result = await sm.transition("test-flow-123", "submitted", "user1", "staff")
    logger.info(f"Transition Draft -> Submitted result status: {result.get('new_state')}")

    doc = await db.count_lines.find_one({"id": "test-flow-123"})
    if doc.get("status") == "pending_approval":
        logger.info("✅ VERIFIED: Auto-transition SUBMITTED -> PENDING_APPROVAL succeeded.")
    else:
        logger.error(f"!!! FAILED: Still in state {doc.get('status')}")
        return

    # 2. Pending_Approval -> Approved
    result = await sm.transition("test-flow-123", "approved", "sup1", "supervisor")
    logger.info(f"Transition Pending_Approval -> Approved result status: {result.get('new_state')}")

    doc = await db.count_lines.find_one({"id": "test-flow-123"})
    if doc.get("status") == "approved":
        logger.info("✅ VERIFIED: Transition PENDING_APPROVAL -> APPROVED succeeded.")
    else:
        logger.error(f"!!! FAILED: Still in state {doc.get('status')}")
        return

    logger.info("✅ VERIFIED: Full lifecycle flow completed successfully.")


async def simulate_stalled_lifecycle(db):
    """Scenario: Submitted item stuck in 'submitted' state"""
    logger.info("\n--- SCENARIO: Stalled Lifecycle (Submitted -> ???) ---")
    await setup_test_data(db)
    sm = CountLineStateMachine(db)

    await sm.transition("test-flow-123", "submitted", "user1", "staff")

    # Check status after transition
    doc = await db.count_lines.find_one({"id": "test-flow-123"})
    logger.info(f"Status after submission: {doc.get('status')}")

    if doc.get("status") == "submitted":
        logger.info("!!! PROOF: Item is stuck in 'submitted'.")
        logger.info(
            "The code defines TRANSITIONS[SUBMITTED][PENDING_APPROVAL] = ['system'], but nothing executes it."
        )


async def main():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.stock_verify

    try:
        await setup_test_data(db)
        # 1. Lifecycle Flow (and Auto-transition)
        await simulate_lifecycle_flow(db)

        # 2. Race Condition
        await simulate_race_condition(db)

    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(main())
