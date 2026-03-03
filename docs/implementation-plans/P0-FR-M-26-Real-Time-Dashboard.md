# Implementation Plan: FR-M-26 Real-Time Monitoring Dashboard

**Priority**: P0 - Critical
**Effort Estimate**: 16 hours
**Status**: Not Implemented
**Owner**: TBD
**Target Sprint**: Sprint 1

---

## Requirement

**FR-M-26**: Admin dashboard with **two-method status**:

- **Quantity Method**: Total counted qty / Total stock qty with % complete
- **Value Method (₹)**: Total counted value / Total stock value with % complete
  - **Default basis**: `last_cost` (toggleable to `sale_price`)
- Breakdowns by location/category/session/date
- Drill-down to item/batch/serial level

---

## Current State

**Existing Components**:

- ✅ Basic analytics API exists (`backend/api/analytics_api.py`)
- ✅ Analytics service with session stats (`backend/services/analytics_service.py`)
- ⚠️ Admin dashboard UI exists but lacks comprehensive KPIs
- ❌ Two-method status (quantity vs value) not implemented
- ❌ INR currency formatting not enforced
- ❌ Drill-down not implemented

**Files to Modify**:

- `backend/api/analytics_api.py` - Add new endpoints
- `backend/services/analytics_service.py` - Add calculation logic
- `frontend/app/admin/dashboard.tsx` - Build comprehensive UI
- `backend/api/schemas.py` - Add response models

---

## Technical Design

### 1. Backend API Endpoints

#### 1.1 GET `/api/v1/analytics/dashboard/overview`

**Response Schema**:

```python
class DashboardOverview(BaseModel):
    quantity_status: QuantityStatus
    value_status: ValueStatus
    last_updated: datetime
    active_sessions: int
    total_users: int

class QuantityStatus(BaseModel):
    total_stock_qty: float
    total_counted_qty: float
    completion_percentage: float
    items_counted: int
    items_total: int

class ValueStatus(BaseModel):
    basis: Literal["last_cost", "sale_price"]  # Default: last_cost
    currency: str = "INR"
    total_stock_value: float
    total_counted_value: float
    completion_percentage: float
    variance_value: float
```

**Calculation Logic**:

```python
async def calculate_dashboard_overview(
    db: AsyncIOMotorDatabase,
    valuation_basis: str = "last_cost"
) -> DashboardOverview:
    # 1. Get all items from erp_items
    all_items = await db.erp_items.find({}).to_list(None)

    # 2. Get all count lines from active sessions
    active_sessions = await db.sessions.find({"status": "active"}).to_list(None)
    session_ids = [s["_id"] for s in active_sessions]

    count_lines = await db.count_lines.find({
        "session_id": {"$in": session_ids}
    }).to_list(None)

    # 3. Calculate quantity metrics
    total_stock_qty = sum(item.get("stock_qty", 0) for item in all_items)
    total_counted_qty = sum(line.get("counted_qty", 0) for line in count_lines)
    qty_completion = (total_counted_qty / total_stock_qty * 100) if total_stock_qty > 0 else 0

    # 4. Calculate value metrics
    price_field = "last_cost" if valuation_basis == "last_cost" else "sale_price"

    total_stock_value = sum(
        item.get("stock_qty", 0) * item.get(price_field, 0)
        for item in all_items
    )

    # Map counted items to their prices
    item_price_map = {item["item_code"]: item.get(price_field, 0) for item in all_items}

    total_counted_value = sum(
        line.get("counted_qty", 0) * item_price_map.get(line.get("item_code"), 0)
        for line in count_lines
    )

    value_completion = (total_counted_value / total_stock_value * 100) if total_stock_value > 0 else 0

    return DashboardOverview(
        quantity_status=QuantityStatus(
            total_stock_qty=total_stock_qty,
            total_counted_qty=total_counted_qty,
            completion_percentage=round(qty_completion, 2),
            items_counted=len(set(line["item_code"] for line in count_lines)),
            items_total=len(all_items)
        ),
        value_status=ValueStatus(
            basis=valuation_basis,
            currency="INR",
            total_stock_value=round(total_stock_value, 2),
            total_counted_value=round(total_counted_value, 2),
            completion_percentage=round(value_completion, 2),
            variance_value=round(total_counted_value - total_stock_value, 2)
        ),
        last_updated=datetime.utcnow(),
        active_sessions=len(active_sessions),
        total_users=await db.users.count_documents({})
    )
```

#### 1.2 GET `/api/v1/analytics/dashboard/breakdown`

