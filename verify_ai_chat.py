import asyncio
import httpx

# Backend URL (The FastAPI endpoint that proxies to PI/Manager)
BACKEND_URL = "http://localhost:8001/api/pi/chat"
# Admin user to simulate (requires admin role)
TEST_USER_TOKEN = "mock_token_if_needed"  # In dev, we might need a real token or mock depends


async def verify_chat():
    print("--- Verifying AI Assistant Chain ---")

    # 1. Check if Manager is running directly
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get("http://localhost:8045/v1/models")
            if resp.status_code == 200:
                print("[PASS] Antigravity Manager is reachable at localhost:8045")
            else:
                print(f"[FAIL] Antigravity Manager returned {resp.status_code}")
    except Exception as e:
        print(f"[FAIL] Antigravity Manager NOT reachable: {e}")
        print("       Please run 'tools/Antigravity-Setup.exe' and launch the app.")
        return

    # 2. Check Backend Proxy
    # We need a valid token. For now, we assume the backend handles auth or we mock it.
    # In 'test_conn.py' style...
    # Actually, let's just try to hit the backend and see if it forwards.
    # We might get 401 Unauthorized if not logged in.

    print("\n[NOTE] Backend Proxy Verification requires a valid Bearer token.")
    print(
        "Please use the 'Verify AI' button in the Admin Dashboard (AI Assistant page) once Manager is running."
    )


if __name__ == "__main__":
    asyncio.run(verify_chat())
