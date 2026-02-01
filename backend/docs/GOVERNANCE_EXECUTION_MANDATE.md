# Developer Execution Mandate: SQL Verification Governance
**Status:** ACTIVE | **Enforcement:** CI/CD & Peer Review | **Version:** 1.0

> **WARNING:** This document defines the **immutable core controls** for the Stock Verification System. Any code change violating these rules will automatically FAIL build pipelines and be rejected by compliance logic.

---

## 🚫 1. Absolute Prohibitions (Zero Tolerance)

1.  **NO Bypassing SQL Authority**: Logic must NEVER update `stock_qty` (Mongo) without a preceding, successful read from `SQLServerConnector` (SQL).
2.  **NO Weakening of Strict Mode**: The default value for `SQL_VERIFY_STRICT` in code MUST remain `True` (or equivalent defensive parsing). Only explicit environment overrides are allowed.
3.  **NO Blind Updates**: Updates to `erp_items` must ALWAYS use Optimistic Locking (query `stock_qty` in the filter). `update_one({"_id": ...}, ...)` without a version/state check is FORBIDDEN.
4.  **NO Schema Loosening**: The `governance_events` logging structure is fixed. You may ADD fields, but you must NEVER remove `variance`, `seq`, `latency_ms`, `status`, or `policy`.
5.  **NO Free-Text Statuses**: Status assignment must strictly adhere to `MATCH`, `MISMATCH`, and `CONFLICT` constants/enums.

---

## ✅ 2. Mandatory Test Contracts (CI Gates)

All Pull Requests affecting `backend/services/sql_verification_service.py` MUST pass these checks:

### Test A: The "Shrinkage Rejection" Test
*   **Input**: Mock SQL returns `qty=100`, Mongo has `qty=20000` (Variance = 19900).
*   **Context**: `SQL_MAX_VARIANCE=10000`.
*   **Required Outcome**: Service returns `error`, Status `ERROR`. Database **UNTOUCHED**.

### Test B: The "Fingerprint" Test
*   **Action**: Perform any verification.
*   **Required Outcome**: The inserted `governance_events` document MUST contain a `policy` object matching the active config.

### Test C: The "Race Condition" Test (Conflict Forking)
*   **Setup**: Read Item A.
*   **Action**: Modify Item A in Mongo (background thread).
*   **Trigger**: Attempt to finalize verification of Item A.
*   **Required Outcome**:
    1.  Update FAILS (modified count 0).
    2.  `verification_conflicts` collection receives a FORK record.
    3.  Service returns `status="conflict"`.

---

## 🔒 3. Code Review Checklist (Manual Gate)

Reviewers MUST verify:

- [ ] **Alias Guard**: Does the SQL query use `as verified_qty`?
- [ ] **Defensive Config**: Is `_env_bool` used for toggles?
- [ ] **Sink Verification**: Is data strictly written to `governance_events`?
- [ ] **Parallelism**: Is `asyncio.gather` used for batches?

---

## 📜 4. Operational Locks

*   **Production**: `SQL_VERIFY_STRICT=True` is HARD-LOCKED.
*   **Logs**: `governance_events` are append-only.
*   **Alerts**: Alert on any `governance_event` where `status=ERROR` or `status=CONFLICT`.

---

**Signed:** _Stock Verify Governance Bot (v1.2)_
**Date:** 2026-02-01
**Effectiveness:** IMMEDIATE
