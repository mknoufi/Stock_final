# Error Message Catalog - Stock Verification System

## Top 30 Error Scenarios with User-Friendly Messages

### Authentication Errors (AUTH_XXX)

| Backend Code | Trigger | Frontend Message | Remediation Action |
|--------------|---------|------------------|-------------------|
| AUTH_001 | Invalid credentials | "Incorrect username or password. Please check your credentials and try again." | Show login form with focus on username field |
| AUTH_002 | Account locked | "Your account has been locked. Please contact your supervisor." | Show contact supervisor button |
| AUTH_003 | Session expired | "Your session has expired. Please sign in again." | Show login modal with pre-filled username |
| AUTH_004 | Token invalid/malformed | "Authentication error. Please sign in again." | Show login modal |
| AUTH_005 | PIN not set | "PIN not set. Please set up your PIN first." | Navigate to PIN setup screen |
| AUTH_006 | Invalid PIN | "Incorrect PIN. Please try again." | Show PIN input with error state |
| AUTH_007 | Biometric failed | "Biometric authentication failed. Please use your PIN or password." | Show PIN/password options |
| AUTH_008 | Session conflict | "You are already logged in on another device. Please log out from other devices first." | Show "Logout All" option |
| AUTH_009 | Refresh token expired | "Please sign in again to continue." | Show login modal |
| AUTH_010 | User not found | "User account not found. Please contact your supervisor." | Show contact supervisor button |

### Network & Connection Errors (NETWORK_XXX)

| Backend Code | Trigger | Frontend Message | Remediation Action |
|--------------|---------|------------------|-------------------|
| NETWORK_001 | No internet connection | "No internet connection. Please check your network settings." | Show network settings button |
| NETWORK_002 | Server unreachable | "Cannot connect to server. Please check if you're on the office network." | Show retry button |
| NETWORK_003 | Request timeout | "Request timed out. Please try again." | Show retry button |
| NETWORK_004 | Network not allowed | "You are not on the allowed network. Please connect to office WiFi." | Show network instructions |
| NETWORK_005 | SQL Server down | "Inventory system is temporarily unavailable. Using cached data." | Show warning banner |
| NETWORK_006 | Connection lost | "Connection lost. Retrying..." | Show loading indicator with retry |

### Business Logic Errors (BUSINESS_XXX)

| Backend Code | Trigger | Frontend Message | Remediation Action |
|--------------|---------|------------------|-------------------|
| BUSINESS_001 | Item not found | "Item not found in inventory. Please check the barcode or item code." | Show search suggestions |
| BUSINESS_002 | Insufficient permissions | "You don't have permission to perform this action." | Show permission error dialog |
| BUSINESS_003 | Session already active | "You have an active counting session. Please complete it first." | Navigate to active session |
| BUSINESS_004 | Invalid quantity | "Invalid quantity entered. Please enter a valid number." | Highlight quantity field |
| BUSINESS_005 | Duplicate barcode | "This barcode has already been scanned." | Show duplicate warning |
| BUSINESS_006 | Variance detected | "Variance detected: System shows {system_qty}, you counted {counted_qty}." | Show variance confirmation dialog |
| BUSINESS_007 | Session closed | "This session is already closed. Cannot make changes." | Show session closed message |
| BUSINESS_008 | Warehouse mismatch | "Item belongs to different warehouse." | Show warehouse error |
| BUSINESS_009 | Supervisor approval required | "Supervisor approval required for this action." | Show pending approval status |
| BUSINESS_010 | Stock negative | "Cannot set negative stock quantity." | Show quantity validation error |

### System Errors (SYSTEM_XXX)

| Backend Code | Trigger | Frontend Message | Remediation Action |
|--------------|---------|------------------|-------------------|
| SYSTEM_001 | Internal server error | "Something went wrong. Please try again." | Show retry button |
| SYSTEM_002 | Database error | "Database error. Your data has been saved locally and will sync when available." | Show offline indicator |
| SYSTEM_003 | File upload failed | "Failed to upload file. Please check the file and try again." | Show file upload retry |
| SYSTEM_004 | Export failed | "Failed to generate report. Please try again." | Show export retry button |
| SYSTEM_005 | Backup failed | "Backup failed. Please contact IT support." | Show contact IT button |

### Validation Errors (VALIDATION_XXX)

| Backend Code | Trigger | Frontend Message | Remediation Action |
|--------------|---------|------------------|-------------------|
| VALIDATION_001 | Required field missing | "This field is required." | Highlight required field |
| VALIDATION_002 | Invalid email format | "Please enter a valid email address." | Show email format hint |
| VALIDATION_003 | Invalid phone number | "Please enter a valid phone number." | Show phone format hint |
| VALIDATION_004 | Password too weak | "Password must be at least 8 characters with letters and numbers." | Show password requirements |
| VALIDATION_005 | Date range invalid | "End date must be after start date." | Show date picker error |

## Error Handling Implementation

### Backend Error Format
```json
{
  "code": "AUTH_001",
  "message": "Human-readable error message",
  "remediation": "What the user should do",
  "timestamp": "2026-01-27T11:43:01.624638Z",
  "details": { ... }
}
```

### Frontend Error Mapper
```typescript
const errorMapper = {
  'AUTH_001': {
    title: 'Invalid Credentials',
    message: 'Incorrect username or password.',
    action: 'Please check your credentials and try again.',
    icon: 'lock',
    severity: 'error'
  },
  // ... more mappings
};
```

### Error Display Components
- **Toast Notifications**: For non-critical errors
- **Modal Dialogs**: For blocking errors requiring action
- **Banner Messages**: For system-wide issues (SQL down, network restricted)
- **Inline Validation**: For form field errors
- **Status Indicators**: For background sync issues

## Error Recovery Strategies

### 1. Auto-Retry with Backoff
- Network errors: Exponential backoff (1s, 2s, 4s, 8s)
- Temporary server errors: Linear backoff (5s, 10s, 15s)
- Max 3 retry attempts

### 2. Graceful Degradation
- SQL down: Use cached MongoDB data with warning
- Network restricted: Show restricted mode banner
- Partial failures: Save locally for later sync

### 3. User Guidance
- Clear next steps for each error type
- Contextual help buttons
- Contact information for critical issues
- Progress indicators for long operations

### 4. Error Reporting
- Automatic error logging with context
- User feedback option for unexpected errors
- Diagnostic information for IT support
- Error analytics for monitoring
