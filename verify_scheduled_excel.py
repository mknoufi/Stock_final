import requests
import sys
import time

LOGIN_URL = "http://localhost:8005/api/auth/login"
SCHEDULE_URL = "http://localhost:8005/api/exports/schedules"


def test_scheduled_excel_export():
    print("1. Logging in as admin...")
    try:
        # Retry login a few times as server might be starting
        for i in range(10):
            try:
                login_resp = requests.post(
                    LOGIN_URL, json={"username": "admin", "password": "admin123"}, timeout=5
                )
                if login_resp.status_code == 200:
                    break
            except requests.exceptions.ConnectionError:
                pass
            print(f"Waiting for server... ({i + 1}/10)")
            time.sleep(2)
        else:
            print("Server not available.")
            return False

        token = login_resp.json()["data"]["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("Login successful.")

        # DEBUG: Check user permissions
        print("Checking user permissions...")
        me_resp = requests.get("http://localhost:8005/api/auth/me", headers=headers)
        if me_resp.status_code == 200:
            user_data = me_resp.json()
            # /api/auth/me response structure: { "username": ..., "permissions": ... } directly
            print(f"User Role: {user_data.get('role')}")
            print(f"User Permissions: {user_data.get('permissions')}")
        else:
            print(f"Failed to get user info: {me_resp.status_code} - {me_resp.text}")

        # 2. Create Excel Schedule
        print("2. Creating Excel Export Schedule...")
        payload = {
            "name": "Integration Test Excel",
            "export_type": "sessions",
            "frequency": "daily",
            "format": "excel",  # This is the key value we added
        }

        resp = requests.post(SCHEDULE_URL, json=payload, headers=headers, timeout=10)

        if resp.status_code == 200:
            print(
                f"SUCCESS: Schedule created with ID: {resp.json().get('data', {}).get('schedule_id')}"
            )
            return True
        elif resp.status_code == 422:
            print(f"FAILURE: Validation Error. API likely rejected 'excel' format. {resp.text}")
            return False
        else:
            print(f"FAILURE: {resp.status_code} - {resp.text}")
            return False

    except Exception as e:
        print(f"Error: {e}")
        return False


if __name__ == "__main__":
    if test_scheduled_excel_export():
        sys.exit(0)
    else:
        sys.exit(1)
