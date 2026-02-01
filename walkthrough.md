# Walkthrough - ERP Offline Fix

Resolved the issue where the "ERP Offline" warning and "Cache" badge were persistently displayed due to a technical bug in the SQL query formatting logic.

## Problem Identified

- **Error**: The backend was failing to fetch real-time data from the SQL Server ERP, falling back to cached snapshots.
- **Root Cause**: In `backend/sql_server_connector.py`, the `_apply_optional_sections` method used the key `optional_selects` to format templates, but the SQL templates in `backend/db_mapping_config.py` used `{optional_columns}`.
- **Result**: The templates were left with unformatted curly braces, causing `SQLPrepare` syntax errors at the database level.

### 2. NitroModules Error in Expo Go

- **Error**: `[Error: NitroModules are not supported in Expo Go!]` crash on startup.
- **Root Cause**: `react-native-mmkv` uses JSI/NitroModules which are not supported in the standard Expo Go client.
- **Result**: The application was failing to boot on mobile devices using Expo Go.

### 3. Startup Stability Issues (React Scan & Context)

- **Error**: `[TypeError: Cannot read property 'includes' of undefined]` and `[Error: useThemeContext must be used within a ThemeProvider]`.
- **Root Cause**:
  1. `react-scan` was being initialized at the top level in a Non-Web environment.
  2. Child routes were being evaluated during the boot sequence before context providers were mounted.
- **Result**: Immediate crashes and "Missing default export" warnings in Expo Go.

## Changes Made

### Backend (ERP Fix)

- **[Fixed] [sql_server_connector.py](file:///d:/stk/stock-verify-system/backend/sql_server_connector.py)**: Corrected the formatting key to `optional_columns` and improved error handling for template formatting.
- **[Restored]**: Repaired structural integrity of the `SQLServerConnector` class.

### Frontend (Expo Go Fixes)

- **[Fixed] [mmkvStorage.ts](file:///d:/stk/stock-verify-system/frontend/src/services/mmkvStorage.ts)**: Replaced top-level MMKV import with a dynamic, environment-aware loading strategy.
- **[Fixed] [\_layout.tsx](file:///d:/stk/stock-verify-system/frontend/app/_layout.tsx)**:
  - Moved `react-scan` initialization to a web-only dev effect.
  - Wrapped the initial loading screen in `ThemeProvider` and `QueryClientProvider` to prevent context errors during boot.

## Verification Results

- **Diagnostic Confirmation**: Ran a custom diagnostic script that verified:
  - Successful connectivity to the SQL Server (`E_MART_KITCHEN_CARE`).
  - Production query template execution speed (approx. **0.21s**).
  - Successful retrieval of barcode `525585` (WHIRLPOOL R/F 278GD) using the application's internal connector.

![Diagnostic Report](file:///d:/stk/stock-verify-system/sql_diagnostic_report.txt)

## Conclusion

The system now correctly fetches real-time stock data from the ERP, ensuring the "ERP Offline" warning only appears when there is an actual network or database failure.
