# Governance Failure Paths

Failure behavior must be explicit and test-backed.

## Authentication Expiry

- Expected: token/session expiry triggers logout/redirect and blocks protected API actions.
- Anchors: `frontend/src/store/authStore.ts`, auth endpoints in `backend/api/auth.py`.

## Network Loss

- Expected: writes queue offline and retry on reconnect.
- Anchors: `frontend/src/services/offline/offlineQueue.ts`, `frontend/src/services/syncService.ts`.

## Offline Queue Corruption

- Expected: queue read/write failures are handled without app crash; conflicted entries surfaced.
- Anchors: offline storage and conflict APIs.

## Sync Conflicts

- Expected: deterministic conflict records; explicit resolution actions; traceable resolver.
- Anchors: `backend/api/sync_conflicts_api.py`, `frontend/app/supervisor/sync-conflicts.tsx`.

## SQL / ERP Mismatch

- Expected: SQL refresh/sync failures degrade gracefully without corrupting Mongo state.
- Anchors: `backend/services/sql_sync_service.py`, `backend/services/sql_verification_service.py`.

## Partial Bulk-Action Failures

- Expected: batch APIs return per-item result objects; partial success/failure visible to user.
- Anchors: supervisor batch approve/reject and sync batch APIs.

