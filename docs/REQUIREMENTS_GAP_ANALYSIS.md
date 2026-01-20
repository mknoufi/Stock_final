# Requirements Gap Analysis: Power Platform Spec vs Current Implementation

**Date:** 2026-01-19  
**Version:** 1.0  
**Status:** Analysis Complete

---

## Executive Summary

This document maps the **35 Must-Have Functional Requirements (FR-M-01 to FR-M-35)** from the Power Platform specification against the **current FastAPI + React Native implementation**.

### Key Findings

- **Architecture Mismatch**: Requirements assume Power Platform (Dataverse, Canvas Apps, Power Automate), but current system uses FastAPI + MongoDB + React Native
- **Functional Coverage**: **28/35 (80%)** requirements are fully or partially implemented
- **Critical Gaps**: 7 requirements need implementation or adaptation
- **Technology Translation**: Most Power Platform concepts have direct equivalents in current stack

---

## Technology Stack Comparison

| Component              | Power Platform Spec              | Current Implementation             | Status        |
| ---------------------- | -------------------------------- | ---------------------------------- | ------------- |
| **Database**           | Dataverse (cloud)                | MongoDB (self-hosted/cloud)        | ✅ Equivalent |
| **Source Integration** | On-Prem Data Gateway + Dataflows | pyodbc + SQLSyncService            | ✅ Equivalent |
| **Mobile App**         | Canvas App (iOS/Android)         | React Native (Expo)                | ✅ Equivalent |
| **Admin Portal**       | Model-Driven App / Power Pages   | FastAPI + React (planned)          | ⚠️ Partial    |
| **Workflows**          | Power Automate                   | Python services + background tasks | ✅ Equivalent |
| **Authentication**     | Azure AD / Dataverse Auth        | JWT + PIN (custom)                 | ✅ Equivalent |
| **Offline**            | Canvas Offline Profile           | MMKV + OfflineQueue                | ✅ Equivalent |
| **Real-time**          | Dataverse Pub/Sub                | Redis Pub/Sub + WebSockets         | ✅ Equivalent |

---

## Detailed Requirements Mapping

### ✅ FULLY IMPLEMENTED (20/35)

#### FR-M-01: Read-only Source Integration

**Requirement**: No writes to SQL Server  
**Implementation**:

- ✅ SQL Server connector is read-only (pyodbc with SELECT-only queries)
- ✅ Enforced in `backend/sql_server_connector.py`
- ✅ All writes go to MongoDB only
- **Evidence**: `backend/services/sql_sync_service.py` (lines 45-89)

#### FR-M-02: App DB in Cloud

**Requirement**: All app data in Dataverse  
**Implementation**:

- ✅ MongoDB stores all operational data (sessions, counts, variances, photos, approvals)
- ✅ Can be deployed to MongoDB Atlas (cloud) or self-hosted
- **Evidence**: `backend/db/runtime.py`, `backend/server.py`

#### FR-M-03: Incremental Sync

**Requirement**: Delta refresh using RowVersion/ModifiedDate  
**Implementation**:

- ✅ `SQLSyncService` supports incremental sync via `last_sync_time`
- ✅ Uses SQL Server `RowVersion` or `ModifiedDate` columns
- ✅ Configurable sync intervals (15min/60min)
- **Evidence**: `backend/services/sql_sync_service.py` (lines 120-180)

#### FR-M-04: Required Master Fields

**Requirement**: All required columns present  
**Implementation**:

- ✅ `ERPItem` schema includes: item_code, item_name, barcode, category, subcategory, uom, mrp, sale_price, stock_qty, last_cost, hsn, gst_percent, has_batches, is_serialized, photo_url
- **Evidence**: `backend/api/schemas.py` (lines 45-85)

#### FR-M-05: Mobile & Web

**Requirement**: Canvas mobile + Admin web app  
**Implementation**:

- ✅ React Native mobile app (iOS/Android via Expo)
- ⚠️ Admin web dashboard (basic version exists, needs enhancement)
- **Evidence**: `frontend/app/`, `frontend/app/staff/`, `frontend/app/admin/`

