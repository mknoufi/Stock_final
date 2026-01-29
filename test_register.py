import requests
import json

url = "http://localhost:8001/api/auth/register"
payload = {
    "username": "py_test_user",
    "password": "password123",
    "full_name": "Python Test User",
    "role": "staff",
    "employee_id": "EMP001",
    "phone": "555-0100",
}
headers = {"Content-Type": "application/json"}

try:
    print(f"Sending POST to {url}...")
    response = requests.post(url, json=payload, timeout=10)
    print(f"Status Code: {response.status_code}")
    print("Response JSON:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
