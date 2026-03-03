# Implementation Plan: FR-M-30 Variance Thresholds

**Priority**: P0 - Critical
**Effort Estimate**: 6 hours
**Status**: Not Implemented
**Owner**: TBD
**Target Sprint**: Sprint 1

---

## Requirement

**FR-M-30**: Auto-require supervisor approval when:

- **Quantity variance** ≥ 1 unit (configurable)
- **Value variance** ≥ ₹500 (configurable)

System must:

1. Calculate variance automatically on count submission
2. Flag counts exceeding thresholds
3. Route to supervisor approval queue
4. Block finalization until approved

---

## Current State

**Existing Components**:

- ✅ Variance calculation logic exists (`backend/services/analytics_service.py`)
- ✅ Count submission workflow exists
- ❌ Threshold checking not implemented
- ❌ Auto-routing to approval not implemented
- ❌ Configuration system for thresholds not implemented

**Files to Modify**:

- `backend/services/variance_service.py` (NEW) - Threshold logic
- `backend/api/count_lines_api.py` - Add threshold checks on submit
- `backend/api/schemas.py` - Add variance threshold models
- `backend/db/initialization.py` - Add default threshold config
- `frontend/app/staff/item-detail.tsx` - Show threshold warnings

---

## Technical Design

### 1. Configuration System

#### 1.1 Threshold Configuration Schema

```python
# backend/api/schemas.py

class VarianceThreshold(BaseModel):
    """Variance threshold configuration"""
    threshold_type: Literal["quantity", "value", "percentage"]
    operator: Literal["gte", "lte", "eq"]  # >=, <=, ==
    value: float
    currency: str = "INR"  # For value thresholds
    require_supervisor: bool = True
    require_reason: bool = False
    enabled: bool = True

class VarianceThresholdConfig(BaseModel):
    """Complete threshold configuration"""
    _id: Optional[str] = None
    name: str
    description: str
    thresholds: List[VarianceThreshold]
    apply_to_categories: Optional[List[str]] = None  # None = all categories
    apply_to_locations: Optional[List[str]] = None  # None = all locations
    created_at: datetime
    updated_at: datetime

# Default configuration
DEFAULT_VARIANCE_THRESHOLDS = VarianceThresholdConfig(
    name="Default Variance Thresholds",
    description="Standard thresholds for all items",
    thresholds=[
        VarianceThreshold(
            threshold_type="quantity",
            operator="gte",
            value=1.0,
            require_supervisor=True,
            require_reason=False,
        ),
        VarianceThreshold(
            threshold_type="value",
            operator="gte",
            value=500.0,
            currency="INR",
            require_supervisor=True,
            require_reason=True,
        ),
    ],
    created_at=datetime.utcnow(),
    updated_at=datetime.utcnow(),
)
```

#### 1.2 Initialize Default Configuration

```python
# backend/db/initialization.py

async def init_variance_thresholds(db: AsyncIOMotorDatabase):
    """Initialize default variance threshold configuration"""
    existing = await db.variance_threshold_configs.find_one({"name": "Default Variance Thresholds"})

    if not existing:
        config_dict = DEFAULT_VARIANCE_THRESHOLDS.dict(exclude={"_id"})
        result = await db.variance_threshold_configs.insert_one(config_dict)
        logger.info(f"Created default variance threshold config: {result.inserted_id}")
    else:
        logger.info("Default variance threshold config already exists")
```

---

### 2. Variance Service

#### 2.1 Variance Calculation & Threshold Checking

