# Implementation Plan: FR-M-29 Role-Based Access Control

**Priority**: P0 - Critical  
**Effort Estimate**: 8 hours  
**Status**: Partially Implemented  
**Owner**: TBD  
**Target Sprint**: Sprint 1

---

## Requirement

**FR-M-29**: Implement fine-grained role-based access control (RBAC) with three roles:

- **Admin**: Full system access
- **Supervisor**: Manage floor operations, approve counts, assign recounts
- **Counter** (Staff): Perform counting only

---

## Current State

**Existing Components**:

- ✅ User model has `role` field (`backend/api/schemas.py`)
- ✅ JWT authentication exists (`backend/auth/dependencies.py`)
- ⚠️ Roles are stored but not enforced
- ❌ Permission decorators not implemented
- ❌ Fine-grained permissions not defined

**Files to Modify**:

- `backend/auth/permissions.py` (NEW) - Permission definitions and decorators
- `backend/auth/dependencies.py` - Add permission checking
- `backend/api/*.py` - Add permission decorators to endpoints
- `backend/api/schemas.py` - Add permission models

---

## Technical Design

### 1. Permission System Architecture

#### 1.1 Permission Constants

```python
# backend/auth/permissions.py

from enum import Enum
from typing import List, Set

class Permission(str, Enum):
    # User Management
    USER_CREATE = "user:create"
    USER_READ = "user:read"
    USER_UPDATE = "user:update"
    USER_DELETE = "user:delete"

    # Session Management
    SESSION_CREATE = "session:create"
    SESSION_READ = "session:read"
    SESSION_UPDATE = "session:update"
    SESSION_DELETE = "session:delete"
    SESSION_CLOSE = "session:close"

    # Counting
    COUNT_CREATE = "count:create"
    COUNT_READ = "count:read"
    COUNT_UPDATE = "count:update"
    COUNT_DELETE = "count:delete"
    COUNT_SUBMIT = "count:submit"

    # Approval Workflow
    COUNT_APPROVE = "count:approve"
    COUNT_REJECT = "count:reject"
    COUNT_REQUEST_RECOUNT = "count:request_recount"
    COUNT_PERFORM_RECOUNT = "count:perform_recount"

    # Reporting
    REPORT_VIEW = "report:view"
    REPORT_EXPORT = "report:export"
    REPORT_GENERATE = "report:generate"

    # System Administration
    SYSTEM_CONFIG = "system:config"
    SYSTEM_LOGS = "system:logs"
    ANALYTICS_VIEW = "analytics:view"

    # Item Management
    ITEM_READ = "item:read"
    ITEM_REFRESH = "item:refresh"


# Role to Permission Mapping
ROLE_PERMISSIONS: dict[str, Set[Permission]] = {
    "admin": {
        # Full access to everything
        Permission.USER_CREATE,
        Permission.USER_READ,
        Permission.USER_UPDATE,
        Permission.USER_DELETE,
        Permission.SESSION_CREATE,
        Permission.SESSION_READ,
        Permission.SESSION_UPDATE,
        Permission.SESSION_DELETE,
        Permission.SESSION_CLOSE,
        Permission.COUNT_CREATE,
        Permission.COUNT_READ,
        Permission.COUNT_UPDATE,
        Permission.COUNT_DELETE,
        Permission.COUNT_SUBMIT,
        Permission.COUNT_APPROVE,
        Permission.COUNT_REJECT,
        Permission.COUNT_REQUEST_RECOUNT,
        Permission.COUNT_PERFORM_RECOUNT,
        Permission.REPORT_VIEW,
        Permission.REPORT_EXPORT,
        Permission.REPORT_GENERATE,
        Permission.SYSTEM_CONFIG,
        Permission.SYSTEM_LOGS,
        Permission.ANALYTICS_VIEW,
        Permission.ITEM_READ,
        Permission.ITEM_REFRESH,
    },
    "supervisor": {
        # User management (limited)
        Permission.USER_READ,
        # Session management
        Permission.SESSION_CREATE,
        Permission.SESSION_READ,
        Permission.SESSION_UPDATE,
        Permission.SESSION_CLOSE,
        # Counting
        Permission.COUNT_CREATE,
        Permission.COUNT_READ,
        Permission.COUNT_UPDATE,
        Permission.COUNT_SUBMIT,
        # Approval workflow
        Permission.COUNT_APPROVE,
        Permission.COUNT_REJECT,
        Permission.COUNT_REQUEST_RECOUNT,
        Permission.COUNT_PERFORM_RECOUNT,
        # Reporting
        Permission.REPORT_VIEW,
        Permission.REPORT_EXPORT,
        # Analytics
        Permission.ANALYTICS_VIEW,
        # Items
        Permission.ITEM_READ,
        Permission.ITEM_REFRESH,
    },
    "staff": {
        # Session management (own sessions only)
        Permission.SESSION_CREATE,
        Permission.SESSION_READ,
        Permission.SESSION_UPDATE,
        # Counting (own counts only)
        Permission.COUNT_CREATE,
        Permission.COUNT_READ,
        Permission.COUNT_UPDATE,
        Permission.COUNT_SUBMIT,
        # Items
        Permission.ITEM_READ,
    },
}


def get_user_permissions(role: str) -> Set[Permission]:
    """Get all permissions for a given role."""
    return ROLE_PERMISSIONS.get(role, set())


def has_permission(user_role: str, required_permission: Permission) -> bool:
    """Check if a role has a specific permission."""
    user_perms = get_user_permissions(user_role)
    return required_permission in user_perms
```

