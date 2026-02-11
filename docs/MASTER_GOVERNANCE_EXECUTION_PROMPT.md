# MASTER GOVERNANCE EXECUTION PROMPT

## Workflow, Authority, Data-Integrity Control Plane

## Objective

Establish and enforce a single source of operational truth derived from code. Prevent undocumented behavior, role bleed, illegal state transitions, and data corruption across online and offline flows.

## Scope

This control prompt applies to all frontend routes, backend APIs, background sync jobs, and database mutations for:

- Authentication and role routing
- Staff workflows
- Supervisor workflows
- Admin workflows
- Offline sync and reconciliation
- SQL / ERP integration surfaces

## Step 1 - Freeze Workflow Truth

- Treat `docs/CODE_DERIVED_USER_WORKFLOW_DIAGRAMS.md` as Workflow Spec v1.0.
- No route, API, or role behavior may be added or modified without updating this spec.
- Any runtime deviation from the spec is release-blocking.

## Step 2 - Acceptance Criteria Extraction

- Derive Given / When / Then criteria per workflow step.
- Map each criterion to:
- Frontend route guards
- Backend API authorization checks
- Request/response invariants
- No criterion may exist only in UI logic.

## Step 3 - State Machine Enforcement

- Extract explicit states for sessions, count lines, verification records, and sync batches.
- Define allowed and forbidden transitions.
- Enforce transitions at API and database mutation layers.
- Illegal transitions must hard-fail.

## Step 4 - Offline Sync Invariants

- Every offline write must be idempotent.
- Duplicate submissions must be safely rejected or merged.
- Partial sync failures must be resumable without data loss.
- Conflict resolution rules must be deterministic and documented.
- Offline behavior must never rely on UI assumptions.

## Step 5 - Role Authority Matrix

- Define explicit authority for staff, supervisor, and admin.
- Separate supervisor operational powers vs admin governance powers.
- Enforce authority at API layer, not only in frontend layouts.
- Privilege escalation is a critical defect.

## Step 6 - Failure Path Enumeration

Define enforced behavior for:

- Authentication expiry
- Network loss
- Offline queue corruption
- Sync conflicts
- SQL / ERP mismatches
- Partial bulk-action failures

No failure path may be undefined.

## Step 7 - API Guard and Database Constraint Mapping

For each workflow rule:

- Define enforcing API guard.
- Define enforcing database constraint (unique keys, optimistic locks, immutability, or equivalent).

If a rule cannot be enforced server-side, the rule is non-existent.

## Step 8 - Audit and Traceability

Critical actions must produce immutable, actor-attributed, timestamped audit records:

- Supervisor approvals and rejections
- Bulk operations
- Admin overrides
- SQL configuration changes
- Sync conflict resolutions

## Step 9 - CI and Release Gate

CI must fail when:

- New route/API is introduced without workflow spec updates
- Acceptance criteria updates are missing
- State transitions are changed without enforcement artifacts

No manual override is allowed for these gates.

## Final Enforcement Rule

Code is not complete unless behavior is documented, guarded, enforceable, and auditable.