```python
# backend/services/variance_service.py

from typing import Dict, List, Tuple
from backend.api.schemas import CountLine, VarianceThreshold, VarianceThresholdConfig
from backend.db.runtime import get_db

class VarianceService:
    """Service for variance calculation and threshold checking"""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db

    async def calculate_variance(
        self,
        item_code: str,
        counted_qty: float,
        expected_qty: float,
        unit_price: float,
        valuation_basis: str = "last_cost"
    ) -> Dict:
        """
        Calculate variance metrics for a count line.

        Returns:
            {
                "quantity_variance": float,
                "value_variance": float,
                "percentage_variance": float,
                "expected_qty": float,
                "counted_qty": float,
                "unit_price": float,
                "expected_value": float,
                "counted_value": float,
            }
        """
        quantity_variance = counted_qty - expected_qty
        expected_value = expected_qty * unit_price
        counted_value = counted_qty * unit_price
        value_variance = counted_value - expected_value

        percentage_variance = 0.0
        if expected_qty != 0:
            percentage_variance = (quantity_variance / expected_qty) * 100

        return {
            "quantity_variance": round(quantity_variance, 2),
            "value_variance": round(value_variance, 2),
            "percentage_variance": round(percentage_variance, 2),
            "expected_qty": expected_qty,
            "counted_qty": counted_qty,
            "unit_price": unit_price,
            "expected_value": round(expected_value, 2),
            "counted_value": round(counted_value, 2),
        }

    async def check_thresholds(
        self,
        variance_data: Dict,
        item_category: Optional[str] = None,
        location: Optional[str] = None
    ) -> Tuple[bool, List[Dict]]:
        """
        Check if variance exceeds configured thresholds.

        Returns:
            (requires_approval, violated_thresholds)
        """
        # Get applicable threshold config
        config = await self._get_applicable_config(item_category, location)
        if not config:
            return False, []

        violated_thresholds = []
        requires_approval = False

        for threshold in config.get("thresholds", []):
            if not threshold.get("enabled", True):
                continue

            threshold_type = threshold["threshold_type"]
            operator = threshold["operator"]
            threshold_value = threshold["value"]

            # Get the actual variance value to compare
            if threshold_type == "quantity":
                actual_value = abs(variance_data["quantity_variance"])
            elif threshold_type == "value":
                actual_value = abs(variance_data["value_variance"])
            elif threshold_type == "percentage":
                actual_value = abs(variance_data["percentage_variance"])
            else:
                continue

            # Check threshold
            is_violated = False
            if operator == "gte" and actual_value >= threshold_value:
                is_violated = True
            elif operator == "lte" and actual_value <= threshold_value:
                is_violated = True
            elif operator == "eq" and actual_value == threshold_value:
                is_violated = True

            if is_violated:
                violated_thresholds.append({
                    "threshold_type": threshold_type,
                    "threshold_value": threshold_value,
                    "actual_value": actual_value,
                    "require_supervisor": threshold.get("require_supervisor", True),
                    "require_reason": threshold.get("require_reason", False),
                })

                if threshold.get("require_supervisor", True):
                    requires_approval = True

        return requires_approval, violated_thresholds

    async def _get_applicable_config(
        self,
        category: Optional[str],
        location: Optional[str]
    ) -> Optional[Dict]:
        """Get the most specific threshold config that applies"""
        # Priority: category+location > category > location > default

        # Try category + location specific
        if category and location:
            config = await self.db.variance_threshold_configs.find_one({
                "apply_to_categories": category,
                "apply_to_locations": location,
            })
            if config:
                return config

        # Try category specific
        if category:
            config = await self.db.variance_threshold_configs.find_one({
                "apply_to_categories": category,
                "apply_to_locations": None,
            })
            if config:
                return config

        # Try location specific
        if location:
            config = await self.db.variance_threshold_configs.find_one({
                "apply_to_categories": None,
                "apply_to_locations": location,
            })
            if config:
                return config

        # Default config
        config = await self.db.variance_threshold_configs.find_one({
            "name": "Default Variance Thresholds"
        })
        return config
```

---

### 3. Integration with Count Submission

#### 3.1 Update Count Line API

