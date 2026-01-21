# Final Requirements - Stock Verification System

## 1. Mission Statement

Implement an offline-first Stock Verification System with:

- **SQL Server** as READ-ONLY ERP source.
- **MongoDB** as primary operational store (backend).
- **Mobile apps** (iOS + Android, Expo RN) for staff and supervisors.
- **Admin web dashboard** for monitoring, reports, and settings.
- **Architecture**: Minimal SQL traffic; scheduled/triggered sync from SQL → Mongo; mobile reads strictly from Mongo.

## 2. Non-Negotiable Rules

1. **SQL Server is READ-ONLY forever**. No writes, no stored procedure mutations, no UPDATE/INSERT/DELETE.
2. **Minimize SQL traffic**: only scheduled/triggered pull jobs; never query SQL on every scan.
3. **Mobile never talks to SQL**. Mobile talks only to backend API (Mongo-backed).
4. **Offline-first**: all mobile writes go into local offline queue and submit later.
5. **Sync idempotency**: Sync must be idempotent and retry-safe.
6. **Session limit**: Max 5 active sessions per user.
7. **Quality**: Every critical fix must include tests; no `ts-ignore`/`any` hacks.

## 3. Roles

- **Staff**: Conducts physical verification, scans items, enters counts, captures damage proofs.
- **Supervisor**: Reviews variances, approves/rejects counts, mandates recounts, manages on-floor exceptions.
- **Admin**: Manages system settings, users, sync schedules, and views comprehensive reports (web dashboard).

## 4. Data Entities

### 4.1 Item (Synced from SQL → Mongo)

- **Identity**: `barcode(s)`, `item_name`, `sql_item_id` (or unique key).
- **Pricing & Stock**: `mrp`, `sale_price`, `stock_qty`, `uom`.
- **Purchase Info**: `last_purchase_price`, `last_purchase_qty`, `hsn`, `gst_percentage`, `last_supplier`, `purchase_voucher_type`, `last_purchase_cost`.
- **Classification**: `category`, `sub_category`.
- **Batching**: `batch_details` (if tracked).
- **Meta**: `last_sql_sync_at`, `change_hash`.

### 4.2 Session

- **Fields**: `session_id` (uuid), `user_id`, `location_type` (SHOWROOM/GODOWN), `location_name` (Floor/Section), `rack_no`.
- **Status**: `ACTIVE`, `CLOSED`, `SUBMITTED`, `VERIFIED`, `ARCHIVED`.
- **Timestamps**: `created_at`, `last_used_at`, `closed_at`.
- **Constraints**: Max 5 `ACTIVE` per user.

### 4.3 CountLine

- **Identity**: `count_line_id`, `session_id`, `item_id`.
- **Data**: `counted_qty` (int/decimal), `uom`, `kg_split_mode` (bool).
- **Verification**: `expected_qty_snapshot` (at time of count), `variance_qty`, `variance_value_basis` (INT vs LAST_COST).
- **Status**: `DRAFT`, `SUBMITTED`, `PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `LOCKED`.
- **Meta**: `remark`, `created_by`, `updated_by`, `timestamps`, `attachments_count`.

### 4.4 BatchEntry (Embedded/Linked)

- **Fields**: `count_line_id`, `batch_no`, `mfg_date`, `exp_date`, `qty`.
- **Media**: `common_photo_refs`.

### 4.5 SerialEntry (Embedded/Linked)

- **Fields**: `count_line_id`, `serial_no`.
- **Grouping**: Shared `mfg`/`exp` for group entries.
- **Condition**: `damaged` (bool), `damage_remark`, `damage_photo_refs`.

### 4.6 DamageEntry & Attachments

- **Damage**: `qty`, `remark`, `photo_proof`.
- **Attachment**: `entity_type` (count_line/batch/serial/damage), `entity_id`, `file_url`, `captured_by`, `created_at`.

### 4.7 Workflow Entities

- **Approval**: Supervisor decision, remarks, proofs.
- **RecountRequest**: Assigned user, notification status (`NEW`/`SEEN`/`IN_PROGRESS`/`DONE`).

## 5. Workflows

### 5.1 System Startup & Sync

- **Backend Sync Service** pulls from SQL Server (Change Detection/Scheduled).
- Updates MongoDB `items` collection.
- Logs sync stats.

### 5.2 Login & Session

- **Login**: Username/Password or PIN (Backend Auth). Biometric unlock local only.
- **Session**: User selects Location -> Rack. System checks "Max 5" rule.
- **History**: Display formatted "used X hr ago".

### 5.3 Search & Scan (Serial Scan Engine)

- **Engine**: Client-side rule engine (Serial vs Item vs Auto).
- **Rules**:
  - **Code39/128**: Normalized (trim + uppercase + no space).
  - **QR/DataMatrix**: Trim only.
  - **Dedupe**: Strict frame-safe debouncing and single-source deduplication.
  - **Modes**: SERIAL (reject EAN), ITEM (reject Serial-like), AUTO.

### 5.4 Count & Submit

- **Entry**: Single, Batch, or Serialized (with bulk/group entry).
- **Photo**: Optional item photo or mandatory damage proof.
- **Submit**: 5-second safety delay -> Local Queue -> Background Sync.

### 5.5 Supervisor Review

- **View**: Variances and Damage reports.
- **Action**: Approve or Reject (requires Remark).
- **Recount**: Assign to Staff -> Staff gets Notification -> Targeted Recount UI.

### 5.6 Admin Monitoring

- **Real-time**: Active sessions, online staff.
- **Reports**: Variance analysis, productivity, audit trails.

## 6. Non-Functional Requirements

- **Offline-First**: Robust queue, background sync, retry caps.
- **Idempotency**: All write APIs must handle duplicate submissions safely.
- **Observability**: Structured logs, correlation IDs, health metrics.
- **Security**: LAN-only SQL access (via Sync Bridge), JWT auth, rate limiting.
- **Performance**: Mobile loads from Mongo (fast reads), no direct SQL latency.
- **Reliability**: Jest/Playwright tests for critical paths (Session limits, Dedupe, Queue).
