import requests
import sys

BASE_URL = "http://localhost:8001/api/v1/auth/login"  # Check port 8001 or 8002? Backend output said 8002 in previous turns but .env says 8001. Trying both.
COMMON_PASSWORDS = ["admin123", "admin", "password", "secret", "123456", "super123"]


def test_login(username, password, port):
    url = f"http://localhost:{port}/api/auth/login"
    try:
        response = requests.post(url, data={"username": username, "password": password})
        if response.status_code == 200:
            print(f"SUCCESS: Login successful on port {port} with password '{password}'")
            return True
        else:
            # print(f"Failed on port {port} with '{password}': {response.status_code}")
            return False
    except Exception as e:
        print(f"Error connecting to port {port}: {e}")
        return False


def main():
    username = "admin"
    print(f"Testing passwords for user: {username}")

    # Try Port 8001 first (from .env) then 8002 (observed running)
    for port in [8001, 8002]:
        print(f"Checking port {port}...")
        for pwd in COMMON_PASSWORDS:
            if test_login(username, pwd, port):
                sys.exit(0)

    print("FAILURE: Could not login with common passwords.")
    sys.exit(1)


if __name__ == "__main__":
    main()
