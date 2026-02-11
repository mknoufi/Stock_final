# Governance Release Checklist

Use this checklist before release, major refactor, or feature rollout.

## 1) Workflow Truth

- [ ] `docs/CODE_DERIVED_USER_WORKFLOW_DIAGRAMS.md` matches all new/changed routes and API flows.
- [ ] No undocumented workflow path exists in `frontend/app/*` or `backend/api/*`.

## 2) Acceptance Criteria

- [ ] `docs/GOVERNANCE_ACCEPTANCE_CRITERIA.md` includes Given/When/Then for changed behavior.
- [ ] Every changed criterion maps to route guard + API auth + request/response invariants.

## 3) State Machines

- [ ] `docs/GOVERNANCE_STATE_MACHINES.md` updated for changed states/transitions.
- [ ] Illegal transitions hard-fail in server code.
- [ ] Transition tests are added/updated.

## 4) Offline Sync Invariants

- [ ] `docs/GOVERNANCE_OFFLINE_SYNC_INVARIANTS.md` updated.
- [ ] Idempotency strategy is explicit for changed offline writes.
- [ ] Partial failure resume behavior is documented and tested.
- [ ] Conflict resolution paths are deterministic.

## 5) Role Authority

- [ ] `docs/GOVERNANCE_ROLE_AUTHORITY_MATRIX.md` updated.
- [ ] API-layer role checks match matrix.
- [ ] No privilege escalation path exists.

## 6) Failure Paths

- [ ] `docs/GOVERNANCE_FAILURE_PATHS.md` updated for new failure scenarios.
- [ ] Auth expiry, network loss, sync conflict, SQL mismatch handling are defined.

## 7) API Guard + DB Constraint Map

- [ ] `docs/GOVERNANCE_API_DB_ENFORCEMENT_MAP.md` updated.
- [ ] Every critical rule has server-side guard + DB-level enforcement.

## 8) Audit and Traceability

- [ ] `docs/GOVERNANCE_AUDIT_TRACEABILITY.md` updated.
- [ ] Critical operations emit immutable, actor-attributed, timestamped events.

## 9) CI Gate

- [ ] Governance gate passes in CI.
- [ ] No gate suppression or bypass was used.

