# Testing Guide - Stock Verify

This guide covers automated tests, prerequisites, and operational checks for
enterprise-grade validation.

## Prerequisites

- Node.js >= 18.18
- Python >= 3.10
- Frontend deps: `cd frontend && npm install`
- Backend deps: `python -m pip install -r backend/requirements.txt`

## Automated Test Suites

### Frontend (lint + typecheck + unit tests)

```bash
cd frontend
npm run ci
```

### Backend (pytest + coverage)

```bash
cd backend
python -m pytest
```

Notes:
- Coverage gate is enforced in `backend/pytest.ini` (fail under 80%).
- Integration tests may require MongoDB, Redis, and SQL Server.
- For a fast local pass, run:
  `python -m pytest -m "not integration and not slow"`

### E2E (Mobile)

E2E uses Maestro. No flows are defined yet; add YAML flows under `frontend/e2e/`.

```bash
# Install Maestro once
curl -Ls "https://get.maestro.mobile.dev" | bash

# Run flows (once created)
maestro test frontend/e2e/
```

## Operational Sanity Checks

### API Health

- Backend health: `GET /health`
- Readiness: `GET /health/ready`

### ERP Offline and Batch Listing

- Batch listing depends on SQL Server:
  `GET /api/item-batches/{item_code}`
- If SQL Server is unavailable, the UI shows "ERP Offline" and batch lists may
  be empty. This is expected behavior; restore SQL connectivity to list batches.

## Latest Local Run (this workspace)

- Frontend: `npm run ci` passed (lint, typecheck, jest).
- Backend: `pytest` not found; `python -m pytest` timed out (likely waiting on
  dependencies or DB services).
- E2E: no Maestro flows present.

Update this section after each full validation run.
