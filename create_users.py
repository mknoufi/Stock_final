import requests
import json

BASE_URL = "http://localhost:8001"
USERS = [
    {"username": "staff2", "password": "staff123", "role": "staff", "full_name": "Staff User 2"},
    {"username": "staff3", "password": "staff123", "role": "staff", "full_name": "Staff User 3"},
    {"username": "staff4", "password": "staff123", "role": "staff", "full_name": "Staff User 4"},
]


def create_users():
    print(f"Creating {len(USERS)} test users at {BASE_URL}...")

    for user in USERS:
        try:
            # Register endpoint
            print(f"Attempting to register {user['username']}...")
            response = requests.post(f"{BASE_URL}/api/auth/register", json=user)

            if response.status_code == 201:
                print(f"[SUCCESS] Created user: {user['username']}")
            elif response.status_code == 409:
                print(f"[INFO] User already exists: {user['username']}")
            else:
                print(f"[ERROR] Failed to create {user['username']}")
                print(f"Status: {response.status_code}")
                try:
                    print(f"Response: {json.dumps(response.json(), indent=2)}")
                except:
                    print(f"Response: {response.text}")

        except Exception as e:
            print(f"[EXCEPTION] Could not create {user['username']}: {e}")


if __name__ == "__main__":
    create_users()
