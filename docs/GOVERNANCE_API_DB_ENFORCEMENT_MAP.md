# Governance API + DB Enforcement Map

If a rule has no server-side enforcement, the rule is considered absent.

| Rule | API Guard | DB/Mutation Enforcement |
| --- | --- | --- |
| Role-restricted route access | Auth dependencies + role checks in backend routers | N/A (auth layer) |
| Session transition validity | `SessionStateMachine.can_transition(...)` in session APIs | Status updates constrained by explicit transition checks |
| Count line transition validity | `StateTransition.can_transition(...)` and transition gateway | Controlled mutation path in command/state-machine services |
| Offline sync idempotency | `/api/sync/batch` record processing | Upsert by `client_record_id` in verification records |
| Sync conflict resolution | sync conflict APIs with permissions | conflict record status mutations persisted server-side |
| Unknown-item admin mapping | admin unknown item endpoints | update/delete mutations on unknown item records |
| SQL read-only discipline | sql connector query guards | runtime blocked non-SELECT execution |
| Audit event persistence | workflow and domain event services | immutable append-style logs/outbox records |

## Primary Anchor Files

- `backend/api/session_management_api.py`
- `backend/api/count_lines_api.py`
- `backend/services/count_state_machine.py`
- `backend/services/transition_gateway.py`
- `backend/api/sync_batch_api.py`
- `backend/sql_server_connector.py`
- `backend/domain_events/outbox_repository.py`