```python
# backend/api/count_lines_api.py

from backend.services.variance_service import VarianceService

@router.post("/count-lines/{count_id}/submit")
async def submit_count_line(
    count_id: str,
    submission_data: CountLineSubmission,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Submit count line for approval.
    Automatically checks variance thresholds.
    """
    # Get count line
    count_line = await db.count_lines.find_one({"_id": count_id})
    if not count_line:
        raise HTTPException(status_code=404, detail="Count line not found")

    # Get item details for variance calculation
    item = await db.erp_items.find_one({"item_code": count_line["item_code"]})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found in ERP")

    # Calculate variance
    variance_service = VarianceService(db)
    variance_data = await variance_service.calculate_variance(
        item_code=count_line["item_code"],
        counted_qty=count_line["counted_qty"],
        expected_qty=item.get("stock_qty", 0),
        unit_price=item.get("last_cost", 0),  # or sale_price based on config
    )

    # Check thresholds
    requires_approval, violated_thresholds = await variance_service.check_thresholds(
        variance_data,
        item_category=item.get("category"),
        location=count_line.get("location")
    )

    # Update count line with variance data
    update_data = {
        "status": "pending_approval" if requires_approval else "approved",
        "variance_data": variance_data,
        "violated_thresholds": violated_thresholds,
        "requires_supervisor_approval": requires_approval,
        "submitted_at": datetime.utcnow(),
        "submitted_by": current_user["user_id"],
    }

    # If reason is required and not provided, reject submission
    if requires_approval:
        requires_reason = any(t.get("require_reason") for t in violated_thresholds)
        if requires_reason and not submission_data.variance_reason:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "Variance reason is required for this count",
                    "violated_thresholds": violated_thresholds,
                }
            )

        if submission_data.variance_reason:
            update_data["variance_reason"] = submission_data.variance_reason

    await db.count_lines.update_one(
        {"_id": count_id},
        {"$set": update_data}
    )

    # Log activity
    await db.activity_logs.insert_one({
        "user_id": current_user["user_id"],
        "action": "count_line_submitted",
        "resource_type": "count_line",
        "resource_id": count_id,
        "metadata": {
            "requires_approval": requires_approval,
            "variance_data": variance_data,
            "violated_thresholds": violated_thresholds,
        },
        "timestamp": datetime.utcnow(),
    })

    return {
        "success": True,
        "requires_approval": requires_approval,
        "variance_data": variance_data,
        "violated_thresholds": violated_thresholds,
        "status": update_data["status"],
    }
```

---

### 4. Frontend Integration

#### 4.1 Threshold Warning Component

```typescript
// frontend/components/count/VarianceWarning.tsx

import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface VarianceWarningProps {
  varianceData: {
    quantity_variance: number;
    value_variance: number;
    percentage_variance: number;
  };
  violatedThresholds: Array<{
    threshold_type: string;
    threshold_value: number;
    actual_value: number;
    require_supervisor: boolean;
    require_reason: boolean;
  }>;
}

export function VarianceWarning({ varianceData, violatedThresholds }: VarianceWarningProps) {
  if (violatedThresholds.length === 0) return null;

  const requiresSupervisor = violatedThresholds.some(t => t.require_supervisor);
  const requiresReason = violatedThresholds.some(t => t.require_reason);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="warning" size={24} color="#f59e0b" />
        <Text style={styles.title}>Variance Threshold Exceeded</Text>
      </View>

      <View style={styles.content}>
        {violatedThresholds.map((threshold, index) => (
          <View key={index} style={styles.thresholdRow}>
            <Text style={styles.thresholdType}>
              {threshold.threshold_type === 'quantity' && '📦 Quantity'}
              {threshold.threshold_type === 'value' && '💰 Value'}
              {threshold.threshold_type === 'percentage' && '📊 Percentage'}
            </Text>
            <Text style={styles.thresholdValue}>
              {threshold.actual_value.toFixed(2)}
              {threshold.threshold_type === 'value' && ' ₹'}
              {threshold.threshold_type === 'percentage' && '%'}
              {' '}(threshold: {threshold.threshold_value})
            </Text>
          </View>
        ))}
      </View>

      {requiresSupervisor && (
        <View style={styles.footer}>
          <MaterialIcons name="supervisor-account" size={20} color="#3b82f6" />
          <Text style={styles.footerText}>
            Supervisor approval required
          </Text>
        </View>
      )}

      {requiresReason && (
        <View style={styles.footer}>
          <MaterialIcons name="edit-note" size={20} color="#3b82f6" />
          <Text style={styles.footerText}>
            Variance reason required
          </Text>
        </View>
      )}
    </View>
  );
}
```

#### 4.2 Update Item Detail Screen