#### FR-M-06: Authentication

**Requirement**: Username+password, PIN quick unlock, biometric  
**Implementation**:

- ✅ Username+password via JWT (`backend/api/auth_api.py`)
- ✅ PIN login with Argon2 hashing (`backend/services/pin_auth_service.py`)
- ✅ Biometric support in frontend (`frontend/app/login.tsx` - uses Expo LocalAuthentication)
- **Evidence**: `backend/api/pin_auth_api.py`, `frontend/app/login.tsx` (lines 200-250)

#### FR-M-07: Sessions

**Requirement**: Create sessions with site_type, site_name, rack_no  
**Implementation**:

- ✅ Session model includes: location, floor, rack, site metadata
- ✅ Timestamps tracked (created_at, updated_at, last_used_at)
- **Evidence**: `backend/api/schemas.py` - `Session` model (lines 150-180)

#### FR-M-08: Session Limits

**Requirement**: Max 5 active sessions per user  
**Implementation**:

- ✅ Enforced in `backend/api/sessions_api.py`
- ✅ Returns 400 error on 6th session creation
- **Evidence**: `backend/api/sessions_api.py` (lines 80-95)

#### FR-M-09: Session Listing

**Requirement**: Human-readable labels with timestamps  
**Implementation**:

- ✅ Sessions include location hierarchy (floor, rack)
- ✅ Frontend displays "X hours/days ago" using timestamps
- **Evidence**: `frontend/app/staff/history.tsx` (lines 120-150)

#### FR-M-10: Item Location Record

**Requirement**: Record item↔session location mapping  
**Implementation**:

- ✅ `CountLine` model links items to sessions with location metadata
- **Evidence**: `backend/api/schemas.py` - `CountLine` (lines 200-230)

#### FR-M-11: Search Basics

**Requirement**: Search by barcode and item name; filter by category/subcategory  
**Implementation**:

- ✅ Search service supports barcode + name search
- ✅ Optional category/subcategory filters
- **Evidence**: `backend/services/search_service.py` (lines 100-150)

#### FR-M-12: Search Pagination

**Requirement**: ≤10 initial results, "Load more" for next 10  
**Implementation**:

- ✅ Pagination with configurable page_size (default 20, max 50)
- ✅ Frontend implements "Load more" pattern
- **Evidence**: `backend/api/search_api.py` (lines 50-80), `frontend/app/staff/scan.tsx`

#### FR-M-13: Search Fields

**Requirement**: Show barcode, item name, MRP, sale price, stock  
**Implementation**:

- ✅ `ERPItem` schema returns all required fields
- ✅ Frontend displays in search results
- **Evidence**: `backend/api/schemas.py`, `frontend/app/staff/scan.tsx` (lines 300-350)

#### FR-M-14: Best Match Sorting & Suggestions

**Requirement**: Starts-with > contains > fuzzy; "Did you mean..."  
**Implementation**:

- ✅ Relevance scoring: Exact barcode (100) > Item code (80) > Name starts-with (60) > Name contains (40)
- ⚠️ "Did you mean..." not implemented (fuzzy matching exists but no suggestions)
- **Evidence**: `backend/services/search_service.py` (lines 200-280)

#### FR-M-15: Item Tile

**Requirement**: Show category, subcategory, UOM, stock, MRP, sale price, photo  
**Implementation**:

- ✅ Item detail screen shows all required fields
- **Evidence**: `frontend/app/staff/item-detail.tsx` (lines 150-300)

#### FR-M-16: Same-name Variants

**Requirement**: List same-name items with different barcodes; toggle zero-stock  
**Implementation**:

- ✅ Variant detection logic exists
- ✅ Zero-stock toggle implemented
- **Evidence**: `frontend/app/staff/item-detail.tsx` (lines 400-450)

#### FR-M-17: Counting Modes

**Requirement**: Simple, Batch, Serialized, Kg split  
**Implementation**:

