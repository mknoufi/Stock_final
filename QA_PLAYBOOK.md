# Stock Verification System - Enterprise QA Playbook

## Overview
This playbook provides step-by-step instructions for QA testing of the Stock Verification System across all supported platforms and scenarios.

## Test Environment Setup

### Prerequisites
1. **Backend**: Running on `http://localhost:8001` (or configured IP)
2. **Frontend**: Expo Go or development build installed
3. **Database**: MongoDB running, SQL Server accessible
4. **Network**: Test on office LAN and outside LAN
5. **Test Users**: Created staff, supervisor, and admin accounts

### Test Data Preparation
```bash
# Create test users
- staff1 / staff123 (Staff role)
- supervisor1 / super123 (Supervisor role)  
- admin1 / admin123 (Admin role)
```

## Platform-Specific Testing

### iOS Testing
**Device Setup:**
- iPhone 12+ (iOS 15+) with Expo Go
- Test on both WiFi and Cellular
- Enable Face ID for biometric testing

**Test Steps:**
1. Install Expo Go from App Store
2. Scan QR code or enter development URL
3. Grant camera permissions for barcode scanning
4. Test Face ID enrollment and login

### Android Testing
**Device Setup:**
- Android 10+ device with Expo Go
- Test on both WiFi and Mobile Data
- Enable fingerprint/biometric

**Test Steps:**
1. Install Expo Go from Play Store
2. Scan QR code or enter development URL
3. Grant camera and storage permissions
4. Test fingerprint enrollment and login

### Web Testing (if supported)
**Browser Setup:**
- Chrome 90+, Firefox 88+, Safari 14+
- Test responsive design on mobile/desktop
- Check CORS headers

**Test Steps:**
1. Navigate to web URL
2. Test login flow
3. Verify responsive layout
4. Check keyboard navigation

## Critical User Journey Testing

### 1. Fresh Install Journey
**Objective:** Verify first-time user experience

**Steps:**
1. Clear app data/uninstall app
2. Launch app fresh
3. Verify welcome screen displays
4. Attempt login without credentials → Should fail
5. Login with valid credentials → Should succeed
6. Verify dashboard loads
7. Check user settings accessible

**Expected Results:**
- Welcome screen shown on first launch
- Login required for access
- Successful login redirects to dashboard
- User profile correctly loaded

### 2. Returning User Journey
**Objective:** Verify seamless return experience

**Steps:**
1. Login with valid credentials
2. Close app (background/kill)
3. Relaunch app within 5 minutes
4. Verify user still logged in
5. Navigate to different screens
6. Verify data loads correctly

**Expected Results:**
- User remains logged in
- No login prompt required
- Data loads without issues
- Session persists correctly

### 3. Token Expiry Journey
**Objective:** Verify graceful handling of expired tokens

**Steps:**
1. Login with valid credentials
2. Wait for token to expire (or manually expire)
3. Attempt to access protected endpoint
4. Verify 401 handling
5. Check refresh token flow
6. Verify re-login prompt

**Expected Results:**
- Graceful 401 handling
- Refresh token attempted if available
- User prompted to re-login only when necessary
- No sudden logout storms

### 4. Session Conflict Journey
**Objective:** Verify single session enforcement

**Steps:**
1. Login on Device 1
2. Login with same credentials on Device 2
3. Check Device 1 session status
4. Attempt action on Device 1
5. Verify session conflict handling

**Expected Results:**
- Only one active session per user
- Previous session invalidated
- Clear conflict error message
- User can continue on new device

## Authentication Testing

### 5. PIN Authentication
**Objective:** Verify PIN-based login functionality

**Steps:**
1. Login with username/password
2. Navigate to Settings → Security
3. Set up 4-digit PIN
4. Logout completely
5. Login using PIN only
6. Verify successful authentication

**Expected Results:**
- PIN setup successful
- PIN login works correctly
- PIN scoped to username
- Same PIN allowed across users

### 6. Biometric Authentication
**Objective:** Verify biometric login functionality

**Steps:**
1. Ensure device has biometric capability
2. Set up PIN first (requirement)
3. Enable biometric login in settings
4. Logout completely
5. Use biometric to login
6. Verify successful authentication

**Expected Results:**
- Biometric option available
- Successful biometric authentication
- Fallback to PIN if biometric fails
- Secure storage of biometric credentials

### 7. Password Reset Flow
**Objective:** Verify password reset functionality

**Steps:**
1. Go to login screen
2. Click "Forgot Password"
3. Enter username/phone
4. Receive OTP (test mode)
5. Enter OTP
6. Set new password
7. Login with new password

**Expected Results:**
- OTP sent successfully
- OTP verification works
- Password reset successful
- New password works for login

## Business Logic Testing

### 8. Item Search (MongoDB Only)
**Objective:** Verify search uses MongoDB only

**Steps:**
1. Go to Items screen
2. Search for item by name
3. Monitor network traffic
4. Verify only MongoDB queries
5. Check SQL query count = 0

**Expected Results:**
- Search results from MongoDB
- No SQL traffic during search
- Search performance acceptable
- Results sorted correctly

### 9. Item Verification (SQL + Mongo)
**Objective:** Verify SQL quantity verification

**Prerequisites:** SQL Server must be running

**Steps:**
1. Search and select an item
2. View item details
3. Verify SQL quantity displayed
4. Verify MongoDB quantity displayed
5. Check variance calculation
6. Verify last verified timestamp

**Expected Results:**
- Both quantities displayed
- Variance correctly calculated
- Timestamp shows last verification
- Mismatch flag set if needed

