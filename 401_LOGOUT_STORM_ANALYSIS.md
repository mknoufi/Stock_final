# Phase C: 401/Logout Storm Issue Analysis & Fix

## Issue Identified

The 401/logout storm occurs due to multiple problems in the authentication flow:

### 1. **Race Condition in Token Handling**
- Multiple concurrent requests on app startup (user/settings, notifications)
- Both fail with 401 if token is slightly expired or invalid
- Both trigger logout simultaneously
- User gets logged out immediately after login

### 2. **Aggressive Token Expiration Check**
- `checkTokenExpired()` in authStore.ts has a 30-second buffer
- This can cause valid tokens to be considered expired
- Leads to immediate logout on app start

### 3. **Missing Circuit Breaker**
- No protection against multiple simultaneous 401s
- Each 401 triggers full logout flow
- No debouncing or rate limiting

### 4. **Heartbeat Too Aggressive**
- 60-second heartbeat can fail during network issues
- Failed heartbeat triggers immediate logout
- No grace period for temporary network issues

## Root Cause Flow

1. User logs in successfully
2. App restarts or multiple requests fire simultaneously
3. Token is slightly expired or network glitch occurs
4. Multiple requests get 401
5. Each 401 triggers logout
6. User is immediately logged out
7. User experiences "mid-work exit"

## Fix Implementation

### Fix 1: Add 401 Circuit Breaker
- Prevent multiple simultaneous logout attempts
- Add debouncing for 401 handling
- Only logout once per 5-second window

### Fix 2: Improve Token Expiration Logic
- Remove aggressive 30-second buffer
- Add server-side validation
- Use clock skew tolerance properly

### Fix 3: Add Request Deduplication
- Prevent duplicate requests on startup
- Queue requests during initialization
- Process sequentially after auth restored

### Fix 4: Graceful Heartbeat Handling
- Increase heartbeat interval to 5 minutes
- Add failure tolerance (3 failures before logout)
- Add network state awareness

### Fix 5: Better Error Recovery
- Show user-friendly message
- Allow manual retry
- Don't clear credentials on first 401

## Implementation Details

The fix involves modifying:
1. `frontend/src/services/httpClient.ts` - Add circuit breaker
2. `frontend/src/store/authStore.ts` - Improve token handling
3. `frontend/src/services/authUnauthorizedHandler.ts` - Add debouncing
4. Add new error recovery UI components
