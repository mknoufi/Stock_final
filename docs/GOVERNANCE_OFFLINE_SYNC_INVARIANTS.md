# Governance Offline Sync Invariants

Offline-capable flows must satisfy these invariants.

## Invariants

1. Every offline write is idempotent or safely deduplicated server-side.
2. Duplicate submissions must be rejected or merged deterministically.
3. Partial sync failure is resumable without data loss.
4. Conflict resolution outcomes are deterministic and actor-traceable.
5. Offline behavior must not rely on UI-only state assumptions.

## Code Anchors

- Frontend queue/cache:
- `frontend/src/services/offline/offlineStorage.ts`
- `frontend/src/services/offline/offlineQueue.ts`
- `frontend/src/services/syncService.ts`

- Backend sync processing:
- `backend/api/sync_batch_api.py`
- `backend/api/sync_conflicts_api.py`

## Required Evidence for Changes

- Updated tests for offline queue/sync paths.
- Explicit idempotency key strategy in API write paths.
- Documented conflict policy changes.