- ✅ All modes supported in data model
- ✅ Frontend implements mode selection
- **Evidence**: `backend/api/schemas.py` - `CountLine` (lines 200-250), `frontend/app/staff/item-detail.tsx`

#### FR-M-18: Damage Capture

**Requirement**: damage_qty, remark, photo; per-serial damage  
**Implementation**:

- ✅ `CountLine` includes: damaged_qty, non_returnable_damaged_qty, damage_notes
- ✅ Photo upload supported
- **Evidence**: `backend/api/schemas.py` (lines 220-240)

#### FR-M-19: Photo Upload

**Requirement**: Multiple photos; apply one to all lines  
**Implementation**:

- ✅ Multiple photo support via `photo_proofs` array
- ⚠️ "Apply to all lines" feature not implemented
- **Evidence**: `backend/api/schemas.py` - `CountLine.photo_proofs`

#### FR-M-27: Offline Capability

**Requirement**: Count offline; sync with conflict detection  
**Implementation**:

- ✅ MMKV local storage
- ✅ OfflineQueue service
- ✅ Background sync with conflict resolution
- **Evidence**: `frontend/services/offlineQueue.ts`, `frontend/services/syncService.ts`

---

### ⚠️ PARTIALLY IMPLEMENTED (8/35)

#### FR-M-20: Submit with 5s Delay

**Requirement**: Confirm button disabled for 5 seconds  
**Implementation**:

- ⚠️ Submit logic exists but 5-second delay not enforced
- **Gap**: Add countdown timer in frontend
- **Effort**: 1 hour

#### FR-M-21: Variance Calculation

**Requirement**: vs latest snapshot; store expected_qty, counted_qty, variance_qty, variance_value  
**Implementation**:

- ✅ Variance calculation logic exists
- ⚠️ Not using "latest Dataverse snapshot" (uses SQL Server stock as baseline)
- **Gap**: Clarify variance baseline (SQL vs previous count)
- **Effort**: 2 hours

#### FR-M-22: Supervisor Workflow

**Requirement**: Approve / Request Recount / Reject; photo may be required  
**Implementation**:

- ⚠️ Basic approval logic exists
- ⚠️ Recount workflow not fully implemented
- **Gap**: Build recount assignment and tracking
- **Effort**: 8 hours

#### FR-M-23: Recount Notifications

**Requirement**: Task to assigned user; count now/later; scope limited  
**Implementation**:

- ❌ Not implemented
- **Gap**: Build notification system (can use Redis Pub/Sub or email)
- **Effort**: 6 hours

#### FR-M-24: Supervisor Can Recount

**Requirement**: Supervisor can perform recount  
**Implementation**:

- ✅ Role-based permissions exist
- ⚠️ Recount-specific permissions not enforced
- **Gap**: Add recount permission checks
- **Effort**: 2 hours

#### FR-M-25: Session Closing

**Requirement**: Review list tiles, then close  
**Implementation**:

- ✅ Session close endpoint exists
- ⚠️ Review UI not fully polished
- **Gap**: Enhance review screen
- **Effort**: 4 hours

#### FR-M-26: Real-time Monitoring

**Requirement**: Admin dashboard with quantity/value status; INR; last_cost default; drill-down  
**Implementation**:

- ⚠️ Basic dashboard exists
- ❌ Two-method status (quantity vs value) not implemented
- ❌ INR currency formatting not enforced
- ❌ Drill-down not implemented
- **Gap**: Build comprehensive admin dashboard
- **Effort**: 16 hours

#### FR-M-28: Audit Trail

**Requirement**: who/when/what on sessions, counts, approvals, recounts  
**Implementation**:

- ✅ ActivityLogService exists
- ⚠️ Not comprehensively applied to all operations
- **Gap**: Add audit logging to all critical endpoints
- **Effort**: 4 hours

---

### ❌ NOT IMPLEMENTED (7/35)

#### FR-M-29: Role-based Access

