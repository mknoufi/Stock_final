# Phase A: Baseline Test Matrix - Stock Verification System

## Critical User Journeys & Invariants

### 1. Authentication & Session Management

| Journey | Entry Point | Invariants to Verify | Test Cases |
|---------|-------------|---------------------|------------|
| Fresh Install | First app launch | - No stored credentials<br>- Welcome screen shown<br>- Login required | - Fresh install on iOS/Android<br>- Clear data then launch |
| Returning User | App restart | - Token restored from secure storage<br>- Auto-login if valid<br>- PIN/biometric option shown | - Restart app with valid token<br>- Restart with expired token |
| Credential Login | username/password | - JWT tokens generated<br>- Refresh token stored<br>- User session created<br>- Audit log entry | - Valid credentials<br>- Invalid credentials<br>- Account locked |
| PIN Login | 4-6 digit PIN | - PIN scoped to username<br>- Same PIN allowed across users<br>- Biometric option if enabled | - Correct PIN<br>- Incorrect PIN<br>- PIN not set |
| Session Conflict | Second device login | - Single active session enforced<br>- AUTH_SESSION_CONFLICT error<br>- Previous session invalidated | - Login on device 1<br>- Login on device 2 with same user |
| Logout All | Admin/Supervisor | - All user sessions invalidated<br>- Tokens blacklisted<br>- Audit log entry | - User logs out all devices<br>- Admin forces logout for user |

### 2. Item Search & Selection

| Journey | Entry Point | Invariants to Verify | Test Cases |
|---------|-------------|---------------------|------------|
| Item Search | Search bar | - MongoDB ONLY queried<br>- No SQL traffic during search<br>- Results sorted by name<br>- Pagination respected | - Search by exact name<br>- Partial name search<br>- No results |
| Item Selection | Tap on item | - SQL Server queried for qty<br>- Mongo fields updated on mismatch<br>- UI shows both quantities<br>- Timestamp displayed | - Qty matches<br>- Qty mismatch<br>- SQL down scenario |
| Barcode Scan | Camera/QR | - Barcode normalized<br>- Same flow as text search<br>- Audit log entry | - Valid barcode<br>- Invalid barcode<br>- Duplicate scan |

### 3. Stock Counting Workflow

| Journey | Entry Point | Invariants to Verify | Test Cases |
|---------|-------------|---------------------|------------|
| Create Session | New count | - Session created in Mongo<br>- User assigned as staff<br>- Status = OPEN<br>- Audit log entry | - Standard count<br>- Blind count<br>- Strict count |
| Count Items | Scan/enter items | - Each scan logged<br>- Variance calculated<br>- Running total updated<br>- Offline queue safe | - Normal scan<br>- Unknown item<br>- Duplicate scan |
| Submit Count | Complete session | - Status changed to CLOSED<br>- Supervisor notified<br>- Audit log entry<br>- No data loss | - Normal submit<br>- Submit with variances<br>- Offline submit |
| Supervisor Review | Approval queue | - Can view all staff sessions<br>- Can approve/reject<br>- Comments required for reject<br>- Audit log entry | - Approve without variance<br>- Reject with reason<br>- Bulk approve |

### 4. Offline & Sync Behavior

| Journey | Entry Point | Invariants to Verify | Test Cases |
|---------|-------------|---------------------|------------|
| Go Offline | Network loss | - UI shows offline indicator<br>- Queue starts building<br>- No auth requests queued<br>- Local data preserved | - Turn off WiFi<br>- Airplane mode<br>- SQL down |
| Come Online | Network restore | - Queue flushes automatically<br>- Conflicts resolved<br>- Data integrity preserved<br>- No duplicate requests | - Restore WiFi<br>- App restart online<br>- Partial sync |
| Large Queue | Many offline actions | - Performance remains acceptable<br>- Memory usage controlled<br>- Queue order preserved<br>- No auth/session requests | - 100+ scans offline<br>- Multiple sessions offline<br>- Mixed operations |

### 5. Error Handling & Recovery

| Journey | Entry Point | Invariants to Verify | Test Cases |
|---------|-------------|---------------------|------------|
| Token Expire | 401 response | - NOT cleared on first 401<br>- Retry attempted once<br>- Refresh token used if available<br>- Only then logout | - Token expired mid-session<br>- Refresh token valid<br>- Refresh token also expired |
| SQL Down | Database unavailable | - Warning shown in UI<br>- Policy flag respected<br>- Verification follows policy<br>- No crashes | - SQL server stopped<br>- Network blocked<br>- Connection timeout |
| WebSocket Error | Real-time updates | - Reconnection attempted<br>- Auth token validated<br>- Role-based access enforced<br>- Graceful fallback | - Server restart<br>- Network interruption<br>- Invalid token |

### 6. Cross-Platform Consistency

| Journey | Entry Point | Invariants to Verify | Test Cases |
|---------|-------------|---------------------|------------|
| iOS Native | Expo Go / Dev build | - Biometric authentication<br>- Camera permissions<br>- Local storage secure<br>- Performance acceptable | - iPhone test<br>- iPad test<br>- Different iOS versions |
| Android Native | Expo Go / Dev build | - Biometric authentication<br>- Camera permissions<br>- Back navigation handling<br>- Memory management | - Samsung test<br>- Pixel test<br>- Different Android versions |
| Web (if supported) | Browser | - CORS headers correct<br>- Local storage secure<br>- Responsive design<br>- Keyboard navigation | - Chrome test<br>- Safari test<br>- Firefox test |

## Required Invariants Summary

### Authentication Invariants
1. **Single Session**: Only one active session per user across devices
2. **Token Security**: JWT tokens validated on every request
3. **PIN Scope**: PIN is scoped to username (same PIN allowed across users)
4. **Audit Trail**: All auth actions logged with timestamp and IP

### Business Logic Invariants
1. **Mongo-Only Search**: Item search queries MongoDB only (no SQL traffic)
2. **SQL Verification**: Item selection triggers SQL qty read + Mongo writeback
3. **Variance Tracking**: Mismatches update variance fields + timestamp
4. **No SQL Writes**: SQL Server is NEVER written to (read-only)

### Offline Invariants
1. **Queue Safety**: Auth/session requests never queued
2. **Data Integrity**: No data loss during offline/online transitions
3. **Conflict Resolution**: Proper conflict detection and resolution
4. **Performance**: Acceptable performance with large queues

### Error Invariants
1. **Structured Errors**: All errors return {code, message, remediation, timestamp}
2. **Graceful Degradation**: No crashes, always show recovery path
3. **401 Handling**: Retry → refresh → logout (never immediate logout)
4. **User Privacy**: No sensitive data in error messages or logs
