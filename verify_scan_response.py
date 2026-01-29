import asyncio
import aiohttp
import sys

# Constants
BASE_URL = "http://localhost:8001"
BARCODE = "510005"
USERNAME = "staff2"
PASSWORD = "staff123"


async def test_scan():
    async with aiohttp.ClientSession() as session:
        # 1. Login to get token
        try:
            print(f"Logging in as {USERNAME}...")
            auth_resp = await session.post(
                f"{BASE_URL}/api/auth/login", json={"username": USERNAME, "password": PASSWORD}
            )
            if auth_resp.status != 200:
                print(f"Login failed: {auth_resp.status} - {await auth_resp.text()}")
                return

            token_data = await auth_resp.json()
            access_token = token_data.get("access_token")
            print(f"Login successful. Token: {access_token[:10]}...")

            # 2. Start a dummy session (or find one) to simulator context
            # For now, let's just use empty context first, then with dummy context
            headers = {"Authorization": f"Bearer {access_token}"}

            # Case A: No context
            print(f"\nScanning {BARCODE} without context...")
            resp = await session.get(
                f"{BASE_URL}/api/v2/erp/items/barcode/{BARCODE}/enhanced", headers=headers
            )
            print(f"Response Status: {resp.status}")
            print(f"Response Body: {await resp.text()}")

            # Case B: With Dummy Context
            print(f"\nScanning {BARCODE} with Dummy Context (Rack: A1)...")
            resp = await session.get(
                f"{BASE_URL}/api/v2/erp/items/barcode/{BARCODE}/enhanced",
                headers=headers,
                params={"rack_no": "A1"},
            )
            print(f"Response Status: {resp.status}")
            print(f"Response Body: {await resp.text()}")

        except Exception as e:
            print(f"Error: {e}")


if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_scan())
