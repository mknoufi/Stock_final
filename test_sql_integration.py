"""Test barcode and search APIs with real SQL Server data"""

import requests

BASE_URL = "http://localhost:8001"


def login():
    """Login and get token"""
    response = requests.post(
        f"{BASE_URL}/api/auth/login", json={"username": "admin", "password": "admin123"}
    )
    if response.status_code == 200:
        data = response.json()
        token = data.get("access_token") or data.get("data", {}).get("access_token")
        print("Login successful!")
        return token
    else:
        print(f"Login failed: {response.status_code}")
        return None


def test_search(token, query):
    """Test search API"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(
        f"{BASE_URL}/api/items/search/optimized", params={"q": query}, headers=headers
    )
    print(f"\nSearch '{query}': {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        items = data.get("items", data.get("data", {}).get("items", []))
        print(f"  Found {len(items)} items")
        for item in items[:3]:
            print(f"  - {item.get('item_name', 'N/A')[:40]}: {item.get('barcode', 'N/A')}")
    else:
        print(f"  Error: {response.text[:200]}")


def test_barcode(token, barcode):
    """Test barcode lookup API"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(
        f"{BASE_URL}/api/v2/erp/items/barcode/{barcode}/enhanced", headers=headers
    )
    print(f"\nBarcode '{barcode}': {response.status_code}")
    if response.status_code == 200:
        data = response.json().get("data", response.json())
        print(f"  Name: {data.get('item_name', 'N/A')}")
        print(f"  Stock: {data.get('stock_qty', 'N/A')}")
        print(f"  Location: {data.get('location', 'N/A')}")
    else:
        print(f"  Error: {response.text[:200]}")


if __name__ == "__main__":
    print("Testing SQL Server Integration")
    print("=" * 50)

    token = login()
    if not token:
        exit(1)

    # Test search
    test_search(token, "CHAPATHI")
    test_search(token, "RICE")

    # Test barcode (use real barcodes from SQL Server)
    test_barcode(token, "510001")
    test_barcode(token, "510005")

    print("\n" + "=" * 50)
    print("Tests complete!")