#### 1.2 Permission Decorators

```python
# backend/auth/permissions.py (continued)

from functools import wraps
from fastapi import HTTPException, status
from typing import Callable, List

def require_permission(*required_permissions: Permission):
    """
    Decorator to enforce permission checks on API endpoints.

    Usage:
        @router.get("/admin/users")
        @require_permission(Permission.USER_READ)
        async def get_users(current_user: dict = Depends(get_current_user)):
            ...
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Extract current_user from kwargs
            current_user = kwargs.get("current_user")
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )

            user_role = current_user.get("role", "staff")
            user_perms = get_user_permissions(user_role)

            # Check if user has ALL required permissions
            missing_perms = set(required_permissions) - user_perms
            if missing_perms:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail={
                        "message": "Insufficient permissions",
                        "required": [p.value for p in required_permissions],
                        "missing": [p.value for p in missing_perms],
                        "user_role": user_role,
                    }
                )

            return await func(*args, **kwargs)
        return wrapper
    return decorator


def require_role(*allowed_roles: str):
    """
    Simpler decorator that checks role directly.

    Usage:
        @router.delete("/admin/users/{user_id}")
        @require_role("admin")
        async def delete_user(user_id: str, current_user: dict = Depends(get_current_user)):
            ...
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get("current_user")
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )

            user_role = current_user.get("role", "staff")
            if user_role not in allowed_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail={
                        "message": f"Access denied. Required roles: {', '.join(allowed_roles)}",
                        "user_role": user_role,
                    }
                )

            return await func(*args, **kwargs)
        return wrapper
    return decorator
```

#### 1.3 Resource Ownership Check

```python
# backend/auth/permissions.py (continued)

async def check_resource_ownership(
    db: AsyncIOMotorDatabase,
    resource_type: str,
    resource_id: str,
    user_id: str,
    allow_supervisor: bool = False
) -> bool:
    """
    Check if a user owns a specific resource (session, count, etc.).

    Args:
        db: Database instance
        resource_type: "session" | "count_line" | "count_header"
        resource_id: ID of the resource
        user_id: ID of the user
        allow_supervisor: If True, supervisors can access any resource

    Returns:
        True if user owns the resource or is a supervisor (if allowed)
    """
    collection_map = {
        "session": "sessions",
        "count_line": "count_lines",
        "count_header": "count_headers",
    }

    collection_name = collection_map.get(resource_type)
    if not collection_name:
        return False

    resource = await db[collection_name].find_one({"_id": resource_id})
    if not resource:
        return False

    # Check ownership
    if resource.get("user_id") == user_id or resource.get("created_by") == user_id:
        return True

    # Check if supervisor override is allowed
    if allow_supervisor:
        user = await db.users.find_one({"_id": user_id})
        if user and user.get("role") in ["supervisor", "admin"]:
            return True

    return False
```

---

### 2. Apply Permissions to Endpoints

#### 2.1 User Management API

```python
# backend/api/users_api.py

from backend.auth.permissions import require_permission, require_role, Permission

@router.get("/users")
@require_permission(Permission.USER_READ)
async def list_users(
    current_user: dict = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    """List all users (Admin/Supervisor only)"""
    # Implementation
    pass


@router.post("/users")
@require_role("admin")
async def create_user(
    user_data: UserCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create new user (Admin only)"""
    # Implementation
    pass


@router.delete("/users/{user_id}")
@require_role("admin")
async def delete_user(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete user (Admin only)"""
    # Implementation
    pass
```