**Query Parameters**:

- `group_by`: location | category | session | date
- `valuation_basis`: last_cost | sale_price

**Response Schema**:

```python
class DashboardBreakdown(BaseModel):
    group_by: str
    items: List[BreakdownItem]

class BreakdownItem(BaseModel):
    label: str  # e.g., "Showroom - First Floor"
    quantity_status: QuantityStatus
    value_status: ValueStatus
    session_count: int
    last_activity: datetime
```

#### 1.3 GET `/api/v1/analytics/dashboard/drilldown/{group_id}`

**Response**: Detailed item-level data for a specific group

---

### 2. Frontend Implementation

#### 2.1 Dashboard Layout

```typescript
// frontend/app/admin/dashboard.tsx

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';

export default function AdminDashboard() {
  const [valuationBasis, setValuationBasis] = useState<'last_cost' | 'sale_price'>('last_cost');
  const [groupBy, setGroupBy] = useState<'location' | 'category' | 'session' | 'date'>('location');

  const { data: overview, isLoading } = useQuery({
    queryKey: ['dashboard-overview', valuationBasis],
    queryFn: () => fetchDashboardOverview(valuationBasis),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: breakdown } = useQuery({
    queryKey: ['dashboard-breakdown', groupBy, valuationBasis],
    queryFn: () => fetchDashboardBreakdown(groupBy, valuationBasis),
    refetchInterval: 60000,
  });

  return (
    <ScrollView style={styles.container}>
      {/* Header with Valuation Toggle */}
      <View style={styles.header}>
        <Text style={styles.title}>Stock Verification Dashboard</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, valuationBasis === 'last_cost' && styles.toggleActive]}
            onPress={() => setValuationBasis('last_cost')}
          >
            <Text>Last Cost</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, valuationBasis === 'sale_price' && styles.toggleActive]}
            onPress={() => setValuationBasis('sale_price')}
          >
            <Text>Sale Price</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* KPI Cards */}
      <View style={styles.kpiRow}>
        <KPICard
          title="Quantity Progress"
          value={`${overview?.quantity_status.completion_percentage}%`}
          subtitle={`${overview?.quantity_status.total_counted_qty} / ${overview?.quantity_status.total_stock_qty} units`}
          icon="📦"
        />
        <KPICard
          title="Value Progress"
          value={`${overview?.value_status.completion_percentage}%`}
          subtitle={`₹${formatCurrency(overview?.value_status.total_counted_value)} / ₹${formatCurrency(overview?.value_status.total_stock_value)}`}
          icon="💰"
        />
      </View>

      {/* Breakdown Section */}
      <View style={styles.breakdownSection}>
        <View style={styles.breakdownHeader}>
          <Text style={styles.sectionTitle}>Breakdown</Text>
          <SegmentedControl
            values={['Location', 'Category', 'Session', 'Date']}
            selectedIndex={['location', 'category', 'session', 'date'].indexOf(groupBy)}
            onChange={(index) => setGroupBy(['location', 'category', 'session', 'date'][index])}
          />
        </View>

        {breakdown?.items.map((item) => (
          <BreakdownCard
            key={item.label}
            item={item}
            onPress={() => navigateToDrilldown(item.label)}
          />
        ))}
      </View>
    </ScrollView>
  );
}
```

#### 2.2 KPI Card Component

```typescript
function KPICard({ title, value, subtitle, icon }) {
  return (
    <View style={styles.kpiCard}>
      <Text style={styles.kpiIcon}>{icon}</Text>
      <Text style={styles.kpiTitle}>{title}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiSubtitle}>{subtitle}</Text>
      <ProgressBar percentage={parseFloat(value)} />
    </View>
  );
}
```

#### 2.3 Currency Formatting Utility

```typescript
// frontend/utils/currency.ts

export function formatCurrency(value: number | undefined, currency: string = "INR"): string {
  if (value === undefined) return "0.00";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(value)
    .replace("₹", ""); // Return without symbol for flexibility
}

export function formatINR(value: number | undefined): string {
  return `₹${formatCurrency(value)}`;
}
```

---

### 3. Database Schema Updates

#### 3.1 Add User Preferences Collection

```python
# Store per-user dashboard preferences
user_preferences = {
    "_id": ObjectId(),
    "user_id": "user_id_here",
    "dashboard_valuation_basis": "last_cost",  # or "sale_price"
    "dashboard_group_by": "location",
    "created_at": datetime.utcnow(),
    "updated_at": datetime.utcnow()
}
```

#### 3.2 Add Indexes for Performance

