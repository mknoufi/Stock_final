# Implementation Checklist

## Phase 0: Requirements & Architecture

- [x] Create `FINAL_REQUIREMENTS.md`
- [x] Create `ARCHITECTURE.md` with Data Flow Diagrams
- [x] Define Sync Bridge Pattern constraint

## Phase 1: Data Model (Mongo + API)

- [x] **Items Collection**
  - [x] Schema mapping (SQL fields + Sync Meta)
  - [ ] `last_sql_sync_at` & `change_hash` indices
- [x] **Sessions Collection**
  - [x] Session ID (UUID) & User Link
  - [x] Location/Rack fields
  - [x] Status Enum (ACTIVE/CLOSED etc)
  - [x] Max 5 Active Limit check
- [x] **CountLines Collection**
  - [x] Variance calculation logic
  - [x] Status workflow (DRAFT -> LOCKED)
- [x] **API Endpoints**
  - [x] `POST /api/auth/login` (Token)
  - [x] `POST /api/sessions` (Limit check logic)
  - [x] `POST /api/count-lines` (Draft creation)
  - [ ] `POST /api/sync/batch` (Idempotent offline queue handler)

## Phase 2: SQL Sync Service

- [x] **Sync Bridge Agent** (Local LAN)
  - [x] SQL Connect (Read-Only)
  - [x] Change Detection (via Qty Compare)
  - [x] Push to Backend API (POST /api/erp/sync/batch)
- [x] **Backend Handler**
  - [x] `POST /api/erp/sync/batch` endpoint
  - [x] Conflict resolution logic (Upsert with Qty Delta)

## Phase 3: Mobile UX (Expo)

- [ ] **Login Screen**
  - [ ] Token storage & refresh
- [ ] **Session Screen**
  - [ ] "Used X hr ago" formatted list
  - [ ] Create Session Form
- [ ] **Search Screen**
  - [ ] Barcode/Name search toggle
  - [ ] Cursor pagination
- [ ] **Counting Screen**
  - [ ] Item Detail Tile
  - [ ] Single/Batch/Serial entry forms
  - [ ] **Serial Scan Engine Integration** (Phase X)
  - [ ] Damage Photo Layout
  - [ ] 5-second Submit safety button
- [ ] **Offline Queue**
  - [ ] Local persistence (SQLite/AsyncStorage)
  - [ ] Background Sync Worker
  - [ ] Retry Policy

## Phase 4: Supervisor Workflow

- [ ] **Variance Review UI**
- [ ] **Approval Actions** (Approve/Reject/Recount)
- [ ] **Recount Notification**

## Phase 5: Admin Web

- [ ] **Dashboard** (Real-time stats)
- [ ] **Reports** (Variance, Productivity)
- [ ] **Settings** (Sync Interval Config)

## Phase 6: Security & Reliability

- [ ] **Security**
  - [ ] Rate Limiting (Login/Sync)
  - [ ] JWT Refresh Rotation
- [ ] **CI/CD**
  - [ ] Lint/Typecheck Gates
  - [ ] Dependency Audit

## Phase 7: Testing

- [ ] **Unit Tests**
  - [ ] Session Limit logic
  - [ ] Serial Scan Rules
  - [ ] Offline Queue Idempotency
- [ ] **Integration Tests**
  - [ ] Full Sync Flow

## Phase X: Serial Scan Engine (Mandatory)

- [x] `serialScanRules.ts` (Rule Engine)
- [x] `useScanGate.ts` (Frame Lock)
- [x] `SerialScannerScreen.tsx` (UI)
- [ ] Integration into Counting Flow (Item Detail Button)