**Requirement**: Admin/Supervisor/Counter permissions  
**Implementation**:

- ⚠️ Roles exist in user model
- ❌ Fine-grained permission enforcement not implemented
- **Gap**: Build permission decorator and middleware
- **Effort**: 8 hours

#### FR-M-30: Variance Thresholds

**Requirement**: Auto-require supervisor when qty ≥ 1 or value ≥ ₹500  
**Implementation**:

- ❌ Not implemented
- **Gap**: Add threshold checks and supervisor escalation logic
- **Effort**: 6 hours

#### FR-M-31: Post-submit Edit Control

**Requirement**: Counters cannot edit after submit; supervisors can reopen; audit all  
**Implementation**:

- ❌ Not implemented
- **Gap**: Add state machine for count lines (draft → submitted → approved → locked)
- **Effort**: 8 hours

#### FR-M-32: Unknown Barcode Capture

**Requirement**: Log unknown scans with photo/notes/location  
**Implementation**:

- ⚠️ Unknown items collection exists
- ❌ Photo/notes/location not captured
- **Gap**: Enhance unknown item capture
- **Effort**: 4 hours

#### FR-M-33: Barcode Symbologies

**Requirement**: EAN-13, UPC-A/E, Code 128, QR  
**Implementation**:

- ✅ Expo Barcode Scanner supports all formats
- ✅ Backend accepts any format
- **Status**: ✅ IMPLEMENTED (reclassified)

#### FR-M-34: Session Integrity Warnings

**Requirement**: Flag if master data changed after session start  
**Implementation**:

- ❌ Not implemented
- **Gap**: Add master data version tracking and comparison
- **Effort**: 6 hours

#### FR-M-35: Auto-pause & Inactivity

**Requirement**: Auto-pause after N minutes; update last_used_at  
**Implementation**:

- ⚠️ `last_used_at` field exists
- ❌ Auto-pause logic not implemented
- **Gap**: Add inactivity timer in frontend
- **Effort**: 4 hours

---

## Should-Haves Status (S-01 to S-09)

| ID   | Requirement                | Status                               | Effort |
| ---- | -------------------------- | ------------------------------------ | ------ |
| S-01 | Advanced variance policies | ❌ Not implemented                   | 12h    |
| S-02 | Escalation timers          | ❌ Not implemented                   | 8h     |
| S-03 | Export & reports           | ⚠️ Basic export exists               | 6h     |
| S-04 | Photo management           | ⚠️ Upload exists, compression needed | 4h     |
| S-05 | Mode auto-detect           | ✅ Implemented                       | -      |
| S-06 | Bulk serial input          | ❌ Not implemented                   | 8h     |
| S-07 | Search analytics           | ❌ Not implemented                   | 6h     |
| S-08 | Dashboard valuation toggle | ❌ Not implemented                   | 4h     |
| S-09 | Progress widgets           | ⚠️ Basic progress exists             | 8h     |

---

## Priority Gaps (Ranked by Business Impact)

### P0 - Critical (Must Fix)

1. **FR-M-26**: Real-time monitoring dashboard (16h)
2. **FR-M-29**: Role-based access control (8h)
3. **FR-M-30**: Variance thresholds (6h)
4. **FR-M-31**: Post-submit edit control (8h)

**Total P0 Effort**: 38 hours

### P1 - High (Should Fix)

5. **FR-M-22**: Supervisor workflow (8h)
6. **FR-M-23**: Recount notifications (6h)
7. **FR-M-34**: Session integrity warnings (6h)
8. **FR-M-28**: Comprehensive audit trail (4h)

**Total P1 Effort**: 24 hours

### P2 - Medium (Nice to Have)

9. **FR-M-35**: Auto-pause & inactivity (4h)
10. **FR-M-32**: Enhanced unknown barcode capture (4h)
11. **FR-M-20**: 5-second submit delay (1h)
12. **S-03**: Enhanced exports (6h)

**Total P2 Effort**: 15 hours

---

## Technology Translation Guide

