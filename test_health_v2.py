
import requests
import json

def test_health():
    base_url = "http://localhost:8001"

    print("--- Testing Public Health Endpoint ---")
    try:
        resp = requests.get(f"{base_url}/api/v2/health/")
        print(f"Status Code: {resp.status_code}")
        print(json.dumps(resp.json(), indent=2))
    except Exception as e:
        print(f"Error: {e}")

    print("\n--- Testing Detailed Health Endpoint (Expected to fail without auth) ---")
    try:
        resp = requests.get(f"{base_url}/api/v2/health/detailed")
        print(f"Status Code: {resp.status_code}")
        print(json.dumps(resp.json(), indent=2))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_health()
