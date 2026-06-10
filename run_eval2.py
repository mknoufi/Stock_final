import asyncio
from backend.api.admin_dashboard_api import calculate_total_stock_value

class MockDB:
    class erp_items:
        @staticmethod
        def aggregate(pipeline):
            class Cursor:
                async def to_list(self, length):
                    return [{"total_value": 123.45}]
            return Cursor()

async def main():
    db = MockDB()
    val = await calculate_total_stock_value(db)
    print(val)

asyncio.run(main())
