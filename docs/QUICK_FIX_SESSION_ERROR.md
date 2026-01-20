# Quick Fix Guide - Session Not Found Error

## Problem

The app is showing "Session not found" error when trying to create count lines.

## Root Cause

The frontend is trying to create a count line without an active session. Sessions must be created first before counting items.

## Solution Options

### Option 1: Create a Session First (Recommended)

1. Open the app at `http://localhost:8081`
2. Navigate to "New Session" or "Create Session"
3. Fill in:
   - Warehouse: "Main Warehouse"
   - Site Type: "Showroom" or "Godown"
   - Site Name: "First Floor" (or any name)
   - Rack No: "R1" (or any rack number)
4. Click "Create Session"
5. Now you can start counting items

### Option 2: Use API to Create Session

```bash
curl -X POST http://localhost:8001/api/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "warehouse": "Main Warehouse",
    "type": "STANDARD"
  }'
```

### Option 3: Auto-Create Default Session (Quick Test)

Add this to your backend startup or create a seed script:

```python
# backend/seed_default_session.py
import asyncio
from backend.db.runtime import get_db

async def create_default_session():
    db = get_db()

    # Check if default session exists
    existing = await db.sessions.find_one({"id": "default-session"})
    if not existing:
        session = {
            "id": "default-session",
            "warehouse": "Test Warehouse",
            "staff_user": "test_user",
            "staff_name": "Test User",
            "type": "STANDARD",
            "status": "OPEN",
            "started_at": datetime.utcnow(),
        }
        await db.sessions.insert_one(session)
        print("✅ Default session created")
    else:
        print("ℹ️  Default session already exists")

if __name__ == "__main__":
    asyncio.run(create_default_session())
```

## Quick Test Commands

### 1. Check if sessions exist:

```bash
curl http://localhost:8001/api/sessions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Create a test session:

```bash
curl -X POST http://localhost:8001/api/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "warehouse": "Test Warehouse",
    "type": "STANDARD"
  }'
```

### 3. Get session ID from response and use it for count lines

## Frontend Fix

If you want to auto-create a session when none exists, modify the frontend:

```typescript
// frontend/src/services/api/api.ts
async function ensureActiveSession() {
  try {
    const sessions = await getSessions();
    const activeSessions = sessions.filter((s) => s.status === "OPEN");

    if (activeSessions.length === 0) {
      // Auto-create a session
      const newSession = await createSession({
        warehouse: "Default Warehouse",
        type: "STANDARD",
      });
      return newSession.id;
    }

    return activeSessions[0].id;
  } catch (error) {
    console.error("Failed to ensure active session:", error);
    throw error;
  }
}

// Call this before creating count lines
const sessionId = await ensureActiveSession();
```

## Recommended Workflow

1. **Login** → Get JWT token
2. **Create Session** → Get session ID
3. **Search Item** → Get item details
4. **Create Count Line** → Use session ID + item code
5. **Submit** → Variance check → Approval routing

## Testing the Fix

1. Stop the app
2. Clear any test data if needed
3. Restart the app
4. Create a session through the UI
5. Try counting an item

## Need Help?

Check the logs at:

- Backend: Console where you ran `start_app.ps1`
- Frontend: Browser console (F12)
- Network: Check the Network tab in browser DevTools
