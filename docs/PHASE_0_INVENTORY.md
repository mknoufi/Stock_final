# Phase 0: Inventory & Discovery (Stock Verification System)

## 1. Environment & Architecture

- **Frontend**: React Native (Expo) - Mobile & Web
- **Backend**: Python FastAPI
- **Database (App)**: MongoDB (Dataverse equivalent)
- **Source ERP**: SQL Server 2019 (Polosys ERP)
- **Integration**: Direct SQL Connection via `pyodbc`, managed by `SQLSyncService`.

## 2. Table Inventory (MongoDB Collections)

- `users`: Auth credentials, roles (Admin, Supervisor, Staff)
- `erp_items`: Synced read-only items from SQL (Item Master)
- `sessions`: Counting sessions (Header)
- `count_lines`: Individual count records (Lines)
- `state_transitions`: Audit logs for workflow states
- `sync_queue`: Offline-to-Online sync buffer
- `system_config`: App configurations

## 3. Integration & Dataflow

- **SQLSyncService**:
  - `nightly_full_sync`: Full verification (TOP 50000 limit).
  - `sync_variance_only`: Delta refresh based on quantity changes.
  - `discover_new_items`: Incremental addition of new items.
- **Mappings**: Defined in `backend/db_mapping_config.py`.
  - Maps `Products`, `ProductBatches` -> `erp_items`.

## 4. Offline Setup

- **Frontend Cache**: Async Storage / SQLite (Expo).
- **Sync Strategy**:
  - Offline Queue (`offlineStorage.ts`).
  - Optimistic updates on frontend.
  - Background sync when online.

## 5. Security & Roles

- **Auth**: JWT Bearer Tokens.
- **Roles**:
  - `admin`: Full access, dashboard, config.
  - `supervisor`: Approve/Reject, Recount, Assign.
  - `staff`: Count, Scan, Submit.

## 6. Read-Only Proof

- `backend/sql_server_connector.py` contains **only SELECT statements** (`_build_query`).
- No `INSERT`, `UPDATE`, `DELETE` methods exist for SQL Server.
- Write operations target `mongo_db` only.