#### 2.2 Session API

```python
# backend/api/sessions_api.py

@router.post("/sessions")
@require_permission(Permission.SESSION_CREATE)
async def create_session(
    session_data: SessionCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create new session (All authenticated users)"""
    # Automatically assign to current user
    session_data.user_id = current_user["user_id"]
    # Implementation
    pass


@router.get("/sessions/{session_id}")
@require_permission(Permission.SESSION_READ)
async def get_session(
    session_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get session details"""
    # Check ownership for staff users
    if current_user["role"] == "staff":
        has_access = await check_resource_ownership(
            db, "session", session_id, current_user["user_id"]
        )
        if not has_access:
            raise HTTPException(status_code=403, detail="Access denied")

    # Implementation
    pass


@router.delete("/sessions/{session_id}")
@require_permission(Permission.SESSION_DELETE)
async def delete_session(
    session_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete session (Admin/Supervisor only)"""
    # Implementation
    pass
```

#### 2.3 Count Lines API

```python
# backend/api/count_lines_api.py

@router.post("/count-lines")
@require_permission(Permission.COUNT_CREATE)
async def create_count_line(
    count_data: CountLineCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create count line (All authenticated users)"""
    # Verify user owns the session
    session = await db.sessions.find_one({"_id": count_data.session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if current_user["role"] == "staff" and session["user_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Cannot add counts to other user's session")

    # Implementation
    pass


@router.put("/count-lines/{count_id}")
@require_permission(Permission.COUNT_UPDATE)
async def update_count_line(
    count_id: str,
    update_data: CountLineUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update count line"""
    # Check if count is already submitted
    count = await db.count_lines.find_one({"_id": count_id})
    if not count:
        raise HTTPException(status_code=404, detail="Count not found")

    if count.get("status") == "submitted":
        # Only supervisors/admins can edit submitted counts
        if current_user["role"] not in ["supervisor", "admin"]:
            raise HTTPException(
                status_code=403,
                detail="Cannot edit submitted count. Contact supervisor."
            )

    # Check ownership for staff
    if current_user["role"] == "staff":
        has_access = await check_resource_ownership(
            db, "count_line", count_id, current_user["user_id"]
        )
        if not has_access:
            raise HTTPException(status_code=403, detail="Access denied")

    # Implementation
    pass


@router.post("/count-lines/{count_id}/approve")
@require_permission(Permission.COUNT_APPROVE)
async def approve_count(
    count_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Approve count (Supervisor/Admin only)"""
    # Implementation
    pass


@router.post("/count-lines/{count_id}/reject")
@require_permission(Permission.COUNT_REJECT)
async def reject_count(
    count_id: str,
    rejection_data: CountRejection,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Reject count (Supervisor/Admin only)"""
    # Implementation
    pass
```

#### 2.4 Analytics API

```python
# backend/api/analytics_api.py

@router.get("/analytics/dashboard")
@require_permission(Permission.ANALYTICS_VIEW)
async def get_dashboard(
    current_user: dict = Depends(get_current_user)
):
    """View analytics dashboard (Supervisor/Admin only)"""
    # Implementation
    pass


@router.get("/analytics/reports")
@require_permission(Permission.REPORT_VIEW)
async def get_reports(
    current_user: dict = Depends(get_current_user)
):
    """View reports (Supervisor/Admin only)"""
    # Implementation
    pass
```

---

### 3. Frontend Permission Checks

#### 3.1 Permission Hook

```typescript
// frontend/hooks/usePermissions.ts

import { useAuthStore } from "@/stores/authStore";

export function usePermissions() {
  const user = useAuthStore((state) => state.user);

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    const rolePermissions: Record<string, string[]> = {
      admin: ["*"], // All permissions
      supervisor: ["user:read", "session:create", "session:read", "session:update", "session:close", "count:create", "count:read", "count:update", "count:submit", "count:approve", "count:reject", "count:request_recount", "count:perform_recount", "report:view", "report:export", "analytics:view", "item:read", "item:refresh"],
      staff: ["session:create", "session:read", "session:update", "count:create", "count:read", "count:update", "count:submit", "item:read"],
    };

    const userPerms = rolePermissions[user.role] || [];
    return userPerms.includes("*") || userPerms.includes(permission);
  };

  const hasRole = (...roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return { hasPermission, hasRole, user };
}
```

