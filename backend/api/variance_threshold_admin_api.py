"""
Admin API for managing variance threshold configurations
"""

import logging
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from backend.api.schemas_variance import VarianceThresholdConfig
from backend.auth.permissions import Permission, require_permission
from backend.db.runtime import get_db

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/admin/variance-thresholds")
async def get_variance_thresholds(
    current_user: dict = require_permission(Permission.SETTINGS_MANAGE),
):
    """
    Get all variance threshold configurations.
    Admin only.
    """
    db = get_db()

    configs = await db.variance_threshold_configs.find({}).to_list(None)

    # Convert ObjectId to string for JSON serialization
    for config in configs:
        config["_id"] = str(config["_id"])

    return {"success": True, "configs": configs, "total": len(configs)}


@router.get("/admin/variance-thresholds/{config_id}")
async def get_variance_threshold(
    config_id: str,
    current_user: dict = require_permission(Permission.SETTINGS_MANAGE),
):
    """Get a specific variance threshold configuration"""
    db = get_db()

    from bson import ObjectId

    try:
        config = await db.variance_threshold_configs.find_one({"_id": ObjectId(config_id)})
    except Exception:
        # Try by name if not a valid ObjectId
        config = await db.variance_threshold_configs.find_one({"name": config_id})

    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")

    config["_id"] = str(config["_id"])

    return {"success": True, "config": config}


@router.post("/admin/variance-thresholds")
async def create_variance_threshold(
    config_data: VarianceThresholdConfig,
    current_user: dict = require_permission(Permission.SETTINGS_MANAGE),
):
    """
    Create a new variance threshold configuration.
    Admin only.
    """
    db = get_db()

    # Check for duplicate name
    existing = await db.variance_threshold_configs.find_one({"name": config_data.name})
    if existing:
        raise HTTPException(
            status_code=400, detail=f"Configuration with name '{config_data.name}' already exists"
        )

    # Prepare document
    config_dict = config_data.model_dump()
    config_dict["created_at"] = datetime.utcnow()
    config_dict["updated_at"] = datetime.utcnow()
    config_dict["created_by"] = current_user.get("username")

    # Insert
    result = await db.variance_threshold_configs.insert_one(config_dict)

    logger.info(
        f"Created variance threshold config: {config_data.name} by {current_user.get('username')}"
    )

    return {
        "success": True,
        "message": "Configuration created successfully",
        "config_id": str(result.inserted_id),
    }


@router.put("/admin/variance-thresholds/{config_id}")
async def update_variance_threshold(
    config_id: str,
    config_data: VarianceThresholdConfig,
    current_user: dict = require_permission(Permission.SETTINGS_MANAGE),
):
    """
    Update an existing variance threshold configuration.
    Admin only.
    """
    db = get_db()

    from bson import ObjectId

    # Prepare update data
    update_dict = config_data.model_dump(exclude={"created_at"})
    update_dict["updated_at"] = datetime.utcnow()
    update_dict["updated_by"] = current_user.get("username")

    # Update
    try:
        result = await db.variance_threshold_configs.update_one(
            {"_id": ObjectId(config_id)}, {"$set": update_dict}
        )
    except Exception:
        # Try by name if not a valid ObjectId
        result = await db.variance_threshold_configs.update_one(
            {"name": config_id}, {"$set": update_dict}
        )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Configuration not found")

    logger.info(f"Updated variance threshold config: {config_id} by {current_user.get('username')}")

    return {
        "success": True,
        "message": "Configuration updated successfully",
        "modified": result.modified_count > 0,
    }


@router.delete("/admin/variance-thresholds/{config_id}")
async def delete_variance_threshold(
    config_id: str,
    current_user: dict = require_permission(Permission.SETTINGS_MANAGE),
):
    """
    Delete a variance threshold configuration.
    Admin only. Cannot delete the default configuration.
    """
    db = get_db()

    from bson import ObjectId

    # Check if it's the default config
    try:
        config = await db.variance_threshold_configs.find_one({"_id": ObjectId(config_id)})
    except Exception:
        config = await db.variance_threshold_configs.find_one({"name": config_id})

    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")

    if config.get("name") == "Default Variance Thresholds":
        raise HTTPException(status_code=400, detail="Cannot delete the default configuration")

    # Delete
    try:
        delete_result = await db.variance_threshold_configs.delete_one({"_id": config["_id"]})
        if delete_result.deleted_count == 0:
            raise HTTPException(status_code=500, detail="Failed to delete configuration")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting config: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    logger.info(
        f"Deleted variance threshold config: {config.get('name')} by {current_user.get('username')}"
    )

    return {"success": True, "message": "Configuration deleted successfully"}


@router.get("/admin/variance-thresholds/test/{item_code}")
async def test_variance_threshold(
    item_code: str,
    counted_qty: float = Query(..., description="Counted quantity to test"),
    category: Optional[str] = Query(None, description="Item category"),
    location: Optional[str] = Query(None, description="Location"),
    current_user: dict = require_permission(Permission.SETTINGS_MANAGE),
):
    """
    Test variance thresholds for a specific item and quantity.
    Useful for validating threshold configurations.
    """
    db = get_db()

    # Get item
    item = await db.erp_items.find_one({"item_code": item_code})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    # Calculate variance
    from backend.services.variance_service import VarianceService

    variance_service = VarianceService(db)

    unit_price = item.get("last_cost", 0) or item.get("sale_price", 0) or item.get("mrp", 0)

    variance_data = await variance_service.calculate_variance(
        item_code=item_code,
        counted_qty=counted_qty,
        expected_qty=item.get("stock_qty", 0),
        unit_price=unit_price,
        valuation_basis="last_cost",
    )

    # Check thresholds
    requires_approval, violated_thresholds = await variance_service.check_thresholds(
        variance_data, item_category=category or item.get("category"), location=location
    )

    return {
        "success": True,
        "item": {
            "item_code": item_code,
            "item_name": item.get("item_name"),
            "expected_qty": item.get("stock_qty", 0),
            "counted_qty": counted_qty,
        },
        "variance_data": variance_data,
        "requires_approval": requires_approval,
        "violated_thresholds": violated_thresholds,
        "message": (
            f"Supervisor approval required: {len(violated_thresholds)} threshold(s) violated"
            if requires_approval
            else "No thresholds violated - would be auto-approved"
        ),
    }
