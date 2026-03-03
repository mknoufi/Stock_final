import requests
import sys

# Login first to get token
LOGIN_URL = "http://localhost:8002/api/auth/login"
EXPORT_URL = "http://localhost:8002/api/admin/control/reports/generate"
# Note: Using port 8002 as confirmed working in previous steps


def test_excel_export():
    # 1. Login as admin
    print("Logging in as admin...")
    try:
        login_resp = requests.post(
            LOGIN_URL, json={"username": "admin", "password": "admin123"}, timeout=5
        )
        if login_resp.status_code != 200:
            print(f"Login failed: {login_resp.status_code} - {login_resp.text}")
            return False

        token = login_resp.json()["data"]["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("Login successful.")

        # 2. Request Excel Export
        # Report ID 'user_activity' is valid per `get_available_reports` in admin_control_api.py
        params = {"report_id": "user_activity", "format": "excel"}

        print(f"Requesting Excel export from {EXPORT_URL}...")
        resp = requests.post(EXPORT_URL, params=params, headers=headers, timeout=10)

        if resp.status_code == 200:
            content_type = resp.headers.get("Content-Type", "")
            print(f"Export successful. Content-Type: {content_type}")

            # Verify it looks like an Excel file (zip signature PK..)
            if resp.content.startswith(b"PK"):
                print("SUCCESS: Response has valid Excel/Zip signature.")

                # Save it for manual inspection if needed
                with open("test_export.xlsx", "wb") as f:
                    f.write(resp.content)
                print("Saved to test_export.xlsx")
                return True
            else:
                print(
                    f"WARNING: Response does not look like a zip/xlsx file. First bytes: {resp.content[:10]}"
                )
                return False
        else:
            print(f"Export failed: {resp.status_code} - {resp.text}")
            return False

    except Exception as e:
        print(f"Error: {e}")
        return False


if __name__ == "__main__":
    if test_excel_export():
        sys.exit(0)
    else:
        sys.exit(1)
