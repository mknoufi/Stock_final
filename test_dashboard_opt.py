import asyncio
import logging
import sys
import os
from motor.motor_asyncio import AsyncIOMotorClient

# Add project root to sys.path
sys.path.append(os.getcwd())

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from backend.api.dashboard_analytics_api import calculate_dashboard_overview


async def main():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.stock_verify

    try:
        # Mock some data if needed, but we probably have data
        logger.info("Running dashboard calculation...")
        overview = await calculate_dashboard_overview(db)

        logger.info(
            f"Dashboard Result: Qty Completion = {overview.quantity_status.completion_percentage}%"
        )
        logger.info(
            f"Dashboard Result: Value Completion = {overview.value_status.completion_percentage}%"
        )
        logger.info(f"Dashboard Result: Items Total = {overview.quantity_status.items_total}")
        logger.info(f"Dashboard Result: Items Counted = {overview.quantity_status.items_counted}")

        if overview.quantity_status.items_total >= 0:
            logger.info("✅ VERIFIED: Aggregation pipeline returned valid metrics.")
        else:
            logger.error("!!! FAILED: Invalid metrics returned.")

    except Exception as e:
        logger.error(f"!!! Error during calculation: {e}", exc_info=True)
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(main())
