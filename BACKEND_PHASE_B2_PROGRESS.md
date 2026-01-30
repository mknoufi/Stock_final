# Backend Phase B2 - Async & Mock Governance Fix Progress
**Date: 2026-01-29**  
**Status: IN PROGRESS - Mock/Async Issues Identified**

---

## Objective
Eliminate all async/mock defects so backend CI becomes "Green = Safe Deployment"

---

## ✅ Completed Fixes

### 1. Mock/Await Conversions ✅
**Fixed:**
- Converted `Mock()` to `AsyncMock()` for database objects
- Fixed `request=Mock()` to `request=AsyncMock()`
- Updated all test methods to use proper async mocks

### 2. Test Structure Improvements ✅
**Fixed:**
- Removed invalid `mocker` fixture (not available)
- Enhanced mock_db fixture with all necessary async methods
- Added proper return values for async mocks

---

## ⚠️ Remaining Critical Issues

### Mock Patching Not Working
**Problem:** Despite patching `get_db`, the actual implementation is still using real database connections.

**Evidence:**
```
TypeError: object Mock can't be used in 'await' expression
api\count_lines_api.py:305: TypeError
```

**Root Cause:** The patch is not being applied at the right import path or there's a global database instance being used.

### Tests Still Failing
- `test_create_count_line_duplicate` - Getting 409 from real DB
- `test_create_count_line_session_stats_error` - Mock await issues

---

## 🔍 Investigation Results

### Import Path Analysis
```python
# In count_lines_api.py
from backend.db.runtime import get_db
```

### Current Patch Strategy
```python
with patch("backend.api.count_lines_api.get_db", return_value=mock_db):
```

### Issue
The patch might not be working because:
1. `get_db` might be imported at module level
2. There could be a cached global instance
3. The patch path might be incorrect

---

## 📋 Next Steps Required

### Option 1: Fix Patch Path
Need to patch where `get_db` is actually used, not where it's defined.

### Option 2: Use db_override Parameter
Some functions accept `db_override` parameter - need to pass mock_db through that.

### Option 3: Mock Global State
Mock the global database instance directly.

---

## 🎯 Immediate Actions

1. **Investigate patch path** - Check if `get_db` is being called correctly
2. **Use db_override** - Pass mock_db as override where possible
3. **Mock global state** - If patching fails, mock the global database directly

---

## 📊 Current Status

- **Tests Fixed**: 27 passed
- **Tests Failed**: 2 failed (due to mock issues)
- **Progress**: 93% of tests passing
- **Blocker**: Mock patching not working correctly

---

## 🔧 Technical Debt Identified

The test infrastructure needs:
1. Proper mock patching strategy
2. Better understanding of global database state
3. More robust async mock handling

---

**Phase B2 Status: 90% COMPLETE**  
**Critical Blocker: Mock patching**  
**Deployment Status: STILL BLOCKED**
