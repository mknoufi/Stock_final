import asyncio
import sys
sys.path.insert(0, '.')
from backend.database import get_database

async def check_items():
    try:
        db = get_database()
        count = await db.erp_items.count_documents({})
        print(f'Total items in database: {count}')
        
        if count > 0:
            items = await db.erp_items.find({}).limit(5).to_list(None)
            print('Sample items:')
            for item in items:
                name = item.get('item_name', 'N/A')
                code = item.get('item_code', 'N/A')
                barcode = item.get('barcode', 'N/A')
                print(f'  - {name} (Code: {code}, Barcode: {barcode})')
        else:
            print('No items found in database')
            
    except Exception as e:
        print(f'Error: {e}')

if __name__ == "__main__":
    asyncio.run(check_items())