# Implementation Plans Index

**Project**: Stock Verification System
**Date**: 2026-01-19
**Status**: Planning Phase

---

## Overview

This directory contains detailed implementation plans for closing the gaps identified in the Requirements Gap Analysis. Plans are organized by priority (P0, P1, P2) and include:

- Technical design
- Step-by-step implementation guide
- Code examples
- Testing strategies
- Success criteria

---

## P0 - Critical Priority (38 hours total)

### 1. FR-M-26: Real-Time Monitoring Dashboard

**File**: `P0-FR-M-26-Real-Time-Dashboard.md`
**Effort**: 16 hours
**Status**: Not Started

**Summary**: Build comprehensive admin dashboard with:

- Quantity-based progress tracking (units counted / total units)
- Value-based progress tracking (₹ counted / ₹ total)
- Default valuation basis: `last_cost` (toggleable to `sale_price`)
- INR currency formatting throughout
- Breakdowns by location/category/session/date
- Drill-down to item/batch/serial level
- Real-time updates every 30 seconds

**Key Components**:

- Backend: 3 new API endpoints, analytics service enhancements
- Frontend: Dashboard layout, KPI cards, breakdown views
- Database: User preferences collection, performance indexes

---

### 2. FR-M-29: Role-Based Access Control

**File**: `P0-FR-M-29-Role-Based-Access.md`
**Effort**: 8 hours
**Status**: Not Started

**Summary**: Implement fine-grained RBAC with three roles:

- **Admin**: Full system access
- **Supervisor**: Floor management, approvals, analytics
- **Counter (Staff)**: Counting operations only

**Key Components**:

- Backend: Permission system, decorators, resource ownership checks
- Frontend: Permission hooks, PermissionGate component
- 25+ granular permissions (e.g., `count:approve`, `user:delete`)

**Security Features**:

- Permission-based endpoint protection
- Resource ownership validation
- Clear 403 error messages with missing permissions

---

### 3. FR-M-30: Variance Thresholds

**File**: `P0-FR-M-30-Variance-Thresholds.md`
**Effort**: 6 hours
**Status**: Not Started

**Summary**: Auto-require supervisor approval when:

- Quantity variance ≥ 1 unit (configurable)
- Value variance ≥ ₹500 (configurable)

**Key Components**:

- Backend: Variance service, threshold checking, configuration system
- Frontend: Variance warning component, reason input
- Admin: Threshold management UI

**Features**:

- Automatic variance calculation on count submission
- Category/location-specific thresholds
- Mandatory reason codes for large variances
- Clear visual warnings in mobile app

---

### 4. FR-M-31: Post-Submit Edit Control

**File**: `P0-FR-M-31-Post-Submit-Edit-Control.md` (TODO)
**Effort**: 8 hours
**Status**: Not Started

**Summary**: Implement state machine for count lines:

- **Draft**: Editable by counter
- **Submitted**: Locked for counter, viewable by supervisor
- **Approved**: Locked for all except admin
- **Rejected**: Reopened for counter with supervisor notes

**Key Components**:

- State machine implementation
- Edit permission checks based on state
- Audit trail for all state transitions

---

## P1 - High Priority (24 hours total)

### 5. FR-M-22: Supervisor Workflow

**File**: `P1-FR-M-22-Supervisor-Workflow.md` (TODO)
**Effort**: 8 hours

**Summary**: Complete approval workflow with:

- Approve / Request Recount / Reject actions
- Photo requirement enforcement
- Batch approval capabilities

---

### 6. FR-M-23: Recount Notifications

**File**: `P1-FR-M-23-Recount-Notifications.md` (TODO)
**Effort**: 6 hours

**Summary**: Notification system for recount assignments:

- Task assignment to specific users
- "Count now" vs "Count later" options
- Scope limited to requested items only

---

### 7. FR-M-34: Session Integrity Warnings

**File**: `P1-FR-M-34-Session-Integrity-Warnings.md` (TODO)
**Effort**: 6 hours

**Summary**: Detect and flag master data changes:

- Track master data version at session start
- Compare on session close/review
- Warn if prices/stock changed during session

---

### 8. FR-M-28: Comprehensive Audit Trail

**File**: `P1-FR-M-28-Comprehensive-Audit-Trail.md` (TODO)
**Effort**: 4 hours

**Summary**: Enhance audit logging:

- Apply to all critical operations
- Capture before/after payloads
- Searchable audit log UI

---

## P2 - Medium Priority (15 hours total)

### 9. FR-M-35: Auto-Pause & Inactivity

**File**: `P2-FR-M-35-Auto-Pause-Inactivity.md` (TODO)
**Effort**: 4 hours

---

### 10. FR-M-32: Enhanced Unknown Barcode Capture

**File**: `P2-FR-M-32-Unknown-Barcode-Capture.md` (TODO)
**Effort**: 4 hours

---

### 11. FR-M-20: 5-Second Submit Delay

**File**: `P2-FR-M-20-Submit-Delay.md` (TODO)
**Effort**: 1 hour

---

### 12. S-03: Enhanced Exports

**File**: `P2-S-03-Enhanced-Exports.md` (TODO)
**Effort**: 6 hours

---