#### 3.2 Permission Gate Component

```typescript
// frontend/components/auth/PermissionGate.tsx

import { usePermissions } from '@/hooks/usePermissions';
import { ReactNode } from 'react';

interface PermissionGateProps {
  permission?: string;
  role?: string | string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGate({ permission, role, fallback = null, children }: PermissionGateProps) {
  const { hasPermission, hasRole } = usePermissions();

  let hasAccess = true;

  if (permission && !hasPermission(permission)) {
    hasAccess = false;
  }

  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    if (!hasRole(...roles)) {
      hasAccess = false;
    }
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
```

#### 3.3 Usage in Screens

```typescript
// frontend/app/staff/home.tsx

import { PermissionGate } from '@/components/auth/PermissionGate';

export default function HomeScreen() {
  return (
    <View>
      {/* Everyone can see this */}
      <Text>Welcome</Text>

      {/* Only supervisors and admins */}
      <PermissionGate role={['supervisor', 'admin']}>
        <Button title="View Analytics" onPress={() => navigate('/analytics')} />
      </PermissionGate>

      {/* Only admins */}
      <PermissionGate role="admin">
        <Button title="Manage Users" onPress={() => navigate('/admin/users')} />
      </PermissionGate>

      {/* Permission-based */}
      <PermissionGate permission="count:approve">
        <Button title="Approve Counts" onPress={() => navigate('/approve')} />
      </PermissionGate>
    </View>
  );
}
```

---

## Implementation Steps

### Phase 1: Backend Core (4 hours)

1. **Hour 1**: Create permission system
   - Create `backend/auth/permissions.py`
   - Define `Permission` enum
   - Define `ROLE_PERMISSIONS` mapping
   - Implement `get_user_permissions()` and `has_permission()`

2. **Hour 2**: Create decorators
   - Implement `@require_permission()` decorator
   - Implement `@require_role()` decorator
   - Implement `check_resource_ownership()` function

3. **Hour 3-4**: Apply to existing endpoints
   - Add decorators to `users_api.py`
   - Add decorators to `sessions_api.py`
   - Add decorators to `count_lines_api.py`
   - Add decorators to `analytics_api.py`

### Phase 2: Frontend (3 hours)

5. **Hour 5**: Create permission utilities
   - Create `usePermissions` hook
   - Create `PermissionGate` component

6. **Hour 6-7**: Apply to screens
   - Update navigation to hide unauthorized routes
   - Add `PermissionGate` to sensitive UI elements
   - Update button visibility based on permissions

### Phase 3: Testing (1 hour)

7. **Hour 8**: Testing
   - Unit tests for permission checks
   - Integration tests for protected endpoints
   - Frontend tests for permission gates

---

## Testing Plan

### Backend Tests

```python
# backend/tests/test_permissions.py

def test_admin_has_all_permissions():
    admin_perms = get_user_permissions("admin")
    assert Permission.USER_DELETE in admin_perms
    assert Permission.COUNT_APPROVE in admin_perms
    assert Permission.SYSTEM_CONFIG in admin_perms

def test_staff_limited_permissions():
    staff_perms = get_user_permissions("staff")
    assert Permission.COUNT_CREATE in staff_perms
    assert Permission.COUNT_APPROVE not in staff_perms
    assert Permission.USER_DELETE not in staff_perms

async def test_require_permission_decorator(client):
    # Login as staff
    staff_token = await get_staff_token()

    # Try to access admin endpoint
    response = client.delete(
        "/api/users/some_user_id",
        headers={"Authorization": f"Bearer {staff_token}"}
    )
    assert response.status_code == 403
    assert "Insufficient permissions" in response.json()["detail"]["message"]
```

---

## Success Criteria

- [ ] All API endpoints have appropriate permission decorators
- [ ] Staff users cannot access supervisor/admin endpoints
- [ ] Supervisors cannot access admin-only endpoints
- [ ] Resource ownership is enforced for staff users
- [ ] Frontend hides unauthorized UI elements
- [ ] Permission checks return clear error messages
- [ ] All tests pass

---

## Dependencies

- Existing JWT authentication system

---

## Risks & Mitigations

| Risk                          | Impact | Mitigation                        |
| ----------------------------- | ------ | --------------------------------- |
| Breaking existing API clients | High   | Add feature flag, gradual rollout |
| Performance overhead          | Medium | Cache permission lookups          |
| Complexity for developers     | Low    | Clear documentation, examples     |

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-19  
**Next Review**: After implementation