```python
# In backend/db/initialization.py

async def create_analytics_indexes(db):
    # Index for fast session queries
    await db.sessions.create_index([("status", 1), ("created_at", -1)])

    # Index for count line aggregations
    await db.count_lines.create_index([("session_id", 1), ("item_code", 1)])

    # Index for item lookups
    await db.erp_items.create_index([("item_code", 1), ("stock_qty", 1)])
```

---

## Implementation Steps

### Phase 1: Backend (8 hours)

1. **Hour 1-2**: Update schemas
   - Add `DashboardOverview`, `QuantityStatus`, `ValueStatus` models
   - Add `DashboardBreakdown`, `BreakdownItem` models
   - Add `UserPreferences` model

2. **Hour 3-5**: Implement analytics service methods
   - `calculate_dashboard_overview()`
   - `calculate_dashboard_breakdown()`
   - `get_drilldown_data()`

3. **Hour 6-7**: Create API endpoints
   - GET `/api/v1/analytics/dashboard/overview`
   - GET `/api/v1/analytics/dashboard/breakdown`
   - GET `/api/v1/analytics/dashboard/drilldown/{group_id}`
   - POST `/api/v1/analytics/dashboard/preferences` (save user preference)

4. **Hour 8**: Add indexes and optimize queries

### Phase 2: Frontend (6 hours)

5. **Hour 9-10**: Build dashboard layout
   - Header with valuation toggle
   - KPI cards (quantity + value)
   - Breakdown section with group-by selector

6. **Hour 11-12**: Implement components
   - `KPICard` component
   - `BreakdownCard` component
   - `ProgressBar` component

7. **Hour 13-14**: Add drill-down navigation
   - Drill-down screen
   - Item-level detail view

### Phase 3: Testing & Polish (2 hours)

8. **Hour 15**: Testing
   - Unit tests for calculation logic
   - Integration tests for API endpoints
   - Frontend component tests

9. **Hour 16**: Polish & Documentation
   - Add loading states
   - Add error handling
   - Update user guide

---

## Testing Plan

### Unit Tests

```python
# backend/tests/test_analytics_dashboard.py

async def test_calculate_dashboard_overview():
    # Setup: Create mock items and count lines
    await db.erp_items.insert_many([
        {"item_code": "ITEM001", "stock_qty": 100, "last_cost": 50, "sale_price": 75},
        {"item_code": "ITEM002", "stock_qty": 50, "last_cost": 100, "sale_price": 150},
    ])

    await db.count_lines.insert_many([
        {"item_code": "ITEM001", "counted_qty": 80, "session_id": "session1"},
    ])

    # Execute
    overview = await calculate_dashboard_overview(db, "last_cost")

    # Assert
    assert overview.quantity_status.total_stock_qty == 150
    assert overview.quantity_status.total_counted_qty == 80
    assert overview.quantity_status.completion_percentage == 53.33

    assert overview.value_status.total_stock_value == 10000  # (100*50 + 50*100)
    assert overview.value_status.total_counted_value == 4000  # (80*50)
    assert overview.value_status.completion_percentage == 40.0
```

### Integration Tests

```python
async def test_dashboard_overview_endpoint(client):
    response = client.get("/api/v1/analytics/dashboard/overview?valuation_basis=last_cost")
    assert response.status_code == 200
    data = response.json()
    assert "quantity_status" in data
    assert "value_status" in data
    assert data["value_status"]["currency"] == "INR"
```

---

## Success Criteria

- [ ] Dashboard loads in < 2 seconds with 1000+ items
- [ ] Quantity and value percentages are accurate
- [ ] INR currency formatting is consistent
- [ ] Valuation toggle persists per user
- [ ] Breakdown by location/category/session/date works
- [ ] Drill-down shows item-level details
- [ ] Real-time updates every 30 seconds
- [ ] Mobile responsive design

---

## Dependencies

- None (all required services exist)

---

## Risks & Mitigations

| Risk                             | Impact | Mitigation                     |
| -------------------------------- | ------ | ------------------------------ |
| Slow queries with large datasets | High   | Add indexes, implement caching |
| Stale data in dashboard          | Medium | Use Redis cache with 30s TTL   |
| Currency conversion errors       | Low    | Use Intl.NumberFormat API      |

---

## Rollback Plan

If issues arise:

1. Disable new endpoints via feature flag
2. Revert to basic analytics dashboard
3. Fix issues in development environment
4. Redeploy

---

**Document Version**: 1.0
**Last Updated**: 2026-01-19
**Next Review**: After implementation