## Implementation Sequence

### Sprint 1 (Week 1): P0 Critical Items

**Goal**: Implement core governance and monitoring

1. **Days 1-2**: FR-M-29 Role-Based Access Control (8h)
   - Foundation for all other security features
   - Blocks: None
2. **Days 3-4**: FR-M-30 Variance Thresholds (6h)
   - Depends on: FR-M-29 (supervisor role)
3. **Days 5-7**: FR-M-26 Real-Time Dashboard (16h)
   - Depends on: FR-M-29 (admin role)
4. **Day 8**: FR-M-31 Post-Submit Edit Control (8h)
   - Depends on: FR-M-29 (permission system)

**Sprint 1 Deliverables**:

- ✅ RBAC system operational
- ✅ Variance thresholds enforced
- ✅ Admin dashboard live
- ✅ Count editing locked after submission

---

### Sprint 2 (Week 2): P1 High Priority Items

**Goal**: Complete supervisor workflow and integrity checks

5. **Days 9-10**: FR-M-22 Supervisor Workflow (8h)
   - Depends on: FR-M-29, FR-M-30, FR-M-31
6. **Days 11-12**: FR-M-23 Recount Notifications (6h)
   - Depends on: FR-M-22
7. **Day 13**: FR-M-34 Session Integrity Warnings (6h)
8. **Day 14**: FR-M-28 Comprehensive Audit Trail (4h)

**Sprint 2 Deliverables**:

- ✅ Full approval workflow
- ✅ Recount assignment system
- ✅ Master data change detection
- ✅ Complete audit trail

---

### Sprint 3 (Week 3): P2 Polish & Testing

**Goal**: Add nice-to-have features and comprehensive testing

9. **Day 15**: FR-M-35, FR-M-32, FR-M-20 (9h)
10. **Day 16**: S-03 Enhanced Exports (6h)
11. **Days 17-18**: Integration testing
12. **Days 19-20**: User acceptance testing
13. **Day 21**: Documentation and deployment

**Sprint 3 Deliverables**:

- ✅ All P2 features
- ✅ Full test coverage
- ✅ Updated documentation
- ✅ Production deployment

---

## Common Patterns Across Plans

### Backend Structure

All plans follow this pattern:

1. **Schemas** (`backend/api/schemas.py`) - Data models
2. **Services** (`backend/services/*.py`) - Business logic
3. **APIs** (`backend/api/*.py`) - HTTP endpoints
4. **Tests** (`backend/tests/*.py`) - Unit & integration tests

### Frontend Structure

1. **Hooks** (`frontend/hooks/*.ts`) - Reusable logic
2. **Components** (`frontend/components/*.tsx`) - UI elements
3. **Screens** (`frontend/app/*.tsx`) - Full pages
4. **Services** (`frontend/services/*.ts`) - API clients

### Testing Approach

- Unit tests for business logic
- Integration tests for API endpoints
- Component tests for UI
- E2E tests for critical flows

---

## Dependencies Between Plans

```
FR-M-29 (RBAC)
  ├─> FR-M-30 (Variance Thresholds) - needs supervisor role
  ├─> FR-M-26 (Dashboard) - needs admin role
  ├─> FR-M-31 (Edit Control) - needs permission system
  └─> FR-M-22 (Supervisor Workflow) - needs approval permission

FR-M-22 (Supervisor Workflow)
  └─> FR-M-23 (Recount Notifications) - needs recount assignment

FR-M-30 (Variance Thresholds)
  └─> FR-M-22 (Supervisor Workflow) - needs approval routing
```

**Critical Path**: FR-M-29 → FR-M-30 → FR-M-22 → FR-M-23

---

## Resource Requirements

### Development Team

- **1 Full-Stack Developer**: Can complete all plans in 3 weeks
- **OR 2 Developers** (1 Backend, 1 Frontend): Can complete in 2 weeks

### Skills Required

- **Backend**: Python, FastAPI, MongoDB, Redis
- **Frontend**: TypeScript, React Native, Expo
- **DevOps**: Docker, Git, CI/CD

### Tools & Infrastructure

- Development environment with MongoDB + Redis
- Test devices (iOS + Android)
- CI/CD pipeline for automated testing

---

## Success Metrics

### Code Quality

- [ ] All new code has ≥80% test coverage
- [ ] No critical security vulnerabilities
- [ ] Passes all linting checks

### Performance

- [ ] Dashboard loads in <2s
- [ ] API response times <500ms
- [ ] Mobile app remains responsive during sync

### User Experience

- [ ] Clear error messages for permission denials
- [ ] Intuitive variance warnings
- [ ] Smooth approval workflow

---

## Next Steps

1. **Review & Approve**: Stakeholder review of all plans
2. **Prioritize**: Confirm P0/P1/P2 priorities
3. **Assign**: Allocate developers to Sprint 1
4. **Kickoff**: Begin implementation of FR-M-29 (RBAC)

---

## Document Maintenance

- **Owner**: Development Team Lead
- **Review Frequency**: Weekly during implementation
- **Update Trigger**: Scope changes, blockers, or completion

---

**Last Updated**: 2026-01-19
**Next Review**: 2026-01-22 (Sprint 1 Kickoff)
