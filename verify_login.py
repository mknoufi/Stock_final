import requests
import json
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
            # print(response.json())
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
