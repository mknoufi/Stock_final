import asyncio
from backend.core.database import db


async def check_items():
    items = await db.erp_items.find({}).limit(3).to_list(None)
    print('Found items:', len(items))
    for item in items:
        item_name = item.get('item_name')
        item_code = item.get('item_code')
        barcode = item.get('barcode')
        print(f"Item: {item_name}, Code: {item_code}, Barcode: {barcode}")


if __name__ == "__main__":
    asyncio.run(check_items())
