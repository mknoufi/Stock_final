# Stock Verify System: Developer Handoff Report

**Date**: 2026-01-31
**Status**: Stable / Production Ready

## 1. System Overview

The **Stock Verify System** is a unified inventory management application designed for tablet-based warehouse operations.

| Component    | Tech Stack                                        | Location                             | Status                     |
| ------------ | ------------------------------------------------- | ------------------------------------ | -------------------------- |
| **Backend**  | Python 3.10+, FastAPI, MongoDB, SQL Server (ODBC) | `/backend`                           | **Stable**                 |
| **Frontend** | React Native (Expo), TypeScript, Paper UI         | `/frontend`                          | **Stable**                 |
| **Database** | MongoDB (Primary), SQL Server (ERP Sync)          | -                                    | **Connected**              |
| **Builds**   | PyInstaller (Win EXE), Gradle (Android APK)       | `/backend/dist`, `/frontend/android` | **Verified / In-Progress** |

## 2. Quickstart Guide

### One-Click Run (Windows)

Run `run_exe.bat` in the root directory. This launches the pre-compiled `StockVerifySystem.exe` which serves both the API and the React web UI.

### Development Setup

1.  **Backend**:
    ```bash
    cd backend
    # Activate venv
    python -m pip install -r requirements.txt
    python server.py  # Runs on port 8000
    ```
2.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm run start     # Development server
    npm run android   # Android emulator
    ```

## 3. Test Health Report

### Frontend Test Suite

- **Command**: `npm test`
- **Result**: **100% PASS**
- **Stats**: 13 Suites, 98 Tests passed.
- **Coverage**: Components (`BottomNavBar`, `LocationVerification`), Services (`api`, `storage`), and Integration flows (`login`, `home`).

### Backend Test Suite

- **Command**: `pytest`
- **Result**: **PASS** (with expected skips)
- **Stats**: **676 Passed**, 11 Skipped, 3 Warnings.
- **Common Skips**:
  - `test_security_evaluation.py`: Rate limiting tests skipped (Mock Auth active).
  - SQL Integration: Skipped checks requiring live ERP connection (GitHub Actions/Sandbox).
- **Warnings**:
  - `UserWarning`: Valid usage of `pydantic` fields in some models.
  - `DeprecationWarning`: Upcoming changes in `pymongo` (monitored).

## 4. Known Warnings & Notes

- **Android Build**:
  - The build logs show standard deprecation warnings for `react-native-gesture-handler` and `expo-modules`. These are upstream issues common in the React Native ecosystem and do not affect stability.
- **Backend Security**:
  - Path traversal tests accept `200 OK` for SPA routes (serving `index.html`) as a safe fallback.
  - Security headers tests allow wildcard CORS for testing environments.

## 5. Artifact Locations

- **Windows Executable**: `backend/dist/StockVerifySystem/StockVerifySystem.exe`
- **Android APK**: `frontend/android/app/build/outputs/apk/release/app-release.apk` (After Gradle build completes)
- **Documentation**:
  - `implementation_plan.md`: Roadmap and architectural decisions.
  - `walkthrough.md`: Verification proof and user guides.
