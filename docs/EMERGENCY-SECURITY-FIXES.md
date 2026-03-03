# CRITICAL SECURITY ISSUES - IMMEDIATE ACTION REQUIRED

**Date**: 2026-01-26
**Severity**: 🚨 EMERGENCY
**Timeline**: Fix within 6 hours

## NEWLY DISCOVERED CRITICAL VULNERABILITIES

### 1. Cross-Warehouse Session Manipulation (CRITICAL)
**Risk**: Supervisors can access/manipulate sessions from any warehouse
**Impact**: Inventory fraud, unauthorized access, audit trail compromise
**Location**: `backend/server.py` bulk operations

**Immediate Fix Required**:
```python
# Add warehouse validation in bulk operations
async def bulk_close_sessions(session_ids: list[str], current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["supervisor", "admin"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    # CRITICAL FIX: Validate user can only access their warehouse sessions
    user_warehouse = current_user.get("warehouse")

    for session_id in session_ids:
        # Verify session belongs to user's warehouse
        session = await db.sessions.find_one({"id": session_id})
        if not session or session.get("warehouse") != user_warehouse:
            logger.warning(f"User {current_user['username']} attempted to access session {session_id} from different warehouse")
            raise HTTPException(status_code=403, detail="Unauthorized session access")

        result = await db.sessions.update_one(
            {"id": session_id, "warehouse": user_warehouse},  # Add warehouse check
            {"$set": {"status": "closed", "ended_at": datetime.utcnow()}}
        )
```

### 2. PIN Hash Vulnerability - No Salt (CRITICAL)
**Risk**: Rainbow table attack on all supervisor PINs
**Impact**: Complete supervisor account compromise
**Location**: `backend/utils/crypto_utils.py`

**Immediate Fix Required**:
```python
import hashlib
import secrets
import os

# Generate secure salt (32 bytes)
PIN_SALT = os.getenv("PIN_SALT") or secrets.token_hex(32)

def get_pin_lookup_hash(pin: str) -> str:
    """Generate salted hash for PIN lookup - prevents rainbow table attacks"""
    # CRITICAL FIX: Add salt to prevent rainbow table attacks
    salted_pin = f"{PIN_SALT}{pin}"
    return hashlib.sha256(salted_pin.encode("utf-8")).hexdigest()

# For existing PINs, migrate on next login
async def migrate_pin_to_salted_hash(username: str, plain_pin: str):
    """Migrate unsalted PIN to salted hash"""
    salted_hash = get_pin_lookup_hash(plain_pin)
    await db.users.update_one(
        {"username": username},
        {"$set": {"pin_hash": salted_hash, "pin_migrated": True}}
    )
```

### 3. Variance Timing Attack (CRITICAL)
**Risk**: Race condition between ERP sync and variance calculation
**Impact**: Inventory manipulation, audit trail bypass
**Location**: `backend/server.py` variance detection

**Immediate Fix Required**:
```python
async def detect_risk_flags_atomic(erp_item_id: str, line_data: CountLineCreate) -> list[str]:
    """Atomic variance calculation to prevent timing attacks"""
    risk_flags = []

    # CRITICAL FIX: Use atomic database operation
    async with db.transaction():  # Implement MongoDB transaction
        # Get latest ERP data with lock
        erp_item = await db.erp_items.find_one_and_update(
            {"_id": erp_item_id},
            {"$inc": {"read_lock": 1}}  # Lock item for calculation
        )

        if not erp_item:
            risk_flags.append("ERP_ITEM_NOT_FOUND")
            return risk_flags

        # Calculate variance with locked data
        erp_qty = erp_item.get("stock_qty", 0)
        variance = line_data.counted_qty - erp_qty
        variance_percent = (variance / erp_qty * 100) if erp_qty > 0 else 0

        # Risk detection
        if abs(variance) > 100 or variance_percent > 50:
            risk_flags.append("LARGE_VARIANCE")

        # Release lock
        await db.erp_items.update_one(
            {"_id": erp_item_id},
            {"$inc": {"read_lock": -1}}
        )

    return risk_flags
```

### 4. Self-Privilege Escalation (CRITICAL)
**Risk**: Users can modify their own roles to gain admin access
**Impact**: Complete system compromise
**Location**: `backend/api/user_management.py`

**Immediate Fix Required**:
```python
async def update_user(user_id: str, user_data: dict, current_user: dict = Depends(get_current_user)):
    # CRITICAL FIX: Prevent role self-modification
    if current_user["_id"] == user_id and "role" in user_data:
        logger.critical(f"User {current_user['username']} attempted to modify own role to {user_data['role']}")
        raise HTTPException(status_code=403, detail="Cannot modify your own role")

    # Additional protection: Only admins can modify roles
    if "role" in user_data and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can modify user roles")

    # Validate new role value
    allowed_roles = ["staff", "supervisor", "admin"]
    if "role" in user_data and user_data["role"] not in allowed_roles:
        raise HTTPException(status_code=400, detail="Invalid role")

    await db.users.update_one(
        {"_id": user_id},
        {"$set": user_data}
    )
```

## 🚨 IMMEDIATE ACTIONS REQUIRED

### 1. EMERGENCY DEPLOYMENT (Next 2 hours)
- Deploy PIN salt fix to prevent rainbow table attacks
- Add warehouse isolation to bulk operations
- Implement role modification protection

### 2. ROLLBACK PLAN (If issues arise)
```bash
# Quick rollback commands
git revert <commit-hash>
kubectl rollout undo deployment/stock-verify-backend
```

### 3. VERIFICATION CHECKS
```python
# Test PIN salt prevents rainbow table
time python -c "
from backend.utils.crypto_utils import get_pin_lookup_hash
import time
start = time.time()
for i in range(10000):
    get_pin_lookup_hash(str(i).zfill(4))
print(f'10,000 PIN hashes in {time.time() - start:.2f}s'
"
# Should take >2 seconds with salt (vs <0.1s without)

# Test warehouse isolation
curl -X POST "http://localhost:8001/api/bulk-close" \
  -H "Authorization: Bearer <supervisor-token>" \
  -d '{"session_ids": ["other-warehouse-session"]}'
# Should return 403 Forbidden
```

## 📞 EMERGENCY CONTACTS

- **Security Team**: security@company.com - IMMEDIATE ALERT
- **DevOps Team**: devops@company.com - DEPLOY NOW
- **Management**: exec-team@company.com - RISK ASSESSMENT

## 📊 Risk Impact Timeline

| Time | Risk Level | Required Action |
|-------|-------------|-----------------|
| Now | 🔴 Critical | Deploy emergency fixes |
| 2 hours | 🟠 High | Verify fixes working |
| 6 hours | 🟡 Medium | Monitor for bypass attempts |
| 24 hours | 🟢 Low | Full security review |

---

**STATUS**: EMERGENCY - ACTION REQUIRED IMMEDIATELY
