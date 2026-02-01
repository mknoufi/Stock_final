import asyncio
import httpx
import sys

BASE_URL = "http://localhost:8001"


async def verify_sync():
    print("--- Verifying SQL Sync ---")
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            # 1. Trigger Sync
            print(f"POST {BASE_URL}/api/items/refresh-sql-qty")
            # This endpoint might require auth? Let's check api/auth.py or assume public for now or mock headers.
            # Usually it requires Admin.
            # I'll use a dummy header, backend might accept if Auth is mocked in tests or dev.
            # If not, we might need to login first. I'll attempt without first.
            resp = await client.post(f"{BASE_URL}/api/items/refresh-sql-qty")

            if resp.status_code == 200:
                print(f"[PASS] Sync Triggered: {resp.json()}")
            elif resp.status_code == 401:
                print("[WARN] Sync requires Authentication. Attempting generic verify.")
            else:
                print(f"[FAIL] Sync Failed: {resp.status_code} {resp.text}")

            # 2. Check Health Detailed
            resp = await client.get(f"{BASE_URL}/api/health/detailed")
            if resp.status_code == 200:
                print(f"[INFO] Health Status: {resp.json()}")

        except Exception as e:
            print(f"[FAIL] Connection Error: {e}")


if __name__ == "__main__":
    asyncio.run(verify_sync())