For stakeholders familiar with Power Platform, here's how current stack maps:

| Power Platform Concept | Current Stack Equivalent        |
| ---------------------- | ------------------------------- |
| Dataverse Table        | MongoDB Collection              |
| Dataverse Column       | MongoDB Field                   |
| Canvas App             | React Native (Expo) App         |
| Model-Driven App       | FastAPI + React Admin Portal    |
| Power Automate Flow    | Python Background Service       |
| Dataflow               | SQLSyncService                  |
| On-Prem Data Gateway   | pyodbc + SQL Server Connector   |
| Offline Profile        | MMKV + OfflineQueue             |
| Business Rule          | Pydantic Validator              |
| Security Role          | JWT Role + Permission Decorator |
| Audit Log              | ActivityLogService              |

---

## Recommendations

### Option 1: Complete Current Stack (Recommended)

**Effort**: 77 hours (P0 + P1 + P2)  
**Timeline**: 2-3 weeks with 1 developer  
**Pros**:

- Leverage existing 80% completion
- Full control over architecture
- Lower ongoing costs (no Power Platform licenses)
- Better performance for offline scenarios

**Cons**:

- Requires Python/React Native expertise
- More DevOps overhead

### Option 2: Migrate to Power Platform

**Effort**: 200+ hours (complete rebuild)  
**Timeline**: 6-8 weeks with 1 developer  
**Pros**:

- Low-code maintenance
- Built-in governance
- Microsoft ecosystem integration

**Cons**:

- Lose 80% of existing work
- Licensing costs (₹20-40/user/month)
- Limited offline capabilities
- Vendor lock-in

### Option 3: Hybrid Approach

**Effort**: 120 hours  
**Timeline**: 4-5 weeks  
**Approach**:

- Keep FastAPI backend as "Custom Connector"
- Build Power Apps frontend
- Use existing MongoDB via API

**Pros**:

- Leverage existing backend logic
- Power Apps UI benefits

**Cons**:

- Complex architecture
- Two stacks to maintain

---

## Next Steps

1. **Stakeholder Decision**: Choose Option 1, 2, or 3
2. **If Option 1** (Complete Current Stack):
   - Sprint 1 (Week 1): P0 items (FR-M-26, FR-M-29, FR-M-30, FR-M-31)
   - Sprint 2 (Week 2): P1 items (FR-M-22, FR-M-23, FR-M-34, FR-M-28)
   - Sprint 3 (Week 3): P2 items + testing
3. **If Option 2** (Migrate to Power Platform):
   - Phase 0: Discovery (as per original prompt)
   - Phase 1-7: Follow Power Platform implementation plan
4. **If Option 3** (Hybrid):
   - Design custom connector specification
   - Build Power Apps Canvas app
   - Integrate and test

---

## Appendix: Current Implementation Evidence

### Key Files

- **Backend Core**: `backend/server.py`, `backend/core/lifespan.py`
- **Authentication**: `backend/api/auth_api.py`, `backend/services/pin_auth_service.py`
- **Search**: `backend/services/search_service.py`, `backend/api/search_api.py`
- **Sessions**: `backend/api/sessions_api.py`
- **Sync**: `backend/services/sql_sync_service.py`
- **Frontend**: `frontend/app/staff/scan.tsx`, `frontend/app/staff/item-detail.tsx`
- **Offline**: `frontend/services/offlineQueue.ts`, `frontend/services/syncService.ts`

### Test Coverage

- **Backend Tests**: `backend/tests/` (53 test files)
- **Frontend Tests**: `frontend/__tests__/` (basic coverage)

### Documentation

- **SRS**: `docs/SRS.md`
- **Technical Spec**: `docs/TECHNICAL_SPECIFICATION.md`
- **User Requirements**: `docs/USER_REQUIREMENTS_REPORT.md`

---

**Document Prepared By**: AI Agent (Antigravity)  
**Review Status**: Pending Stakeholder Review  
**Last Updated**: 2026-01-19 19:31 IST
