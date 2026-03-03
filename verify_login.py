import requests
import sys

BASE_URL = "http://localhost:8001/api/auth/login"

users = [
    {"username": "admin", "password": "admin123"},
    {"username": "supervisor", "password": "super123"},
]

print(f"Checking login at {BASE_URL}...")

all_passed = True

for user in users:
    try:
        response = requests.post(BASE_URL, json=user)
        if response.status_code == 200:
            print(f"[PASS] Login successful for user '{user['username']}'")

            # Extract token and verify it works
            data = response.json()
            token = data.get("data", {}).get("access_token")

            if token:
                print(f"      Token obtained: {token[:10]}...")
                headers = {"Authorization": f"Bearer {token}"}
                heartbeat_url = "http://localhost:8001/api/auth/heartbeat"

                hb_response = requests.get(heartbeat_url, headers=headers)
                if hb_response.status_code == 200:
                    print("      [PASS] Protected endpoint (heartbeat) accessible")
                else:
                    print(
                        f"      [FAIL] Protected endpoint rejected with {hb_response.status_code}"
                    )
                    print(f"      Response: {hb_response.text}")
                    all_passed = False

                # Test Refresh Token Flow
                refresh_token = data.get("data", {}).get("refresh_token")
                if refresh_token:
                    print(f"      Testing Refresh Token: {refresh_token[:10]}...")
                    refresh_url = "http://localhost:8001/api/auth/refresh"
                    ref_response = requests.post(refresh_url, json={"refresh_token": refresh_token})

                    if ref_response.status_code == 200:
                        print("      [PASS] Refresh token flow successful")
                        new_token = ref_response.json().get("data", {}).get("access_token")
                        if new_token:
                            print("      [PASS] New access token obtained")
                        else:
                            print("      [FAIL] No access token in refresh response")
                            all_passed = False
                    else:
                        print(
                            f"      [FAIL] Refresh token rejected with {ref_response.status_code}"
                        )
                        print(f"      Response: {ref_response.text}")
                        all_passed = False
                else:
                    print("      [FAIL] No refresh token returned in login")
            else:
                print("      [FAIL] No access_token in response")
                all_passed = False
        else:
            print(
                f"[FAIL] Login failed for user '{user['username']}' with status {response.status_code}"
            )
            print(response.text)
            all_passed = False
    except Exception as e:
        print(f"[ERROR] Connection failed for user '{user['username']}': {e}")
        all_passed = False

if all_passed:
    print("\nVERIFICATION SUCCESSFUL: Both Admin and Supervisor credentials are valid.")
    sys.exit(0)
else:
    print("\nVERIFICATION FAILED: One or more logins failed.")
    sys.exit(1)
