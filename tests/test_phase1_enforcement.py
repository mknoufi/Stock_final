import requests
import json
import time

BASE_URL = "http://localhost:8002"


def test_single_session_enforcement():
    print("Starting Phase 1 Verification Test...")

    # 1. Login with admin (assumed credentials admin/admin123 or similar)
    # We'll use a known user or create one if needed, but assuming 'admin' exists.
    login_payload = {"username": "supervisor", "password": "super123"}

    print(f"1. Attempting first login for {login_payload['username']}...")
    resp1 = requests.post(f"{BASE_URL}/api/auth/login", json=login_payload)
    if resp1.status_code != 200:
        print(f"FAILED: Initial login failed with {resp1.status_code}: {resp1.text}")
        return

    data1 = resp1.json()
    token1 = data1["data"]["access_token"]
    print("SUCCESS: First login successful.")

    # 2. Attempt second login for the same user
    print("2. Attempting second login (should fail with conflict)...")
    resp2 = requests.post(f"{BASE_URL}/api/auth/login", json=login_payload)

    if resp2.status_code == 401:
        data2 = resp2.json()
        if data2.get("error") == "AUTH_SESSION_CONFLICT":
            print("SUCCESS: Second login blocked with AUTH_SESSION_CONFLICT.")
        else:
            print(f"FAILED: Got 401 but error code mismatch: {data2}")
    else:
        print(f"FAILED: Second login returned {resp2.status_code}, expected 401.")

    # 3. Call logout-all using token1
    print("3. Calling /api/sessions/logout-all using first token...")
    headers = {"Authorization": f"Bearer {token1}"}
    resp3 = requests.post(f"{BASE_URL}/api/sessions/logout-all", headers=headers)

    if resp3.status_code == 200:
        print("SUCCESS: logout-all completed.")
    else:
        print(f"FAILED: logout-all failed with {resp3.status_code}: {resp3.text}")

    # 4. Attempt login again (should succeed now)
    print("4. Attempting login again after logout-all...")
    resp4 = requests.post(f"{BASE_URL}/api/auth/login", json=login_payload)
    if resp4.status_code == 200:
        print("SUCCESS: Second login succeeded after cleanup.")
    else:
        print(f"FAILED: Login after cleanup failed with {resp4.status_code}: {resp4.text}")


if __name__ == "__main__":
    test_single_session_enforcement()
