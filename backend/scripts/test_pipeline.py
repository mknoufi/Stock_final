import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    client = AsyncIOMotorClient()
    db = client.test_db
    await db.erp_items.drop()
    await db.erp_items.insert_many([
        {"item_code": "A", "stock_qty": 10, "last_cost": 5, "sale_price": 0, "mrp": 0},
        {"item_code": "B", "stock_qty": 5, "last_cost": 0, "sale_price": 10, "mrp": 0},
        {"item_code": "C", "stock_qty": 2, "last_cost": 0, "sale_price": 0, "mrp": 20},
        {"item_code": "D", "stock_qty": 1, "last_cost": 0, "sale_price": 0, "mrp": 0},
    ])

    price_field = "last_cost"
    pipeline = [
        {
            "$group": {
                "_id": None,
                "total_items": { "$sum": 1 },
                "total_stock_qty": { "$sum": "$stock_qty" },
                "total_stock_value": {
                    "$sum": {
                        "$multiply": [
                            { "$ifNull": ["$stock_qty", 0] },
                            {
                                "$cond": [
                                    { "$gt": [{ "$ifNull": [f"${price_field}", 0] }, 0] },
                                    { "$ifNull": [f"${price_field}", 0] },
                                    {
                                        "$cond": [
                                            { "$gt": [{ "$ifNull": ["$sale_price", 0] }, 0] },
                                            { "$ifNull": ["$sale_price", 0] },
                                            { "$ifNull": ["$mrp", 0] }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        }
    ]

    result = await db.erp_items.aggregate(pipeline).to_list(1)
    print("Pipeline result:", result)

    # Expected:
    # A: 10 * 5 = 50
    # B: 5 * 10 = 50
    # C: 2 * 20 = 40
    # D: 1 * 0 = 0
    # Total stock value = 140
    # Total stock qty = 18
    # Total items = 4

if __name__ == "__main__":
    asyncio.run(main())
