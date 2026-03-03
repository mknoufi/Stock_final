from pymongo import MongoClient

MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "stock_verification"
BARCODE = "510005"
TEST_RACK = "A1"
TEST_FLOOR = "Floor1"


def setup():
    print(f"Connecting to {DB_NAME}...")
    client = MongoClient(MONGO_URL)
    db = client[DB_NAME]

    print(f"Setting item {BARCODE} to location {TEST_FLOOR} / {TEST_RACK}...")
    result = db.erp_items.update_one(
        {"barcode": BARCODE}, {"$set": {"rack": TEST_RACK, "floor": TEST_FLOOR}}
    )

    # Verify
    item = db.erp_items.find_one({"barcode": BARCODE})
    print(f"Item state: Rack={item.get('rack')}, Floor={item.get('floor')}")


if __name__ == "__main__":
    setup()