```typescript
// frontend/app/staff/item-detail.tsx

const [varianceWarning, setVarianceWarning] = useState(null);

const handleSubmit = async () => {
  try {
    const response = await api.post(`/count-lines/${countId}/submit`, {
      variance_reason: varianceReason,
    });

    if (response.data.requires_approval) {
      setVarianceWarning({
        varianceData: response.data.variance_data,
        violatedThresholds: response.data.violated_thresholds,
      });

      // Show modal explaining approval needed
      Alert.alert(
        'Supervisor Approval Required',
        `This count has a variance of ${response.data.variance_data.quantity_variance} units (₹${response.data.variance_data.value_variance}). It will be sent to your supervisor for approval.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      // Auto-approved
      Toast.show({ type: 'success', text1: 'Count submitted successfully' });
      navigation.goBack();
    }
  } catch (error) {
    // Handle error
  }
};

// In render
{varianceWarning && (
  <VarianceWarning
    varianceData={varianceWarning.varianceData}
    violatedThresholds={varianceWarning.violatedThresholds}
  />
)}
```

---

### 5. Admin Configuration UI

#### 5.1 Threshold Management API

```python
# backend/api/admin_api.py

@router.get("/admin/variance-thresholds")
@require_role("admin")
async def get_variance_thresholds(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all variance threshold configurations"""
    configs = await db.variance_threshold_configs.find({}).to_list(None)
    return {"configs": configs}


@router.put("/admin/variance-thresholds/{config_id}")
@require_role("admin")
async def update_variance_threshold(
    config_id: str,
    config_data: VarianceThresholdConfig,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update variance threshold configuration"""
    config_data.updated_at = datetime.utcnow()

    result = await db.variance_threshold_configs.update_one(
        {"_id": config_id},
        {"$set": config_data.dict(exclude={"_id"})}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Configuration not found")

    return {"success": True, "message": "Configuration updated"}
```

---

## Implementation Steps

### Phase 1: Backend Core (3 hours)

1. **Hour 1**: Create variance service
   - Create `backend/services/variance_service.py`
   - Implement `calculate_variance()`
   - Implement `check_thresholds()`

2. **Hour 2**: Add configuration system
   - Add threshold schemas to `schemas.py`
   - Create `init_variance_thresholds()` in `initialization.py`
   - Add threshold config collection

3. **Hour 3**: Integrate with count submission
   - Update `count_lines_api.py` submit endpoint
   - Add variance calculation on submit
   - Add threshold checking logic

### Phase 2: Frontend (2 hours)

4. **Hour 4**: Create warning component
   - Build `VarianceWarning` component
   - Add styling and icons

5. **Hour 5**: Update item detail screen
   - Integrate variance warning
   - Add variance reason input field
   - Handle approval flow

### Phase 3: Admin UI (1 hour)

6. **Hour 6**: Build admin configuration
   - Create threshold management API
   - Build basic admin UI for threshold config

---

## Testing Plan

```python
# backend/tests/test_variance_thresholds.py

async def test_quantity_threshold_exceeded():
    variance_service = VarianceService(db)

    variance_data = await variance_service.calculate_variance(
        item_code="ITEM001",
        counted_qty=95,
        expected_qty=100,
        unit_price=50
    )

    requires_approval, violated = await variance_service.check_thresholds(variance_data)

    assert requires_approval == True
    assert len(violated) >= 1
    assert violated[0]["threshold_type"] == "quantity"

async def test_value_threshold_exceeded():
    variance_data = await variance_service.calculate_variance(
        item_code="ITEM002",
        counted_qty=90,
        expected_qty=100,
        unit_price=100  # 10 units * 100 = 1000 value variance
    )

    requires_approval, violated = await variance_service.check_thresholds(variance_data)

    assert requires_approval == True
    assert any(v["threshold_type"] == "value" for v in violated)
```

---

## Success Criteria

- [ ] Variance calculated correctly on count submission
- [ ] Thresholds checked automatically
- [ ] Counts exceeding thresholds routed to approval queue
- [ ] Frontend shows clear warning messages
- [ ] Admins can configure thresholds
- [ ] Category/location-specific thresholds work
- [ ] All tests pass

---

**Document Version**: 1.0
**Last Updated**: 2026-01-19
**Next Review**: After implementation
