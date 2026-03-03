import requests
import sys

BASE_URL = "http://localhost:8001/api/v1/auth/login"  # Check port 8001 or 8002? Backend output said 8002 in previous turns but .env says 8001. Trying both.


def test_login(username, password, port):
    url = f"http://localhost:{port}/api/auth/login"
    try:
        # Use json= to send JSON payload (Content-Type: application/json)
        response = requests.post(url, json={"username": username, "password": password}, timeout=5)
        if response.status_code == 200:
            print(f"SUCCESS: Login successful on port {port}")
            print(f"Response: {response.text[:100]}...")
            return True
        else:
            print(f"Failed on port {port}: {response.status_code} - {response.text[:200]}")
            return False
    except Exception as e:
        print(f"Error connecting to port {port}: {e}")
        return False


def main():
    username = "admin"
    password = "admin123"
    print(f"Testing login for user: {username}")

    # Try Port 8001 first (from .env) then 8002 (observed running)
    success = False
    for port in [8002, 8001]:  # Start with 8002 as it seemed more responsive earlier
        print(f"Checking port {port}...")
        if test_login(username, password, port):
            success = True
            break

    if success:
        sys.exit(0)
    else:
        print("FAILURE: Could not login.")
        sys.exit(1)


if __name__ == "__main__":
    main()
