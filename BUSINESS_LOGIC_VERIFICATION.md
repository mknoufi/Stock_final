# Phase E: Business Logic Enforcement Verification

## Golden Business Logic Verification

### 1. Item Search: MongoDB ONLY Verification

**Invariant**: Item search must query MongoDB only (no SQL traffic)

#### Verification Steps:
1. **Check Search API Implementation**
   - Verify `api/search_api.py` only queries MongoDB
   - Confirm no SQL connections in search path
   - Check that search uses `db.items.find()` only

2. **Network Traffic Analysis**
   - Monitor MongoDB queries during search
   - Verify zero SQL Server queries during search
   - Check query logs for search operations

3. **Frontend Search Implementation**
   - Confirm search endpoint is `/api/items/search`
   - Verify no SQL-related parameters in search
   - Check search results come from MongoDB schema

**Status**: ✅ VERIFIED - Search uses MongoDB only via `db.items.find()`

### 2. Item Selection: SQL Qty Verify + Mongo Writeback

**Invariant**: Item selection triggers SQL qty read + Mongo mismatch writeback

#### Verification Steps:
1. **Item Detail Flow Check**
   - Verify item selection calls SQL Server for quantity
   - Confirm MongoDB fields updated on mismatch:
     - `sql_verified_qty`
     - `last_sql_verified_at`
     - `variance`
     - `mongo_cached_qty_previous`
     - `sql_qty_mismatch_flag`

2. **SQL Read Path Verification**
   - Check `sql_server_connector.py` for qty queries
   - Verify read-only SQL access (no writes)
   - Confirm proper error handling for SQL down

3. **Mongo Writeback Verification**
   - Verify mismatch fields are updated in MongoDB
   - Check timestamp is always set
   - Confirm atomic update operation

**Status**: ⚠️ NEEDS IMPLEMENTATION - SQL qty verification not found in current code

### 3. UI Display: Mongo + SQL + Variance + Timestamp

**Invariant**: UI must display all verification data

#### Verification Steps:
1. **Frontend Item Display**
   - Check item detail components show:
     - MongoDB quantity
     - SQL quantity
     - Variance amount
     - Last verified timestamp
   - Verify proper formatting of variance (positive/negative)

2. **Real-time Updates**
   - Confirm UI updates when verification completes
   - Check loading states during SQL verification
   - Verify error states when SQL is down

**Status**: ⚠️ NEEDS IMPLEMENTATION - UI components don't show SQL verification data

### 4. SQL Down: Warning + Policy Enforcement

**Invariant**: SQL down shows warning and follows policy flag

#### Verification Steps:
1. **SQL Down Detection**
   - Verify `SQLServerConnector` detects connection failure
   - Check proper error propagation
   - Confirm graceful fallback behavior

2. **Policy Flag Implementation**
   - Check for `SQL_DOWN_POLICY` flag
   - Verify behavior modes:
     - BLOCK: Prevent counting without verification
     - PENDING_ERP_VERIFY: Allow with pending status
   - Confirm UI shows appropriate warning

3. **Warning Display**
   - Verify warning banner appears when SQL down
   - Check clear messaging about verification status
   - Confirm user can still work with limitations

**Status**: ⚠️ NEEDS IMPLEMENTATION - Policy flag system not found

## Required Implementation

### 1. SQL Quantity Verification Service

Create `services/sql_verification_service.py`:
```python
class SQLVerificationService:
    async def verify_item_quantity(self, item_code: str):
        # Read from SQL Server
        sql_qty = await sql_connector.get_item_quantity(item_code)
        
        # Read from MongoDB
        mongo_item = await db.items.find_one({"item_code": item_code})
        mongo_qty = mongo_item.get("stock_qty", 0)
        
        # Calculate variance
        variance = sql_qty - mongo_qty
        
        # Update MongoDB with verification data
        await db.items.update_one(
            {"item_code": item_code},
            {
                "$set": {
                    "sql_verified_qty": sql_qty,
                    "last_sql_verified_at": datetime.utcnow(),
                    "variance": variance,
                    "mongo_cached_qty_previous": mongo_qty,
                    "sql_qty_mismatch_flag": variance != 0
                }
            }
        )
        
        return {
            "sql_qty": sql_qty,
            "mongo_qty": mongo_qty,
            "variance": variance,
            "verified_at": datetime.utcnow()
        }
```

### 2. Frontend Verification Display

Update item detail components to show:
- SQL quantity (with "Verified" label)
- MongoDB quantity (with "Cached" label)
- Variance (with color coding)
- Last verification timestamp
- Verification status indicator

### 3. Policy Flag System

Add configuration for SQL down behavior:
```python
class SQLDownPolicy(str, Enum):
    BLOCK = "block"  # Prevent counting
    PENDING_ERP_VERIFY = "pending_erp_verify"  # Allow with warning
```

### 4. API Endpoints

Add verification endpoints:
- `POST /api/v2/items/{item_code}/verify-qty`
- `GET /api/v2/system/sql-status`
- `GET /api/v2/items/{item_code}/verification-status`

## Test Cases for Business Logic

### 1. Item Search Test
```python
def test_item_search_mongodb_only():
    # Search for item
    response = client.get("/api/items/search?query=test")
    
    # Verify only MongoDB queries were made
    assert mongo_query_count > 0
    assert sql_query_count == 0
```

### 2. SQL Verification Test
```python
def test_item_selection_sql_verification():
    # Select item
    response = client.get(f"/api/v2/items/{item_code}")
    
    # Verify SQL was queried
    assert sql_query_count > 0
    
    # Verify MongoDB was updated
    item = db.items.find_one({"item_code": item_code})
    assert "sql_verified_qty" in item
    assert "last_sql_verified_at" in item
```

### 3. SQL Down Test
```python
def test_sql_down_behavior():
    # Simulate SQL down
    sql_connector.disconnect()
    
    # Try to verify item
    response = client.get(f"/api/v2/items/{item_code}/verify-qty")
    
    # Should return appropriate error/warning
    assert response.status_code == 503
    assert "SQL unavailable" in response.json()["message"]
```

## Verification Status Summary

| Business Rule | Status | Implementation Required |
|---------------|--------|--------------------------|
| MongoDB-only search | ✅ Verified | None |
| SQL qty verification | ❌ Missing | SQL verification service |
| Mongo writeback on mismatch | ❌ Missing | Update logic in MongoDB |
| UI displays verification data | ❌ Missing | Frontend components |
| SQL down warning | ❌ Missing | Error handling and UI |
| Policy flag enforcement | ❌ Missing | Configuration system |
| Audit logging for verification | ❌ Missing | Audit log entries |

## Next Steps

1. Implement SQL verification service
2. Add verification fields to MongoDB schema
3. Update frontend to display verification data
4. Implement policy flag system
5. Add comprehensive error handling
6. Create test suite for business logic
7. Add audit logging for all verification actions
