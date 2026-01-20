"""Test session creation with full error details"""

import requests
import json

BASE_URL = "http://localhost:8001"

# Login
print("1. Logging in...")
resp = requests.post(
    f"{BASE_URL}/api/auth/login", json={"username": "staff1", "password": "staff123"}
)
print(f"   Status: {resp.status_code}")
data = resp.json()
token = data.get("access_token") or data.get("data", {}).get("access_token")
print(f"   Token: {token[:30]}..." if token else "   No token!")

# Create session
print("\n2. Creating session...")
headers = {"Authorization": f"Bearer {token}"}
resp = requests.post(
    f"{BASE_URL}/api/sessions",
    json={"warehouse": "Test Warehouse", "type": "STANDARD"},
    headers=headers,
)
print(f"   Status: {resp.status_code}")
try:
    print(f"   Response: {json.dumps(resp.json(), indent=2)}")
except:
    print(f"   Response: {resp.text}")
