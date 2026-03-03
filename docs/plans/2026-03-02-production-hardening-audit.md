# Stock Verify Production Hardening Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove concrete regressions, stale mappings, and repository hygiene issues currently blocking reliable production readiness.

**Architecture:** Fix critical backend/frontend contract breaks first, then enforce repository hygiene and CI gating so the same classes of issues cannot re-enter. Keep behavior-preserving changes small and testable with fast targeted checks before full-suite runs.

**Tech Stack:** FastAPI, Python 3.13, Pytest, Expo Router, TypeScript, npm, GitHub Actions.

---

### Task 1: Fix Backend Lifespan/Test Contract Regression

**Files:**
- Modify: `backend/core/lifespan.py`
- Modify: `backend/tests/utils/in_memory_db.py`
- Test: `backend/tests/test_auth.py`

**Step 1: Write the failing test assertion (or retain existing failing one)**

Use the existing failure from:
- `python -m pytest backend/tests/test_auth.py -q`

Expected failure now:
- `AttributeError: module 'backend.core.lifespan' has no attribute 'migration_manager'`

**Step 2: Run test to verify it fails**

Run:
- `python -m pytest backend/tests/test_auth.py -q`

Expected: FAIL with the `migration_manager` attribute error.

**Step 3: Write minimal implementation**

- In `backend/core/lifespan.py`, add a module-level nullable `migration_manager` symbol.
- In `lifespan()`, assign through `global migration_manager` before use.
- In `backend/tests/utils/in_memory_db.py`, patch `g.migration_manager` (and/or module symbol) defensively with `raising=False` so tests remain compatible if internals move again.

**Step 4: Run test to verify it passes**

Run:
- `python -m pytest backend/tests/test_auth.py -q`

Expected: PASS.

**Step 5: Commit**

```bash
git add backend/core/lifespan.py backend/tests/utils/in_memory_db.py
git commit -m "fix: restore lifespan migration manager test contract"
```

### Task 2: Remove Duplicate API Router Registration

**Files:**
- Modify: `backend/server.py`
- Test: `backend/tests/test_routes_check.py`

**Step 1: Write failing/guard test**

- Add or update test to assert `/api/auth/refresh` (or another api_router endpoint) appears once in OpenAPI route listing.

**Step 2: Run test to verify it fails (if guard is new)**

Run:
- `python -m pytest backend/tests/test_routes_check.py -q`

Expected: FAIL if duplicate router registration is present.

**Step 3: Write minimal implementation**

- Remove one of the two `app.include_router(api_router, prefix="/api")` registrations in `backend/server.py`.
- Keep a single registration after route declarations.

**Step 4: Run test to verify it passes**

Run:
- `python -m pytest backend/tests/test_routes_check.py -q`

Expected: PASS.

**Step 5: Commit**

```bash
git add backend/server.py backend/tests/test_routes_check.py
git commit -m "fix: register api_router only once"
```

### Task 3: Repair Frontend Route Mapping Drift

**Files:**
- Modify: `frontend/src/constants/routes.ts`
- Modify: `frontend/src/utils/roleNavigation.ts`
- Modify: `frontend/src/constants/allowedPaths.ts`
- Modify: `frontend/src/constants/__tests__/allowedPaths.test.ts`
- Test: `frontend/src/utils/__tests__/roleNavigation.test.ts`

**Step 1: Write failing tests**

- Add/adjust tests for admin role landing route to `"/admin/dashboard-web"`.
- Add test asserting removed routes (`/admin/dashboard`, `/supervisor/dead-letter`) are not in allowlists unless files exist.

**Step 2: Run tests to verify failures**

Run:
- `cd frontend && npm test -- roleNavigation`
- `cd frontend && npm test -- allowedPaths`

Expected: FAIL under current stale mapping.

**Step 3: Write minimal implementation**

- Set `ROUTES.ADMIN_DASHBOARD` to `"/admin/dashboard-web"` (or remove old constant and use ADMIN_DASHBOARD_WEB everywhere).
- Update `getRouteForRole("admin")` target accordingly.
- Remove stale allowlist entries for deleted routes and align with actual `frontend/app/**` files.

**Step 4: Run tests + typecheck**

