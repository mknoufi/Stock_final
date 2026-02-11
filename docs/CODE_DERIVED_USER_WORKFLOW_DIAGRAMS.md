# Code-Derived User Workflow Diagrams

This document is derived from application code only (frontend routes/components/services + backend route contracts).

## Scope

- Authentication and role routing
- Staff workflow
- Supervisor workflow
- Admin workflow

## Key Code Anchors

- `frontend/src/components/auth/AuthGuard.tsx`
- `frontend/src/components/auth/RoleLayoutGuard.tsx`
- `frontend/src/utils/roleNavigation.ts`
- `frontend/app/login.tsx`
- `frontend/app/staff/home.tsx`
- `frontend/app/staff/scan.tsx`
- `frontend/app/staff/item-detail.tsx`
- `frontend/app/supervisor/dashboard.tsx`
- `frontend/app/supervisor/session/[id].tsx`
- `frontend/app/supervisor/variances.tsx`
- `frontend/app/supervisor/sync-conflicts.tsx`
- `frontend/app/admin/dashboard.tsx`
- `frontend/app/admin/users.tsx`
- `frontend/app/admin/security.tsx`
- `frontend/app/admin/metrics.tsx`
- `frontend/app/admin/sql-config.tsx`
- `frontend/app/admin/reports.tsx`
- `frontend/app/admin/unknown-items.tsx`
- `frontend/src/services/api/api.ts`
- `backend/api/session_management_api.py`
- `backend/api/sync_batch_api.py`
- `backend/api/supervisor_workflow_api.py`

## 1) Auth + Role Routing Workflow

```mermaid
flowchart TD
    A[Open App] --> B[Welcome/Login/Register]
    B --> C{Login Method}
    C -->|Username+Password| D[/api/auth/login]
    C -->|PIN| E[/api/auth/login-pin]
    C -->|Biometric| F[LocalAuthentication -> PIN login]
    D --> G[AuthStore set user + tokens]
    E --> G
    F --> G
    G --> H[AuthGuard + RoleLayoutGuard]
    H --> I{Role}
    I -->|staff| J[/staff/home]
    I -->|supervisor| K[/supervisor/dashboard]
    I -->|admin| L[/admin/dashboard]
    H -->|Unauthenticated protected route| M[/welcome]
```

## 2) Staff Workflow

```mermaid
flowchart TD
    A[/staff/home] --> B{Start or Resume Session}
    B -->|Start New| C[Pick location + floor + rack]
    C --> D[createSession -> /api/sessions]
    B -->|Resume| E[Use existing session id]
    D --> F[/staff/scan?sessionId]
    E --> F

    F --> G{Input Mode}
    G -->|Camera Scan| H[getItemByBarcode]
    G -->|Text Search| I[searchItems / searchItemsManual]

    H --> J{Item Found}
    I --> J
    J -->|Yes| K[/staff/item-detail]
    J -->|No| L[createUnknownItem -> /api/unknown-items]

    K --> M[Enter qty/batch/serial/damage/photos]
    M --> N[Optional SQL refresh: /api/v2/items/code/:code?verify_sql=true]
    N --> O[Submit pressed]
    O --> P[5-second submitCountdown with Undo]
    P --> Q[createCountLine]
    Q --> R{Online?}
    R -->|Yes| S[Write synced to API]
    R -->|No| T[Queue offline (offlineStorage/offlineQueue)]
    T --> U[syncOfflineQueue -> /api/sync/batch]
    S --> V[Back to scan next item]
    U --> V

    F --> W[Finish Rack]
    W --> X[updateSessionStatus CLOSED -> /api/sessions/:id/complete]
    X --> A
```

## 3) Supervisor Workflow

```mermaid
flowchart TD
    A[/supervisor/dashboard] --> B{Primary Action}

    B -->|Open Sessions| C[/supervisor/sessions]
    C --> D[/supervisor/session/:id]
    D --> E[getSession + getCountLines]
    E --> F{Line Action}
    F -->|Approve| G[ItemVerificationAPI.approveVariance]
    F -->|Reject/Recount| H[ItemVerificationAPI.requestRecount]
    F -->|Verify| I[ItemVerificationAPI.verifyCountLine]
    F -->|Unverify| J[ItemVerificationAPI.unverifyCountLine]
    D --> K[updateSessionStatus RECONCILE/CLOSED]

    B -->|Variance Review| L[/supervisor/variances]
    L --> M[ItemVerificationAPI.getVariances]
    M --> N{Bulk Decision}
    N -->|Approve| O[bulkApproveVariances]
    N -->|Reject| P[bulkRejectVariances]

    B -->|Items| Q[/supervisor/items]
    Q --> R[getFilteredItems + export CSV]

    B -->|Sync Conflicts| S[/supervisor/sync-conflicts]
    S --> T[getSyncConflicts + stats]
    T --> U[resolveSyncConflict or batchResolveSyncConflicts]

    B -->|Watchtower| V[/supervisor/watchtower]
    V --> W[getWatchtowerStats]
```

## 4) Admin Workflow

```mermaid
flowchart TD
    A[/admin/dashboard] --> B{Shortcut}

    B -->|Users| C[/admin/users]
    C --> D[GET /api/users + filters]
    D --> E{User Operation}
    E -->|Create/Update| F[POST/PUT /api/users]
    E -->|Activate/Deactivate| G[PUT /api/users/:id]
    E -->|Delete| H[DELETE /api/users/:id]
    E -->|Bulk| I[POST /api/users/bulk]

    B -->|Permissions| J[/admin/permissions]
    J --> K[getAvailablePermissions/getUserPermissions]
    K --> L[addUserPermissions/removeUserPermissions]

    B -->|Security| M[/admin/security]
    M --> N[getSecuritySummary + failed logins + suspicious + sessions]

    B -->|Metrics| O[/admin/metrics]
    O --> P[getMetricsStats + getMetricsHealth + getSyncStatus]
    P --> Q[Optional triggerManualSync]

    B -->|SQL Config| R[/admin/sql-config]
    R --> S[getSqlServerConfig/testSqlServerConnection/updateSqlServerConfig]

    B -->|Reports| T[/admin/reports]
    T --> U[getAvailableReports]
    U --> V[generateReport + download/share]

    B -->|Unknown Items| W[/admin/unknown-items]
    W --> X[getUnknownItems]
    X --> Y[mapUnknownToSku or deleteUnknownItem]

    B -->|Logs/Settings| Z[/admin/logs /admin/settings]
```

## Notes from Code

- Staff routes are guarded to `staff` only in `StaffLayout`.
- Supervisor layout allows `supervisor` and `admin`.
- Admin layout allows `admin` only.
- Offline write path exists for count/unknown item flows and syncs later via `/api/sync/batch`.
