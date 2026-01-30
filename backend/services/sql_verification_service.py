"""
SQL Verification Service - Verifies item quantities from SQL Server
Implements business logic requirement: Item selection triggers SQL qty read + Mongo writeback
"""

import logging
from datetime import datetime
from typing import Dict, Any

from backend.sql_server_connector import SQLServerConnector
from backend.core.database import db

logger = logging.getLogger(__name__)


class SQLVerificationService:
    """Service for verifying item quantities against SQL Server"""

    def __init__(self):
        self.sql_connector = SQLServerConnector()

    async def verify_item_quantity(self, item_code: str) -> Dict[str, Any]:
        """
        Verify item quantity by comparing SQL Server with MongoDB

        Updates MongoDB with verification fields:
        - sql_verified_qty: Quantity from SQL Server
        - last_sql_verified_at: Timestamp of verification
        - variance: Difference between SQL and MongoDB quantities
        - mongo_cached_qty_previous: Previous MongoDB quantity
        - sql_qty_mismatch_flag: True if quantities don't match
        """
        try:
            # Get quantity from SQL Server
            sql_qty = await self._get_sql_quantity(item_code)

            # Get current MongoDB item
            mongo_item = await db.items.find_one({"item_code": item_code})
            if not mongo_item:
                logger.warning(f"Item {item_code} not found in MongoDB")
                return {
                    "success": False,
                    "error": "Item not found in MongoDB",
                    "item_code": item_code,
                }

            mongo_qty = mongo_item.get("stock_qty", 0)

            # Calculate variance
            variance = sql_qty - mongo_qty

            # Update MongoDB with verification data
            update_data = {
                "sql_verified_qty": sql_qty,
                "last_sql_verified_at": datetime.utcnow(),
                "variance": variance,
                "mongo_cached_qty_previous": mongo_qty,
                "sql_qty_mismatch_flag": variance != 0,
                "sql_verification_status": "verified",
            }

            result = await db.items.update_one({"item_code": item_code}, {"$set": update_data})

            if result.modified_count == 0:
                logger.warning(f"No document updated for item {item_code}")

            logger.info(
                f"Verified item {item_code}: SQL={sql_qty}, Mongo={mongo_qty}, Variance={variance}"
            )

            return {
                "success": True,
                "item_code": item_code,
                "sql_qty": sql_qty,
                "mongo_qty": mongo_qty,
                "variance": variance,
                "verified_at": datetime.utcnow(),
                "mismatch": variance != 0,
            }

        except Exception as e:
            logger.error(f"Error verifying item {item_code}: {str(e)}")
            return {"success": False, "error": str(e), "item_code": item_code}

    async def _get_sql_quantity(self, item_code: str) -> float:
        """Get item quantity from SQL Server"""
        try:
            # Use SQL connector to get quantity
            query = self.sql_connector._build_query("get_item_quantity", barcode=item_code)
            result = await self.sql_connector.execute_query(query)

            if not result:
                logger.warning(f"No SQL result for item {item_code}")
                return 0.0

            # Extract quantity from result (adjust based on actual SQL schema)
            if isinstance(result, list) and len(result) > 0:
                # Assuming result is a list of dicts with quantity field
                quantity = result[0].get("quantity", 0) or result[0].get("stock_qty", 0)
                return float(quantity)

            return 0.0

        except Exception as e:
            logger.error(f"Error getting SQL quantity for {item_code}: {str(e)}")
            raise

    async def batch_verify_items(self, item_codes: list[str]) -> Dict[str, Any]:
        """Verify multiple items in batch"""
        results = []
        errors = []

        for item_code in item_codes:
            result = await self.verify_item_quantity(item_code)
            if result["success"]:
                results.append(result)
            else:
                errors.append(result)

        return {
            "success": len(errors) == 0,
            "verified_count": len(results),
            "error_count": len(errors),
            "results": results,
            "errors": errors,
        }

    async def get_verification_status(self, item_code: str) -> Dict[str, Any]:
        """Get verification status for an item"""
        try:
            item = await db.items.find_one(
                {"item_code": item_code},
                {
                    "sql_verified_qty": 1,
                    "last_sql_verified_at": 1,
                    "variance": 1,
                    "mongo_cached_qty_previous": 1,
                    "sql_qty_mismatch_flag": 1,
                    "sql_verification_status": 1,
                    "stock_qty": 1,
                },
            )

            if not item:
                return {"success": False, "error": "Item not found", "item_code": item_code}

            return {
                "success": True,
                "item_code": item_code,
                "sql_verified_qty": item.get("sql_verified_qty"),
                "last_sql_verified_at": item.get("last_sql_verified_at"),
                "variance": item.get("variance"),
                "mongo_cached_qty_previous": item.get("mongo_cached_qty_previous"),
                "sql_qty_mismatch_flag": item.get("sql_qty_mismatch_flag", False),
                "sql_verification_status": item.get("sql_verification_status"),
                "current_mongo_qty": item.get("stock_qty"),
            }

        except Exception as e:
            logger.error(f"Error getting verification status for {item_code}: {str(e)}")
            return {"success": False, "error": str(e), "item_code": item_code}

    async def check_sql_status(self) -> Dict[str, Any]:
        """Check SQL Server connection status"""
        try:
            # Try a simple query to check connection
            test_query = "SELECT 1 as test"
            await self.sql_connector.execute_query(test_query)

            return {
                "success": True,
                "status": "connected",
                "message": "SQL Server is connected and responding",
                "timestamp": datetime.utcnow(),
            }

        except Exception as e:
            return {
                "success": False,
                "status": "disconnected",
                "message": f"SQL Server connection failed: {str(e)}",
                "timestamp": datetime.utcnow(),
            }


# Singleton instance
sql_verification_service = SQLVerificationService()