### 10. SQL Down Behavior
**Objective:** Verify graceful SQL failure handling

**Steps:**
1. Stop SQL Server service
2. Attempt item verification
3. Verify warning message
4. Check policy enforcement (BLOCK/PENDING)
5. Verify app remains functional
6. Restart SQL Server
7. Verify normal operation resumes

**Expected Results:**
- Clear warning about SQL down
- Policy flag respected
- App remains usable with limitations
- Automatic recovery when SQL restored

## Offline Testing

### 11. Offline Mode
**Objective:** Verify offline functionality

**Steps:**
1. Login while online
2. Perform some actions (create session, scan items)
3. Enable Airplane Mode
4. Continue working offline
5. Verify offline indicator
6. Check data saved locally
7. Restore connection
8. Verify sync occurs

**Expected Results:**
- Offline mode indicator visible
- Actions queued locally
- No auth/session requests queued
- Sync completes when online
- No data loss during offline period

### 12. Large Offline Queue
**Objective:** Verify performance with many offline actions

**Steps:**
1. Go offline
2. Create 100+ scan actions
3. Verify app remains responsive
4. Check memory usage
5. Go online
6. Monitor sync progress
7. Verify all data synced

**Expected Results:**
- App remains responsive
- Memory usage controlled
- Queue order preserved
- Sync completes successfully
- No duplicate requests

## Error Handling Testing

### 13. Network Errors
**Objective:** Verify network error handling

**Steps:**
1. Start action (e.g., save session)
2. Disconnect network mid-action
3. Verify error message
4. Check retry mechanism
5. Verify data preserved
6. Reconnect network
7. Verify action completes

**Expected Results:**
- User-friendly error message
- Automatic retry where appropriate
- Data not lost
- Graceful recovery

### 14. Permission Errors
**Objective:** Verify role-based access control

**Steps:**
1. Login as staff user
2. Attempt admin-only action
3. Verify access denied
4. Check error message
5. Login as supervisor
6. Attempt same action
7. Verify access granted

**Expected Results:**
- Proper permission enforcement
- Clear error messages
- Role-based access working
- No privilege escalation

## Performance Testing

### 15. Large Dataset Performance
**Objective:** Verify performance with large item sets

**Steps:**
1. Ensure 20,000+ items in database
2. Search for common item name
3. Measure response time
4. Scroll through results
5. Check pagination
6. Verify memory usage

**Expected Results:**
- Search < 2 seconds
- Smooth scrolling
- Pagination working
- Memory usage reasonable

### 16. Concurrent Users
**Objective:** Verify multi-user performance

**Steps:**
1. Have 5+ users login simultaneously
2. Create different sessions
3. Perform various actions
4. Monitor server performance
5. Check for deadlocks
6. Verify data integrity

**Expected Results:**
- No performance degradation
- No data corruption
- Proper session isolation
- Acceptable response times

## Security Testing

### 17. Token Security
**Objective:** Verify token handling security

**Steps:**
1. Login and capture JWT token
2. Decode token to verify claims
3. Attempt to modify token
4. Use modified token
5. Verify rejection
6. Check token expiration

**Expected Results:**
- Tokens properly signed
- Modified tokens rejected
- Expiration enforced
- No sensitive data in tokens

### 18. Session Security
**Objective:** Verify session management security

**Steps:**
1. Login on Device 1
2. Capture session token
3. Use token on Device 2
4. Verify session conflict
5. Check logout invalidates tokens
6. Verify refresh token security

**Expected Results:**
- Session conflicts detected
- Tokens properly invalidated
- Refresh tokens secure
- No session hijacking

## Cross-Platform Consistency

### 19. UI Consistency
**Objective:** Verify consistent UI across platforms

**Steps:**
1. Test same flows on iOS, Android, Web
2. Compare layouts and interactions
3. Verify consistent styling
4. Check responsive design
5. Test accessibility features

**Expected Results:**
- Consistent branding
- Responsive layouts
- Platform-appropriate interactions
- Accessibility compliance

### 20. Data Consistency
**Objective:** Verify data consistency across platforms

**Steps:**
1. Create session on iOS
2. View session on Android
3. Verify data matches
4. Edit on Web
5. Check updates on mobile
6. Verify real-time sync

**Expected Results:**
- Data synchronized
- Real-time updates working
- No platform-specific bugs
- Consistent behavior

## Test Results Documentation

### Test Case Checklist
For each test case, document:
- [ ] Test executed
- [ ] Pass/Fail
- [ ] Issues found
- [ ] Screenshots/Logs attached
- [ ] Severity (Critical/High/Medium/Low)

### Bug Reporting Template
```
Title: [Platform] - [Feature] - [Issue Description]
Steps to Reproduce:
1. 
2. 
3. 

Expected Result:
Actual Result:
Severity:
Environment:
Attachments:
```

## Sign-off Criteria

### Release Readiness
All critical tests must pass:
- [ ] Authentication flows work correctly
- [ ] No 401/logout storms
- [ ] Business logic enforced
- [ ] Offline mode functional
- [ ] Error handling user-friendly
- [ ] Performance acceptable
- [ ] Security measures effective
- [ ] Cross-platform consistent

### Final Verification
- [ ] All test cases executed
- [ ] Critical bugs resolved
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Stakeholder sign-off received

## Emergency Procedures

### Test Environment Issues
- Backend down: Check logs, restart services
- Database issues: Verify connections, check status
- Network problems: Check LAN configuration
- Build failures: Check dependencies, clear cache

### Production Rollback
- Monitor error rates
- Have rollback plan ready
- Communicate with stakeholders
- Document issues for post-mortem
