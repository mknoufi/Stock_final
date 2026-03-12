# Staged Refactor Blueprint (Backend + Frontend)

## Goal

Reduce architecture risk and maintenance cost without changing business behavior, especially governance-critical SQL verification and sync flows.

## Hard Constraints

Do not modify these files in Phases 1-3 unless explicitly running a governance remediation stream:

- `backend/services/sql_verification_service.py`
- `backend/services/sql_sync_service.py`
- `backend/api/item_verification_api.py`
- `backend/config/governance.py`
- `backend/sql_server_connector.py`

## Current Risk Hotspots

- Backend entrypoint is oversized and multi-purpose:
  - `backend/server.py` (~1,567 LOC)
- Router registration/composition drift (duplicate include patterns)
- Multiple database lifecycle patterns:
  - `backend/core/database.py`
  - `backend/db/runtime.py`
  - `backend/core/lifespan.py`
- Frontend bootstrap is over-centralized:
  - `frontend/app/_layout.tsx` (~523 LOC)
- Large page-level files with mixed view + orchestration logic

## Target Architecture

### Backend

Keep `backend/server.py` as a thin entrypoint only:

- `backend/app/factory.py`
  - `create_app() -> FastAPI`
- `backend/app/middleware.py`
  - `register_middleware(app)`
- `backend/app/routers.py`
  - `register_routers(app)`
- `backend/app/static.py`
  - `register_static_serving(app)`
- `backend/app/settings_runtime.py`
  - runtime boot concerns (port/IP/save info)

Single source of truth for DB runtime lifecycle:

- Keep `backend/db/runtime.py` as canonical mutable runtime holder
- Convert `backend/core/database.py` to a compatibility shim that delegates to `backend/db/runtime.py`

### Frontend

Split `frontend/app/_layout.tsx` responsibilities:

- `frontend/src/bootstrap/initApp.ts`
  - orchestrates app initialization pipeline
- `frontend/src/bootstrap/initDevTools.ts`
  - dev-only tooling init
- `frontend/src/bootstrap/initBackend.ts`
  - backend URL discovery + HTTP client update
- `frontend/src/bootstrap/initAuthAndSettings.ts`
  - auth/settings load sequence
- Keep `frontend/app/_layout.tsx` as composition root only

## Staged Delivery Plan

## Phase 0 - Baseline & Safety (no behavior changes)

1. Capture route inventory and middleware inventory from current app startup.
2. Add snapshot tests for:
   - route count and key route presence
   - middleware chain order
3. Capture startup smoke metrics:
   - app import time
   - first successful `/health`

Acceptance:

- No runtime path changes.
- Baseline report committed to `docs/refactor-baseline/`.

## Phase 1 - Backend Composition Extraction (safe mechanical moves)

1. Create `backend/app/` package and move app setup logic out of `server.py` into:
   - `factory.py`, `middleware.py`, `routers.py`, `static.py`
2. Keep all existing router prefixes and order unchanged.
3. Preserve startup/lifespan wiring exactly.

Acceptance:

- Existing backend tests pass unchanged.
- Route snapshot equal to baseline.
- `import backend.server` still succeeds in CI.

## Phase 2 - Remove Router Duplication & Normalize Registry

1. Consolidate router registration into `register_routers(app)` only.
2. Remove duplicate `include_router` calls and dead registration paths.
3. Keep optional routers feature-flagged exactly as today.

Acceptance:

- Route snapshot intentionally updated only for duplicate removals.
- No 404 regressions for existing endpoints.
- Smoke tests for auth, sessions, ERP, sync, verification pass.

## Phase 3 - DB Runtime Unification

1. Declare `backend/db/runtime.py` as canonical runtime store.
2. Update imports in non-governance files to read DB/client from canonical APIs.
3. Turn `backend/core/database.py` into compatibility wrapper:
   - exports same names
   - delegates to canonical runtime module

Acceptance:

- No direct global DB object divergence in runtime.
- Test fixtures can swap DB consistently with one mechanism.

## Phase 4 - Frontend Bootstrap Refactor

1. Extract init orchestration from `_layout.tsx` into `src/bootstrap/*`.
2. Preserve timeout behavior and graceful fallback.
3. Keep route guards and auth redirect behavior unchanged.

Acceptance:

- UI navigation behavior unchanged for authenticated/unauthenticated states.
- Existing frontend tests pass.
- App cold-start path remains stable.

## Phase 5 - Optional Governance Stream (separate approval)

Only with explicit approval:

1. Refactor restricted SQL/governance files behind full contract tests.
2. Add formal architecture boundary tests:
   - write path restrictions
   - SQL read-only invariants
   - verification authority checks

Acceptance:

- Governance contract tests pass and remain mandatory.

## Execution Backlog (Ticket-Ready)

1. `ARCH-001` Add route/middleware snapshot tests for current app.
2. `ARCH-002` Create `backend/app/` package and move app factory logic.
3. `ARCH-003` Consolidate router registry and remove duplicates.
4. `ARCH-004` Canonicalize DB runtime access and compatibility shim.
5. `FE-BOOT-001` Extract `_layout.tsx` initialization pipeline.
6. `FE-BOOT-002` Add bootstrap failure-mode tests and timeouts coverage.
7. `OPS-001` Add CI check: fail if duplicate route registration detected.

## CI Hardening Recommendations

- Make `frontend` typecheck blocking in CI (remove `continue-on-error`).
- Make frontend test step blocking for default branch.
- Keep evaluation/performance suites scheduled nightly if not PR-blocking.

## Rollback Strategy

- Each phase merged independently with no mixed concerns.
- Keep old entrypoint paths as wrappers for one phase before cleanup.
- Use feature flags only for registration switches, not for business logic.

## Definition of Done (Program-Level)

- `backend/server.py` reduced to thin entrypoint (<250 LOC target).
- Single DB runtime pattern for app and tests.
- `_layout.tsx` reduced to composition-only (<200 LOC target).
- CI quality gates are consistently blocking for core checks.
