# Governance State Machines

State models extracted from backend workflow code.

## Session State Machine

Source: `backend/services/session_state_machine.py`

States:

- `OPEN`
- `ACTIVE`
- `PAUSED`
- `RECONCILE`
- `COMPLETED`
- `CLOSED`
- `CANCELLED`

Allowed transitions:

- `OPEN -> ACTIVE | RECONCILE | CANCELLED`
- `ACTIVE -> PAUSED | RECONCILE | COMPLETED | CLOSED | CANCELLED`
- `PAUSED -> ACTIVE | COMPLETED | CLOSED | CANCELLED`
- `RECONCILE -> CLOSED | COMPLETED`
- `COMPLETED -> CLOSED`

Forbidden transitions:

- Any transition not listed above

Enforcement:

- `SessionStateMachine.can_transition(...)`
- Session APIs in `backend/api/session_management_api.py`

## Count Line State Machine

Source: `backend/services/count_state_machine.py`

States:

- `draft`
- `submitted`
- `pending_approval`
- `approved`
- `rejected`
- `recount_assigned`
- `recount_submitted`
- `locked`

Role-governed transitions:

- `draft -> submitted` (`staff|supervisor|admin`)
- `submitted -> pending_approval` (`system`)
- `submitted -> draft` (`supervisor|admin`)
- `pending_approval -> approved|rejected` (`supervisor|admin`)
- `approved -> locked|draft` (`admin`)
- `rejected -> recount_assigned|draft` (`supervisor|admin` for recount_assigned, `admin` for draft)
- `recount_assigned -> recount_submitted|rejected`
- `recount_submitted -> pending_approval` (`system`)

Forbidden transitions:

- Any transition not listed above
- All transitions from `locked`

Enforcement:

- `StateTransition.can_transition(...)`
- `CountLineStateMachine.transition(...)`
- Transition gateway wrappers in `backend/services/transition_gateway.py`

## Sync Batch Processing States

Source: `backend/api/sync_batch_api.py`

Observed operational statuses:

- per record: `ok`, `conflict`, `error`
- verification record storage marks `sync_status = "synced"` on success

Invariant:

- Sync processing must be idempotent for retried submissions.

