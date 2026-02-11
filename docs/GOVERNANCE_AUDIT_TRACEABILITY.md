# Governance Audit and Traceability

Critical actions require immutable, timestamped, actor-attributed records.

## Must-Audit Actions

- Supervisor approve/reject/recount operations
- Bulk actions
- Admin overrides and control-plane operations
- SQL configuration updates/tests
- Sync conflict resolution events

## Storage/Service Anchors

- `backend/services/count_state_machine.py` (transition log path)
- `backend/services/transition_gateway.py` (governed transition + metadata)
- `backend/services/transition_request_repository.py` (idempotent transition history)
- `backend/domain_events/publisher.py` (reliable publication)
- `backend/domain_events/outbox_repository.py` (durable outbox + dead-letter)
- `backend/api/workflow_api.py` (`/api/v1/workflow/transitions`, metrics)

## Audit Record Requirements

- Actor identity (`user_id`, role)
- Action and target entity IDs
- Timestamp (UTC)
- Result (`success`/`failed`/`conflict`)
- Reason/remarks when applicable
- Correlation/request identifiers for replay/debug

