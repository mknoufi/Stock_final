#!/usr/bin/env python3
"""
Test script to verify Android emulator connectivity to backend.
This simulates the Android emulator's network access to the backend server.
"""

import requests  # type: ignore


def test_android_connectivity():
    """Test if Android emulator can reach the backend server."""

    # Android emulator uses 10.0.2.2 to access host machine
    android_backend_urls = [
        "http://10.0.2.2:8000",
        "http://10.0.2.2:8001",
        "http://10.0.2.2:8002"
    ]

    print("Testing Android emulator connectivity to backend...")
    print("=" * 60)

    for base_url in android_backend_urls:
        try:
            # Test health endpoint
            health_url = f"{base_url}/api/health"
            print(f"Testing: {health_url}")

            response = requests.get(health_url, timeout=5)

            if response.status_code == 200:
                print(f"✅ SUCCESS: {base_url} is reachable!")
                print(f"   Health check: {response.status_code}")

                # Test login endpoint
                login_url = f"{base_url}/api/auth/login"
                print(f"Testing login endpoint: {login_url}")

                # Test with known working credentials
                login_data = {
                    "username": "admin",
                    "password": "admin123"
                }

                login_response = requests.post(
                    login_url,
                    json=login_data,
                    timeout=10
                )

                if login_response.status_code == 200:
                    login_result = login_response.json()
                    if login_result.get("success"):
                        print("✅ Login successful! Token received.")
                        return True
                    else:
                        print(f"⚠️  Login failed: {login_result.get('message', 'Unknown error')}")
                else:
                    print(f"❌ Login endpoint failed: {login_response.status_code}")

            else:
                print(f"❌ Health check failed: {response.status_code}")

        except requests.exceptions.RequestException as e:
            print(f"❌ Connection failed: {e}")
        except Exception as e:
            print(f"❌ Unexpected error: {e}")

        print("-" * 40)

    print("\n📝 Troubleshooting tips for Android emulator:")
    print("1. Ensure backend server is running on host machine")
    print("2. Check that backend server is listening on 0.0.0.0 (not just 127.0.0.1)")
    print("3. Verify Android emulator network configuration")
    print("4. Check firewall settings on host machine")
    print("5. Try accessing backend from emulator browser first")

    return False


if __name__ == "__main__":
    success = test_android_connectivity()
    exit(0 if success else 1)
