# Governance Acceptance Criteria

This file captures Given/When/Then criteria derived from code paths.

## Authentication and Role Routing

1. Given unauthenticated access to a protected route, when AuthGuard runs, then user is redirected to `/welcome`.
   - Frontend guard: `frontend/src/components/auth/AuthGuard.tsx`
   - API guard: token-required endpoints in `backend/api/auth.py` and auth dependencies

2. Given authenticated user in public route, when AuthGuard runs, then user is redirected to role home (`/staff/home`, `/supervisor/dashboard`, `/admin/dashboard`).
   - Frontend mapping: `frontend/src/utils/roleNavigation.ts`

3. Given invalid role for a role layout, when RoleLayoutGuard runs, then user is redirected to `/login`.
   - Guard: `frontend/src/components/auth/RoleLayoutGuard.tsx`

## Staff

1. Given valid location/floor/rack, when staff starts a session, then session is created via `/api/sessions` and scan route opens.
   - UI flow: `frontend/app/staff/home.tsx`
   - API: `backend/api/session_management_api.py`

2. Given barcode scan or search hit, when staff opens item detail, then item entry and submit flow is available.
   - UI: `frontend/app/staff/scan.tsx`, `frontend/app/staff/item-detail.tsx`

3. Given submit action, when countdown completes, then count line write is attempted and offline fallback is applied on failure.
   - UI/API: `frontend/app/staff/item-detail.tsx`, `frontend/src/services/api/api.ts`

4. Given unknown item, when reported, then unknown item record is created or queued offline.
   - API client: `frontend/src/services/api/api.ts`
   - Backend: `backend/api/unknown_items_api.py`

## Supervisor

1. Given supervisor session details view, when loading, then session and count lines are fetched and split into verify/verified views.
   - UI: `frontend/app/supervisor/session/[id].tsx`

2. Given line actions, when approve/reject/verify/unverify is executed, then corresponding APIs are called and UI refreshes.
   - UI: `frontend/app/supervisor/session/[id].tsx`
   - APIs: supervisor workflow + item verification routes

3. Given variance list, when bulk approve/reject is confirmed, then bulk APIs apply and selection state resets.
   - UI: `frontend/app/supervisor/variances.tsx`

4. Given sync conflict queue, when resolve/batch resolve is applied, then conflict state transitions are persisted.
   - UI: `frontend/app/supervisor/sync-conflicts.tsx`
   - API: sync conflict routes

## Admin

1. Given admin dashboard navigation, when shortcuts are selected, then admin/supervisor operational pages open.
   - UI: `frontend/app/admin/dashboard.tsx`

2. Given user management actions, when create/update/delete/bulk is performed, then `/api/users` endpoints enforce changes.
   - UI: `frontend/app/admin/users.tsx`
   - API: `backend/api/user_management_api.py`

3. Given security/metrics/report/sql actions, when executed, then corresponding admin APIs return status/data and UI refreshes.
   - UI: `frontend/app/admin/security.tsx`, `frontend/app/admin/metrics.tsx`, `frontend/app/admin/reports.tsx`, `frontend/app/admin/sql-config.tsx`

