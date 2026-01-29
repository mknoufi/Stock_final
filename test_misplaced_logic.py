import urllib.request
import urllib.parse
import json
import sys
from pymongo import MongoClient

# Config
BACKEND_URL = "http://localhost:8002"
MONGO_URL = "mongodb://localhost:27017"  # Default
DB_NAME = "stock_verification"
BARCODE = "510005"
TEST_RACK = "A1"
SCAN_RACK = "B1"  # Different rack -> Misplaced


def run_test():
    print(f"Connecting to MongoDB: {MONGO_URL}...")
    client = MongoClient(MONGO_URL)
    db = client[DB_NAME]

    # 1. Update item to have a specific rack
    print(f"Putting item {BARCODE} into rack {TEST_RACK}...")
    result = db.erp_items.update_one(
        {"barcode": BARCODE}, {"$set": {"rack": TEST_RACK, "floor": "Floor1"}}
    )
    if result.matched_count == 0:
        print("Error: Item not found in DB!")
        return

    try:
        # 2. Login to get token
        print("Logging in...")
        login_data = json.dumps({"username": "staff2", "password": "staff123"}).encode("utf-8")
        req = urllib.request.Request(
            f"{BACKEND_URL}/api/auth/login",
            data=login_data,
            headers={"Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req) as response:
            resp_json = json.loads(response.read().decode("utf-8"))
            token = resp_json["data"]["access_token"]
            print("Login success.")

        # 3. Scan with DIFFERENT rack
        print(f"Scanning item with rack_no={SCAN_RACK}...")
        scan_url = f"{BACKEND_URL}/api/v2/erp/items/barcode/{BARCODE}/enhanced?rack_no={SCAN_RACK}&force_source=mongodb"
        headers = {"Authorization": f"Bearer {token}"}
        req = urllib.request.Request(scan_url, headers=headers)

        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode("utf-8"))
            item = data.get("item", {})
            is_misplaced = item.get("is_misplaced")
            expected = item.get("expected_location")

            print(f"Response is_misplaced: {is_misplaced}")
            print(f"Response expected_location: {expected}")

            if is_misplaced is True:
                print("SUCCESS: Item correctly identified as misplaced.")
            else:
                print("FAILURE: Item NOT identified as misplaced.")
                print(json.dumps(item, indent=2))

    except Exception as e:
        print(f"Test failed with error: {e}")
        import traceback

        traceback.print_exc()

    finally:
        # 4. Cleanup
        print("Cleaning up DB (removing rack info)...")
        db.erp_items.update_one({"barcode": BARCODE}, {"$set": {"rack": None, "floor": None}})
        print("Done.")


if __name__ == "__main__":
    run_test()