Run:
- `cd frontend && npm test -- roleNavigation`
- `cd frontend && npm test -- allowedPaths`
- `cd frontend && npx tsc --noEmit`

Expected: PASS.

**Step 5: Commit**

```bash
git add frontend/src/constants/routes.ts frontend/src/utils/roleNavigation.ts frontend/src/constants/allowedPaths.ts frontend/src/constants/__tests__/allowedPaths.test.ts frontend/src/utils/__tests__/roleNavigation.test.ts
git commit -m "fix: align admin/supervisor route maps with existing screens"
```

### Task 4: Enforce Repository Hygiene and Remove Generated Artifacts

**Files:**
- Modify: `.gitignore`
- Modify: `frontend/.gitignore`
- Remove tracked artifacts from index: `backend/dist/**`, `backend/build/**`, tracked `__pycache__/**`, root `node_modules/**`, temp outputs
- Add: `scripts/repo_hygiene_check.ps1`

**Step 1: Add failing hygiene check script**

- Script should fail when tracked files match forbidden patterns:
  - `__pycache__/`
  - `backend/dist/`
  - `backend/build/`
  - `node_modules/`
  - `*.log`, `tmp_*`, `*_output.txt`, `*_results*.txt`

**Step 2: Run script and verify failure**

Run:
- `powershell -ExecutionPolicy Bypass -File scripts/repo_hygiene_check.ps1`

Expected: FAIL listing violating files.

**Step 3: Write minimal implementation**

- Expand ignore rules where needed.
- Untrack generated files with `git rm --cached` (no destructive local delete).
- Keep only source, config, and required assets.

**Step 4: Re-run hygiene check**

Run:
- `powershell -ExecutionPolicy Bypass -File scripts/repo_hygiene_check.ps1`

Expected: PASS with zero forbidden tracked artifacts.

**Step 5: Commit**

```bash
git add .gitignore frontend/.gitignore scripts/repo_hygiene_check.ps1
git add -u
git commit -m "chore: remove generated artifacts and enforce repo hygiene checks"
```

### Task 5: Harden Sync Bridge Agent Reliability to AGENTS.md Standards

**Files:**
- Modify: `backend/scripts/sync_bridge_agent.py`
- Test: `backend/tests/test_sync_service.py` (or add `backend/tests/scripts/test_sync_bridge_agent.py`)

**Step 1: Write failing test(s)**

- Validate retry behavior on transient `requests` failures.
- Validate exponential backoff call pattern.
- Validate graceful loop survival on SQL/API exceptions.

**Step 2: Run tests to verify fail-first**

Run:
- `python -m pytest backend/tests/scripts/test_sync_bridge_agent.py -q`

Expected: FAIL before retry/backoff implementation.

**Step 3: Write minimal implementation**

- Add `tenacity` retry wrappers for SQL connect and `requests.post`.
- Keep current `X-Sync-Token` header contract.
- Ensure logging uses both stdout and dedicated file path under a known logs directory.
- Add bounded timeouts and explicit exception classes.

**Step 4: Run tests**

Run:
- `python -m pytest backend/tests/scripts/test_sync_bridge_agent.py -q`

Expected: PASS.

**Step 5: Commit**

```bash
git add backend/scripts/sync_bridge_agent.py backend/tests/scripts/test_sync_bridge_agent.py
git commit -m "feat: add resilient retry/backoff to sync bridge agent"
```

### Task 6: Add CI Gate for Production Readiness

**Files:**
- Modify: `.github/workflows/*` (existing CI workflow)
- Modify: `README.md` (developer verification section)

**Step 1: Add failing CI locally (dry run with commands)**

Required gates:
- `python -m pytest backend/tests/test_basic.py -q`
- `python -m pytest backend/tests/test_auth.py -q`
- `cd frontend && npx tsc --noEmit`
- `powershell -ExecutionPolicy Bypass -File scripts/repo_hygiene_check.ps1`

**Step 2: Implement workflow updates**

- Add explicit job steps and fail-fast semantics.
- Cache Python/npm dependencies.

**Step 3: Verify locally**

Run each gate command manually and confirm green.

**Step 4: Commit**

```bash
git add .github/workflows README.md
git commit -m "ci: add production-readiness gates for auth, types, and hygiene"
```

