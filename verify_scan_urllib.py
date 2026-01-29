import urllib.request
import urllib.parse
import json
import sys
import traceback

BASE_URL = "http://localhost:8002"
USERNAME = "staff2"
PASSWORD = "staff123"
BARCODE = "510005"
LOG_FILE = "debug_log.txt"


def log(msg):
    with open(LOG_FILE, "a") as f:
        f.write(str(msg) + "\n")


def get_token():
    log("Attempting login...")
    url = f"{BASE_URL}/api/auth/login"
    data = json.dumps({"username": USERNAME, "password": PASSWORD}).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})

    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                body = response.read().decode("utf-8")
                log(f"Login success. Resp Body: {body}")
                resp_json = json.loads(body)
                # handle both direct return and nested data return
                if "data" in resp_json and isinstance(resp_json["data"], dict):
                    token = resp_json["data"].get("access_token")
                else:
                    token = resp_json.get("access_token")

                log(f"Extracted Token: {str(token)[:10]}...")
                return token
            else:
                log(f"Login Failed: {response.status}")
                return None
    except Exception as e:
        log(f"Login Exception: {e}")
        if hasattr(e, "read"):
            try:
                log(f"Error Body: {e.read().decode('utf-8')}")
            except:
                pass
        return None


def scan_item(token):
    log("Scanning item...")
    # Test with just session_id query param structure (even if empty context)
    url = f"{BASE_URL}/api/v2/erp/items/barcode/{BARCODE}/enhanced?rack_no=A1"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})

    try:
        with urllib.request.urlopen(req) as response:
            body = response.read().decode("utf-8")
            log(f"Status: {response.status}")
            log(f"Response: {body}")
    except urllib.error.HTTPError as e:
        log(f"HTTP Error: {e.code}")
        log(f"Response: {e.read().decode('utf-8')}")
    except Exception as e:
        log(f"Scan Error: {e}")


if __name__ == "__main__":
    with open(LOG_FILE, "w") as f:
        f.write("Starting test...\n")
    token = get_token()
    if token:
        scan_item(token)
    else:
        log("Skipping scan due to login failure.")
