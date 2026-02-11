# Governance SQL / ERP Integration Surfaces

This index tracks SQL-touching code paths and expected governance controls.

## Surfaces

- SQL connector and read-only guards:
- `backend/sql_server_connector.py`

- Sync services:
- `backend/services/sql_sync_service.py`
- `backend/services/sql_verification_service.py`

- SQL admin/control APIs:
- `backend/api/sql_connection_api.py`
- `backend/api/v2/items.py` (`verify_sql`)
- `backend/api/enhanced_item_api.py` (enhanced barcode lookup and sync hooks)

## Enforcement Expectations

- SQL remains read-only at runtime.
- Sync failures degrade safely and do not corrupt operational state.
- SQL connectivity/config changes are auditable.
- SQL-backed refresh behavior is explicit in workflow documentation.

