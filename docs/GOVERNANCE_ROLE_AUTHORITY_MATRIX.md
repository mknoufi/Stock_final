# Governance Role Authority Matrix

Authority is enforced server-side first, UI second.

## Roles

- `staff`
- `supervisor`
- `admin`

## Matrix

| Capability | Staff | Supervisor | Admin | Enforcement Anchors |
| --- | --- | --- | --- | --- |
| Access staff routes | Yes | Limited/implicit | Limited/implicit | `frontend/app/staff/_layout.tsx`, API auth checks |
| Access supervisor routes | No | Yes | Yes | `frontend/app/supervisor/_layout.tsx` |
| Access admin routes | No | No | Yes | `frontend/app/admin/_layout.tsx` |
| Create/Resume own sessions | Yes | Yes | Yes (if routed) | `backend/api/session_management_api.py` |
| Submit count lines | Yes | Yes | Yes | `backend/api/count_lines_api.py`, command service |
| Approve/Reject variances | No | Yes | Yes | `backend/services/count_state_machine.py`, supervisor APIs |
| Recount assignment/actions | No | Yes | Yes | supervisor workflow + state machine |
| User management | No | No | Yes | `backend/api/user_management_api.py` |
| Permission management | No | No | Yes | permission APIs and role checks |
| SQL config control | No | No | Yes | admin control/sql APIs |
| Security dashboards | No | No | Yes | `backend/api/security_api.py` |
| Sync conflict resolution | No | Yes (if permitted) | Yes | `backend/api/sync_conflicts_api.py` |

## Non-Negotiables

- Layout guards are insufficient alone.
- Every critical action requires API-level authorization.
- Privilege escalation via frontend-only checks is invalid.

