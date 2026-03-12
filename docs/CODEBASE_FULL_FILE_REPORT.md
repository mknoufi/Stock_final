# Codebase Full File Report

This report is generated directly from file contents with no inferred/assumed behavior beyond explicit text signals.

- Repository: `/Users/noufi1/stk_final/Stock_final`
- Generated: `2026-03-12 12:39:02`
- Scope: `git ls-files` (all tracked files)
- Total files: **1422**

## Coverage

| Top-level path | File count |
|---|---:|
| `(root)` | 14 |
| `.agent` | 9 |
| `.github` | 40 |
| `backend` | 371 |
| `deliverables` | 6 |
| `docs` | 174 |
| `frontend` | 614 |
| `ios` | 16 |
| `k8s` | 7 |
| `monitoring` | 4 |
| `nginx` | 2 |
| `redis` | 1 |
| `requirements` | 6 |
| `scripts` | 109 |
| `specs` | 35 |
| `templates` | 14 |

## (root)

### 1. `.editorconfig`
- Bytes: `882`
- Lines: `58`
- SHA256: `cef1501a54e837b366ad5d9055c02c7d565946e6759af151864ce451195a510e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # EditorConfig is awesome: https://EditorConfig.org
   3: # top-most EditorConfig file
   4: root = true
   6: # Unix-style newlines with a newline ending every file
   7: [*]
   8: end_of_line = lf
   9: insert_final_newline = true
  10: charset = utf-8
```

### 2. `.flake8`
- Bytes: `185`
- Lines: `7`
- SHA256: `d1dca898ec167f58c478578cc177ce3d9d7ed666071474ef9424704c78f52d46`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: [flake8]
   2: # Ignore E501 - line too long (black handles this, sometimes allows slightly longer lines)
   3: ignore = C901, E402, F811, W503, E501, E203
   5: # Max line length
   6: max-line-length = 119
```

### 3. `.gitignore`
- Bytes: `1046`
- Lines: `86`
- SHA256: `11ef7172ee0c8b667980a4125c01082e99d413caaf6ad6ebaa22433790de97a8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # =============================================================================
   2: # Stock Verification System — .gitignore
   3: # =============================================================================
   5: # Environment files (secrets)
   6: .env
   7: .env.bak
   8: .env.local
   9: .env.production
```

### 4. `.gitlab-ci.yml`
- Bytes: `2377`
- Lines: `94`
- SHA256: `779e67268ee3aa80fe1beb16aba4ae45912703a2c62665702bbcb14bd1f73284`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Stock Verify System - GitLab CI/CD Pipeline
   2: # Runs on push to main and on merge requests
   4: stages:
   5:   - test
   6:   - quality
   7:   - build
   9: variables:
  10:   PYTHON_VERSION: "3.10"
```

### 5. `ARCHITECTURE.md`
- Bytes: `3671`
- Lines: `90`
- SHA256: `3be55ae0a198669f45714ede42cf27284f59c91efa1d4ae05a1dea98599665a6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # System Architecture - Stock Verification System
   3: ## High Level Overview
   5: The system follows a strict **Offline-First, Mongo-Primary** architecture. The SQL Server ERP acts purely as a read-only source of truth (Upstream), while MongoDB serves as the operational database for all mobile and ...
   7: ```mermaid
   8: graph TD
   9:     subgraph LAN [Local Network / On-Prem]
  10:         SQL[SQL Server ERP]
  11:         Bridge[Sync Bridge Service]
```

### 6. `CODEOWNERS`
- Bytes: `2488`
- Lines: `53`
- SHA256: `f87227facbdd021767e8bd8bee3e6d761d5c149483d0bbab0e5cb6591feacbd3`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # CODEOWNERS - Branch Protection & Review Routing
   2: # Format: <file-pattern> <@username or @team>
   4: # Critical financial/ledger paths
   5: /backend/services/erp_sync_service.py          @finance-lead @tech-lead
   6: /backend/services/advanced_erp_sync.py        @finance-lead @tech-lead
   7: /backend/api/*ledger*.py                      @finance-lead @tech-lead
   8: /backend/api/*payment*.py                     @finance-lead @tech-lead
  10: # Purchase and supply chain
```

### 7. `CONTRIBUTING.md`
- Bytes: `5441`
- Lines: `248`
- SHA256: `9c3b8c7aaa6c17e3e1a3b9aa710ae4e1af3f4dea3aceb965be9f9d3f04acee6d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Contributing to Stock Verify
   3: Thank you for your interest in contributing to Stock Verify!
   5: ## 🎯 Project Types
   7: ### Contributing to the Template (This Repository)
   9: If you want to improve the **template itself** that others will use:
  11: - Submit PRs with improvements to the base template
  12: - Enhance documentation and setup scripts
  13: - Fix bugs in the core functionality
```

### 8. `GEMINI.md`
- Bytes: `854`
- Lines: `31`
- SHA256: `ad2e3403e16385d5ccd1e5b213775cc84acfc8efcd83e0fd047e536d76bf4883`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # STOCK_VERIFY_2-db-maped Development Guidelines
   3: Auto-generated from all feature plans. Last updated: 2025-12-26
   5: ## Active Technologies
   7: - MongoDB (Primary), SQL Server (Read-only ERP), Redis (Optional Cache) (002-system-modernization-and-enhancements)
   9: ## Project Structure
  11: ```text
  12: src/
  13: tests/
```

### 9. `Makefile`
- Bytes: `7915`
- Lines: `231`
- SHA256: `fb919b5b0e49be67832324d8034748b2d36ef680882864065db7f5284625a5bf`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Makefile for STOCK_VERIFY CI and Development Tasks
   2: # Usage: make <target>
   4: .PHONY: help ci test lint format typecheck pre-commit install clean eval security secrets
   6: help:
   7:     @echo "📦 Stock Verify Application - Available Commands"
   8:     @echo ""
   9:     @echo "🚀 Main Targets:"
  10:     @echo "  make start       - Start Full Application (Backend + Frontend + DB)"
```

### 10. `README.md`
- Bytes: `2813`
- Lines: `108`
- SHA256: `40e0f22dd961463af4c778de9ea2193f6e0eed54aa476c4dba5b1c32fb74b8ae`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Stock Verify Application (v2.1)
   3: This repository is available as a GitHub template. Use the template to create a new instance.
   4: See `docs/STARTUP_GUIDE.md` for setup instructions.
   6: ## Start Here
   8: Guides:
   9: - `docs/START_HERE.md` (recommended first read)
  10: - `docs/QUICK_START.md`
  11: - `docs/VIBE_CODING_WORKFLOW.md`
```

### 11. `backend_port.json`
- Bytes: `268`
- Lines: `1`
- SHA256: `8e70867f0ebc759069f149c03bacc60f4f85e8828c7a3819356133450f79e50b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {"port": 8001, "ip": "192.168.31.213", "url": "http://192.168.31.213:8001", "pid": 46565, "timestamp": "2026-03-12T06:23:26.490923+00:00", "EXPO_PUBLIC_BACKEND_URL": "http://192.168.31.213:8001", "EXPO_PUBLIC_API_TIME...
```

### 12. `cspell.json`
- Bytes: `307`
- Lines: `24`
- SHA256: `acc1d143e18121a6819f75743f406fc1deee0461d5ba58fff136d9701dc405b2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "version": "0.2",
   3:   "language": "en",
   4:   "words": [
   5:     "sgst",
   6:     "cgst",
   7:     "igst",
   8:     "Lavanya",
```

### 13. `docker-compose.production.yml`
- Bytes: `1551`
- Lines: `63`
- SHA256: `44e40b34518a179c39ed99bdf3521d3858d742429a2dc68b49e816f4f2395806`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # =============================================================================
   2: # docker-compose.production.yml — Production Deployment
   3: # =============================================================================
   4: # Usage: docker compose -f docker-compose.production.yml up -d
   5: # =============================================================================
   7: version: '3.8'
   9: services:
  10:   backend:
```

### 14. `docker-compose.yml`
- Bytes: `457`
- Lines: `26`
- SHA256: `f5ee819582ec9ab84f44942d594b1e43e08c44a3766933b49b46f9899721e3b5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: version: '3.8'
   3: services:
   4:   backend:
   5:     build: ./backend
   6:     ports:
   7:       - "8001:8001"
   8:     env_file:
   9:       - backend/.env.example
```

## .agent

### 15. `.agent/SCAN_SCREEN_ANALYSIS.md`
- Bytes: `6320`
- Lines: `222`
- SHA256: `ad41435c024f4769eb9b40f42191e62abea79aedff8d1b1afa7bbc526ffc8985`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `performFuzzySearch`
  - `showFeedback`
- Excerpt (first non-empty lines):

```text
   1: # Scan Screen Code Analysis & Optimization Report
   3: ## Issues Found
   5: ### 1. ✅ FIXED: Runtime Error
   6: **Line 2762**: `serialInputs` and `serialInputTarget` not defined
   7: - **Fix Applied**: Changed to `workflowState.serialInputs` and `workflowState.serialInputTarget`
   8: - **Status**: ✅ Fixed
  10: ### 2. API Call Patterns
  12: #### Duplicate/Similar API Calls:
```

### 16. `.agent/comprehensive_implementation_guide.md`
- Bytes: `10297`
- Lines: `385`
- SHA256: `d4539070be049b2c58f91042d278da3e09e6d7db34a603de231671178d8a2bfa`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `useSession`
  - `ScanHeaderProps`
  - `ScanState`
  - `useScanState`
  - `Props`
  - `State`
  - `ErrorBoundary`
  - `handleSuccess`
  - `handleError`
  - `handlePress`
  - `SkeletonItem`
  - `addToQueue`
  - `processQueue`
- Excerpt (first non-empty lines):

```text
   1: # Comprehensive Implementation Guide: Stock Verify App Upgrade
   3: This document provides a detailed, step-by-step guide to implementing advanced features and architectural improvements for the Stock Verify application. All methods described here use verified, standard practices for ...
   5: ---
   7: ## 📋 Table of Contents
   9: 1. [Phase 1: Foundation & Utilities](#phase-1-foundation--utilities)
  10:    - React Query Integration
  11:    - Style Extraction
  12:    - Utility Integration
```

### 17. `.agent/master_implementation_guide.md`
- Bytes: `13848`
- Lines: `453`
- SHA256: `c37ed5770c1c030a76b51d1c9e7790e0d215dbe6f00c1cd14bf618fbfb118875`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `useFeedback`
  - `showFeedback`
  - `validateQuantity`
  - `retryRequest`
  - `ScanHeader`
  - `ErrorBoundary`
  - `suggestQty`
  - `getColor`
  - `resolve`
  - `saveSearch`
  - `resetTimer`
- Excerpt (first non-empty lines):

```text
   1: # Master Implementation Guide: Stock Verify App Upgrade (All 54 Features)
   3: This document provides a complete, step-by-step guide to implementing all 54 recommended improvements for the Stock Verify application. Each item includes implementation details, code samples, and links to official do...
   5: ---
   7: ## 📋 Table of Contents
   9: 1. [Phase 1: Foundation & Utilities (Immediate)](#phase-1-foundation--utilities-immediate)
  10: 2. [Phase 2: Component Architecture (Short Term)](#phase-2-component-architecture-short-term)
  11: 3. [Phase 3: UX Enhancements (Medium Term)](#phase-3-ux-enhancements-medium-term)
  12: 4. [Phase 4: Advanced Features (Long Term)](#phase-4-advanced-features-long-term)
```

### 18. `.agent/scan-improvements-implementation.md`
- Bytes: `4037`
- Lines: `159`
- SHA256: `1bd36d57a72c08fc1f1379cb7dbe33ae39664496a22fdf62bffc8602613c0223`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `handleLogout`
- Excerpt (first non-empty lines):

```text
   1: # Scan Screen Improvements - Detailed Implementation
   3: ## All Changes Required
   5: ### 1. Add Auth Store Import (Line 8, after other imports)
   6: ```typescript
   7: import { useAuthStore } from '@/store/authStore';
   8: ```
  10: ### 2. Get User from Auth Store (Line 231, after router)
  11: ```typescript
```

### 19. `.agent/scan-screen-improvements.md`
- Bytes: `2631`
- Lines: `51`
- SHA256: `12d93240afe3067b3218d4773631a54a7ece429e6d46616ef39c729bb8cb4856`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Scan Screen Improvements Implementation Plan
   3: ## Objective
   4: Refine the offline queue functionality and address specific user requirements regarding inventory counting logic, variance calculation, and damage type differentiation.
   6: ## Changes Implemented
   8: ### 1. Inventory Count Logic
   9: - **Requirement**: "Damaged cont also include in physical count".
  10: - **Implementation**:
  11:     - Added separate input fields for "Returnable Damage Qty" and "Non-Returnable Damage Qty".
```

### 20. `.agent/workflows/design-upgrade.md`
- Bytes: `1623`
- Lines: `43`
- SHA256: `7c42a5e05acc1031db9cae598d833f65f350487624f00c02ab14a39c2d7b6c4f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: description: How to apply the new premium design system to screens
   3: ---
   5: # Premium Dark Theme Upgrade Workflow
   7: This workflow describes how to upgrade a screen to the new premium dark theme.
   9: ## 1. Check for `globalStyles` usage
  10: - Ensure the file imports `colors`, `spacing`, `borderRadius`, `typography` from `../../styles/globalStyles`.
  11: - If the component uses `useTheme`, ensure it's pulling from the updated `themeService`.
```

### 21. `.agent/workflows/fix-all-issues.md`
- Bytes: `10654`
- Lines: `386`
- SHA256: `c10d9dc4e154437e22178f84191d7c4ae0b11f4edffd733e70a9c9aee444b575`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: description: Fix all codebase issues to enable running the application
   3: ---
   5: # Fix All Codebase Issues - Implementation Plan
   7: ## Overview
   8: This plan addresses all 38+ issues identified in the codebase analysis, organized by priority and dependency order.
  10: ---
  12: ## Phase 1: Backend Critical Fixes (Runtime Blockers)
```

### 22. `.agent/workflows/run_app.md`
- Bytes: `1826`
- Lines: `83`
- SHA256: `c15b3147d5d0c7dbd6d29da99b69a720f27c03a73007f3cddf0051e7b88a4ddd`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: description: How to run the Stock Verification App (Backend + Frontend + Admin)
   3: ---
   5: # Run the App
   7: This workflow describes how to start the entire application stack: Backend (FastAPI), Frontend (Expo), and Admin Panel.
   9: ## Prerequisites
  11: - **Node.js**: Version 20+
  12: - **Python**: Version 3.11+
```

### 23. `.agent/workflows/scan-screen-improvements.md`
- Bytes: `2991`
- Lines: `90`
- SHA256: `880db9c86a6a5b2542665cafc9f3b1154e4aa99d372ef8ff88a758fc3002212c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: description: Scan Screen Improvements Implementation Plan
   3: ---
   5: # Scan Screen Improvements
   7: ## Tasks to Complete
   9: ### 1. Fix Serial Number Functionality ✅
  10: - **Location**: `frontend/app/staff/scan.tsx`
  11: - **Issue**: Serial number input not working properly
```

## .github

### 24. `.github/ISSUE_TEMPLATE/bug_report.md`
- Bytes: `1046`
- Lines: `48`
- SHA256: `bc39291af9e48ada264b25a72fbab820e4955768d9c0f591771d57a68b57c890`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: name: Bug Report
   3: about: Create a report to help us improve
   4: title: '[BUG] '
   5: labels: bug
   6: assignees: ''
   7: ---
   9: ## Bug Description
```

### 25. `.github/ISSUE_TEMPLATE/feature_request.md`
- Bytes: `1293`
- Lines: `58`
- SHA256: `3afef35bacc9615c9ecb3e8f1a077da9b6455a083f7d73ac27345f5bfe88730b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: name: Feature Request
   3: about: Suggest an idea for this project
   4: title: '[FEATURE] '
   5: labels: enhancement
   6: assignees: ''
   7: ---
   9: ## Feature Description
```

### 26. `.github/ISSUE_TEMPLATE/template-setup.md`
- Bytes: `1653`
- Lines: `59`
- SHA256: `0ef203865168946af4739653a101f5e5038fb5a27413201ff9a885aef0a050c7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: name: Template Setup Help
   3: about: Get help setting up a new instance from this template
   4: title: '[SETUP] '
   5: labels: template-setup, question
   6: assignees: ''
   7: ---
   9: ## Setup Issue Description
```

### 27. `.github/PR_TEMPLATE_004.md`
- Bytes: `5408`
- Lines: `111`
- SHA256: `2ef8e5548197571363c8bee910757f1e3269b8f6820c49d5bf300fdb080e762b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Feature 004: App Logic Documentation
   3: ## Summary
   5: Comprehensive system behavior documentation covering startup, authentication, core workflows, data model, and compatibility patterns for the Stock Verification System.
   7: ## Primary Deliverable
   9: **[docs/APP_LOGIC_OVERVIEW.md](../docs/APP_LOGIC_OVERVIEW.md)** (928 lines)
  10: - System startup & readiness checks
  11: - Authentication & authorization flows
  12: - Core workflows: sessions, items, verification, sync, reporting
```

### 28. `.github/agents/copilot-instructions.md`
- Bytes: `1931`
- Lines: `37`
- SHA256: `dc7fa795a4967df4cbb72d3c5df9caec2e5526bdbbd4b41a0f6d0ca268193068`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # STOCK_VERIFY_2-db-maped Development Guidelines
   3: Auto-generated from all feature plans. Last updated: 2025-12-23
   5: ## Active Technologies
   6: - Python 3.9+ (backend), TypeScript 5.x (frontend) (002-system-modernization-and-enhancements)
   7: - Python 3.10+ (backend), TypeScript 5.0+ (frontend) + FastAPI, Motor (MongoDB async), pyodbc (SQL Server read-only), React Native + Expo (004-app-logic-docs)
   8: - MongoDB (system of record), SQL Server (read-only ERP source), optional Redis for cache/locks (004-app-logic-docs)
   9: - Python 3.10+ (backend), TypeScript (frontend; Expo/React Native) + FastAPI, Motor (MongoDB), pyodbc (SQL Server read-only), Expo Router, Zustand, Axios, React Query (004-app-logic-docs)
  10: - MongoDB (source of truth for app state), SQL Server (read-only ERP), optional Redis (cache/locks), frontend local storage (MMKV) (004-app-logic-docs)
```

### 29. `.github/agents/speckit.analyze.agent.md`
- Bytes: `7175`
- Lines: `185`
- SHA256: `914952d3b174e00490d4736c976438088b2266bb4713224976211a085501c37f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: description: Perform a non-destructive cross-artifact consistency and quality analysis across spec.md, plan.md, and tasks.md after task generation.
   3: ---
   5: ## User Input
   7: ```text
   8: $ARGUMENTS
   9: ```
  11: You **MUST** consider the user input before proceeding (if not empty).
```

### 30. `.github/agents/speckit.checklist.agent.md`
- Bytes: `16809`
- Lines: `295`
- SHA256: `81a80bd8d91b2afda8a8128181234c6710ee24a5c22b942c7f5c814258008830`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: description: Generate a custom checklist for the current feature based on user requirements.
   3: ---
   5: ## Checklist Purpose: "Unit Tests for English"
   7: **CRITICAL CONCEPT**: Checklists are **UNIT TESTS FOR REQUIREMENTS WRITING** - they validate the quality, clarity, and completeness of requirements in a given domain.
   9: **NOT for verification/testing**:
  11: - ❌ NOT "Verify the button clicks correctly"
  12: - ❌ NOT "Test error handling works"
```

### 31. `.github/agents/speckit.clarify.agent.md`
- Bytes: `11334`
- Lines: `182`
- SHA256: `a9c8494569553e9e4b20b1e77c00da9667d0810030aa61bcd2b654782ab7a5cd`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: description: Identify underspecified areas in the current feature spec by asking up to 5 highly targeted clarification questions and encoding answers back into the spec.
   3: handoffs:
   4:   - label: Build Technical Plan
   5:     agent: speckit.plan
   6:     prompt: Create a plan for the spec. I am building with...
   7: ---
   9: ## User Input
```

### 32. `.github/agents/speckit.constitution.agent.md`
- Bytes: `5246`
- Lines: `83`
- SHA256: `2c4c014d731aa5aea03ddb864d379389e24edc33618c91bd7c26185c2c15f876`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: description: Create or update the project constitution from interactive or provided principle inputs, ensuring all dependent templates stay in sync.
   3: handoffs:
   4:   - label: Build Specification
   5:     agent: speckit.specify
   6:     prompt: Implement the feature specification based on the updated constitution. I want to build...
   7: ---
   9: ## User Input
```

### 33. `.github/agents/speckit.implement.agent.md`
- Bytes: `7501`
- Lines: `136`
- SHA256: `3440435e0fbcf96e623aee95e4c4bb6600a0d334a6740bce83116635305a56fc`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: description: Execute the implementation plan by processing and executing all tasks defined in tasks.md
   3: ---
   5: ## User Input
   7: ```text
   8: $ARGUMENTS
   9: ```
  11: You **MUST** consider the user input before proceeding (if not empty).
```

### 34. `.github/agents/speckit.plan.agent.md`
- Bytes: `3120`
- Lines: `90`
- SHA256: `5768e219ec46b297456136cb37b21676860161c7785152690b68ba875f762076`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: description: Execute the implementation planning workflow using the plan template to generate design artifacts.
   3: handoffs:
   4:   - label: Create Tasks
   5:     agent: speckit.tasks
   6:     prompt: Break the plan into tasks
   7:     send: true
   8:   - label: Create Checklist
```

### 35. `.github/agents/speckit.specify.agent.md`
- Bytes: `12728`
- Lines: `259`
- SHA256: `c2792f157a7c9e4728ecde8b1981b90d23826a553c331d6ff41b5545280abe79`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: description: Create or update the feature specification from a natural language feature description.
   3: handoffs:
   4:   - label: Build Technical Plan
   5:     agent: speckit.plan
   6:     prompt: Create a plan for the spec. I am building with...
   7:   - label: Clarify Spec Requirements
   8:     agent: speckit.clarify
```

### 36. `.github/agents/speckit.tasks.agent.md`
- Bytes: `6328`
- Lines: `138`
- SHA256: `d6bc6bdc43f938ddff4751f11e02905194bd16f44ec32eac7ca7c7b4a805a7e8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: description: Generate an actionable, dependency-ordered tasks.md for the feature based on available design artifacts.
   3: handoffs:
   4:   - label: Analyze For Consistency
   5:     agent: speckit.analyze
   6:     prompt: Run a project analysis for consistency
   7:     send: true
   8:   - label: Implement Project
```

### 37. `.github/agents/speckit.taskstoissues.agent.md`
- Bytes: `1089`
- Lines: `31`
- SHA256: `23f5098f197d2d3512907276c466a4e03b27619721cee85361f30b21289431da`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: description: Convert existing tasks into actionable, dependency-ordered GitHub issues for the feature based on available design artifacts.
   3: tools: ['github/github-mcp-server/issue_write']
   4: ---
   6: ## User Input
   8: ```text
   9: $ARGUMENTS
  10: ```
```

### 38. `.github/copilot-instructions.md`
- Bytes: `2978`
- Lines: `54`
- SHA256: `474e8c76d7666d8a7d0ab3fe4703fc521dec346c705fdeb4ba2c7bf871e3ae07`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Copilot Instructions — Stock Verify Codebase
   3: These rules help AI coding agents work productively and safely in this repo. Focus on the patterns actually used here; don’t introduce new frameworks or rewrite architecture.
   5: ## 🏗 Architecture & Boundaries
   6: - **Hybrid Database Model**:
   7:   - **MongoDB (Primary)**: Stores app state, sessions, counts, and discrepancies. **ALL WRITES go here.**
   8:   - **SQL Server (ERP)**: **READ-ONLY** source of truth for items/inventory. Never write to SQL Server.
   9:   - **Sync**: Data flows `SQL Server -> MongoDB -> Frontend`.
  10: - **Backend**: FastAPI (Python 3.10+), Motor (Async Mongo), PyODBC (SQL).
```

### 39. `.github/copilot-instructions.md.new`
- Bytes: `4118`
- Lines: `81`
- SHA256: `74b58148f58a6776bbd15a1b7559a4f7203cef8ee6d2b9ea8968dd372d9dd31e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Copilot Instructions — Stock Verify Codebase
   3: These rules help AI coding agents work productively and safely in this repo. Focus on the patterns actually used here; don’t introduce new frameworks or rewrite architecture.
   5: ## Project Snapshot
   6: - **Backend**: FastAPI (Python 3.10+), MongoDB (Motor async), SQL Server (pyodbc, read-only).
   7: - **Frontend**: React Native + Expo (TypeScript) with file-based routing and Zustand.
   8: - **Ports**: Backend `8001`, Expo `8081` (LAN mode), Docker Frontend `3000`.
   9: - **Core Files**:
  10:   - `backend/server.py`: Main app entry point, router assembly.
```

### 40. `.github/dependabot.yml`
- Bytes: `391`
- Lines: `17`
- SHA256: `55596f33d1d0cff3bb577770a651f09ce128e67ef15b3e6ab71913fe48132564`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: version: 2
   2: updates:
   3:   - package-ecosystem: "pip"
   4:     directory: "/backend"
   5:     schedule:
   6:       interval: "weekly"
   7:       day: "monday"
   8:       time: "03:00"
```

### 41. `.github/markdown-link-check-config.json`
- Bytes: `374`
- Lines: `22`
- SHA256: `b307f4012e34c985b9a7bdd86db70a6853e9d297800f2549f46e273f4507a515`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "ignorePatterns": [
   3:     {
   4:       "pattern": "^http://localhost"
   5:     },
   6:     {
   7:       "pattern": "^https://localhost"
   8:     },
```

### 42. `.github/prompts/add-api-endpoint.prompt.md`
- Bytes: `5278`
- Lines: `201`
- SHA256: `3b0765e0043a0439742fec83062d5bbf418aaa7920d7412a9c6391e0bd06abe2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `CreateItemRequest`
  - `Config`
  - `ItemResponse`
- Excerpt (first non-empty lines):

```text
   1: ---
   2: mode: agent
   3: description: Add API endpoint with full implementation following Stock Verify patterns
   4: tools: ['read_file', 'grep_search', 'semantic_search', 'list_dir', 'create_file', 'replace_string_in_file']
   5: ---
   7: # API Endpoint Generator
   9: You are a FastAPI expert creating endpoints that follow Stock Verify patterns exactly.
  11: ## Stock Verify API Patterns
```

### 43. `.github/prompts/code-review.prompt.md`
- Bytes: `2279`
- Lines: `102`
- SHA256: `9f2cd72d0dba4525f6b57f5d1717a9ec3249b3331e6bad31b8ee637f5315e86b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: mode: agent
   3: description: Comprehensive code review for quality and patterns
   4: tools: ['read_file', 'grep_search', 'semantic_search', 'list_dir']
   5: ---
   7: # Code Review Agent
   9: You are a principal engineer reviewing code for quality, maintainability, and adherence to project patterns.
  11: ## Project Standards
```

### 44. `.github/prompts/debug-issue.prompt.md`
- Bytes: `2651`
- Lines: `135`
- SHA256: `01210ebc589f71971af88d22b0d6eefe8c9bd242a35cefd7ead99d07d22aedf8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: mode: agent
   3: description: Debug and fix issues with systematic analysis
   4: tools: ['read_file', 'grep_search', 'semantic_search', 'list_dir', 'run_in_terminal', 'get_errors']
   5: ---
   7: # Debug Agent
   9: You are a debugging expert who systematically analyzes issues and proposes fixes.
  11: ## Debugging Framework
```

### 45. `.github/prompts/generate-docs.prompt.md`
- Bytes: `3221`
- Lines: `148`
- SHA256: `156e4c99408574092e8779d897c7756312499e31d47947a81c449f27e444a733`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `function_name`
- Excerpt (first non-empty lines):

```text
   1: ---
   2: mode: agent
   3: description: Generate comprehensive documentation for code
   4: tools: ['read_file', 'grep_search', 'list_dir']
   5: ---
   7: # Documentation Generator
   9: You are a technical writer generating developer-focused documentation.
  11: ## Documentation Standards
```

### 46. `.github/prompts/generate-tests.prompt.md`
- Bytes: `2972`
- Lines: `121`
- SHA256: `157ee91c103cdfb1a44f504f87a485149449addc0c8f82047ecd00c13c878672`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `mock_mongo_client`
  - `mock_sql_connection`
  - `sample_data`
  - `TestFunctionName`
  - `test_happy_path`
  - `test_edge_case_empty`
  - `test_error_invalid_input`
  - `TestAPIEndpoint`
- Excerpt (first non-empty lines):

```text
   1: ---
   2: mode: agent
   3: description: Generate comprehensive pytest tests for specified file
   4: tools: ['read_file', 'grep_search', 'semantic_search', 'list_dir', 'run_in_terminal']
   5: ---
   7: # Test Generation Agent
   9: You are a QA engineer specializing in pytest. Generate comprehensive tests for the specified file.
  11: ## Project Testing Standards
```

### 47. `.github/prompts/refactor-code.prompt.md`
- Bytes: `3734`
- Lines: `165`
- SHA256: `a13ab161fb499b8b8dc34dc56f8eb99b86daea546e4daef0181a98661bdbba85`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `process_order`
  - `validate_order`
  - `process_order_items`
  - `notify_customer`
  - `process_order`
  - `calculate_discount`
  - `DiscountStrategy`
  - `calculate`
  - `PremiumDiscount`
  - `calculate`
  - `RegularDiscount`
  - `calculate`
  - `calculate_discount`
- Excerpt (first non-empty lines):

```text
   1: ---
   2: mode: agent
   3: description: Refactor complex code for better maintainability
   4: tools: ['read_file', 'grep_search', 'semantic_search', 'list_dir']
   5: ---
   7: # Refactoring Agent
   9: You are an expert software engineer specializing in code refactoring and clean code principles.
  11: ## Refactoring Triggers
```

### 48. `.github/prompts/security-audit.prompt.md`
- Bytes: `1704`
- Lines: `65`
- SHA256: `fe0b0b5bad3a979598573495b89def83230535436a65eb28cddcc7d305e58638`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: mode: agent
   3: description: Run comprehensive security audit on specified files
   4: tools: ['read_file', 'grep_search', 'semantic_search', 'list_dir']
   5: ---
   7: # Security Audit Agent
   9: You are a security researcher specializing in OWASP Top 10 vulnerabilities. Audit the specified file(s) for security issues.
  11: ## Context
```

### 49. `.github/prompts/speckit.analyze.prompt.md`
- Bytes: `31`
- Lines: `4`
- SHA256: `bb93dbbafa96d07b7cd07fc7061d8adb0c6b26cb772a52d0dce263b1ca2b9b77`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: agent: speckit.analyze
   3: ---
```

### 50. `.github/prompts/speckit.checklist.prompt.md`
- Bytes: `33`
- Lines: `4`
- SHA256: `c3aea7526c5cbfd8665acc9508ad5a9a3f71e91a63c36be7bed13a834c3a683c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: agent: speckit.checklist
   3: ---
```

### 51. `.github/prompts/speckit.clarify.prompt.md`
- Bytes: `31`
- Lines: `4`
- SHA256: `ce79b3437ca918d46ac858eb4b8b44d3b0a02c563660c60d94c922a7b5d8d4f4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: agent: speckit.clarify
   3: ---
```

### 52. `.github/prompts/speckit.constitution.prompt.md`
- Bytes: `36`
- Lines: `4`
- SHA256: `38f937279de14387601422ddfda48365debdbaf47b2d513527b8f6d8a27d499d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: agent: speckit.constitution
   3: ---
```

### 53. `.github/prompts/speckit.implement.prompt.md`
- Bytes: `33`
- Lines: `4`
- SHA256: `5053a17fb9238338c63b898ee9c80b2cb4ad1a90c6071fe3748de76864ac6a80`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: agent: speckit.implement
   3: ---
```

### 54. `.github/prompts/speckit.plan.prompt.md`
- Bytes: `28`
- Lines: `4`
- SHA256: `2098dae6bd9277335f31cb150b78bfb1de539c0491798e5cfe382c89ab0bcd0e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: agent: speckit.plan
   3: ---
```

### 55. `.github/prompts/speckit.specify.prompt.md`
- Bytes: `31`
- Lines: `4`
- SHA256: `7b2cc4dc6462da1c96df46bac4f60e53baba3097f4b24ac3f9b684194458aa98`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: agent: speckit.specify
   3: ---
```

### 56. `.github/prompts/speckit.tasks.prompt.md`
- Bytes: `29`
- Lines: `4`
- SHA256: `88fc57c289f99d5e9d35c255f3e2683f73ecb0a5155dcb4d886f82f52b11841f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: agent: speckit.tasks
   3: ---
```

### 57. `.github/prompts/speckit.taskstoissues.prompt.md`
- Bytes: `37`
- Lines: `4`
- SHA256: `2f9636d4f312a1470f000747cb62677fec0655d8b4e2357fa4fbf238965fa66d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: agent: speckit.taskstoissues
   3: ---
```

### 58. `.github/pull_request_template.md`
- Bytes: `1773`
- Lines: `48`
- SHA256: `74bf59d89bab49a9beba0c600b854d49460f2fc5509dc5d3bfeb926651b33efc`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Pull Request
   3: ## Summary
   4: Describe the business and technical change in 3-6 lines.
   6: ## Type of Change
   7: - [ ] Bug fix
   8: - [ ] New feature
   9: - [ ] Breaking change
  10: - [ ] Refactor
```

### 59. `.github/template.yml`
- Bytes: `1317`
- Lines: `31`
- SHA256: `7a1de65a2afef008e3a9def8a648455e3e89e6add1a414fef41d3aba45d4a64a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # GitHub Template Repository Configuration
   2: # This file configures the repository as a template for creating new Stock Verify instances
   4: name: Stock Verify Template
   5: description: A production-ready stock verification system with FastAPI backend and React Native frontend
   7: # Files to exclude when creating a new repository from this template
   8: exclude:
   9:   - .github/workflows/  # Let new instances configure their own CI/CD
  10:   - backend.pid
```

### 60. `.github/workflows/main.yml`
- Bytes: `8800`
- Lines: `305`
- SHA256: `474327f80f5113dc81973badda3eb7e632153fc2c052b1851c91fccb809e2637`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Stock Verify System - Main CI/CD Pipeline
   2: # Runs on push to main/develop and on PRs
   4: name: CI/CD Pipeline
   6: on:
   7:   push:
   8:     branches: [main, develop]
   9:   pull_request:
  10:     branches: [main, develop]
```

### 61. `.github/workflows/pr-checks.yml`
- Bytes: `1693`
- Lines: `68`
- SHA256: `93bfa7afc6d1ebddf0d7d855309dc5452576c7d04d62d467ec8acc08567a2e51`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Quick Security & Quality Checks
   2: # Runs on all PRs for fast feedback
   4: name: PR Checks
   6: on:
   7:   pull_request:
   8:     branches: [main, develop, my-fix-branch]
  10: jobs:
  11:   quick-checks:
```

### 62. `.github/workflows/release.yml`
- Bytes: `4829`
- Lines: `167`
- SHA256: `544972f91f477da481b14dce6ed95c45eced4dca61515eb3f34b6049040bfa29`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Release Workflow
   2: # Creates releases and builds production artifacts
   4: name: Release
   6: on:
   7:   push:
   8:     tags:
   9:       - 'v*'
  10:   workflow_dispatch:
```

### 63. `.github/workflows/scheduled.yml`
- Bytes: `1621`
- Lines: `57`
- SHA256: `b7ca4a4a5b26e51af42186e5c11de11c4b02d72f2630df51d8a0daa702e34f4c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Scheduled Maintenance Tasks
   2: # Runs daily for dependency updates and health checks
   4: name: Scheduled Tasks
   6: on:
   7:   schedule:
   8:     - cron: '0 6 * * *'  # Daily at 6 AM UTC
   9:   workflow_dispatch:
  11: jobs:
```

## backend

### 64. `backend/.coveragerc`
- Bytes: `3254`
- Lines: `112`
- SHA256: `d091e009e8258f3cddbce9b1d175dfe6db98315bb09a967ae81d5e8d1f7b99b2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: [run]
   2: omit =
   3:     services/advanced_erp_sync.py
   4:     services/auto_error_finder.py
   5:     services/auto_recovery.py
   6:     services/change_detection_sync.py
   7:     services/data_validation_service.py
   8:     services/database_manager.py
```

### 65. `backend/.env.example`
- Bytes: `3883`
- Lines: `94`
- SHA256: `de736b7ba163ec5b90f4e186ccaedd00d8e520a4f73b2798778224f268053c04`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # ============================================================================
   2: # Stock Verify Application - Environment Configuration (Development)
   3: # ============================================================================
   4: # SECURITY WARNING: Never commit actual .env files to version control!
   5: # This is a template file. Copy to .env and fill in your actual values.
   6: # ============================================================================
   8: # ----------------------------------------------------------------------------
   9: # MongoDB Configuration (REQUIRED)
```

### 66. `backend/.flake8`
- Bytes: `1150`
- Lines: `38`
- SHA256: `674c023fb96aaef0068eb19190cd035d932433824f6cdd8a29a191f39debde47`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: [flake8]
   2: # Ignore complexity warnings (C901) - these are informational
   3: # Ignore E402 - module level import not at top (common in scripts with sys.path manipulation)
   4: # Ignore F811 - redefinition of unused (often intentional for optional imports)
   5: # Ignore W503 - line break before binary operator (conflicts with PEP 8 and black)
   6: # Ignore E501 - line too long (black handles this, sometimes allows slightly longer lines)
   7: # Ignore E203 - whitespace before ':' (conflicts with black's slice formatting)
   8: ignore = C901, E402, F811, W503, E501, E203
```

### 67. `backend/.github/workflows/dependency-audit.yml`
- Bytes: `915`
- Lines: `40`
- SHA256: `c4efeccb4e659e3b06280f00572887c4cc424e9aba4745a63ac09f72fa855046`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: name: Dependency audit (backend)
   3: on:
   4:   push:
   5:     paths:
   6:       - 'backend/**'
   7:   pull_request:
   8:     paths:
   9:       - 'backend/**'
```

### 68. `backend/Dockerfile`
- Bytes: `859`
- Lines: `30`
- SHA256: `7557e59551e338279bfe2f770a34e535d2828bf930e596178973c7c7ad666079`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: FROM python:3.11-slim
   3: ENV PYTHONDONTWRITEBYTECODE=1 \
   4:     PYTHONUNBUFFERED=1
   6: WORKDIR /app
   8: # Install system dependencies for pyodbc (SQL Server)
   9: RUN apt-get update && apt-get install -y --no-install-recommends \
  10:     unixodbc \
  11:     unixodbc-dev \
```

### 69. `backend/README.md`
- Bytes: `1179`
- Lines: `28`
- SHA256: `b9d032d7661564e793b67464d390edff1f837dc21ed9b7e7b948740ca71e1cf8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Stock Verification System (Backend)
   3: ## 🚨 GOVERNANCE FORBIDDEN ZONE (DO NOT TOUCH)
   5: The following files and logic paths are **LOCKED** by the Developer Execution Mandate (v2.1).
   6: Modifying these without the express written consent of the Governance Board (User) is **Strictly Prohibited**.
   8: ### 🚫 Restricted Files
   9: *   `backend/services/sql_verification_service.py` (Core Logic)
  10: *   `backend/services/sql_sync_service.py` (Write logic)
  11: *   `backend/api/item_verification_api.py` (Verification logic)
```

### 70. `backend/__init__.py`
- Bytes: `75`
- Lines: `3`
- SHA256: `8fc0f4007f983956b114b015566dbf6e058f7afdc50a1cffac18ddd4ff1042b1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # This file makes the backend directory a Python package
   2: # It can be empty
```

### 71. `backend/api/STOCK_VERIFY_2-db-maped.code-workspace`
- Bytes: `319`
- Lines: `13`
- SHA256: `9917d0bb227726a09510481250819b829a5e30e97c4089f59a4da0476963531c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:     "folders": [
   3:         {
   4:             "path": "../.."
   5:         },
   6:         {
   7:             "name": "homebrew @ 43137fe",
   8:             "uri": "gitlens://7b22726566223a2234333133376665383737313664366332376339313630373466313066303533316636316333363464222c227265706f50617468223a222f6f70742f686f6d6562726577227d/opt/homebrew?{\"ref\":\"43137fe\"}"
```

### 72. `backend/api/__init__.py`
- Bytes: `53`
- Lines: `2`
- SHA256: `d697eef0ac91e73115a7fc5433889430b9d4170f29c8dc7753e9f0fb31a28be4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # This file makes the api directory a Python package
```

### 73. `backend/api/admin_control_api.py`
- Bytes: `35153`
- Lines: `1052`
- SHA256: `b8c5c4674963c5de41531a562c6e6f1c260e1b3b6153741610e9c923d44edfa6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_parse_ports_csv`
  - `_read_backend_port_file`
  - `_get_backend_ports`
  - `_get_frontend_ports`
  - `ServiceStatus`
  - `_safe_int`
  - `require_admin`
  - `_match_process_on_ports`
  - `_calculate_uptime`
  - `_get_backend_status`
  - `is_backend_process`
  - `_get_frontend_status`
  - `is_frontend_process`
  - `_test_sql_connection`
  - `_get_sql_server_status`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Admin Control Panel API
   3: Provides endpoints for service management, status monitoring, and system control
   4: """
   6: # ruff: noqa: E402
   7: import sys
   8: from pathlib import Path
  10: # Add project root to path for direct execution (debugging)
```

### 74. `backend/api/admin_dashboard_api.py`
- Bytes: `15990`
- Lines: `478`
- SHA256: `c3db704337d3417feb7037f001cec32cdd612eceb688be38270e1f51117b1339`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `KPIResponse`
  - `SystemStatusResponse`
  - `ActiveUserInfo`
  - `ErrorLogEntry`
  - `PerformanceMetric`
  - `get_memory_usage`
  - `get_cpu_usage`
  - `get_uptime`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Admin Dashboard API - Live KPIs, System Status, User Monitoring
   3: PC-based web dashboard endpoints for administrators
   4: """
   6: import logging
   7: import os
   8: import time
   9: from datetime import datetime, timedelta, timezone
```

### 75. `backend/api/analytics_api.py`
- Bytes: `999`
- Lines: `38`
- SHA256: `c3ca127256e2f476d4ecf065b32bfc1bfb7d28ce05f8b8fdc92cbbf219b80cf5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: """
   2: Analytics API - Exposes KPIs and Heatmaps
   3: """
   5: import logging
   6: from typing import Optional
   7: from fastapi import APIRouter, Query
   8: from backend.auth.permissions import Permission, require_permission
   9: from backend.db.runtime import get_db
```

### 76. `backend/api/auth.py`
- Bytes: `42892`
- Lines: `1210`
- SHA256: `d8da8be97c3bbac97d3ab011fae5666d7998108fb36821293bc60e9fcd34293e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_validate_user_password`
  - `_build_login_response`
- Excerpt (first non-empty lines):

```text
   1: import logging
   2: import os
   3: from datetime import datetime, timedelta, timezone
   4: from typing import Any, Dict, Optional, cast
   6: from fastapi import APIRouter, Depends, HTTPException, Request
   8: from backend.api.schemas import (
   9:     ApiResponse,
  10:     PasswordResetConfirm,
```

### 77. `backend/api/backend_config_api.py`
- Bytes: `9403`
- Lines: `289`
- SHA256: `300f489685804296211f61beb1e85426b670b41d4549e991151dc6df6359ce39`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `BackendInfoResponse`
  - `FrontendConfigResponse`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Backend Configuration API Endpoints
   3: Provides backend connection information for frontend discovery
   4: """
   6: import logging
   7: from datetime import datetime, timezone
   8: from pathlib import Path
   9: from typing import Any, Dict
```

### 78. `backend/api/copilot_api.py`
- Bytes: `611`
- Lines: `17`
- SHA256: `59ea8d1b913b8a08b55b283bab86729117e284321b1b5d6cf352d3b7350dbf29`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: from copilotkit import CopilotKitSDK
   2: from copilotkit.integrations.fastapi import add_fastapi_endpoint
   3: from fastapi import APIRouter
   5: # Initialize Router
   6: router = APIRouter()
   8: # Initialize SDK
   9: # Note: You can add agents here later, e.g., agents=[my_langgraph_agent]
  10: sdk = CopilotKitSDK(agents=[], commands={})
```

### 79. `backend/api/count_lines_api.py`
- Bytes: `44191`
- Lines: `1141`
- SHA256: `6099524ef67e1f48bb39f4bf3bf00e311de9c6c19d1e875468e82b1f07bf8f14`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `init_count_lines_api`
  - `_get_db_client`
  - `_require_supervisor`
  - `detect_risk_flags`
  - `calculate_financial_impact`
  - `_stock_value`
- Excerpt (first non-empty lines):

```text
   1: import inspect
   2: import logging
   3: import uuid
   4: from datetime import datetime, timezone
   5: from typing import Any, Optional
   7: from bson import ObjectId
   8: from fastapi import APIRouter, Depends, HTTPException, Query, Request
  10: from backend.api.schemas import BulkCountLineUpdate, CountLineCreate
```

### 80. `backend/api/count_state_api.py`
- Bytes: `12766`
- Lines: `393`
- SHA256: `072945f6275ce3ef01c0cd49481a1170a1df8bd1113968c8bc0f611c902b1836`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_get_user_id`
  - `StateTransitionRequest`
  - `StateTransitionResponse`
  - `EditPermissionResponse`
  - `ReopenRequest`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Count Line State Management API - Post-submit edit control
   4: Provides endpoints for managing count line state transitions:
   5: - Submit count line
   6: - Approve/Reject count line
   7: - Reopen count line
   8: - Lock count line
   9: - Check edit permissions
```

### 81. `backend/api/count_submission_api.py`
- Bytes: `5269`
- Lines: `156`
- SHA256: `fe447d8f581d411a3980e23637149662abf16ad19309c877675085a20207c7e8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: """
   2: Count line submission endpoint with variance threshold checking
   3: """
   5: import logging
   6: from datetime import datetime, timezone
   8: from fastapi import APIRouter, Depends, HTTPException
  10: from backend.api.schemas_variance import CountLineSubmission
  11: from backend.auth.dependencies import get_current_user
```

### 82. `backend/api/dashboard_analytics_api.py`
- Bytes: `21778`
- Lines: `581`
- SHA256: `de0315759cc2c47bb5023d4cf986bbc9c5ef5e2d01a2d901ae888fe210171228`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `QuantityStatus`
  - `ValueStatus`
  - `DashboardOverview`
  - `BreakdownItem`
  - `DashboardBreakdown`
  - `DrilldownItem`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Dashboard Analytics API - Real-time monitoring with quantity and value tracking
   4: Provides comprehensive dashboard KPIs for admin/supervisor monitoring:
   5: - Quantity-based progress (units counted / total units)
   6: - Value-based progress (₹ counted / ₹ total)
   7: - Breakdowns by location, category, session, date
   8: - Drill-down to item/batch/serial level
   9: """
```

### 83. `backend/api/dynamic_fields_api.py`
- Bytes: `13446`
- Lines: `423`
- SHA256: `c92203996cbb9fb15ecddd10e15082297e809b1c63ff2667eb78c48be22e664b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `get_dynamic_fields_service`
  - `FieldDefinitionCreate`
  - `FieldDefinitionUpdate`
  - `FieldValueSet`
  - `BulkFieldValueSet`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Dynamic Fields API
   3: Endpoints for managing custom dynamic fields for items
   4: """
   6: import logging
   7: from typing import Any, Optional
   9: from fastapi import APIRouter, Depends, HTTPException
  10: from pydantic import BaseModel, Field
```

### 84. `backend/api/dynamic_reports_api.py`
- Bytes: `13821`
- Lines: `413`
- SHA256: `f5238d824283ed9461457c4c6e82164a884671a79186868ff09c6d143c0f6ff1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `get_dynamic_report_service`
  - `ReportField`
  - `ReportTemplate`
  - `ReportGeneration`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Dynamic Report Generation API
   3: Endpoints for creating and generating custom reports
   4: """
   6: import io
   7: import logging
   8: from typing import Any, Optional
  10: from fastapi import APIRouter, Depends, HTTPException
```

### 85. `backend/api/enhanced_item_api.py`
- Bytes: `27529`
- Lines: `761`
- SHA256: `892ad248bf27643a774e6ec22f8b4d4262e5449ff3e80db4dc29733eaf8b8caf`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `init_enhanced_api`
  - `_validate_barcode_format`
  - `ItemResponse`
  - `__init__`
  - `_build_relevance_stage`
  - `_build_match_conditions`
  - `_get_stock_level_filter`
  - `_build_search_pipeline`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Enhanced Item API - Upgraded endpoints with better error handling,
   3: caching, validation, and performance monitoring
   4: """
   6: import asyncio
   7: import logging
   8: import re
   9: import time
```

### 86. `backend/api/enrichment_api.py`
- Bytes: `11105`
- Lines: `316`
- SHA256: `4f5fbdf65f784b4144e89ab4fdf953c6b0e1f374f2f8bbdb7aa3d5c97f0fb2be`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `init_enrichment_api`
  - `EnrichmentRequest`
  - `EnrichmentResponse`
  - `BulkEnrichmentRequest`
  - `DataCompletenessResponse`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Enrichment API Endpoints - Handle item data enrichment and corrections
   3: Provides endpoints for adding serial numbers, MRP, HSN codes, and other missing data
   4: """
   6: import logging
   7: from datetime import datetime
   8: from typing import Any, Optional
  10: from fastapi import APIRouter, Depends, HTTPException, Query
```

### 87. `backend/api/enterprise_api.py`
- Bytes: `21259`
- Lines: `625`
- SHA256: `ca06e98194f8c7edaee6a15f6c610d42f18f7f82132605e9abf83caa37819b73`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `IPListEntry`
  - `FeatureFlagRequest`
  - `DataSubjectRequestCreate`
  - `RetentionPolicyRequest`
  - `UnlockAccountRequest`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Enterprise API Router
   3: Exposes enterprise-grade features via REST API
   4: """
   6: import logging
   7: from datetime import datetime, timedelta, timezone
   8: from typing import Any, Optional
  10: from fastapi import APIRouter, Depends, HTTPException, Query, Request
```

### 88. `backend/api/erp_api.py`
- Bytes: `16817`
- Lines: `479`
- SHA256: `847bfc3a5aa6697b773994e52c7cafd4eeac2f36780347dbacdf948f92f94a4a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `init_erp_api`
  - `_normalize_barcode_input`
  - `_stock_value`
- Excerpt (first non-empty lines):

```text
   1: import logging
   2: import re
   3: from datetime import datetime, timezone
   4: from typing import Any, Optional
   6: from fastapi import APIRouter, Depends, HTTPException, Query, Request
   7: from motor.motor_asyncio import AsyncIOMotorDatabase
   9: from backend.api.schemas import ERPItem
  10: from backend.auth.dependencies import get_current_user
```

### 89. `backend/api/error_reporting_api.py`
- Bytes: `13473`
- Lines: `421`
- SHA256: `bf1034d5ededf3c628238c4e558bf5d7909f9e98fd169c4f91cb9a4d9b685599`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ErrorReport`
  - `ErrorLogEntry`
  - `ErrorStatistics`
  - `ErrorDashboard`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Error Reporting and Admin Dashboard API
   3: Handles error logging, monitoring, and admin notifications
   4: """
   6: import logging
   7: from datetime import datetime, timedelta, timezone
   8: from typing import Any, Optional
  10: from fastapi import APIRouter, Depends, HTTPException, Query
```

### 90. `backend/api/exports_api.py`
- Bytes: `10212`
- Lines: `315`
- SHA256: `c65b1c5bae05cab37b5882aa0358330d4d81192c60e35b7f1558edee7bbd7608`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ExportScheduleCreate`
  - `ExportScheduleUpdate`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Scheduled Exports API
   3: Endpoints for managing scheduled exports
   4: """
   6: from datetime import datetime, timezone
   7: from typing import Any, Optional
   9: from fastapi import APIRouter, Depends, HTTPException, Response, status
  10: from pydantic import BaseModel
```

### 91. `backend/api/health.py`
- Bytes: `17512`
- Lines: `528`
- SHA256: `b3bafb6e7c7dad936aacf1bb978d03da9bcefd02faecaa2c4ad02b565b417511`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `get_mongodb_status`
  - `_check_system_resources_health`
  - `_build_mongo_pool_info`
  - `_gather_system_resources`
  - `_augment_sql_pool_stats`
  - `_parse_version`
  - `_compare_versions`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Health Check Endpoints
   3: Provides health, readiness, and liveness checks for monitoring and Kubernetes
   4: """
   6: import logging
   7: import os
   8: import re
   9: from datetime import datetime, timezone
```

### 92. `backend/api/item_verification_api.py`
- Bytes: `31344`
- Lines: `856`
- SHA256: `921d9b2de1039285484aa57f3e789cc13ff478d5af44140cf6b51d26dd59b1e2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `init_verification_api`
  - `_regex_filter`
  - `build_item_filter_query`
  - `serialize_mongo_datetime`
  - `serialize_item_document`
  - `VerificationRequest`
  - `ItemUpdateRequest`
  - `_calculate_variance`
  - `_build_item_update_doc`
  - `_build_verification_log_doc`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Item Verification API - Verification, filtering, CSV export, and variance tracking
   3: """
   5: import asyncio
   6: import csv
   7: import io
   8: import logging
   9: from copy import deepcopy
```

### 93. `backend/api/legacy_routes.py`
- Bytes: `54796`
- Lines: `1556`
- SHA256: `69f7c528727ff507b4882a4c853c577574ae0beea34a075a4dc28229558ec07e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `create_access_token`
  - `detect_risk_flags`
  - `calculate_financial_impact`
  - `_get_db_client`
  - `_require_supervisor`
- Excerpt (first non-empty lines):

```text
   1: # ruff: noqa: E402
   2: # cSpell:ignore bson hashpw gensalt checkpw unverify
   4: import asyncio
   5: import logging
   6: import os
   7: import re
   8: import sys
   9: import uuid
```

### 94. `backend/api/locations_api.py`
- Bytes: `6369`
- Lines: `188`
- SHA256: `ebe3bf2a8333e358265fd8837223869196d9b398fece6bf91f25f913b6890449`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_defaults_for_zone`
  - `get_zones`
- Excerpt (first non-empty lines):

```text
   1: import logging
   2: from typing import Any, Optional
   4: from fastapi import APIRouter, Depends  # type: ignore
   6: from backend.auth.dependencies import get_current_user
   7: from backend.db.runtime import get_db
   8: from backend.sql_server_connector import sql_connector
  10: logger = logging.getLogger(__name__)
  12: router = APIRouter(prefix="/api/locations", tags=["Locations"])
```

### 95. `backend/api/logs_api.py`
- Bytes: `8329`
- Lines: `282`
- SHA256: `5c288e179c83dedf27e58d02bfeef26e234c14fb081314c1ed1fd46ce42e72e9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ErrorLogModel`
  - `ActivityLogModel`
  - `build_date_query`
- Excerpt (first non-empty lines):

```text
   1: import logging
   2: from datetime import datetime, timezone
   3: from typing import Any, Optional
   5: from bson import ObjectId
   6: from bson.errors import InvalidId
   7: from fastapi import APIRouter, Body, Depends, HTTPException, Query
   8: from pydantic import BaseModel
  10: from backend.auth.dependencies import auth_deps, require_admin, require_permissions
```

### 96. `backend/api/mapping_api.py`
- Bytes: `12527`
- Lines: `372`
- SHA256: `ebeb46383727f702edd6be636196a477e9e0344ecd3e30e38aa965d680c6825e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ConnectionParams`
  - `ColumnMapping`
  - `MappingConfig`
  - `_require_mapping_admin`
  - `_enforce_configured_sql_target`
  - `get_connection_string`
  - `get_connection`
  - `_safe_identifier`
  - `_encrypt_erp_password`
- Excerpt (first non-empty lines):

```text
   1: import base64
   2: import hashlib
   3: import logging
   4: import re
   5: from datetime import datetime
   6: from typing import Any, Optional
   8: import pyodbc
   9: from fastapi import APIRouter, Depends, HTTPException
```

### 97. `backend/api/master_settings_api.py`
- Bytes: `11036`
- Lines: `294`
- SHA256: `a90703e59a1cd437ea1cec92e49351b94d46f623e10196131f69b019e7ea3c77`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `get_current_user`
  - `require_admin`
  - `SystemParameters`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Master Settings API - Centralized system configuration
   3: """
   5: import logging
   6: from datetime import datetime
   7: from typing import Optional
   9: from fastapi import APIRouter, Depends, HTTPException, status
  10: from pydantic import BaseModel, Field
```

### 98. `backend/api/metrics_api.py`
- Bytes: `5309`
- Lines: `178`
- SHA256: `46cdd76436431c86ef110f1772f4db8a114237a850fc7b95facef8c6e56f1754`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `set_monitoring_service`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Metrics API
   3: Prometheus-compatible metrics endpoint
   4: """
   6: from fastapi import APIRouter, Response
   8: from backend.db.runtime import get_db
  10: metrics_router = APIRouter(prefix="/metrics", tags=["metrics"])
  12: # Global monitoring service reference (will be set from server.py)
```

### 99. `backend/api/notes_api.py`
- Bytes: `4764`
- Lines: `146`
- SHA256: `266e1cd6ce232d9e0ce6f67f902c46244fafabb0322c961ff3e4a3abdbf72e06`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `NoteCreate`
  - `Note`
  - `_serialize_note`
- Excerpt (first non-empty lines):

```text
   1: from datetime import datetime, timezone
   2: from typing import Any, Optional
   4: from bson import ObjectId
   5: from fastapi import APIRouter, Depends, HTTPException, Query
   6: from pydantic import BaseModel, Field
   8: from backend.auth.dependencies import get_current_user_async as get_current_user
   9: from backend.db.runtime import get_db
  10: from backend.utils.api_utils import create_safe_error_response, sanitize_for_logging
```

### 100. `backend/api/notifications_api.py`
- Bytes: `5320`
- Lines: `182`
- SHA256: `75d2d446fb13eeea8ea712e0cea9801135249e85c08fb704d25e042c3194bcba`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_get_user_id`
  - `NotificationResponse`
  - `NotificationListResponse`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Notifications API - In-app notifications and task management
   3: """
   5: import logging
   6: from typing import Optional
   8: from fastapi import APIRouter, Depends, HTTPException, Query
   9: from motor.motor_asyncio import AsyncIOMotorDatabase
  10: from pydantic import BaseModel
```

### 101. `backend/api/permissions_api.py`
- Bytes: `11361`
- Lines: `358`
- SHA256: `5b6874b2e74d2630fc955e6b4696741bc32beaf100ef7c5e3c5ad014db8c125d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PermissionUpdate`
  - `UserPermissionsResponse`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Permissions Management API
   3: Endpoints for managing user permissions
   4: """
   6: from fastapi import APIRouter, Depends, HTTPException, status
   7: from pydantic import BaseModel
   9: from backend.auth.permissions import (
  10:     ROLE_PERMISSIONS,
```

### 102. `backend/api/pi_api.py`
- Bytes: `6283`
- Lines: `165`
- SHA256: `2cdf85863254256d794aefe19438fbaaec398dcc819c7531ca86e7370de361ba`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import logging
   2: import httpx
   3: from datetime import datetime, timezone
   4: from fastapi import APIRouter, Depends, HTTPException, Query, Request
   5: from typing import Any, Dict
   6: from backend.auth.dependencies import get_current_user
   7: from backend.db.runtime import get_db
   8: from backend.config import settings
```

### 103. `backend/api/pin_auth_api.py`
- Bytes: `3752`
- Lines: `124`
- SHA256: `d5ffa6fc2ce471de62b31d01778817db35a630b98ed4f0b5de4c943203dfe686`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PinChangeRequest`
  - `PinLoginRequest`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Auth API Endpoints (PIN Extensions)
   3: """
   5: from fastapi import APIRouter, Depends, HTTPException, Request, status
   6: from motor.motor_asyncio import AsyncIOMotorDatabase
   7: from pydantic import BaseModel, Field
   9: from backend.api.auth import (
  10:     check_rate_limit,
```

### 104. `backend/api/preferences_api.py`
- Bytes: `2399`
- Lines: `71`
- SHA256: `78aadb46303d05786a9b2989f324e75c96f7829e036ed1d8953170a9558a931f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: """
   2: User Preferences API
   3: """
   5: from fastapi import APIRouter, Depends, HTTPException
   6: from motor.motor_asyncio import AsyncIOMotorDatabase
   8: from backend.auth.dependencies import get_current_user
   9: from backend.db.runtime import get_db
  10: from backend.models.preferences import (
```

### 105. `backend/api/rack_api.py`
- Bytes: `15402`
- Lines: `536`
- SHA256: `b9274131e01501c884d7bb523b2f78418745c4307de1dd459bb6b69a9dffd840`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `RackStatus`
  - `RackClaimRequest`
  - `RackClaimResponse`
  - `RackReleaseResponse`
  - `AvailableRack`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Rack Management API - Rack claiming, releasing, and status management
   3: Supports multi-user concurrency with Redis-based locking
   4: """
   6: import logging
   7: import time
   8: from typing import Any, Optional
  10: from fastapi import APIRouter, Depends, HTTPException, Query
```

### 106. `backend/api/realtime_dashboard_api.py`
- Bytes: `22181`
- Lines: `661`
- SHA256: `e526873c078554f89ff48a4f41ca4b6715f5b6b4c5ef013e314b67a97bdf2615`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `DashboardColumnPreference`
  - `DashboardConfig`
  - `ItemDetails`
  - `ConnectionManager`
  - `__init__`
  - `disconnect`
  - `set_config`
  - `get_config`
  - `parse_filters`
  - `get_count`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Real-Time Dashboard API
   3: Server-Sent Events (SSE) and WebSocket endpoints for live data updates
   4: """
   6: import asyncio
   7: import json
   8: import logging
   9: from datetime import datetime, timezone
```

### 107. `backend/api/reconciliation_api.py`
- Bytes: `4907`
- Lines: `141`
- SHA256: `ba45d9a0ec44a6d666704ed9fb59a0646fdcbe06ebd8a36113969a8fd996aebe`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_get_db`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Reconciliation API - Handles session-wide aggregation of counts to calculate true variance.
   3: """
   5: import logging
   6: from datetime import datetime
   7: from fastapi import APIRouter, Depends, HTTPException
   8: from motor.motor_asyncio import AsyncIOMotorDatabase
  10: from backend.auth.dependencies import get_current_user_async as get_current_user
```

### 108. `backend/api/report_generation_api.py`
- Bytes: `20009`
- Lines: `637`
- SHA256: `32c8382ec7227920f9330d9a906737f98cbfce499b52ae0bf77be0c6214d8da9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ReportFilter`
  - `ReportRequest`
  - `ReportSummary`
  - `ReportResponse`
  - `build_date_filter`
  - `sanitize_for_csv`
  - `_format_xlsx_cell_value`
  - `_write_xlsx_headers`
  - `_write_xlsx_data`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Report Generation API - Multiple report types with filtering and export
   3: Supports Stock Summary, Variance, User Activity, Session History, and Audit Trail reports
   4: """
   6: import csv
   7: import io
   8: import json
   9: import logging
```

### 109. `backend/api/reporting_api.py`
- Bytes: `9679`
- Lines: `340`
- SHA256: `80e7cd0547a61e236244f406ec0879c5c2d3b0aa2b3ccd28c929737edc7477ef`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `QuerySpec`
  - `CreateSnapshotRequest`
  - `CompareSnapshotsRequest`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Reporting API - Query builder, snapshots, exports, and comparisons
   3: Enterprise-grade reporting with MongoDB aggregations
   4: """
   6: import logging
   7: from typing import Any, Optional
   9: from fastapi import APIRouter, Depends, HTTPException, Query, Response
  10: from pydantic import BaseModel, Field
```

### 110. `backend/api/response_models.py`
- Bytes: `4278`
- Lines: `121`
- SHA256: `423a3a69709dd5832235f37d77226036bde2675626fa74c310d41a6192b13c2c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ApiResponse`
  - `success_response`
  - `error_response`
  - `PaginatedResponse`
  - `create`
  - `HealthCheckResponse`
  - `ConnectionPoolStatusResponse`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Standardized API Response Models
   3: Provides consistent response formats across all API endpoints
   4: """
   6: from datetime import datetime, timezone
   7: from typing import Any, Generic, Optional, TypeVar
   9: from pydantic import BaseModel, Field
  11: T = TypeVar("T")
```

### 111. `backend/api/schemas.py`
- Bytes: `12002`
- Lines: `393`
- SHA256: `8b087b642732eb73fbebdcf5ba02dc7ead91f47bcd2655d2702c403c55057474`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ApiResponse`
  - `success_response`
  - `error_response`
  - `ERPItem`
  - `UserInfo`
  - `TokenResponse`
  - `UserRegister`
  - `UserLogin`
  - `PinLogin`
  - `PinSetup`
  - `validate_pins_match`
  - `CorrectionReason`
  - `PhotoProof`
  - `CorrectionMetadata`
  - `DateFormatType`
- Excerpt (first non-empty lines):

```text
   1: import uuid
   2: from datetime import datetime, timezone
   3: from enum import Enum
   4: from typing import Any, Generic, Optional, TypeVar, Union
   6: from pydantic import BaseModel, Field, field_validator, model_validator
   8: T = TypeVar("T")
  11: class ApiResponse(BaseModel, Generic[T]):
  12:     success: bool
```

### 112. `backend/api/schemas_variance.py`
- Bytes: `2445`
- Lines: `70`
- SHA256: `d99ddf736cd1829ccc616ac91503f4b87673ea346bf231a3c756a159acc7d367`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `VarianceThreshold`
  - `VarianceThresholdConfig`
  - `VarianceData`
  - `ViolatedThreshold`
  - `CountLineSubmission`
- Excerpt (first non-empty lines):

```text
   1: # Variance Threshold Models
   2: from datetime import datetime, timezone
   3: from typing import Optional
   5: from pydantic import BaseModel, Field
   8: class VarianceThreshold(BaseModel):
   9:     """Individual variance threshold configuration"""
  11:     threshold_type: str = Field(..., description="Type: 'quantity', 'value', or 'percentage'")
  12:     operator: str = Field(..., description="Comparison operator: 'gte', 'lte', or 'eq'")
```

### 113. `backend/api/search_api.py`
- Bytes: `10458`
- Lines: `331`
- SHA256: `5098b1333963374c7e5773c5b6ab8c7f7a68daf0316f131061e023cd9a4ee1a9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SearchItemResponse`
  - `SearchMetadata`
  - `OptimizedSearchResponse`
  - `SuggestionsResponse`
  - `SearchFiltersResponse`
  - `_to_response`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Search API - Optimized Item Search Endpoints
   4: Provides debounce-friendly search with:
   5: - Relevance scoring (exact barcode > partial barcode > name match)
   6: - Pagination for large result sets
   7: - Redis caching for repeat queries
   8: - Autocomplete suggestions
  10: Part of US1: Optimized Item Search
```

### 114. `backend/api/security_api.py`
- Bytes: `16925`
- Lines: `464`
- SHA256: `ecfec08a479760d61cf0a26ec9bbdfc7829f0bfc48438a9c1de3ec8d3f62a96c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `require_admin`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Security Dashboard API
   3: Provides endpoints for security monitoring, failed login tracking, and audit logs
   4: """
   6: import logging
   7: from datetime import datetime, timedelta, timezone
   8: from typing import Optional
  10: from fastapi import APIRouter, Depends, HTTPException, Query, status
```

### 115. `backend/api/security_txt.py`
- Bytes: `1751`
- Lines: `60`
- SHA256: `44562fbb6ed6f079b2d410c8962e546c169fd9b6f7ae21e43e0efe9435820f0c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: """
   2: security.txt Endpoint
   4: Implements RFC 9116 security.txt for responsible vulnerability disclosure.
   5: https://www.rfc-editor.org/rfc/rfc9116
   6: """
   8: from datetime import datetime, timedelta, timezone
  10: from fastapi import APIRouter
  11: from fastapi.responses import PlainTextResponse
```

### 116. `backend/api/self_diagnosis_api.py`
- Bytes: `6564`
- Lines: `185`
- SHA256: `7575bc5c0f837b319b7f693a36e296d2d98c5c8ad93be1993e75ee4fc09c2820`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `get_auto_diagnosis`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Self-Diagnosis API Endpoints
   3: Provide real-time error diagnosis and health monitoring
   4: """
   6: import logging
   7: from datetime import timedelta
   8: from typing import Any
  10: from fastapi import APIRouter, Depends, HTTPException
```

### 117. `backend/api/service_logs_api.py`
- Bytes: `8421`
- Lines: `275`
- SHA256: `394749fc4c04f7a54f38666c2b71b8e5ae06bb081a7844c5de5f15e43274b724`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `get_current_user`
  - `require_admin`
  - `_detect_log_level`
  - `_parse_log_file`
  - `_find_log_file`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Service Logs API - Real-time log viewing for all services
   3: """
   5: import logging
   6: import os
   7: import platform
   8: from datetime import datetime
   9: from pathlib import Path
```

### 118. `backend/api/session_management_api.py`
- Bytes: `26668`
- Lines: `811`
- SHA256: `a517fce53c2c975cdfcc282b27851d16619cf1cf8a2a5c318025f32ff883fbae`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SessionDetail`
  - `SessionStats`
  - `HeartbeatResponse`
  - `SessionIntegrityResponse`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Session Management API - Enhanced session tracking with heartbeat
   3: Extends existing session API with rack-based workflow support
   4: """
   6: import logging
   7: import re
   8: import time
   9: from datetime import datetime, timezone
```

### 119. `backend/api/sql_connection_api.py`
- Bytes: `3252`
- Lines: `102`
- SHA256: `bb093c16e1e986935f5c9ed7d17d6d55a7448fd87df87acdd7600f5421a20716`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_default_user`
  - `require_admin`
  - `SQLConnectionConfig`
- Excerpt (first non-empty lines):

```text
   1: """
   2: SQL Server Connection Management API
   3: """
   5: import logging
   6: from datetime import datetime
   7: from typing import Any, Optional
   9: from fastapi import APIRouter, Depends, HTTPException, status
  10: from pydantic import BaseModel, Field
```

### 120. `backend/api/sql_verification_api.py`
- Bytes: `2277`
- Lines: `61`
- SHA256: `fc3d4556151aae0d2fbca053e3a0d81b4a0c1ae04e97de2d6f2fd2c3dbdbad66`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: """
   2: SQL Verification API Endpoints
   3: Provides endpoints for verifying item quantities against SQL Server
   4: """
   6: import logging
   7: from typing import Dict, Any
   9: from fastapi import APIRouter, HTTPException, Depends
  10: from backend.services.sql_verification_service import sql_verification_service
```

### 121. `backend/api/supervisor_pin.py`
- Bytes: `2365`
- Lines: `74`
- SHA256: `0f89e374aba3a91157faa0938f6d5fa53f5a7f26df6c8dfe70ff7c4c25c04dc0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PinVerificationRequest`
- Excerpt (first non-empty lines):

```text
   1: import logging
   2: from typing import Optional
   4: from fastapi import APIRouter, Depends, HTTPException
   5: from pydantic import BaseModel
   7: from backend.auth.dependencies import get_current_user
   8: from backend.db.runtime import get_db
   9: from backend.services.activity_log import ActivityLogService
  10: from backend.utils.auth_utils import verify_password
```

### 122. `backend/api/supervisor_workflow_api.py`
- Bytes: `13188`
- Lines: `370`
- SHA256: `eaed1249d51a5dd34dd8172c375c18c8012edbbb64665dde61bbbbd18fdc0fb8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_get_user_id`
  - `BatchApprovalRequest`
  - `BatchRejectionRequest`
  - `BatchOperationResponse`
  - `PhotoRequirementCheck`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Enhanced Supervisor Workflow API - Batch operations and photo enforcement
   3: """
   5: import logging
   6: from typing import Any, Dict, List, Optional
   8: from fastapi import APIRouter, Body, Depends, HTTPException
   9: from motor.motor_asyncio import AsyncIOMotorDatabase
  10: from pydantic import BaseModel, Field
```

### 123. `backend/api/sync_batch_api.py`
- Bytes: `27309`
- Lines: `757`
- SHA256: `d0b79054616f5082a55486c66aaa64d3e4654297fd6552737dc2a5ae3bb3edb2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `LegacySyncOperation`
  - `SyncRecord`
  - `BatchSyncRequest`
  - `SyncConflict`
  - `SyncError`
  - `SyncResult`
  - `BatchSyncResponse`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Batch Sync API - High-performance batch synchronization
   3: Handles offline queue sync with conflict detection and retry logic
   4: and preserves backward compatibility with legacy offline payloads.
   5: """
   7: import logging
   8: import re
   9: import time
```

### 124. `backend/api/sync_conflicts_api.py`
- Bytes: `7870`
- Lines: `245`
- SHA256: `4eaec625587f88bd9e21d360e78f957bea8db5776ef1ba2ab371c0180e4e2ec1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ConflictResolutionRequest`
  - `BatchConflictResolutionRequest`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Sync Conflicts API
   3: Endpoints for managing synchronization conflicts
   4: """
   6: from typing import Any, Optional
   8: from fastapi import APIRouter, Depends, HTTPException, status
   9: from pydantic import BaseModel
  11: from backend.auth.dependencies import auth_deps
```

### 125. `backend/api/sync_management_api.py`
- Bytes: `1885`
- Lines: `56`
- SHA256: `ddff14894c002a54071e4ffa2baff919b63a9658d24fd6cfd3678233adacfb9d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `set_change_detection_service`
  - `_ensure_supervisor`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Sync Management API
   3: Provides lightweight placeholder sync endpoints to keep tests and tooling stable.
   4: """
   6: from fastapi import APIRouter, Depends, HTTPException
   8: from backend.auth.dependencies import get_current_user_async as get_current_user
  10: sync_management_router = APIRouter(prefix="/sync", tags=["sync"])
  12: _change_detection_service = None
```

### 126. `backend/api/sync_status_api.py`
- Bytes: `2313`
- Lines: `73`
- SHA256: `32b1b965d2b0c540403c93b1496d6e87f2a03f22ae07302418895ce8552a15a1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `set_auto_sync_manager`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Sync Status API - Provides endpoints for sync status and control
   3: """
   5: import logging
   6: from typing import Any, cast
   8: from fastapi import APIRouter, HTTPException, status
  10: logger = logging.getLogger(__name__)
  12: sync_router = APIRouter(prefix="/sync", tags=["sync"])
```

### 127. `backend/api/unknown_items_api.py`
- Bytes: `6490`
- Lines: `190`
- SHA256: `ee5efa71f8719122e86befb63f18417ae1db29a1eba5e380785131168efd90af`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `MapUnknownItemRequest`
  - `CreateSKUFromUnknownRequest`
  - `_require_admin`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Unknown Items API - Management of items scanned but not found in ERP/Cache
   3: """
   5: import logging
   6: from datetime import datetime, timezone
   7: from typing import Any, Optional
   9: from fastapi import APIRouter, Depends, HTTPException, Query
  10: from motor.motor_asyncio import AsyncIOMotorDatabase
```

### 128. `backend/api/user_management_api.py`
- Bytes: `24515`
- Lines: `841`
- SHA256: `8418b6123d2551007ad295dca68c3d1ea0b7eef34655d362b0a04b51354b2df9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `UserListItem`
  - `UserListResponse`
  - `UserDetailResponse`
  - `CreateUserRequest`
  - `UpdateUserRequest`
  - `BulkUserAction`
  - `BulkActionResult`
  - `_user_to_list_item`
  - `_user_to_detail`
- Excerpt (first non-empty lines):

```text
   1: """
   2: User Management API
   3: Full CRUD endpoints for managing users - Admin only
   4: """
   6: import logging
   7: from datetime import datetime, timezone
   8: from typing import Any, Optional, cast
  10: from fastapi import APIRouter, Depends, HTTPException, Query, status
```

### 129. `backend/api/user_settings_api.py`
- Bytes: `7719`
- Lines: `225`
- SHA256: `e7af01e66fb4951cf40e9aeb08166cd08a8b35a8ce758cbdf4ff3998ec7b37c6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: """
   2: User Settings API
   4: Endpoints for managing user-specific settings like theme, font size, colors.
   5: """
   7: import logging
   8: from datetime import datetime, timezone
   9: from typing import Any
  11: from fastapi import APIRouter, Depends, HTTPException
```

### 130. `backend/api/v2/__init__.py`
- Bytes: `875`
- Lines: `23`
- SHA256: `7dae321cfe1c443c07cc9f7ba185f6cfa48d1597b6f506a01e4742edc394b6ad`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: """
   2: API v2 Router
   3: Upgraded API endpoints with improved response formats and error handling
   4: """
   6: from fastapi import APIRouter
   8: # Import and include v2 endpoints
   9: from . import connection_status, health, items, metrics, sessions, supervisor
  11: # Create v2 API router
```

### 131. `backend/api/v2/connection_status.py`
- Bytes: `3627`
- Lines: `112`
- SHA256: `0ceb50e9674f8114ff15ba7131368b3102f0cdf70fd491b65b46642053bd2564`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: """
   2: API v2 Connection Status Endpoints
   3: Monitor and manage database connections
   4: """
   6: from typing import Any
   8: from fastapi import APIRouter, Depends
  10: from backend.api.response_models import ApiResponse, ConnectionPoolStatusResponse
  11: from backend.auth.dependencies import get_current_user_async as get_current_user
```

### 132. `backend/api/v2/health.py`
- Bytes: `5567`
- Lines: `162`
- SHA256: `5cc60ced2d233d1f978d62df292946f91d039604d472b5086f8c03ee0ce01ae1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_determine_overall_status`
- Excerpt (first non-empty lines):

```text
   1: """
   2: API v2 Health Endpoints
   3: Enhanced health check endpoints with detailed service status
   4: """
   6: import asyncio
   7: from datetime import datetime, timezone
   8: from typing import Any
  10: from fastapi import APIRouter, Depends
```

### 133. `backend/api/v2/items.py`
- Bytes: `15368`
- Lines: `417`
- SHA256: `bbefea2508fe25167bef0a5b26ea85655ff106b08bc66ac0e35deac24e67ab82`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ItemResponse`
- Excerpt (first non-empty lines):

```text
   1: """
   2: API v2 Items Endpoints
   3: Upgraded item endpoints with standardized responses
   4: """
   6: import asyncio
   7: import sys
   8: from pathlib import Path
   9: from typing import Any, Optional
```

### 134. `backend/api/v2/metrics.py`
- Bytes: `3192`
- Lines: `102`
- SHA256: `05ffc95561e8faa259cbaf9252ea82d57827c09fd15d5e9bcf5b41533c1623bf`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_safe_get_metrics`
- Excerpt (first non-empty lines):

```text
   1: """
   2: API v2 Metrics Endpoints
   3: Connection pool and system metrics monitoring
   4: """
   5: from datetime import timezone
   7: from typing import Any
   9: from fastapi import APIRouter, Depends
  11: from backend.api.response_models import ApiResponse
```

### 135. `backend/api/v2/sessions.py`
- Bytes: `11931`
- Lines: `321`
- SHA256: `b338b85866c63c5e358541146cd2ed986d5fff90935567337fd60cf01aa717a6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SessionResponse`
- Excerpt (first non-empty lines):

```text
   1: """
   2: API v2 Sessions Endpoints
   3: Upgraded session endpoints with standardized responses
   4: """
   6: from datetime import datetime, timezone
   7: from typing import Optional
   9: from fastapi import APIRouter, Depends, Query
  10: from pydantic import BaseModel
```

### 136. `backend/api/v2/supervisor.py`
- Bytes: `1736`
- Lines: `53`
- SHA256: `6d09c0f00244bafda372de75d3e27946e09a016a4ed0b992e11cb9701496c392`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `RiskPrediction`
- Excerpt (first non-empty lines):

```text
   1: from fastapi import APIRouter, Depends, Query
   2: from pydantic import BaseModel
   4: from backend.api.response_models import ApiResponse
   5: from backend.auth.dependencies import get_current_user_async as get_current_user
   6: from backend.db.runtime import get_db
   7: from backend.services.ai_variance import ai_variance_service
   9: router = APIRouter()
  12: class RiskPrediction(BaseModel):
```

### 137. `backend/api/variance_api.py`
- Bytes: `2056`
- Lines: `68`
- SHA256: `1d094f3c88cdf8a197899a6e348b05aabce38a74f0d2787d92b314187f05165f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: from typing import Any
   2: from fastapi import APIRouter, Depends
   4: from backend.auth.dependencies import get_current_user
   6: router = APIRouter()
   9: @router.get("/variance-reasons")
  10: async def get_variance_reasons(
  11:     current_user: dict = Depends(get_current_user),
  12: ) -> dict[str, list[dict[str, str]]]:
```

### 138. `backend/api/variance_threshold_admin_api.py`
- Bytes: `9627`
- Lines: `296`
- SHA256: `ac10290e88317f46e81598019e35ffbce5c85a6d329ee9853dad97f743a785ae`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: """
   2: Admin API for managing variance threshold configurations
   3: """
   5: import logging
   6: from datetime import datetime, timezone
   7: from typing import Optional
   9: from fastapi import APIRouter, HTTPException, Query
  11: from backend.api.schemas_variance import VarianceThresholdConfig
```

### 139. `backend/api/websocket_api.py`
- Bytes: `4416`
- Lines: `125`
- SHA256: `14231c9b78dbd010a88f37957b6fbdb5288bfd8151b4bd9bad7c011491015cb1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_parse_subprotocols`
  - `_extract_jwt_from_websocket`
- Excerpt (first non-empty lines):

```text
   1: import logging
   2: from typing import Optional
   4: from fastapi import APIRouter, Query, WebSocket, WebSocketDisconnect
   6: from backend.auth.jwt_provider import decode
   7: from backend.config import settings
   8: from backend.core.websocket_manager import manager
  10: logger = logging.getLogger(__name__)
  11: router = APIRouter()
```

### 140. `backend/auth/__init__.py`
- Bytes: `316`
- Lines: `19`
- SHA256: `d431f8423a4109866f444d5e5c0f015ac5409218f9d0a2e45eb99fdb23e4eb67`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: """
   2: Auth Module
   3: Exports authentication dependencies
   4: """
   6: from .dependencies import (
   7:     get_current_user,
   8:     get_current_user_async,
   9:     init_auth_dependencies,
```

### 141. `backend/auth/dependencies.py`
- Bytes: `11485`
- Lines: `322`
- SHA256: `f3049f741720b0c07a473fb4a5bc7491437ff0854bf2ec12ccea36ea8e04edd1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AuthDependencies`
  - `__init__`
  - `initialize`
  - `db`
  - `secret_key`
  - `algorithm`
  - `security`
  - `init_auth_dependencies`
  - `JWTValidator`
  - `extract_token`
  - `decode_token`
  - `UserRepository`
  - `require_permissions`
  - `require_role`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Authentication Dependencies
   3: Shared dependencies for authentication across all routers
   4: """
   6: import logging
   7: from typing import Any, Optional
   9: from fastapi import Depends, HTTPException, Request
  10: from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
```

### 142. `backend/auth/jwt_provider.py`
- Bytes: `2014`
- Lines: `71`
- SHA256: `65ca2cacf9a96a8d90f96d7facafc6e81bf51b9cf75377ae571e386a5f1f9541`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ExpiredSignatureError`
  - `InvalidTokenError`
  - `_ensure_timestamp`
  - `encode`
  - `decode`
  - `_JWTCompat`
- Excerpt (first non-empty lines):

```text
   1: from datetime import datetime, timezone
   2: from typing import Any, Optional
   4: from authlib.jose import jwt as _jwt
   5: from authlib.jose.errors import ExpiredTokenError, JoseError
   7: UTC = timezone.utc
  10: class ExpiredSignatureError(Exception):
  11:     pass
  14: class InvalidTokenError(Exception):
```

### 143. `backend/auth/permissions.py`
- Bytes: `8193`
- Lines: `254`
- SHA256: `5f0b0135f94c9e51f79c91bb61197f9f0d09633e76d2651a1981179bb9b2604c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Permission`
  - `get_role_permissions`
  - `get_user_permissions`
  - `has_permission`
  - `has_any_permission`
  - `has_all_permissions`
  - `PermissionChecker`
  - `__init__`
  - `__call__`
  - `require_permission`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Permission-based Access Control System
   3: Provides granular permission management for users
   4: """
   6: from enum import Enum
   8: from fastapi import Depends, HTTPException, status
   9: from motor.motor_asyncio import AsyncIOMotorDatabase
  12: # Permission definitions
```

### 144. `backend/config.py`
- Bytes: `21577`
- Lines: `561`
- SHA256: `d1f14db45fce4086a46c3080ff309a916e960d5eefd3debcacfab2444d945a9b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Settings`
  - `Config`
  - `coerce_debug`
  - `validate_min_client_version`
  - `validate_and_detect_mongo_url`
  - `validate_db_name`
  - `validate_sql_port`
  - `validate_jwt_secret`
  - `validate_jwt_refresh_secret`
  - `validate_sync_interval`
  - `validate_log_level`
  - `validate_port`
  - `FallbackSettings`
  - `__init__`
  - `_validate_secret`
- Excerpt (first non-empty lines):

```text
   1: """
   2: # ruff: noqa: E402
   3: # cSpell:ignore redef behaviour lavanya emart dotenv
   4: Application Configuration Management
   5: Type-safe configuration with validation using Pydantic
   6: """
   8: import logging
   9: import os
```

### 145. `backend/config/governance.py`
- Bytes: `1629`
- Lines: `55`
- SHA256: `918f49ddf4abe605fd7184fd08533f646f8c225598be8888e8ffd15b0e5dac52`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_env_bool`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Deprecated module wrapper.
   4: The canonical governance configuration lives in backend/config_governance.py.
   5: This file re-exports those values to avoid drift, but should not be used for new imports.
   6: """
   8: from backend.config_governance import (  # noqa: F401
   9:     GOVERNANCE_FINGERPRINT,
  10:     SQL_MAX_LATENCY_MS,
```

### 146. `backend/config_governance.py`
- Bytes: `1169`
- Lines: `37`
- SHA256: `e95a37518f1da37902a9a5f59f00c41bdf79019ac553a39dc0b2f141a2074c0f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_env_bool`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Governance Configuration
   3: Centralized controls for SQL Verification policy enforcement.
   4: """
   6: import os
   7: from typing import Any
  10: def _env_bool(key: str, default: bool) -> bool:
  11:     """Safely parse boolean environment variables"""
```

### 147. `backend/core/__init__.py`
- Bytes: `102`
- Lines: `6`
- SHA256: `fe27e70af992c565669922ed7c6f24f1a265096a2e79a28e53492f336f87f799`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: """
   2: Core module for Stock Verification System.
   4: Contains schemas, validators, and core utilities.
   5: """
```

### 148. `backend/core/database.py`
- Bytes: `870`
- Lines: `37`
- SHA256: `ac61647e5d5bf751d274a5cda88801436136ba4c5eda4aaa6a634958333152b4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import logging
   2: import sys
   3: from typing import Any
   5: from motor.motor_asyncio import AsyncIOMotorClient
   7: from backend.config import settings
   9: logger = logging.getLogger(__name__)
  11: RUNNING_UNDER_PYTEST = "pytest" in sys.modules
  13: # MongoDB connection with optimization
```

### 149. `backend/core/globals.py`
- Bytes: `1171`
- Lines: `35`
- SHA256: `63f76230b6d035a133ab502b0f71dea804909f1f548fbefed9584bfd8347971f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: from typing import Any, Optional
   3: # Global service instances
   4: # These are initialized during the lifespan startup event
   5: scheduled_export_service: Optional[Any] = None
   6: sync_conflicts_service: Optional[Any] = None
   7: monitoring_service: Optional[Any] = None
   8: database_health_service: Optional[Any] = None
   9: auto_sync_manager: Optional[Any] = None
```

### 150. `backend/core/lifespan.py`
- Bytes: `39529`
- Lines: `1036`
- SHA256: `7d36fafec9dcc77837f65caa2af538dd1a842c3ab01e307e386a5a004e669a10`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ApiResponse`
  - `success_response`
  - `error_response`
- Excerpt (first non-empty lines):

```text
   1: # ruff: noqa: E402
   2: # flake8: noqa: E402
   4: import asyncio
   5: import logging
   6: import os
   7: import sys
   8: import time
   9: from contextlib import asynccontextmanager
```

### 151. `backend/core/schemas/__init__.py`
- Bytes: `481`
- Lines: `22`
- SHA256: `6d42bead3bf5ab39aabb5e2e7d617721fcbf02668d6dcd5488858db14d82a0da`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: """
   2: Core schemas for Stock Verification System.
   4: Contains Pydantic models for user settings, audit logs, and other core entities.
   5: """
   7: from backend.core.schemas.audit_log import AuditAction, AuditLog, AuditLogCreate
   8: from backend.core.schemas.user_settings import (
   9:     UserSettings,
  10:     UserSettingsResponse,
```

### 152. `backend/core/schemas/audit_log.py`
- Bytes: `3397`
- Lines: `108`
- SHA256: `7b588bde619ecaca30e880c105e775243bd9b0764de5edf8a3be1c863a3a7e8d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AuditAction`
  - `AuditLogCreate`
  - `AuditLog`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Audit Log Schema
   4: Pydantic models for audit logging of user actions.
   5: """
   7: from datetime import datetime, timezone
   8: from enum import Enum
   9: from typing import Any, Optional
  11: from pydantic import BaseModel, ConfigDict, Field
```

### 153. `backend/core/schemas/config_version.py`
- Bytes: `1275`
- Lines: `33`
- SHA256: `eb859c3a3180b815cf351d2febc2d4ecb6963f4bd2d2dd766993549a3e69efe1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ConfigVersion`
- Excerpt (first non-empty lines):

```text
   1: from datetime import datetime, timezone
   2: from typing import Any, Dict
   3: from uuid import uuid4
   5: from pydantic import BaseModel, ConfigDict, Field
   8: class ConfigVersion(BaseModel):
   9:     """
  10:     Immutable configuration version snapshot.
  11:     Generated whenever system settings are updated.
```

### 154. `backend/core/schemas/conflict.py`
- Bytes: `940`
- Lines: `25`
- SHA256: `141dfca19886c07ecc7c02c3a24bdcd2748a95a643ad11d1a69db5213a985337`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ConflictFork`
- Excerpt (first non-empty lines):

```text
   1: from datetime import datetime, timezone
   2: from typing import Any, Dict
   3: from uuid import uuid4
   5: from pydantic import BaseModel, Field
   8: class ConflictFork(BaseModel):
   9:     """
  10:     Represents a forked version of an item verification that conflicted
  11:     with an already APPROVED record.
```

### 155. `backend/core/schemas/snapshot.py`
- Bytes: `919`
- Lines: `29`
- SHA256: `838af50f3bbc02936153f4d64bcb16ddeb8c4259bb2a67009699a81b5b309060`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SnapshotItem`
  - `SessionSnapshot`
- Excerpt (first non-empty lines):

```text
   1: from datetime import datetime, timezone
   2: from typing import Any, Dict, List
   3: from uuid import uuid4
   5: from pydantic import BaseModel, Field
   8: class SnapshotItem(BaseModel):
   9:     item_code: str
  10:     stock_qty: float
  11:     warehouse: str
```

### 156. `backend/core/schemas/user_settings.py`
- Bytes: `3232`
- Lines: `101`
- SHA256: `8931ae5e0bd4ee8a0435b038d55b0d1958eb32dc5c42084325f87de700a1f44f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `UserSettings`
  - `UserSettingsUpdate`
  - `UserSettingsResponse`
- Excerpt (first non-empty lines):

```text
   1: """
   2: User Settings Schema
   4: Pydantic models for user-specific settings like theme, font size, and colors.
   5: """
   7: from datetime import datetime
   8: from typing import Optional
  10: from pydantic import BaseModel, ConfigDict, Field
  13: class UserSettings(BaseModel):
```

### 157. `backend/core/validators/__init__.py`
- Bytes: `337`
- Lines: `18`
- SHA256: `e1b6e8a8b7ef7040da38de295c3bc51e31388e8275f34ad29af55d48bf9609ee`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: """
   2: Core validators for Stock Verification System.
   4: Contains validation utilities for PINs, passwords, and other inputs.
   5: """
   7: from backend.core.validators.pin_validator import (
   8:     PinValidationResult,
   9:     validate_pin,
  10:     validate_pin_change,
```

### 158. `backend/core/validators/pin_validator.py`
- Bytes: `4970`
- Lines: `184`
- SHA256: `43f5d7af3ee58bc0318ac89a522e8ce56e237b33023d98b968c6576ab12e5cd0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PinValidationResult`
  - `validate_pin`
  - `_is_sequential`
  - `validate_pin_change`
- Excerpt (first non-empty lines):

```text
   1: """
   2: PIN Validation Module
   4: Validates PIN format and security requirements.
   5: """
   7: from typing import Optional
   9: from pydantic import BaseModel, Field
  12: class PinValidationResult(BaseModel):
  13:     """Result of PIN validation."""
```

### 159. `backend/core/websocket_manager.py`
- Bytes: `2690`
- Lines: `72`
- SHA256: `a7921a5d588df5775004bb36ae7aec7aa291c7d28b1ba061ebf22d8b8e296149`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `WebSocketManager`
  - `__init__`
  - `disconnect`
- Excerpt (first non-empty lines):

```text
   1: import logging
   2: from typing import Optional
   4: from fastapi import WebSocket
   6: logger = logging.getLogger(__name__)
   9: class WebSocketManager:
  10:     def __init__(self):
  11:         # active_connections: { user_id: [WebSocket, ...] }
  12:         self.active_connections: dict[str, list[WebSocket]] = {}
```

### 160. `backend/data/db_backup_20251231_111316/_repair_incomplete`
- Bytes: `74`
- Lines: `2`
- SHA256: `182dbe22e14fcda574222e4e8689223c4d3a57e8af8a207d9606b11068a796ac`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: This file indicates that a repair operation is in progress or incomplete.
```

### 161. `backend/data/db_backup_20251231_111316/storage.bson`
- Bytes: `114`
- Lines: `1`
- SHA256: `d62cbbd3ffefaa778808964be8ae83e07cda318156eb947063dd3ac9fceca5d6`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 162. `backend/data/db_failed_repair_8/storage.bson`
- Bytes: `114`
- Lines: `1`
- SHA256: `d62cbbd3ffefaa778808964be8ae83e07cda318156eb947063dd3ac9fceca5d6`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 163. `backend/data/db_seeded_archive_2/storage.bson`
- Bytes: `114`
- Lines: `1`
- SHA256: `d62cbbd3ffefaa778808964be8ae83e07cda318156eb947063dd3ac9fceca5d6`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 164. `backend/db/__init__.py`
- Bytes: `70`
- Lines: `3`
- SHA256: `22268ac8dc8468b131efbb8155476058419bc4d41d87cc7c8af28d26b416cc16`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # This file makes the db directory a Python package
   2: # It can be empty
```

### 165. `backend/db/indexes.py`
- Bytes: `11192`
- Lines: `306`
- SHA256: `350aa9680a0fc40f4c16a09bbf943b880eb0e9a34cd1be5c6e5f5861346e5efc`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: """
   2: MongoDB Index Definitions
   3: Optimized indexes for 20 concurrent users and fast queries
   4: """
   6: # Index definitions: (field_spec, options)
   7: # field_spec: List of (field, direction) tuples
   8: # options: Index options dict
  10: from typing import Union
```

### 166. `backend/db/initialization.py`
- Bytes: `8475`
- Lines: `218`
- SHA256: `ba11029aab12bfb8463387c126db2c29e8f0b274b31d5f45e3341e11460bd23f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import logging
   2: from datetime import datetime, timezone
   4: from backend.services.pin_auth_service import PINAuthService
   5: from backend.utils.auth_utils import get_password_hash
   7: logger = logging.getLogger(__name__)
  10: async def init_default_users(db):
  11:     """Create default users if they don't exist, and ensure they have PINs set up."""
  12:     try:
```

### 167. `backend/db/migrations.py`
- Bytes: `13529`
- Lines: `305`
- SHA256: `25fc7f67b90df89202b730f6ad8ab1bb924da5aa4de4716ab5b0a9e7a7f6e47d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `MigrationManager`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Database Migrations - MongoDB schema migrations
   3: Handles database schema updates and indexing
   4: """
   6: import logging
   7: from datetime import datetime, timezone
   8: from typing import Any, Dict, List, Union
  10: from motor.motor_asyncio import AsyncIOMotorDatabase
```

### 168. `backend/db/runtime.py`
- Bytes: `1686`
- Lines: `62`
- SHA256: `ce4319c31109984c1c6a4c36bcf017b2156adad91563876f1c7d9af86aa6fa23`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `get_db`
  - `get_client`
  - `set_db`
  - `set_client`
- Excerpt (first non-empty lines):

```text
   1: """Runtime database lifecycle management utilities."""
   3: from __future__ import annotations
   5: from collections.abc import AsyncIterator
   6: from contextlib import asynccontextmanager
   8: from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
  10: _MONGO_CLIENT: AsyncIOMotorClient = None
  11: _DATABASE: AsyncIOMotorDatabase = None
  14: @asynccontextmanager
```

### 169. `backend/db_mapping_config.py`
- Bytes: `18248`
- Lines: `452`
- SHA256: `56f2dcf11a383328231e272fba5263e7a66b01f267e97e12bd435372cb27cac0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `get_active_mapping`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Database Mapping Configuration for E_MART_KITCHEN_CARE SQL Server
   3: Maps ERP database tables and columns to Stock Verification app schema
   4: """
   6: # Table name mappings
   7: TABLE_MAPPINGS = {
   8:     "items": "Products",
   9:     "item_batches": "ProductBatches",
```

### 170. `backend/docs/GOVERNANCE_EXECUTION_MANDATE.md`
- Bytes: `2951`
- Lines: `64`
- SHA256: `7dd1014919c250c05b816d582b48bf838f7895812f3131015565e2e761deedaa`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Developer Execution Mandate: SQL Verification Governance
   2: **Status:** ACTIVE | **Enforcement:** CI/CD & Peer Review | **Version:** 1.0
   4: > **WARNING:** This document defines the **immutable core controls** for the Stock Verification System. Any code change violating these rules will automatically FAIL build pipelines and be rejected by compliance logic.
   6: ---
   8: ## 🚫 1. Absolute Prohibitions (Zero Tolerance)
  10: 1.  **NO Bypassing SQL Authority**: Logic must NEVER update `stock_qty` (Mongo) without a preceding, successful read from `SQLServerConnector` (SQL).
  11: 2.  **NO Weakening of Strict Mode**: The default value for `SQL_VERIFY_STRICT` in code MUST remain `True` (or equivalent defensive parsing). Only explicit environment overrides are allowed.
  12: 3.  **NO Blind Updates**: Updates to `erp_items` must ALWAYS use Optimistic Locking (query `stock_qty` in the filter). `update_one({"_id": ...}, ...)` without a version/state check is FORBIDDEN.
```

### 171. `backend/docs/SQL_VERIFICATION_GOVERNANCE.md`
- Bytes: `2421`
- Lines: `109`
- SHA256: `08ac1b1917ccc63758e2e675161e0489376d2b58d3d6ef66b61c91f747697a91`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # 🔐 SQL Verification Governance Agent – Master Prompt (v1.0)
   3: **System Role:**
   4: You are the *SQL Verification Governance Agent* for the Lavanya Emart Stock Verification Platform.
   5: Your sole mandate is to **enforce authoritative stock truth from SQL Server**, reconcile it with MongoDB, and maintain **forensic-grade audit trails**.
   7: You do not optimize for speed.
   8: You optimize for **accuracy, immutability, and governance compliance**.
  10: ---
  12: ## 1. Authority Model
```

### 172. `backend/error_messages.py`
- Bytes: `11108`
- Lines: `293`
- SHA256: `ec83f5f7db2f9b2a5173912518de7d6ed9a945c1df64d43291e64a2612050371`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ErrorCategory`
  - `get_error_message`
  - `get_error_by_code`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Error Messages - Centralized error message definitions
   3: Provides consistent, user-friendly error messages throughout the application
   4: """
   6: from typing import Optional
   9: # Error Categories
  10: class ErrorCategory:
  11:     AUTHENTICATION = "authentication"
```

### 173. `backend/exceptions.py`
- Bytes: `5717`
- Lines: `209`
- SHA256: `437bb60914eef13fdb627f38671396298694d2776c6691f901664da6b4c319a8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `StockVerifyException`
  - `__init__`
  - `to_dict`
  - `DatabaseConnectionError`
  - `__init__`
  - `SQLServerConnectionError`
  - `__init__`
  - `MongoDBConnectionError`
  - `__init__`
  - `SyncError`
  - `__init__`
  - `ItemNotFoundError`
  - `__init__`
  - `NotFoundError`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Custom Exception Classes for STOCK_VERIFY_2
   3: Provides structured error handling with context
   4: """
   6: from typing import Any, Optional
   9: class StockVerifyException(Exception):
  10:     """Base exception for all Stock Verify errors"""
  12:     def __init__(
```

### 174. `backend/locustfile.py`
- Bytes: `49`
- Lines: `3`
- SHA256: `32553aea4b4e317a8839f25414ec120dcfdd86fa9ddde7fa737d0ecf0c8cb227`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: from scripts.load_test_search import SearchUser
```

### 175. `backend/middleware/__init__.py`
- Bytes: `78`
- Lines: `3`
- SHA256: `cec7ce3e873ca831af18df1f1424e7f42ed33544efceae65652335a592260b53`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # This file makes the middleware directory a Python package
   2: # It can be empty
```

### 176. `backend/middleware/compression_middleware.py`
- Bytes: `3476`
- Lines: `110`
- SHA256: `46b41d02ca560bc0ac9be2b1ae0dadac2589faeff765efd8705e47d56a77d5cf`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `CompressionMiddleware`
  - `__init__`
  - `_should_compress`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Modern Response Compression Middleware (2024/2025 Best Practice)
   3: High-performance compression for API responses
   4: """
   6: import gzip
   7: import logging
   8: from collections.abc import Callable
  10: from starlette.middleware.base import BaseHTTPMiddleware
```

### 177. `backend/middleware/input_sanitization.py`
- Bytes: `8270`
- Lines: `215`
- SHA256: `52273dcd054575d3810b252b39926ec20596a4dffd8fba4b074ad9c7a9beda86`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `InputSanitizationMiddleware`
  - `__init__`
  - `_sanitize_headers`
  - `_is_dangerous`
  - `_contains_dangerous_input`
  - `sanitize_string`
  - `sanitize_dict`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Input Sanitization Middleware (2024/2025 Best Practice)
   3: Sanitizes input to prevent XSS and injection attacks
   4: """
   6: import html
   7: import logging
   8: import re
   9: from typing import Any, Optional
```

### 178. `backend/middleware/lan_enforcement.py`
- Bytes: `2307`
- Lines: `69`
- SHA256: `14fcbf35aed805443d70b484ba2d3d750b320628a6e71b563604a7b981978bb8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `LANEnforcementMiddleware`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: import ipaddress
   2: import logging
   3: from typing import Callable
   5: from fastapi import Request, Response
   6: from starlette.middleware.base import BaseHTTPMiddleware
   7: from starlette.responses import JSONResponse
   9: logger = logging.getLogger(__name__)
  12: class LANEnforcementMiddleware(BaseHTTPMiddleware):
```

### 179. `backend/middleware/logging_middleware.py`
- Bytes: `8558`
- Lines: `245`
- SHA256: `0242a66c472e92287853f0405877847d87980971d489937f4d4c72c7dfff63d2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SessionContextFilter`
  - `filter`
  - `SessionContextLoggingMiddleware`
  - `__init__`
  - `MockResponse`
  - `__init__`
  - `ErrorResponse`
  - `__init__`
  - `_log_request_start`
  - `_log_request_complete`
  - `_clear_context`
  - `setup_session_context_logging`
  - `get_current_context`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Session Context Logging Middleware
   3: Adds user and session context to all log messages for protected endpoints
   4: """
   6: import logging
   7: import time
   8: from contextvars import ContextVar
   9: from typing import Any, Optional
```

### 180. `backend/middleware/performance_middleware.py`
- Bytes: `3758`
- Lines: `120`
- SHA256: `3782e10452db28599ca80df842ee30061750c0c0eac7c7549acf12b5c3393b2e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PerformanceMiddleware`
  - `__init__`
  - `CacheMiddleware`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Performance Middleware - Track request performance and add caching headers
   3: """
   5: import logging
   6: import time
   8: from starlette.types import ASGIApp
  10: try:
  11:     from services.monitoring_service import MonitoringService
```

### 181. `backend/middleware/rate_limit_middleware.py`
- Bytes: `4666`
- Lines: `129`
- SHA256: `f5081925d159a49833a4eeee436859c68fc80290c2a05a1b734d1ad5394ee4bc`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `RateLimitMiddleware`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Rate Limit Middleware - Enforce rate limiting on API endpoints
   3: """
   5: import logging
   6: import os
   7: from typing import Optional
   9: from fastapi import Request
  10: from jwt import decode as jwt_decode
```

### 182. `backend/middleware/request_id.py`
- Bytes: `4580`
- Lines: `123`
- SHA256: `0e55ccbe770439124ea2a19b08e0d0938ca218793de80123155c0d24b5973482`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `get_request_id`
  - `get_correlation_id`
  - `CorrelationIDFilter`
  - `filter`
  - `RequestIDMiddleware`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Request ID / Correlation ID Middleware (2024/2025 Best Practice)
   3: Adds unique request ID for distributed tracing and debugging.
   5: Follows ASGI Correlation ID pattern from awesome-fastapi best practices:
   6: - Generates/propagates X-Request-ID and X-Correlation-ID headers
   7: - Stores IDs in contextvars for async access anywhere in request
   8: - Integrates with logging for automatic correlation in log messages
   9: """
```

### 183. `backend/middleware/request_size_limit.py`
- Bytes: `3408`
- Lines: `101`
- SHA256: `4a704469bed040d15ebe417e6eaee3594222bf465294c7a745b85424312f488f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `RequestSizeLimitMiddleware`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Request Size Limit Middleware
   3: Prevents DOS attacks via large request payloads
   4: """
   6: import logging
   9: logger = logging.getLogger(__name__)
  12: class RequestSizeLimitMiddleware:
  13:     """
```

### 184. `backend/middleware/security.py`
- Bytes: `7481`
- Lines: `262`
- SHA256: `317aa7c6b09caa1374a3e22556be4b1da35287c5ef84a7dea5a9705e04db08db`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `sanitize_barcode`
  - `sanitize_filter_keys`
  - `_is_regex_value`
  - `sanitize_string_input`
  - `LoginRateLimiter`
  - `__init__`
  - `is_allowed`
  - `reset`
  - `BatchRateLimiter`
  - `__init__`
  - `is_allowed`
  - `get_client_ip`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Security Middleware - Comprehensive security utilities
   3: Includes input sanitization, rate limiting helpers, and filter validation
   4: """
   6: import logging
   7: import re
   8: from collections import defaultdict
   9: from datetime import datetime, timedelta, timezone
```

### 185. `backend/middleware/security_headers.py`
- Bytes: `4690`
- Lines: `117`
- SHA256: `477049544a1efe3c674d30f7fcf0ea9d3332b1d8e6fef18e78bdc3e8a5d518c9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SecurityHeadersMiddleware`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Security Headers Middleware (2024/2025 Best Practice)
   3: Implements OWASP security headers recommendations
   4: """
   6: import logging
   9: logger = logging.getLogger(__name__)
  12: class SecurityHeadersMiddleware:
  13:     """
```

### 186. `backend/middleware/setup.py`
- Bytes: `4478`
- Lines: `128`
- SHA256: `a910a98de1d9831b7b867c9530f4b253302ed4288a3aea95157764e8025bec88`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_setup_gzip`
  - `_setup_trusted_hosts`
  - `_get_cors_origins`
  - `_setup_cors`
  - `_setup_security_headers`
  - `_setup_lan_enforcement`
  - `setup_middleware`
- Excerpt (first non-empty lines):

```text
   1: import logging
   2: import os
   4: from fastapi import FastAPI
   5: from starlette.middleware.cors import CORSMiddleware
   7: from backend.config import settings
   9: logger = logging.getLogger(__name__)
  12: def _setup_gzip(app: FastAPI) -> None:
  13:     """Add GZip compression middleware."""
```

### 187. `backend/models/__init__.py`
- Bytes: `0`
- Lines: `0`
- SHA256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt: File has no non-empty lines.

### 188. `backend/models/analytics.py`
- Bytes: `1468`
- Lines: `49`
- SHA256: `145ca73b75d2348f2cded6ce7567129feca44d7b7dc285e605be34248ead9f92`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AnalyticsEvent`
  - `VarianceAnalytics`
- Excerpt (first non-empty lines):

```text
   1: from datetime import datetime, timezone
   2: from typing import Any, Literal
   4: from pydantic import BaseModel, Field
   7: class AnalyticsEvent(BaseModel):
   8:     """
   9:     Represents a real-time event for analytics and activity feed.
  10:     Corresponds to RealTimeEvent in data-model.md.
  11:     """
```

### 189. `backend/models/audit.py`
- Bytes: `1553`
- Lines: `49`
- SHA256: `92c1720b1b4f5e6462169620df9e69049fc0c98737fdf2589c8691d116e0f42d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AuditEventType`
  - `AuditLogStatus`
  - `AuditLog`
- Excerpt (first non-empty lines):

```text
   1: from datetime import datetime, timezone
   2: from enum import Enum
   3: from typing import Any, Dict, Optional
   5: from pydantic import BaseModel, ConfigDict, Field
   7: from .user import PyObjectId
  10: class AuditEventType(str, Enum):
  11:     # Auth Events
  12:     AUTH_LOGIN_SUCCESS = "AUTH_LOGIN_SUCCESS"
```

### 190. `backend/models/preferences.py`
- Bytes: `971`
- Lines: `40`
- SHA256: `c193dbad964f8fda9e6631da6a9ab0e8da84d4683a5813dcfba31ece4e7d59bf`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `UserPreferencesBase`
  - `UserPreferencesCreate`
  - `UserPreferencesUpdate`
  - `UserPreferencesInDB`
- Excerpt (first non-empty lines):

```text
   1: """
   2: User Preferences Model
   3: """
   5: from typing import Optional
   7: from pydantic import BaseModel, ConfigDict, Field
   9: from backend.models.user import PyObjectId
  12: class UserPreferencesBase(BaseModel):
  13:     theme: str = "system"  # system, light, dark
```

### 191. `backend/models/snapshot.py`
- Bytes: `932`
- Lines: `22`
- SHA256: `5285961e2e8c594c26f509b7b576569f75a05f51fd3010f7b41375effdabaaf0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `StockSnapshot`
- Excerpt (first non-empty lines):

```text
   1: from datetime import datetime, timezone
   2: from typing import Optional
   3: from pydantic import BaseModel, ConfigDict, Field
   6: class StockSnapshot(BaseModel):
   7:     """
   8:     Stock Snapshot model (Rule 2 Mandatory)
   9:     Captures ERP qty and creates a hashed baseline for variance reconciliation.
  10:     """
```

### 192. `backend/models/sync.py`
- Bytes: `694`
- Lines: `29`
- SHA256: `c849cd1bc40c7b4bca10ac7c09e5fda61557a1e1a738af5b92ce9f43402b85f7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SyncItem`
  - `SyncRequest`
- Excerpt (first non-empty lines):

```text
   1: from datetime import datetime
   2: from typing import Any, Literal, Optional
   4: from pydantic import BaseModel
   7: class SyncItem(BaseModel):
   8:     """
   9:     Represents a single item in the sync queue.
  10:     """
  12:     operation: Literal["count_update", "session_complete", "session_start"]
```

### 193. `backend/models/user.py`
- Bytes: `2350`
- Lines: `89`
- SHA256: `0ae6d152b6b9b9b488de1b0d6128dd63f1e2790c8bea5baf49c952b2ae67efab`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PyObjectId`
  - `__get_pydantic_core_schema__`
  - `validate`
  - `__get_pydantic_json_schema__`
  - `UserBase`
  - `UserCreate`
  - `UserUpdate`
  - `UserInDB`
  - `User`
  - `UserResponse`
- Excerpt (first non-empty lines):

```text
   1: """
   2: User Model
   3: """
   5: from typing import Any, Optional
   7: from bson import ObjectId
   8: from pydantic import BaseModel, ConfigDict, EmailStr, Field, GetJsonSchemaHandler
   9: from pydantic.json_schema import JsonSchemaValue
  10: from pydantic_core import core_schema
```

### 194. `backend/pyproject.toml`
- Bytes: `1036`
- Lines: `46`
- SHA256: `c44d47a297e99e63792e4b7a41cfbf49314dd61fa0a99d39ee2dc9a626be39cd`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: [build-system]
   2: requires = ["setuptools>=61.0"]
   3: build-backend = "setuptools.build_meta"
   5: [project]
   6: name = "stock-verify-backend"
   7: version = "2.1.0"
   8: description = "Backend API for Stock Verify Application"
   9: authors = [{ name = "Stock Verify Team", email = "admin@stockverify.internal" }]
```

### 195. `backend/pyrightconfig.json`
- Bytes: `538`
- Lines: `31`
- SHA256: `4966d0e3f37d41d738586d97576f3f09bda4320ddff73b01483bc53f9608ce12`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "include": [
   3:     "**/*.py"
   4:   ],
   5:   "exclude": [
   6:     "**/__pycache__",
   7:     "**/node_modules",
   8:     "**/.venv",
```

### 196. `backend/pytest.ini`
- Bytes: `221`
- Lines: `10`
- SHA256: `971791f0e4cd14d1be8e2d375c40da89efee1bc48a4e68b16e6637d542688536`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: [pytest]
   2: asyncio_mode = auto
   3: asyncio_default_fixture_loop_scope = function
   4: filterwarnings =
   5:     ignore::DeprecationWarning
   6:     ignore::UserWarning
   7: python_files = test_*.py
   8: python_classes = Test*
```

### 197. `backend/requirements.production.txt`
- Bytes: `1395`
- Lines: `57`
- SHA256: `8b27d870f0752689968366db2f51c8c5f6f3df55f16706854c6103eee6ec7091`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Production Requirements
   2: # Use: pip install -r requirements.production.txt
   3: # Last updated: December 2025
   5: # Core Framework
   6: fastapi==0.115.8  # Latest stable
   7: uvicorn[standard]==0.34.1  # Latest stable
   8: gunicorn==23.0.0
   9: python-dotenv==1.0.1
```

### 198. `backend/requirements.txt`
- Bytes: `1784`
- Lines: `66`
- SHA256: `c72a360091df3190c923815c4c039c2947dcfccc07c7423c308fba0b915b5c34`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: fastapi>=0.115.0
   2: uvicorn[standard]>=0.34.0
   3: gunicorn>=23.0.0
   4: python-dotenv>=1.0.1
   5: # Motor 3.7.0 supports pymongo 4.10+; updated compatibility
   6: pymongo>=4.10.0,<4.16
   7: pydantic==2.12.5
   8: pydantic-settings>=2.7.0
```

### 199. `backend/scripts/.gitkeep`
- Bytes: `42`
- Lines: `2`
- SHA256: `91f71a7c22019af0b71a8affc5c1b82003838b8d20ebae5fbec1a420772ec96c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # This directory contains utility scripts
```

### 200. `backend/scripts/README.md`
- Bytes: `412`
- Lines: `15`
- SHA256: `521b20a534a4a4d43a690d1b1a486b6db6126aae34c327147fe1689dd200bec6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Utility Scripts
   3: This directory contains utility scripts for:
   4: - Database checks and diagnostics
   5: - Connection testing
   6: - Configuration management
   7: - One-time setup tasks
   9: ## Scripts
  11: - `check_databases.py` - Check MongoDB and SQL Server connections
```

### 201. `backend/scripts/add_performance_indexes.py`
- Bytes: `4052`
- Lines: `130`
- SHA256: `5d1664df912eb3b936163ca2bf2e6b6999e5f203e403dbdaa70723aaeb22af23`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_normalize_index_key`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Add Performance Indexes Script
   3: Adds recommended indexes from CODEBASE_ANALYSIS.md for improved query performance
   4: """
   6: import asyncio
   7: import logging
   8: import os
   9: from typing import Any
```

### 202. `backend/scripts/add_test_items.py`
- Bytes: `3472`
- Lines: `103`
- SHA256: `0928992c69ec06f4f331f21f2200c5d3e6ca46097e3dc14b229023be2cd5e398`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env python3
   2: """
   3: Add Test Items to MongoDB
   4: Quick script to add test items for development/testing
   5: """
   7: import asyncio
   8: import sys
   9: from datetime import datetime, timezone
```

### 203. `backend/scripts/barcode_analyzer.py`
- Bytes: `8956`
- Lines: `289`
- SHA256: `4f44ef737146bac883abfa8330217ff0a84fe81072a8c790a5405d3ff88722e8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AgingRangeConfig`
  - `BarcodeAnalysisResult`
  - `BatchSummary`
  - `BarcodeAnalyzer`
  - `analyze_barcode`
  - `_generate_recommendations`
  - `get_discount_label`
  - `batch_analyze`
  - `is_aging_stock_barcode`
  - `get_stock_age_indicator`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Barcode Analysis Module
   3: Detects aging stock, slow-moving items, and price discount requirements
   4: Based on barcode ranges and patterns
   5: """
   7: import logging
   8: from typing import Any, Optional, TypedDict
  10: logger = logging.getLogger(__name__)
```

### 204. `backend/scripts/batch_condition_manager.py`
- Bytes: `16580`
- Lines: `499`
- SHA256: `22554dc222ca3dd11db2c1d2da00cbb0b92581ec5ae1bf1b25e554204c94e582`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ItemCondition`
  - `BatchAction`
  - `_check_expiry`
  - `_check_mfg_age`
  - `_apply_condition_rules`
  - `BatchManager`
  - `create_batch`
  - `_analyze_batch_condition`
  - `aggregate_batches`
  - `ConditionMarker`
  - `get_condition_options`
  - `get_quick_actions`
  - `create_multi_batch_count`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Batch and Item Condition Management System
   3: Handles multiple batches of same item and condition tracking
   4: """
   6: import logging
   7: from datetime import datetime, timezone
   8: from enum import Enum
  10: logger = logging.getLogger(__name__)
```

### 205. `backend/scripts/check_barcode_lengths.py`
- Bytes: `1181`
- Lines: `46`
- SHA256: `fe3526ff5481387d2b67272fcc3193815041e3c2cf295985b1e14cef3fb41b40`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `check_lengths`
- Excerpt (first non-empty lines):

```text
   1: import os
   2: import sys
   3: from pathlib import Path  # noqa: E402
   5: # Add project root to path
   6: project_root = Path(__file__).parent.parent.parent
   7: sys.path.insert(0, str(project_root))
   8: sys.path.insert(0, os.getcwd())
  10: from config import settings  # noqa: E402
```

### 206. `backend/scripts/check_other_barcode_columns.py`
- Bytes: `1543`
- Lines: `53`
- SHA256: `5441e2eb803ba56647afba9fec4833f440e29c1f2bb2637a641cb50f1795e66a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `check_other_columns`
- Excerpt (first non-empty lines):

```text
   1: import os
   2: import sys
   3: from pathlib import Path  # noqa: E402
   5: # Add project root to path
   6: project_root = Path(__file__).parent.parent.parent
   7: sys.path.insert(0, str(project_root))
   8: sys.path.insert(0, os.getcwd())
  10: from config import settings  # noqa: E402
```

### 207. `backend/scripts/check_other_barcodes.py`
- Bytes: `1599`
- Lines: `55`
- SHA256: `7252937e369df9c307d796fbe2c0ab6b33be2ebc40280bae738dd94193591de7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `check_other_barcodes`
- Excerpt (first non-empty lines):

```text
   1: import os
   2: import sys
   3: from pathlib import Path  # noqa: E402
   5: # Add project root to path
   6: project_root = Path(__file__).parent.parent.parent
   7: sys.path.insert(0, str(project_root))
   8: sys.path.insert(0, os.getcwd())
  10: from config import settings  # noqa: E402
```

### 208. `backend/scripts/check_sql_barcodes.py`
- Bytes: `3072`
- Lines: `88`
- SHA256: `b8b75ae6889610f243129014a0e12b7d23536709a19821560cb9b3a1150a4ad8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `check_sql_barcodes`
- Excerpt (first non-empty lines):

```text
   1: import logging
   2: import sys
   3: from pathlib import Path  # noqa: E402
   5: # Add project root to path
   6: project_root = Path(__file__).parent.parent.parent
   7: if str(project_root) not in sys.path:
   8:     sys.path.insert(0, str(project_root))
  10: from backend.config import settings  # noqa: E402
```

### 209. `backend/scripts/check_sql_barcodes_v2.py`
- Bytes: `2463`
- Lines: `71`
- SHA256: `401e6c5fe77b5384ee40a484d00fbb8d9b9d1cbd4a47f9f413f8d01e4abd9b83`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `check_sql_barcodes`
- Excerpt (first non-empty lines):

```text
   1: import logging
   2: import sys
   3: from pathlib import Path  # noqa: E402
   5: # Add project root to path
   6: project_root = Path(__file__).parent.parent.parent
   7: if str(project_root) not in sys.path:
   8:     sys.path.insert(0, str(project_root))
  10: from backend.config import settings  # noqa: E402
```

### 210. `backend/scripts/check_sql_duplicates.py`
- Bytes: `1496`
- Lines: `47`
- SHA256: `f9f44bce8d4680ee4ba5a1291fdee74d5d57261fc7a18bf8759c7606ae90b53a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `check_duplicates`
- Excerpt (first non-empty lines):

```text
   1: import sys
   2: from pathlib import Path  # noqa: E402
   4: # Add project root to path
   5: project_root = Path(__file__).parent.parent.parent
   6: if str(project_root) not in sys.path:
   7:     sys.path.insert(0, str(project_root))
   9: from backend.config import settings  # noqa: E402
  10: from backend.sql_server_connector import SQLServerConnector  # noqa: E402
```

### 211. `backend/scripts/check_sync_optimization.py`
- Bytes: `2184`
- Lines: `66`
- SHA256: `e9562e01ebb565630317aa8416ba9cf40eb8c4446fd4f6ad51974eb2b1d452ee`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `check_optimization`
- Excerpt (first non-empty lines):

```text
   1: import os
   2: import sys
   3: from pathlib import Path  # noqa: E402
   5: # Add project root to path
   6: project_root = Path(__file__).parent.parent.parent
   7: sys.path.insert(0, str(project_root))
   8: sys.path.insert(0, os.getcwd())
  10: from config import settings  # noqa: E402
```

### 212. `backend/scripts/check_warehouses.py`
- Bytes: `2142`
- Lines: `67`
- SHA256: `4aa236502145385d9c6ee563229b3f941f3221135fe1e11333e61aee52312c08`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `main`
- Excerpt (first non-empty lines):

```text
   1: import os
   2: import sys
   4: # Add project root to path to allow 'from backend.xxx' imports
   5: sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
   7: from backend.config import settings
   8: from backend.sql_server_connector import SQLServerConnector
  11: def main():
  12:     connector = SQLServerConnector()
```

### 213. `backend/scripts/codebase_upgrade_checker.py`
- Bytes: `7755`
- Lines: `217`
- SHA256: `b4498a68374bdaf0b425e212b10f40e121df20aa6b79b42c189dac03cef4e7b4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `CodeIssue`
  - `CodebaseUpgradeChecker`
  - `__init__`
  - `scan_codebase`
  - `_scan_file`
  - `_analyze_ast`
  - `_check_exception_handling`
  - `_check_type_hints`
  - `_check_bare_except`
  - `_group_issues_by_type`
  - `_group_issues_by_severity`
  - `_issue_to_dict`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Codebase Upgrade Checker
   3: Systematically scans and reports code quality issues
   4: """
   6: import ast
   7: import logging
   8: from collections import defaultdict
   9: from dataclasses import dataclass
```

### 214. `backend/scripts/create_feature_indexes.py`
- Bytes: `3392`
- Lines: `117`
- SHA256: `f3ee29b96c5f56ef799163f59cb8611761ca9e22d3b3c2c8bc3635846c3c2ec5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: """
   2: Create database indexes for new features
   3: Run this script to create indexes for:
   4: - Export schedules
   5: - Export results
   6: - Sync conflicts
   7: """
   9: import asyncio
```

### 215. `backend/scripts/create_item_indexes.py`
- Bytes: `1044`
- Lines: `31`
- SHA256: `3d9ac4f4530fdd58547a94bc0aefd197ea9d2892cfe1e44891a21c13dcb0b9e4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   3: from motor.motor_asyncio import AsyncIOMotorClient
   5: MONGO_URI = "mongodb://localhost:27017"
   6: DB_NAME = "stock_verify"
   7: COLLECTION = "erp_items"
  10: async def create_indexes():
  11:     client = AsyncIOMotorClient(MONGO_URI)
  12:     db = client[DB_NAME]
```

### 216. `backend/scripts/discover_tables.py`
- Bytes: `8633`
- Lines: `286`
- SHA256: `d4e1b514bd77497bebaf8c1a4d413236cf7dbbeced922349209d0efd22b441a6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `connect`
  - `search_tables`
  - `get_table_columns`
  - `get_sample_data`
  - `_discover_tables_by_terms`
  - `_analyze_priority_tables`
  - `_print_table_analysis`
  - `main`
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env python3
   2: """Discover table structure from E_MART_KITCHEN_CARE SQL Server database.
   4: This script provides utilities to explore SQL Server database schema,
   5: including tables, columns, and sample data with proper security measures.
   6: """
   8: import logging
   9: import os
  10: from typing import Any
```

### 217. `backend/scripts/explore_barcodes.py`
- Bytes: `2991`
- Lines: `90`
- SHA256: `167ae25dc73808e16f85bb4f82617e0d11d5ada5a8427c23e18a37abd317435b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `explore`
- Excerpt (first non-empty lines):

```text
   1: import os
   2: import sys
   3: from pathlib import Path  # noqa: E402
   5: # Add project root to path
   6: # Since we are in backend/, the root is ..
   7: project_root = Path(__file__).parent.parent.parent
   8: sys.path.insert(0, str(project_root))
  10: # Also add current dir to path for backend imports
```

### 218. `backend/scripts/generate_api_docs.py`
- Bytes: `37744`
- Lines: `833`
- SHA256: `6c8acba498cb7eb1507c68c0e874200483671369e8ea6b683694aee219f6a946`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `generate_comprehensive_api_docs`
  - `save_api_documentation`
  - `_generate_md_header`
  - `_group_endpoints_by_tag`
  - `_generate_parameters_md`
  - `_generate_request_examples_md`
  - `_generate_responses_md`
  - `_generate_endpoint_md`
  - `generate_markdown_documentation`
- Excerpt (first non-empty lines):

```text
   1: """
   2: API Documentation generator for Stock Verification System.
   3: Generates OpenAPI/Swagger documentation with comprehensive examples.
   4: """
   6: import json
   7: from typing import Any
   9: import yaml
  10: from fastapi import FastAPI
```

### 219. `backend/scripts/generate_secrets.py`
- Bytes: `4168`
- Lines: `124`
- SHA256: `754c751613da18db16d8a790355e8d722fb229eb2878864db7124f5f6b062c24`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `make_secret`
  - `write_env_file`
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env python3
   2: """
   3: Generate strong secrets for .env and optionally write to .env file.
   5: Usage:
   6:   python scripts/generate_secrets.py           -> prints secrets
   7:   python scripts/generate_secrets.py --write   -> writes to .env (updates existing keys)
   9: Security:
  10:   - Generates cryptographically secure random secrets
```

### 220. `backend/scripts/load_test_search.py`
- Bytes: `1885`
- Lines: `63`
- SHA256: `259dcb91b56079290958d452185c20415eef673cfa566b38a911da6eda619163`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SearchUser`
  - `on_start`
  - `search_items`
  - `search_exact_barcode`
- Excerpt (first non-empty lines):

```text
   1: import random
   3: from locust import HttpUser, between, task
   6: class SearchUser(HttpUser):
   7:     wait_time = between(1, 3)
   8:     token = None
  10:     def on_start(self):
  11:         """Login to get JWT token"""
  12:         # Use active auth endpoint and payload format
```

### 221. `backend/scripts/migrate_user_settings.py`
- Bytes: `4112`
- Lines: `137`
- SHA256: `e6a6e0f59fd86f42445d706e1270624311e6565f49a9bebb748862d242b2d447`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: """
   2: User Settings Migration Script
   4: Adds default settings fields to existing users who don't have them.
   5: """
   7: import asyncio
   8: import logging
   9: from datetime import datetime, timezone
  11: from motor.motor_asyncio import AsyncIOMotorDatabase
```

### 222. `backend/scripts/optimize_session_indexes.py`
- Bytes: `2001`
- Lines: `74`
- SHA256: `8d5b7cb2ee529cf130e3ca9417f9d6aaf5c5185f4fb21fb4cc03209395f68112`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: """
   2: Optimize Session Indexes Script
   3: Adds specific indexes to resolve "First Session Creation" delay
   4: """
   6: import asyncio
   7: import logging
   8: import os
  10: from dotenv import load_dotenv
```

### 223. `backend/scripts/report_generator.py`
- Bytes: `13266`
- Lines: `378`
- SHA256: `a8f1581a615c48061ecfbfaa06e71768ca3b219751cc410ccb0090c8236b66d2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ReportGenerator`
  - `generate_session_summary_excel`
  - `_create_summary_sheet`
  - `_create_details_sheet`
  - `_create_variance_sheet`
  - `_create_aging_stock_sheet`
  - `_create_unmatched_sheet`
  - `generate_csv`
  - `generate_variance_summary_csv`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Report Generation Module
   3: Generates comprehensive reports in multiple formats (Excel, CSV, PDF)
   4: """
   6: import io
   7: import logging
   9: import pandas as pd
  10: from openpyxl import Workbook
```

### 224. `backend/scripts/reset_staff_session.py`
- Bytes: `573`
- Lines: `23`
- SHA256: `241d84529e2e757bb708f67407b0dad3626e8c3df2ac72428e2cebac2b37ed14`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import os
   3: from motor.motor_asyncio import AsyncIOMotorClient
   4: from dotenv import load_dotenv
   6: load_dotenv()
   9: async def reset_session():
  10:     mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/stock_count")
  11:     client = AsyncIOMotorClient(mongo_url)
```

### 225. `backend/scripts/restore_mongodb_backup.py`
- Bytes: `4754`
- Lines: `150`
- SHA256: `17fad4794a9e606014fb25c983fa058a3cbf847d0b3aad1310a6e56e65799b06`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env python3
   2: """
   3: Restore MongoDB from JSON backup files
   4: Restores collections from exported JSON files
   5: """
   7: import asyncio
   8: import json
   9: import sys
```

### 226. `backend/scripts/set_supervisor_pin.py`
- Bytes: `1418`
- Lines: `49`
- SHA256: `89171b4908abcd3a5a4a0c8f98658e14a031c30e7ef8416a5f6c9261064d0ad9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import os
   3: import sys
   5: # Add parent directory to path to import backend modules
   6: sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
   8: from motor.motor_asyncio import AsyncIOMotorClient
  10: from backend.config import settings
  11: from backend.utils.auth_utils import get_password_hash
```

### 227. `backend/scripts/setup_server_localhost.py`
- Bytes: `3745`
- Lines: `116`
- SHA256: `f40e623e5ff34ba1fa36681d683c8be21c8d337346249d111e18497fb7538c9a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_read_env_vars`
  - `_update_env_for_localhost`
  - `_write_env_file`
  - `_print_summary`
  - `setup_localhost`
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env python3
   2: """
   3: Setup for Running on Server Machine with localhost
   4: Updates .env for localhost connection (best practice)
   5: """
   7: import io
   8: import sys
   9: from pathlib import Path
```

### 228. `backend/scripts/stress_test_concurrent_users.py`
- Bytes: `17437`
- Lines: `519`
- SHA256: `eec7a1b95973667b0b494f8fc62ee42068502a962525f19f0b115b446c4dfc12`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `UserSession`
  - `StressTestResults`
  - `calculate_stats`
  - `ConcurrentUserStressTester`
  - `__init__`
  - `print_results`
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env python3
   2: """
   3: Concurrent User Stress Test Script
   5: Tests multi-user concurrency scenarios to verify:
   6: 1. Session isolation (no cross-user data leakage)
   7: 2. Connection pool handling under load
   8: 3. Proper authentication per request
   9: 4. Database operation atomicity
```

### 229. `backend/scripts/sync_bridge_agent.py`
- Bytes: `4130`
- Lines: `130`
- SHA256: `96a316a641dd9f024cd4d40451a6eb94e166b42006b3c4b873f089928abf05e2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `DateTimeEncoder`
  - `default`
  - `run_sync_loop`
- Excerpt (first non-empty lines):

```text
   1: import json
   2: import logging
   3: import sys
   4: import time
   5: from datetime import date, datetime, timezone
   6: from pathlib import Path
   8: import requests
  10: # Add project root to path
```

### 230. `backend/scripts/sync_sql_to_mongo.py`
- Bytes: `2365`
- Lines: `76`
- SHA256: `3460fe0c70c12d5b4873df2ced25eeb7a12de7f9cf7d8cb631167f9693d315fa`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import logging
   3: import sys
   4: from pathlib import Path
   6: # Add project root to path
   7: project_root = Path(__file__).parent.parent.parent
   8: if str(project_root) not in sys.path:
   9:     sys.path.insert(0, str(project_root))
```

### 231. `backend/scripts/update_config_from_ssms.py`
- Bytes: `2669`
- Lines: `91`
- SHA256: `d048160f5fd93ebe3fe637b0d57e929800f08b11375dc475a7d6dd3f0ffb7efc`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `update_env_file`
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env python3
   2: """
   3: Update Configuration Based on SQL Server Management Studio
   4: Uses the exact connection details from SSMS
   5: """
   7: import io
   8: import sys
  10: if sys.platform == "win32":
```

### 232. `backend/scripts/update_env_to_server.ps1`
- Bytes: `1587`
- Lines: `38`
- SHA256: `e42c4661543652addded69372c9a0049d120b89658dc2bccbb4ea1fa64cd8955`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Update .env file to use SERVER (from SSMS)
   2: $envFile = "backend\.env"
   4: Write-Host "Updating .env file to use SERVER (from SSMS)..." -ForegroundColor Cyan
   6: if (Test-Path $envFile) {
   7:     $content = Get-Content $envFile -Raw
   9:     # Update SQL_SERVER_HOST to SERVER
  10:     $content = $content -replace "SQL_SERVER_HOST=.*", "SQL_SERVER_HOST=SERVER"
  11:     $content = $content -replace "SQL_SERVER_PORT=.*", "SQL_SERVER_PORT=1433"
```

### 233. `backend/scripts/update_to_sql_auth.ps1`
- Bytes: `3350`
- Lines: `67`
- SHA256: `60a7dadd98069fe28db3ff3cd9f808e43517ab882fa95e03ec4479c6f7f4ee08`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Update .env to use SQL Server Authentication
   2: $envFile = "backend\.env"
   4: Write-Host "Updating .env to use SQL Server Authentication..." -ForegroundColor Cyan
   6: if (Test-Path $envFile) {
   7:     $content = Get-Content $envFile -Raw
   9:     # Update SQL Server configuration for SQL Auth
  10:     # Use IP address if hostname doesn't resolve for pymssql
  11:     # SECURITY: Password must be provided via environment variable SQL_SERVER_PASSWORD
```

### 234. `backend/scripts/validate_env.py`
- Bytes: `1838`
- Lines: `68`
- SHA256: `08c5f9b84eaa597ba357ed0951234121439c518c37db87de827cd9101076a232`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `validate_env`
- Excerpt (first non-empty lines):

```text
   1: import logging
   2: import os
   3: import sys
   5: from dotenv import load_dotenv
   7: # Configure logging for scripts
   8: logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
   9: logger = logging.getLogger(__name__)
  12: def validate_env():
```

### 235. `backend/scripts/verify_reconciliation.py`
- Bytes: `5187`
- Lines: `155`
- SHA256: `4fbbe0386b50368b0e6b419666b62d58ee69cabe41d784be505bd1ff934130de`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `MockUser`
  - `__init__`
  - `get`
  - `__getitem__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Script to verify Multi-Location Reconciliation Logic.
   3: """
   4: from datetime import timezone
   6: import sys
   7: import asyncio
   8: from pathlib import Path
   9: from motor.motor_asyncio import AsyncIOMotorClient
```

### 236. `backend/server.py`
- Bytes: `58544`
- Lines: `1568`
- SHA256: `884545aadc5998c8a1b3d27411123c70fab5e4e6b66f98ab9923d183c2e91924`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `test_direct`
  - `create_access_token`
  - `detect_risk_flags`
  - `calculate_financial_impact`
  - `_get_db_client`
  - `_require_supervisor`
- Excerpt (first non-empty lines):

```text
   1: import logging
   2: import os
   3: import sys
   4: import uuid
   5: from datetime import datetime, timedelta, timezone
   6: from pathlib import Path
   7: from typing import Any, Optional, TypeVar, cast
   9: # Add the parent directory to Python path for proper imports
```

### 237. `backend/services/__init__.py`
- Bytes: `76`
- Lines: `3`
- SHA256: `60299000d062cf67b2a403a0af96857f196581d830ece321fa3251caba9501e7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # This file makes the services directory a Python package
   2: # It can be empty
```

### 238. `backend/services/activity_log.py`
- Bytes: `9177`
- Lines: `268`
- SHA256: `428da18d3389cc58d1b806e4e8c6e1f6bd9c023cdbe22cbd4699b32cf26b3965`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_build_activity_filter`
  - `ActivityLog`
  - `ActivityLogService`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Activity Log Service
   3: Tracks and stores user activities and application events for audit purposes
   4: """
   6: import logging
   7: from datetime import datetime, timezone
   8: from typing import Any, Optional
  10: from motor.motor_asyncio import AsyncIOMotorDatabase
```

### 239. `backend/services/advanced_erp_sync_DISABLED_DO_NOT_USE.py`
- Bytes: `17876`
- Lines: `463`
- SHA256: `5ee1a69cee551e5380cc471f93a4a2c3a52c801cfd64ba8bd304cb6ae095523e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AdvancedERPSyncService`
  - `__init__`
  - `get_stats`
- Excerpt (first non-empty lines):

```text
   1: raise RuntimeError(
   2:     "This module is permanently disabled. It violates Stock Verify governance rules."
   3: )
   5: """
   6: Advanced ERP Sync Service - Enhanced version with better error handling,
   7: batch processing, and real-time capabilities
   8: """
  10: import asyncio
```

### 240. `backend/services/advanced_report_service.py`
- Bytes: `30915`
- Lines: `767`
- SHA256: `569d18798e2863267fcfc2f7e0d151cd1b40999da86040b4c8fb0807245c2042`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ReportFormat`
  - `AggregationType`
  - `SortOrder`
  - `ColumnConfig`
  - `ReportFilters`
  - `ReportConfig`
  - `ReportSummary`
  - `AdvancedReportService`
  - `__init__`
  - `get_column_config`
  - `_build_base_query`
  - `_add_search_filter`
  - `_add_date_filter`
  - `_add_variance_filter`
  - `_get_items_projection`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Advanced Report Service
   3: Comprehensive report generation with real-time data, aggregations, and advanced filtering
   4: """
   6: import csv
   7: import io
   8: import json
   9: import logging
```

### 241. `backend/services/ai_search.py`
- Bytes: `3629`
- Lines: `115`
- SHA256: `ec8fad8d068e054320863d674e43c9b1e268447a6b3c050b7fe8f739bb131301`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AISearchService`
  - `__new__`
  - `get_instance`
  - `initialize_model`
  - `encode`
  - `search_rerank`
- Excerpt (first non-empty lines):

```text
   1: """
   2: AI Search Service
   3: Handles semantic search using sentence-transformers.
   4: """
   6: import logging
   7: from typing import Any, Optional
   9: import numpy as np
  11: # Configure logging
```

### 242. `backend/services/ai_variance.py`
- Bytes: `9872`
- Lines: `292`
- SHA256: `646a98a38c11fe435ab146ae22b0700d76a1fa0313b597cc1e3972f28335f66d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_build_item_risk_pipeline`
  - `_build_category_risk_pipeline`
  - `_calculate_hybrid_risk`
  - `_build_risk_item`
  - `AIVarianceService`
  - `__new__`
  - `__init__`
  - `_process_items_for_risks`
- Excerpt (first non-empty lines):

```text
   1: import logging
   2: from typing import Any, Optional
   4: logger = logging.getLogger(__name__)
   7: def _build_item_risk_pipeline(item_codes: list[str]) -> list[dict[str, Any]]:
   8:     """Build MongoDB aggregation pipeline for item risk calculation."""
   9:     return [
  10:         {"$match": {"item_code": {"$in": item_codes}}},
  11:         {"$sort": {"counted_at": -1}},
```

### 243. `backend/services/analytics_service.py`
- Bytes: `4889`
- Lines: `127`
- SHA256: `0b1a017964b2fd70c09e8b4abb2c5104d3fd6986d47959836d63de5c4efad711`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AnalyticsService`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: import logging
   2: from datetime import datetime, timedelta, timezone
   3: from typing import Any
   5: from motor.motor_asyncio import AsyncIOMotorDatabase
   7: logger = logging.getLogger(__name__)
  10: class AnalyticsService:
  11:     def __init__(self, db: AsyncIOMotorDatabase):
  12:         self.db = db
```

### 244. `backend/services/audit_service.py`
- Bytes: `1894`
- Lines: `62`
- SHA256: `6ff23bb82c2b642d8e6481a4df3e58f6a5ebd991bbf9d5164dca938f9cfbcfbd`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AuditService`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: from datetime import datetime, timezone
   2: from typing import Any, Dict, List, Optional
   4: from motor.motor_asyncio import AsyncIOMotorDatabase
   6: from backend.models.audit import AuditEventType, AuditLog, AuditLogStatus
   9: class AuditService:
  10:     def __init__(self, db: AsyncIOMotorDatabase):
  11:         self.db = db
  12:         self.collection = db.audit_logs
```

### 245. `backend/services/auto_diagnosis.py`
- Bytes: `26466`
- Lines: `716`
- SHA256: `c5579233a121d4a5dd0c449a3a266ff317bf0635e625dc4ac76766cd1f81f839`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ErrorCategory`
  - `ErrorSeverity`
  - `DiagnosisResult`
  - `__init__`
  - `to_dict`
  - `AutoDiagnosisService`
  - `__init__`
  - `_load_error_patterns`
  - `_classify_error`
  - `_recognize_pattern`
  - `_diagnose_database_error`
  - `_diagnose_network_error`
  - `_diagnose_auth_error`
  - `_diagnose_validation_error`
  - `_diagnose_resource_error`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Auto-Diagnosis Service for Error Handling (2024/2025 Best Practice)
   3: Self-diagnosing, self-healing error detection and resolution
   4: """
   6: import asyncio
   7: import logging
   8: import re
   9: import traceback
```

### 246. `backend/services/auto_error_finder.py`
- Bytes: `10147`
- Lines: `275`
- SHA256: `e3a6a701e8fb1b04ba6c6e0acdd0ebf05a9c26dcdbba4619c6b73768b5ed9ed4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `CodeIssue`
  - `BrokenFunction`
  - `AutoErrorFinder`
  - `__init__`
  - `scan_codebase`
  - `_scan_file`
  - `_analyze_ast`
  - `_check_function`
  - `_check_name`
  - `_check_try_except`
  - `_issue_to_dict`
  - `_function_to_dict`
  - `auto_fix`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Auto Error Finder Service
   3: Automatically detects errors, broken functions, and provides recovery options
   4: """
   6: import ast
   7: import logging
   8: from dataclasses import dataclass
   9: from pathlib import Path
```

### 247. `backend/services/auto_recovery.py`
- Bytes: `10900`
- Lines: `322`
- SHA256: `900b1f53e903fb4fb12a6f716b314f303d375d78b5f2e3bd3a27e69e3e8d88b4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `RecoveryStrategy`
  - `_calculate_backoff`
  - `_build_error_info`
  - `AutoRecovery`
  - `__init__`
  - `_record_error`
  - `_log_success`
  - `_handle_fallback`
  - `_handle_default`
  - `_handle_failure`
  - `recover`
  - `get_stats`
  - `clear_history`
  - `with_auto_recovery`
  - `decorator`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Auto Recovery Service
   3: Automatically recovers from errors and provides fallback mechanisms
   4: """
   6: import asyncio
   7: import logging
   8: import random
   9: import time
```

### 248. `backend/services/auto_sync_manager.py`
- Bytes: `9680`
- Lines: `268`
- SHA256: `af91e4f93598980ace2b990cffaac66d3ffb11c36fe2c06d26d0769902681ede`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AutoSyncManager`
  - `__init__`
  - `set_callbacks`
  - `get_status`
  - `get_stats`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Auto Sync Manager - Automatically syncs data from SQL Server when available
   3: Monitors SQL Server connection and triggers sync service when connection is restored
   4: """
   6: import asyncio
   7: import logging
   8: from collections.abc import Callable
   9: from datetime import datetime, timezone
```

### 249. `backend/services/batch_operations.py`
- Bytes: `11103`
- Lines: `292`
- SHA256: `70a44e9d973ef1e4ef3c0ed1f5f28a3a90f7f7102e329e68a95cc42f25878578`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `BatchOperationsService`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Batch Operations Service
   3: Handles bulk operations for improved performance with progress tracking
   4: """
   6: import asyncio
   7: import logging
   8: from collections.abc import Callable
   9: from datetime import datetime, timezone
```

### 250. `backend/services/cache/redis_service.py`
- Bytes: `1764`
- Lines: `63`
- SHA256: `11e1c2189c6d188af1845120f58c89ec755272161ea6fa1b9b6f911fb747795c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `RedisCacheService`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: import json
   2: import logging
   3: from typing import Any, Optional
   5: import redis.asyncio as redis
   7: from backend.config import settings
   9: logger = logging.getLogger(__name__)
  12: class RedisCacheService:
  13:     def __init__(self):
```

### 251. `backend/services/cache_service.py`
- Bytes: `9966`
- Lines: `290`
- SHA256: `d31dc1952de56d1d4736ea53eb8477bc6a0a57bbba489c4fb347ac2b6b1e4cb7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `CustomJSONEncoder`
  - `default`
  - `CacheService`
  - `__init__`
  - `_get_key`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Cache Service - Redis-based caching for performance
   3: Falls back to in-memory cache if Redis unavailable
   4: """
   6: import asyncio
   7: import json
   8: import logging
   9: import time
```

### 252. `backend/services/change_detection_sync.py`
- Bytes: `16671`
- Lines: `464`
- SHA256: `df4a7b08f8397991f0fbadaea7748396c2f584f0f9059a1070ba3db2bd219a36`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ChangeDetectionSyncService`
  - `__init__`
  - `_get_products_with_changes_query`
  - `_build_update_operations`
  - `_finalize_sync`
  - `_update_sync_stats`
  - `_get_next_sync_in`
  - `get_status`
  - `get_stats`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Change Detection Sync Service
   3: Syncs specific fields (item_name, AutoBarcode, MRP) from Products table
   4: with change detection to only update changed items
   6: This module uses the Result pattern for error handling to make error states
   7: explicit and handle them in a functional way.
   8: """
  10: import asyncio
```

### 253. `backend/services/circuit_breaker.py`
- Bytes: `8717`
- Lines: `266`
- SHA256: `b7f786efd00445e365a3a9b8dfb9a460ec8a183ddb1ceb44e9f711e17a88f0b4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `CircuitState`
  - `CircuitBreakerConfig`
  - `CircuitBreaker`
  - `__init__`
  - `state`
  - `is_available`
  - `_transition_to`
  - `_reset_counts`
  - `get_status`
  - `CircuitBreakerRegistry`
  - `__init__`
  - `get`
  - `get_all_status`
  - `with_circuit_breaker`
  - `decorator`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Circuit Breaker Pattern for Enterprise Resilience
   3: Prevents cascading failures and provides graceful degradation
   4: """
   6: import asyncio
   7: import logging
   8: import time
   9: from collections.abc import Callable
```

### 254. `backend/services/config_version_service.py`
- Bytes: `2373`
- Lines: `73`
- SHA256: `78d6d75db70018c85f3f93e040f989604863e6d65f723a6fa07c2c0df8f8c115`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ConfigVersionService`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Config Version Service - Handles versioning and history for configurations
   3: """
   5: import logging
   6: from datetime import datetime, timezone
   7: from typing import Any, Dict, Optional
   8: from motor.motor_asyncio import AsyncIOMotorDatabase
  10: logger = logging.getLogger(__name__)
```

### 255. `backend/services/count_state_machine.py`
- Bytes: `12879`
- Lines: `388`
- SHA256: `f118bd7cc78174ea0a259643685c3700e113350c17216cf82a0019e4fbe1485a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `CountLineState`
  - `StateTransition`
  - `can_transition`
  - `get_allowed_transitions`
  - `EditPermission`
  - `can_edit`
  - `can_view`
  - `CountLineStateMachine`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Count Line State Machine - Post-submit edit control
   4: Implements state-based access control for count lines:
   5: - draft: Editable by counter
   6: - submitted: Locked for counter, viewable by supervisor
   7: - pending_approval: Awaiting supervisor decision
   8: - approved: Locked for all except admin
   9: - rejected: Reopened for counter with supervisor notes
```

### 256. `backend/services/data_governance.py`
- Bytes: `17970`
- Lines: `482`
- SHA256: `6d4577a0811a85cf72661f479752fd711d1fab121a4f2c828107c06109ba4914`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `DataCategory`
  - `RetentionPolicy`
  - `DataSubjectRequest`
  - `DataGovernanceService`
  - `__init__`
  - `_generate_recommendations`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Data Governance Service
   3: Data retention, GDPR compliance, and data lifecycle management
   4: """
   6: import logging
   7: from datetime import datetime, timedelta, timezone
   8: from enum import Enum
   9: from typing import Any, Optional
```

### 257. `backend/services/data_validation_service.py`
- Bytes: `17002`
- Lines: `409`
- SHA256: `55924a0db6d4acd99a7ee1e539de54d9d8666ecccda1415180c35723f6bb82df`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `DataValidationService`
  - `__init__`
  - `_define_validation_rules`
  - `_check_required_fields`
  - `_check_field_types`
  - `_validate_length_constraints`
  - `_validate_numeric_constraints`
  - `_validate_pattern_constraints`
  - `_validate_allowed_values`
  - `_validate_single_field_constraints`
  - `_check_field_constraints`
  - `get_validation_stats`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Data Validation Service - Ensures data integrity across all database operations
   3: """
   5: import logging
   6: import re
   7: from datetime import datetime, timezone
   8: from typing import Any
  10: from motor.motor_asyncio import AsyncIOMotorDatabase
```

### 258. `backend/services/database_health.py`
- Bytes: `13763`
- Lines: `360`
- SHA256: `3db1c1defab50944aa6ad6874c9ab96c72e7e26b9e0db81a82fd413f877a966f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `DatabaseHealthService`
  - `__init__`
  - `_switch_to_dedicated_client`
  - `start`
  - `get_status`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Database Health Monitoring Service
   3: Monitors database connections and provides health checks
   4: """
   6: import asyncio
   7: import logging
   8: from datetime import datetime, timedelta, timezone
   9: from typing import TYPE_CHECKING, Any, Optional
```

### 259. `backend/services/database_manager.py`
- Bytes: `20078`
- Lines: `520`
- SHA256: `96ce405e648a9c4f10104cddfa6011661c8c926f639ca8ab8850ae89d642a648`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_build_collection_recommendation`
  - `DatabaseManager`
  - `__init__`
  - `_analyze_sql_server`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Comprehensive Database Manager - Handles all database operations with enhanced features
   3: """
   5: import logging
   6: import time
   7: from datetime import datetime, timezone
   8: from typing import Any
  10: from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
```

### 260. `backend/services/database_optimizer.py`
- Bytes: `11393`
- Lines: `300`
- SHA256: `2823b366446494da6150d5885d642980c00cbb7394e2975927c4d3bc204fd0ba`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_build_index_name`
  - `DatabaseOptimizer`
  - `__init__`
  - `optimize_client`
  - `track_query`
  - `decorator`
  - `get_query_stats`
  - `reset_stats`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Database Connection Optimizer
   3: Optimizes database connections and queries for maximum performance
   4: """
   6: import asyncio
   7: import logging
   8: import time
   9: from functools import wraps
```

### 261. `backend/services/dynamic_fields_service.py`
- Bytes: `17029`
- Lines: `459`
- SHA256: `4553e3fe176e051bc076fd2e32a342c184022a5e153194f2e835fb38e4ac8577`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `DynamicFieldsService`
  - `__init__`
  - `_validate_number`
  - `_validate_select`
  - `_validate_date`
  - `_validate_field_value`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Dynamic Fields Service
   3: Allows supervisors to dynamically add custom fields to items with database mapping
   4: """
   6: import logging
   7: from datetime import datetime, timezone
   8: from typing import Any, Optional
  10: from bson import ObjectId
```

### 262. `backend/services/dynamic_report_service.py`
- Bytes: `21322`
- Lines: `605`
- SHA256: `76083e1d0c26cf89d5cd6868a9d931b7eef95b6a3ffed203bd08ea29755a9933`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `DynamicReportService`
  - `__init__`
  - `_build_mongo_query`
  - `_apply_aggregations`
  - `_generate_excel`
  - `_generate_csv`
  - `_generate_json`
  - `convert_types`
  - `_generate_pdf`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Dynamic Report Generation Service
   3: Generate custom reports with user-defined fields and filters
   4: """
   6: import io
   7: import json
   8: import logging
   9: from datetime import datetime, timezone
```

### 263. `backend/services/enhanced_connection_pool.py`
- Bytes: `18206`
- Lines: `478`
- SHA256: `b9270f41724df51fea77c1256768d1c5a6a4acd70a4566f21bdf243a7553da72`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ConnectionMetrics`
  - `EnhancedSQLServerConnectionPool`
  - `__init__`
  - `_build_connection_string`
  - `_create_connection_with_retry`
  - `_create_connection`
  - `_initialize_pool`
  - `_is_connection_valid`
  - `_update_health_status`
  - `_try_get_valid_connection`
  - `_create_new_tracked_connection`
  - `_close_quietly`
  - `_get_connection`
  - `_return_connection`
  - `get_connection`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Enhanced Connection Pool Service
   3: Upgraded SQL Server connection pooling with retry logic, health monitoring, and metrics
   4: """
   6: import logging
   7: import threading
   8: import time
   9: from contextlib import contextmanager
```

### 264. `backend/services/enrichment_service.py`
- Bytes: `18868`
- Lines: `571`
- SHA256: `fef25aaedc60bd1b32623744cbc21474946289d40728ea89bf4b6f40821e6be7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_validate_serial_number`
  - `_validate_mrp`
  - `_validate_hsn_code`
  - `_validate_barcode`
  - `_validate_condition`
  - `_process_enrichment_fields`
  - `EnrichmentService`
  - `__init__`
  - `validate_enrichment_data`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Data Enrichment Service - Handle item data correction and enrichment
   3: Manages serial numbers, MRP, HSN codes, and other missing data additions
   4: """
   6: import logging
   7: import re
   8: from datetime import datetime, timezone
   9: from typing import Any, Optional
```

### 265. `backend/services/enterprise_audit.py`
- Bytes: `15697`
- Lines: `460`
- SHA256: `e23c0d150832d9b4ffd92a2a5b044e35c876c4a2cf4057a4cef9dabee8140fc4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_build_audit_search_query`
  - `_add_date_range_filter`
  - `AuditEventType`
  - `AuditSeverity`
  - `AuditEntry`
  - `EnterpriseAuditService`
  - `__init__`
  - `_compute_hash`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Enterprise Audit Service
   3: Comprehensive audit logging for compliance (SOC 2, ISO 27001, GDPR)
   4: Immutable audit trail with tamper detection
   5: """
   7: import hashlib
   8: import json
   9: import logging
```

### 266. `backend/services/enterprise_security.py`
- Bytes: `19159`
- Lines: `545`
- SHA256: `a8a24e376d857f966797ec5d1333aa813e055f41f2c322e118c3c33dfc33b302`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SecurityAction`
  - `IPListType`
  - `SecurityEvent`
  - `EnterpriseSecurityService`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Enterprise Security Service
   3: Advanced security features for enterprise deployments
   4: - IP Whitelisting/Blacklisting
   5: - Brute force protection
   6: - Session management
   7: - Security event monitoring
   8: """
```

### 267. `backend/services/error_log.py`
- Bytes: `15295`
- Lines: `438`
- SHA256: `2d5ca6401536d792c2a1f0e69bd5df28ab2559795e53f28792450f73c3aadab9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_build_error_filter`
  - `_process_error_for_response`
  - `ErrorLog`
  - `ErrorLogService`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Error Log Service
   3: Tracks and stores application errors, exceptions, and system issues for monitoring
   4: """
   6: import logging
   7: import traceback
   8: from datetime import datetime, timedelta, timezone
   9: from typing import Any, Optional
```

### 268. `backend/services/error_notification_service.py`
- Bytes: `8122`
- Lines: `254`
- SHA256: `bd2ab97de0bee06af632065bcb9ea23a8fd2e56926926d19784282e177b90e66`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ErrorLevel`
  - `NotificationTarget`
  - `ErrorNotification`
  - `__init__`
  - `ErrorNotificationService`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Error Notification Service
   3: Handles error notifications for both users and admins
   4: """
   6: import logging
   7: from datetime import datetime, timezone
   8: from enum import Enum
   9: from typing import Any, Optional
```

### 269. `backend/services/errors.py`
- Bytes: `793`
- Lines: `35`
- SHA256: `e85bb62dd8791de8d55e70990d7b91ac0b3aed1a6039d2f04b07d3ce7010fc45`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SyncError`
  - `__init__`
  - `__str__`
  - `DatabaseError`
  - `ConnectionError`
  - `SyncConfigError`
- Excerpt (first non-empty lines):

```text
   1: """Error types for the sync services."""
   3: from typing import Any, Optional
   6: class SyncError(Exception):
   7:     """Base error class for sync operations."""
   9:     def __init__(self, message: str, details: dict[str, Optional[Any]] = None):
  10:         self.message = message
  11:         self.details = details or {}
  12:         super().__init__(self.message)
```

### 270. `backend/services/feature_flags.py`
- Bytes: `9457`
- Lines: `299`
- SHA256: `6fc28aaa782a822af539a27077bcffe8dbee48894c74b186ac26cacca2902562`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `FeatureState`
  - `FeatureFlag`
  - `FeatureFlagService`
  - `__init__`
  - `_is_cache_valid`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Enterprise Feature Flags Service
   3: Dynamic feature toggling for gradual rollouts and A/B testing
   4: """
   6: import logging
   7: from datetime import datetime, timezone
   8: from enum import Enum
   9: from typing import Optional
```

### 271. `backend/services/heatmap_service.py`
- Bytes: `2279`
- Lines: `71`
- SHA256: `903cfb14d62c1c1a8d62f62d6dcdf11f93f04fd2a0969aa558869731050c9c50`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `HeatmapService`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Heatmap Service - Calculates zone-wise accuracy KPIs (Rule 10)
   3: """
   5: import logging
   6: from typing import Any, Dict, List
   7: from motor.motor_asyncio import AsyncIOMotorDatabase
   9: logger = logging.getLogger(__name__)
  12: class HeatmapService:
```

### 272. `backend/services/item_service.py`
- Bytes: `2472`
- Lines: `71`
- SHA256: `13bcb3c878cb71f4c8f32416b3d741f9423d5fee7ae9763f2fccd70e9dea7674`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `EnhancedItemService`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import logging
   3: from typing import Any, Optional
   5: from backend.services.cache.redis_service import RedisCacheService
   6: from backend.sql_server_connector import SQLServerConnector
   8: logger = logging.getLogger(__name__)
  11: class EnhancedItemService:
  12:     def __init__(self, sql_connector: SQLServerConnector, cache_service: RedisCacheService):
```

### 273. `backend/services/lock_manager.py`
- Bytes: `9824`
- Lines: `306`
- SHA256: `f66bf2f52307d8dfcba2cb3575b9623fe47d444f5177d7080cafa9409a700cfa`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `LockManager`
  - `__init__`
  - `get_lock_manager`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Lock Manager - Redis-based distributed locking
   3: Implements rack locking, session management, and concurrency control
   4: """
   6: import logging
   7: import time
   8: from contextlib import asynccontextmanager
   9: from typing import Optional
```

### 274. `backend/services/lock_service.py`
- Bytes: `3738`
- Lines: `104`
- SHA256: `323091f49b90b0732bbada24c83e2b1f347eb1080548da21d1b1a3be55bc713e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `LockError`
  - `ResourceLockedError`
  - `LockService`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Lock Service for handling atomic operations and preventing race conditions.
   3: Uses MongoDB 'locks' collection with TTL indexes.
   4: """
   6: import logging
   7: from datetime import datetime, timedelta, timezone
   9: from pymongo.errors import DuplicateKeyError
  10: from motor.motor_asyncio import AsyncIOMotorDatabase
```

### 275. `backend/services/mdns_service.py`
- Bytes: `2826`
- Lines: `94`
- SHA256: `0ea95730a42e7364c0a353a24ac09f892523f3d1211d01b000d23105c34921c9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `MDNSService`
  - `__init__`
  - `_get_local_ip`
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import logging
   3: import socket
   5: from zeroconf import ServiceInfo, Zeroconf
   7: logger = logging.getLogger(__name__)
  10: class MDNSService:
  11:     def __init__(self, service_name: str = "stock-verify", port: int = 8001):
  12:         self.zeroconf = Zeroconf()
```

### 276. `backend/services/monitoring_service.py`
- Bytes: `10069`
- Lines: `266`
- SHA256: `b9f9ee0208b4ae7d86104967bf5f6beff088b796d5a25b0083636e226492de75`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `MonitoringService`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Monitoring Service - Application metrics and health monitoring
   3: Tracks performance, errors, and system health
   4: Provides Prometheus-compatible metrics
   5: """
   7: import asyncio
   8: import logging
   9: from collections import deque, defaultdict
```

### 277. `backend/services/notification_service.py`
- Bytes: `7014`
- Lines: `209`
- SHA256: `cc0944c97932d5467236d32de02ceef45346d6d5ad6aef244b21ebd49ac76896`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `NotificationType`
  - `NotificationPriority`
  - `NotificationService`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Notification Service - Push and in-app notifications
   4: Supports:
   5: - Recount assignments
   6: - Approval decisions
   7: - Session reminders
   8: - System alerts
   9: """
```

### 278. `backend/services/observability.py`
- Bytes: `12435`
- Lines: `387`
- SHA256: `a5b0524c4e2d64474c1e86b69b32ce21db7c18bcb0bc23c4db17a1ceb702abb2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `LogLevel`
  - `StructuredLogEntry`
  - `StructuredLogger`
  - `__init__`
  - `_get_context`
  - `_format_entry`
  - `_get_traceback`
  - `debug`
  - `info`
  - `warning`
  - `error`
  - `critical`
  - `Span`
  - `__init__`
  - `set_attribute`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Enterprise Observability Service
   3: Structured logging, distributed tracing, and metrics collection
   4: """
   6: import asyncio
   7: import json
   8: import logging
   9: import time
```

### 279. `backend/services/otp_service.py`
- Bytes: `4153`
- Lines: `118`
- SHA256: `31096999f2c96aaea8b0e51a9f53ab7b19c0be4808c79cb2b914e8f6c3d63976`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `OTPService`
  - `__init__`
  - `generate_otp_code`
- Excerpt (first non-empty lines):

```text
   1: """
   2: OTP Service - Manages generation, storage, and verification of one-time passwords
   3: """
   5: import logging
   6: import secrets
   7: import string
   8: from datetime import datetime, timedelta, timezone
   9: from typing import Optional, Tuple
```

### 280. `backend/services/pin_auth_service.py`
- Bytes: `6356`
- Lines: `178`
- SHA256: `1fbeba8b1391f136893711032f344d6a03ad91cfb06d695d889387a15a9c6e2c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PINAuthService`
  - `__init__`
  - `_validate_pin_format`
- Excerpt (first non-empty lines):

```text
   1: """
   2: PIN Authentication Service
   3: Handles PIN-based login for staff/quick access
   4: """
   6: import logging
   7: from datetime import datetime, timedelta, timezone
   8: from typing import Any
  10: from motor.motor_asyncio import AsyncIOMotorDatabase
```

### 281. `backend/services/pubsub_service.py`
- Bytes: `8883`
- Lines: `270`
- SHA256: `5b53072752db924f6163775c0293309fd02e5b76b3780e28b2aca94f0ed9d153`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_decode_message_data`
  - `PubSubService`
  - `__init__`
  - `get_pubsub_service`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Pub/Sub Service - Real-time messaging using Redis
   3: Handles rack updates, session notifications, and global broadcasts
   4: """
   6: import asyncio
   7: import json
   8: import logging
   9: from collections.abc import Callable
```

### 282. `backend/services/rate_limiter.py`
- Bytes: `6617`
- Lines: `200`
- SHA256: `64fdfce80081f93edb7169ef177cb362646449ff7fe609afca9f5698272a30e7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `RateLimiter`
  - `__init__`
  - `_get_bucket_key`
  - `_refill_tokens`
  - `_cleanup_old_buckets`
  - `is_allowed`
  - `get_stats`
  - `ConcurrentRequestHandler`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Rate Limiter Service - Prevent API abuse and handle concurrent requests
   3: Implements token bucket algorithm for rate limiting
   4: """
   6: import asyncio
   7: import logging
   8: import time
   9: from collections import defaultdict
```

### 283. `backend/services/redis_service.py`
- Bytes: `7756`
- Lines: `238`
- SHA256: `f5613831c33f1a781a62a2cfa584760cd9c6f7e5afa2776a8684d30104bc0742`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `RedisService`
  - `__init__`
  - `client`
  - `is_connected`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Redis Service - Connection management and utilities
   3: Provides connection pooling, health checks, and utility methods
   4: """
   6: import asyncio
   7: import logging
   8: from typing import Optional, Set, Union
  10: from redis.asyncio import Redis
```

### 284. `backend/services/refresh_token.py`
- Bytes: `9516`
- Lines: `246`
- SHA256: `c3b503dcfd3eb1d2df1083427886b47772b88f3a9eea920c675c7535815da04d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_hash_token`
  - `RefreshTokenService`
  - `__init__`
  - `create_access_token`
  - `create_refresh_token`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Refresh Token Service
   3: Implements JWT refresh tokens with automatic rotation for enhanced security
   4: """
   6: import hashlib
   7: import logging
   8: from datetime import datetime, timedelta, timezone
   9: from typing import Any, Optional
```

### 285. `backend/services/reporting/compare_engine.py`
- Bytes: `8372`
- Lines: `255`
- SHA256: `e6a3e44cc3309217d1426982f019f92ade66f75ac9ae6ff1d2c2f1338b91c207`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `CompareEngine`
  - `__init__`
  - `_compare_summaries`
  - `_compare_rows`
  - `_create_row_lookup`
  - `_calculate_row_diff`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Compare Engine - Compare two snapshots
   3: Identifies differences, trends, and changes
   4: """
   6: import logging
   7: import time
   8: from typing import Any, Optional
  10: logger = logging.getLogger(__name__)
```

### 286. `backend/services/reporting/export_engine.py`
- Bytes: `6162`
- Lines: `196`
- SHA256: `203a70c7989f5f360b03c8d602d1bc896a74013d9a2dcf2bc7aefbe64db090d2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_xlsx_write_metadata`
  - `_xlsx_write_summary`
  - `_xlsx_write_data`
  - `_xlsx_auto_column_widths`
  - `ExportEngine`
  - `__init__`
  - `export_to_csv`
  - `export_to_xlsx`
  - `export_to_json`
  - `get_export_filename`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Export Engine - Export snapshots to various formats
   3: Supports CSV, XLSX, and PDF exports
   4: """
   6: import csv
   7: import io
   8: import logging
   9: from datetime import datetime
```

### 287. `backend/services/reporting/query_builder.py`
- Bytes: `9666`
- Lines: `329`
- SHA256: `5616a3e17a47e6dc2eb9cd602cb2df9b6839c3d09574030bed594c6e2a12f32b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_apply_operator`
  - `QueryBuilder`
  - `__init__`
  - `build_pipeline`
  - `_build_match_stage`
  - `_build_group_stage`
  - `generate_query_hash`
  - `validate_query`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Query Builder Service - Dynamic MongoDB aggregation pipeline builder
   3: Supports complex queries with filters, grouping, and sorting
   4: """
   6: import hashlib
   7: import json
   8: import logging
   9: from datetime import datetime
```

### 288. `backend/services/reporting/snapshot_engine.py`
- Bytes: `7930`
- Lines: `254`
- SHA256: `ab6e4a5cf38bc6e36526a65071df70e543ef0d5ca6dc9b0bd8910ff64144ec27`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SnapshotEngine`
  - `__init__`
  - `_calculate_summary`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Snapshot Engine - Save and manage report snapshots
   3: Enables point-in-time reporting and comparisons
   4: """
   6: import logging
   7: import time
   8: from typing import Any, Optional, cast
  10: from backend.services.reporting.query_builder import QueryBuilder
```

### 289. `backend/services/runtime.py`
- Bytes: `885`
- Lines: `30`
- SHA256: `b8f6c523923511cf26182de51c3702f9fce145c8e3dbb33bbd1d54b83f055d72`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `get_cache_service`
  - `set_cache_service`
  - `get_refresh_token_service`
  - `set_refresh_token_service`
- Excerpt (first non-empty lines):

```text
   1: from typing import Optional
   3: from backend.services.cache_service import CacheService
   4: from backend.services.refresh_token import RefreshTokenService
   6: _CACHE_SERVICE: Optional[CacheService] = None
   7: _REFRESH_TOKEN_SERVICE: Optional[RefreshTokenService] = None
  10: def get_cache_service() -> CacheService:
  11:     if _CACHE_SERVICE is None:
  12:         raise RuntimeError("CacheService has not been initialized.")
```

### 290. `backend/services/scheduled_export_service.py`
- Bytes: `15722`
- Lines: `442`
- SHA256: `6545679a764b5f76a4b953aab48ea61c8db78c34f6078b3aa832922d5b6cf682`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ExportFrequency`
  - `ExportFormat`
  - `ScheduledExportService`
  - `__init__`
  - `_format_as_csv`
  - `_calculate_next_run`
  - `start`
  - `_format_as_excel`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Scheduled Export Service
   3: Automated periodic exports of data to CSV/Excel
   4: """
   6: import asyncio
   7: import csv
   8: import io
   9: import logging
```

### 291. `backend/services/search_service.py`
- Bytes: `13381`
- Lines: `401`
- SHA256: `5b8e641f5ec31dea6139cee91be54d5612931412bdaf9958cf756b2435667eed`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SearchResult`
  - `SearchResponse`
  - `SearchService`
  - `__init__`
  - `_build_query`
  - `_score_candidates`
  - `_calculate_score`
  - `get_search_service`
  - `init_search_service`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Search Service for Optimized Item Lookup
   4: Provides debounce-friendly search with relevance scoring, caching,
   5: and pagination. Designed for frontend integration with 300ms debounce.
   7: Scoring Algorithm:
   8:   - Exact barcode match: 1000 points (highest priority)
   9:   - Partial barcode match: 500 + similarity score
  10:   - Exact item_code match: 400 points
```

### 292. `backend/services/session_state_machine.py`
- Bytes: `1848`
- Lines: `65`
- SHA256: `c473f562d5c3c7baae6bb137ebfbc61ca5e819991c09db589b4d8241a343aba2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SessionState`
  - `SessionStateMachine`
  - `_normalize`
  - `can_transition`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Session State Machine
   4: Enforces allowed session status transitions with case-insensitive matching.
   5: """
   7: from __future__ import annotations
   9: from enum import Enum
  12: class SessionState(str, Enum):
  13:     OPEN = "OPEN"
```

### 293. `backend/services/snapshot_service.py`
- Bytes: `2656`
- Lines: `77`
- SHA256: `5043517a4ceca161bb109567c71d834cdf448bb860046193f3c1c9e57fccc90f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SnapshotService`
  - `__init__`
  - `_generate_hash`
- Excerpt (first non-empty lines):

```text
   1: import hashlib
   2: import logging
   3: from datetime import datetime, timezone
   4: from typing import Any, Optional
   5: from motor.motor_asyncio import AsyncIOMotorDatabase
   7: logger = logging.getLogger(__name__)
  10: class SnapshotService:
  11:     """
```

### 294. `backend/services/sql_connection_optimizer.py`
- Bytes: `7615`
- Lines: `245`
- SHA256: `6c0cb35061df0130e4a1ea1dd28b2622d9c9e31d0544a34f57016e8d29847258`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SQLConnectionOptimizer`
  - `__init__`
  - `optimize_connection_string`
  - `get_connection`
  - `track_query`
  - `decorator`
  - `wrapper`
  - `optimize_query`
  - `get_connection_stats`
  - `reset_stats`
- Excerpt (first non-empty lines):

```text
   1: """
   2: SQL Server Connection Optimizer
   3: Optimizes SQL Server connections for better performance
   4: """
   6: import logging
   7: import time
   8: from contextlib import contextmanager
   9: from functools import wraps
```

### 295. `backend/services/sql_sync_service.py`
- Bytes: `38337`
- Lines: `966`
- SHA256: `3602ce382004e87d115b9c308443e48f08e55b6d90c584edbcd61910ff04fc5f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_normalize_date`
  - `_numeric_or_none`
  - `_safe_optional_str`
  - `_apply_field_conversion`
  - `_build_new_item_dict`
  - `_build_metadata_candidates`
  - `_compute_metadata_updates`
  - `SQLSyncService`
  - `__init__`
  - `should_check_new_items`
  - `should_run_nightly_sync`
  - `_finalize_sync_stats`
  - `get_stats`
  - `set_interval`
  - `disable`
- Excerpt (first non-empty lines):

```text
   1: """
   2: SQL Sync Service - Sync ONLY quantity changes from SQL Server to MongoDB
   3: CRITICAL: Preserves all enriched data (serial numbers, MRP, HSN codes, etc.)
   4: """
   6: import asyncio
   7: import logging
   8: from datetime import date, datetime, timedelta, timezone
   9: from typing import Any, Optional
```

### 296. `backend/services/sql_verification_service.py`
- Bytes: `31730`
- Lines: `814`
- SHA256: `4e38f7e29dfbd5a5eabd981d9944ecd18413203b6487e6a57e67be6678d49ed1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SQLVerificationError`
  - `SQLNullResultError`
  - `SQLAmbiguousResultError`
  - `SQLInvalidNumericError`
  - `SQLVerificationService`
  - `__init__`
  - `_error_response`
- Excerpt (first non-empty lines):

```text
   1: """
   2: SQL Verification Service - Verifies item quantities from SQL Server
   3: Implements business logic requirement: Item selection triggers SQL qty read + Mongo writeback
   4: """
   6: import logging
   7: import math
   8: from datetime import datetime, timezone
   9: from typing import Dict, Any, Optional
```

### 297. `backend/services/sync_conflicts_service.py`
- Bytes: `12610`
- Lines: `352`
- SHA256: `b7163463ba8ba2ffa9c385fb29081e8fba023386545126bc66fffaf4f5d5cf4b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ConflictStatus`
  - `ConflictResolution`
  - `SyncConflictsService`
  - `__init__`
  - `_determine_newest_wins_resolution`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Sync Conflicts Service
   3: Detect and resolve synchronization conflicts between local and server data
   4: """
   6: import logging
   7: from datetime import datetime, timezone
   8: from enum import Enum
   9: from typing import Any, Optional
```

### 298. `backend/services/system_report_service.py`
- Bytes: `4297`
- Lines: `122`
- SHA256: `34dca330b33340974dd97d4f1b5378a72b3a654ce7ab742ac1f8dbd8794c59c9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SystemReportService`
  - `__init__`
  - `_to_csv`
  - `_to_excel`
- Excerpt (first non-empty lines):

```text
   1: import io
   2: import logging
   3: from datetime import datetime, timedelta
   5: import pandas as pd
   7: logger = logging.getLogger(__name__)
  10: class SystemReportService:
  11:     def __init__(self, db):
  12:         self.db = db
```

### 299. `backend/services/variance_service.py`
- Bytes: `9238`
- Lines: `250`
- SHA256: `24d8edec8aa073291a515d210616bc3f1bceb2f3bb5599da9aaf2050ae9c47d7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `VarianceService`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Variance Service - Handles variance calculation and threshold checking
   4: This service calculates variances between counted and expected quantities/values
   5: and checks them against configurable thresholds to determine if supervisor
   6: approval is required.
   7: """
   9: import logging
  10: from datetime import datetime, timezone
```

### 300. `backend/services/variant_service.py`
- Bytes: `2755`
- Lines: `81`
- SHA256: `04305781b8b3fddb7238543c9f491109e9cc02e09510d4da90c72ce8000504b5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `VariantService`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Variant Service - Handles relationships between item variants (Rule 5)
   3: """
   5: import logging
   6: from typing import Any, Dict, List, Optional
   7: from motor.motor_asyncio import AsyncIOMotorDatabase
   9: logger = logging.getLogger(__name__)
  12: class VariantService:
```

### 301. `backend/services/watchdog_service.py`
- Bytes: `4152`
- Lines: `113`
- SHA256: `90ae792aa81febae32bc4319db121b3e6ba055aac6ca1e8746d5842eba87b736`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `WatchdogService`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: import logging
   2: from datetime import datetime, timedelta, timezone
   3: from typing import Any, Dict
   5: from motor.motor_asyncio import AsyncIOMotorDatabase
   7: from backend.services.audit_service import AuditEventType, AuditLogStatus, AuditService
   9: logger = logging.getLogger(__name__)
  12: class WatchdogService:
  13:     def __init__(self, db: AsyncIOMotorDatabase):
```

### 302. `backend/services/websocket/manager.py`
- Bytes: `1721`
- Lines: `60`
- SHA256: `b298b5b9d897e0eb5104b7843cdad38801d68819319ec18ad425165abb4cd7b4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `WebSocketConnection`
  - `WebSocketManager`
  - `__init__`
  - `disconnect`
- Excerpt (first non-empty lines):

```text
   1: import json
   2: from dataclasses import dataclass
   3: from datetime import datetime, timezone
   4: from typing import Optional
   6: from fastapi import WebSocket
   9: @dataclass
  10: class WebSocketConnection:
  11:     websocket: WebSocket
```

### 303. `backend/services/websocket_service.py`
- Bytes: `2845`
- Lines: `73`
- SHA256: `859756b665bdecdc0c09910e00cb18e23df0a1612369dc99684c81e54a560cae`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ConnectionManager`
  - `__init__`
  - `disconnect`
- Excerpt (first non-empty lines):

```text
   1: """
   2: WebSocket Connection Manager Service
   3: Handles real-time connections and broadcasting for stock updates.
   4: """
   6: import logging
   8: from fastapi import WebSocket
  10: logger = logging.getLogger(__name__)
  13: class ConnectionManager:
```

### 304. `backend/services/whatsapp_service.py`
- Bytes: `2073`
- Lines: `63`
- SHA256: `93d3e29e874447502ef5f5e21aeb92c1f917690c3cf3a0a693e5b4961b6a4277`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `WhatsAppService`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: WhatsApp Service - Interface for sending messages via WhatsApp
   3: Initial implementation as a logging mock for development and testing.
   4: """
   6: import logging
   7: from datetime import datetime, timezone
   8: from typing import Optional
  10: logger = logging.getLogger(__name__)
```

### 305. `backend/sql_server_connector.py`
- Bytes: `39201`
- Lines: `1049`
- SHA256: `f620bb27cadd34a65070c68dc77307478e85b623c39b8fed7745642bc5fe143f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `DatabaseConnectionError`
  - `DatabaseQueryError`
  - `ERPReadOnlyViolation`
  - `ERPQueryParameterError`
  - `ItemNotFoundError`
  - `SQLServerConnector`
  - `__init__`
  - `_reset_dynamic_metadata`
  - `_ensure_dynamic_sql_fragments`
  - `_load_schema_metadata`
  - `_get_table_columns`
  - `_resolve_table_name`
  - `_resolve_column_name`
  - `_get_column_reference`
  - `_build_coalesce_expression`
- Excerpt (first non-empty lines):

```text
   1: # ruff: noqa: E402
   2: import logging
   3: import re
   4: import sys
   5: import threading
   6: from pathlib import Path
   7: from typing import Any, Optional
   8: import asyncio
```

### 306. `backend/tests/__init__.py`
- Bytes: `24`
- Lines: `2`
- SHA256: `7ed79a9eefc57d07c6b8e965c7fe3ccb0d6671ecd87f9167ce8da95764191272`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Backend tests package
```

### 307. `backend/tests/api/test_auth.py`
- Bytes: `4626`
- Lines: `151`
- SHA256: `20f094623cb35b573e62f2b0d4945101beffae743f48162be1fd77bfb1c9ab4f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `mock_cache_service`
  - `mock_db`
  - `mock_refresh_token_service`
  - `mock_settings`
  - `mock_auth_deps`
- Excerpt (first non-empty lines):

```text
   1: from unittest.mock import AsyncMock, MagicMock, patch
   3: import pytest
   5: from backend.api.auth import (
   6:     UserRegister,
   7:     check_rate_limit,
   8:     find_user_by_username,
   9:     generate_auth_tokens,
  10:     register,
```

### 308. `backend/tests/api/test_auth_api.py`
- Bytes: `5183`
- Lines: `156`
- SHA256: `ef93e98ec830b53d6625dc4d6c7ce82f8c2f4c9561393d457403155fcbddda92`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `restore_auth_dependency`
- Excerpt (first non-empty lines):

```text
   1: import os
   2: from datetime import datetime, timezone
   4: import pytest
   5: from httpx import AsyncClient
   7: from backend.auth.dependencies import get_current_user as auth_get_current_user
   8: from backend.server import app, get_current_user
   9: from backend.utils.auth_utils import create_access_token, get_password_hash, verify_password
  11: # Test Data
```

### 309. `backend/tests/api/test_auth_handler.py`
- Bytes: `3497`
- Lines: `106`
- SHA256: `3d7271d1970091a798a1f30a2619fc3fe06270691a7ba0600ac4af311007c828`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `restore_auth_dependency`
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: from httpx import AsyncClient
   4: from backend.auth.dependencies import get_current_user as auth_get_current_user
   5: from backend.server import app, get_current_user
   6: from backend.utils.auth_utils import create_access_token
   8: # Test Data
   9: USER_A_ID = "507f1f77bcf86cd799439011"
  10: USER_A_NAME = "user_a"
```

### 310. `backend/tests/api/test_dynamic_reports_api.py`
- Bytes: `21647`
- Lines: `585`
- SHA256: `d1e30b8b819a7082c0784cc5a8ce77d502d4e45db33fcdaa07aff98de058ef0b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `mock_user_supervisor`
  - `mock_user_staff`
  - `sample_report_template`
  - `TestReportTemplateModels`
  - `test_report_field_creation`
  - `test_report_field_defaults`
  - `test_report_template_creation`
  - `test_report_generation_model`
  - `TestGetDynamicReportService`
  - `test_get_service_singleton`
  - `TestCreateReportTemplateEndpoint`
  - `override_get_service`
  - `override_get_service`
  - `TestGetReportTemplatesEndpoint`
  - `override_get_service`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Comprehensive test suite for dynamic_reports_api.py
   3: Target: Achieve 80%+ coverage
   4: """
   6: from unittest.mock import AsyncMock, MagicMock
   8: import pytest
   9: from httpx import ASGITransport, AsyncClient
  11: from backend.api.dynamic_reports_api import ReportField, ReportGeneration, ReportTemplate
```

### 311. `backend/tests/api/test_enhanced_item_api.py`
- Bytes: `6781`
- Lines: `232`
- SHA256: `36b5ef928942ae0e25319eefe6422717f59ad4980c13f8c79fab739d83e803c0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `setup_mocks`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Tests for Enhanced Item API
   3: """
   5: from unittest.mock import AsyncMock, MagicMock
   7: import pytest
   8: from fastapi import HTTPException
  10: from backend.api.enhanced_item_api import (
  11:     _validate_barcode_format,
```

### 312. `backend/tests/api/test_erp_api.py`
- Bytes: `5796`
- Lines: `199`
- SHA256: `3cbc5fbd9e8b0fb6669cd7d41969bde318ab1fa05c2fb373e6ba02f14eb1155b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `setup_mocks`
- Excerpt (first non-empty lines):

```text
   1: from unittest.mock import AsyncMock, MagicMock
   3: import pytest
   4: from fastapi import HTTPException
   6: from backend.api.erp_api import (
   7:     _normalize_barcode_input,
   8:     get_all_items,
   9:     get_item_by_barcode,
  10:     init_erp_api,
```

### 313. `backend/tests/api/test_erp_batches.py`
- Bytes: `4388`
- Lines: `138`
- SHA256: `9480b4b8abc9e27e0802ace4f9f927daeb65ef4cd00c08cd75b2b8a3806db96c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: from httpx import AsyncClient
   3: from unittest.mock import MagicMock
   5: from backend.api.erp_api import router as erp_router
   8: @pytest.mark.asyncio
   9: async def test_get_item_batches_offline_fallback(
  10:     async_client: AsyncClient, authenticated_headers, test_db
  11: ):
```

### 314. `backend/tests/api/test_item_verification_api.py`
- Bytes: `3894`
- Lines: `126`
- SHA256: `ebb13f9785c5fa5efaf4291d59bad0cbd77dfb51835b55f7e08c36cb780b8fda`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `setup_mocks`
  - `test_build_item_filter_query`
- Excerpt (first non-empty lines):

```text
   1: from unittest.mock import AsyncMock
   3: import pytest
   4: from fastapi import HTTPException
   6: from backend.api.item_verification_api import (
   7:     ItemUpdateRequest,
   8:     VerificationRequest,
   9:     build_item_filter_query,
  10:     init_verification_api,
```

### 315. `backend/tests/api/test_mapping_api.py`
- Bytes: `5144`
- Lines: `175`
- SHA256: `edfb88a07453dfdb540af1ea5ba0b76572b8b38257e6cba454c5f06cbf3f1d74`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `mock_pyodbc`
  - `mock_db`
- Excerpt (first non-empty lines):

```text
   1: from unittest.mock import AsyncMock, MagicMock, patch
   3: import pytest
   5: from backend.api.mapping_api import (
   6:     ColumnMapping,
   7:     MappingConfig,
   8:     get_columns,
   9:     get_current_mapping,
  10:     get_tables,
```

### 316. `backend/tests/api/test_pin_auth_api.py`
- Bytes: `6087`
- Lines: `182`
- SHA256: `6a7cf1d721465e4ba04429cdab08d4fb3d009417748e5e9b89a538dc085c7a37`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `OkResult`
  - `__init__`
  - `unwrap`
  - `ErrResult`
  - `__init__`
  - `unwrap`
  - `test_pin_change_request_validation`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Tests for PIN Authentication API
   3: """
   5: from unittest.mock import AsyncMock, MagicMock, patch
   7: import pytest
   8: from fastapi import HTTPException
   9: from pydantic import ValidationError
  11: from backend.api.pin_auth_api import PinChangeRequest, PinLoginRequest, change_pin, login_with_pin
```

### 317. `backend/tests/api/test_preferences_api.py`
- Bytes: `3654`
- Lines: `124`
- SHA256: `dd1a21f076a426fee0409bde0fe4de2c585931e93c5660d6d76103ac92646d5d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: """
   2: Tests for User Preferences API
   3: """
   5: from unittest.mock import AsyncMock
   7: import pytest
   9: from backend.api.preferences_api import (
  10:     UserPreferencesUpdate,
  11:     get_my_preferences,
```

### 318. `backend/tests/api/test_rbac.py`
- Bytes: `5515`
- Lines: `156`
- SHA256: `223396880cdfdc9088035b33910208b287c4e57a78500aa39d52b3516dad8a20`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `TestRBACEnforcement`
  - `client`
  - `staff_user`
  - `supervisor_user`
  - `admin_user`
  - `_make_auth_header`
  - `TestRoleHierarchy`
  - `test_role_hierarchy_order`
  - `test_valid_roles`
  - `TestUnauthorizedAccess`
  - `client`
  - `test_missing_auth_header`
  - `test_invalid_token_format`
  - `test_expired_token`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Tests for Role-Based Access Control (RBAC)
   3: Verifies that endpoints enforce proper role-based authorization
   4: """
   6: from unittest.mock import patch
   8: import pytest
   9: from fastapi.testclient import TestClient
  11: from backend.server import app
```

### 319. `backend/tests/api/test_session_management_api.py`
- Bytes: `28814`
- Lines: `795`
- SHA256: `7c1b0f31c479b268d6b3de52bc54c7650cec17f559439a324572d67240f1ef80`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `mock_user_staff`
  - `mock_user_supervisor`
  - `sample_session_data`
  - `sample_verification_session`
  - `TestSessionModels`
  - `test_session_create_model`
  - `test_session_create_default_type`
  - `test_session_create_warehouse_required`
  - `TestCreateSessionEndpoint`
  - `TestGetSessionsEndpoint`
  - `TestGetSessionDetailEndpoint`
  - `TestSessionStatsEndpoint`
  - `TestCompleteSessionEndpoint`
  - `TestUpdateSessionStatusEndpoint`
  - `TestActiveSessionsEndpoint`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Comprehensive test suite for session_management_api.py
   3: Target: Achieve 80%+ coverage
   4: """
   6: import time
   7: from datetime import datetime, timezone
   8: from unittest.mock import AsyncMock, MagicMock
  10: import pytest
```

### 320. `backend/tests/api/test_user_management_api.py`
- Bytes: `4420`
- Lines: `139`
- SHA256: `d04845ebe4d9f9a4b006aaf2c0106a257bcb3320b4aa0ccd6f33da53d25f960b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: from fastapi import status
   3: from httpx import AsyncClient
   5: from backend.auth.dependencies import get_current_user
   6: from backend.server import app
   9: # Mock admin user
  10: async def mock_get_current_admin():
  11:     return {
```

### 321. `backend/tests/api/test_user_settings_api.py`
- Bytes: `3612`
- Lines: `107`
- SHA256: `a3be15d57ea73c23b3f2b0de727326cb8b015d06172ca2df0361ee664883314f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `restore_auth_dependency`
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: from httpx import AsyncClient
   4: from backend.server import app
   5: from backend.utils.auth_utils import create_access_token
   7: # Test Data
   8: TEST_USERNAME = "testuser_settings"
   9: TEST_USER_ID = "507f1f77bcf86cd799439011"  # Mock ObjectId
  12: @pytest.fixture(autouse=True)
```

### 322. `backend/tests/api/test_websocket_api.py`
- Bytes: `3812`
- Lines: `113`
- SHA256: `2fae761968a967291d98d58e76bbe3fc69863705b90f13c29dd8cd98529ec5b7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `client`
  - `clear_manager`
  - `test_websocket_connect_success`
  - `test_websocket_connect_invalid_token`
  - `test_websocket_connect_wrong_role`
- Excerpt (first non-empty lines):

```text
   1: import os
   3: import pytest
   4: from fastapi.testclient import TestClient
   6: from backend.core.websocket_manager import manager
   7: from backend.server import app
   8: from backend.utils.auth_utils import create_access_token
  10: # Test Data
  11: SUPERVISOR_USER = "supervisor_ws"
```

### 323. `backend/tests/conftest.py`
- Bytes: `5607`
- Lines: `181`
- SHA256: `8f8f7a66ffe0d4a12db100abdc47ac1d084f0a2020ddff3b8b76d50810df8dbc`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `test_db`
  - `temp_dir`
  - `mock_sql_connection`
  - `performance_baseline`
  - `clean_overrides`
- Excerpt (first non-empty lines):

```text
   1: """Comprehensive pytest configuration for backend testing suite."""
   3: import os
   4: import shutil
   5: import sys
   6: import tempfile
   7: from collections.abc import AsyncGenerator, Generator
   8: from pathlib import Path
   9: from unittest.mock import MagicMock
```

### 324. `backend/tests/core/test_validators_init.py`
- Bytes: `543`
- Lines: `15`
- SHA256: `074c9a14fbad7abdd9db3b3d76e16e2248a7a8f591639b8f695d242e218684d0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `test_core_validators_init_exports`
- Excerpt (first non-empty lines):

```text
   1: from __future__ import annotations
   4: def test_core_validators_init_exports() -> None:
   5:     # Importing this package should execute core/validators/__init__.py
   6:     from core.validators import PinValidationResult, validate_pin, validate_pin_change
   8:     result = validate_pin("4826")
   9:     assert isinstance(result, PinValidationResult)
  10:     assert result.is_valid is True
  12:     change_result = validate_pin_change("4826", "4827", confirm_pin="4827")
```

### 325. `backend/tests/evaluation/README.md`
- Bytes: `8180`
- Lines: `305`
- SHA256: `d56a1d25d83bb022963fee7b5f5fe702a3abce678b4204eccc2bef26092d8936`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `CustomEvaluator`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: # Stock Verify Evaluation Framework
   3: A comprehensive evaluation framework for testing and validating the Stock Verify system across multiple dimensions.
   5: ## Overview
   7: This evaluation framework provides systematic testing for:
   9: - **API Performance**: Latency, throughput, and error rates
  10: - **Business Logic**: Variance calculations, session states, and validation rules
  11: - **Data Quality**: Completeness, format validation, and sync consistency
  12: - **Workflow**: End-to-end user flows and state transitions
```

### 326. `backend/tests/evaluation/__init__.py`
- Bytes: `979`
- Lines: `34`
- SHA256: `3914c10397fc641aa33423c65b4b629a78e644b21fd3a1a39ed32783924cd76c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: """
   2: Stock Verify Evaluation Framework
   3: =================================
   5: Comprehensive evaluation suite covering:
   6: - API Performance Metrics (response time, throughput, success rates)
   7: - Business Logic Quality (variance calculations, sync consistency)
   8: - Workflow Completion (session lifecycle, verification flows)
   9: - Data Quality (accuracy, consistency between databases)
```

### 327. `backend/tests/evaluation/conftest.py`
- Bytes: `2689`
- Lines: `88`
- SHA256: `7a7ef2fc8d8a6819905518f8f4fc97f4fb7b33611fd3ac9f9ad30f408fcd5545`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `event_loop`
  - `test_db`
  - `pytest_configure`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Evaluation Test Configuration
   3: ============================
   5: Pytest configuration for evaluation tests.
   6: """
   8: import asyncio
   9: import os
  10: import sys
```

### 328. `backend/tests/evaluation/evaluators.py`
- Bytes: `23812`
- Lines: `699`
- SHA256: `50e6c386fe861ce1ac3b8df5473fa4a1f5fc56bcfe90da83078a801fcafd75b2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `BaseEvaluator`
  - `__init__`
  - `APIPerformanceEvaluator`
  - `BusinessLogicEvaluator`
  - `VarianceTestCase`
  - `DataQualityEvaluator`
  - `WorkflowEvaluator`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Evaluators - Domain-specific evaluation logic for Stock Verify system.
   4: Contains evaluators for:
   5: - API Performance
   6: - Business Logic (variance calculations)
   7: - Data Quality (sync consistency)
   8: - Workflow Completion
   9: """
```

### 329. `backend/tests/evaluation/metrics_collector.py`
- Bytes: `17094`
- Lines: `546`
- SHA256: `7bafcb2cb58101512eedc3546fec840d67be58c220e7d188116e35bbb4130343`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `MetricCategory`
  - `MetricStatus`
  - `Metric`
  - `evaluate`
  - `to_dict`
  - `EvaluationReport`
  - `duration_seconds`
  - `passed_count`
  - `failed_count`
  - `warning_count`
  - `success_rate`
  - `get_metrics_by_category`
  - `get_summary`
  - `to_dict`
  - `to_json`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Metrics Collector - Central metrics collection and reporting for evaluation framework.
   4: Collects, aggregates, and reports evaluation metrics across all evaluation categories.
   5: """
   7: import json
   8: import statistics
   9: import time
  10: from dataclasses import dataclass, field
```

### 330. `backend/tests/evaluation/reports/.gitkeep`
- Bytes: `368`
- Lines: `19`
- SHA256: `e28d4fa14f7acddfccb70620e2475d474a9693be7af60479c100171343eedf4b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Evaluation Reports
   3: This directory contains generated evaluation reports.
   5: Reports are named with timestamps: `evaluation_report_YYYYMMDD_HHMMSS.{json,md}`
   7: ## Generating Reports
   9: ```bash
  10: # JSON format (default)
  11: make eval
  13: # Markdown format
```

### 331. `backend/tests/evaluation/reports/evaluation_report_20251208_091628.json`
- Bytes: `441`
- Lines: `24`
- SHA256: `21f2483af63ca044b1c0319627da08944a05bb2520bd94724965d348460a70f6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "timestamp": "2025-12-08T09:16:24.628929",
   3:   "evaluations": {
   4:     "performance": {
   5:       "name": "API Performance",
   6:       "markers": [
   7:         "performance"
   8:       ],
```

### 332. `backend/tests/evaluation/reports/evaluation_report_20251208_091630.json`
- Bytes: `446`
- Lines: `24`
- SHA256: `b87862ddb5a16855753c3230d9daa5ded98b5876797a5fc78077e26d223d2b0a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "timestamp": "2025-12-08T09:16:28.236570",
   3:   "evaluations": {
   4:     "business_logic": {
   5:       "name": "Business Logic",
   6:       "markers": [
   7:         "business_logic"
   8:       ],
```

### 333. `backend/tests/evaluation/run_evaluation.py`
- Bytes: `12887`
- Lines: `383`
- SHA256: `0e2daf0add3a5f92419d5de33e889749c1249006698ffc9a4b5d6fa53161628d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `EvaluationRunner`
  - `__init__`
  - `run_pytest_evaluation`
  - `run_all_evaluations`
  - `generate_report`
  - `_generate_markdown_report`
  - `print_final_summary`
  - `_create_argument_parser`
  - `_run_specific_evaluations`
  - `main`
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env python3
   2: """
   3: Stock Verify Evaluation Runner
   4: ==============================
   6: Unified command-line interface to run all evaluations and generate reports.
   8: Usage:
   9:     python -m backend.tests.evaluation.run_evaluation --all
  10:     python -m backend.tests.evaluation.run_evaluation --performance
```

### 334. `backend/tests/evaluation/test_api_performance.py`
- Bytes: `12284`
- Lines: `378`
- SHA256: `935db2e44a3ffd4d2ee1475e8f6add94e5d2ee857549dc891d00b1addafa8e8f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `collector`
  - `api_evaluator`
  - `TestAPILatency`
  - `TestAPIThroughput`
  - `TestAPISuccessRate`
  - `TestFullAPIEvaluation`
- Excerpt (first non-empty lines):

```text
   1: """
   2: API Performance Evaluation Tests
   3: ================================
   5: Comprehensive API performance testing including:
   6: - Endpoint latency (mean, p50, p95, p99)
   7: - Throughput (requests per second)
   8: - Success rate under load
   9: - Concurrent request handling
```

### 335. `backend/tests/evaluation/test_business_logic.py`
- Bytes: `14534`
- Lines: `417`
- SHA256: `6ab295f1ee0735ca0996603e6a88d6737603bc82bb82e3f163bcdf7e460080cc`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `collector`
  - `logic_evaluator`
  - `TestVarianceCalculations`
  - `VarianceCase`
  - `calculate_variance`
  - `test_variance_calculation_accuracy`
  - `test_variance_threshold_detection`
  - `TestSessionStateMachine`
  - `test_valid_transitions`
  - `test_invalid_transitions`
  - `_is_valid_transition`
  - `TestCountAggregation`
  - `test_count_totals`
  - `test_session_summary_calculation`
  - `TestAuthorizationRules`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Business Logic Evaluation Tests
   3: ===============================
   5: Tests for business logic correctness including:
   6: - Variance calculations
   7: - Session state transitions
   8: - Count aggregation logic
   9: - Authorization rules
```

### 336. `backend/tests/evaluation/test_data_quality.py`
- Bytes: `13393`
- Lines: `403`
- SHA256: `d04d603bc04b05c93a55721eb948e150e26d0d021957917b3fa0a153453fa64e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `collector`
  - `data_evaluator`
  - `TestDataCompleteness`
  - `_create_mock_document`
  - `test_user_completeness`
  - `test_session_completeness`
  - `test_erp_items_completeness`
  - `TestDataFormatValidation`
  - `test_barcode_format`
  - `is_valid_barcode`
  - `test_quantity_format`
  - `is_valid_quantity`
  - `test_date_format`
  - `is_valid_date`
  - `TestSyncConsistency`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Data Quality Evaluation Tests
   3: =============================
   5: Tests for data quality and consistency including:
   6: - Data completeness
   7: - Format validation
   8: - Sync consistency
   9: - Referential integrity
```

### 337. `backend/tests/evaluation/test_security_evaluation.py`
- Bytes: `17507`
- Lines: `470`
- SHA256: `d6bec4bfc366cb6c9e9dc09c3317536c2c21a040f6db19f06a9825a19e8599d5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `TestAuthenticationSecurity`
  - `TestInputValidation`
  - `TestHeaderSecurity`
  - `TestSessionSecurity`
  - `TestPasswordSecurity`
  - `TestRateLimiting`
  - `TestErrorHandling`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Security Evaluation Tests
   3: =========================
   5: Tests for evaluating security aspects of the Stock Verify system.
   7: Note: Some tests are skipped in the test environment because the in-memory
   8: database uses mock authentication that bypasses real JWT validation.
   9: These tests are designed to run against a real or staging environment.
  10: """
```

### 338. `backend/tests/evaluation/test_workflow.py`
- Bytes: `14794`
- Lines: `477`
- SHA256: `87d0b7018829c179c2651ce8cad79d8f3b89e0dd4cba0fc9c18fee73c8e04962`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `collector`
  - `workflow_evaluator`
  - `TestAuthenticationWorkflow`
  - `TestSessionWorkflow`
  - `TestVerificationWorkflow`
  - `TestAdminWorkflow`
  - `TestFullWorkflowEvaluation`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Workflow Evaluation Tests
   3: =========================
   5: Tests for end-to-end workflow completion including:
   6: - Authentication workflow
   7: - Session lifecycle workflow
   8: - Item verification workflow
   9: - Admin operations workflow
```

### 339. `backend/tests/governance/test_optimistic_locking.py`
- Bytes: `1614`
- Lines: `50`
- SHA256: `2692f2c1ca97cdd13c869fb3a2c7f9407b1030365dee25f3b0f5b0d2cc7b0444`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: from unittest.mock import AsyncMock
   3: import pytest
   5: from backend.tests.utils.in_memory_db import setup_server_with_in_memory_db
   8: @pytest.mark.asyncio
   9: @pytest.mark.governance
  10: async def test_sql_verification_conflict_forks_on_stale_write(monkeypatch):
  11:     db = setup_server_with_in_memory_db(monkeypatch)
  13:     import backend.services.sql_verification_service as svs
```

### 340. `backend/tests/governance/test_session_transitions.py`
- Bytes: `1977`
- Lines: `57`
- SHA256: `89c49f2bbbcfb696dacf0649ec1458ff2ce72ccf8b7a9214b9c529643508be6a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `test_session_state_machine_guard`
- Excerpt (first non-empty lines):

```text
   1: import time
   2: from unittest.mock import AsyncMock, MagicMock
   4: import pytest
   5: from httpx import ASGITransport, AsyncClient
   7: from backend.server import app
   8: from backend.services.session_state_machine import SessionStateMachine
  11: @pytest.mark.governance
  12: def test_session_state_machine_guard():
```

### 341. `backend/tests/governance/test_sql_read_only.py`
- Bytes: `842`
- Lines: `24`
- SHA256: `f21c73eab0771c185766c0fcb73e42ca4b7f7a1cd0f49c902b3e449c69619e27`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import pytest
   3: from backend.sql_server_connector import DatabaseQueryError, SQLServerConnector
   6: @pytest.mark.asyncio
   7: @pytest.mark.governance
   8: async def test_sql_connector_blocks_mutations():
   9:     connector = SQLServerConnector()
  10:     mutations = [
  11:         "UPDATE dbo.Products SET Name = 'X' WHERE ProductID = 1",
```

### 342. `backend/tests/governance/test_sql_verified_qty_authority.py`
- Bytes: `1546`
- Lines: `54`
- SHA256: `f6c28c6e8303fe84a88a742e149ee590509a7c52a8a481cee6abebfdca314dae`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `iter_python_files`
  - `contains_sql_verified_qty_token`
  - `test_sql_verified_qty_authority`
- Excerpt (first non-empty lines):

```text
   1: import os
   2: import tokenize
   4: import pytest
   7: ALLOWED_RELATIVE = {
   8:     "services/sql_verification_service.py",
   9:     "api/schemas.py",
  10:     "api/v2/items.py",
  11: }
```

### 343. `backend/tests/middleware/test_lan_enforcement.py`
- Bytes: `2870`
- Lines: `116`
- SHA256: `aecf45795cf50932985e15eb8f3f00c6df19ceaa892582771242972cf71845c8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `import_json_body`
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: from fastapi import FastAPI, Request
   3: from fastapi.testclient import TestClient
   4: from starlette.responses import JSONResponse
   6: from backend.middleware.lan_enforcement import LANEnforcementMiddleware
   8: # Setup a dummy app for testing
   9: app = FastAPI()
  10: app.add_middleware(LANEnforcementMiddleware)
```

### 344. `backend/tests/services/test_audit_service.py`
- Bytes: `2053`
- Lines: `60`
- SHA256: `077c20dad4a9006da22a5833aa41b3639fb7d16ced40db34dba13b72528a71df`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: from unittest.mock import AsyncMock, MagicMock
   3: from backend.services.audit_service import AuditService, AuditEventType, AuditLogStatus
   4: from backend.services.watchdog_service import WatchdogService
   7: @pytest.mark.asyncio
   8: async def test_audit_log_event():
   9:     # Setup
  10:     mock_db = MagicMock()
```

### 345. `backend/tests/services/test_cache_service.py`
- Bytes: `4434`
- Lines: `121`
- SHA256: `49074b5c604b346c4413643876270898c342d7a174823796b83410f86d56b780`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `TestCustomJSONEncoder`
  - `test_encode_objectid`
  - `test_encode_datetime`
  - `test_encode_regular_types`
  - `TestCacheService`
  - `cache_service`
  - `TestCacheServiceWithRedis`
  - `mock_redis`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Tests for Redis Cache Service
   3: Tests caching functionality with both Redis and fallback in-memory cache
   4: """
   6: import json
   7: from datetime import datetime
   8: from unittest.mock import AsyncMock, patch
  10: import pytest
```

### 346. `backend/tests/services/test_sql_sync_service.py`
- Bytes: `6941`
- Lines: `219`
- SHA256: `f6af6b83e653b1cb315d3051bb04435ad7769cf3208caa4844822efe72615f25`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_make_service`
  - `FixedDateTime`
  - `utcnow`
  - `now`
- Excerpt (first non-empty lines):

```text
   1: from __future__ import annotations
   3: from datetime import datetime, timedelta, timezone
   4: from types import SimpleNamespace
   5: from unittest.mock import AsyncMock, Mock
   7: import pytest
   8: from services.sql_sync_service import SQLSyncService
  11: def _make_service(
  12:     *, sql_connector: Mock | None = None, mongo_db: object | None = None
```

### 347. `backend/tests/test_admin_control_api.py`
- Bytes: `8076`
- Lines: `243`
- SHA256: `e5d6d21cd44f417703db991f47bf74d0a4118e471d19024122eeef5f0de8dd86`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `admin_user`
  - `override_auth`
  - `mock_psutil`
  - `mock_port_detector`
  - `mock_sql_connector`
  - `mock_service_manager`
  - `test_get_services_status`
  - `test_get_service_logs_backend`
  - `test_get_system_issues`
  - `test_get_sql_server_config`
  - `test_update_sql_server_config`
  - `test_test_sql_server_connection`
  - `test_start_backend`
  - `test_stop_backend`
  - `test_start_frontend`
- Excerpt (first non-empty lines):

```text
   1: from datetime import datetime, timezone
   2: from unittest.mock import MagicMock, mock_open, patch
   4: import pytest
   5: from fastapi.testclient import TestClient
   7: from backend.auth import get_current_user
   8: from backend.server import app
  10: client = TestClient(app)
  13: # Mock admin user
```

### 348. `backend/tests/test_ai_variance.py`
- Bytes: `1942`
- Lines: `62`
- SHA256: `ee4ed3047c43ac35e9b882ab1ea7b9d2f4422fc9d255520e48b291e50ea6c34c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: from unittest.mock import AsyncMock, MagicMock
   3: import pytest
   5: from backend.services.ai_variance import AIVarianceService
   8: @pytest.mark.asyncio
   9: async def test_get_category_risk_score_heuristic():
  10:     service = AIVarianceService()
  11:     db = MagicMock()
  13:     # Mock aggregate to return empty list (no historical data)
```

### 349. `backend/tests/test_analytics_api.py`
- Bytes: `1160`
- Lines: `37`
- SHA256: `34af3b355998428eb3e087ddb663274c0e1cebb61b1bb05bd24ad74a3db35142`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import pytest
   4: @pytest.mark.asyncio
   5: async def test_variance_trend_endpoint(async_client, authenticated_headers):
   6:     response = await async_client.get(
   7:         "/api/variance/trend", headers=authenticated_headers, params={"days": 7}
   8:     )
  10:     assert response.status_code == 200
  11:     data = response.json()
```

### 350. `backend/tests/test_analytics_service.py`
- Bytes: `2846`
- Lines: `90`
- SHA256: `d462b8f320e708ee4271ca188a0410b2fe9c99f036780cabbb7e1c3082a6373d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `mock_db`
- Excerpt (first non-empty lines):

```text
   1: from unittest.mock import AsyncMock, MagicMock
   3: import pytest
   5: from backend.services.analytics_service import AnalyticsService
   8: @pytest.fixture
   9: def mock_db():
  10:     db = MagicMock()
  11:     db.verification_logs = MagicMock()
  12:     db.erp_items = MagicMock()
```

### 351. `backend/tests/test_api_warehouses_manual.py`
- Bytes: `2946`
- Lines: `99`
- SHA256: `5d7b184aba73213a88b4cd941a364916433adbf51e5ec3131ae27c5421ca4916`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `register_and_login`
  - `test_get_warehouses`
- Excerpt (first non-empty lines):

```text
   1: import time
   3: import requests  # type: ignore
   5: BASE_URL = "http://localhost:8001"
   8: def register_and_login():
   9:     print("Registering staff1...")
  10:     register_data = {
  11:         "username": "staff1",
  12:         "password": "password123",
```

### 352. `backend/tests/test_app_composition_snapshot.py`
- Bytes: `3247`
- Lines: `104`
- SHA256: `c684bbb238d00091ab54947e388833162dc5d99c614889065160772a4fdbe7d7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_load_snapshot`
  - `_collect_runtime_snapshot`
  - `test_app_middleware_order_matches_baseline`
  - `test_app_route_inventory_matches_baseline`
  - `test_critical_routes_are_present`
- Excerpt (first non-empty lines):

```text
   1: """App composition snapshot tests for refactor safety.
   3: These tests guard route inventory and middleware order so refactors can
   4: mechanically move code without accidentally changing externally visible behavior.
   5: """
   7: from __future__ import annotations
   9: import json
  10: from pathlib import Path
  12: from fastapi import FastAPI
```

### 353. `backend/tests/test_architecture.py`
- Bytes: `3203`
- Lines: `102`
- SHA256: `817d5c0c0bea597464d05f6177261389f276f39d4ee7ceccc40c680a117c0541`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `test_mongodb_handles_all_writes`
  - `test_no_sql_server_writes_in_server`
  - `test_erp_sync_reads_from_sql_writes_to_mongo`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Test architecture - Verify SQL Server is read-only and MongoDB handles all writes
   3: """
   5: import re
   6: from pathlib import Path
   8: import pytest
  11: def test_mongodb_handles_all_writes():
  12:     """Verify MongoDB is used for all write operations"""
```

### 354. `backend/tests/test_async_utils.py`
- Bytes: `7296`
- Lines: `262`
- SHA256: `9f2806321b05153f91930073afa86ed97caae78d3f9496feed7aec4e7565ae36`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Updated test file for AsyncUtils refactor
   2: import pytest
   3: import asyncio
   4: from unittest.mock import AsyncMock
   5: from backend.utils.async_utils import (
   6:     AsyncExecutor,
   7:     AsyncCache,
   8:     with_async_executor,
```

### 355. `backend/tests/test_auth.py`
- Bytes: `3294`
- Lines: `109`
- SHA256: `47cb0182b783ff7dde5ddf432aef67fea03b7841b85d39ce1e875d300b084046`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `fake_environment`
  - `client`
  - `test_user`
  - `TestLogin`
  - `test_login_success`
  - `test_login_invalid_credentials`
  - `test_login_missing_fields`
  - `TestRegister`
  - `test_register_success`
  - `test_register_duplicate_username`
  - `test_register_missing_fields`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Tests for Authentication endpoints
   3: """
   5: import pytest
   6: from fastapi.testclient import TestClient
   7: from backend.server import app
   9: from backend.tests.utils.in_memory_db import setup_server_with_in_memory_db
  12: @pytest.fixture
```

### 356. `backend/tests/test_auth_path.py`
- Bytes: `771`
- Lines: `24`
- SHA256: `5de02dd7ba0cab99cc1b0661be3f5e4e478a82f452ff5c71f5c34e0097b0d5ad`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: from httpx import AsyncClient
   5: @pytest.mark.asyncio
   6: async def test_auth_paths(async_client: AsyncClient):
   7:     # Try /auth/login
   8:     response = await async_client.post(
   9:         "/auth/login", json={"username": "test", "password": "password"}
  10:     )
```

### 357. `backend/tests/test_auth_pin.py`
- Bytes: `1275`
- Lines: `41`
- SHA256: `9763fabcb2f52da00364ac9a6b9a2dea4a0f37f46e5627eac7b7b8afba58e5ed`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import pytest  # type: ignore
   2: from httpx import AsyncClient  # type: ignore
   5: @pytest.mark.asyncio
   6: async def test_pin_login_success(async_client: AsyncClient):
   7:     """
   8:     Verify 'staff1' login with CORRECT PIN '1234'.
   9:     """
  10:     payload = {"username": "staff1", "pin": "1234", "device_id": "test_device_001"}
```

### 358. `backend/tests/test_auth_utils.py`
- Bytes: `7511`
- Lines: `224`
- SHA256: `c41241b49b8784e3dedcbb0c5f593bc0dcad139afaa28e1db78116ece04533f1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `TestPasswordHashing`
  - `test_verify_password_correct`
  - `test_verify_password_incorrect`
  - `test_hash_password_returns_string`
  - `test_different_hashes_for_same_password`
  - `TestJWTUtilities`
  - `test_create_access_token`
  - `test_create_access_token_with_expiry`
  - `TestResultType`
  - `test_result_success`
  - `test_result_error`
  - `test_result_unwrap_or`
  - `test_result_map`
  - `test_result_and_then`
  - `test_result_match`
- Excerpt (first non-empty lines):

```text
   1: """Tests for auth utilities and result types"""
   3: import pytest
   4: from datetime import timedelta
   7: class TestPasswordHashing:
   8:     """Test password hashing functions"""
  10:     def test_verify_password_correct(self):
  11:         """Test verifying a correct password"""
  12:         from utils.auth_utils import get_password_hash, verify_password
```

### 359. `backend/tests/test_auto_diagnosis.py`
- Bytes: `6501`
- Lines: `163`
- SHA256: `b842eac7c8c8c137bb0ac63b5bc7418052f5ff97324545312bb463841604aafe`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `auto_diagnosis_service`
- Excerpt (first non-empty lines):

```text
   1: from unittest.mock import Mock
   3: import pytest
   5: from backend.services.auto_diagnosis import AutoDiagnosisService, ErrorCategory, ErrorSeverity
   6: from backend.utils.result_types import Result
   9: @pytest.fixture
  10: def auto_diagnosis_service():
  11:     return AutoDiagnosisService()
  14: @pytest.mark.asyncio
```

### 360. `backend/tests/test_barcode_validation.py`
- Bytes: `3067`
- Lines: `82`
- SHA256: `d33d876767b0630e00dc310fecf608d9baa9526a7141ac9d1fc96843c4211c47`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `override_auth`
  - `test_invalid_barcodes`
- Excerpt (first non-empty lines):

```text
   1: from unittest.mock import AsyncMock, MagicMock
   3: import pytest
   4: from fastapi.testclient import TestClient
   6: from backend.api import enhanced_item_api, erp_api
   7: from backend.auth.dependencies import get_current_user, get_current_user_async
   8: from backend.server import app
  10: client = TestClient(app)
  12: # Mock dependencies to avoid 503 and AttributeError
```

### 361. `backend/tests/test_basic.py`
- Bytes: `1164`
- Lines: `50`
- SHA256: `e4adf15cf1ef30701f06ae986bc148c036c146b6c0009bbca21f48a257925588`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `test_imports`
  - `test_pydantic_models`
  - `TestModel`
  - `test_environment_variables`
  - `test_math_operations`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Basic tests for backend functionality
   3: """
   5: from typing import Optional
   7: import pytest
  10: def test_imports():
  11:     """Test that core modules can be imported"""
  12:     from backend.config import settings
```

### 362. `backend/tests/test_batch_operations.py`
- Bytes: `13118`
- Lines: `381`
- SHA256: `5f9e5f3c77ef90d705e3d3d5f840d24d0e21ae503ff3a23235f1018d4e2ff378`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `mock_db`
  - `get_collection`
  - `batch_service`
  - `TestBatchInsert`
  - `TestBatchUpdate`
  - `TestBatchDelete`
  - `TestBatchImportItems`
  - `TestBatchServiceConfiguration`
  - `test_batch_size_default`
  - `test_custom_batch_size`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Tests for Batch Operations Service
   3: Verifies batch processing functionality and error handling
   4: """
   6: from unittest.mock import AsyncMock, Mock
   8: import pytest
   9: from motor.motor_asyncio import AsyncIOMotorDatabase
  10: from pymongo.errors import PyMongoError
```

### 363. `backend/tests/test_comprehensive.py`
- Bytes: `9539`
- Lines: `298`
- SHA256: `1f396f6a8abad0e63b1943102bc758162f694e72454e11b7c1dc71b202cc3e8f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AsyncIterator`
  - `__init__`
  - `__aiter__`
  - `mock_db`
  - `override_server_db`
  - `mock_supervisor`
  - `mock_staff`
  - `test_no_sql_writes_in_codebase`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Comprehensive Integration Tests
   3: Tests all implementations including stock verification, activity logs, error logs, help feature
   4: """
   6: import re
   7: from datetime import datetime, timezone
   8: from pathlib import Path
   9: from unittest.mock import AsyncMock, MagicMock, patch
```

### 364. `backend/tests/test_count_lines_api.py`
- Bytes: `21622`
- Lines: `560`
- SHA256: `d4950c1b6688d12ad6ec30f1d866914a3ef12eaf40807260b34d748c0b14e368`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `reset_globals`
  - `TestCountLinesAPIHelpers`
  - `test_detect_risk_flags_large_variance`
  - `test_detect_risk_flags_mrp_reduced`
  - `test_detect_risk_flags_high_value_variance`
  - `test_detect_risk_flags_serial_missing_high_value`
  - `test_detect_risk_flags_missing_correction_reason`
  - `test_detect_risk_flags_mrp_change_without_reason`
  - `test_detect_risk_flags_photo_required_missing`
  - `test_detect_risk_flags_no_flags`
  - `test_calculate_financial_impact`
  - `test_calculate_financial_impact_negative`
  - `test_require_supervisor_valid_role`
  - `test_require_supervisor_admin_role`
  - `test_require_supervisor_invalid_role`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Comprehensive test suite for count_lines_api.py
   3: Target: Increase coverage from 18% to 85%
   4: """
   6: from unittest.mock import AsyncMock, Mock, patch
   8: import pytest
   9: from fastapi import HTTPException
  11: from backend.api.count_lines_api import (
```

### 365. `backend/tests/test_count_state_machine.py`
- Bytes: `8585`
- Lines: `283`
- SHA256: `ae5f4bbcf5b7a7a281a61c3a71c9ae494c11176217f6e1ab64061c6c23bf99f5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `MockDB`
  - `__init__`
  - `MockCollection`
  - `__init__`
  - `test_can_transition_draft_to_submitted_staff`
  - `test_can_transition_draft_to_submitted_supervisor`
  - `test_cannot_transition_draft_to_approved`
  - `test_can_transition_pending_to_approved_supervisor`
  - `test_cannot_transition_pending_to_approved_staff`
  - `test_can_transition_approved_to_locked_admin`
  - `test_cannot_transition_approved_to_locked_supervisor`
  - `test_cannot_transition_from_locked`
  - `test_get_allowed_transitions_staff_draft`
  - `test_get_allowed_transitions_supervisor_pending`
  - `test_can_edit_draft_staff_owner`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Unit tests for CountLineStateMachine
   3: """
   5: import pytest
   6: from backend.services.count_state_machine import (
   7:     CountLineStateMachine,
   8:     StateTransition,
   9:     EditPermission,
```

### 366. `backend/tests/test_coverage_final.py`
- Bytes: `10039`
- Lines: `318`
- SHA256: `d0292fae2c0f6255e9f6bc7343313846937d8d4e2b83204e320dd4062c8b663f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `test_result_initialization_errors`
  - `test_result_fail_with_context`
  - `test_result_from_callable_generic_exception`
  - `raise_type_error`
  - `test_result_map_exceptions`
  - `map_fail`
  - `map_err_fail`
  - `test_result_chaining_exceptions`
  - `and_then_fail`
  - `or_else_fail`
  - `test_result_match`
  - `test_result_log_error`
  - `test_result_handle_result_weird_state`
  - `test_result_handle_result_mapped_errors`
  - `AuthenticationError`
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: import os
   3: from unittest.mock import MagicMock, patch
   4: from fastapi import HTTPException
   5: from backend.utils.result import (
   6:     Result,
   7:     handle_result,
   8:     result_to_response as result_decorator,
```

### 367. `backend/tests/test_coverage_improvements.py`
- Bytes: `15960`
- Lines: `525`
- SHA256: `897a79e0f347894660897834365eb83da4f816cc3dc0c285bde9098f1f4670d7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `test_auth_utils_verify_password_empty`
  - `test_auth_utils_verify_password_long_truncation`
  - `test_auth_utils_get_password_hash_empty`
  - `test_auth_utils_verify_bcrypt_fallback_direct`
  - `test_auth_utils_verify_password_fallback_trigger`
  - `test_sanitize_for_logging`
  - `test_create_safe_error_response`
  - `test_handle_result_exceptions`
  - `test_handle_result_unknown_error`
  - `test_handle_result_no_error_attribute`
  - `test_result_map_error`
  - `test_result_or_else`
  - `test_result_properties_and_repr`
  - `test_result_context_manager`
  - `test_result_map`
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: from unittest.mock import patch, MagicMock, AsyncMock
   3: from fastapi import HTTPException
   5: from backend.utils.auth_utils import (
   6:     verify_password,
   7:     get_password_hash,
   8:     _verify_bcrypt_fallback,
   9: )
```

### 368. `backend/tests/test_coverage_part2.py`
- Bytes: `8306`
- Lines: `252`
- SHA256: `11127e4d6ff9075d09fc2296337069e34c8beac971fd0bb2566e9e93274ba817`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `test_result_methods_comprehensive`
  - `test_result_context_manager`
  - `test_either_methods`
  - `test_result_function_decorator`
  - `div`
  - `test_auth_utils_production_init`
  - `test_result_internal_handle_result`
  - `test_create_access_token`
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: import os
   3: import importlib
   4: from datetime import timedelta
   5: from unittest.mock import patch
   6: from fastapi import HTTPException
   7: from backend.utils.result import Result, Either, result_function, UnwrapError
   8: from backend.utils.result import handle_result as result_handle_result
```

### 369. `backend/tests/test_db_connection.py`
- Bytes: `7629`
- Lines: `185`
- SHA256: `d0f37793fcdd38912f4297bcecbe4387e4fff871db6531dcdd26322049c6636b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `TestSQLServerConnectionBuilder`
  - `mock_pyodbc_drivers`
  - `mock_pyodbc_connect`
  - `test_get_available_driver_preferred`
  - `test_get_available_driver_fallback`
  - `test_get_available_driver_generic_sql`
  - `test_get_available_driver_none`
  - `test_get_available_driver_exception`
  - `test_build_connection_string_success`
  - `test_build_connection_string_windows_auth`
  - `test_build_connection_string_with_port`
  - `test_build_connection_string_no_driver`
  - `test_create_optimized_connection`
  - `test_create_optimized_connection_optimization_fail`
  - `test_test_connection_success`
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: from unittest.mock import patch, MagicMock
   3: from backend.utils.db_connection import SQLServerConnectionBuilder, ConnectionStringOptimizer
   6: class TestSQLServerConnectionBuilder:
   7:     @pytest.fixture
   8:     def mock_pyodbc_drivers(self):
   9:         with patch("pyodbc.drivers") as mock:
  10:             yield mock
```

### 370. `backend/tests/test_enhanced_connection_pool.py`
- Bytes: `7840`
- Lines: `213`
- SHA256: `f23b901deb082f6a7a03a7b315deda5a67250d454cd2f202647089484c17ec91`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `TestEnhancedConnectionPool`
  - `pool_config`
  - `mock_connection`
  - `test_connection_creation_with_retry`
  - `test_connection_retry_exhausted`
  - `test_health_check`
  - `test_metrics_collection`
  - `test_connection_pooling`
  - `test_connection_validation`
  - `test_health_status_tracking`
  - `test_connection_timeout`
  - `test_metrics_initialization`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Test Enhanced Connection Pool
   3: Tests for retry logic, health monitoring, and metrics
   4: """
   6: from unittest.mock import Mock, patch
   8: import pytest
  10: from backend.services.enhanced_connection_pool import (
  11:     ConnectionMetrics,
```

### 371. `backend/tests/test_enhanced_item_search.py`
- Bytes: `3670`
- Lines: `106`
- SHA256: `2fe27318bc7027d388d34abc64226d8e47e07ef1a061a2f45ae6418c6ab7505d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `client`
  - `test_search_includes_item_code_and_barcode`
  - `mock_aggregate_func`
- Excerpt (first non-empty lines):

```text
   1: from unittest.mock import MagicMock
   3: import pytest
   4: from fastapi.testclient import TestClient
   6: import backend.server as server_module
   7: from backend.api.enhanced_item_api import init_enhanced_api
   8: from backend.auth.dependencies import get_current_user_async
   9: from backend.server import app
  10: from backend.tests.utils.in_memory_db import setup_server_with_in_memory_db
```

### 372. `backend/tests/test_enterprise_stabilization.py`
- Bytes: `4353`
- Lines: `133`
- SHA256: `23a0e1871bafd93f84898d42799840530ac714d08e2e961c5abe5d5b7e2e43c5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `fake_environment`
  - `client`
  - `get_token`
  - `clear_sessions`
  - `test_single_session_enforcement`
  - `test_sql_verification_logic_enforcement`
  - `test_sql_down_behavior_blocked`
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: from fastapi.testclient import TestClient
   3: from backend.server import app
   4: from backend.tests.utils.in_memory_db import setup_server_with_in_memory_db
   5: from backend.config import settings
   8: @pytest.fixture
   9: def fake_environment(monkeypatch):
  10:     """Provide an isolated in-memory database."""
```

### 373. `backend/tests/test_erp_mapping.py`
- Bytes: `1715`
- Lines: `53`
- SHA256: `586fc0c1b0b2a2d5d8c69a9c09f3bdb58b0ee3eb6aa0b7d9d669e59cbdb06a13`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `test_map_erp_item_to_schema_with_manual_barcode`
  - `test_map_erp_item_to_schema_without_manual_barcode`
- Excerpt (first non-empty lines):

```text
   1: from backend.utils.erp_utils import _map_erp_item_to_schema
   4: def test_map_erp_item_to_schema_with_manual_barcode():
   5:     """Test mapping ERP item with manual barcode"""
   6:     erp_item = {
   7:         "item_code": "TEST001",
   8:         "item_name": "Test Item",
   9:         "barcode": "AUTO123",
  10:         "manual_barcode": "MANUAL123",
```

### 374. `backend/tests/test_erp_sync_service.py`
- Bytes: `12583`
- Lines: `375`
- SHA256: `136f9440a54d541ad7cf7af7cb673b01943d56dafe9a9dc98a554908e1dd6799`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AsyncIterator`
  - `__init__`
  - `__aiter__`
  - `mock_sql_connector`
  - `mock_mongo_db`
  - `sync_service`
  - `TestSQLSyncService`
  - `test_get_stats_returns_sync_statistics`
  - `test_set_interval_updates_sync_interval`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Tests for ERP Sync Service (Refactored)
   3: Tests the modular sync flow with proper exception handling
   4: """
   6: from unittest.mock import AsyncMock, Mock, patch
   8: import pytest
   9: from motor.motor_asyncio import AsyncIOMotorDatabase
  11: from backend.exceptions import SQLServerConnectionError
```

### 375. `backend/tests/test_erp_utils.py`
- Bytes: `7994`
- Lines: `250`
- SHA256: `8f4d792723769dd9ed3d12d0522a5a6058329339124bc038eaafc741ff0d6a07`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `test_safe_float`
  - `test_safe_str`
  - `test_safe_optional_str`
  - `test_safe_date_str`
  - `Unprintable`
  - `__str__`
  - `test_get_barcode_variations`
  - `test_map_erp_item_to_schema`
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: from unittest.mock import MagicMock, AsyncMock
   3: from datetime import datetime, date
   4: from backend.utils.erp_utils import (
   5:     _safe_float,
   6:     _safe_str,
   7:     _safe_optional_str,
   8:     _safe_date_str,
```

### 376. `backend/tests/test_error_handler_with_diagnosis.py`
- Bytes: `9090`
- Lines: `279`
- SHA256: `f94a46f9cfe5c05b782691a7a84ac61d458e533e533cdeb47a7ad6c4b8d632c8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `MockDiagnosis`
  - `__init__`
  - `to_dict`
  - `mock_diagnosis_service`
  - `test_with_auto_diagnosis_sync_success`
  - `success_func`
  - `test_with_auto_diagnosis_sync_error`
  - `fail_func`
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: from unittest.mock import patch, MagicMock, AsyncMock
   3: from backend.utils.error_handler_with_diagnosis import (
   4:     with_auto_diagnosis,
   5:     diagnose_and_handle,
   6:     SelfDiagnosingErrorHandler,
   7: )
   8: from backend.utils.result_types import Result
```

### 377. `backend/tests/test_error_logging.py`
- Bytes: `2305`
- Lines: `83`
- SHA256: `5bd29bbc03091ef5d61eff378c0ee18d0075118d3b8194e30202f9119712b524`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: """
   2: Tests for error logging feature
   3: """
   5: from datetime import datetime
   7: import pytest
   9: from backend.services.error_log import ErrorLogService
  12: @pytest.mark.asyncio
  13: async def test_error_log_service_writes_document(test_db):
```

### 378. `backend/tests/test_exceptions.py`
- Bytes: `6652`
- Lines: `213`
- SHA256: `bfe531911be612241b1c1d111dc1bf3e6a49210f45199fb1cffa04912a09bb03`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `TestStockVerifyException`
  - `test_base_exception_creation`
  - `test_base_exception_with_details`
  - `test_to_dict_conversion`
  - `TestDatabaseConnectionError`
  - `test_database_connection_error`
  - `test_sql_server_connection_error`
  - `test_mongodb_connection_error`
  - `TestSyncError`
  - `test_sync_error_creation`
  - `TestItemNotFoundError`
  - `test_item_not_found_error`
  - `TestValidationError`
  - `test_validation_error`
  - `TestAuthenticationError`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Tests for Custom Exception Classes
   3: Verifies exception structure and error handling
   4: """
   6: from backend.exceptions import (
   7:     AuthenticationError,
   8:     AuthorizationError,
   9:     DatabaseConnectionError,
```

### 379. `backend/tests/test_floor_selection.py`
- Bytes: `2776`
- Lines: `90`
- SHA256: `1ff8dce3ee82cd223be9be20df9ee737380618d788b60456ee51199cf32479d5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `mock_db`
  - `override_server_db`
  - `mock_current_user`
- Excerpt (first non-empty lines):

```text
   1: from unittest.mock import AsyncMock, MagicMock
   3: import pytest
   5: from backend.api.schemas import CountLineCreate
   8: @pytest.fixture
   9: def mock_db():
  10:     """Mock MongoDB database"""
  11:     db = MagicMock()
  12:     db.sessions = MagicMock()
```

### 380. `backend/tests/test_governance.py`
- Bytes: `5564`
- Lines: `145`
- SHA256: `9d3c17a41e836edca78b1a833f35f2fbc00cbb87b5dcf53b9802e47e46554fa1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `TestGovernance`
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: from datetime import datetime, timezone
   5: @pytest.mark.asyncio
   6: class TestGovernance:
   7:     async def test_config_immutability(self, async_client, test_db, authenticated_headers):
   8:         """
   9:         Verify that updating settings creates an immutable config version.
  10:         """
```

### 381. `backend/tests/test_governance_contracts.py`
- Bytes: `6892`
- Lines: `195`
- SHA256: `c08693c984be956e795b00aa0d740b982d4dd3aed4709b090e3340edfba30947`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `get_python_files`
  - `check_for_forbidden_writes`
  - `log_failure`
  - `test_forbidden_writes_contract`
  - `test_sql_read_only_contract`
- Excerpt (first non-empty lines):

```text
   1: import ast
   2: import os
   3: import pytest
   4: from unittest.mock import AsyncMock, MagicMock, patch
   5: from fastapi import HTTPException
   7: # ==============================================================================
   8: # 1. FORBIDDEN WRITES CONTRACT (Static Analysis)
   9: # ==============================================================================
```

### 382. `backend/tests/test_integration.py`
- Bytes: `8583`
- Lines: `244`
- SHA256: `04f0b22518ebecb9f0319a2d418a758f8586df4cd8c0212306fb039ee3c74a6c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `TestAuthenticationWorkflow`
  - `TestSessionWorkflow`
  - `TestCountLineWorkflow`
  - `TestERPItemsWorkflow`
  - `TestHealthAndStatus`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Simplified Integration Tests for Stock Verification System
   3: Tests actual workflows: ERP sync, count lines, sessions, verification
   4: """
   6: import logging
   7: import random
   9: import pytest
  10: import pytest_asyncio
```

### 383. `backend/tests/test_items.py`
- Bytes: `5094`
- Lines: `152`
- SHA256: `b93268e259605b2d23f18a2eded80faaa5424a75dbd6d4b0a36bed5300bb25b4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `fake_environment`
  - `client`
  - `auth_token`
  - `TestGetItems`
  - `test_get_all_items_authenticated`
  - `test_get_all_items_unauthenticated`
  - `test_search_items`
  - `test_legacy_search_endpoint`
  - `TestGetItemByBarcode`
  - `test_get_item_by_barcode_success`
  - `test_refresh_stock`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Tests for Item endpoints
   3: """
   5: import pytest
   6: from fastapi.testclient import TestClient
   7: from server import app
   9: from backend.tests.utils.in_memory_db import setup_server_with_in_memory_db
  12: @pytest.fixture
```

### 384. `backend/tests/test_locations_api.py`
- Bytes: `1888`
- Lines: `58`
- SHA256: `d132589e27b7e35bca880b4617a283e186ccc50b4d566ccf9fbf8d7c7c112962`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: from httpx import AsyncClient
   5: @pytest.mark.asyncio
   6: async def test_get_warehouses_success(async_client: AsyncClient, authenticated_headers: dict):
   7:     """
   8:     Verify [GET] /api/locations/warehouses returns 200 and a non-empty list.
   9:     """
  10:     response = await async_client.get("/api/locations/warehouses", headers=authenticated_headers)
```

### 385. `backend/tests/test_notification_service.py`
- Bytes: `9470`
- Lines: `347`
- SHA256: `d5faced269fc9a878634935b16c04164f93c0f6ee51d8fcad0213919fc918e6b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `MockDB`
  - `__init__`
  - `MockCollection`
  - `__init__`
  - `find`
  - `sort`
  - `limit`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Unit tests for NotificationService
   3: """
   5: import pytest
   6: from backend.services.notification_service import (
   7:     NotificationService,
   8:     NotificationType,
   9:     NotificationPriority,
```

### 386. `backend/tests/test_offline_sync.py`
- Bytes: `2814`
- Lines: `87`
- SHA256: `5a6e38407e69fab68bd90a5559666d9ed355b27a8b416e033513a7fb400862cb`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: from httpx import AsyncClient
   3: import uuid
   6: @pytest.mark.asyncio
   7: async def test_modern_batch_sync_success(async_client: AsyncClient, authenticated_headers):
   8:     """Test modern batch sync with valid records"""
   9:     session_id = str(uuid.uuid4())
  10:     client_record_id = "rec_" + str(uuid.uuid4())
```

### 387. `backend/tests/test_performance.py`
- Bytes: `5888`
- Lines: `172`
- SHA256: `2260ee89a6253ba880ff0dafd35d987ffe33f25f86d21dc0adf1a0ed7f0c7d87`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PerformanceMetric`
  - `PerformanceBenchmark`
  - `__init__`
  - `record_metric`
  - `benchmark`
  - `TestAPIPerformance`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Simplified Performance Tests for Stock Verification System
   3: Tests performance of actual workflows: auth, sessions, search
   4: """
   6: import asyncio
   7: import logging
   8: import random
   9: import time
```

### 388. `backend/tests/test_pi_api.py`
- Bytes: `2223`
- Lines: `70`
- SHA256: `1de23dd47406bc12eeb34d9147f926f9f0b9911fbaeb3ca6eefe5441adc345e7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `get_mock_admin`
  - `get_mock_staff`
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: import respx
   3: from fastapi.testclient import TestClient
   4: from backend.server import app
   5: from backend.auth.dependencies import get_current_user
   6: from backend.config import settings
   9: # Mock user for testing
  10: def get_mock_admin():
```

### 389. `backend/tests/test_pin_auth.py`
- Bytes: `4838`
- Lines: `142`
- SHA256: `79c9c3d1b7480f4ceeb123244368cc657c0de5b9f36b9b03008b0ff5168b3f57`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `fake_environment`
  - `client`
  - `test_user`
  - `auth_token`
  - `TestPinAuth`
  - `test_change_pin_success`
  - `test_change_pin_invalid_format`
  - `test_login_with_pin_success`
  - `test_login_with_invalid_pin`
  - `test_login_pin_user_not_found`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Tests for PIN Authentication endpoints
   3: """
   5: import pytest
   6: from fastapi.testclient import TestClient
   7: from backend.server import app
   9: from backend.tests.utils.in_memory_db import setup_server_with_in_memory_db
  12: @pytest.fixture
```

### 390. `backend/tests/test_pin_login_manual.py`
- Bytes: `1921`
- Lines: `65`
- SHA256: `82031c901badfa29ff394f03c6778a92331f287e8adf6fb0e417ae34804317fd`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import logging
   3: import os
   4: import sys
   6: # Add project root to path
   7: sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
   9: from motor.motor_asyncio import AsyncIOMotorClient
  11: from backend.config import settings
```

### 391. `backend/tests/test_queries.json`
- Bytes: `687`
- Lines: `23`
- SHA256: `4e16285800a4ccc63ace362fa315e7f6e0ca04d68ea8c017d1ba8f48f588a611`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: [
   2:   {
   3:     "query": "What is the stock count for item 12345?",
   4:     "expected_response": "The stock count for item 12345 is 50."
   5:   },
   6:   {
   7:     "query": "List all items with low stock levels.",
   8:     "expected_response": "Items with low stock levels: Item 67890 (5 units), Item 54321 (2 units)."
```

### 392. `backend/tests/test_result.py`
- Bytes: `6966`
- Lines: `222`
- SHA256: `78b6df3318126d394d5e27b3c9b8e41db51ad4bb01124a08511ad02dc44d3f99`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `CustomError`
  - `TestResult`
  - `test_ok_creation`
  - `test_fail_creation`
  - `test_unwrap_or`
  - `test_map_success`
  - `test_map_failure`
  - `test_map_preserves_error`
  - `test_and_then_success`
  - `safe_divide`
  - `test_and_then_failure`
  - `fail_if_positive`
  - `test_or_else`
  - `test_match`
  - `handle`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Comprehensive test suite for the Result type implementation.
   3: """
   5: import pytest
   7: from backend.utils.result import Fail, Left, Ok, Result, Right, UnwrapError, result_function
  10: # Test data
  11: class CustomError(Exception):
  12:     """Custom error type for testing."""
```

### 393. `backend/tests/test_routes_check.py`
- Bytes: `491`
- Lines: `20`
- SHA256: `5517148f0b3e7d507395efaf09bfd6604f3731db514ca61f2278f54fcc05b5b6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: from httpx import AsyncClient
   5: @pytest.mark.asyncio
   6: async def test_check_available_routes(async_client: AsyncClient, test_db):
   7:     """Check what routes are available"""
   9:     # Try different item endpoints
  10:     endpoints_to_test = [
  11:         "/api/items/",
```

### 394. `backend/tests/test_search_api.py`
- Bytes: `2115`
- Lines: `72`
- SHA256: `b3345d918bd5b046bd4543eae6638efde070047d0f1b5701cab67a47b82b4e89`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `client`
  - `mock_user`
  - `test_search_optimized_api`
  - `test_search_api_missing_query`
- Excerpt (first non-empty lines):

```text
   1: from unittest.mock import AsyncMock, MagicMock, patch
   3: import pytest
   4: from fastapi.testclient import TestClient
   6: from backend.auth.dependencies import get_current_user_async
   7: from backend.server import app
   8: from backend.services.search_service import SearchResponse, SearchResult
  11: @pytest.fixture
  12: def client():
```

### 395. `backend/tests/test_search_service.py`
- Bytes: `3255`
- Lines: `112`
- SHA256: `6ccf68256aac0e7a7ebc8d515293b0e7f99587bbf35a32a578a66a1baf7db8ef`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `mock_db`
  - `search_service`
- Excerpt (first non-empty lines):

```text
   1: from unittest.mock import AsyncMock, MagicMock
   3: import pytest
   5: from backend.services.search_service import SearchService
   8: @pytest.fixture
   9: def mock_db():
  10:     db = MagicMock()
  11:     db.erp_items = MagicMock()
  12:     return db
```

### 396. `backend/tests/test_security_headers.py`
- Bytes: `5556`
- Lines: `151`
- SHA256: `f354e3fa5f53c1b32bbc6c795dd99b11e06a247d497159d09618e9b19566680e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `test_app`
  - `client_with_security_headers`
  - `client_with_strict_csp`
  - `TestSecurityHeadersMiddleware`
  - `test_security_headers_present`
  - `test_x_frame_options_deny`
  - `test_x_content_type_options_nosniff`
  - `test_content_security_policy_default`
  - `test_content_security_policy_strict`
  - `test_referrer_policy`
  - `test_permissions_policy`
  - `test_dangerous_headers_removed`
  - `test_hsts_only_for_https`
  - `test_cross_origin_headers`
  - `test_custom_options`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Tests for Security Headers Middleware
   3: Verifies OWASP security headers are properly applied
   4: """
   6: import pytest
   7: from fastapi import FastAPI
   8: from fastapi.testclient import TestClient
  10: from backend.middleware.security_headers import SecurityHeadersMiddleware
```

### 397. `backend/tests/test_sentry.py`
- Bytes: `4641`
- Lines: `136`
- SHA256: `a109ea7840d5ab49522149095238fbb6b0937b165cf55ccc7d97bba9e9fad155`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `TestSentryConfiguration`
  - `test_sentry_dsn_can_be_none`
  - `test_sentry_dsn_accepts_valid_url`
  - `test_sentry_environment_default`
  - `test_sentry_traces_sample_rate_default`
  - `test_sentry_traces_sample_rate_custom`
  - `test_sentry_profiles_sample_rate_default`
  - `TestSentryInitialization`
  - `test_sentry_init_not_called_without_dsn`
  - `test_sentry_init_called_with_dsn`
  - `TestSentryErrorCapture`
  - `test_capture_exception`
  - `test_capture_message`
  - `test_set_tags`
  - `TestSentryContext`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Tests for Sentry integration configuration
   3: Verifies that Sentry is properly configured for error tracking
   4: """
   6: from unittest.mock import patch
   9: class TestSentryConfiguration:
  10:     """Tests for Sentry configuration settings"""
  12:     def test_sentry_dsn_can_be_none(self):
```

### 398. `backend/tests/test_sessions_api.py`
- Bytes: `3543`
- Lines: `103`
- SHA256: `ac46f657b9fbb5f3ed21d2e02975f8bdfe6f78e4f3f095922ab3eb50677c7a40`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `test_user`
- Excerpt (first non-empty lines):

```text
   1: import pytest
   4: @pytest.fixture
   5: def test_user():
   6:     return {"username": "staff1", "role": "staff"}
   9: @pytest.mark.asyncio
  10: async def test_get_sessions_endpoint(async_client, authenticated_headers, test_user):
  11:     """Test GET /api/sessions returns list of sessions"""
  12:     # Create a session first (if not exists)
```

### 399. `backend/tests/test_simple.py`
- Bytes: `398`
- Lines: `13`
- SHA256: `19b1ae9009281fff91b825b15ab931d590b4092e16266161ea343016c1116e21`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: from httpx import ASGITransport, AsyncClient
   4: from backend.server import app
   7: @pytest.mark.asyncio
   8: async def test_root(test_db):
   9:     async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
  10:         response = await client.get("/health")
  11:         # Health endpoint might redirect (307) or return 200
```

### 400. `backend/tests/test_sql_readonly.py`
- Bytes: `4075`
- Lines: `127`
- SHA256: `58a0cbdadead80b6050265c86cdc5c181474deacf92e0631a587af14ea420391`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `test_sql_server_connector_readonly`
  - `test_sql_server_methods_readonly`
  - `test_all_sql_queries_select_only`
  - `test_runtime_readonly_guard_blocks_writes_and_multi_statement`
  - `test_parameterization_required_for_bound_params`
  - `test_get_item_quantity_template_is_parameterized`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Test to verify SQL Server is read-only (no write operations)
   3: """
   5: import re
   6: from pathlib import Path
   8: import pytest
  10: from backend.sql_server_connector import ERPQueryParameterError, ERPReadOnlyViolation, SQLServerConnector
  13: def test_sql_server_connector_readonly():
```

### 401. `backend/tests/test_stock_verification.py`
- Bytes: `6081`
- Lines: `181`
- SHA256: `d34b7b7971c08eff87a1978b8907b4a13cc78c8d0112649b20b35ffb26ab7d79`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `mock_db`
  - `override_server_db`
  - `mock_current_user`
  - `mock_count_line`
  - `test_verification_fields_in_count_line_creation`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Test Stock Verification Feature
   3: """
   5: from datetime import datetime, timezone
   6: from pathlib import Path
   7: from unittest.mock import AsyncMock, MagicMock, patch
   9: import pytest
  10: from fastapi import HTTPException
```

### 402. `backend/tests/test_sync.py`
- Bytes: `4580`
- Lines: `143`
- SHA256: `e294594e5dd2e4b2b0065a8057282e3765f99adb82eba14ab09799cad7e07288`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `fake_environment`
  - `client`
  - `supervisor_token`
  - `TestSyncEndpoints`
  - `test_trigger_erp_sync`
  - `test_trigger_change_sync`
  - `test_get_change_sync_stats`
  - `test_legacy_batch_sync_operations`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Tests for Sync endpoints
   3: """
   5: import pytest
   6: from fastapi.testclient import TestClient
   7: from server import app
   9: from backend.tests.utils.in_memory_db import setup_server_with_in_memory_db
  12: @pytest.fixture
```

### 403. `backend/tests/test_sync_service.py`
- Bytes: `4880`
- Lines: `164`
- SHA256: `fa0cfd84f44c71df374522d3c18c53bd88c1788fa38ad316657192da020f290f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `mock_object_id`
  - `db`
  - `service`
- Excerpt (first non-empty lines):

```text
   1: from unittest.mock import patch
   3: import pytest
   5: from backend.services.sync_conflicts_service import (
   6:     ConflictResolution,
   7:     ConflictStatus,
   8:     SyncConflictsService,
   9: )
  10: from backend.tests.utils.in_memory_db import InMemoryDatabase
```

### 404. `backend/tests/test_validation.py`
- Bytes: `9391`
- Lines: `289`
- SHA256: `69a6001d05026c14029ce1d06c4ed2518bb15f73fd0f7d144206d2500d4261c2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `test_validate_mongo_field_name_success`
  - `test_validate_mongo_field_name_empty`
  - `test_validate_mongo_field_name_operator`
  - `test_validate_mongo_field_name_pattern_caps`
  - `test_validate_mongo_field_name_length`
  - `test_validate_mongo_field_name_underscores`
  - `test_validate_mongo_field_name_start_underscore`
  - `test_validate_sql_identifier_success`
  - `test_validate_sql_identifier_empty`
  - `test_validate_sql_identifier_length`
  - `test_validate_sql_identifier_brackets`
  - `test_validate_sql_identifier_dangerous`
  - `test_validate_sql_identifier_pattern`
  - `test_sanitize_for_display`
  - `test_verify_insert_result_success`
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: from unittest.mock import MagicMock, AsyncMock
   3: from backend.utils.validation import (
   4:     validate_mongo_field_name,
   5:     validate_sql_identifier,
   6:     sanitize_for_display,
   7:     verify_insert_result,
   8:     verify_update_result,
```

### 405. `backend/tests/test_variance_service.py`
- Bytes: `6012`
- Lines: `202`
- SHA256: `88e99f09550dbdb12636d6462dfd8e226d610cb04e5dd61ddbc1d680f2c70cf2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `MockDB`
  - `__init__`
  - `MockCollection`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Unit tests for VarianceService
   3: """
   5: import pytest
   6: from backend.services.variance_service import VarianceService
   9: class MockDB:
  10:     """Mock database for testing"""
  12:     def __init__(self):
```

### 406. `backend/tests/test_verification.py`
- Bytes: `3235`
- Lines: `112`
- SHA256: `941a20bfcf048e28d999c14cbcd27e12d5926fa4e12a92c7549a43aeb9fc892e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import pytest
   2: from httpx import AsyncClient
   4: from backend.api.item_verification_api import init_verification_api
   7: @pytest.mark.asyncio
   8: async def test_verify_item_with_damage_types(
   9:     async_client: AsyncClient, test_db, authenticated_headers
  10: ):
  11:     # Ensure verification API is initialized with the test DB
```

### 407. `backend/tests/test_version_check.py`
- Bytes: `4520`
- Lines: `114`
- SHA256: `22cc0ff1d123883f2ff05b4cc45949f81407171ff830d91ccfc058069e28ea30`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `TestVersionParsing`
  - `test_parse_simple_version`
  - `test_parse_version_with_suffix`
  - `test_parse_short_version`
  - `test_parse_empty_version`
  - `test_parse_invalid_version`
  - `TestVersionComparison`
  - `test_client_up_to_date`
  - `test_client_needs_minor_update`
  - `test_client_needs_major_update`
  - `test_client_needs_patch_update`
  - `test_client_below_minimum_version`
  - `test_client_ahead_of_server`
  - `TestVersionCheckEndpoint`
- Excerpt (first non-empty lines):

```text
   1: """Tests for version checking functionality."""
   3: import pytest
   4: from httpx import ASGITransport, AsyncClient
   6: from backend.api.health import _compare_versions, _parse_version
   7: from backend.server import app
  10: class TestVersionParsing:
  11:     """Test version string parsing."""
  13:     def test_parse_simple_version(self):
```

### 408. `backend/tests/test_websocket_manager.py`
- Bytes: `1979`
- Lines: `75`
- SHA256: `0e877c9d691ebdb78b6b7eab42fd9c15543f1c41381716154ccdba7800883908`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `manager`
  - `mock_websocket`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Unit tests for WebSocket Manager (Core)
   3: """
   5: from unittest.mock import AsyncMock
   7: import pytest
   8: from fastapi import WebSocket
  10: from backend.core.websocket_manager import WebSocketManager
  13: @pytest.fixture
```

### 409. `backend/tests/test_websocket_service.py`
- Bytes: `2298`
- Lines: `88`
- SHA256: `3b8ec8ba401d1ba6acfc3b5fcfcdb66ac4ff268bf1562ee75aabbcbecfbb1805`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `manager`
  - `mock_websocket`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Unit tests for WebSocket Connection Manager
   3: """
   5: from unittest.mock import AsyncMock
   7: import pytest
   8: from fastapi import WebSocket
  10: from backend.services.websocket_service import ConnectionManager
  13: @pytest.fixture
```

### 410. `backend/tests/utils/in_memory_db.py`
- Bytes: `25911`
- Lines: `750`
- SHA256: `b0e680b3af9a5e37a55b10ee21584ca36ec3522141ff38ddc3586db86a5a2d52`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_normalize_value`
  - `_match_condition`
  - `_matches_exists_logic`
  - `_match_filter`
  - `_apply_update`
  - `InsertOneResult`
  - `UpdateResult`
  - `DeleteResult`
  - `InMemoryCursor`
  - `__init__`
  - `sort`
  - `skip`
  - `limit`
  - `batch_size`
  - `__aiter__`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Simple in-memory MongoDB substitute for backend unit tests.
   3: Provides async collection helpers that mimic the subset of Motor APIs our tests use.
   4: """
   6: from __future__ import annotations
   8: import copy
   9: import os
  10: from collections.abc import Iterable
```

### 411. `backend/tests/verify_integration_flow.py`
- Bytes: `2169`
- Lines: `74`
- SHA256: `13e66fb61d7c31144a821c55c7fd9f6044ea44766ecd97e2b452cb418653e34a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import os
   3: import sys
   5: import httpx
   7: # Add backend to path
   8: sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
  10: from backend.config import settings  # noqa: E402
  12: BASE_URL = f"http://localhost:{settings.PORT}"
```

### 412. `backend/tests/verify_operational.py`
- Bytes: `2812`
- Lines: `87`
- SHA256: `4032069fcd9d90f0d0f2c8093f6a1b56d88b706116c55084f115d1d4e334c4a6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import os
   3: import sys
   5: import httpx
   7: # Add backend to path
   8: sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
  10: from backend.config import settings  # noqa: E402
  12: BASE_URL = f"http://localhost:{settings.PORT}"
```

### 413. `backend/tests/verify_security_api.py`
- Bytes: `2672`
- Lines: `85`
- SHA256: `1f487de6a53172a4f62b5aeaa24d00b458acba17bbcb7dde5717e17b5e4d0729`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import os
   3: import sys
   5: import httpx
   7: from backend.config import settings
   9: # Add backend to path for module imports
  10: sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
  12: BASE_URL = f"http://localhost:{settings.PORT}"
```

### 414. `backend/tests/verify_token_claims.py`
- Bytes: `919`
- Lines: `35`
- SHA256: `5c7029ac289175707eaa2b3448dce09abd4d3229a8121ac102b09bc7bae99d5f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `test_access_token_claims`
- Excerpt (first non-empty lines):

```text
   1: from datetime import datetime, timezone
   3: import jwt
   5: from backend.utils.auth_utils import create_access_token
   8: def test_access_token_claims():
   9:     # Test data
  10:     data = {"sub": "testuser", "role": "staff"}
  11:     secret_key = "test-secret"
  12:     algorithm = "HS256"
```

### 415. `backend/utils/__init__.py`
- Bytes: `16`
- Lines: `2`
- SHA256: `ed0dc1c725c44e4b77b66e6dae1b8b4f22fc3e810238ad1088afb42945404764`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Utils package
```

### 416. `backend/utils/api_utils.py`
- Bytes: `7518`
- Lines: `233`
- SHA256: `f0849d35cd2c35f625f37ff27346b8dd21e5d6659585257924d8f5bd75fb174a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `sanitize_for_logging`
  - `create_safe_error_response`
  - `handle_result`
  - `result_to_response`
  - `decorator`
- Excerpt (first non-empty lines):

```text
   1: import logging
   2: import os
   3: import re
   4: import uuid
   5: from collections.abc import Callable, Coroutine
   6: from functools import wraps
   7: from typing import Any
   8: from typing import Any as AnyType
```

### 417. `backend/utils/async_utils.py`
- Bytes: `11921`
- Lines: `347`
- SHA256: `97b4230ac0ac3892212ff4314ef88a700bd7ad675ab3d128b325f1993be3d956`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AsyncExecutor`
  - `__init__`
  - `_is_circuit_open`
  - `_record_failure`
  - `_reset_circuit_breaker`
  - `with_async_executor`
  - `decorator`
  - `AsyncCache`
  - `__init__`
  - `_evict_lru`
  - `cached_async`
  - `decorator`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Modern Async Utilities - 2024/2025 Best Practices
   3: Zero-error async patterns, connection pooling, and performance optimization
   4: """
   6: import asyncio
   7: import logging
   8: import time
   9: from collections.abc import Callable, Coroutine
```

### 418. `backend/utils/auth_utils.py`
- Bytes: `4990`
- Lines: `139`
- SHA256: `7956dbe750bce3c963553d466b0fcd72e861564f00d09c55e940321afad8929a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `verify_password`
  - `_verify_bcrypt_fallback`
  - `get_password_hash`
  - `create_access_token`
- Excerpt (first non-empty lines):

```text
   1: import logging
   2: import os
   3: from datetime import datetime, timedelta, timezone
   4: from typing import Any, Optional
   6: from passlib.context import CryptContext
   8: from backend.auth.jwt_provider import jwt
   9: from backend.config import settings
  11: logger = logging.getLogger(__name__)
```

### 419. `backend/utils/crypto_utils.py`
- Bytes: `1073`
- Lines: `29`
- SHA256: `1e8734fecae3573698c8295a513a873f469998fad023da3e0cad9ea6b660f482`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `get_pin_lookup_hash`
- Excerpt (first non-empty lines):

```text
   1: import hashlib
   2: import os
   5: def get_pin_lookup_hash(pin: str) -> str:
   6:     """
   7:     Generate a salted SHA-256 hash of the PIN for O(1) lookups.
   9:     SECURITY UPDATE: Added salt to prevent rainbow table attacks.
  11:     WARNING: This is valid for LOOKUP only.
  12:     It MUST NOT be used for verification. Verification must still use
```

### 420. `backend/utils/db_connection.py`
- Bytes: `9016`
- Lines: `279`
- SHA256: `e10f70582d9c18ca9dec69818559dbfbd76c1c91caac9c80ca86b579006c3c63`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SQLServerConnectionBuilder`
  - `get_available_driver`
  - `build_connection_string`
  - `create_optimized_connection`
  - `test_connection`
  - `is_connection_valid`
  - `ConnectionStringOptimizer`
  - `optimize_existing_connection_string`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Shared database connection utilities to eliminate duplicate connection logic
   3: """
   5: import logging
   6: from typing import Optional
   8: import pyodbc
  10: logger = logging.getLogger(__name__)
  13: class SQLServerConnectionBuilder:
```

### 421. `backend/utils/env_validation.py`
- Bytes: `4099`
- Lines: `111`
- SHA256: `2b6cc8356180fba20325a7f524e9998c96a80311677cda437a2c06d324f3de3b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `validate_environment`
  - `get_env_summary`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Environment Variable Validation Module
   4: Validates critical environment variables on application startup.
   5: Raises ValueError if required variables are missing or invalid.
   6: """
   8: import os
   9: import logging
  11: logger = logging.getLogger(__name__)
```

### 422. `backend/utils/erp_utils.py`
- Bytes: `16205`
- Lines: `428`
- SHA256: `e887c8ff647911d3f2c671106c8bd22f823c7998410e2ed406cb74dab60b820c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_safe_float`
  - `_safe_str`
  - `_safe_optional_str`
  - `_safe_date_str`
  - `_add_optional_fields`
  - `_get_barcode_variations`
  - `_map_erp_item_to_schema`
- Excerpt (first non-empty lines):

```text
   1: import logging
   2: import os
   3: from datetime import date, datetime, timezone
   4: from typing import Any, Optional, Sequence
   6: from fastapi import HTTPException
   8: from backend.api.schemas import ERPItem
   9: from backend.error_messages import get_error_message
  11: logger = logging.getLogger(__name__)
```

### 423. `backend/utils/error_handler_with_diagnosis.py`
- Bytes: `9710`
- Lines: `295`
- SHA256: `a6d22317877664ae6a2539a0a2fe931eb9a7efff49a744bf69632582906a3338`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `get_auto_diagnosis`
  - `_handle_sync_error`
  - `with_auto_diagnosis`
  - `decorator`
  - `sync_wrapper`
  - `SelfDiagnosingErrorHandler`
  - `__init__`
  - `get_diagnoses`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Enhanced Error Handler with Auto-Diagnosis
   3: Decorators and utilities for automatic error diagnosis and self-healing
   4: """
   6: import logging
   7: from collections.abc import Callable
   8: from functools import wraps
   9: from typing import Any, Optional, TypeVar
```

### 424. `backend/utils/logging_config.py`
- Bytes: `3126`
- Lines: `113`
- SHA256: `ff3f66fdb47b0cfff7eac81e20faa6f6449db8b10f506e34175c5342eabc212d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `NonClosingStreamHandler`
  - `__init__`
  - `close`
  - `JSONFormatter`
  - `format`
  - `setup_logging`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Structured Logging Configuration
   3: Provides JSON and text-based logging with different levels
   4: """
   6: import json
   7: import logging
   8: import sys
   9: from datetime import datetime, timezone
```

### 425. `backend/utils/pagination.py`
- Bytes: `7303`
- Lines: `278`
- SHA256: `595513b15f6848abd4dc735d9403e018337bbf39c8b9c76ac8f03ec582a69974`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PaginationParams`
  - `__init__`
  - `skip`
  - `limit`
  - `CursorPaginationParams`
  - `__init__`
  - `PageInfo`
  - `CursorInfo`
  - `Page`
  - `CursorPage`
  - `paginate`
  - `cursor_paginate`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Pagination Utilities - Standardized pagination for FastAPI endpoints
   4: Based on fastapi-pagination patterns from awesome-fastapi best practices.
   5: Provides consistent pagination across all API endpoints with proper typing.
   6: """
   8: from typing import Any, Generic, Optional, TypeVar
  10: from fastapi import Query
  11: from pydantic import BaseModel, ConfigDict, Field
```

### 426. `backend/utils/pdf_generator.py`
- Bytes: `4849`
- Lines: `126`
- SHA256: `ddd55100be99a20ba89e104760086ab4a04346bd25341914414982e2d58cf6c4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PDFGenerator`
  - `generate_analytics_report`
- Excerpt (first non-empty lines):

```text
   1: import io
   2: from datetime import datetime
   3: from typing import Any
   5: from reportlab.lib import colors
   6: from reportlab.lib.pagesizes import letter
   7: from reportlab.lib.styles import getSampleStyleSheet
   8: from reportlab.lib.units import inch
   9: from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
```

### 427. `backend/utils/port_detector.py`
- Bytes: `10445`
- Lines: `276`
- SHA256: `3a00c018e899aec53c6bf8b4ed40a2d1842d5f3275aeb533e3ca558c5d96349d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `save_backend_info`
  - `PortDetector`
  - `is_port_available`
  - `find_available_port`
  - `get_backend_port`
  - `is_mongo_running`
  - `find_mongo_port`
  - `get_mongo_url`
  - `get_mongo_status`
  - `get_local_ip`
  - `generate_frontend_config`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Port Detection Utility for Backend
   3: Automatically detect and use available ports
   4: """
   6: import json
   7: import logging
   8: import os
   9: import socket
```

### 428. `backend/utils/result.py`
- Bytes: `12827`
- Lines: `380`
- SHA256: `1cd00987db811fa8e85f527ee8ef059439325a9f5032bf30bbcb7968caaa52ff`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ResultError`
  - `UnwrapError`
  - `__init__`
  - `Result`
  - `__post_init__`
  - `ok`
  - `fail`
  - `from_callable`
  - `is_ok`
  - `is_err`
  - `unwrap`
  - `unwrap_or`
  - `unwrap_or_else`
  - `map`
  - `map_error`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Robust Result type implementation with comprehensive error handling.
   3: Designed for high reliability and clear error tracking.
   4: """
   6: from __future__ import annotations
   8: import logging
   9: import traceback
  10: from collections.abc import Callable
```

### 429. `backend/utils/result_types.py`
- Bytes: `4020`
- Lines: `126`
- SHA256: `7549b5935d58e5b98b8d72ae23cac4f6236460b59086c5eac6aa4332d65d42bb`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ResultType`
  - `Result`
  - `success`
  - `error`
  - `is_success`
  - `is_error`
  - `unwrap`
  - `unwrap_or`
  - `unwrap_or_else`
  - `map`
  - `map_error`
  - `and_then`
  - `or_else`
  - `match`
  - `to_tuple`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Modern Result Type for Zero-Error Error Handling (2024/2025 Best Practice)
   3: Type-safe error handling without exceptions where possible
   4: """
   6: from collections.abc import Callable
   7: from dataclasses import dataclass
   8: from enum import Enum
   9: from typing import Any, Generic, Optional, TypeVar
```

### 430. `backend/utils/secret_generator.py`
- Bytes: `2980`
- Lines: `93`
- SHA256: `15b9f472df8b98f3e89d7b15a9369824afc165ad409be9de8fed51d742ac3c3e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `generate_secret`
  - `update_env_file`
  - `main`
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env python3
   2: """
   3: Secret Generator Utility
   5: Generates secure secrets for JWT_SECRET and JWT_REFRESH_SECRET.
   6: Can optionally write them to the .env file.
   7: """
   9: import argparse
  10: import secrets
```

### 431. `backend/utils/service_manager.py`
- Bytes: `8426`
- Lines: `220`
- SHA256: `415fb1255ea038b1186c51e9ddab4c1b1038c766f09ff6dd53e82efa84a82644`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ServiceManager`
  - `is_port_in_use`
  - `find_available_port`
  - `get_process_using_port`
  - `kill_process`
  - `kill_processes_by_name`
  - `ensure_single_backend`
  - `ensure_single_frontend`
  - `save_port_info`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Service Manager - Ensures only one instance of backend/frontend runs
   3: Handles port conflicts dynamically and kills existing instances
   4: """
   6: import logging
   7: import os
   8: import platform
   9: import socket
```

### 432. `backend/utils/structured_logging.py`
- Bytes: `5223`
- Lines: `174`
- SHA256: `930104a1ccbccdbd4fc4eeebe0922bc5995c0739f90a3babafa2036c65124b89`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `NonClosingStreamHandler`
  - `close`
  - `JSONFormatter`
  - `format`
  - `setup_structured_logging`
  - `StructuredLogger`
  - `__init__`
  - `_log_with_context`
  - `debug`
  - `info`
  - `warning`
  - `error`
  - `critical`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Structured Logging (2024/2025 Best Practice)
   3: JSON-formatted logging for better observability
   4: """
   6: import json
   7: import logging
   8: import sys
   9: import traceback
```

### 433. `backend/utils/tracing.py`
- Bytes: `5249`
- Lines: `160`
- SHA256: `b3fb28d94a945f52fa5b783ad8e5c3d4a133c4512d9278eeb9ec02f6dd77ccc9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `_is_tracing_enabled`
  - `init_tracing`
  - `instrument_fastapi_app`
  - `trace_span`
  - `NoOpContextDecorator`
  - `__enter__`
  - `__exit__`
  - `trace_report_generation`
  - `decorator`
  - `trace_dashboard_query`
  - `decorator`
- Excerpt (first non-empty lines):

```text
   1: """Tracing utilities for the backend.
   3: This module wires OpenTelemetry tracing to FastAPI and exposes a simple
   4: `init_tracing` entrypoint that is safe to call on startup. Tracing is
   5: no-op unless explicitly enabled via environment variables and OpenTelemetry
   6: packages being installed. Missing OTEL packages should never break imports
   7: or tests.
   8: """
  10: from __future__ import annotations
```

### 434. `backend/utils/validation.py`
- Bytes: `15885`
- Lines: `529`
- SHA256: `46fd3f91ce42fa37772bf191eecf45f52f1f2282effcfb3b503a46396c7f3e34`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ValidationError`
  - `__init__`
  - `validate_mongo_field_name`
  - `validate_sql_identifier`
  - `sanitize_for_display`
  - `MongoSaveError`
  - `__init__`
  - `verify_insert_result`
  - `verify_update_result`
  - `verify_delete_result`
- Excerpt (first non-empty lines):

```text
   1: """
   2: Input Validation Utilities
   3: Centralized validators for security-critical input validation
   4: """
   6: import logging
   7: import re
   8: from typing import Any, Optional
  10: logger = logging.getLogger(__name__)
```

## deliverables

### 435. `deliverables/CODEBASE_REPORT.md`
- Bytes: `11505`
- Lines: `148`
- SHA256: `9692f7b29fa4c1b1f7bd23a5f2565d3a6d23a51697d9ca0fcf46fcb013b080b7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ﻿# Codebase Report - Stock Verify System
   3: Scope: Full repository under d:\stk\stock-verify-system. This report summarizes architecture, major modules, data flows, testing, and operational readiness using in-repo documentation and source layout.
   5: ## Executive Summary
   7: Stock Verify is a mobile-first inventory verification system with an offline-first workflow. It uses a FastAPI backend, MongoDB as the working database, and SQL Server as a read-only ERP source of truth. The frontend ...
   9: Key references: docs/codebase_memory_v2.1.md, docs/PROJECT_REPORT.md, docs/APP_LOGIC_OVERVIEW.md, docs/TECHNICAL_SPECIFICATION.md, backend/server.py, frontend/package.json.
  11: ## System Architecture
  13: - Backend API: FastAPI app wired in backend/server.py with extensive router modules and middleware.
  14: - Data layer:
```

### 436. `deliverables/Executive_Summary.md`
- Bytes: `7872`
- Lines: `168`
- SHA256: `0cf699b2186a385e31b9a4983d0fd09acc7b176e1a09ed49f50ae2a480a6c5d3`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Stock Verify System - Executive Summary
   3: **Generated:** 2026-01-19
   4: **Architecture:** Custom FastAPI + React Native (NOT Power Platform)
   5: **Overall Status:** 95% Implementation Complete (33/35 Requirements Met)
   7: ---
   9: ## 🔍 Critical Finding
  11: **This is NOT a Power Platform application.** The system is a custom-built stock verification solution with a mature, production-ready architecture:
  13: | Layer | Technology |
```

### 437. `deliverables/PROJECT_STRUCTURE_BUILD_ANALYSIS.md`
- Bytes: `8423`
- Lines: `263`
- SHA256: `4f2fc86de91e33fb463bfb92080965e032ea467648860699e143041b483e79e1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Stock Verify System - Project Structure & Build Analysis
   3: **Generated:** 2026-01-20
   4: **Version:** 2.1
   6: ---
   8: ## 📁 Project Structure Overview
  10: ```
  11: D:\stk\stock-verify-system\
  12: ├── .agent/                    # AI agent configurations & workflows
```

### 438. `deliverables/Phase0_Discovery/Inventory.md`
- Bytes: `13291`
- Lines: `409`
- SHA256: `9e410300bf5d9e111cda9586a4055b08e6008e7b7b3b9080e63cf402bc428b59`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Stock Verify System - Inventory Report
   3: **Generated:** 2026-01-19
   4: **Architecture:** Custom FastAPI + React Native (NOT Power Platform)
   5: **Version:** 2.1
   7: ---
   9: ## 1. Technology Stack
  11: | Layer | Technology | Version | Purpose |
  12: |-------|------------|---------|---------|
```

### 439. `deliverables/Phase2_FunctionalAudit/FR_Audit_Matrix.csv`
- Bytes: `8385`
- Lines: `98`
- SHA256: `ed1e5f5eb8476d2dece39ed00bdcf161cf4f486572a45c76eb7ab93be4702e65`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: FR-ID,Test Steps,Evidence,Pass/Fail,Fix Notes,Owner,Date
   2: FR-M-01,"1. Inspect SQLSyncService for SELECT-only queries
   3: 2. Check no SQL write operations in dataflows
   4: 3. Verify gateway account has read-only permissions",SQLSyncService uses only SELECT queries; no INSERT/UPDATE/DELETE to SQL,Pass,N/A - Core architecture constraint,
   5: FR-M-02,"1. Verify all app data stored in MongoDB
   6: 2. Check sessions, count_lines, variances, photos all in MongoDB",sessions, count_lines, variances, notifications collections exist and contain all app data,Pass,N/A,
   7: FR-M-03,"1. Check sync_service for incremental refresh logic
   8: 2. Verify RowVersion/ModifiedDate usage
```

### 440. `deliverables/TEST_ANALYSIS_GAP_REPORT.md`
- Bytes: `8809`
- Lines: `287`
- SHA256: `39c442e4ad51a51162d3902fe9bd4556945c8731b41fa46be34a6528662375dc`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Stock Verify System - Test Analysis & Gap Report
   3: **Generated:** 2026-01-20
   4: **Test Run Date:** 2026-01-20
   6: ---
   8: ## 📊 Test Results Summary
  10: ### Backend (Python/FastAPI)
  12: | Metric | Value |
  13: |--------|-------|
```

## docs

### 441. `docs/100_PERCENT_COMPLETE.md`
- Bytes: `14243`
- Lines: `525`
- SHA256: `92c484cb24551251cdd3904fff90d9908da70f3db33dbb0b2a6b1e2883d609e8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # 🎉 100% MUST-HAVE REQUIREMENTS COMPLETE!
   3: **Date**: 2026-01-19
   4: **Final Time**: 21:30 IST
   5: **Total Duration**: 2 hours 30 minutes
   6: **Status**: ✅ **ALL 29 MUST-HAVE REQUIREMENTS IMPLEMENTED + TESTED**
   8: ---
  10: ## 🏆 MISSION ACCOMPLISHED
  12: ### **100% Must-Have Coverage** (29/29) ✅
```

### 442. `docs/ACCESSIBILITY_AUDIT.md`
- Bytes: `7193`
- Lines: `255`
- SHA256: `35132c761c151900854af410b9910c9be756954faf53c3ffab618663c8e7a030`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Accessibility Audit Report
   3: ## Stock Verification App - Accessibility Analysis
   5: **Date**: January 2025
   6: **Standards**: WCAG 2.1 AA
   7: **Platforms**: iOS (VoiceOver), Android (TalkBack), Web
   9: ---
  11: ## Executive Summary
  13: | Category | Score | Status |
```

### 443. `docs/API_CONTRACTS.md`
- Bytes: `10097`
- Lines: `383`
- SHA256: `1a7b4f3d9415b2c00bf7a4a29a2fd18acf785b25262c31f879c402b787042d92`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # API Contracts Documentation
   3: This document defines the standardized request/response formats used throughout the Stock Verification API. All endpoints follow these contracts unless explicitly documented otherwise.
   5: > **Document Roles**:
   6: > - **This document** (`API_CONTRACTS.md`): **Normative** — defines the target API contract, response envelopes, and standards. Use for API design decisions and client implementation guidance.
   7: > - **[APP_LOGIC_OVERVIEW.md](APP_LOGIC_OVERVIEW.md)**: **Descriptive** — describes actual runtime behavior, data flows, and implementation details. Use for debugging, onboarding, and understanding how the system works.
   8: >
   9: > Note: Some endpoints currently return responses that differ from these contracts (see [Response Envelope Reality Check](APP_LOGIC_OVERVIEW.md#response-envelope-reality-check) in APP_LOGIC_OVERVIEW.md for details).
  11: ## Standard Response Format
```

### 444. `docs/APP_LOGIC_OVERVIEW.md`
- Bytes: `43122`
- Lines: `929`
- SHA256: `7248705330ed1e8bba7b51065dad51edb81f13c4705abcee721789d19f55e9e0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # App Logic Overview
   3: Purpose: Explain how the Stock Verification System starts, authenticates, moves data through core workflows, and where to change behavior safely.
   4: Audience: Engineers, support, QA; assumes familiarity with FastAPI, MongoDB, and the existing API surface.
   5: Scope: Backend behavior (FastAPI + MongoDB + SQL Server read-only), aligned with FR-001..FR-008 in specs/004-app-logic-docs/spec.md.
   7: > **Document Roles**:
   8: >
   9: > - **This document** (`APP_LOGIC_OVERVIEW.md`): **Descriptive** — describes actual runtime behavior, data flows, and implementation details. Use for debugging, onboarding, and understanding how the system works.
  10: > - **[API_CONTRACTS.md](API_CONTRACTS.md)**: **Normative** — defines the target API contract, response envelopes, and standards. Use for API design decisions and client implementation guidance.
```

### 445. `docs/BACKEND_CONNECTION_PARAMETERS.md`
- Bytes: `13634`
- Lines: `571`
- SHA256: `71e26ee61e6c3cd5be3befc7456254df83c82bf9af68228e065bfdd952dca28d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `validate_sql_port`
  - `build_connection_string`
  - `test_connection`
  - `SQLServerConnector`
  - `__init__`
  - `connect`
- Excerpt (first non-empty lines):

```text
   1: # Backend SQL Server Connection Parameters - Technical Reference
   3: ## Overview
   5: The backend uses a robust, multi-layered approach to SQL Server connectivity with automatic pooling, retry logic, and health monitoring.
   7: ---
   9: ## 1. Configuration Parameters
  11: ### Source File
  12: - **Location**: [backend/config.py](backend/config.py#L127-L136)
  13: - **Type**: Pydantic Settings class with validation
```

### 446. `docs/CHANGELOG.md`
- Bytes: `1266`
- Lines: `34`
- SHA256: `993ddd2d6ba885adbbc1d9b986f7b5c53097d5e5a73522b4b31f1e3317c6ac57`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Changelog
   3: All notable changes to this project will be documented in this file.
   5: The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
   6: and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
   8: ## [2.1.0] - 2025-11-30
  10: ### Added
  12: - **Governance Framework**: Established v2.1 Governance with unified documentation.
  13: - **Documentation**:
```

### 447. `docs/CODEBASE_PROBLEMS_RESOLUTION.md`
- Bytes: `8593`
- Lines: `257`
- SHA256: `98297fd6fb894ac4ca20ae69602dea476bcb841271c2a48d827ad14b059d94c9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Codebase Problems Resolution Report
   3: ## Executive Summary
   5: **Total Problems Addressed:** 958 → 30 (96.9% reduction)
   7: Fixed **928 false positive TypeScript errors** that were masking **30 real TypeScript errors**.
   9: ---
  11: ## Problem Investigation
  13: ### Initial Report
  14: - **False Positives:** 958 React Native text validation errors
```

### 448. `docs/CODE_DERIVED_USER_WORKFLOW_DIAGRAMS.md`
- Bytes: `5371`
- Lines: `172`
- SHA256: `d06571e345a5ab1e33f9d4d4b630a9c76a94c215b2d89f24deb947cf2b011b29`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Code-Derived User Workflow Diagrams
   3: This document is derived from application code only (frontend routes/components/services + backend route contracts).
   5: ## Scope
   7: - Authentication and role routing
   8: - Staff workflow
   9: - Supervisor workflow
  10: - Admin workflow
  12: ## Key Code Anchors
```

### 449. `docs/COMPLETE_IMPLEMENTATION_REPORT.md`
- Bytes: `13025`
- Lines: `519`
- SHA256: `51ccebca9fb973bbf4b2010619f34a810ee2f99c45e793ae479dc03c88101850`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # 🎉 COMPLETE IMPLEMENTATION REPORT
   3: **Date**: 2026-01-19
   4: **Time**: 19:00 - 20:40 IST
   5: **Total Duration**: 1 hour 40 minutes
   6: **Status**: ✅ **ALL CRITICAL ITEMS COMPLETE + TESTED**
   8: ---
  10: ## 🏆 Final Achievement Summary
  12: ### Implementation Coverage: **92%** (32/35 Must-Have requirements)
```

### 450. `docs/COMPLETE_UPGRADE_SUMMARY.md`
- Bytes: `10533`
- Lines: `476`
- SHA256: `65be1cbaa29663c7053d25db09518f8c6be51d215080cf5258be2525f246cc1e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # StockVerify System Upgrade - Complete Summary
   3: **Date**: December 11, 2025
   4: **Status**: Phases 1-3 Complete ✅
   5: **Total Implementation Time**: ~8 hours
   7: ---
   9: ## 🎉 Executive Summary
  11: Successfully upgraded StockVerify from a basic stock verification system to an **enterprise-grade, offline-first, multi-user inventory platform** with advanced reporting capabilities.
  13: ### Key Achievements
```

### 451. `docs/COMPREHENSIVE_APP_REVIEW.md`
- Bytes: `12733`
- Lines: `302`
- SHA256: `6b7c7e570c8e7c02cb5968804ca4d3a073ba319066c0a9b7b55217e54022be0a`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 452. `docs/CONSISTENCY_FIXES_SUMMARY.md`
- Bytes: `7921`
- Lines: `213`
- SHA256: `b708859381ddcd025ddb5adf184d879fc5bf705494078fc52bf03d91a904031e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Consistency Fixes Summary
   3: This document summarizes all consistency issues that were identified and fixed during the project-wide analysis.
   5: ## Fixes Applied
   7: ### 1. ✅ Generic Exception Handling (FIXED)
   9: **Issue:** 20+ bare `except Exception:` clauses in server.py reducing debuggability.
  11: **Fixed Instances:**
  12: - Line 287: `except (ImportError, ValueError, OSError)` - Bcrypt backend check
  13: - Line 292: `except (ImportError, RuntimeError)` - Argon2 initialization
```

### 453. `docs/CONSTITUTION.md`
- Bytes: `1171`
- Lines: `24`
- SHA256: `65d4c173d2f645481c4ecc32eb8967cabdb0d7d5192648c60c972df76c746788`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Project Constitution: STOCK_VERIFY_2
   3: This document outlines the core principles and constraints for the Stock Verification System.
   5: ## Core Principles
   7: 1. **Data Integrity**: The system must ensure that stock counts are accurate and synchronized correctly between MongoDB and SQL Server.
   8: 2. **Security First**: All endpoints must be protected by JWT authentication. Role-based access control (RBAC) must be strictly enforced.
   9: 3. **Minimal Disruption**: New features should not break existing workflows for staff members in the field.
  10: 4. **Performance**: API responses should be optimized for low-latency, especially for barcode lookups.
  12: ## Technical Constraints
```

### 454. `docs/DEPLOYMENT_STATUS.md`
- Bytes: `1480`
- Lines: `30`
- SHA256: `0346e6693f0de7dd55f1c130cbbac22854977b4f82689746837dafacf061a246`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Deployment Status Report
   3: ## Current Status: ⚠️ Blocked by Docker System Issue
   5: The application configuration has been corrected for production deployment, specifically:
   7: 1. **MongoDB Connection**: Fixed `MONGO_URL` in `.env.production` to point to the `mongo` service correctly (`mongodb://mongo:27017/stock_verify`).
   8: 2. **Backup Service**: Updated `scripts/backup.sh` to handle authentication correctly (avoiding failures when no password is set).
   9: 3. **Backend Build**: Attempted to include SQL Server drivers, but encountered Docker system I/O errors. Reverted to a lighter build configuration.
  11: ## Critical Issue
  13: **Docker Desktop is encountering "input/output error" and hanging.**
```

### 455. `docs/DEPLOY_MANUAL.md`
- Bytes: `1163`
- Lines: `44`
- SHA256: `afc84bb792560c88003d7bab579a5a6892c0af7c3c30852151fd246b9abb2bea`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Manual Deployment Guide (No Docker)
   3: Since Docker is currently experiencing issues, you can deploy the application directly on your Mac using the provided script.
   5: ## Prerequisites
   7: - **MongoDB** must be installed (`brew install mongodb-community` if not present).
   8: - **Python 3.11** must be active.
   9: - **Node.js** must be active.
  11: ## Quick Start
  13: Run the deployment script:
```

### 456. `docs/DESIGN_SYSTEM.md`
- Bytes: `10062`
- Lines: `433`
- SHA256: `e4bf95e5cdb10bfd84b22f3202ba63b0e35f916ac24a1f3d95905e9424fbb74a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `LoadingSpinnerProps`
  - `handleChange`
- Excerpt (first non-empty lines):

```text
   1: # Design System Documentation
   3: ## Stock Verification App - Unified Design System
   5: This document outlines the design system used throughout the Stock Verification application, providing guidelines for consistent UI implementation.
   7: ---
   9: ## Table of Contents
  11: 1. [Overview](#overview)
  12: 2. [Color System](#color-system)
  13: 3. [Typography](#typography)
```

### 457. `docs/DEVELOPER_CHECKLIST.md`
- Bytes: `4272`
- Lines: `111`
- SHA256: `67669f5815130b4a6af81d2fb9a2ad096541b712b5e1d8ea28b65723558a9ce5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # 👨‍💻 Developer Checklist - Stock Verify
   3: This checklist is designed to help developers ensure code quality, consistency, and stability when working on the Stock Verify project.
   5: ## 🚀 1. Onboarding & Setup
   6: *Ensure your environment is correctly configured before starting development.*
   8: - [ ] **Read Documentation**:
   9:   - [ ] `START_HERE.md` (Project overview)
  10:   - [ ] `CONTRIBUTING.md` (Contribution guidelines)
  11:   - [ ] `README.md` (System architecture)
```

### 458. `docs/EMERGENCY-SECURITY-FIXES.md`
- Bytes: `6657`
- Lines: `188`
- SHA256: `ab9d87e3b113fba80236334df35cdae75ac587553cf4ecd8fa8f4c6d6da92e65`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `get_pin_lookup_hash`
- Excerpt (first non-empty lines):

```text
   1: # CRITICAL SECURITY ISSUES - IMMEDIATE ACTION REQUIRED
   3: **Date**: 2026-01-26
   4: **Severity**: 🚨 EMERGENCY
   5: **Timeline**: Fix within 6 hours
   7: ## NEWLY DISCOVERED CRITICAL VULNERABILITIES
   9: ### 1. Cross-Warehouse Session Manipulation (CRITICAL)
  10: **Risk**: Supervisors can access/manipulate sessions from any warehouse
  11: **Impact**: Inventory fraud, unauthorized access, audit trail compromise
```

### 459. `docs/ENHANCEMENT_IMPLEMENTATION_PLAN.md`
- Bytes: `4490`
- Lines: `126`
- SHA256: `7e59d9fd2ee9538ba44c9ff8cd3d40033dfcb43a513f4491b60fc6a5e65bd018`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # STOCK_VERIFY 2.1 Enhancement Implementation Plan
   3: ## 📋 Implementation Roadmap
   5: ### **Phase 1: Critical Improvements (Immediate - 2-4 weeks)**
   7: #### **Priority 1.1: Increase Backend Test Coverage (45% → 85%)**
   8: - [ ] Analyze current coverage gaps by module
   9: - [ ] Add unit tests for API endpoints with low coverage
  10: - [ ] Create integration tests for core business logic
  11: - [ ] Add database integration tests
```

### 460. `docs/ENTERPRISE_FEATURES_GUIDE.md`
- Bytes: `13873`
- Lines: `537`
- SHA256: `bb72bc62a17843435f4c4abd8c87e277d251b8e25df58210b5ff89e80168ce2e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Enterprise Features Guide
   3: Stock Verification System - Enterprise Grade Features
   5: ## Overview
   7: This guide documents all enterprise-grade features added to the Stock Verification System, providing compliance-ready security, observability, and governance capabilities.
   9: ---
  11: ## 🔐 Enterprise Security
  13: **Service:** `backend/services/enterprise_security.py`
  14: **API:** `/api/enterprise/security/*`
```

### 461. `docs/ENVIRONMENT_VARIABLES.md`
- Bytes: `1385`
- Lines: `45`
- SHA256: `2b7a0c38a14381b34e61f94866956fc3a37ebac070b51377ac7818cd7f411ab6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Environment Variables
   3: This project uses environment variables for configuration. Do **not** commit real secrets (use `*.env.example` templates).
   5: ## Backend (`backend/.env.example`)
   7: **Core**
   8: - `ENVIRONMENT`: `development` | `staging` | `production`
   9: - `APP_NAME`, `APP_VERSION`
  10: - `LOG_LEVEL`: `DEBUG` | `INFO` | `WARNING` | `ERROR`
  12: **MongoDB**
```

### 462. `docs/ERP_POLICY.md`
- Bytes: `2270`
- Lines: `93`
- SHA256: `e8ce1fbed91ed5254baf35c97bf81028c22227489768d5a83e982d1e83423d18`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # ERP Interaction Policy
   2: ## Stock Verify System
   4: ## 1. Purpose
   5: This document defines the **permanent and non-negotiable rules** governing interaction between the Stock Verify System and the ERP system (SQL Server).
   7: This policy exists to:
   8: - Prevent data corruption
   9: - Preserve auditability
  10: - Avoid financial and compliance risk
```

### 463. `docs/EXECUTIVE_SUMMARY.md`
- Bytes: `1461`
- Lines: `21`
- SHA256: `530bc09840bccb10bff6b814c6fdea678eb72e9a4ef8de0d7ccc56a6edec64bb`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Executive Summary - Stock Verification System Audit
   3: ## Overview
   5: We have successfully audited the **Python/React Native/MongoDB** Custom Stock Verification System against the provided Power Platform-style requirements. The system architecture has been verified to be robust, scalabl...
   7: ## Key Achievements (Phase 6 Fixes)
   9: 1.  **FR-M-20 Submit Delay**: Implemented a **5-second Undo** mechanism on the counting screen to prevent accidental submissions.
  10: 2.  **FR-M-08 Session Limits**: Verified strict enforcement of max 5 active sessions per user in the backend API.
  11: 3.  **FR-M-03 Incremental Sync**: Validated `SQLSyncService` performs delta updates, respecting the "Read-Only" constraint.
  12: 4.  **FR-M-06 Auth**: Confirmed weak PIN and Strong Password dual-auth strategy with biometric hooks.
```

### 464. `docs/FEATURES_SUMMARY.txt`
- Bytes: `8923`
- Lines: `273`
- SHA256: `d0e1172c51e8cfce6898ccca45081565a30aa4286b17b075960a1166a825176d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ================================================================================
   2:          STOCK VERIFICATION SYSTEM - NEW FEATURES IMPLEMENTATION
   3: ================================================================================
   5: COMPLETION STATUS: ✅ ALL FEATURES IMPLEMENTED
   7: ================================================================================
   8: FEATURES IMPLEMENTED
   9: ================================================================================
  11: 1. ✅ ERROR HANDLING WITH USER & ADMIN NOTIFICATIONS
```

### 465. `docs/FEATURE_INTEGRATION_GUIDE.md`
- Bytes: `11501`
- Lines: `491`
- SHA256: `032cfcf562b2578077b7d276638f1b54359be38629d662846840c37cba40f524`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `RootComponent`
  - `fetchItems`
  - `DebugMenu`
  - `runDiagnostics`
  - `AuthFlow`
  - `SecuritySettings`
  - `handleEnablePIN`
  - `init`
  - `LoginScreen`
  - `App`
  - `WiFiIndicator`
  - `handleSync`
  - `initServices`
- Excerpt (first non-empty lines):

```text
   1: # Feature Integration Guide
   3: ## Quick Start: Adding New Features to Your App
   5: This guide walks you through integrating the four new features into your Stock Verification System application.
   7: ---
   9: ## Feature 1: Error Handling & Notifications
  11: ### Frontend Setup
  13: 1. **Create Error Recovery Service**
  14:    - Already created in `frontend/src/services/errorRecovery.ts`
```

### 466. `docs/FEATURE_ROADMAP.md`
- Bytes: `19235`
- Lines: `830`
- SHA256: `d48f88afcd4a933e660ea1672eb1316642cd3cf8fb9c20a1a5500276448a5338`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Item`
  - `Warehouse`
  - `Permission`
  - `CustomRole`
  - `classify_items`
  - `Item`
- Excerpt (first non-empty lines):

```text
   1: # 🎯 Feature Roadmap & Upgrade Recommendations - Stock Verify v2.1
   3: **Last Updated**: December 2025
   4: **Current Version**: 2.1
   5: **Planning Horizon**: 12 months
   7: ---
   9: ## 📋 Table of Contents
  11: 1. [Current Feature Set](#current-feature-set)
  12: 2. [Short-Term Enhancements (Q1 2026)](#short-term-enhancements-q1-2026)
```

### 467. `docs/FRONTEND_HEALTH_CHECK.md`
- Bytes: `6843`
- Lines: `250`
- SHA256: `d2b8345f5732137a207a6e06d2e103dd7db05cf910e04d9f68e9ec52f4f6f2da`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Frontend Health Check - Implementation Summary
   3: **Date:** December 30, 2025
   4: **Status:** ✅ Fixes Applied
   6: ---
   8: ## ✅ Fixes Applied
  10: ### 1. Metro Resolver Configuration ✅
  11: **Issue:** Missing `react-native` in resolver priority breaks native bundling
  12: **Fix Applied:** Added `react-native` first in `resolverMainFields`
```

### 468. `docs/FR_AUDIT_MATRIX.md`
- Bytes: `5895`
- Lines: `46`
- SHA256: `175cfc1963c17f106b564c7a75c71d9122b4b47fb09fd57a7be77da691719b0f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Phase 2: Functional Requirements Audit Matrix
   3: | ID          | Requirement                  | Test Status | Evidence / Notes                                                                | Priority |
   4: | ----------- | ---------------------------- | ----------- | ------------------------------------------------------------------------------- | -------- |
   5: | **FR-M-01** | Read-only source integration | **PASS**    | `SQLServerConnector` has only SELECT methods. No write permissions configured.  | High     |
   6: | **FR-M-02** | App DB in cloud              | **PASS**    | MongoDB cloud cluster hosting all app data.                                     | High     |
   7: | **FR-M-03** | Incremental sync             | **PASS**    | `SQLSyncService` implements `sync_variance_only` and partitioning.              | High     |
   8: | **FR-M-04** | Required master fields       | **PASS**    | `db_mapping_config.py` maps all required fields including `last_purchase_cost`. | High     |
   9: | **FR-M-05** | Mobile & Web availability    | **PASS**    | React Native Expo (Web + Mobile) verified.                                      | High     |
```

### 469. `docs/GOVERNANCE_ACCEPTANCE_CRITERIA.md`
- Bytes: `3103`
- Lines: `61`
- SHA256: `574a10c95949a058c51bf1d54f77edb53536443f57786610ece078a91e9b48fc`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Governance Acceptance Criteria
   3: This file captures Given/When/Then criteria derived from code paths.
   5: ## Authentication and Role Routing
   7: 1. Given unauthenticated access to a protected route, when AuthGuard runs, then user is redirected to `/welcome`.
   8:    - Frontend guard: `frontend/src/components/auth/AuthGuard.tsx`
   9:    - API guard: token-required endpoints in `backend/api/auth.py` and auth dependencies
  11: 2. Given authenticated user in public route, when AuthGuard runs, then user is redirected to role home (`/staff/home`, `/supervisor/dashboard`, `/admin/dashboard`).
  12:    - Frontend mapping: `frontend/src/utils/roleNavigation.ts`
```

### 470. `docs/GOVERNANCE_API_DB_ENFORCEMENT_MAP.md`
- Bytes: `1468`
- Lines: `26`
- SHA256: `e7726b5b767ee58514f18e005f566a507aaee9c500aaa1d745c5b2469cdda818`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Governance API + DB Enforcement Map
   3: If a rule has no server-side enforcement, the rule is considered absent.
   5: | Rule | API Guard | DB/Mutation Enforcement |
   6: | --- | --- | --- |
   7: | Role-restricted route access | Auth dependencies + role checks in backend routers | N/A (auth layer) |
   8: | Session transition validity | `SessionStateMachine.can_transition(...)` in session APIs | Status updates constrained by explicit transition checks |
   9: | Count line transition validity | `StateTransition.can_transition(...)` and transition gateway | Controlled mutation path in command/state-machine services |
  10: | Offline sync idempotency | `/api/sync/batch` record processing | Upsert by `client_record_id` in verification records |
```

### 471. `docs/GOVERNANCE_AUDIT_TRACEABILITY.md`
- Bytes: `1025`
- Lines: `31`
- SHA256: `caa923da5c113d2020abd8f265ca5a4d7a57ad73997fbc52b7bc0a12e14a1bbc`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Governance Audit and Traceability
   3: Critical actions require immutable, timestamped, actor-attributed records.
   5: ## Must-Audit Actions
   7: - Supervisor approve/reject/recount operations
   8: - Bulk actions
   9: - Admin overrides and control-plane operations
  10: - SQL configuration updates/tests
  11: - Sync conflict resolution events
```

### 472. `docs/GOVERNANCE_FAILURE_PATHS.md`
- Bytes: `1248`
- Lines: `35`
- SHA256: `137bc695a8c443b0815b0859f1c709fa556294f558844d18a32a8a7cf84cf1bc`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Governance Failure Paths
   3: Failure behavior must be explicit and test-backed.
   5: ## Authentication Expiry
   7: - Expected: token/session expiry triggers logout/redirect and blocks protected API actions.
   8: - Anchors: `frontend/src/store/authStore.ts`, auth endpoints in `backend/api/auth.py`.
  10: ## Network Loss
  12: - Expected: writes queue offline and retry on reconnect.
  13: - Anchors: `frontend/src/services/offline/offlineQueue.ts`, `frontend/src/services/syncService.ts`.
```

### 473. `docs/GOVERNANCE_OFFLINE_SYNC_INVARIANTS.md`
- Bytes: `903`
- Lines: `30`
- SHA256: `89f0987799a94700508443a5d947e7caa939a6d54f3968c5e8e28e0762d7c8f0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Governance Offline Sync Invariants
   3: Offline-capable flows must satisfy these invariants.
   5: ## Invariants
   7: 1. Every offline write is idempotent or safely deduplicated server-side.
   8: 2. Duplicate submissions must be rejected or merged deterministically.
   9: 3. Partial sync failure is resumable without data loss.
  10: 4. Conflict resolution outcomes are deterministic and actor-traceable.
  11: 5. Offline behavior must not rely on UI-only state assumptions.
```

### 474. `docs/GOVERNANCE_PLAN.md`
- Bytes: `4398`
- Lines: `117`
- SHA256: `e2e3de48c527c8b8b8546979d681ce96583e5cba0fcc51fbd2c25ca51d4ae77b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # STOCK VERIFY - GOVERNANCE & MODERNIZATION ROADMAP
   3: ## PHASE 1 — GOVERNANCE & CONTROL (Immediate | Non-Negotiable)
   5: ### 1. Authentication & Role Authority
   6: - [x] Centralize authentication guard at root level
   7: - [x] Enforce single role-to-route resolver (no duplicated logic)
   8: - [x] Remove per-screen auth checks inside staff flows
   9: - [x] Introduce “Operational Modes”:
  10:     - Live Audit (locked, no overrides)
```

### 475. `docs/GOVERNANCE_RELEASE_CHECKLIST.md`
- Bytes: `1775`
- Lines: `54`
- SHA256: `3f0c8803222b781780cf0232d066c350bfa978838384264b75d4708acbf422a0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Governance Release Checklist
   3: Use this checklist before release, major refactor, or feature rollout.
   5: ## 1) Workflow Truth
   7: - [ ] `docs/CODE_DERIVED_USER_WORKFLOW_DIAGRAMS.md` matches all new/changed routes and API flows.
   8: - [ ] No undocumented workflow path exists in `frontend/app/*` or `backend/api/*`.
  10: ## 2) Acceptance Criteria
  12: - [ ] `docs/GOVERNANCE_ACCEPTANCE_CRITERIA.md` includes Given/When/Then for changed behavior.
  13: - [ ] Every changed criterion maps to route guard + API auth + request/response invariants.
```

### 476. `docs/GOVERNANCE_ROLE_AUTHORITY_MATRIX.md`
- Bytes: `1480`
- Lines: `34`
- SHA256: `5c1bfac0c9d9f619250816eeaa4c2c502eecaa0afa45f0c2fbf8583694fded6d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Governance Role Authority Matrix
   3: Authority is enforced server-side first, UI second.
   5: ## Roles
   7: - `staff`
   8: - `supervisor`
   9: - `admin`
  11: ## Matrix
  13: | Capability | Staff | Supervisor | Admin | Enforcement Anchors |
```

### 477. `docs/GOVERNANCE_SQL_ERP_SURFACES.md`
- Bytes: `757`
- Lines: `26`
- SHA256: `a615831dba82fcbeeeed59c60bc1eb1a85b728f34b07c7c2744badef2a6d3e15`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Governance SQL / ERP Integration Surfaces
   3: This index tracks SQL-touching code paths and expected governance controls.
   5: ## Surfaces
   7: - SQL connector and read-only guards:
   8: - `backend/sql_server_connector.py`
  10: - Sync services:
  11: - `backend/services/sql_sync_service.py`
  12: - `backend/services/sql_verification_service.py`
```

### 478. `docs/GOVERNANCE_STATE_MACHINES.md`
- Bytes: `1921`
- Lines: `86`
- SHA256: `757adbb046cf3b1df769d0f1e7266f247456ba2a0aee16898c9be9299ede251b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Governance State Machines
   3: State models extracted from backend workflow code.
   5: ## Session State Machine
   7: Source: `backend/services/session_state_machine.py`
   9: States:
  11: - `OPEN`
  12: - `ACTIVE`
  13: - `PAUSED`
```

### 479. `docs/IMPLEMENTATION_COMPLETE.md`
- Bytes: `2581`
- Lines: `46`
- SHA256: `0b5b3112b1c8e77be5af32202afc9cacd8670ded0982b4876ca077529812e017`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Implementation Complete: Comprehensive System Modernization
   3: **Date**: 2025-12-24
   4: **Status**: All Tasks Complete (Phase 1 - Phase 11)
   6: ## Executive Summary
   7: The "Comprehensive System Modernization and Enhancements" project has been successfully implemented. The system now features optimized search, robust offline synchronization with conflict resolution, enhanced security...
   9: ## Key Deliverables
  11: ### 1. Core Features
  12: -   **Optimized Search**: Server-side debouncing, pagination, and hybrid sorting (Relevance + Alphabetical).
```

### 480. `docs/INTEGRATION_CHECKLIST.md`
- Bytes: `7878`
- Lines: `371`
- SHA256: `c142dbae09b3d524dd13ddc7c8e66ffa6cee05984caafd0e4af6ae9ea3ba3264`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # StockVerify System Integration Checklist
   3: **Date**: December 11, 2025
   4: **Phases Completed**: Phase 1 & Phase 2
   6: ---
   8: ## ✅ Phase 1 & 2 Integration Steps
  10: ### 1. Backend Server Integration
  12: **File**: `backend/server.py`
  14: #### Step 1.1: Add Imports
```

### 481. `docs/INTEGRATION_COMPLETE.md`
- Bytes: `8243`
- Lines: `359`
- SHA256: `3d9771f32b0ddcb392f067c3b39da14fec4b850e4aeb7fea0771241c6b52fbff`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # StockVerify Integration Complete ✅
   3: **Date**: December 11, 2025
   4: **Status**: All phases integrated into existing codebase
   6: ---
   8: ## ✅ Integration Summary
  10: All Phase 1-3 components have been successfully integrated into the existing StockVerify codebase.
  12: ### Files Modified
  14: 1. **backend/server.py** - Main server file updated with:
```

### 482. `docs/INTEGRATION_GUIDE.md`
- Bytes: `8014`
- Lines: `389`
- SHA256: `5d11b5c0920ef1598f64602e8a98c7718d5b3fa49b4355d8031b3192d5d6eecd`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ScanScreen`
  - `handleBarcodeCapture`
  - `ScanScreen`
  - `handleVoiceButton`
  - `ScanScreen`
  - `MyComponent`
  - `DashboardScreen`
- Excerpt (first non-empty lines):

```text
   1: # Integration Guide - Phase 0 Features
   3: ## Quick Start
   5: ### 1. Install Dependencies
   7: ```bash
   8: cd frontend
  10: # Required for analytics
  11: npm install react-native-chart-kit react-native-svg
  13: # Required for voice control
```

### 483. `docs/LAN_DEPLOYMENT_PLAN.md`
- Bytes: `11985`
- Lines: `450`
- SHA256: `a280090b9b0f51cc66150265260babb50e5b124871de7f00e29a79bec55bae84`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 484. `docs/MASTER_GOVERNANCE_EXECUTION_PROMPT.md`
- Bytes: `3144`
- Lines: `103`
- SHA256: `6c2e878f21d02032f47a9d96cac6ef93b2e7bf9af558b97d1eef5a3351114a03`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # MASTER GOVERNANCE EXECUTION PROMPT
   3: ## Workflow, Authority, Data-Integrity Control Plane
   5: ## Objective
   7: Establish and enforce a single source of operational truth derived from code. Prevent undocumented behavior, role bleed, illegal state transitions, and data corruption across online and offline flows.
   9: ## Scope
  11: This control prompt applies to all frontend routes, backend APIs, background sync jobs, and database mutations for:
  13: - Authentication and role routing
  14: - Staff workflows
```

### 485. `docs/MOSCOW_GAP_ANALYSIS.md`
- Bytes: `16951`
- Lines: `612`
- SHA256: `354d231b5422b81e7dc4700058ed490cf5136ff9349affe1fff23e92e2d8bc78`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `NotificationService`
- Excerpt (first non-empty lines):

```text
   1: # Final Gap Analysis - MoSCoW Requirements vs Implementation
   3: **Date**: 2026-01-19 20:33 IST
   4: **Version**: 3.0 - Complete MoSCoW Analysis
   5: **Status**: Post P0 Implementation
   7: ---
   9: ## Executive Summary
  11: **Overall Coverage**: 89% of Must-Have requirements implemented
  12: **P0 Items**: 100% Complete ✅
```

### 486. `docs/NEW_COMPONENTS_GUIDE.md`
- Bytes: `7054`
- Lines: `365`
- SHA256: `ce490b123ad6879b32889c1afd7c7b6bb55e7aa5eaf97f426877b07d3b86d733`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `MyComponent`
  - `ScanScreen`
  - `handleScan`
  - `ScanScreen`
  - `handleVoiceButton`
  - `provideFeedback`
- Excerpt (first non-empty lines):

```text
   1: # New Components Usage Guide
   3: ## Phase 2: Design System Components
   5: ### Badge Component
   7: Display status indicators, counts, and labels.
   9: ```tsx
  10: import { Badge } from '@/components/ui';
  12: // Basic usage
  13: <Badge label="New" />
```

### 487. `docs/NEW_FEATURES_GUIDE.md`
- Bytes: `14046`
- Lines: `591`
- SHA256: `a0f4c59c8476005b978f46b99c8edb17593d991497bb502782aae91bcebbdff1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `TestResult`
  - `TestSuite`
  - `WiFiStatus`
  - `WiFiIndicator`
  - `WiFiStatus`
- Excerpt (first non-empty lines):

```text
   1: # Stock Verification System - New Features Implementation
   3: ## Overview
   4: This document describes the implementation of four major features added to the Stock Verification System:
   5: 1. Error Handling with User and Admin Notifications
   6: 2. Self-Test Code with All Functionality Testing
   7: 3. PIN Login System
   8: 4. WiFi Connection Monitoring
  10: ---
```

### 488. `docs/OFFICIAL_REFERENCES_ALL_IN_ONE.md`
- Bytes: `3710`
- Lines: `146`
- SHA256: `a8a8c43ad641313691c92d018b97772652d40e00f79e8eff34b04b7d1ec07d97`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Official References (All-in-One)
   2: ## Stock Verify System
   4: This file consolidates the **authoritative** external references for this repo into one place.
   6: Source of truth: `docs/REFERENCES.md` (governance rule: only the links listed there are authoritative).
   8: ---
  10: ## Quick Open (matches VS Code tasks)
  11: - FastAPI: https://fastapi.tiangolo.com/
  12: - MongoDB Manual: https://www.mongodb.com/docs/manual/
```

### 489. `docs/P0_COMPLETE_SUMMARY.md`
- Bytes: `7291`
- Lines: `288`
- SHA256: `6c64b6d95f9c192937dcb08c4b446e34860071264f9e2e698d63cb1f846aa7e0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # P0 Implementation - Complete Session Summary
   3: **Date**: 2026-01-19
   4: **Time**: 19:00 - 20:20 IST
   5: **Total Duration**: ~1.5 hours
   6: **Status**: Excellent Progress - 3 P0 items started/completed
   8: ---
  10: ## 🎉 Achievements
  12: ### ✅ COMPLETED
```

### 490. `docs/P0_FINAL_REPORT.md`
- Bytes: `13242`
- Lines: `513`
- SHA256: `a612019783db8d216f9428b28b61333ea0df7e13477b07f26db2fdf5a30b1958`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # 🎉 P0 Implementation COMPLETE - Final Report
   3: **Date**: 2026-01-19
   4: **Time**: 19:00 - 20:30 IST
   5: **Total Duration**: 1.5 hours
   6: **Status**: ✅ **ALL P0 ITEMS COMPLETE**
   8: ---
  10: ## 🏆 Mission Accomplished
  12: ### P0 Status: 100% COMPLETE ✅
```

### 491. `docs/P0_IMPLEMENTATION_PROGRESS.md`
- Bytes: `7088`
- Lines: `265`
- SHA256: `5b13e35bea5ce6b5c79fcb60c3a3c095a0a36d109170ae294b0ee95c4f483a34`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # P0 Implementation Progress Report
   3: **Date**: 2026-01-19
   4: **Session**: Sprint 1 - P0 Critical Items
   5: **Status**: In Progress
   6: **Last Updated**: 19:52 IST
   8: ---
  10: ## Summary
  12: Implementation of P0 critical requirements is progressing well. Backend for FR-M-30 is now **complete**.
```

### 492. `docs/P0_SESSION_SUMMARY.md`
- Bytes: `5914`
- Lines: `213`
- SHA256: `e59e550d236b4f02d4769b01aeb93e64018d20b6dbe860a4f1acb1d4af9c4926`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # P0 Implementation - Session 1 & 2 Summary
   3: **Date**: 2026-01-19
   4: **Time**: 19:00 - 20:10 IST
   5: **Duration**: ~1.5 hours
   6: **Status**: 2 of 4 P0 items complete ✅
   8: ---
  10: ## 🎉 Completed Items
  12: ### ✅ FR-M-30: Variance Thresholds (6/6 hours) - COMPLETE
```

### 493. `docs/PENDING_WORK.md`
- Bytes: `1121`
- Lines: `36`
- SHA256: `745262c6ae505f29934b062fab1a079d843359257a73254572276bbc5042b073`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # 📋 Pending Work Summary (v2.1 Post-Upgrade)
   3: ## ✅ Completed Operational Enhancements
   5: ### 1. **Automated Backup Scheduling**
   7: - **Status:** Complete
   8: - **Description:** Scheduled daily backups at 2 AM using `backend/backup.Dockerfile` and `docker-compose.yml`.
  10: ### 2. **Enhanced Health Checks**
  12: - **Status:** Complete
  13: - **Description:** `/health/detailed` endpoint now returns disk space and memory usage.
```

### 494. `docs/PERFORMANCE_AUDIT.md`
- Bytes: `4149`
- Lines: `153`
- SHA256: `52f284fb88a2d3c13e239c25ae0ba5bd0c7f80c6a1fea6f6db13a87f7c08f4e8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Performance Audit Report
   3: ## Stock Verification App - Bundle Analysis
   5: **Date**: January 2025
   6: **Build Time**: ~10s (Web bundle)
   7: **Total Modules**: 1,785
   9: ---
  11: ## Bundle Composition
  13: ### 1. JavaScript Bundle
```

### 495. `docs/PHASE_0_INVENTORY.md`
- Bytes: `1742`
- Lines: `51`
- SHA256: `7b5b495b948cbe5e1629b685bc13d7954e0f1d78c32721f8c77e346ceeed82b2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Phase 0: Inventory & Discovery (Stock Verification System)
   3: ## 1. Environment & Architecture
   5: - **Frontend**: React Native (Expo) - Mobile & Web
   6: - **Backend**: Python FastAPI
   7: - **Database (App)**: MongoDB (Dataverse equivalent)
   8: - **Source ERP**: SQL Server 2019 (Polosys ERP)
   9: - **Integration**: Direct SQL Connection via `pyodbc`, managed by `SQLSyncService`.
  11: ## 2. Table Inventory (MongoDB Collections)
```

### 496. `docs/PHASE_1_UPGRADE_GUIDE.md`
- Bytes: `8352`
- Lines: `405`
- SHA256: `765de18bf5684314cd34323f773d00d3c0097c9e965ee763ba2d8d4a5615fdeb`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Phase 1: Foundation & Dependencies Upgrade Guide
   3: ## Overview
   5: This guide covers upgrading the core dependencies and establishing a solid foundation for future development.
   7: ## Pre-Upgrade Checklist
   9: - [ ] Create backup of current codebase
  10: - [ ] Commit all pending changes
  11: - [ ] Create feature branch: `git checkout -b upgrade/phase-1-dependencies`
  12: - [ ] Run full test suite to establish baseline
```

### 497. `docs/PHASE_2_IMPLEMENTATION_LOG.md`
- Bytes: `8928`
- Lines: `388`
- SHA256: `0c57c44aef135aac3721b18d06c0bbf270acb402c4b493509ef2755dbbd10d63`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Phase 2: Rack & Session Management - Implementation Log
   3: **Date**: December 11, 2025
   4: **Status**: Complete ✅
   6: ---
   8: ## Overview
  10: Phase 2 implements the rack-based workflow with multi-user concurrency support. Users can now claim racks, maintain sessions with automatic heartbeats, and sync data in batches with conflict detection.
  12: ---
  14: ## ✅ Completed Components
```

### 498. `docs/PHASE_3_IMPLEMENTATION_LOG.md`
- Bytes: `11624`
- Lines: `516`
- SHA256: `b09197a1c1e7680b864066c0326d8acb92436a221abe310b37e65531f2e93839`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Phase 3: Reporting & Snapshots - Implementation Log
   3: **Date**: December 11, 2025
   4: **Status**: Complete ✅
   6: ---
   8: ## Overview
  10: Phase 3 implements the enterprise-grade reporting engine with query builder, snapshots, exports, and comparison tools. Users can now create custom reports, save snapshots, export to multiple formats, and compare data ...
  12: ---
  14: ## ✅ Completed Components
```

### 499. `docs/PRODUCTION_DEPLOYMENT.md`
- Bytes: `3978`
- Lines: `152`
- SHA256: `d96350853544783e8538ce320e541f9995478c92854e3f573fd79725463f0a16`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Production Deployment Guide
   3: > Stock Verification System
   5: ---
   7: ## Prerequisites
   9: - Docker & Docker Compose installed
  10: - MongoDB 6.0+
  11: - Node.js 18+ (for frontend builds)
  12: - Python 3.11+ (for local backend development)
```

### 500. `docs/PRODUCTION_DEPLOYMENT_GUIDE.md`
- Bytes: `20441`
- Lines: `893`
- SHA256: `c932f5e5f306dc6c9a582c757d21c6ab2cb359ae0a8442a8cd96fd8363aca14c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # 🚀 Production Deployment Guide - Stock Verify v2.1
   3: **Last Updated**: December 2025
   4: **Version**: 2.1
   5: **Status**: Production Ready
   7: ---
   9: ## 📋 Table of Contents
  11: 1. [Pre-Deployment Checklist](#pre-deployment-checklist)
  12: 2. [Infrastructure Requirements](#infrastructure-requirements)
```

### 501. `docs/PRODUCTION_DEPLOYMENT_PLAN.md`
- Bytes: `13627`
- Lines: `526`
- SHA256: `3a87bfcce2b68946b5f3b7f31c30ba76b12c2d92db6061fde55f9fea3ba0fdf9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # 🚀 Production Deployment Plan - Stock Verify v2.1
   3: **Version:** 1.0
   4: **Date:** December 2025
   5: **Purpose:** Step-by-step guide to provision production infrastructure and complete deployment
   7: ---
   9: ## 📋 Pre-Deployment Checklist
  11: ### Prerequisites
  12: - [ ] Server specifications meet requirements (see below)
```

### 502. `docs/PRODUCTION_READINESS_CHECKLIST.md`
- Bytes: `14148`
- Lines: `532`
- SHA256: `0268ed23847c5fc8144426b3e943a69e011551a7a4e2bdb42ace85511ada2cbc`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # ✅ Production Readiness Checklist - Stock Verify v2.1
   3: **Last Updated**: December 2025
   4: **Version**: 2.1
   5: **Purpose**: Final verification before production deployment
   7: ---
   9: ## 📊 Quick Status Overview
  11: | Category | Status | Progress |
  12: |----------|--------|----------|
```

### 503. `docs/PRODUCTION_STATUS_SUMMARY.md`
- Bytes: `11191`
- Lines: `346`
- SHA256: `e4a5cafd24593aec6f506c8daf9648157991dfc06df26d67f08461cbd4b02559`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # 📊 Stock Verify v2.1 - Production Status & Recommendations Summary
   3: **Date**: December 2025
   4: **Version**: 2.1
   5: **Assessment Type**: Production Readiness & Feature Planning
   7: ---
   9: ## 🎯 Executive Summary
  11: Stock Verify v2.1 is a **mature, well-architected inventory management system** that is **95% production-ready**. The application demonstrates strong code quality, comprehensive testing, and modern security practices....
  13: **Overall Assessment: PRODUCTION READY** ✅
```

### 504. `docs/PROJECT_REPORT.md`
- Bytes: `7488`
- Lines: `161`
- SHA256: `6078604deffe1eca29512515222074d588653a881fa50e797b7899bb435f0bce`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Stock Verify (v2.1) - Project Report
   3: ## 1. Comprehensive Project Summary
   5: **Stock Verify** is a mission-critical inventory management and verification system designed for hybrid database environments. It bridges legacy ERP systems (SQL Server) with modern, offline-first mobile capabilities ...
   7: ### 🏗 Architecture
   9: * **Hybrid Database Model**:
  10:   * **MongoDB (Primary)**: Handles application state, sessions, stock counts, and user management. Acts as the write-master for the application.
  11:   * **SQL Server (ERP)**: Treated as a **Read-Only** source of truth for product catalogs, batches, and warehouse data.
  12: * **Backend**: **FastAPI** (Python 3.10+) providing a high-performance, async REST API. It handles data synchronization, authentication, and business logic.
```

### 505. `docs/QUICK_FIX_SESSION_ERROR.md`
- Bytes: `3665`
- Lines: `147`
- SHA256: `83aa40086bc11d842a8e46d0d849f9fcc88fe9d9059e7a2ae74faee2a88edc3c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ensureActiveSession`
- Excerpt (first non-empty lines):

```text
   1: # Quick Fix Guide - Session Not Found Error
   3: ## Problem
   5: The app is showing "Session not found" error when trying to create count lines.
   7: ## Root Cause
   9: The frontend is trying to create a count line without an active session. Sessions must be created first before counting items.
  11: ## Solution Options
  13: ### Option 1: Create a Session First (Recommended)
  15: 1. Open the app at `http://localhost:8081`
```

### 506. `docs/QUICK_REFERENCE.md`
- Bytes: `5954`
- Lines: `313`
- SHA256: `4594c26d33b2966452dd84aaa4a91e445ddeeb90d96099ab4666ffc165c74132`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Quick Reference: New Features
   3: ## 🚀 Quick Integration (5 minutes)
   5: ### 1. Copy Files
   6: ```bash
   7: # Frontend services
   8: cp frontend/src/services/{errorRecovery,pinAuth,wifiConnectionService,selfTestService}.ts your-app/
  10: # Backend API
  11: cp backend/api/error_reporting_api.py your-app/backend/api/
```

### 507. `docs/QUICK_START.md`
- Bytes: `6014`
- Lines: `346`
- SHA256: `8beb1bc556dcdb5062904b567290078f38025a379f124d679cda260b24c7d856`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # StockVerify - Quick Start Guide
   3: **Version**: 2.0.0 (Phase 1-3 Complete)
   4: **Date**: December 11, 2025
   6: ---
   8: ## 🚀 Quick Start (5 Minutes)
  10: ### Prerequisites
  12: - Python 3.11+
  13: - Node.js 18+
```

### 508. `docs/README_SECURITY_FIX.md`
- Bytes: `4506`
- Lines: `146`
- SHA256: `92dfb53fde8480e3c3640369a145ffc495ae43929a38d0a88f321ee32d7b8570`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # 🔒 Security Fixes Applied
   3: ## What Was Fixed
   5: ### 1. ✅ Removed Committed Secrets
   6: - Deleted `backend/.env` (contained JWT secrets and SQL password)
   7: - Deleted `frontend/.env`
   8: - Created `.env.example` templates for both
  10: ### 2. ✅ Fixed Code Quality Issues
  11: - **backend/services/reporting/export_engine.py**: Fixed bare `except:` clause with proper exception handling
```

### 509. `docs/RECOMMENDATIONS_IMPLEMENTED.md`
- Bytes: `4865`
- Lines: `178`
- SHA256: `bdfbaba559a1665da724099fda256095d3956aae118dacbde2917db6c5c96fa7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Recommendations Implementation Summary
   3: **Date:** December 30, 2025
   4: **System:** Stock Verification System
   5: **Status:** ✅ Implemented
   7: ## ✅ Completed Recommendations
   9: ### 1. Logs Directory Created
  10: - **Action:** Created `logs/` directory for centralized logging
  11: - **Status:** ✅ Complete
```

### 510. `docs/REFERENCES.md`
- Bytes: `3938`
- Lines: `159`
- SHA256: `4e4384d80e7707a10ea9d088901f06dc66def4fba9c2d933d3b58a45a83e0bf9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Official References (All-in-One)
   2: ## Stock Verify System
   4: This file lists the **authoritative** external references for this repo.
   6: Blogs, tutorials, or unofficial sources are NOT considered valid references.
   8: ---
  10: ## Quick Open (matches VS Code tasks)
  11: - FastAPI: https://fastapi.tiangolo.com/
  12: - MongoDB Manual: https://www.mongodb.com/docs/manual/
```

### 511. `docs/REQUIREMENTS_GAP_ANALYSIS.md`
- Bytes: `17841`
- Lines: `547`
- SHA256: `4879f586234b078496146d72dafec2a57635a8bea8edfeae48f10db7ec01e91c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Requirements Gap Analysis: Power Platform Spec vs Current Implementation
   3: **Date:** 2026-01-19
   4: **Version:** 1.0
   5: **Status:** Analysis Complete
   7: ---
   9: ## Executive Summary
  11: This document maps the **35 Must-Have Functional Requirements (FR-M-01 to FR-M-35)** from the Power Platform specification against the **current FastAPI + React Native implementation**.
  13: ### Key Findings
```

### 512. `docs/REQUIREMENTS_GAP_ANALYSIS_V2.md`
- Bytes: `14298`
- Lines: `467`
- SHA256: `f2b83b05f8429b0b15104eb82c9a7868e2d9d798c2b5952eb84fd57ee4dd69bc`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Updated Requirements Gap Analysis - Post Implementation
   3: **Date**: 2026-01-19 20:22 IST
   4: **Version**: 2.0 (Post P0 Implementation)
   5: **Status**: 50% P0 Complete
   7: ---
   9: ## Executive Summary
  11: After implementing 50% of P0 requirements, this updated analysis shows:
  13: - **30/35 (86%)** Must-Have requirements now implemented or in progress
```

### 513. `docs/SCAN_SCREEN_INTEGRATION_EXAMPLE.md`
- Bytes: `9140`
- Lines: `375`
- SHA256: `8e4334965206c6a9f894fc94ee2210c0df7a19d9c3fe4956213d55476bcff98d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `handleVoiceCommand`
  - `processBarcode`
  - `handleManualScan`
  - `handleSubmit`
  - `handleCancel`
  - `showSuccessToast`
  - `showErrorToast`
- Excerpt (first non-empty lines):

```text
   1: # Scan Screen Integration Example
   3: ## Complete Integration of Phase 0 Features
   5: This example shows how to integrate all Phase 0 features into the scan screen.
   7: ```tsx
   8: // frontend/app/staff/scan.tsx
   9: import React, { useState, useRef, useCallback } from 'react';
  10: import { View, StyleSheet, Alert } from 'react-native';
  11: import { CameraView } from 'expo-camera';
```

### 514. `docs/SECRETS.md`
- Bytes: `7509`
- Lines: `325`
- SHA256: `4b88d2bc53358f146b4923c3fcdf03e32999aa22180faf397f7160840d55bdfa`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Settings`
  - `__init__`
  - `get_secret`
- Excerpt (first non-empty lines):

```text
   1: # Secrets Management Guide
   3: ## Overview
   5: This document outlines the secrets management approach for the Stock Verification System. All sensitive configuration values must follow these practices to ensure security and auditability.
   7: ---
   9: ## 🔐 Secret Categories
  11: ### 1. Application Secrets
  13: | Secret | Purpose | Required |
  14: |--------|---------|----------|
```

### 515. `docs/SECURITY_AUDIT.md`
- Bytes: `4957`
- Lines: `179`
- SHA256: `30d78e4b3f8053ff16a28f4e77dc1c47ceae99e24d0c2ba9800ae500e83078f8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Security Audit Report
   3: ## Stock Verification API - Security Analysis
   5: **Date**: January 2025
   6: **Tool**: Bandit Python Security Linter
   7: **Scope**: Backend API code (api/, auth/, core/, db/, middleware/, models/, services/, utils/, scripts/)
   9: ---
  11: ## Executive Summary
  13: | Severity | Count | Risk Level |
```

### 516. `docs/SECURITY_REMEDIATION_STEPS.md`
- Bytes: `8099`
- Lines: `326`
- SHA256: `d3e37c7bff7018cb38995297f5ba7ea5b1954a674fb0b2dfc6f6886717fae385`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # 🔒 CRITICAL SECURITY REMEDIATION STEPS
   3: ## ⚠️ IMMEDIATE ACTION REQUIRED
   5: Your repository has committed secrets that need to be rotated and removed from Git history.
   7: ---
   9: ## Step 1: Rotate All Secrets (DO THIS FIRST)
  11: ### Generate New Secrets
  13: ```bash
  14: # Navigate to backend directory
```

### 517. `docs/SQL_SERVER_SETUP_GUIDE.md`
- Bytes: `7852`
- Lines: `366`
- SHA256: `157c4bff0bf4923f6f2cc475e1c033149fe689478ea6cb7e08fed35a49361ee9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # SQL Server Connection & Data Sync Guide
   3: ## Quick Start (Automated)
   5: **Option 1: Interactive Prompt**
   6: ```bash
   7: ./scripts/setup_sql_and_sync.sh
   8: ```
   9: The script will prompt you for credentials interactively.
  11: **Option 2: Command Line Arguments**
```

### 518. `docs/SQL_SETUP_INDEX.md`
- Bytes: `6489`
- Lines: `274`
- SHA256: `aee7fdbc7ad01c025d69296193706601fc4e9c685ed14b1a75c46b4459af9e18`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # SQL Server Setup - Documentation Index
   3: ## 📋 Quick Navigation
   5: ### 🚀 Getting Started (Choose One)
   7: **Option 1: Fastest - Automated Setup** (⏱️ 5 minutes)
   8: - File: `scripts/setup_sql_and_sync.sh`
   9: - Command: `./scripts/setup_sql_and_sync.sh`
  10: - Includes: Connection testing, sync verification, error handling
  11: - Best for: Most users
```

### 519. `docs/SQL_SETUP_QUICK_REFERENCE.txt`
- Bytes: `8283`
- Lines: `142`
- SHA256: `16c1fe36ea52b0c71c5a20d502ded86e2098e97dbc76520e0b0595e42fed833e`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 520. `docs/SRS.md`
- Bytes: `9803`
- Lines: `180`
- SHA256: `395792e56bd24640c52d739d0e5e17b4810e7dace8b48c41f38f561d0e7b8588`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Software Requirements Specification (SRS)
   2: **Project:** Stock Verify System
   3: **Version:** 2.1
   4: **Date:** December 23, 2025
   5: **Status:** Approved
   7: ---
   9: ## 1. Introduction
  11: ### 1.1 Purpose
```

### 521. `docs/STAGED_REFACTOR_BLUEPRINT.md`
- Bytes: `5880`
- Lines: `175`
- SHA256: `64c671863f3afa2df37b4a8da331039930fe746cffa198ea4e6cfd777221055f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Staged Refactor Blueprint (Backend + Frontend)
   3: ## Goal
   5: Reduce architecture risk and maintenance cost without changing business behavior, especially governance-critical SQL verification and sync flows.
   7: ## Hard Constraints
   9: Do not modify these files in Phases 1-3 unless explicitly running a governance remediation stream:
  11: - `backend/services/sql_verification_service.py`
  12: - `backend/services/sql_sync_service.py`
  13: - `backend/api/item_verification_api.py`
```

### 522. `docs/STARTUP_GUIDE.md`
- Bytes: `3763`
- Lines: `153`
- SHA256: `0e442401aa4770dff6a23813ebf26c3dc9a9680d8e9f4a31b96d289a7a70d4ed`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Stock Verification System - Startup Guide
   3: ## ✅ Completed & Fixed
   4: - ✅ Expo QR Code generated: `frontend/expo-qr.png`
   5: - ✅ MongoDB Docker container running with replica set
   6: - ✅ Backend server successfully tested and running on port 8001
   7: - ✅ Frontend (Expo) successfully tested and running on port 8081
   8: - ✅ All services can communicate with each other
  10: ## 🚀 Fixed Issues
```

### 523. `docs/START_HERE.md`
- Bytes: `10424`
- Lines: `419`
- SHA256: `81dcfb60d6d102508976629136a7b86747acd8519f6ff5ba8355aa4b5a5a60b3`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # 🎵 Start Here: Your Vibe Coding Journey
   3: **Welcome to Stock Verify!** You asked for guidance as a vibe coder. Here's your personalized roadmap.
   5: ---
   7: ## 🎯 TL;DR - Do This Now
   9: 1. **Read This First:** [QUICK_START_VIBE_CODING.md](QUICK_START_VIBE_CODING.md) (⚡ 2 hours to first commit)
  10: 2. **Then Read:** [VIBE_CODING_NEXT_STEPS.md](VIBE_CODING_NEXT_STEPS.md) (📚 Complete guide)
  11: 3. **Visualize:** [VISUAL_ROADMAP.md](VISUAL_ROADMAP.md) (🗺️ See the big picture)
  12: 4. **Start Coding!** Follow the quick start guide
```

### 524. `docs/STOCK_VERIFY_2.1_cursor_rules.md`
- Bytes: `2334`
- Lines: `91`
- SHA256: `849226ac05aa69796975f9808dde5fd8a4055465052846ac14d5e006c0f75317`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # STOCK_VERIFY_2.1 Cursor Rules
   3: **Version:** 2.1
   4: **Last Updated:** 2025-11-30
   5: **Scope:** Backend (FastAPI) • Frontend (React Native + Expo) • Admin Panel (Web)
   6: **Deployment Mode:** Local Network Only
   8: ---
  10: ## 🧠 Purpose
  12: Defines **governance and operational rules** for STOCK_VERIFY_2.1 development, ensuring all AI-assisted or manual changes are safe, verified, and fully tested.
```

### 525. `docs/STUDY_GUIDE_AGENTS_AND_VSCODE.md`
- Bytes: `2207`
- Lines: `72`
- SHA256: `80172f0785660519f933512208efe98b354e232171463111c08f64205c3247bd`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Study Guide: Agents + VS Code Workspace (Stock Verify)
   3: This guide is a single place to find “agent” docs and the VS Code workspace setup in this repo.
   5: ## 1) Agent Docs (AI helpers)
   7: ### 1.1 CrewAI / Multi-agent scripts (local Python)
   8: - Entry docs: `agents/README.md`
   9: - Code:
  10:   - `agents/stock_verify_crew.py`
  11:   - `agents/requirements.txt`
```

### 526. `docs/TECHNICAL_SPECIFICATION.md`
- Bytes: `10541`
- Lines: `481`
- SHA256: `b0b946643daa4b264621be6b105a0b468f8ef2372eaac7cc34ca89ffed816773`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # StockVerify – Technical & Functional Requirements Specification (Offline Sync + Reporting)
   3: **Version 1.0 – Lavanya Mart**
   5: ## Table of Contents
   7: 1. [Introduction](#1-introduction)
   8: 2. [System Overview](#2-system-overview)
   9: 3. [Architecture Summary](#3-architecture-summary)
  10: 4. [Functional Requirements](#4-functional-requirements)
  11:    - 4.1 [Stock Verification Workflow](#41-stock-verification-workflow)
```

### 527. `docs/TESTING_GUIDE.md`
- Bytes: `1635`
- Lines: `69`
- SHA256: `2ca4072066a61ecb7dc3323c929f786730570872584bd9790b4f38ca0e48a324`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Testing Guide - Stock Verify
   3: This guide covers automated tests, prerequisites, and operational checks for
   4: enterprise-grade validation.
   6: ## Prerequisites
   8: - Node.js >= 18.18
   9: - Python >= 3.10
  10: - Frontend deps: `cd frontend && npm install`
  11: - Backend deps: `python -m pip install -r backend/requirements.txt`
```

### 528. `docs/THEME_SYSTEM_V2.md`
- Bytes: `7687`
- Lines: `314`
- SHA256: `e6bc60105b0f779714d1e7f99e188a0ba5d79de408d5a1386115373eafacf7ca`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ThemeKey`
  - `ThemeMode`
  - `PatternType`
  - `LayoutArrangement`
  - `MyComponent`
- Excerpt (first non-empty lines):

```text
   1: # UI/UX Upgrade - Theme System v2.0
   3: ## Overview
   5: This document describes the enhanced theme system for the Stock Verification App, featuring:
   6: - **6 Premium Themes**: Light, Dark, Premium, Ocean, Sunset, High Contrast
   7: - **8 Pattern Backgrounds**: Dots, Grid, Waves, Aurora, Mesh, Circuit, Hexagon, None
   8: - **6 Layout Arrangements**: Default, Compact, Spacious, Cards, List, Grid
   9: - **3 Theme Modes**: Light, Dark, System (auto-detect)
  11: ---
```

### 529. `docs/UI_MIGRATION_PLAN.md`
- Bytes: `4863`
- Lines: `115`
- SHA256: `9a8dc82a119c4877ca4cd6ac1c9d908adfaeedb824eff0d259dab2727dafde01`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # UI/UX Component Migration Plan
   3: ## 🎯 Objective
   4: Modernize the Stock Verify application's user interface by adopting industry-standard libraries for better performance, consistency, and visual appeal. This plan outlines the migration from custom/legacy implementatio...
   6: ## 📦 Core Library Recommendations
   8: | Category       | Current Implementation                   | Recommended Library                                           | Benefit                                                   |
   9: | -------------- | ---------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------- |
  10: | **Charts**     | Custom / Unused `react-native-chart-kit` | **`react-native-svg-charts`**                                 | Better customization, SVG support, lighter weight.        |
  11: | **Images**     | Mixed `Image` / `expo-image`             | **`expo-image`** (Standardize)                                | Best-in-class caching, performance, and blurhash support. |
```

### 530. `docs/UPGRADE_IMPLEMENTATION_LOG.md`
- Bytes: `10148`
- Lines: `433`
- SHA256: `e6d48818b502f996d9b291c87b336c879bcbae01a1cc42412325a32a409f82db`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # StockVerify System Upgrade - Implementation Log
   3: **Date**: December 11, 2025
   4: **Status**: Phase 1 - Foundation & Infrastructure (In Progress)
   6: ---
   8: ## ✅ Completed Components
  10: ### 1. Redis Service (`backend/services/redis_service.py`)
  12: **Purpose**: Connection pooling and Redis utilities
  14: **Features**:
```

### 531. `docs/USER_REQUIREMENTS_REPORT.md`
- Bytes: `3315`
- Lines: `53`
- SHA256: `4215a1087fc450211d2d1a509bd6e3e0736276e71bb993ba5b84ddf69a4c20d0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # User Requirements Report
   2: **Date:** December 21, 2025
   3: **Status:** Implemented & Verified
   5: ## 1. Executive Summary
   6: This report outlines the user requirements gathered and implemented during the recent modernization and audit phase of the Stock Verify application. The focus has been on optimizing the search experience for staff, im...
   8: ## 2. Functional Requirements
  10: ### 2.1 Search & Scanning Logic
  11: **Requirement:** Optimize search behavior to reduce noise and improve speed.
```

### 532. `docs/VIBE_CODING_WORKFLOW.md`
- Bytes: `13077`
- Lines: `374`
- SHA256: `4b0e32963b51c2f6a4ebc8371f5c96d1a64263b9c356fd03b04149e94688dace`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 533. `docs/archive/old_docs/ADDITIONAL_OPTIMIZATIONS.md`
- Bytes: `4906`
- Lines: `215`
- SHA256: `c3ee859fea9f7955a217f19bca01f69dd06f1a216712aab436eba33af075b4f7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Additional Optimization Opportunities
   3: **Date:** 2025-11-28
   4: **Project:** STOCK_VERIFY
   6: ---
   8: ## 🎯 HIGH PRIORITY OPTIMIZATIONS
  10: ### 1. Migrate More FlatLists to FlashList ⭐
  12: #### Files to Migrate:
  13: 1. **`app/supervisor/items.tsx`** (line 299)
```

### 534. `docs/archive/old_docs/ADMIN_WEB_UI_GUIDE.txt`
- Bytes: `1874`
- Lines: `81`
- SHA256: `8f64f49ffb7c062c673fc110e69ae7be59dd6d7680f29ac3d6ea2009dc6c6170`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Admin Web UI - Monitoring, Reporting & Analytics Dashboard
   3: ## Overview
   5: A comprehensive web-based admin dashboard for monitoring system health, generating reports, and analyzing data.
   7: ## Features
   9: ### 1. Overview Dashboard
  10: - System Health Score (visual indicator)
  11: - Key Metrics Cards:
  12:   - Active Users
```

### 535. `docs/archive/old_docs/ADVANCED_DASHBOARD_FEATURES.md`
- Bytes: `9469`
- Lines: `352`
- SHA256: `0e3ee74333dc16ebc97dc922f2e5904028addb1615c933d96d31bb5a62a9bde4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # ✅ Advanced Supervisor Dashboard Features
   3: ## 🎉 Implementation Complete!
   5: The supervisor dashboard has been upgraded with powerful new features for enhanced session management, analytics, and bulk operations.
   7: ---
   9: ## 🎯 Feature 1: Filter & Sort System
  11: ### Capabilities:
  12: - **Filter by Status**: ALL, OPEN, CLOSED, RECONCILE
  13: - **Sort Options**: Date, Variance, Items
```

### 536. `docs/archive/old_docs/ANALYSIS_REPORT.md`
- Bytes: `3306`
- Lines: `150`
- SHA256: `7e781b24d1bffb4013fc1a7a7be5057ca096a53d1c3821ce5d2c29ec97040ba5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Use Cases & Issues Analysis Report
   3: **Date:** 2025-11-29
   4: **Project:** STOCK_VERIFY
   5: **Analysis Method:** Comprehensive Code Review
   7: ---
   9: ## 🎯 USE CASES IDENTIFIED
  11: ### 1. Authentication & Authorization (3 use cases)
  12: - UC-001: User Login Flow
```

### 537. `docs/archive/old_docs/API_BACKEND_UPGRADE_SUMMARY.md`
- Bytes: `6800`
- Lines: `267`
- SHA256: `9d6285ed53a389142330f9f5cdf225dfba1a57421da9cc349189161368d48430`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # API & Backend Upgrade Summary
   3: **Date:** 2025-11-29
   4: **Status:** ✅ Complete
   6: ---
   8: ## 🎉 Upgrades Completed
  10: ### 1. Enhanced Connection Pool ✅
  12: **File:** `backend/services/enhanced_connection_pool.py`
  14: **Features:**
```

### 538. `docs/archive/old_docs/API_CONTRACTS.md`
- Bytes: `4975`
- Lines: `276`
- SHA256: `ef58d576d6a86bd2cd38c71dc1ac73ef9a8d3c7264b498d9af45bc44e9299dd6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # API Contracts Documentation
   3: **Version:** 1.0
   4: **Last Updated:** 2025-01-12
   5: **Purpose:** API contract definitions for Cursor AI context
   7: ## Base Configuration
   9: - **Backend URL:** `http://localhost:8000` (development)
  10: - **API Prefix:** `/api/v1` (most endpoints)
  11: - **Authentication:** JWT Bearer token in `Authorization` header
```

### 539. `docs/archive/old_docs/API_REFERENCE.md`
- Bytes: `18839`
- Lines: `823`
- SHA256: `796290209437d2597478d549368b1d2c1612b3ee633d5b361959f7b0843df32f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `StockVerifyAPI`
  - `StockVerifyClient`
  - `__init__`
  - `create_item`
  - `verify_stock`
- Excerpt (first non-empty lines):

```text
   1: # Stock Verification System - API Reference
   3: Version: 2.0.0
   5: ## Overview
   7: The Stock Verification System API provides endpoints for:
   8: - **Authentication & Authorization**: User registration, login, JWT token management
   9: - **Item Management**: CRUD operations for inventory items with barcode support
  10: - **Stock Verification**: Recording and tracking stock counts with discrepancy detection
  11: - **Reporting**: Analytics and reporting capabilities for inventory management
```

### 540. `docs/archive/old_docs/ARCHITECTURE.md`
- Bytes: `5102`
- Lines: `150`
- SHA256: `378f340eae19f9d95f3069e87106308045e6fa6750f9db193c9979e5f7daf221`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # STOCK_VERIFY Architecture Documentation
   3: **Version:** 1.0
   4: **Last Updated:** 2025-01-12
   5: **Purpose:** Context seed for Cursor AI to understand system architecture
   7: ## System Overview
   9: STOCK_VERIFY is a full-stack stock verification application built for ERPNext integration, supporting both mobile (React Native/Expo) and web interfaces.
  11: ### Tech Stack
  13: - **Backend:** Python 3.10+, FastAPI, MongoDB, SQL Server (read-only ERPNext connection)
```

### 541. `docs/archive/old_docs/ARCHITECTURE_CORRECTED.md`
- Bytes: `12538`
- Lines: `443`
- SHA256: `c9b8ff223b64616f8fe30cb8ecaea21ec0c13904601d2f0b8495ab3c9452903b`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 542. `docs/archive/old_docs/AUTO_COMMIT_GUIDE.md`
- Bytes: `5521`
- Lines: `263`
- SHA256: `6a1a549f857914182dfcef35cbe301398a4f70e89505ca09e0c62dcaaf852d6e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # 🤖 Auto-Commit System
   3: This repository includes automated Git commit scripts to streamline your workflow.
   5: ---
   7: ## 📜 Available Scripts
   9: ### 1. **auto-commit.ps1** - Full Auto-Commit with Details
  10: **What it does:**
  11: - ✅ Checks for changes
  12: - 📦 Stages all changes (`git add .`)
```

### 543. `docs/archive/old_docs/AWESOME_CURSORRULES_EXPLORATION.md`
- Bytes: `9754`
- Lines: `419`
- SHA256: `50fa2c80ba2600c10cf68557172d17d9b61828956d57ec8e043f30902a48d34f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Awesome Cursor Rules - Exploration Summary
   3: ## 📚 Repository Overview
   5: **Source:** https://github.com/PatrickJS/awesome-cursorrules
   6: **Total Rules:** 170+ cursor rule templates
   7: **Purpose:** Enhance Cursor AI editor with project-specific best practices
   9: ---
  11: ## 🎯 Most Relevant Rules for STOCK_VERIFY_2
  13: ### 1. **React Native Expo Rules**
```

### 544. `docs/archive/old_docs/CODEBASE_ANALYSIS.md`
- Bytes: `38802`
- Lines: `1251`
- SHA256: `ea09a17610c1db0f4c3bd5c5914181785e9d91d38f181ef0b47faa43a9e88098`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # STOCK_VERIFY_2 - Comprehensive Codebase Analysis
   3: **Generated:** 2025-01-29
   4: **Version:** 1.0.0
   5: **Status:** Active Development
   6: **Last Updated:** 2025-01-29
   8: ---
  10: ## 📋 Table of Contents
  12: 1. [Executive Summary](#executive-summary)
```

### 545. `docs/archive/old_docs/CODING_STANDARDS.md`
- Bytes: `10196`
- Lines: `455`
- SHA256: `95377cabd437fc0cec59e88bc7b3ee7932cc7a0aa7034a5bae9d3e3944e0b468`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `get_item_by_barcode`
  - `Item`
  - `getItemByBarcode`
  - `ItemCardProps`
- Excerpt (first non-empty lines):

```text
   1: # 📋 Coding Standards & Best Practices
   3: **Version:** 1.0
   4: **Last Updated:** 2025-11-06
   5: **Applies To:** Stock Verification ERPNext Custom App
   7: ---
   9: ## 🎯 Overview
  11: This document defines coding standards, conventions, and best practices for the Stock Verification application. All code should adhere to these standards for consistency, maintainability, and quality.
  13: ---
```

### 546. `docs/archive/old_docs/COMPREHENSIVE_TODO_PLAN.md`
- Bytes: `45287`
- Lines: `1995`
- SHA256: `249a87bdb9b4523b5a1cd340f071776dc1fc8b5146884402a7af0a8fb9d328d3`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Comprehensive TODO Plan - STOCK_VERIFY Project
   3: **Date:** 2025-11-28
   4: **Status:** Active Development
   6: ---
   8: ## ✅ COMPLETED TASKS
  10: ### Phase 1: Storybook Setup ✅
  11: - [x] Install Storybook dependencies
  12: - [x] Create Storybook configuration (`.storybook/main.ts`, `preview.tsx`)
```

### 547. `docs/archive/old_docs/CREDENTIALS.md`
- Bytes: `694`
- Lines: `39`
- SHA256: `a20fe7579a9c0b75be2b8f0226f09b24a9b11d238416cd55b535320226da25ec`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Login Credentials
   3: ## Default User Credentials
   5: ### Staff User
   6: - **Username**: `staff1`
   7: - **Password**: `staff123`
   8: - **Role**: staff
  10: ### Supervisor User
  11: - **Username**: `supervisor`
```

### 548. `docs/archive/old_docs/DATA_ENRICHMENT_WORKFLOW.md`
- Bytes: `22663`
- Lines: `643`
- SHA256: `4f1a8790f774ca10c9fd1a5dd0495186efaffc85c43c7d269824d079b2910d4e`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 549. `docs/archive/old_docs/DEPLOYMENT_ARCHITECTURE.md`
- Bytes: `21637`
- Lines: `579`
- SHA256: `f069c9fc0962d82494c369cf14af2ec8d08081ec0354fe1cb70db42f9ca97b0d`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 550. `docs/archive/old_docs/DEPLOYMENT_GUIDE.md`
- Bytes: `19059`
- Lines: `881`
- SHA256: `1c159d1645c0627df9eb11829f6470572bfe85e322834b73222ca4eea8800e3d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Production Deployment Guide
   3: ## 🚀 Quick Start
   5: ### Prerequisites
   6: - Docker & Docker Compose installed
   7: - Domain name configured (yourdomain.com)
   8: - SSL certificates (Let's Encrypt recommended)
   9: - Access to production servers
  11: ### 1. Initial Setup
```

### 551. `docs/archive/old_docs/DEVELOPMENT_RULES.md`
- Bytes: `9871`
- Lines: `479`
- SHA256: `14402a2e1c50acb11d52054a3be28ed325fc0c08c33d7a93002e3edc721a8739`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # 🛡️ Development Rules & Testing Protocol
   3: **Version**: 1.0
   4: **Date**: 2025-11-12
   5: **Status**: ACTIVE - Must Follow
   7: ---
   9: ## 🎯 Core Principle
  11: **NEVER modify code without testing and verification. All changes must be validated to ensure they do not negatively impact existing functionality.**
  13: ---
```

### 552. `docs/archive/old_docs/DOCKER.md`
- Bytes: `1508`
- Lines: `42`
- SHA256: `410290fdb317a18bdc77b0151662bf04dfafb92a846e868f89c6e0a57c33ef8b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ## Docker Deployment
   3: ### 1. Requirements
   5: - [Docker Desktop](https://www.docker.com/products/docker-desktop/)
   6: - 2+ GB free disk space for MongoDB volume
   8: ### 2. Configuration
  10: 1. Copy `backend/.env.docker` to include any secrets (JWT, SQL creds, etc.). Defaults already point the backend at the Mongo service.
  11: 2. If you need the frontend to call a different API host, set `EXPO_PUBLIC_API_URL` in a `.env` file (Docker Compose automatically loads it).
  13: ### 3. Build & Run
```

### 553. `docs/archive/old_docs/DYNAMIC_FIELDS_AND_REPORTS_GUIDE.md`
- Bytes: `16068`
- Lines: `636`
- SHA256: `3f4a7ee5405d97dc7d04cf7ba4f95c175f7107478020fb347958d23855738451`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `getFieldDefinitions`
  - `setFieldValue`
  - `generateReport`
  - `downloadReport`
- Excerpt (first non-empty lines):

```text
   1: # Dynamic Fields & Report Generation System
   3: ## 🎯 Overview
   5: A comprehensive system for adding custom fields to items dynamically and generating custom reports with flexible configurations.
   7: ---
   9: ## 📋 Table of Contents
  11: 1. [Dynamic Fields System](#dynamic-fields-system)
  12: 2. [Database Mapping](#database-mapping)
  13: 3. [Dynamic Report Generation](#dynamic-report-generation)
```

### 554. `docs/archive/old_docs/DYNAMIC_SYSTEMS_INTEGRATION_CHECKLIST.md`
- Bytes: `13801`
- Lines: `551`
- SHA256: `85cc1ecfff4013771522f927911f47c0b85d473bb3587932161bfa98420693c9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Dynamic Systems Integration Checklist
   3: ## ✅ Completed Tasks
   5: ### Backend Services
   6: - ✅ **DynamicFieldsService** (520 lines)
   7:   - Field definition management (CRUD)
   8:   - Field value management with validation
   9:   - Database mapping functionality
  10:   - Field statistics and analytics
```

### 555. `docs/archive/old_docs/FEATURES_ROADMAP.md`
- Bytes: `1686`
- Lines: `88`
- SHA256: `0799942ca6a4305c378f7fb35488254283708a0b6959c82c2a7c3c2fd8e417e4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Features & Improvements Roadmap
   3: **Date:** 2025-11-28
   4: **Project:** STOCK_VERIFY
   6: ---
   8: ## 🎯 QUICK REFERENCE
  10: ### Critical Features (Do First) ⭐⭐⭐
  11: 1. Enhanced offline support
  12: 2. Real-time ERPNext sync
```

### 556. `docs/archive/old_docs/FILE_STRUCTURE.md`
- Bytes: `12099`
- Lines: `361`
- SHA256: `a21ddf312748d8829da3afff46a9c28a3f4ffef5f9ac8daa489bc42484370a40`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # STOCK_VERIFY - Complete File Structure Documentation
   3: **Version:** 1.0
   4: **Last Updated:** 2025-11-28
   5: **Purpose:** Comprehensive documentation of the codebase structure
   7: ---
   9: ## 📋 Table of Contents
  11: 1. [Project Overview](#project-overview)
  12: 2. [Root Directory Structure](#root-directory-structure)
```

### 557. `docs/archive/old_docs/FINAL_SUMMARY.md`
- Bytes: `3206`
- Lines: `127`
- SHA256: `95d30ac2fbab09c21c7f16e1bc88ca41f723f06db3b42d19cf7cdb569c698d9e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Final Summary - Repository Analysis & Optimizations
   3: **Date:** 2025-11-28
   4: **Project:** STOCK_VERIFY
   6: ---
   8: ## ✅ COMPLETED WORK
  10: ### 1. Storybook Installation ✅
  11: - Installed Storybook with React support
  12: - Created configuration files
```

### 558. `docs/archive/old_docs/FRONTEND_DOCUMENTATION.md`
- Bytes: `5862`
- Lines: `228`
- SHA256: `a6b1717ca8844636e8c33d4855f15135faa54e6b17108fbc303353050c32101d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Frontend Documentation - Stock Verification System
   3: **Version:** 1.0.0
   4: **Last Updated:** 2025-01-28
   5: **Framework:** React Native + Expo Router
   6: **Platform:** iOS, Android, Web
   8: ## Overview
  10: The Stock Verification System frontend is a cross-platform React Native application built with Expo Router. It provides a comprehensive solution for inventory management and stock counting operations with support for ...
  12: ### Key Characteristics
```

### 559. `docs/archive/old_docs/FRONTEND_FLOWCHART.md`
- Bytes: `12093`
- Lines: `366`
- SHA256: `584b19149a69e90d8abd4a98850a878b49b86ee74bd58c62a50c38698a9bdd6a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Frontend Application Flow Chart
   3: This document contains comprehensive flowcharts for the frontend application using Mermaid diagram syntax.
   5: ## Viewing the Flowcharts
   7: These flowcharts use Mermaid syntax and can be viewed in:
   8: - GitHub (renders automatically)
   9: - VS Code with Mermaid extension
  10: - Online Mermaid editors (https://mermaid.live)
  11: - Documentation tools that support Mermaid
```

### 560. `docs/archive/old_docs/FRONTEND_UPGRADE_NOTES.md`
- Bytes: `2960`
- Lines: `95`
- SHA256: `f974c9bf425a45708f4e534dfe41226111c080867860775b13fcbb46930e142c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Frontend Upgrade & Cleanup Notes (Nov 27, 2025)
   3: This document summarizes the current frontend environment, the safe upgrade path, the cleanup performed in this pass, and verification steps.
   5: ## Current Stack (from `frontend/package.json`)
   7: - Expo SDK: `~54.0.25`
   8: - React Native: `0.81.5`
   9: - React: `19.1.0`
  10: - Expo Router: `~6.0.15`
  11: - TypeScript: `~5.9.2`
```

### 561. `docs/archive/old_docs/IMPLEMENTATION_PROGRESS.md`
- Bytes: `4204`
- Lines: `165`
- SHA256: `4981b266d751a5061a5c01ad2cb0dfc75c9eb2dcc2659990f299d6b31bb96528`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Implementation Progress
   3: **Date:** 2025-11-28
   4: **Status:** In Progress
   6: ---
   8: ## ✅ COMPLETED IMPLEMENTATIONS
  10: ### Phase 4: Performance Optimizations ✅
  12: #### 4.1.1 Migrate items.tsx to FlashList ✅
  13: - **File:** `frontend/app/supervisor/items.tsx`
```

### 562. `docs/archive/old_docs/IMPLEMENTATION_STATUS.md`
- Bytes: `3683`
- Lines: `136`
- SHA256: `faf62afee420b00bcacbe4157c9ef5338b3909387a121f8adcfba6aeead2707d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Implementation Status Report
   3: **Date:** 2025-11-28
   4: **Status:** In Progress
   6: ---
   8: ## ✅ ALREADY COMPLETED (Verified)
  10: ### Phase 4: Performance Optimizations ✅
  11: - ✅ **items.tsx → FlashList** - Already migrated (line 299)
  12: - ✅ **variances.tsx → FlashList** - Already migrated (line 280)
```

### 563. `docs/archive/old_docs/IMPLEMENTATION_SUMMARY.md`
- Bytes: `3195`
- Lines: `119`
- SHA256: `5e66600b7163adad67f562602effdc632a8213502184c4a6119192eab004d624`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Implementation Summary - Phase 18.1 Complete ✅
   3: **Date:** 2025-11-28
   4: **Phase:** 18.1 - Design System Foundation
   5: **Status:** ✅ COMPLETED
   7: ---
   9: ## 🎉 What Was Implemented
  11: ### 1. Design Tokens System ✅
  12: **File:** `frontend/theme/designTokens.ts`
```

### 564. `docs/archive/old_docs/INTEGRATION_PROGRESS.md`
- Bytes: `4352`
- Lines: `145`
- SHA256: `77422924651d82654dfff3cf5483e01a99c8b908f8f6d0df54c1dacb194889c9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Scan.tsx Integration Progress
   3: **Date:** 2025-11-29
   4: **Status:** ✅ Hooks Integrated | ⏳ Components Integration In Progress
   6: ---
   8: ## ✅ Completed Integration
  10: ### 1. Imports Updated
  11: - ✅ Added imports for extracted components from `@/components/scan`
  12: - ✅ Added imports for custom hooks from `@/hooks/scan`
```

### 565. `docs/archive/old_docs/ISSUES_REPORT.md`
- Bytes: `6204`
- Lines: `261`
- SHA256: `51d16a76f1955fd532571455533c66cf376f8528cb3b82ac67c1b9478df884eb`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # STOCK_VERIFY - Issues Report
   3: **Generated:** 2025-11-28
   4: **Status:** Comprehensive codebase analysis
   6: ---
   8: ## 🔴 CRITICAL ISSUES
  10: ### 1. **Hardcoded Credentials in Scripts** ⚠️ SECURITY RISK
  12: **Location:** `backend/scripts/update_to_sql_auth.ps1`
  14: **Issue:**
```

### 566. `docs/archive/old_docs/LIBRARIES_INSTALLED.md`
- Bytes: `1077`
- Lines: `45`
- SHA256: `bd191baa857f5dedb46fa68ef8e372f0d78977f97c8a45f3f12eeeabc4fdc286`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # ✅ Libraries Installed & Configured
   3: **Date:** 2025-11-28
   5: ---
   7: ## 🎉 ALL THREE LIBRARIES INSTALLED!
   9: ### 1. ✅ React Native MMKV
  10: - **Status:** Installed & Enabled
  11: - **Performance:** 30x faster than AsyncStorage
  12: - **Ready to use:** Yes
```

### 567. `docs/archive/old_docs/OPTIMIZATION_SUMMARY.md`
- Bytes: `2481`
- Lines: `104`
- SHA256: `280663140cc1d08491da2228c4de3067de6d33f75f790249c7f01647e6b5e171`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Optimization Summary
   3: **Date:** 2025-11-28
   4: **Project:** STOCK_VERIFY
   6: ---
   8: ## ✅ COMPLETED OPTIMIZATIONS
  10: ### 1. ✅ Migrated DataTable to FlashList
  11: **File:** `frontend/components/DataTable.tsx`
  13: **Changes:**
```

### 568. `docs/archive/old_docs/OTHER_REPOS_ANALYSIS.md`
- Bytes: `6213`
- Lines: `213`
- SHA256: `52fa8654b1e69bef8a3f0ba33dd7641f6c9729b0ded5063e45a630e409143378`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Other Repositories & Libraries Analysis
   3: **Date:** 2025-11-28
   4: **Project:** STOCK_VERIFY - Stock Verification System
   6: ---
   8: ## 📊 Previously Analyzed Repos
  10: ### ✅ Already Installed/Integrated
  11: 1. **react-hook-form** ✅ INSTALLED (v7.52.1)
  12: 2. **Storybook** ✅ JUST INSTALLED
```

### 569. `docs/archive/old_docs/OTHER_USEFUL_REPOS.md`
- Bytes: `8150`
- Lines: `345`
- SHA256: `03a20c03ccc3550cd3e6770acca96f54433cce36b1c44fbdf49c5a64e870784e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Other Useful Repositories & Libraries
   3: **Date:** 2025-11-28
   4: **Project:** STOCK_VERIFY
   6: ---
   8: ## 📊 CURRENT STACK ANALYSIS
  10: ### ✅ Already Installed (Excellent Choices!)
  11: - **expo-barcode-scanner** ✅ - Barcode scanning
  12: - **expo-camera** ✅ - Camera access
```

### 570. `docs/archive/old_docs/PENDING_WORK.md`
- Bytes: `4646`
- Lines: `172`
- SHA256: `47dd7464ccd8de0f95b12cab801913a759b55a402fb73b0d577acb36502d5bb1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # 📋 Pending Work Summary
   3: ## 🔴 High Priority - TODO Items
   5: ### 1. **Security Dashboard** (Status: Pending)
   6: **Location:** `frontend/app/admin/security.tsx` (NOT CREATED YET)
   7: **Priority:** High
   8: **Estimated Time:** 2-3 hours
  10: **Features to Implement:**
  11: - Failed login attempts tracking
```

### 571. `docs/archive/old_docs/PRODUCT_SPECIFICATION.md`
- Bytes: `12317`
- Lines: `387`
- SHA256: `3c7a3bd199fc3568761d44b94f4249aed51d2f34a2e8449f65ed52bc927e8395`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # STOCK_VERIFY Product Specification Document
   3: **Version:** 2.0
   4: **Last Updated:** 2025-01-12
   5: **Status:** Production Ready
   6: **Target ERPNext Version:** v15+
   8: ---
  10: ## Table of Contents
  12: 1. [Executive Summary](#executive-summary)
```

### 572. `docs/archive/old_docs/PRODUCT_SPECIFICATION.txt`
- Bytes: `22759`
- Lines: `811`
- SHA256: `c44a416f9225588e51734e97cbb00ee11e75425a21c7da8fe6dc8d22d2731a5b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # STOCK_VERIFY Product Specification Document
   3: **Version:** 2.0
   4: **Last Updated:** 2025-01-12
   5: **Status:** Production Ready
   6: **Target ERPNext Version:** v15+
   8: ---
  10: ## Table of Contents
  12: 1. Executive Summary
```

### 573. `docs/archive/old_docs/QUICK_START.md`
- Bytes: `2543`
- Lines: `116`
- SHA256: `9355a3f139673d5084eebf362b5371dfe2f3f44744c7bd6005a46f247484db67`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # 🚀 Quick Start Guide
   3: ## ✅ Application Status
   5: Both servers are **starting** in the background:
   6: - ✅ **Backend Server**: Python process running (PID: 17956)
   7: - ✅ **Frontend Server**: Node/Expo processes running (Multiple PIDs)
   9: ## 📍 Access Points
  11: Once fully started, you can access:
  13: 1. **Backend API**: http://localhost:8001
```

### 574. `docs/archive/old_docs/REFACTORING_SUMMARY.md`
- Bytes: `5060`
- Lines: `217`
- SHA256: `c27d50047327e414c90556d649178188fbf87639f834218d44c8357c41675d8a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Scan.tsx Refactoring Summary
   3: **Date:** 2025-11-29
   4: **Status:** ✅ Complete
   5: **Original File Size:** 4951 lines
   6: **Extracted:** ~2500+ lines
   8: ---
  10: ## 🎉 Refactoring Complete!
  12: All 5 phases have been successfully completed, extracting over 2500 lines of code into reusable components and hooks.
```

### 575. `docs/archive/old_docs/REPOS_SUMMARY.md`
- Bytes: `2118`
- Lines: `84`
- SHA256: `35fa16cf683fd01306dfa0afab75ae755d359abe504526ef2b42987710485c89`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Repository Analysis Summary
   3: **Date:** 2025-11-28
   4: **Project:** STOCK_VERIFY
   6: ---
   8: ## ✅ EXCELLENT NEWS: You Already Have Most Libraries!
  10: ### Already Installed & Working:
  11: 1. ✅ **react-hook-form** (v7.52.1) - Form handling
  12: 2. ✅ **Storybook** - Component documentation (just installed)
```

### 576. `docs/archive/old_docs/REPO_ANALYSIS.md`
- Bytes: `1399`
- Lines: `58`
- SHA256: `1816cf1f84bf4b7ab24060ec1b6ad9ac8e6211f51029b18aa57cea42c2348e30`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Repository Analysis & Recommendations
   3: **Date:** 2025-11-28
   4: **Project:** STOCK_VERIFY - Stock Verification System
   6: ---
   8: ## 📊 Summary
  10: ### ✅ ALREADY IN USE
  11: 1. **react-hook-form** ✅ INSTALLED & WORKING
  12:    - Version: 7.52.1
```

### 577. `docs/archive/old_docs/RUN_APP.md`
- Bytes: `5340`
- Lines: `274`
- SHA256: `c67a246b6d728d4d439c7ef2b70648ebe9901f1580ce97f84bc6be0eb15dfbdd`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # 🚀 How to Run the Stock Count Application
   3: ## Quick Start
   5: ### Option 1: Use the Startup Scripts (Recommended)
   7: #### Windows PowerShell:
   8: ```powershell
   9: .\start_servers.ps1
  10: ```
  12: #### Windows CMD:
```

### 578. `docs/archive/old_docs/STARTUP_GUIDE.md`
- Bytes: `3896`
- Lines: `145`
- SHA256: `ae413a2498389d81bbe370794a048cd07b45ae41ca5b8b03f60817c39c9a3880`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # 🚀 STOCK VERIFICATION SYSTEM - COMPLETE STARTUP GUIDE
   3: ## 🎯 **SYSTEM OVERVIEW**
   5: Your Stock Verification System has been fully upgraded and is ready to launch with:
   7: ### **🌟 Enhanced Admin Panel** (Port 3000)
   8: - **Professional Dashboard** with real-time system metrics
   9: - **Security Monitoring** with threat detection
  10: - **Performance Analytics** with interactive charts
  11: - **Modern UI** with dark/light theme support
```

### 579. `docs/archive/old_docs/START_SERVICES_GUIDE.md`
- Bytes: `4512`
- Lines: `267`
- SHA256: `aeb7c70a2f9ef6313b4df7552a2288b3d753a9e284a8bd0ec343119470cbdd26`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # 🚀 Start Services Guide
   3: **How to run MongoDB, Backend, and Frontend in separate terminals**
   5: ---
   7: ## 📋 Quick Start
   9: ### Terminal 1: MongoDB
  10: ```bash
  11: cd /Users/noufi1/STOCK_VERIFY
  12: ./scripts/start_mongodb.sh
```

### 580. `docs/archive/old_docs/STORYBOOK_SETUP_COMPLETE.md`
- Bytes: `1236`
- Lines: `52`
- SHA256: `92c2a145a6ab3f072adb148943ea69b3af96787d25d29976a919d463986f4654`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # ✅ Storybook Setup Complete!
   3: ## What Was Installed
   5: 1. ✅ Storybook dependencies (`@storybook/react`, addons)
   6: 2. ✅ Configuration files (`.storybook/main.ts`, `.storybook/preview.tsx`)
   7: 3. ✅ Component stories for:
   8:    - Button (15+ variants)
   9:    - Input (10+ variants)
  10:    - Card (8+ variants)
```

### 581. `docs/archive/old_docs/SUGGESTIONS.md`
- Bytes: `10917`
- Lines: `488`
- SHA256: `e10c45aa238b6667ecd205a03047ef48d72a64ff922cc5d3b45267ad8031a393`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Development Suggestions & Recommendations
   3: **Date:** 2025-11-29
   4: **Based on:** Current codebase analysis and recent upgrades
   6: ---
   8: ## 🎯 Immediate Next Steps (High Priority)
  10: ### 1. Testing & Validation
  11: - [ ] **Test Enhanced Connection Pool**
  12:   - Verify retry logic works correctly
```

### 582. `docs/archive/old_docs/TESTING_GUIDE.md`
- Bytes: `12952`
- Lines: `479`
- SHA256: `4d7fe436029fce2162e8588c88b6a79ee93c6739e69d865a07c80f7b45ca457e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # 🧪 Testing Guide - New Features Integration
   3: **Date:** November 8, 2025
   4: **Status:** ✅ Backend & Frontend Running
   5: **Backend:** http://127.0.0.1:8000
   6: **Frontend:** http://192.168.1.41:8081
   7: **API Docs:** http://127.0.0.1:8000/docs
   9: ---
  11: ## ✅ System Status
```

### 583. `docs/archive/old_docs/TODO_SUMMARY.md`
- Bytes: `1196`
- Lines: `52`
- SHA256: `9807dbe4189e263fb7ec398f7b1978e8e72eb6ad0da0d43fd1c135900da3132a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # TODO Summary - Quick Reference
   3: **Last Updated:** 2025-11-28
   5: ---
   7: ## ✅ DONE (3 Phases)
   9: 1. ✅ Storybook Setup - Complete
  10: 2. ✅ Code Optimizations (DataTable, Modal) - Complete
  11: 3. ✅ Library Installations (MMKV, Lottie, Sentry) - Complete
  13: ---
```

### 584. `docs/archive/old_docs/TROUBLESHOOTING_GUIDE.md`
- Bytes: `19276`
- Lines: `721`
- SHA256: `d8f011d358b04c7537a0f0df1e2894afc5c1ed2729c4bfe76de4c1098a82435b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Stock Verification System - Troubleshooting Guide
   3: ## Overview
   5: This comprehensive troubleshooting guide helps diagnose and resolve common issues in the Stock Verification System. Use this guide for systematic problem resolution and system maintenance.
   7: ## Quick Diagnostic Commands
   9: ### System Health Check
  10: ```bash
  11: # Run comprehensive system check
  12: cd /opt/stock-verification/scripts
```

### 585. `docs/archive/old_docs/UI_UX_ROADMAP.md`
- Bytes: `3398`
- Lines: `167`
- SHA256: `6fa59687ce7d37e4933a568728cdb7138a5a9986fb5e1d2675bce9b50cea29ce`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # UI/UX Upgrade Roadmap
   3: **Date:** 2025-11-28
   4: **Project:** STOCK_VERIFY
   6: ---
   8: ## 🎨 QUICK REFERENCE
  10: ### Critical UI/UX (Do First) ⭐⭐⭐
  11: 1. Design system foundation
  12: 2. Accessibility enhancements
```

### 586. `docs/archive/old_docs/USER_MANUAL.md`
- Bytes: `26351`
- Lines: `1056`
- SHA256: `0269e6f2d016ec25bbd493849298c75a6ae59f186052f9e3ca8dd2da7e1d2de9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Stock Count Application - User Manual
   3: ## Table of Contents
   4: 1. [Introduction](#introduction)
   5: 2. [Getting Started](#getting-started)
   6: 3. [User Roles](#user-roles)
   7: 4. [Staff Dashboard](#staff-dashboard)
   8: 5. [Supervisor Dashboard](#supervisor-dashboard)
   9: 6. [Counting Sessions](#counting-sessions)
```

### 587. `docs/archive/old_docs/USE_CASES_DETAILED.md`
- Bytes: `3212`
- Lines: `185`
- SHA256: `9a3f038fd4b00b55483b079e763898382dc6f77eee5eb951b447093cc238f6fd`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Detailed Use Cases Documentation
   3: ## Authentication Use Cases
   5: ### UC-001: User Login
   6: **Actor:** Staff, Supervisor, Admin
   7: **Flow:**
   8: 1. Open app → Login screen
   9: 2. Enter credentials
  10: 3. Optional: Enable "Remember Me"
```

### 588. `docs/archive/old_docs/WELCOME_SCREEN_GUIDE.md`
- Bytes: `4204`
- Lines: `158`
- SHA256: `4566bb8a866d3e7246cb629095f6785fe477ee62db9af31d0f7212872193dc6b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Welcome Screen Implementation Guide
   3: ## Overview
   4: The Expo app now features a beautiful welcome screen as the entry point for unauthenticated users, instead of going directly to the login page.
   6: ## What Changed
   8: ### New Files Created
   9: - **`frontend/app/welcome.tsx`** - Beautiful welcome screen with feature showcase and demo credentials
  11: ### Modified Files
  12: - **`frontend/app/_layout.tsx`** - Updated navigation logic to route unauthenticated users to welcome screen first
```

### 589. `docs/archive/old_docs/external-repos-memory.md`
- Bytes: `3868`
- Lines: `71`
- SHA256: `eca9cce06d68709401d268e9066e38e527188e2dfd3dd3d745be12a3da082673`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # External Repos — Useful Memory for This App
   3: This document captures actionable takeaways from four external repositories and how they can enhance our Expo React Native + FastAPI + MongoDB/SQL project. Each section includes fit assessment, concrete integration id...
   6: ## GibsonAI/Memori
   8: - Purpose: Memory-centric patterns (user/context "memories", retrieval).
   9: - Fit: Medium — valuable if we add a lightweight "User Notes & Memory" feature for supervisors/staff.
  10: - Use in our app:
  11:   - Data model in MongoDB: `notes` collection keyed by `tenantId`, `userId`, `{ createdAt, tags, body }`.
  12:   - Search: Start with `Fuse.js` fuzzy search (already in dependencies); consider embeddings later if needed.
```

### 590. `docs/codebase_memory_v2.1.md`
- Bytes: `3249`
- Lines: `122`
- SHA256: `43399360efa99d08026edcf8b96d90a6ea170b5448dc8ad8df73936eac11ffa8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # STOCK_VERIFY_2.1 Codebase Memory
   3: **Version:** 2.1
   4: **Generated:** 2025-11-30
   5: **Purpose:** Canonical technical memory for STOCK_VERIFY 2.1 architecture, stacks, flows, and data models.
   7: ---
   9: ## ⚙️ Tech Stack Overview
  11: | Layer | Technology | Version |
  12: |--------|-------------|----------|
```

### 591. `docs/comprehensive-analysis.md`
- Bytes: `11234`
- Lines: `280`
- SHA256: `c0a8739f512350caa6512a0a68a498b5ef2836163e41319eec4441479c4cd7e9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Stock Verify System - Comprehensive Architecture Analysis
   3: **Date**: 2026-01-26
   4: **Scope**: Complete system analysis including architecture, security, performance, and error patterns
   5: **Status**: Production Readiness Assessment
   7: ## Executive Summary
   9: The Stock Verify System demonstrates excellent technical architecture with modern best practices, but requires immediate attention to critical security and infrastructure issues before production deployment.
  11: ### Key Findings
  12: - ✅ **Technical Maturity**: Excellent (5/5) - Modern stack, comprehensive testing
```

### 592. `docs/comprehensive_audit/OPS_READINESS.md`
- Bytes: `1506`
- Lines: `47`
- SHA256: `6fda55b52655bc2bf5f9b2d3ae924f73da2d698552ca3908d9a161bdfef96458`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Operational Readiness
   3: ## 1. Containerization
   5: * **Tool**: Docker Compose
   6: * **Status**: **Ready**
   7: * **Config**: `docker-compose.yml` defines `backend`, `mongo`, `redis`.
   8: * **Gap**: `frontend` is not containerized in the main compose file (likely runs on host or separate build).
   9: * **Action**: Ensure `frontend` build artifacts are served via Nginx container for production.
  11: ## 2. Logging & Observability
```

### 593. `docs/comprehensive_audit/QUALITY_FINDINGS.md`
- Bytes: `1597`
- Lines: `46`
- SHA256: `84097a39033e4098d5c4cc6f431841e147cd7e354f12cbe4d88febe76c6d8ae4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Static Quality Findings
   3: ## Backend (Python)
   5: ### 1. Complexity Hotspots
   7: * **File**: `backend/server.py`
   8:   * **Severity**: Medium
   9:   * **Finding**: Large file (2000+ lines) handling app initialization, routing, and service startup.
  10:   * **Risk**: Hard to maintain, test, and reason about startup order.
  11:   * **Fix**: Refactor service initialization into dedicated `lifespan` handlers or a `create_app` factory in `backend/core/`.
```

### 594. `docs/comprehensive_audit/RELEASE_DECISION.md`
- Bytes: `763`
- Lines: `20`
- SHA256: `00b0bf89e4ab9b37d99bc727ed66197c4625e8f8fc2dc839706fb921af95e38a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Release Decision
   3: ## Status: ⚠️ Ship with Mitigations
   5: ### Justification
   7: The application is functionally sound with a robust architecture (Hybrid DB, Offline-first). However, security configurations regarding network binding and potential script vulnerabilities need immediate addressing be...
   9: ### Required Mitigations (Before Go-Live)
  11: 1. **Network**: Restrict `HOST` binding to internal network or VPN.
  12: 2. **Security**: Verify `discover_tables.py` is not exposed via API.
  13: 3. **Secrets**: Rotate `JWT_SECRET` and ensure it's not default.
```

### 595. `docs/comprehensive_audit/REMEDIATION_BACKLOG.md`
- Bytes: `1108`
- Lines: `32`
- SHA256: `72e21da399cfb72fa248abb6092db2bf29e8d131c69af618ef2c62eda0aba8e2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Remediation Backlog
   3: ## P0: Critical (Immediate Action)
   5: 1. **[Security] Fix 0.0.0.0 Binding**:
   6:    * **Action**: Update `backend/server.py` and `docker-compose.yml` to bind to `127.0.0.1` by default, or strictly control firewall.
   7:    * **Owner**: DevOps
   8: 2. **[Security] Audit `discover_tables.py`**:
   9:    * **Action**: Review for SQL injection and restrict access.
  10:    * **Owner**: Backend Lead
```

### 596. `docs/comprehensive_audit/SECURITY_RISK_REGISTER.md`
- Bytes: `2059`
- Lines: `60`
- SHA256: `9f346841e8292a1217c37fe3924574fab73451de983faa53e6f548d66a866b77`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Security Risk Register
   3: ## 1. Network Exposure
   5: * **ID**: SEC-001
   6: * **Finding**: Application binds to `0.0.0.0` by default.
   7: * **File**: `backend/server.py`, `backend/config.py`
   8: * **Severity**: **High** (if exposed to public internet) / Low (if behind reverse proxy/VPN).
   9: * **Exploit**: Attacker on the same network can access API directly, bypassing firewall rules intended for the reverse proxy.
  10: * **Remediation**:
```

### 597. `docs/comprehensive_audit/SYSTEM_MAP.md`
- Bytes: `2213`
- Lines: `61`
- SHA256: `163255f1f9af0c1fcf1874cc792a22dfbc42afb9deff51e260dad6faa5b383af`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # System Architecture Map
   3: ## 1. Components
   5: ### Backend Services
   7: * **Core API**: FastAPI application (`backend/server.py`) running on port 8001.
   8: * **Database Connector**: Custom SQL Server connector (`backend/sql_server_connector.py`) for ERP integration.
   9: * **Sync Engine**: `AutoSyncManager` (`backend/services/auto_sync_manager.py`) for background data synchronization.
  10: * **Monitoring**: `MonitoringService` (`backend/services/monitoring_service.py`) for metrics and health.
  12: ### Frontend Applications
```

### 598. `docs/comprehensive_audit/TEST_PLAN.md`
- Bytes: `1650`
- Lines: `49`
- SHA256: `98c0e26ca4becf61cef7297d9384f2b773641a945a5b042fd34f9da8850a3a24`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Test Plan
   3: ## 1. Unit Tests (Backend)
   5: **Tool**: `pytest`
   6: **Coverage Target**: 80%
   8: ### Critical Paths
  10: * **Auth**: `backend/tests/test_auth.py` - Verify JWT generation, validation, and expiration.
  11: * **Barcode Validation**: `backend/tests/test_barcode_validation.py` - Test 51/52/53 prefixes, length, and non-numeric inputs.
  12: * **ERP Mapping**: `backend/tests/test_erp_mapping.py` - Verify schema mapping logic.
```

### 599. `docs/comprehensive_audit/WORKFLOW_VALIDATION.md`
- Bytes: `1234`
- Lines: `51`
- SHA256: `1d54d18efae2bb391a2ddf330daee966354489e56069248be0b396300d99ecdc`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Workflow Validation
   3: ## Master Workflow Adherence
   5: ### Phase 1: Repository Intake & System Map
   7: * **Status**: Complete
   8: * **Deliverable**: `SYSTEM_MAP.md`
   9: * **Notes**: Architecture mapped. Hybrid DB model confirmed.
  11: ### Phase 2: Static Quality Gate
  13: * **Status**: Complete
```

### 600. `docs/error-analysis.md`
- Bytes: `16214`
- Lines: `581`
- SHA256: `0263b6c1381728f4ac53f50772f62541a557773fe4926bcb1f9ac0ce245c7025`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Stock Verify System - Comprehensive Error Analysis
   3: **Date**: 2026-01-26
   4: **Scope**: Complete error pattern analysis across all system components
   5: **Purpose**: Identify all possible failure modes and provide remediation guidance
   7: ## Executive Summary
   9: This document identifies **200+ specific failure modes** across the Stock Verify System, categorized into seven major areas. The analysis reveals critical vulnerabilities that could lead to system failures, data corru...
  11: ### Critical Risk Areas
  12: - 🚨 **Security Failures**: 45+ security-related failure modes
```

### 601. `docs/executive-summary.md`
- Bytes: `8977`
- Lines: `244`
- SHA256: `d55bc8ba63008b3b767a2be40653a9a12739709aa424889adc7114e3f9c6888c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Executive Summary - Stock Verify System Health Assessment
   3: **Date**: January 26, 2026
   4: **Prepared By**: OpenCode Analysis Team
   5: **Distribution**: Executive Leadership, Development Team, Security Team, Infrastructure Team
   7: ## Executive Summary Overview
   9: The Stock Verify System demonstrates **excellent technical architecture** with modern engineering practices, but requires **immediate attention to critical security vulnerabilities and infrastructure gaps** before pro...
  11: ### Key Findings at a Glance
  13: | Assessment Area | Score | Status | Critical Issues |
```

### 602. `docs/frontend_migration_report.md`
- Bytes: `3882`
- Lines: `45`
- SHA256: `52eeec91038c4d3439ed6fac41f71b1fa6635fff3954122c3b820efb847ee265`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ## Frontend Migration Readiness Report (Baseline)
   3: ### Current State
   4: - **Architecture**: Multiple theme systems in use (`globalStyles`, `modernDesignSystem`, `auroraTheme`/`ThemeContext`, legacy `useTheme`); duplicated auth/navigation logic across `_layout.tsx`, `app/index.tsx`, `app/w...
   5: - **Tooling/CI**: CI now pinned to Node 18.18.2 and uses `npm ci --ignore-scripts` with `SKIP_POSTINSTALL=true`. `postinstall` still runs `patch-package` if the flag is missing.
   6: - **UX/A11y/Responsive**: Bold visuals but inconsistent tokens; ad-hoc breakpoints; many touchables lack `accessibilityRole/Label`; focus styles absent on web.
   7: - **Testing**: Jest configured; low coverage relative to surface area; limited e2e. Critical flows (auth redirect, session create/resume) lack automated coverage.
   8: - **Observability**: Sentry and a global ErrorBoundary exist; runtime payload validation is minimal.
  10: ### Risks (ordered)
```

### 603. `docs/implementation-plans/P0-FR-M-26-Real-Time-Dashboard.md`
- Bytes: `13928`
- Lines: `469`
- SHA256: `082c6842e74447528f02457c3c7c1f09ceb2efa1befeb793bf9b24fdf61d11f2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `DashboardOverview`
  - `QuantityStatus`
  - `ValueStatus`
  - `DashboardBreakdown`
  - `BreakdownItem`
  - `KPICard`
  - `formatCurrency`
  - `formatINR`
- Excerpt (first non-empty lines):

```text
   1: # Implementation Plan: FR-M-26 Real-Time Monitoring Dashboard
   3: **Priority**: P0 - Critical
   4: **Effort Estimate**: 16 hours
   5: **Status**: Not Implemented
   6: **Owner**: TBD
   7: **Target Sprint**: Sprint 1
   9: ---
  11: ## Requirement
```

### 604. `docs/implementation-plans/P0-FR-M-29-Role-Based-Access.md`
- Bytes: `20651`
- Lines: `733`
- SHA256: `219cd882e06f289479097101942bd332aff827b4a2bc265ae25f54929a14ddbf`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Permission`
  - `get_user_permissions`
  - `has_permission`
  - `require_permission`
  - `decorator`
  - `require_role`
  - `decorator`
  - `usePermissions`
  - `hasPermission`
  - `hasRole`
  - `PermissionGateProps`
  - `PermissionGate`
  - `test_admin_has_all_permissions`
  - `test_staff_limited_permissions`
- Excerpt (first non-empty lines):

```text
   1: # Implementation Plan: FR-M-29 Role-Based Access Control
   3: **Priority**: P0 - Critical
   4: **Effort Estimate**: 8 hours
   5: **Status**: Partially Implemented
   6: **Owner**: TBD
   7: **Target Sprint**: Sprint 1
   9: ---
  11: ## Requirement
```

### 605. `docs/implementation-plans/P0-FR-M-30-Variance-Thresholds.md`
- Bytes: `19635`
- Lines: `644`
- SHA256: `202469bda00f8ef77f7ffd5b7d8381c17275bcf4bcdbad855a53a77db607a804`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `VarianceThreshold`
  - `VarianceThresholdConfig`
  - `VarianceService`
  - `__init__`
  - `VarianceWarningProps`
  - `VarianceWarning`
  - `handleSubmit`
- Excerpt (first non-empty lines):

```text
   1: # Implementation Plan: FR-M-30 Variance Thresholds
   3: **Priority**: P0 - Critical
   4: **Effort Estimate**: 6 hours
   5: **Status**: Not Implemented
   6: **Owner**: TBD
   7: **Target Sprint**: Sprint 1
   9: ---
  11: ## Requirement
```

### 606. `docs/implementation-plans/README.md`
- Bytes: `9173`
- Lines: `377`
- SHA256: `56bfd7ce2a55800cf59152de400060140c5b5f6c9c0b4dd3239797e943022a86`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Implementation Plans Index
   3: **Project**: Stock Verification System
   4: **Date**: 2026-01-19
   5: **Status**: Planning Phase
   7: ---
   9: ## Overview
  11: This directory contains detailed implementation plans for closing the gaps identified in the Requirements Gap Analysis. Plans are organized by priority (P0, P1, P2) and include:
  13: - Technical design
```

### 607. `docs/issues/infrastructure-performance.md`
- Bytes: `12783`
- Lines: `475`
- SHA256: `9e86a880bbe49cf39f82e7985c7b1b038a05ab4a7d30f98f01a0636f4d98eae0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `DatabaseManager`
  - `__init__`
  - `CacheManager`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: # Infrastructure and Performance Issues - Issue Report
   3: **Created**: 2026-01-26
   4: **Priority**: 🟠 High
   5: **Affected Components**: Database, Caching, Network, Container Infrastructure
   7: ## Executive Summary
   9: 40+ infrastructure and performance issues identified that could lead to system failures, poor user experience, and scalability problems. Issues span database optimization, resource management, and deployment configura...
  11: ---
  13: ## 🟠 HIGH Priority Issues (Fix Within 3 Days)
```

### 608. `docs/issues/security-vulnerabilities.md`
- Bytes: `8127`
- Lines: `299`
- SHA256: `ef5bd32c563a61288167a452695414216fc9e7516c7d9396962b2e0f9b2c5cdf`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `validate_file_upload`
  - `validate_password_strength`
- Excerpt (first non-empty lines):

```text
   1: # Critical Security Vulnerabilities - Issue Report
   3: **Created**: 2026-01-26
   4: **Priority**: 🔴 Critical
   5: **Affected Components**: Authentication, File Upload, API Endpoints, Database
   7: ## Executive Summary
   9: 15 critical security vulnerabilities identified that require immediate remediation before production deployment. These vulnerabilities could lead to unauthorized access, data breaches, and system compromise.
  11: ---
  13: ## 🔴 CRITICAL Issues (Fix Within 24 Hours)
```

### 609. `docs/refactor-baseline/README.md`
- Bytes: `1944`
- Lines: `71`
- SHA256: `22916699acd1720708aed5898305969f24bcee65cdf50a65a91881a8d8e5d9fc`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Refactor Baseline - Backend App Composition
   3: This folder contains baseline artifacts used to ensure refactors preserve runtime behavior.
   5: ## Artifacts
   7: - `backend-app-snapshot.json`
   8:   - Normalized route inventory (path + methods + name)
   9:   - Middleware order (`app.user_middleware`)
  10:   - Summary counts
  12: ## Current Baseline
```

### 610. `docs/refactor-baseline/backend-app-snapshot.json`
- Bytes: `45797`
- Lines: `2366`
- SHA256: `783eebbc11d280b8aaebd9846939fd0b800332610ddc949e7d91d201fc2b5f4f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "total_routes": 337,
   3:   "middleware_order": [
   4:     "GZipMiddleware",
   5:     "SecurityHeadersMiddleware",
   6:     "CORSMiddleware"
   7:   ],
   8:   "unique_path_method_signatures": 337,
```

### 611. `docs/security_research.md`
- Bytes: `2716`
- Lines: `49`
- SHA256: `41895bd2b8674d6ed2ef3c2f7cc59af7cfb7fd2e7833a521167f5f4dc86e7deb`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Security Research: Request Signing & SSL Pinning
   3: ## Executive Summary
   4: This document evaluates the necessity of implementing Request Signing and SSL Pinning for the Stock Verify application.
   6: **Recommendation:**
   7: - **SSL Pinning:** **DO NOT IMPLEMENT** at this stage.
   8: - **Request Signing:** **DEFER** until external public access is required.
  10: ## 1. SSL Pinning
  12: ### Analysis
```

### 612. `docs/testing_environment.md`
- Bytes: `2739`
- Lines: `65`
- SHA256: `7dda62a2b0bc0a3720fd7530b56a20ddcd717321d95903da569072d7ab3402bd`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Testing Environment Contract
   3: > This document defines all required environment variables for running the Stock Verify 2026 test suite.
   4: > Any test run without these variables **will fail** — this is by design to enforce secure defaults.
   6: ## Required Variables
   8: | Variable | Test Value | Purpose | Required By |
   9: |---|---|---|---|
  10: | `PIN_SALT` | `test-pin-salt-not-for-production` | Salt for PIN lookup hashes (prevents rainbow table attacks) | `utils/crypto_utils.py` |
  11: | `JWT_SECRET` | `test-jwt-secret-key-for-testing-only` | JWT token signing key | `auth/jwt_provider.py` |
```

### 613. `docs/upgrade_prompt_framework.md`
- Bytes: `1221`
- Lines: `66`
- SHA256: `781e41147134f0a5c82c301abeff20dbba6fe824d2fab70ef837d4133d58c922`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # STOCK_VERIFY_2.1 Upgrade Prompt Framework
   3: **Purpose:** Define structured prompts and guardrails for safe system upgrades and AI-assisted development.
   5: ---
   7: ## 🧩 Prompt Template
   9: ```
  11: [UPGRADE ACTION REQUEST]
  12: Goal: <objective>
  13: Scope: <modules>
```

### 614. `docs/verified_coding_policy.md`
- Bytes: `1313`
- Lines: `70`
- SHA256: `46941c5d2e7320e4e328a399508ed18734e5b250bf7750e9588c8cb40c103df0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Verified Coding Policy
   3: **Version:** 2.1
   4: **Last Updated:** 2025-11-30
   6: ---
   8: ## 🧩 Purpose
  10: Ensure that every line of code, whether human or AI-generated, is:
  12: - Verified against official documentation
  13: - Type-safe
```

## frontend

### 615. `frontend/.env.example`
- Bytes: `1688`
- Lines: `35`
- SHA256: `1833dd5869c8528962ea3ef90ffaf73ebd2ca07ebd5a0e69787ea6b078152357`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # ============================================================================
   2: # Stock Verify Frontend - Environment Configuration
   3: # ============================================================================
   4: # SECURITY WARNING: Never commit actual .env files to version control!
   5: # This is a template file. Copy to .env and fill in your actual values.
   6: # ============================================================================
   8: # ----------------------------------------------------------------------------
   9: # Backend Configuration
```

### 616. `frontend/.env.production.example`
- Bytes: `1326`
- Lines: `27`
- SHA256: `33536042fef802f108c01b9e11943a6b49d594f07542040d71ea8f251688faaf`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # ============================================================================
   2: # Stock Verify Frontend - Production Environment
   3: # ============================================================================
   4: # Copy to .env for production builds (EAS Build)
   5: # ============================================================================
   7: # ----------------------------------------------------------------------------
   8: # Backend Configuration (REQUIRED)
   9: # ----------------------------------------------------------------------------
```

### 617. `frontend/.eslintrc.js`
- Bytes: `1123`
- Lines: `49`
- SHA256: `beeec03324941deab41808eb2d4256bf181399309081accfedca6e9b44048932`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: module.exports = {
   2:   extends: "expo",
   3:   plugins: ["import"],
   4:   settings: {
   5:     "import/resolver": {
   6:       typescript: {
   7:         project: [
   8:           "./tsconfig.json",
```

### 618. `frontend/.gitignore`
- Bytes: `271`
- Lines: `20`
- SHA256: `73f4de7d4773c31b7f818cb9c1f8d69758d2a455a5bc11d5e9087a9ed447af0a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   2: # @generated expo-cli sync-2b81b286409207a5da26e14c78851eb30d8ccbd
   3: # The following patterns were generated by expo-cli
   5: expo-env.d.ts
   6: # @end expo-cli
   8: # Expo generated files
   9: .expo/
  11: # Node modules
  12: node_modules/
```

### 619. `frontend/.prettierignore`
- Bytes: `76`
- Lines: `10`
- SHA256: `ff368e00102af1dd715a700c355323c3f5cf9004aafb14e92c73de5a5360783b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: node_modules
   2: .expo
   3: dist
   4: coverage
   5: *.lock
   6: build
   7: android
   8: ios
```

### 620. `frontend/.prettierrc`
- Bytes: `181`
- Lines: `11`
- SHA256: `9bf1111b51ab5f68fe23e8a99de60d6facd7732f99cc28e8bfab1a165d33b69a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "semi": true,
   3:   "singleQuote": false,
   4:   "tabWidth": 2,
   5:   "trailingComma": "es5",
   6:   "printWidth": 100,
   7:   "bracketSpacing": true,
   8:   "arrowParens": "always",
```

### 621. `frontend/Dockerfile`
- Bytes: `453`
- Lines: `24`
- SHA256: `846d025e620de5e0087c40e1ae6d2cdae83b61479434b6288f8e1042282e2ba2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # syntax=docker/dockerfile:1
   3: FROM node:22-bookworm-slim AS build
   5: WORKDIR /app
   7: RUN apt-get update \
   8:     && apt-get install -y --no-install-recommends python3 make g++ \
   9:     && rm -rf /var/lib/apt/lists/*
  11: COPY package.json package-lock.json ./
  12: RUN npm ci --legacy-peer-deps
```

### 622. `frontend/README.md`
- Bytes: `3235`
- Lines: `93`
- SHA256: `7aa5c1761d2cc2398e65b5d8700797479a77932c0cb1439f648e27adb94a584b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Stock Verify - Frontend
   3: This is the mobile frontend for the Stock Verify application, built with **React Native** and **Expo**.
   5: ## 📚 Official Tech Stack
   7: This project adheres to the versions specified in the [Official Documentation Verification](../agents/official-docs-verification.md).
   9: | Framework           | Version    | Official Docs                                                                     |
  10: | ------------------- | ---------- | --------------------------------------------------------------------------------- |
  11: | **Expo SDK**        | `~54.0.29` | [Expo Docs](https://docs.expo.dev/versions/v54.0.0/)                              |
  12: | **React Native**    | `0.81.5`   | [React Native Docs](https://reactnative.dev/docs/0.81/getting-started)            |
```

### 623. `frontend/__tests__/home.test.tsx`
- Bytes: `6274`
- Lines: `192`
- SHA256: `8870ea4e6f10dcef339ed12731d3b2d24eaafc9901656adab7bead56fc016f43`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * @jest-environment jsdom
   3:  */
   4: import React from "react";
   5: import { render } from "@testing-library/react-native";
   7: // Mock ConnectionManager
   8: jest.mock("../src/services/connectionManager", () => ({
   9:   __esModule: true,
```

### 624. `frontend/__tests__/login.test.tsx`
- Bytes: `5363`
- Lines: `169`
- SHA256: `cd2c988e360faa78420a0e6b9655230884652409ca310ade0e7887dc6d4e1dc0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * @jest-environment jsdom
   3:  */
   4: import React from "react";
   5: import "@testing-library/react-native";
   7: // Mock ConnectionManager
   8: jest.mock("../src/services/connectionManager", () => ({
   9:   __esModule: true,
```

### 625. `frontend/__tests__/login_accessibility.test.tsx`
- Bytes: `2720`
- Lines: `87`
- SHA256: `344284c5e3b68429c8085cb66fdabb2daf1b1a58bc29e245c791de25e6711e4c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import React from 'react';
   2: import { render, screen } from '@testing-library/react-native';
   3: import { PinKeypad } from '../src/components/auth/PinKeypad';
   4: import { AccessibilityInfo } from 'react-native';
   6: // Mock AccessibilityInfo
   7: jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
   9: describe('PinKeypad Accessibility', () => {
  10:     const mockOnPinChange = jest.fn();
```

### 626. `frontend/__tests__/staff/home.test.tsx`
- Bytes: `4026`
- Lines: `151`
- SHA256: `58d9af23345f136f26ebc70036599a019fa69136c16e953860a169ee3f4729b7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `MockModal`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { render } from "@testing-library/react-native";
   3: import HomeScreen from "../../app/staff/home";
   5: jest.mock("expo-haptics", () => ({
   6:   selectionAsync: jest.fn(),
   7:   notificationAsync: jest.fn(),
   8:   impactAsync: jest.fn(),
   9: }));
```

### 627. `frontend/android/.gitignore`
- Bytes: `129`
- Lines: `17`
- SHA256: `03263c9a1436e264a87c6e0547007488dc980efb2326724b5a85c0835bac34a7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # OSX
   2: #
   3: .DS_Store
   5: # Android/IntelliJ
   6: #
   7: build/
   8: .idea
   9: .gradle
```

### 628. `frontend/android/app/build.gradle`
- Bytes: `8159`
- Lines: `183`
- SHA256: `cd45c10c7dcdec8c54e76aa764b31cc86a8ba5c597821172502760d4a81e3ff2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: apply plugin: "com.android.application"
   2: apply plugin: "org.jetbrains.kotlin.android"
   3: apply plugin: "com.facebook.react"
   5: def projectRoot = rootDir.getAbsoluteFile().getParentFile().getAbsolutePath()
   7: /**
   8:  * This is the configuration block to customize your React Native Android app.
   9:  * By default you don't need to apply any configuration, just uncomment the lines you need.
  10:  */
```

### 629. `frontend/android/app/debug.keystore`
- Bytes: `2257`
- Lines: `9`
- SHA256: `221e0a3106aa4c3ccc154e0a418b55020b3f9ea6e84f92e8749cd9e2f39f5e58`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 630. `frontend/android/app/proguard-rules.pro`
- Bytes: `562`
- Lines: `15`
- SHA256: `8bd4d7b69a1d78e8322b459b5e8d48234adce7481df04da34c0140d52ffb367a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Add project specific ProGuard rules here.
   2: # By default, the flags in this file are appended to flags specified
   3: # in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
   4: # You can edit the include path and order by changing the proguardFiles
   5: # directive in build.gradle.
   6: #
   7: # For more details, see
   8: #   http://developer.android.com/guide/developing/tools/proguard.html
```

### 631. `frontend/android/app/src/debug/AndroidManifest.xml`
- Bytes: `374`
- Lines: `8`
- SHA256: `fb1795032c764d975376e1612ab7022058eca2268a45efbe731a47a5d3ac0f60`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <manifest xmlns:android="http://schemas.android.com/apk/res/android"
   2:     xmlns:tools="http://schemas.android.com/tools">
   4:     <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
   6:     <application android:usesCleartextTraffic="true" tools:targetApi="28" tools:ignore="GoogleAppIndexingWarning" tools:replace="android:usesCleartextTraffic" />
   7: </manifest>
```

### 632. `frontend/android/app/src/debugOptimized/AndroidManifest.xml`
- Bytes: `374`
- Lines: `8`
- SHA256: `fb1795032c764d975376e1612ab7022058eca2268a45efbe731a47a5d3ac0f60`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <manifest xmlns:android="http://schemas.android.com/apk/res/android"
   2:     xmlns:tools="http://schemas.android.com/tools">
   4:     <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
   6:     <application android:usesCleartextTraffic="true" tools:targetApi="28" tools:ignore="GoogleAppIndexingWarning" tools:replace="android:usesCleartextTraffic" />
   7: </manifest>
```

### 633. `frontend/android/app/src/main/AndroidManifest.xml`
- Bytes: `2549`
- Lines: `39`
- SHA256: `44463010765c117f8583fc38210013a79e029a6b8dd01b55e569ca0f21499a5b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <manifest xmlns:android="http://schemas.android.com/apk/res/android">
   2:   <uses-permission android:name="android.permission.CAMERA"/>
   3:   <uses-permission android:name="android.permission.INTERNET"/>
   4:   <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
   5:   <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
   6:   <uses-permission android:name="android.permission.RECORD_AUDIO"/>
   7:   <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
   8:   <uses-permission android:name="android.permission.USE_BIOMETRIC"/>
```

### 634. `frontend/android/app/src/main/java/com/lavanyamart/stockverify/MainActivity.kt`
- Bytes: `2462`
- Lines: `66`
- SHA256: `1b7a9c13531090ee0db2f50a7e128ef4ba98b437f239e9f847809c6169121362`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `MainActivity`
- Excerpt (first non-empty lines):

```text
   1: package com.lavanyamart.stockverify
   2: import expo.modules.splashscreen.SplashScreenManager
   4: import android.os.Build
   5: import android.os.Bundle
   7: import com.facebook.react.ReactActivity
   8: import com.facebook.react.ReactActivityDelegate
   9: import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
  10: import com.facebook.react.defaults.DefaultReactActivityDelegate
```

### 635. `frontend/android/app/src/main/java/com/lavanyamart/stockverify/MainApplication.kt`
- Bytes: `2040`
- Lines: `57`
- SHA256: `e3e98be0a4edbf15933d5f7b1b86add7d2c3cb18aeb2901e817153fe7c1f4b5b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `MainApplication`
- Excerpt (first non-empty lines):

```text
   1: package com.lavanyamart.stockverify
   3: import android.app.Application
   4: import android.content.res.Configuration
   6: import com.facebook.react.PackageList
   7: import com.facebook.react.ReactApplication
   8: import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
   9: import com.facebook.react.ReactNativeHost
  10: import com.facebook.react.ReactPackage
```

### 636. `frontend/android/app/src/main/res/drawable/ic_launcher_background.xml`
- Bytes: `245`
- Lines: `6`
- SHA256: `51fca95679d075ddbe2b9fe7ad2efb5ef545c5770a9ad6cafe8bf610c18c67be`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <layer-list xmlns:android="http://schemas.android.com/apk/res/android">
   2:   <item android:drawable="@color/splashscreen_background"/>
   3:   <item>
   4:     <bitmap android:gravity="center" android:src="@drawable/splashscreen_logo"/>
   5:   </item>
   6: </layer-list>
```

### 637. `frontend/android/app/src/main/res/drawable/rn_edit_text_material.xml`
- Bytes: `1917`
- Lines: `38`
- SHA256: `738e3aaad53180caba1419a6d5db8465a0742662fe59a4bbaf05f1061cbc3390`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <?xml version="1.0" encoding="utf-8"?>
   2: <!-- Copyright (C) 2014 The Android Open Source Project
   4:      Licensed under the Apache License, Version 2.0 (the "License");
   5:      you may not use this file except in compliance with the License.
   6:      You may obtain a copy of the License at
   8:           http://www.apache.org/licenses/LICENSE-2.0
  10:      Unless required by applicable law or agreed to in writing, software
  11:      distributed under the License is distributed on an "AS IS" BASIS,
```

### 638. `frontend/android/app/src/main/res/mipmap-hdpi/ic_launcher.webp`
- Bytes: `3056`
- Lines: `15`
- SHA256: `ded7aabf6a56b694e486e096efd89e2f0c9067d292b634663898e352c9491f10`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 639. `frontend/android/app/src/main/res/mipmap-hdpi/ic_launcher_round.webp`
- Bytes: `5024`
- Lines: `14`
- SHA256: `21304a0c9b00da6a72cfa31c7229c9528fc17b6e5eb4e68a969bce08c01a2fee`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 640. `frontend/android/app/src/main/res/mipmap-mdpi/ic_launcher.webp`
- Bytes: `2096`
- Lines: `16`
- SHA256: `eef20f25fb1477d8c9df15757e764811cc503fb0777f18d0f7fb2d19178b5bf6`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 641. `frontend/android/app/src/main/res/mipmap-mdpi/ic_launcher_round.webp`
- Bytes: `2858`
- Lines: `20`
- SHA256: `520d05f978a15ba0ccf23006a1a5691a054a02478c70cafc5ebafae76e600f0d`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 642. `frontend/android/app/src/main/res/mipmap-xhdpi/ic_launcher.webp`
- Bytes: `4569`
- Lines: `12`
- SHA256: `e77c5045bfdb6f4bbe955b3a793bfed3baa369ce4811ae2a9103d5480637cfff`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 643. `frontend/android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.webp`
- Bytes: `7098`
- Lines: `30`
- SHA256: `2846e1a703e519791fe22f41bcb243b82f908d12e5ebcb43f020ddf9982780b0`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 644. `frontend/android/app/src/main/res/mipmap-xxhdpi/ic_launcher.webp`
- Bytes: `6464`
- Lines: `37`
- SHA256: `eb3a34b13632e0cb3b1c0f4273035866cbe81b1b17b7178ce29d19c78d394a5e`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 645. `frontend/android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.webp`
- Bytes: `10676`
- Lines: `41`
- SHA256: `363a569beb72e8b007bf046454612148d4c9f782b9391352059fe83179f18e30`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 646. `frontend/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.webp`
- Bytes: `9250`
- Lines: `29`
- SHA256: `9ff27328b6916b7f75b99ef36153f154bb4724946e5654635cba2e257352c69f`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 647. `frontend/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.webp`
- Bytes: `15523`
- Lines: `61`
- SHA256: `5bacd97a1b41e4413c6092cdbd83f65112a9124e823cfaa3a219c65e2761647b`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 648. `frontend/android/app/src/main/res/values-night/colors.xml`
- Bytes: `12`
- Lines: `1`
- SHA256: `c30a9f37e6b34372e1db8c812d64a18719acf7c52c11ff2f7e5e5ed5e05c2072`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <resources/>
```

### 649. `frontend/android/app/src/main/res/values/colors.xml`
- Bytes: `225`
- Lines: `6`
- SHA256: `9022e45275e60fd2209cab732a1bf5566f0c5bbfd999c5316876173c1b1f6434`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <resources>
   2:   <color name="splashscreen_background">#ffffff</color>
   3:   <color name="colorPrimary">#3B82F6</color>
   4:   <color name="colorPrimaryDark">#ffffff</color>
   5:   <color name="activityBackground">#FFFFFF</color>
   6: </resources>
```

### 650. `frontend/android/app/src/main/res/values/strings.xml`
- Bytes: `359`
- Lines: `6`
- SHA256: `4e3b02b01604c2974491a00bc01f4059c0e094c1c19e97ca83787fab03278549`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <resources>
   2:   <string name="app_name">Lavanya Mart Stock Verify</string>
   3:   <string name="expo_splash_screen_resize_mode" translatable="false">contain</string>
   4:   <string name="expo_splash_screen_status_bar_translucent" translatable="false">false</string>
   5:   <string name="expo_system_ui_user_interface_style" translatable="false">automatic</string>
   6: </resources>
```

### 651. `frontend/android/app/src/main/res/values/styles.xml`
- Bytes: `893`
- Lines: `15`
- SHA256: `10507a7ecff2543b6e90d256fde6b31d0ea4cf3d4fba55b07539e979bc232a10`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <resources xmlns:tools="http://schemas.android.com/tools">
   2:   <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
   3:     <item name="android:enforceNavigationBarContrast" tools:targetApi="29">true</item>
   4:     <item name="android:editTextBackground">@drawable/rn_edit_text_material</item>
   5:     <item name="colorPrimary">@color/colorPrimary</item>
   6:     <item name="android:statusBarColor">#ffffff</item>
   7:     <item name="android:windowBackground">@color/activityBackground</item>
   8:   </style>
```

### 652. `frontend/android/build.gradle`
- Bytes: `556`
- Lines: `25`
- SHA256: `bdb916d3fe7085c9e9f3bb45bd5eacb97f5d2c5a2b2af965642f7d904739ca68`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: // Top-level build file where you can add configuration options common to all sub-projects/modules.
   3: buildscript {
   4:   repositories {
   5:     google()
   6:     mavenCentral()
   7:   }
   8:   dependencies {
   9:     classpath('com.android.tools.build:gradle')
```

### 653. `frontend/android/gradle.properties`
- Bytes: `2907`
- Lines: `67`
- SHA256: `628987f64a60dd1a55f1b39a3312a5ffa981d78860a79d193f493021b72f15be`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Project-wide Gradle settings.
   3: # IDE (e.g. Android Studio) users:
   4: # Gradle settings configured through the IDE *will override*
   5: # any settings specified in this file.
   7: # For more details on how to configure your build environment visit
   8: # http://www.gradle.org/docs/current/userguide/build_environment.html
  10: # Specifies the JVM arguments used for the daemon process.
  11: # The setting is particularly useful for tweaking memory settings.
```

### 654. `frontend/android/gradle/wrapper/gradle-wrapper.jar`
- Bytes: `43764`
- Lines: `158`
- SHA256: `7d3a4ac4de1c32b59bc6a4eb8ecb8e612ccd0cf1ae1e99f66902da64df296172`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 655. `frontend/android/gradle/wrapper/gradle-wrapper.properties`
- Bytes: `253`
- Lines: `8`
- SHA256: `7e0821d895908883350587c74476b717016ab416320c44dc82a10def916c6fb5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: distributionBase=GRADLE_USER_HOME
   2: distributionPath=wrapper/dists
   3: distributionUrl=https\://services.gradle.org/distributions/gradle-8.14.3-bin.zip
   4: networkTimeout=10000
   5: validateDistributionUrl=true
   6: zipStoreBase=GRADLE_USER_HOME
   7: zipStorePath=wrapper/dists
```

### 656. `frontend/android/gradlew`
- Bytes: `8744`
- Lines: `252`
- SHA256: `ee038d6f6b21501d34c5eac442aad930fd6b82191f9bb00f1780cc101ca14a68`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/sh
   3: #
   4: # Copyright © 2015-2021 the original authors.
   5: #
   6: # Licensed under the Apache License, Version 2.0 (the "License");
   7: # you may not use this file except in compliance with the License.
   8: # You may obtain a copy of the License at
   9: #
```

### 657. `frontend/android/settings.gradle`
- Bytes: `1278`
- Lines: `40`
- SHA256: `ff08e1d0eb62ea3c68c7c1c274fd27ac7f706d7196a5ebb78a3674df79924a9e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: pluginManagement {
   2:   def reactNativeGradlePlugin = new File(
   3:     providers.exec {
   4:       workingDir(rootDir)
   5:       commandLine("node", "--print", "require.resolve('@react-native/gradle-plugin/package.json', { paths: [require.resolve('react-native/package.json')] })")
   6:     }.standardOutput.asText.get().trim()
   7:   ).getParentFile().absolutePath
   8:   includeBuild(reactNativeGradlePlugin)
```

### 658. `frontend/app.json`
- Bytes: `1440`
- Lines: `49`
- SHA256: `44caf9e08564941605fcc439309e5d24c2a03f52825788bc4f64fbd3581f6055`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "expo": {
   3:     "name": "Lavanya Mart Stock Verify",
   4:     "slug": "lavanya-mart-stock-verify",
   5:     "version": "1.0.0",
   6:     "scheme": "lavanyamart",
   7:     "sdkVersion": "54.0.0",
   8:     "userInterfaceStyle": "automatic",
```

### 659. `frontend/app/+not-found.tsx`
- Bytes: `852`
- Lines: `40`
- SHA256: `30b2ee0f33fc6df3779f9cff792e915ab961eb2b946b557e3afeb929b0c43deb`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import { Link, Stack } from "expo-router";
   2: import { StyleSheet, View, Text } from "react-native";
   4: export default function NotFoundScreen() {
   5:   return (
   6:     <>
   7:       <Stack.Screen options={{ title: "Oops!" }} />
   8:       <View style={styles.container}>
   9:         <Text style={styles.title}>This screen doesn&apos;t exist.</Text>
```

### 660. `frontend/app/_layout.tsx`
- Bytes: `17191`
- Lines: `535`
- SHA256: `5c98a41dc3a30004e76a4a44b6c5aa83a00fc458d771222d563851792e0fe031`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `RootStack`
  - `initialize`
  - `loadingView`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { Platform, View, Text, ActivityIndicator } from "react-native";
   3: import { Stack, useRouter, useSegments } from "expo-router";
   4: import * as SplashScreen from "expo-splash-screen";
   5: import { useFonts } from "expo-font";
   6: import "react-native-reanimated";
   7: import { GestureHandlerRootView } from "react-native-gesture-handler";
   8: import { StatusBar } from "expo-status-bar";
```

### 661. `frontend/app/admin/_layout.tsx`
- Bytes: `2401`
- Lines: `73`
- SHA256: `d93007de708597032d4707e0035776df9d164ebe5b178e40ed15b095f830b842`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Admin Layout - Navigation structure for admin role
   3:  * Features:
   4:  * - Web/Tablet: Sidebar + Stack navigation (AdminSidebar)
   5:  * - Mobile: Stack-based navigation with Aurora design
   6:  * - Custom header with back button and logout
   7:  * - Role-based access protection with local assertion
   8:  * - Persistent sidebar state
```

### 662. `frontend/app/admin/ai-assistant.tsx`
- Bytes: `10070`
- Lines: `294`
- SHA256: `f2746c016ddb3f28b460dea2fd3fd2ae89794301d6a4f5bc172366d9260647b8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Message`
  - `checkStatus`
  - `handleSend`
- Excerpt (first non-empty lines):

```text
   1: import React, { useState, useRef, useEffect } from "react";
   2: import {
   3:     View,
   4:     Text,
   5:     StyleSheet,
   6:     TextInput,
   7:     TouchableOpacity,
   8:     ScrollView,
```

### 663. `frontend/app/admin/control-panel-v2.tsx`
- Bytes: `15770`
- Lines: `584`
- SHA256: `907cf78c0968cbb18f21296b1dd4166aca23b80ee956d97ce1d9b31825a34ece`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `HealthScore`
  - `getColor`
  - `getStatus`
  - `ServiceItem`
  - `onRefresh`
  - `handleServiceAction`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Admin Control Panel v2.0 - Aurora Design
   3:  *
   4:  * Features:
   5:  * - Real-time system health monitoring
   6:  * - Service status management (Backend, Frontend, DB)
   7:  * - Critical issues tracking
   8:  * - System statistics
```

### 664. `frontend/app/admin/control-panel.tsx`
- Bytes: `29426`
- Lines: `1022`
- SHA256: `d4a10580369f49e3662ede37aeeed689e0a76a44e39558435825d4b160e98cc8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ServiceStatus`
  - `ServicesStatus`
  - `handleServiceAction`
  - `formatUptime`
  - `handleCopyUrl`
  - `handleViewLogs`
  - `handleSqlConfig`
  - `renderServiceCard`
- Excerpt (first non-empty lines):

```text
   1: import React, { useState, useEffect, useCallback } from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   StyleSheet,
   6:   ScrollView,
   7:   TouchableOpacity,
   8:   ActivityIndicator,
```

### 665. `frontend/app/admin/dashboard-web.tsx`
- Bytes: `40574`
- Lines: `1382`
- SHA256: `1ec6732110b789b07c1935f388e46aeaf071476f1f966ae6a4c90f851daa6102`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `DashboardTab`
  - `toYMD`
  - `handleGenerateReport`
  - `prepareSessionChartData`
  - `prepareStatusChartData`
  - `handleAutoFix`
  - `renderDiagnosis`
  - `renderOverview`
  - `renderMonitoring`
  - `renderReports`
  - `renderAnalytics`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Admin Dashboard Web v2.0 - Aurora Design System
   3:  *
   4:  * Features:
   5:  * - Real-time system monitoring (Health, Stats, Sessions)
   6:  * - Interactive charts (Line, Bar, Pie)
   7:  * - Detailed reporting engine
   8:  * - Analytics and metrics
```

### 666. `frontend/app/admin/index.tsx`
- Bytes: `196`
- Lines: `10`
- SHA256: `ef36c765cf34af4f44a6eebae2cc19e52cb5a157387ba5edd2d8de0331bbf323`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Admin Index - Default route redirects to dashboard
   3:  */
   5: import { Redirect } from "expo-router";
   7: export default function AdminIndex() {
   8:   return <Redirect href="/admin/dashboard-web" />;
   9: }
```

### 667. `frontend/app/admin/live-view.tsx`
- Bytes: `17215`
- Lines: `584`
- SHA256: `8b8f0e7aacf5a73bd80b467c1cdf5822fd9c2a501f329defcb1ee193c02fe525`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ActiveSession`
  - `formatTimeAgo`
- Excerpt (first non-empty lines):

```text
   1: import React, { useCallback, useMemo, useRef, useState } from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   StyleSheet,
   6:   ScrollView,
   7:   TextInput,
   8:   TouchableOpacity,
```

### 668. `frontend/app/admin/logs.tsx`
- Bytes: `8374`
- Lines: `300`
- SHA256: `4c04a5f85001dbd05e23df6ebbcb473987384ba835613dc4a5e2d655ae7feba7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `service`
  - `loadLogs`
  - `getLevelColor`
- Excerpt (first non-empty lines):

```text
   1: import React, { useState, useEffect } from "react";
   2: import { View, Text, StyleSheet, TextInput } from "react-native";
   3: import { AnimatedPressable, ScreenContainer } from "@/components/ui";
   4: import Ionicons from "@expo/vector-icons/Ionicons";
   5: import { useRouter, useLocalSearchParams } from "expo-router";
   6: import { usePermission } from "../../src/hooks/usePermission";
   7: import { getServiceLogs } from "../../src/services/api";
   8: import { auroraTheme } from "../../src/theme/auroraTheme";
```

### 669. `frontend/app/admin/metrics.tsx`
- Bytes: `28231`
- Lines: `940`
- SHA256: `cf495504aa8a227b59fd76fc83c591006300ca8fb13386cbba1bf9b1e893a0c5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `loadMetrics`
  - `onRefresh`
  - `handleTriggerSync`
  - `formatUptime`
  - `renderMetricCard`
- Excerpt (first non-empty lines):

```text
   1: import React, { useState, useEffect } from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   StyleSheet,
   6:   Alert,
   7:   Platform,
   8:   Dimensions,
```

### 670. `frontend/app/admin/permissions.tsx`
- Bytes: `13691`
- Lines: `474`
- SHA256: `ab7f143492af7285c1b08191a3c8a192872eb089ed31a60c478ea7a2c70ef90d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `loadAvailablePermissions`
  - `loadUserPermissions`
  - `handleAddUserPermission`
  - `handleRemoveUserPermission`
  - `renderPermissionCategories`
  - `getCategoryIcon`
- Excerpt (first non-empty lines):

```text
   1: import React, { useState, useEffect } from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   StyleSheet,
   6:   ScrollView,
   7:   TextInput,
   8:   Alert,
```

### 671. `frontend/app/admin/realtime-dashboard.tsx`
- Bytes: `35163`
- Lines: `1217`
- SHA256: `b7bc491bf9d98c6ccb24914511e317a1ddadf4ee74f754bd1116f6602320c5f1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Column`
  - `DashboardItem`
  - `DashboardStats`
  - `Pagination`
  - `Summary`
  - `formatValue`
  - `initialize`
  - `handleRefresh`
  - `handleColumnToggle`
  - `handleResetColumns`
  - `handleSort`
  - `handlePageChange`
  - `handleItemPress`
  - `handleExportCSV`
- Excerpt (first non-empty lines):

```text
   1: import React, {
   2:   useState,
   3:   useEffect,
   4:   useCallback,
   5:   useMemo,
   6:   useRef,
   7: } from "react";
   8: import {
```

### 672. `frontend/app/admin/reports.tsx`
- Bytes: `8919`
- Lines: `322`
- SHA256: `81ff60c86231eddacd53f25a0b90da4a9c3f8b7e26e21f639428ec7e50b2f7b1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Report`
  - `loadReports`
  - `handleGenerateReport`
  - `getCategoryIcon`
  - `getCategoryColor`
- Excerpt (first non-empty lines):

```text
   1: import React, { useState, useEffect } from "react";
   2: import { View, Text, StyleSheet, Alert, Platform } from "react-native";
   3: import {
   4:   LoadingSpinner,
   5:   AnimatedPressable,
   6:   ScreenContainer,
   7: } from "@/components/ui";
   8: import Ionicons from "@expo/vector-icons/Ionicons";
```

### 673. `frontend/app/admin/security.tsx`
- Bytes: `21151`
- Lines: `731`
- SHA256: `0dc57cc04389dc2b2d00bdfece1c43d599e1e9066bc002ac0bc34a9dd2aa5e36`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `loadData`
  - `renderSummary`
  - `renderFailedLogins`
  - `renderSuspiciousActivity`
  - `renderSessions`
  - `EmptyState`
- Excerpt (first non-empty lines):

```text
   1: import React, { useState, useEffect } from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   StyleSheet,
   6:   ScrollView,
   7:   Alert,
   8:   Platform,
```

### 674. `frontend/app/admin/settings.tsx`
- Bytes: `12511`
- Lines: `435`
- SHA256: `85f1a02a775aef34ecf067efd92ff11a47c1537de2bd187a005b084cce520194`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `loadSettings`
  - `handleSave`
  - `updateSetting`
  - `renderSectionHeader`
  - `renderInput`
  - `renderSwitch`
- Excerpt (first non-empty lines):

```text
   1: import React, { useState, useEffect } from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   StyleSheet,
   6:   ScrollView,
   7:   TouchableOpacity,
   8:   ActivityIndicator,
```

### 675. `frontend/app/admin/sql-config.tsx`
- Bytes: `12757`
- Lines: `435`
- SHA256: `118d1839984c05f47620289624720c79a46587dd66da85a90d67b2f030ce1375`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `loadConfig`
  - `handleTest`
  - `handleSave`
- Excerpt (first non-empty lines):

```text
   1: import React, { useState, useEffect } from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   StyleSheet,
   6:   ScrollView,
   7:   ActivityIndicator,
   8:   Alert,
```

### 676. `frontend/app/admin/unknown-items.tsx`
- Bytes: `10541`
- Lines: `336`
- SHA256: `3710b0826d1e598d5f42706e06e495f7b14b524baf184afb66a826238528ae05`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `loadItems`
  - `handleMap`
  - `handleDelete`
  - `renderItem`
- Excerpt (first non-empty lines):

```text
   1: import React, { useState, useEffect } from "react";
   2: import {
   3:     View,
   4:     Text,
   5:     StyleSheet,
   6:     FlatList,
   7:     Alert,
   8:     Modal,
```

### 677. `frontend/app/admin/users.tsx`
- Bytes: `37378`
- Lines: `1247`
- SHA256: `b99eef3125f0f444eadfcf27e5f7314e3423d1db342673a517c29b74505a7f31`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `User`
  - `UserListResponse`
  - `SortField`
  - `SortOrder`
  - `getRoleBadgeStyle`
  - `getStatusStyle`
  - `normalizedUsers`
  - `handleSort`
  - `handleSelectUser`
  - `handleSelectAll`
  - `handleBulkAction`
  - `handleDeleteUser`
  - `handleToggleStatus`
  - `formatDate`
  - `renderFilters`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * User Management Screen
   3:  * Admin panel for managing users - list, create, edit, delete
   4:  */
   6: import React, { useState, useEffect, useCallback } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 678. `frontend/app/debug.tsx`
- Bytes: `676`
- Lines: `26`
- SHA256: `e76822ac4ed2f87fe499b794a84904585dd5b9011a5ec14f3170a13e8aa2ed5d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { View, Text, Platform } from "react-native";
   4: export default function DebugPage() {
   5:   return (
   6:     <View
   7:       style={{
   8:         flex: 1,
   9:         justifyContent: "center",
```

### 679. `frontend/app/forgot-password.tsx`
- Bytes: `5474`
- Lines: `195`
- SHA256: `74a10f4244c0b38fca770f794c50dec907e0dbd0f994a1f051e64c4f6067016b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `handleRequestOtp`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Forgot Password Screen
   3:  * Initiates the password reset flow via WhatsApp OTP
   4:  */
   6: import React, { useState } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 680. `frontend/app/help.tsx`
- Bytes: `9177`
- Lines: `338`
- SHA256: `d02aa150056372b83257bab7d09fd87db166f39136d41f1da153ef9ad3417ed6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `HelpSection`
  - `HelpItem`
  - `toggleItem`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Help Screen - App documentation and help
   3:  */
   5: import React from "react";
   6: import {
   7:   View,
   8:   Text,
   9:   StyleSheet,
```

### 681. `frontend/app/index.tsx`
- Bytes: `5027`
- Lines: `188`
- SHA256: `86d4504e85c1d23a7b5cd8c28d456d34e741a74e8476ac9e24bd13140f84debc`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SafeAnimatedView`
  - `content`
  - `createStyles`
- Excerpt (first non-empty lines):

```text
   1: import React, { useEffect, useMemo } from "react";
   2: import {
   3:   ActivityIndicator,
   4:   StyleSheet,
   5:   View,
   6:   Text,
   7:   Platform,
   8: } from "react-native";
```

### 682. `frontend/app/login.tsx`
- Bytes: `24026`
- Lines: `800`
- SHA256: `6681e3cd974cbfd9b3dee84b7e2ed7853640d857587befbba582899a274a0fbd`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SafeAnimatedView`
  - `LoginMode`
  - `LoginResult`
  - `getLoginErrorAlert`
  - `warmUp`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Modern Login Screen - Lavanya Mart Stock Verify
   3:  * Clean, accessible login with modern design
   4:  */
   6: import React, { useState, useCallback } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 683. `frontend/app/notifications.tsx`
- Bytes: `8657`
- Lines: `322`
- SHA256: `b6639261b2423aeb14442b46c7abc522d4e4302dde994971c755d606cd692eb8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `handleNotificationPress`
  - `getNotificationIcon`
  - `formatTimeAgo`
  - `renderNotificationItem`
  - `renderEmptyState`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Notifications Screen - Display user notifications
   3:  * Part of FR-M-23: Recount notifications
   4:  */
   5: import React, { useEffect, useState } from "react";
   6: import {
   7:   View,
   8:   Text,
```

### 684. `frontend/app/otp-verification.tsx`
- Bytes: `6458`
- Lines: `232`
- SHA256: `ed53090fcf8aabaea3bb90fab912c5b288065b07c0fe7c311449eb365c5d2fdb`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `formatTime`
  - `handleVerify`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * OTP Verification Screen
   3:  * Verifies the 6-digit code sent via WhatsApp
   4:  */
   6: import React, { useState, useEffect } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 685. `frontend/app/register.tsx`
- Bytes: `15027`
- Lines: `512`
- SHA256: `cf5d6de9ecda25e3ffde44bbfe19635833c81b2561ab5091b342874dc82d38e7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `handleRegister`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   TextInput,
   6:   TouchableOpacity,
   7:   StyleSheet,
   8:   ScrollView,
```

### 686. `frontend/app/reset-password.tsx`
- Bytes: `5758`
- Lines: `200`
- SHA256: `ab2214e4609449472871820b2ecfd7208ccbf68cfbb6306318a0a20bad300396`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `handleReset`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Reset Password Screen
   3:  * Final step: Set new password using the validated reset token
   4:  */
   6: import React, { useState } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 687. `frontend/app/security.tsx`
- Bytes: `6905`
- Lines: `248`
- SHA256: `b75a420b386a1fdf38d77621fead0a64d4e6e5ee6013af261433b7b9ebc2f201`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `renderSectionHeader`
- Excerpt (first non-empty lines):

```text
   1: import React, { useState, useCallback } from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   StyleSheet,
   6:   ScrollView,
   7:   Switch,
   8:   Alert,
```

### 688. `frontend/app/staff/_layout.tsx`
- Bytes: `837`
- Lines: `27`
- SHA256: `6dcfd013be742fe373acd211c6dd6f8cb20f1ada3e372e2e366f5828a834af60`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Staff Layout - Navigation structure for staff role
   3:  * Features:
   4:  * - Stack-based navigation optimized for scanning workflow
   5:  * - Quick access to scan and history
   6:  */
   8: import React from "react";
   9: import { Stack } from "expo-router";
```

### 689. `frontend/app/staff/appearance.tsx`
- Bytes: `756`
- Lines: `32`
- SHA256: `05c41ac81f1c0b2179c583cdd9cff2ec397465adcd16faf7347777086f9a8728`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Appearance Settings Screen for Staff
   3:  *
   4:  * Allows staff users to customize theme, patterns, and layout arrangements
   5:  */
   7: import React from "react";
   8: import { AppearanceSettings } from "../../src/components/ui";
   9: import { ScreenContainer } from "../../src/components/ui/ScreenContainer";
```

### 690. `frontend/app/staff/components/SectionLists.tsx`
- Bytes: `18034`
- Lines: `579`
- SHA256: `0c605ea7e4ecd66a0b2133ec1d8e7038a060b06fcf5335847a0b332e2c1ee63a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SessionListItem`
  - `SectionListsProps`
  - `getRelativeTime`
  - `SectionLists`
  - `createStyles`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import {
   3:   ActivityIndicator,
   4:   ScrollView,
   5:   StyleSheet,
   6:   Text,
   7:   TextInput,
   8:   TouchableOpacity,
```

### 691. `frontend/app/staff/history.tsx`
- Bytes: `15386`
- Lines: `556`
- SHA256: `95be1725b24bb6be72f85ea84853b5616edba886809bb765cfa32607b15641ab`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `CountLine`
  - `onKey`
  - `handleDeleteRequest`
  - `handlePinSuccess`
  - `renderCountLine`
  - `CardContent`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   StyleSheet,
   6:   TouchableOpacity,
   7:   Platform,
   8:   Alert,
```

### 692. `frontend/app/staff/home.tsx`
- Bytes: `25419`
- Lines: `897`
- SHA256: `d0b59d4a488473ba9629a838bf3b83df37b0de8fd05c9f43aa729ed8e9d29499`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Zone`
  - `Warehouse`
  - `toDate`
  - `getSessionDate`
  - `formatSessionDateTime`
  - `getScannedCount`
  - `normalizeWarehouse`
  - `backAction`
  - `fetchZones`
  - `fetchWarehouses`
  - `handleRefresh`
  - `handleStartSession`
  - `handleResumeSession`
  - `renderSessionCard`
  - `renderContent`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Modern Staff Home Screen - Lavanya Mart Stock Verify
   3:  * Dashboard for managing stock verification sessions
   4:  */
   6: import React, { useState, useMemo, useEffect } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 693. `frontend/app/staff/index.tsx`
- Bytes: `182`
- Lines: `10`
- SHA256: `d9f808406253f35fc4ac50440c205debc5e5ffd339ac14173903b190e2e1b65d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Staff Index - Default route redirects to home
   3:  */
   5: import { Redirect } from "expo-router";
   7: export default function StaffIndex() {
   8:   return <Redirect href="/staff/home" />;
   9: }
```

### 694. `frontend/app/staff/item-detail.tsx`
- Bytes: `122839`
- Lines: `3607`
- SHA256: `36b944ffcb09e74e8e537e9833640e08323e2d513cd78a7af498e958ee6a1988`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `loadVariants`
  - `performAutosave`
  - `uom`
  - `handleTakePhoto`
  - `handleCaptureItemPhoto`
  - `handleSubmitPress`
  - `cancelSubmit`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Modern Item Detail Screen - Lavanya Mart Stock Verify
   3:  * Clean, efficient item verification interface
   4:  */
   6: import React, { useState, useEffect, useCallback, useMemo } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 695. `frontend/app/staff/scan.tsx`
- Bytes: `42048`
- Lines: `1434`
- SHA256: `2463fee7c80ed5df83de0a2e522548eeda6312bb7b510c92b49873f8c82e0573`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `handleBarcodeScan`
  - `handleLookup`
  - `navigateToDetail`
  - `handleFinishRack`
  - `handleLogout`
  - `SkeletonLoader`
  - `EmptyState`
  - `buildItemKey`
  - `RecentItemCardProps`
  - `SearchResultItemProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Modern Scan Screen - Lavanya Mart Stock Verify
   3:  * Clean, efficient scanning interface
   4:  */
   6: import React, { useState, useEffect, useRef, useCallback } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 696. `frontend/app/staff/serial-scanner.tsx`
- Bytes: `7151`
- Lines: `243`
- SHA256: `5f5fc6d1484e824946d7f5d573c720a7863dbbafa6ba9f745281731f3331c446`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `toast`
  - `symbology`
  - `ModeChip`
- Excerpt (first non-empty lines):

```text
   1: // app/staff/serial-scanner.tsx
   2: import React, { useCallback, useMemo, useState } from "react";
   3: import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
   4: import { CameraView, type BarcodeScanningResult } from "expo-camera";
   5: import { useRouter } from "expo-router";
   7: // Fix 1: Use correct alias imports
   8: import { useScanGate } from "@/scanner/useScanGate";
   9: import {
```

### 697. `frontend/app/staff/settings.tsx`
- Bytes: `13754`
- Lines: `483`
- SHA256: `c262159e9e0d9f59ae097551e281229da337652f10a6216b8bb3113424ee4500`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SettingRowProps`
  - `renderRightContent`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Staff Settings Screen - Modern Minimal Design
   3:  * Essential settings for staff users with clean UI
   4:  */
   6: import React, { useCallback } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 698. `frontend/app/supervisor/_layout.tsx`
- Bytes: `1660`
- Lines: `55`
- SHA256: `af4bbcc0f7b23cafafaf36e14669e5523d2225a8cc9fb9b227c0de1fa736ef61`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Supervisor Layout - Navigation structure for supervisor role
   3:  * Features:
   4:  * - Web/Tablet: Sidebar + Slot navigation (SupervisorSidebar)
   5:  * - Mobile: Stack-based navigation with Aurora design
   6:  * - Custom header with session info
   7:  * - Quick action buttons for common tasks
   8:  */
```

### 699. `frontend/app/supervisor/activity-logs.tsx`
- Bytes: `14062`
- Lines: `481`
- SHA256: `b88388922c28ca62a4eb05ffbaa8a50beee3112aa1d2d64e997258386ad76a4b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ActivityLog`
  - `handleRefresh`
  - `loadMore`
  - `formatTimestamp`
  - `getActionIcon`
  - `renderLogItem`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Activity Logs Screen - View application activity and audit logs
   3:  * Refactored to use Aurora Design System
   4:  */
   6: import React, { useState, useEffect } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 700. `frontend/app/supervisor/appearance.tsx`
- Bytes: `706`
- Lines: `31`
- SHA256: `ba227281c8ab10ab67c4713f7b9bc5fa776215db549507598da1057c01aea9d0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Appearance Settings Screen
   3:  *
   4:  * Allows users to customize theme, patterns, and layout arrangements
   5:  */
   7: import React from "react";
   8: import { AppearanceSettings } from "../../src/components/ui";
   9: import { ScreenContainer } from "../../src/components/ui/ScreenContainer";
```

### 701. `frontend/app/supervisor/dashboard.tsx`
- Bytes: `35256`
- Lines: `1149`
- SHA256: `d1f361bea6356d48717a4e300660339a24c6e6eae15f032c3f2e3800c0e9f420`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `DashboardStats`
  - `ActivityItem`
  - `fetchZones`
  - `handleLocationTypeChange`
  - `handleCreateSession`
  - `onRefresh`
  - `handleStatPress`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Supervisor Dashboard v2.0 - Aurora Design
   3:  *
   4:  * Features:
   5:  * - Aurora animated background
   6:  * - Glassmorphic stats cards with gradients
   7:  * - Live activity feed with animations
   8:  * - Speed dial menu for quick actions
```

### 702. `frontend/app/supervisor/db-mapping.tsx`
- Bytes: `34875`
- Lines: `1081`
- SHA256: `85bfffe248bcc7ce11a92a0dc1ca3ec9ec09c2b7693760af7d5e32ea0a4ce2bc`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Table`
  - `Column`
  - `ColumnMapping`
  - `handleLoadTables`
  - `handleLoadColumns`
  - `handleSelectColumn`
  - `handleMapColumn`
  - `handleTestMapping`
  - `handleSaveMapping`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Database Mapping Configuration Screen
   3:  * Allows supervisors to select tables and columns for ERP mapping
   4:  * Deep Ocean Design System
   5:  */
   7: import React, { useState, useEffect } from "react";
   8: import {
   9:   View,
```

### 703. `frontend/app/supervisor/error-logs.tsx`
- Bytes: `34085`
- Lines: `1096`
- SHA256: `d744692f13476ea7b491a040c983875c220a802641a9a370a3c22d4b1b3cc555`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ErrorLog`
  - `handleRefresh`
  - `loadMore`
  - `handleErrorClick`
  - `handleResolve`
  - `formatTimestamp`
  - `getSeverityColor`
  - `getSeverityIcon`
  - `renderErrorItem`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Error Logs Screen - View application errors and exceptions for monitoring
   3:  * Refactored to use Aurora Design System
   4:  */
   6: import React, { useState, useEffect } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 704. `frontend/app/supervisor/export-results.tsx`
- Bytes: `16053`
- Lines: `564`
- SHA256: `5360d1792adf2f85dad851963b3edb7dbaf9e09804f63d36ea78544c48a05e81`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ExportResult`
  - `loadResults`
  - `handleDownload`
  - `getStatusColor`
  - `getStatusIcon`
  - `formatFileSize`
  - `renderResultCard`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Export Results Screen
   3:  * Displays a list of export jobs and allows downloading completed exports.
   4:  * Refactored to use Deep Ocean Design System
   5:  */
   7: import React, { useState, useEffect } from "react";
   8: import {
   9:   View,
```

### 705. `frontend/app/supervisor/export-schedules.tsx`
- Bytes: `23648`
- Lines: `815`
- SHA256: `9d6b5e41d9958a34a005bd8ba76565548647dc8d36e95c93914b38cfc0948877`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ExportSchedule`
  - `handleCreateSchedule`
  - `handleUpdateSchedule`
  - `handleDeleteSchedule`
  - `handleTriggerSchedule`
  - `openCreateModal`
  - `openEditModal`
  - `renderScheduleCard`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Export Schedules Screen
   3:  * Allows creating, editing, and managing automated export schedules.
   4:  * Refactored to use Deep Ocean Design System
   5:  */
   7: import React, { useState, useEffect, useCallback } from "react";
   8: import {
   9:   View,
```

### 706. `frontend/app/supervisor/export.tsx`
- Bytes: `13205`
- Lines: `474`
- SHA256: `8f087c5cee2f76dd9e5f95a9ab5f7b57822df18a6099efcb74295848d122c74d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `handleInteraction`
  - `handleExportStart`
  - `handleExportEnd`
  - `exportAllSessions`
  - `exportSessionDetails`
  - `exportVarianceReport`
  - `exportSummaryReport`
  - `RenderExportCard`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Export Reports Screen
   3:  * Refactored to use Deep Ocean Design System
   4:  */
   6: import React from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 707. `frontend/app/supervisor/index.tsx`
- Bytes: `207`
- Lines: `10`
- SHA256: `9add893fe855a23d7a6656e92882b97e0de87f5409471811dfc9d8a243d42084`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Supervisor Index - Default route redirects to dashboard
   3:  */
   5: import { Redirect } from "expo-router";
   7: export default function SupervisorIndex() {
   8:   return <Redirect href="/supervisor/dashboard" />;
   9: }
```

### 708. `frontend/app/supervisor/items.tsx`
- Bytes: `14817`
- Lines: `525`
- SHA256: `b8c836f6d53d9c40bb9062ecac8c925727706481fcd8b9d8e12c8d3958e11687`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `getLocalFileUri`
  - `handleRefresh`
  - `handleLoadMore`
  - `handleExportCSV`
  - `renderItem`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Filtered Items Screen
   3:  * View and filter all items with category, subcategory, floor, rack, UOM filters
   4:  * Refactored to use Aurora Design System
   5:  */
   6: import React, { useState, useEffect } from "react";
   7: import {
   8:   View,
```

### 709. `frontend/app/supervisor/notes.tsx`
- Bytes: `12061`
- Lines: `417`
- SHA256: `2cf1fdea8d1f4058afcbada02d745907223fcc774f5b70bdf0d6618c7dbd0219`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `onRefresh`
  - `addNote`
  - `removeNote`
  - `renderNoteItem`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Notes Screen
   3:  * Manage supervisor notes
   4:  * Refactored to use Aurora Design System
   5:  */
   7: import React, { useState, useEffect, useCallback } from "react";
   8: import {
   9:   View,
```

### 710. `frontend/app/supervisor/offline-queue.tsx`
- Bytes: `13801`
- Lines: `474`
- SHA256: `56a14183d5bec4096bfdfe8414dd2124eec8a0d11da1c624bf1b1a69f95496ff`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `handleFlush`
  - `handleDismiss`
  - `renderQueueItem`
  - `renderConflictItem`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Offline Queue Screen
   3:  * Manage offline actions and conflicts
   4:  * Refactored to use Aurora Design System
   5:  */
   6: import React from "react";
   7: import {
   8:   View,
```

### 711. `frontend/app/supervisor/session/[id].tsx`
- Bytes: `25319`
- Lines: `845`
- SHA256: `bf9cfbdabd0ce43d04f40084d1f7f1d39c9e6f7d2068315e256468183b8c0232`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `targetSessionId`
  - `handleApproveLine`
  - `handleRejectLine`
  - `handleVerifyStock`
  - `handleUnverifyStock`
  - `handleUpdateStatus`
  - `switchTab`
  - `ListHeader`
  - `renderItem`
  - `content`
  - `renderEmpty`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   StyleSheet,
   6:   ActivityIndicator,
   7:   Platform,
   8: } from "react-native";
```

### 712. `frontend/app/supervisor/sessions.tsx`
- Bytes: `12295`
- Lines: `447`
- SHA256: `81f80a77de411fe42f1025271a92da3aeff6ff10c41b003deffe7f1b233c4912`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `handleRefresh`
  - `handleLoadMore`
  - `getStatusColor`
  - `renderItem`
  - `renderEmpty`
  - `renderFooter`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Sessions List Screen
   3:  * Displays a paginated list of all stock verification sessions.
   4:  * Refactored to use Aurora Design System
   5:  */
   7: import React, { useState, useEffect, useCallback } from "react";
   8: import {
   9:   View,
```

### 713. `frontend/app/supervisor/settings.tsx`
- Bytes: `15344`
- Lines: `505`
- SHA256: `ce5de1e6578a3982e7a6d4d0b5e9224103ec9d7ff241371d9272d4c9fcbabeed`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SettingRow`
  - `handlePress`
  - `nextIndex`
  - `handleReset`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Settings Screen - App settings and preferences
   3:  * Refactored to use Aurora Design System
   4:  */
   6: import React, { useState } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 714. `frontend/app/supervisor/sync-conflicts.tsx`
- Bytes: `26184`
- Lines: `832`
- SHA256: `73de9c4787a481925ff0bfd73673fabd6f6588c20114ed65780ac794cc6483ce`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SyncConflict`
  - `handleRefresh`
  - `handleResolve`
  - `handleBatchResolve`
  - `toggleConflictSelection`
  - `openConflictDetail`
  - `renderConflictCard`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Sync Conflicts Screen
   3:  * Review and resolve data synchronization conflicts
   4:  * Refactored to use Aurora Design System
   5:  */
   6: import React, { useState, useEffect, useCallback } from "react";
   7: import {
   8:   View,
```

### 715. `frontend/app/supervisor/variance-details.tsx`
- Bytes: `15254`
- Lines: `504`
- SHA256: `26b1d253a2201d361424dfa85b6126a3888796e397c30bae58ee5a3c7d0613b0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `handleApprove`
  - `handleRecount`
- Excerpt (first non-empty lines):

```text
   1: import React, { useState, useEffect, useCallback } from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   StyleSheet,
   6:   ScrollView,
   7:   ActivityIndicator,
   8:   Alert,
```

### 716. `frontend/app/supervisor/variances.tsx`
- Bytes: `22671`
- Lines: `767`
- SHA256: `2a6988ba26da2ef36723c0fd19460c7b83a1ae126808caca8a3076717770f888`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `getLocalFileUri`
  - `toggleSelection`
  - `handleSelectAll`
  - `handleBulkAction`
  - `handleRefresh`
  - `handleLoadMore`
  - `handleExportCSV`
  - `renderVarianceItem`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Variance List Screen
   3:  * Displays all items with variances (verified qty != system qty)
   4:  * Refactored to use Aurora Design System
   5:  */
   6: import React, { useState, useEffect } from "react";
   7: import {
   8:   View,
```

### 717. `frontend/app/supervisor/watchtower.tsx`
- Bytes: `18762`
- Lines: `621`
- SHA256: `89740c4a8d02c68503c48bbdd257396280db007f9bc9500d93d6b287983cc2c2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `WatchtowerStats`
  - `ChartBar`
  - `onRefresh`
  - `getProcessingRate`
  - `height`
- Excerpt (first non-empty lines):

```text
   1: import React, { useState, useEffect, useCallback } from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   StyleSheet,
   6:   ScrollView,
   7:   RefreshControl,
   8:   ActivityIndicator,
```

### 718. `frontend/app/welcome.tsx`
- Bytes: `11274`
- Lines: `438`
- SHA256: `733fab8edbe881e86c00ca5de9da36e898fe309f863dea4425f25d1e2b012c7b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SafeAnimatedView`
  - `GlassSurface`
  - `FeatureCard`
  - `handlePress`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   StyleSheet,
   6:   TouchableOpacity,
   7:   Platform,
   8:   useWindowDimensions,
```

### 719. `frontend/assets/images/logo.png`
- Bytes: `317792`
- Lines: `1285`
- SHA256: `1f4ff8276c8d53bbb816140c8004cc15a20ab53c4486a478c64d459ff4fd1cf9`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 720. `frontend/babel.config.js`
- Bytes: `846`
- Lines: `34`
- SHA256: `7508268be99ed9d273103f3a7eb0e610b4beae6947951edd30130ef470a51bf4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: module.exports = function (api) {
   2:   api.cache(true);
   3:   return {
   4:     presets: ["babel-preset-expo"],
   5:     env: {
   6:       production: {
   7:         plugins: ["transform-remove-console"],
   8:       },
```

### 721. `frontend/budget.json`
- Bytes: `1324`
- Lines: `76`
- SHA256: `b9422e7a1e5bc45ef5dd3b58e9be5ff8df03e9d12a5655de68d711ecbf66bacb`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: [
   2:   {
   3:     "path": "/**",
   4:     "resourceSizes": [
   5:       {
   6:         "resourceType": "document",
   7:         "budget": 50
   8:       },
```

### 722. `frontend/components/auth/PermissionGate.tsx`
- Bytes: `3263`
- Lines: `151`
- SHA256: `e8a91d3b7b72be016d7a6a1870449a264756edae313ed4865f588d819ab77e90`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PermissionGateProps`
  - `PermissionGate`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * PermissionGate Component - Conditionally render content based on permissions
   3:  *
   4:  * Usage:
   5:  *   <PermissionGate permission="count:approve">
   6:  *     <Button title="Approve" />
   7:  *   </PermissionGate>
   8:  *
```

### 723. `frontend/e2e/README.md`
- Bytes: `1090`
- Lines: `55`
- SHA256: `66f15d9d6e638ae3ee0ed9da8d42298d689494707a67ba577a6b7fc89a7101a9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # End-to-End Testing with Maestro
   3: This project uses [Maestro](https://maestro.mobile.dev/) for End-to-End (E2E) testing. Maestro is a simple and effective UI testing framework for mobile apps.
   5: ## Prerequisites
   7: 1.  **Install Maestro CLI:**
   9:     ```bash
  10:     curl -Ls "https://get.maestro.mobile.dev" | bash
  11:     ```
  13: 2.  **Running the App:**
```

### 724. `frontend/e2e/admin-dashboard.spec.ts`
- Bytes: `1109`
- Lines: `32`
- SHA256: `b0348ad15b8d36242d9e90db04817154cfa87a5d0b7beab9f9a655e55ba7c577`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import { test, expect } from "@playwright/test";
   3: test.describe("Admin Dashboard Access", () => {
   4:   test("should allow admin login and access dashboard", async ({ page }) => {
   5:     // 1. Go to Login
   6:     await page.goto("/auth/login");
   8:     // 2. Fill Credentials
   9:     await page.fill('input[placeholder="Username"]', "admin");
  10:     await page.fill('input[placeholder="Password"]', "admin123");
```

### 725. `frontend/e2e/auth.spec.ts`
- Bytes: `8450`
- Lines: `257`
- SHA256: `e098becfe03732625075b3686fe7377dd65b61c1cd57b1faeed93c5e8e92f7ea`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ensureCredentialsMode`
- Excerpt (first non-empty lines):

```text
   1: import { test, expect } from "@playwright/test";
   3: async function ensureCredentialsMode(page: any) {
   4:   await expect(page.getByRole("button", { name: /^sign in$/i })).toBeVisible({
   5:     timeout: 15000,
   6:   });
   7: }
   9: /**
  10:  * Authentication E2E Tests
```

### 726. `frontend/e2e/core-flow.spec.ts`
- Bytes: `3719`
- Lines: `98`
- SHA256: `5ce7d6f1fb596cd7dfe4b2765263f6396a6de088bed0661268345b7785a5a3a7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import { test, expect } from "@playwright/test";
   3: test.describe("Core User Flow", () => {
   4:   test("Login -> Create Session -> Scan -> Verify -> Logout", async ({
   5:     page,
   6:   }) => {
   7:     test.setTimeout(300000); // 5 minutes
   9:     // Debug Network & Errors
  10:     page.on("requestfailed", (request) =>
```

### 727. `frontend/e2e/misplaced-item.spec.ts`
- Bytes: `1419`
- Lines: `37`
- SHA256: `b3df5d0b28b4acb2c8e74489634ce2b672841f1f0b09a654898dfb924e1b1850`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import { test, expect } from "@playwright/test";
   3: test.describe("Misplaced Item Verification", () => {
   4:   test("should show warning when scanning item in wrong rack", async ({ page }) => {
   5:     // 1. Login
   6:     await page.goto("/auth/login");
   7:     await page.fill('input[placeholder="Username"]', "staff2");
   8:     await page.fill('input[placeholder="Password"]', "staff123");
   9:     await page.click("text=Login");
```

### 728. `frontend/e2e/visual.spec.ts`
- Bytes: `8757`
- Lines: `288`
- SHA256: `2d87dc61a8713c786b826edadd9e1b3b5c34b36bf9845d8d980ea275b6e77716`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ensureCredentialsMode`
  - `skipIfMissingBaseline`
- Excerpt (first non-empty lines):

```text
   1: import { test, expect } from "@playwright/test";
   2: import fs from "node:fs";
   4: /**
   5:  * Visual Regression Tests
   6:  *
   7:  * Creates baseline screenshots for critical screens.
   8:  * Run with: npx playwright test visual.spec.ts --update-snapshots
   9:  *
```

### 729. `frontend/eas.json`
- Bytes: `261`
- Lines: `21`
- SHA256: `0c99ece1d9eae7bcd914dcac68ff29c51d007117c2471abca87ba0c25dbe1bfc`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "cli": {
   3:     "version": ">= 7.0.0"
   4:   },
   5:   "build": {
   6:     "preview": {
   7:       "android": {
   8:         "buildType": "apk"
```

### 730. `frontend/expo-sqlite.d.ts`
- Bytes: `630`
- Lines: `25`
- SHA256: `aaf4061fe00317f47a18ba778670859f450ca251e0c1fda85f20c88362fb61ac`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `openDatabaseAsync`
- Excerpt (first non-empty lines):

```text
   1: declare module "expo-sqlite" {
   2:   export interface SQLiteDatabase {
   3:     execAsync(sql: string): Promise<void>;
   5:     withTransactionAsync<T>(task: () => Promise<T>): Promise<T>;
   7:     runAsync(
   8:       sql: string,
   9:       params?: any[] | Record<string, any>,
  10:     ): Promise<{ lastInsertRowId?: number; changes?: number }>;
```

### 731. `frontend/hooks/usePermissions.ts`
- Bytes: `5141`
- Lines: `196`
- SHA256: `f4caa2c975132ee0f867d75ca3449245df73abd2822793825f8bd8232d07b8fa`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `usePermissions`
  - `hasPermission`
  - `hasAnyPermission`
  - `hasAllPermissions`
  - `hasRole`
  - `isAdmin`
  - `isSupervisor`
  - `isStaff`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Permission Hook - Check user permissions in React Native components
   3:  *
   4:  * Usage:
   5:  *   const { hasPermission, hasRole, user } = usePermissions();
   6:  *
   7:  *   if (hasPermission('count:approve')) {
   8:  *     // Show approve button
```

### 732. `frontend/hooks/useSubmitDelay.ts`
- Bytes: `1410`
- Lines: `67`
- SHA256: `593ddde21946ef91d3eba6754ca0b16a54783fe7fadcc0f24c0c15c5aed5c429`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `UseSubmitDelayOptions`
  - `useSubmitDelay`
  - `reset`
  - `start`
  - `cancel`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Submit Delay Hook - 5-second countdown before allowing submission
   3:  *
   4:  * Usage:
   5:  *   const { canSubmit, secondsRemaining } = useSubmitDelay();
   6:  *
   7:  *   <Button
   8:  *     disabled={!canSubmit}
```

### 733. `frontend/index.js`
- Bytes: `68`
- Lines: `4`
- SHA256: `01000805c8947329347cd60c9453a9350f1e8db6915ee3dccb4928074e1cafce`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import "react-native-gesture-handler";
   3: import "expo-router/entry";
```

### 734. `frontend/ios/.gitignore`
- Bytes: `321`
- Lines: `31`
- SHA256: `f8042134be9ad24176d8d630255be93f8a0223925ae88c34b603c8989baa8345`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # OSX
   2: #
   3: .DS_Store
   5: # Xcode
   6: #
   7: build/
   8: *.pbxuser
   9: !default.pbxuser
```

### 735. `frontend/ios/.xcode.env`
- Bytes: `38`
- Lines: `2`
- SHA256: `d443202aa7349816e4d827d25a8c749e4ce610784f26a5c08002531f24ca5dbb`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: export NODE_BINARY=$(command -v node)
```

### 736. `frontend/ios/Podfile`
- Bytes: `3422`
- Lines: `85`
- SHA256: `23a00b2d15a98c4748f68f437aa7a08cf18101b40dc52a3035a76874c544f8d4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: require File.join(File.dirname(`node --print "require.resolve('expo/package.json')"`), "scripts/autolinking")
   2: require File.join(File.dirname(`node --print "require.resolve('react-native/package.json')"`), "scripts/react_native_pods")
   4: require 'json'
   5: podfile_properties = JSON.parse(File.read(File.join(__dir__, 'Podfile.properties.json'))) rescue {}
   7: def ccache_enabled?(podfile_properties)
   8:   # Environment variable takes precedence
   9:   return ENV['USE_CCACHE'] == '1' if ENV['USE_CCACHE']
  11:   # Fall back to Podfile properties
```

### 737. `frontend/ios/Podfile.properties.json`
- Bytes: `77`
- Lines: `5`
- SHA256: `4222d802ab80961762b71603a713160c16c0fa3ce5d6c74a111c67785872331a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "expo.jsEngine": "hermes",
   3:   "EX_DEV_CLIENT_NETWORK_INSPECTOR": "true"
   4: }
```

### 738. `frontend/ios/StockVerify.xcodeproj/project.pbxproj`
- Bytes: `28564`
- Lines: `599`
- SHA256: `a810ff1e3f67f07355168520bbbd652b40f4f982e164bb730c3ad118c2ab364a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: // !$*UTF8*$!
   2: {
   3:     archiveVersion = 1;
   4:     classes = {
   5:     };
   6:     objectVersion = 54;
   7:     objects = {
   9: /* Begin PBXBuildFile section */
```

### 739. `frontend/ios/StockVerify.xcodeproj/xcshareddata/xcschemes/StockVerify.xcscheme`
- Bytes: `3318`
- Lines: `89`
- SHA256: `04634f3e3da2d4c699f35f3e8e5c5361d0545a2d3a985d5bcb14b2c868d9f641`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <?xml version="1.0" encoding="UTF-8"?>
   2: <Scheme
   3:    LastUpgradeVersion = "1130"
   4:    version = "1.3">
   5:    <BuildAction
   6:       parallelizeBuildables = "YES"
   7:       buildImplicitDependencies = "YES">
   8:       <BuildActionEntries>
```

### 740. `frontend/ios/StockVerify.xcworkspace/contents.xcworkspacedata`
- Bytes: `229`
- Lines: `11`
- SHA256: `7496f3e46cf0d229399169fcb83e4930da5782fdb905ebff54082923e3bfccc9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <?xml version="1.0" encoding="UTF-8"?>
   2: <Workspace
   3:    version = "1.0">
   4:    <FileRef
   5:       location = "group:StockVerify.xcodeproj">
   6:    </FileRef>
   7:    <FileRef
   8:       location = "group:Pods/Pods.xcodeproj">
```

### 741. `frontend/ios/StockVerify/AppDelegate.swift`
- Bytes: `2275`
- Lines: `71`
- SHA256: `614cbb9b09ac561c762a384c658d3c2a0cd28b30cc29b6e72cb25def9783e3d5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ReactNativeDelegate`
- Excerpt (first non-empty lines):

```text
   1: import Expo
   2: import React
   3: import ReactAppDependencyProvider
   5: @UIApplicationMain
   6: public class AppDelegate: ExpoAppDelegate {
   7:   var window: UIWindow?
   9:   var reactNativeDelegate: ExpoReactNativeFactoryDelegate?
  10:   var reactNativeFactory: RCTReactNativeFactory?
```

### 742. `frontend/ios/StockVerify/Images.xcassets/AppIcon.appiconset/Contents.json`
- Bytes: `216`
- Lines: `15`
- SHA256: `4100413dfb07091d4a40a9bf5775a295d2521939292cc9c9806e2d2016d92899`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "images": [
   3:     {
   4:       "filename": "App-Icon-1024x1024@1x.png",
   5:       "idiom": "universal",
   6:       "platform": "ios",
   7:       "size": "1024x1024"
   8:     }
```

### 743. `frontend/ios/StockVerify/Images.xcassets/Contents.json`
- Bytes: `59`
- Lines: `7`
- SHA256: `940968520a462215ccf98317a12e4c3b90875bf9c51a5f473a8ffb97e8cd1464`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "info": {
   3:     "version": 1,
   4:     "author": "expo"
   5:   }
   6: }
```

### 744. `frontend/ios/StockVerify/Images.xcassets/SplashScreenBackground.colorset/Contents.json`
- Bytes: `349`
- Lines: `21`
- SHA256: `a73a1dbfd0330be97c93c8dd3d6b89919839ac095e01e72dda6324352a94de8f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "colors": [
   3:     {
   4:       "color": {
   5:         "components": {
   6:           "alpha": "1.000",
   7:           "blue": "1.00000000000000",
   8:           "green": "1.00000000000000",
```

### 745. `frontend/ios/StockVerify/Info.plist`
- Bytes: `3214`
- Lines: `94`
- SHA256: `4af87094b56a7445a784737e9964cabcaf6c0d87c8b53ee9f0c46bf0b2ab36d0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <?xml version="1.0" encoding="UTF-8"?>
   2: <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   3: <plist version="1.0">
   4:   <dict>
   5:     <key>CADisableMinimumFrameDurationOnPhone</key>
   6:     <true/>
   7:     <key>CFBundleDevelopmentRegion</key>
   8:     <string>$(DEVELOPMENT_LANGUAGE)</string>
```

### 746. `frontend/ios/StockVerify/PrivacyInfo.xcprivacy`
- Bytes: `1283`
- Lines: `49`
- SHA256: `58b13a0ea48613968b376ed43fe0a2abae5c34922be1a657e8fee4961b4a81c9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <?xml version="1.0" encoding="UTF-8"?>
   2: <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   3: <plist version="1.0">
   4: <dict>
   5:     <key>NSPrivacyAccessedAPITypes</key>
   6:     <array>
   7:         <dict>
   8:             <key>NSPrivacyAccessedAPIType</key>
```

### 747. `frontend/ios/StockVerify/SplashScreen.storyboard`
- Bytes: `2760`
- Lines: `40`
- SHA256: `4d9e0668fbdb1083b322b136ebb60dc72555c6109df8d0a14c189284f1312996`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <?xml version="1.0" encoding="UTF-8"?>
   2: <document type="com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB" version="3.0" toolsVersion="24093.7" targetRuntime="iOS.CocoaTouch" propertyAccessControl="none" useAutolayout="YES" launchScreen="YES" useTraitCo...
   3:     <device id="retina6_12" orientation="portrait" appearance="light"/>
   4:     <dependencies>
   5:         <deployment identifier="iOS"/>
   6:         <plugIn identifier="com.apple.InterfaceBuilder.IBCocoaTouchPlugin" version="24053.1"/>
   7:         <capability name="Named colors" minToolsVersion="9.0"/>
   8:         <capability name="Safe area layout guides" minToolsVersion="9.0"/>
```

### 748. `frontend/ios/StockVerify/StockVerify-Bridging-Header.h`
- Bytes: `102`
- Lines: `4`
- SHA256: `4a625b53abd4333ca454a4161ba62ab1b0cb44e8a4581326c0bcfe03dc26dd5c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: //
   2: // Use this file to import your target's public headers that you would like to expose to Swift.
   3: //
```

### 749. `frontend/ios/StockVerify/StockVerify.entitlements`
- Bytes: `256`
- Lines: `9`
- SHA256: `d18c2c4a5226875c493d2cb2c4028863a7ffc3245fd8fe928177a970f309e181`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <?xml version="1.0" encoding="UTF-8"?>
   2: <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   3: <plist version="1.0">
   4:   <dict>
   5:     <key>aps-environment</key>
   6:     <string>development</string>
   7:   </dict>
   8: </plist>
```

### 750. `frontend/ios/StockVerify/Supporting/Expo.plist`
- Bytes: `365`
- Lines: `13`
- SHA256: `8ef0cc00f4bbd30199174ce5aa1225979a8f1aeb2209ef7d524b0cd3cff0afa4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <?xml version="1.0" encoding="UTF-8"?>
   2: <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   3: <plist version="1.0">
   4:   <dict>
   5:     <key>EXUpdatesCheckOnLaunch</key>
   6:     <string>ALWAYS</string>
   7:     <key>EXUpdatesEnabled</key>
   8:     <false/>
```

### 751. `frontend/jest.config.js`
- Bytes: `1228`
- Lines: `44`
- SHA256: `79eb7e36f5ebc46f0eb366ef3769ce59c2d4477421fc89c3314d2bdef5b0d639`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /** @type {import('jest').Config} */
   2: module.exports = {
   3:   preset: "jest-expo",
   4:   setupFiles: ["<rootDir>/jest.polyfills.js"],
   5:   setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
   6:   testPathIgnorePatterns: [
   7:     "/node_modules/",
   8:     "/dist/",
```

### 752. `frontend/jest.polyfills.js`
- Bytes: `342`
- Lines: `14`
- SHA256: `cbbb946b63a16c890e11368e3efd79d931082e07f4f371c9b2d9fce5a63539e8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: // Ensure React/Jest load test builds even if shell exports NODE_ENV=production
   2: process.env.NODE_ENV = "test";
   4: // Fix for "The global process.env.EXPO_OS is not defined" warning
   5: if (!process.env.EXPO_OS) {
   6:   process.env.EXPO_OS = "ios";
   7: }
   9: try {
  10:   if (typeof window !== "undefined") {
```

### 753. `frontend/jest.setup.js`
- Bytes: `5693`
- Lines: `204`
- SHA256: `bb0466089319b8b9003e6bb1f29ce05d1179d424a1a1e2d869598517947c1fef`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `MockModal`
- Excerpt (first non-empty lines):

```text
   1: // Jest setup for Expo + React Native
   3: // FIX 1: Define EXPO_OS explicitly (Mandatory)
   4: process.env.EXPO_OS = "ios";
   5: process.env.EXPO_PLATFORM = "ios";
   7: // Fix for "The global process.env.EXPO_OS is not defined" warning (redundant but safe)
   8: if (!process.env.EXPO_OS) {
   9:   process.env.EXPO_OS = "ios";
  10: }
```

### 754. `frontend/lighthouserc.json`
- Bytes: `986`
- Lines: `28`
- SHA256: `fe82d6f21c0993342e855ec2f9d2644df65456c7ee27dccb339d5fd6679c20d2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "ci": {
   3:     "collect": {
   4:       "numberOfRuns": 3,
   5:       "startServerCommand": "npx serve dist -l 3000",
   6:       "startServerReadyPattern": "Accepting connections",
   7:       "startServerReadyTimeout": 30000,
   8:       "url": ["http://localhost:3000"]
```

### 755. `frontend/lint-report.txt`
- Bytes: `7008`
- Lines: `101`
- SHA256: `e571669830ee36555b578bb51224984224c1fead281f4dce12be97eff58c861a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   2: /Users/noufi1/stk_final/Stock_final/frontend/__tests__/home.test.tsx
   3:     5:18  warning  'fireEvent' is defined but never used. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars
   4:     5:29  warning  'waitFor' is defined but never used. Allowed unused vars must match /^_/u    @typescript-eslint/no-unused-vars
   5:   106:37  warning  A `require()` style import is forbidden                                      @typescript-eslint/no-require-imports
   6:   127:37  warning  A `require()` style import is forbidden                                      @typescript-eslint/no-require-imports
   7:   137:37  warning  A `require()` style import is forbidden                                      @typescript-eslint/no-require-imports
   8:   152:37  warning  A `require()` style import is forbidden                                      @typescript-eslint/no-require-imports
   9:   162:37  warning  A `require()` style import is forbidden                                      @typescript-eslint/no-require-imports
```

### 756. `frontend/metro.config.js`
- Bytes: `680`
- Lines: `23`
- SHA256: `c7e25003c7cc3e1f025f678f1a296c68bf97a4f1b5d80cb653c1179551738182`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: // Learn more https://docs.expo.io/guides/customizing-metro
   2: const { getDefaultConfig } = require("expo/metro-config");
   4: /** @type {import('expo/metro-config').MetroConfig} */
   5: const config = getDefaultConfig(__dirname);
   7: // Fix for Safari: transform import.meta in node_modules for web
   8: // Zustand's devtools uses import.meta.env which Safari doesn't support in non-module scripts
   9: config.transformer = {
  10:   ...config.transformer,
```

### 757. `frontend/nginx.conf`
- Bytes: `150`
- Lines: `12`
- SHA256: `5f83763d42cd00d70b2e63e30971df9bd0e11bd61891bcb27b7ba66309383ffc`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: server {
   2:   listen 80;
   3:   server_name _;
   5:   root /usr/share/nginx/html;
   6:   index index.html;
   8:   location / {
   9:     try_files $uri $uri/ /index.html;
  10:   }
```

### 758. `frontend/package-lock.json`
- Bytes: `736921`
- Lines: `20168`
- SHA256: `790e6c2dc09ebb01b8b4393bb570f8dac762b342c4d2dd7b9e2e7ebedd2ffa82`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "name": "frontend",
   3:   "version": "1.0.0",
   4:   "lockfileVersion": 3,
   5:   "requires": true,
   6:   "packages": {
   7:     "": {
   8:       "name": "frontend",
```

### 759. `frontend/package.json`
- Bytes: `5327`
- Lines: `150`
- SHA256: `9a8d0e121e3431043931b17019ad635201cd3975439f60aa0fd81bf4a6545b0b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "name": "frontend",
   3:   "version": "1.0.0",
   4:   "private": true,
   5:   "main": "index.js",
   6:   "overrides": {
   7:     "react-test-renderer": "19.1.0"
   8:   },
```

### 760. `frontend/patches/zustand+5.0.10.patch`
- Bytes: `1424`
- Lines: `23`
- SHA256: `d10ab7230624924d1c77a7b6ed32920eebbe8aeb78df134392835978e5f869d6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: diff --git a/node_modules/zustand/esm/middleware.mjs b/node_modules/zustand/esm/middleware.mjs
   2: index 0373ba9..99ebaad 100644
   3: --- a/node_modules/zustand/esm/middleware.mjs
   4: +++ b/node_modules/zustand/esm/middleware.mjs
   5: @@ -58,7 +58,7 @@ const devtoolsImpl = (fn, devtoolsOptions = {}) => (set, get, api) => {
   6:    const { enabled, anonymousActionType, store, ...options } = devtoolsOptions;
   7:    let extensionConnector;
   8:    try {
```

### 761. `frontend/patches/zustand+5.0.9.patch`
- Bytes: `1424`
- Lines: `23`
- SHA256: `c13be7e2ebae01ee95d16075446b11c4f770bd53118be10709082a67498fc2c4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: diff --git a/node_modules/zustand/esm/middleware.mjs b/node_modules/zustand/esm/middleware.mjs
   2: index ee4ee9c..28d73e5 100644
   3: --- a/node_modules/zustand/esm/middleware.mjs
   4: +++ b/node_modules/zustand/esm/middleware.mjs
   5: @@ -58,7 +58,7 @@ const devtoolsImpl = (fn, devtoolsOptions = {}) => (set, get, api) => {
   6:    const { enabled, anonymousActionType, store, ...options } = devtoolsOptions;
   7:    let extensionConnector;
   8:    try {
```

### 762. `frontend/playwright-report/data/65269b2d58a88d4749003d2d9302cf9bd2575006.md`
- Bytes: `170`
- Lines: `8`
- SHA256: `6437fd82b8c109e8bbbf04a653da4053f43f3fa10abfc4f56c0a19720dd362ee`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Page snapshot
   3: ```yaml
   4: - generic [ref=e9]:
   5:   - generic [ref=e10]: This screen doesn't exist.
   6:   - link "Go to home screen!" [ref=e11] [cursor=pointer]:
   7:     - /url: /
   8: ```
```

### 763. `frontend/playwright-report/data/dfa08c67362e7ad9fea001ea3d9ecf2678684fa6.md`
- Bytes: `188`
- Lines: `9`
- SHA256: `6bcb8cf1bc62ba108c186f70b4c6141d2b8330b40c1b63a49f5381e448165acb`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Page snapshot
   3: ```yaml
   4: - generic [ref=e4]:
   5:   - progressbar [ref=e5]:
   6:     - img [ref=e7]
   7:   - generic [ref=e10]: StockVerify Admin
   8:   - generic [ref=e11]: Initializing Secure Session...
   9: ```
```

### 764. `frontend/playwright-report/index.html`
- Bytes: `520959`
- Lines: `85`
- SHA256: `8e451190c712a0a0363d451c3d3df7c9d6821f47bc76a2b6b324e0e5df9d834d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   3: <!DOCTYPE html>
   4: <html style='scrollbar-gutter: stable both-edges;'>
   5:   <head>
   6:     <meta charset='UTF-8'>
   7:     <meta name='color-scheme' content='dark light'>
   8:     <meta name='viewport' content='width=device-width, initial-scale=1.0'>
   9:     <title>Playwright Test Report</title>
  10:     <script type="module">var oA=Object.defineProperty;var dA=(u,i,c)=>i in u?oA(u,i,{enumerable:!0,configurable:!0,writable:!0,value:c}):u[i]=c;var dn=(u,i,c)=>dA(u,typeof i!="symbol"?i+"":i,c);(function(){const i=do...
```

### 765. `frontend/playwright.config.ts`
- Bytes: `2465`
- Lines: `90`
- SHA256: `bc566b0398667740e8e242abca703ea7fc64497b90ee6e5b64cb5db1ed9b5a0a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import { defineConfig, devices } from "@playwright/test";
   3: /**
   4:  * Playwright E2E Test Configuration for Stock Verification App
   5:  *
   6:  * Run all tests: npx playwright test
   7:  * Run specific tests: npx playwright test e2e/auth.spec.ts
   8:  * Run with UI: npx playwright test --ui
   9:  * Debug mode: npx playwright test --debug
```

### 766. `frontend/plugins/withQuotedReactNativeBundlePhase.js`
- Bytes: `1651`
- Lines: `48`
- SHA256: `aa5f82305487093210a557677f424c8d5d3512d14b86401783519c9eb5d81566`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `patchBundlePhaseShellScript`
- Excerpt (first non-empty lines):

```text
   1: const { withXcodeProject } = require("@expo/config-plugins");
   3: function patchBundlePhaseShellScript(shellScript) {
   4:   if (typeof shellScript !== "string") return shellScript;
   5:   if (shellScript.includes("RN_XCODE_SCRIPT=")) return shellScript;
   6:   if (!shellScript.includes("react-native-xcode.sh")) return shellScript;
   8:   const lines = shellScript.split("\n");
   9:   const idx = lines.findIndex(
  10:     (line) =>
```

### 767. `frontend/public/backend_port.json`
- Bytes: `268`
- Lines: `1`
- SHA256: `8e70867f0ebc759069f149c03bacc60f4f85e8828c7a3819356133450f79e50b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {"port": 8001, "ip": "192.168.31.213", "url": "http://192.168.31.213:8001", "pid": 46565, "timestamp": "2026-03-12T06:23:26.490923+00:00", "EXPO_PUBLIC_BACKEND_URL": "http://192.168.31.213:8001", "EXPO_PUBLIC_API_TIME...
```

### 768. `frontend/react-native-text-override.d.ts`
- Bytes: `1054`
- Lines: `35`
- SHA256: `35283fd7454be2781e317a6bede5fcf03484746c1267754674ca32842dcfa7f5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `IntrinsicElements`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * TypeScript declaration override for React Native text validation
   3:  *
   4:  * This file suppresses false positive errors from React Native's TypeScript plugin
   5:  * that incorrectly flags string literals in comparisons/logic as needing <Text> wrapping.
   6:  *
   7:  * These are NOT actual bugs - string literals used in:
   8:  * - Comparisons: activeTab === "overview"
```

### 769. `frontend/scripts/update-ip.js`
- Bytes: `5014`
- Lines: `161`
- SHA256: `6ff31b48566b95301bd1fda0e48ef3df5f5e75929d8d31d19b2e3598e77adbe4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `joinUrl`
  - `probeHealth`
  - `getLocalIpAddress`
  - `main`
- Excerpt (first non-empty lines):

```text
   1: const fs = require("fs");
   2: const path = require("path");
   3: const os = require("os");
   4: const http = require("http");
   5: const https = require("https");
   7: function joinUrl(baseUrl, urlPath) {
   8:   if (!baseUrl) return urlPath;
   9:   const trimmedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
```

### 770. `frontend/src/assets/fonts/SpaceMono-Regular.ttf`
- Bytes: `93252`
- Lines: `486`
- SHA256: `4c322514d265062aa3f7fbd81f5b79391ccb74268e6a20600061e0ce33234f41`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 771. `frontend/src/assets/images/lavanya-mart-logo.svg`
- Bytes: `1462`
- Lines: `33`
- SHA256: `c3daa54870d0a54c14dd4fd95063b5cd63539aa5db890d9eee35cace02cb0af8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <?xml version="1.0" encoding="UTF-8"?>
   2: <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
   3:   <!-- Background Circle with Gradient -->
   4:   <defs>
   5:     <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
   6:       <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
   7:       <stop offset="100%" style="stop-color:#1D4ED8;stop-opacity:1" />
   8:     </linearGradient>
```

### 772. `frontend/src/backend_port.json`
- Bytes: `268`
- Lines: `1`
- SHA256: `8e70867f0ebc759069f149c03bacc60f4f85e8828c7a3819356133450f79e50b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {"port": 8001, "ip": "192.168.31.213", "url": "http://192.168.31.213:8001", "pid": 46565, "timestamp": "2026-03-12T06:23:26.490923+00:00", "EXPO_PUBLIC_BACKEND_URL": "http://192.168.31.213:8001", "EXPO_PUBLIC_API_TIME...
```

### 773. `frontend/src/components/AppLogo.tsx`
- Bytes: `2467`
- Lines: `114`
- SHA256: `924009d1b99d10250e7750be48065ec21c195ef3ce98df8bf6c61f28ddca1156`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AppLogoProps`
  - `AppLogo`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { View, Text, StyleSheet } from "react-native";
   3: import Ionicons from "@expo/vector-icons/Ionicons";
   5: interface AppLogoProps {
   6:   size?: "small" | "medium" | "large";
   7:   showText?: boolean;
   8:   variant?: "default" | "white" | "gradient";
   9: }
```

### 774. `frontend/src/components/DataTable.stories.tsx`
- Bytes: `5153`
- Lines: `230`
- SHA256: `6b68738c2ec8dee2d3cc699799083ad6e1f86032f693d12c2d0a56c25ef36b1e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Story`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * DataTable Component Stories
   3:  *
   4:  * Documentation and examples for the DataTable component
   5:  */
   7: import type { Meta, StoryObj } from "@storybook/react";
   8: import { DataTable, TableColumn, TableData } from "./DataTable";
   9: import { View, Text, StyleSheet } from "react-native";
```

### 775. `frontend/src/components/DataTable.tsx`
- Bytes: `7612`
- Lines: `306`
- SHA256: `473f36191df21e31313c1933109166217b566353727552d6f26fda589665e8d9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `DataTableProps`
  - `start`
  - `handleSort`
  - `renderHeader`
  - `renderRow`
  - `renderPagination`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Data Table Component
   3:  * Advanced table with sorting, filtering, and pagination
   4:  */
   6: import React, { useState, useMemo } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 776. `frontend/src/components/ErrorBoundary.tsx`
- Bytes: `3938`
- Lines: `153`
- SHA256: `672ec73171f657359a8306f0f53f81e7013e21dc2c14917abaa0d768a2e39073`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Props`
  - `ErrorFallback`
  - `ErrorBoundary`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Error Boundary Component
   3:  * Catches and handles React component errors
   4:  * Enhanced with modern design system support
   5:  */
   7: import React, { ReactNode } from "react";
   8: import { View, Text, StyleSheet, ScrollView } from "react-native";
   9: import Ionicons from "@expo/vector-icons/Ionicons";
```

### 777. `frontend/src/components/Input.stories.tsx`
- Bytes: `4084`
- Lines: `189`
- SHA256: `b87c779270b78687b2ceec27b01f5db730c34aae3d1a0ffca530a065b3da9efb`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Story`
  - `PasswordInput`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Input Component Stories
   3:  *
   4:  * Documentation and examples for the Input component
   5:  */
   7: import type { Meta, StoryObj } from "@storybook/react";
   8: import { Input } from "./forms/Input";
   9: import { View, StyleSheet } from "react-native";
```

### 778. `frontend/src/components/ItemFilters.tsx`
- Bytes: `339`
- Lines: `11`
- SHA256: `02b6a5652117e64cd09af727a77b2af9e1623ee5b8071c9ada17b3a798feb247`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Item Filters Component - Re-export from domains/inventory
   3:  *
   4:  * This file maintains backward compatibility for imports.
   5:  * The canonical source is now in domains/inventory/components/
   6:  *
   7:  * @deprecated Import from '@/domains/inventory/components/ItemFilters' instead
   8:  */
```

### 779. `frontend/src/components/ItemVerification.tsx`
- Bytes: `5868`
- Lines: `221`
- SHA256: `19138a1797a6697784285421ae114e8fe4d6ca8b7344dc2c6edb9c94591f5857`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ItemVerificationProps`
  - `formatDateTime`
  - `formatQuantity`
  - `getVarianceColor`
  - `getVarianceIcon`
- Excerpt (first non-empty lines):

```text
   1: import React from 'react';
   2: import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
   3: import Ionicons from '@expo/vector-icons/Ionicons';
   5: interface ItemVerificationProps {
   6:   sqlVerifiedQty?: number;
   7:   mongoQty: number;
   8:   variance?: number;
   9:   lastVerifiedAt?: string;
```

### 780. `frontend/src/components/LoadingSkeleton.tsx`
- Bytes: `546`
- Lines: `29`
- SHA256: `c68915dcdce9bf58e58b56c09301d1ad67c6c3ea61cd4b50ff721ac84e0a6c86`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SkeletonListProps`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { View } from "react-native";
   4: interface SkeletonListProps {
   5:   itemHeight: number;
   6:   count: number;
   7: }
   9: export const SkeletonList: React.FC<SkeletonListProps> = ({
  10:   itemHeight,
```

### 781. `frontend/src/components/LogoutButton.tsx`
- Bytes: `3510`
- Lines: `137`
- SHA256: `7979f02e4c0dd5340c8b8220cadbfc5ce1e259e7987b7d2f928228200eb72dd2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `LogoutButtonProps`
  - `handleLogout`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import {
   3:   TouchableOpacity,
   4:   Text,
   5:   StyleSheet,
   6:   Alert,
   7:   ActivityIndicator,
   8: } from "react-native";
```

### 782. `frontend/src/components/LottieAnimation.tsx`
- Bytes: `1729`
- Lines: `80`
- SHA256: `bd22df93ee7440f5aa3e8617602fd91c70b611bb952882d3377c1d63a58ada30`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `LottieAnimationProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Lottie Animation Component
   3:  * Wrapper for Lottie animations with fallback support
   4:  */
   6: import React from "react";
   7: import { View, StyleSheet, ActivityIndicator } from "react-native";
   8: import { useTheme } from "../hooks/useTheme";
   9: import { flags } from "../constants/flags";
```

### 783. `frontend/src/components/LottieLoading.tsx`
- Bytes: `2177`
- Lines: `91`
- SHA256: `0d4a4a04d7ac91af6099101a1055e1fef3d1e0750f0acad991e8635a12344fd6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `LottieLoadingProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Lottie Loading Component
   3:  * Pre-configured loading animation with Lottie
   4:  */
   6: import React from "react";
   7: import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
   8: import { useTheme } from "../hooks/useTheme";
   9: import { LottieAnimation } from "./LottieAnimation";
```

### 784. `frontend/src/components/Pagination.tsx`
- Bytes: `4811`
- Lines: `206`
- SHA256: `50f469d37d61d7270f158c0f5e6e706a8fe59395c7d15f6f18cb2c5b690ff9ba`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PaginationProps`
  - `handlePrevious`
  - `handleNext`
  - `handleFirst`
  - `handleLast`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
   4: interface PaginationProps {
   5:   currentPage: number;
   6:   totalPages: number;
   7:   totalItems: number;
   8:   pageSize: number;
   9:   onPageChange: (page: number) => void;
```

### 785. `frontend/src/components/PullToRefresh.tsx`
- Bytes: `654`
- Lines: `33`
- SHA256: `aa3881549ecea4633497febdeb9715c3061b242cb9832424cff520655414a437`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PullToRefreshProps`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { ScrollView, RefreshControl } from "react-native";
   4: interface PullToRefreshProps {
   5:   onRefresh: () => Promise<void> | void;
   6:   refreshing: boolean;
   7:   children: React.ReactNode;
   8:   style?: any;
   9: }
```

### 786. `frontend/src/components/RefreshButton.tsx`
- Bytes: `938`
- Lines: `42`
- SHA256: `c498a9b6065e1555ede541bb487b265cc767f7479c6f6529f43be51ee440d053`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `RefreshButtonProps`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
   3: import Ionicons from "@expo/vector-icons/Ionicons";
   5: interface RefreshButtonProps {
   6:   onRefresh: () => void;
   7:   loading?: boolean;
   8:   size?: number;
   9:   color?: string;
```

### 787. `frontend/src/components/SearchAutocomplete.stories.tsx`
- Bytes: `3205`
- Lines: `139`
- SHA256: `23486a22010374f45161371ee337245c024394774da2c0a762d77caacf44919f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Story`
  - `SearchWrapper`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * SearchAutocomplete Component Stories
   3:  *
   4:  * Documentation and examples for the SearchAutocomplete component
   5:  */
   7: import type { Meta, StoryObj } from "@storybook/react";
   8: import { SearchAutocomplete } from "./forms/SearchAutocomplete";
   9: import { View, StyleSheet } from "react-native";
```

### 788. `frontend/src/components/SwipeableRow.tsx`
- Bytes: `1704`
- Lines: `80`
- SHA256: `260ce825ed488c8f3b62ac7e5ae8be7b321d72d3388106c7a6387ff77e1a399f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Props`
  - `Action`
  - `renderLeft`
  - `renderRight`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
   3: import { Swipeable } from "react-native-gesture-handler";
   5: type Props = {
   6:   children: React.ReactNode;
   7:   leftLabel?: string;
   8:   rightLabel?: string;
   9:   onLeftAction?: () => void;
```

### 789. `frontend/src/components/SyncStatusBar.tsx`
- Bytes: `6176`
- Lines: `250`
- SHA256: `525ac1815b4d77f92138764e1b0e1d3262a255c9768182d2943119fb98a23cad`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SyncStatus`
  - `handleSync`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Sync Status Bar Component
   3:  * Shows sync status, queue count, and allows manual sync
   4:  */
   6: import React, { useEffect, useState } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 790. `frontend/src/components/UpgradeNotification.tsx`
- Bytes: `7709`
- Lines: `312`
- SHA256: `71e76995f9ccf844b2ca2a57ca069b44550bb8f867ef09e6e6ed948f20b637e2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `UpgradeNotificationProps`
  - `handleUpdate`
  - `getUpdateMessage`
  - `getIcon`
  - `getIconColor`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * UpgradeNotification Component
   3:  * Shows update available or force update banners
   4:  */
   5: import React from "react";
   6: import {
   7:   View,
   8:   Text,
```

### 791. `frontend/src/components/admin/ActiveUsersPanel.tsx`
- Bytes: `12241`
- Lines: `452`
- SHA256: `b6eb4883691b66b241361f2bf333e1987a8e897e2fb63c436ad024a754b11f36`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ActiveUser`
  - `ActiveUsersPanelProps`
  - `formatTimeAgo`
  - `deriveUserStatus`
  - `normalizeRole`
  - `handlePress`
  - `ActiveUsersPanel`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Active Users Panel - Enterprise Grade
   3:  * Displays currently active users with strict status logic and performance optimizations.
   4:  *
   5:  * // cSpell:ignore Subviews nums
   6:  */
   8: import React, { useMemo } from "react";
   9: import {
```

### 792. `frontend/src/components/admin/ChartsPanel.tsx`
- Bytes: `4034`
- Lines: `151`
- SHA256: `0227830e3686c5526521cee523a5985d0cef502f663fefdd76cb6162b1bef401`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ChartsPanelProps`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { View, Text, StyleSheet } from "react-native";
   3: import { ModernCard } from "../ui/ModernCard";
   4: import {
   5:   modernColors,
   6:   modernTypography,
   7:   modernSpacing,
   8: } from "../../styles/modernDesignSystem";
```

### 793. `frontend/src/components/admin/ErrorLogsPanel.tsx`
- Bytes: `21561`
- Lines: `840`
- SHA256: `f41d45c7c2e72d7392d931f8560be9a3be9fca04aa143f35889618fab2c33c13`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ErrorLogsPanelProps`
  - `formatDateTime`
  - `DetailModalProps`
  - `ErrorDetailModal`
  - `handleCopy`
  - `DetailRow`
  - `ErrorLogsPanel`
  - `handleLogPress`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Error Logs Panel - Enterprise Grade
   3:  * Displays operational error logs with lifecycle management, grouping, and detailed analysis hooks.
   4:  * Version: 2.1.1 // Force refresh
   5:  *
   6:  * // cSpell:ignore nums
   7:  */
   9: import React, { useState } from "react";
```

### 794. `frontend/src/components/admin/KPICard.tsx`
- Bytes: `6958`
- Lines: `262`
- SHA256: `20c9547f45c08353572d1efb19911ba2a35d03de4ea5e647cfab27b21ba55828`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `KPICardProps`
  - `KPICard`
  - `formatValue`
  - `getTrendIcon`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * KPI Card Component - Enterprise Grade
   3:  * Displays a single KPI metric with strict semantics, accessibility, and drill-down capability.
   4:  */
   6: import React from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 795. `frontend/src/components/admin/PerformanceChart.tsx`
- Bytes: `9536`
- Lines: `390`
- SHA256: `2da75f66fee36dd354d581d229b8fab0ea3500b47ede8d61e89d3225de4e5e85`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PerformanceDataPoint`
  - `PerformanceStats`
  - `PerformanceChartProps`
  - `MetricType`
  - `StatCard`
  - `SimpleBarChart`
  - `PerformanceChart`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Performance Chart Component - Displays performance metrics with line chart visualization
   3:  * Shows response times, request counts, and error rates over time
   4:  */
   6: import React, { useState, useMemo } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 796. `frontend/src/components/admin/QuickStats.tsx`
- Bytes: `1530`
- Lines: `59`
- SHA256: `2e61a899adfe099f924bea9db26f6ba375f6a9be47728d3220dae0a1c963d300`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `QuickStatsProps`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { View, Text, StyleSheet } from "react-native";
   3: import { ModernCard } from "../ui/ModernCard";
   4: import {
   5:   modernColors,
   6:   modernTypography,
   7:   modernSpacing,
   8: } from "../../styles/modernDesignSystem";
```

### 797. `frontend/src/components/admin/RecentIssues.tsx`
- Bytes: `2098`
- Lines: `78`
- SHA256: `8acc47d4837f39934acd2b73cc70ede32b4074a8b16ee13e8f07342d662465f0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `RecentIssuesProps`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { View, Text, StyleSheet } from "react-native";
   3: import Ionicons from "@expo/vector-icons/Ionicons";
   4: import { ModernCard } from "../ui/ModernCard";
   5: import {
   6:   modernColors,
   7:   modernTypography,
   8:   modernSpacing,
```

### 798. `frontend/src/components/admin/ReportExport.tsx`
- Bytes: `2918`
- Lines: `112`
- SHA256: `426725392eee758fd39d46a60d49be4c68ab97e5a088162592657a33548d0a64`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ReportExportProps`
  - `handleExportPDF`
- Excerpt (first non-empty lines):

```text
   1: import React, { useState } from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   StyleSheet,
   6:   TouchableOpacity,
   7:   ActivityIndicator,
   8:   Alert,
```

### 799. `frontend/src/components/admin/RoleSelector.tsx`
- Bytes: `10709`
- Lines: `442`
- SHA256: `6d4c03c1c4b44766a3553f776615519309d230c04db43a4683e94b1a3e52f361`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `RoleSelectorProps`
  - `RoleSelector`
  - `RoleBadgeProps`
  - `RoleBadge`
  - `RolePermissionsProps`
  - `RolePermissions`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * RoleSelector Component - Role assignment picker
   3:  * Reusable component for selecting user roles in admin forms
   4:  */
   6: import React from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 800. `frontend/src/components/admin/SystemStatusPanel.tsx`
- Bytes: `9138`
- Lines: `343`
- SHA256: `c64f12f7da3e89ef32a5a10e357571cd70d51aed39ef8a8fd42a7a1decad5e85`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SystemStatus`
  - `SystemStatusPanelProps`
  - `StatusType`
  - `getStatusType`
  - `formatUptime`
  - `StatusIndicator`
  - `MetricRow`
  - `SystemStatusPanel`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * System Status Panel - Displays real-time system health metrics
   3:  * Shows API status, database connections, response times, and resource usage
   4:  */
   6: import React from "react";
   7: import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
   8: import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
   9: import {
```

### 801. `frontend/src/components/admin/index.ts`
- Bytes: `499`
- Lines: `14`
- SHA256: `cbfe3c5f89032e2ae809920c91b36bf3afb9d2ff07bb9160ca6ca9c8b7b6b3bd`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Admin Components Index
   3:  * Export all admin dashboard components
   4:  */
   6: export { KPICard } from "./KPICard";
   7: export { SystemStatusPanel } from "./SystemStatusPanel";
   8: export { ActiveUsersPanel } from "./ActiveUsersPanel";
   9: export { ErrorLogsPanel } from "./ErrorLogsPanel";
```

### 802. `frontend/src/components/analytics/AnalyticsDashboard.tsx`
- Bytes: `8203`
- Lines: `276`
- SHA256: `0df543039537a9130563f0dba30b3bcb1ebe505e512f6249346edcab96a125df`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AnalyticsDashboardProps`
  - `handleRefresh`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * AnalyticsDashboard Component
   3:  * Main analytics dashboard with real-time metrics
   4:  * Phase 0: Advanced Analytics Dashboard
   5:  */
   7: import React, { useState, useEffect, useCallback } from "react";
   8: import {
   9:   View,
```

### 803. `frontend/src/components/analytics/MetricCard.tsx`
- Bytes: `3473`
- Lines: `142`
- SHA256: `d92bedc1ee63af8a3ea200ba27f6a227af5ac3b9b852df5ab56defbe196d9162`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `MetricCardProps`
  - `formatValue`
  - `getTrendColor`
  - `getTrendIcon`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * MetricCard Component
   3:  * Displays a single metric with trend indicator
   4:  * Phase 0: Advanced Analytics Dashboard
   5:  */
   7: import React from "react";
   8: import { View, Text, StyleSheet } from "react-native";
   9: import Ionicons from "@expo/vector-icons/Ionicons";
```

### 804. `frontend/src/components/analytics/VarianceChart.tsx`
- Bytes: `4291`
- Lines: `161`
- SHA256: `2eea22808d3a4dd7c2a06bf13bec9ce7db0a667bfa782ea117d5d38f3723b5d6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `VarianceChartProps`
  - `renderSimpleChart`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * VarianceChart Component
   3:  * Displays variance trends over time
   4:  * Phase 0: Advanced Analytics Dashboard
   5:  */
   7: import React from "react";
   8: import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
   9: import {
```

### 805. `frontend/src/components/analytics/index.ts`
- Bytes: `233`
- Lines: `9`
- SHA256: `d1686fe3508f6a36f3088bb18cb40971d3f4ebc6227daa6b93a494d3eb06433a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Analytics Components Index
   3:  * Export all analytics-related components
   4:  */
   6: export { MetricCard } from "./MetricCard";
   7: export { VarianceChart } from "./VarianceChart";
   8: export { AnalyticsDashboard } from "./AnalyticsDashboard";
```

### 806. `frontend/src/components/auth/AuthGuard.tsx`
- Bytes: `2562`
- Lines: `81`
- SHA256: `0910b29b46f416c796ad25e2ddbf0abfce23c3ad93f5c215df952f08001fe3d0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AuthGuard`
- Excerpt (first non-empty lines):

```text
   1: import React, { useEffect } from "react";
   2: import { useRouter, useSegments } from "expo-router";
   3: import { useAuthStore } from "../../store/authStore";
   4: import { useSettingsStore } from "../../store/settingsStore";
   5: import {
   6:   getRouteForRole,
   7:   isRouteAllowedForRole,
   8:   UserRole,
```

### 807. `frontend/src/components/auth/ConnectionStatus.tsx`
- Bytes: `5165`
- Lines: `205`
- SHA256: `44b8ff1d03164f3506240f362d6c9b2eb74c0200f4c654a20b5523228033d32b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ConnectionStatusProps`
  - `ConnectionStatus`
  - `getServerStatus`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Connection Status Indicator
   3:  *
   4:  * Shows Wi-Fi and Server connection status
   5:  * Part of the UX requirements for persistent indicators
   6:  */
   8: import React from "react";
   9: import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
```

### 808. `frontend/src/components/auth/PasswordInput.tsx`
- Bytes: `5459`
- Lines: `214`
- SHA256: `ed3903b0ed7810c5b067dc83c6214665bb5445fd10d8b0a5dd30501ab65307f3`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PasswordInput`
  - `getBorderColor`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * PasswordInput Component
   3:  * Secure text input with visibility toggle
   4:  *
   5:  * Features:
   6:  * - Eye/eye-off icon toggle
   7:  * - Haptic feedback on toggle
   8:  * - Uses unified theme tokens
```

### 809. `frontend/src/components/auth/PermissionGate.tsx`
- Bytes: `1513`
- Lines: `72`
- SHA256: `ac3a037eaac179ef36594c6dbb3e7f6eddc30027737b3158c637eaefaa105a88`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PermissionGateProps`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { usePermission } from "../../hooks/usePermission";
   3: import { Permission, Role } from "../../constants/permissions";
   5: interface PermissionGateProps {
   6:   /**
   7:    * Required permission to show children
   8:    */
   9:   permission?: Permission | string;
```

### 810. `frontend/src/components/auth/PinKeypad.tsx`
- Bytes: `6843`
- Lines: `278`
- SHA256: `e55af32893a91b1b14989b541da48453b41a7c19350c4d01b55585cbe0280c6d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PinKeypadProps`
  - `PinKeypad`
  - `renderIndicators`
  - `renderKey`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * PIN Keypad Component
   3:  *
   4:  * Features:
   5:  * - 4-digit PIN input with large tap targets (minimum 60px)
   6:  * - Visual feedback with filled/empty indicators
   7:  * - Haptic feedback on key press
   8:  * - Backspace and clear functionality
```

### 811. `frontend/src/components/auth/RoleLayoutGuard.tsx`
- Bytes: `1263`
- Lines: `48`
- SHA256: `3ccc66b5b04a9deddc9509cdbdffe8f361a72731ecaeba1a04c85187f7344516`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `UserRole`
  - `RoleLayoutGuardProps`
  - `RoleLayoutGuard`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { Redirect } from "expo-router";
   3: import { View, ActivityIndicator } from "react-native";
   4: import { useAuthStore } from "@/store/authStore";
   6: type UserRole = "staff" | "supervisor" | "admin";
   8: interface RoleLayoutGuardProps {
   9:   allowedRoles: readonly UserRole[];
  10:   children: React.ReactNode;
```

### 812. `frontend/src/components/auth/index.ts`
- Bytes: `249`
- Lines: `6`
- SHA256: `0afefd13589599cf7dab99bf44254ff3a58484bd84d4456063afe0c092b947eb`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: // Auth components export
   2: export { PinKeypad } from "./PinKeypad";
   3: export { ConnectionStatus } from "./ConnectionStatus";
   4: export { RoleLayoutGuard } from "./RoleLayoutGuard";
   5: export { PasswordInput, type PasswordInputProps } from "./PasswordInput";
```

### 813. `frontend/src/components/camera/CameraControls.tsx`
- Bytes: `4080`
- Lines: `169`
- SHA256: `08d75e4bcb809971dae67a7c4493538855703af47248d13d082753ecd5e02ae2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `CameraControlsProps`
  - `handleTorchPress`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * CameraControls Component
   3:  * Enhanced camera controls for scanning
   4:  * Phase 0: Enhanced Mobile Camera Features
   5:  */
   7: import React from "react";
   8: import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
   9: import Ionicons from "@expo/vector-icons/Ionicons";
```

### 814. `frontend/src/components/camera/ScanGuideOverlay.tsx`
- Bytes: `7518`
- Lines: `296`
- SHA256: `0e8b91cc2b55ded7e12aa7cc59d8224ab472ef200b7da6dd107d4f408bef6b5b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ScanGuideOverlayProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * ScanGuideOverlay Component
   3:  * Visual guide for optimal barcode scanning
   4:  * Phase 0: Enhanced Mobile Camera Features
   5:  */
   7: import React, { useEffect } from "react";
   8: import { View, StyleSheet, Text } from "react-native";
   9: import Animated, {
```

### 815. `frontend/src/components/camera/index.ts`
- Bytes: `182`
- Lines: `8`
- SHA256: `070c672ecc2cae67e3ab133b77b405f54d33d61bfa5ea85e7e6eb0c5fcb40c9d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Camera Components Index
   3:  * Export all camera-related components
   4:  */
   6: export { CameraControls } from "./CameraControls";
   7: export { ScanGuideOverlay } from "./ScanGuideOverlay";
```

### 816. `frontend/src/components/charts/BarChart.tsx`
- Bytes: `5077`
- Lines: `186`
- SHA256: `bbb7dfcdb3156ec56aad0a34550b2b98c6b29b95aaae69c1d429bcd8cee4e400`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `BarData`
  - `BarChartProps`
  - `barWidth`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Bar Chart Component - SVG-based for React Native
   3:  * Fully functional bar chart for analytics
   4:  */
   6: import React from "react";
   7: import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
   8: import Svg, { Rect, Line, Text as SvgText, G } from "react-native-svg";
   9: import {
```

### 817. `frontend/src/components/charts/LineChart.tsx`
- Bytes: `6723`
- Lines: `258`
- SHA256: `f415b516ee730940fc87f6975337a06c8f91e75b89c5c5082a47810e6fcdcdce`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `DataPoint`
  - `LineChartProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Line Chart Component - SVG-based for React Native
   3:  * Fully functional chart component for analytics
   4:  */
   6: import React from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 818. `frontend/src/components/charts/PieChart.tsx`
- Bytes: `5033`
- Lines: `189`
- SHA256: `dc823b4de79bd5e2c3f2d2bca08cf83ddec17edaceff4d0d7ddc3ef6a67589d0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PieData`
  - `PieChartProps`
  - `startAngleRad`
  - `endAngleRad`
  - `labelAngle`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Pie Chart Component - SVG-based for React Native
   3:  * Fully functional pie chart for analytics
   4:  */
   6: import React from "react";
   7: import { View, Text, StyleSheet } from "react-native";
   8: import Svg, { G, Path, Text as SvgText } from "react-native-svg";
   9: import {
```

### 819. `frontend/src/components/charts/SimpleBarChart.tsx`
- Bytes: `6345`
- Lines: `258`
- SHA256: `71f3c2effe8fa2d8a9aa124c6235a3f476cc58a438e523595ca28b86f314c1c5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `BarData`
  - `SimpleBarChartProps`
  - `barWidth`
  - `y`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Simple Bar Chart - View-based implementation (no SVG required)
   3:  * Fully functional bar chart using React Native Views
   4:  */
   6: import React from "react";
   7: import { View, Text, StyleSheet, Dimensions } from "react-native";
   8: import {
   9:   modernColors,
```

### 820. `frontend/src/components/charts/SimpleLineChart.tsx`
- Bytes: `9246`
- Lines: `360`
- SHA256: `715d3efa4534b0fe31df4f45217fedf9fb31b39c6dddd2c3e1db241bc6364ec2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `DataPoint`
  - `SimpleLineChartProps`
  - `y`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Simple Line Chart - View-based implementation (no SVG required)
   3:  * Fully functional line chart using React Native Views
   4:  */
   6: import React from "react";
   7: import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
   8: import {
   9:   modernColors,
```

### 821. `frontend/src/components/charts/SimplePieChart.tsx`
- Bytes: `6542`
- Lines: `261`
- SHA256: `d75a8e79538259af2a00ae968b3d5c662a40966a6d93202351950fe18db144a3`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PieData`
  - `SimplePieChartProps`
  - `renderPieChart`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Simple Pie Chart - View-based implementation (no SVG required)
   3:  * Fully functional pie chart using React Native Views with conic gradients simulation
   4:  */
   6: import React from "react";
   7: import { View, Text, StyleSheet, Platform } from "react-native";
   9: import {
  10:   modernColors,
```

### 822. `frontend/src/components/charts/index.ts`
- Bytes: `174`
- Lines: `8`
- SHA256: `babd5ce707c62ccc570d04744edf85919e9df6f21d86a0cf64d8e1c4b924fe44`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Charts Index - Export all chart components
   3:  */
   5: export { LineChart } from "./LineChart";
   6: export { BarChart } from "./BarChart";
   7: export { PieChart } from "./PieChart";
```

### 823. `frontend/src/components/common/AccessibilityEnhancer.tsx`
- Bytes: `2857`
- Lines: `105`
- SHA256: `da0a0025683b33e02c33efc39fa05ae2caf03a33ed0872dd82044d90e9fa6b1d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AccessibilityEnhancerProps`
  - `getEnhancedStyle`
  - `withAccessibility`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import {
   3:   View,
   4:   StyleSheet,
   5:   TouchableOpacity,
   6:   Platform,
   7:   type ViewStyle,
   8: } from "react-native";
```

### 824. `frontend/src/components/common/ThemeToggle.tsx`
- Bytes: `3018`
- Lines: `114`
- SHA256: `579eb6e85005d6ccff8a423441a5a29febd087d980777835d5dd63a7c34fb7a4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `handleToggle`
  - `getIconName`
  - `getLabel`
  - `getAccessibilityLabel`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { TouchableOpacity, Text, StyleSheet, Animated } from "react-native";
   3: import Ionicons from "@expo/vector-icons/Ionicons";
   4: import { useThemeContext } from "../../context/ThemeContext";
   5: import { useHapticFeedback } from "../../hooks/useHapticFeedback";
   7: export const ThemeToggle: React.FC = () => {
   8:   const { themeLegacy: theme, themeMode, setThemeMode } = useThemeContext();
   9:   const { colors } = theme;
```

### 825. `frontend/src/components/common/VirtualList.tsx`
- Bytes: `894`
- Lines: `33`
- SHA256: `83f92690e6d03cc070a626100e60a73cdf20221868a9135257404396075afd0c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `VirtualListProps`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { FlatListProps } from "react-native";
   3: import { FlashList, ListRenderItem } from "@shopify/flash-list";
   5: interface VirtualListProps<T> extends Omit<FlatListProps<T>, "renderItem"> {
   6:   data: T[];
   7:   renderItem: ListRenderItem<T>;
   8:   estimatedItemSize: number;
   9: }
```

### 826. `frontend/src/components/feedback/AdminCrashScreen.tsx`
- Bytes: `5783`
- Lines: `236`
- SHA256: `6b1bca2935a28cfdd249c98b6b0790e9d6e9e5d38748100606e7118f2b303b23`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AdminCrashScreenProps`
  - `handleGoHome`
  - `handleLogout`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * AdminCrashScreen Component
   3:  *
   4:  * Fallback UI for ErrorBoundary in admin layouts.
   5:  * Provides a recovery path when admin screens crash.
   6:  */
   8: import React from "react";
   9: import {
```

### 827. `frontend/src/components/feedback/ErrorBoundary.tsx`
- Bytes: `3691`
- Lines: `170`
- SHA256: `87d74497d6fed6fa57c9deb1d24a96be93798a2fbb3b7b8a74dfee201b51abb2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ErrorBoundaryProps`
  - `ErrorBoundaryState`
  - `ErrorBoundary`
- Excerpt (first non-empty lines):

```text
   1: import React, { Component, ReactNode, ErrorInfo } from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   TouchableOpacity,
   6:   StyleSheet,
   7:   ScrollView,
   8: } from "react-native";
```

### 828. `frontend/src/components/feedback/ErrorState.tsx`
- Bytes: `6735`
- Lines: `256`
- SHA256: `d741d09673b073feb98212600759edec5a34c7283aa506c11a758474a8ee415a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ErrorStateProps`
  - `getErrorConfig`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * ErrorState Component
   3:  * Displays error messages with retry functionality and helpful guidance
   4:  *
   5:  * Features:
   6:  * - Multiple error type icons (network, validation, server, general)
   7:  * - Retry button with loading state
   8:  * - Accessibility labels for screen readers
```

### 829. `frontend/src/components/feedback/LoadingSkeleton.tsx`
- Bytes: `2287`
- Lines: `102`
- SHA256: `0d5599b1ff0758e0ab6e27526046d35079d252c37559c77d71f95072c39a00cf`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SkeletonProps`
  - `SkeletonListProps`
- Excerpt (first non-empty lines):

```text
   1: import React, { useEffect } from "react";
   2: import { View, StyleSheet, DimensionValue } from "react-native";
   3: import Animated, {
   4:   useSharedValue,
   5:   useAnimatedStyle,
   6:   withRepeat,
   7:   withSequence,
   8:   withTiming,
```

### 830. `frontend/src/components/feedback/LoadingState.tsx`
- Bytes: `8760`
- Lines: `384`
- SHA256: `24718330e76ba04081a17655ec0859fa1b35d0ba94bc282684d026fb4f634f4a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `LoadingSpinnerProps`
  - `SkeletonProps`
  - `SkeletonListProps`
  - `CardSkeletonProps`
  - `LoadingStateProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * LoadingState Component
   3:  * Unified loading state management with multiple variants
   4:  *
   5:  * Features:
   6:  * - Animated spinner with smooth transitions
   7:  * - Customizable skeletons for content placeholders
   8:  * - Full-screen overlay option
```

### 831. `frontend/src/components/feedback/NetworkStatusBanner.tsx`
- Bytes: `3774`
- Lines: `155`
- SHA256: `af4182bbd6cf64e6646abbfa5d8dd9775c9f8c090e061599d15711cdbac76341`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `NetworkStatusBannerProps`
  - `updateQueueCount`
  - `handleSync`
- Excerpt (first non-empty lines):

```text
   1: import React, { useEffect, useState } from "react";
   2: import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
   3: import { useNetworkStore } from "../../store/networkStore";
   4: import { getOfflineQueue } from "../../services/offline/offlineStorage";
   5: import { syncOfflineQueue } from "../../services/api";
   7: interface NetworkStatusBannerProps {
   8:   onSyncPress?: () => void;
   9: }
```

### 832. `frontend/src/components/feedback/StaffCrashScreen.tsx`
- Bytes: `5621`
- Lines: `228`
- SHA256: `500adaecf2d8701a784da2370fa22d7284f0f8ed8011048daba0a46b0b3c8df3`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `StaffCrashScreenProps`
  - `handleGoToScan`
  - `handleLogout`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * StaffCrashScreen Component
   3:  *
   4:  * Fallback UI for ErrorBoundary in staff layouts.
   5:  * Provides a recovery path when staff screens crash.
   6:  * Optimized for scan-first workflow recovery.
   7:  */
   9: import React from "react";
```

### 833. `frontend/src/components/feedback/Toast.tsx`
- Bytes: `3650`
- Lines: `165`
- SHA256: `269719df3d1bf81f3f1270ab7e704e9ba9503a5c2783b1ab0b38c24c96b7b662`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ToastProps`
  - `getIcon`
  - `getColor`
- Excerpt (first non-empty lines):

```text
   1: import React, { useEffect } from "react";
   2: import { Text, StyleSheet, Platform } from "react-native";
   3: import Animated, {
   4:   useSharedValue,
   5:   useAnimatedStyle,
   6:   withTiming,
   7:   withSpring,
   8:   Easing,
```

### 834. `frontend/src/components/feedback/ToastProvider.tsx`
- Bytes: `2326`
- Lines: `95`
- SHA256: `59b1fd6100ae22acbb7a5eeb3b036f5950c56b3fbe1bb395f823e1f7018acea6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `handleShow`
  - `handleHide`
  - `handleClear`
  - `useToast`
- Excerpt (first non-empty lines):

```text
   1: import React, { useState, useEffect } from "react";
   2: import { View, StyleSheet } from "react-native";
   3: import { Toast } from "./Toast";
   4: import { ToastData, toastService } from "../../services/utils/toastService";
   6: export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
   7:   children,
   8: }) => {
   9:   const [toasts, setToasts] = useState<ToastData[]>([]);
```

### 835. `frontend/src/components/feedback/index.ts`
- Bytes: `305`
- Lines: `12`
- SHA256: `01c546b14e828297d2852d7de11b6cb00840922a38c7f035198e92973049fae9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: export {
   2:   Skeleton as LoadingSkeleton,
   3:   SkeletonList as FeedbackSkeletonList,
   4: } from "./LoadingSkeleton";
   5: // export * from "./LoadingSpinner";
   6: export * from "./LoadingState";
   7: export * from "./ErrorState";
   8: export * from "./NetworkStatusBanner";
```

### 836. `frontend/src/components/filters/FilterPanel.tsx`
- Bytes: `12703`
- Lines: `480`
- SHA256: `4ea3e1ac6fba1f33fa9603e503adb400984d2af2d4b525541e51a3304aae72e0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `FilterPanel`
  - `isExpanded`
  - `isChecked`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * FilterPanel - Advanced filtering component for supervisor dashboards
   3:  *
   4:  * Provides unified filtering controls with:
   5:  * - Date range selection
   6:  * - Status/type filters
   7:  * - Collapsible filter sections
   8:  * - Animated reveal/hide
```

### 837. `frontend/src/components/filters/SearchInput.tsx`
- Bytes: `8185`
- Lines: `322`
- SHA256: `669a9d8aa10bcf4775f94e9e5f89878d369231d4869c047c9502a316556bf6ee`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SearchInput`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * SearchInput - Debounced search input component
   3:  *
   4:  * Provides a search input with:
   5:  * - Debounced input handling (configurable delay)
   6:  * - Clear button
   7:  * - Loading indicator
   8:  * - Keyboard handling
```

### 838. `frontend/src/components/filters/index.ts`
- Bytes: `362`
- Lines: `17`
- SHA256: `5709b0a11cd7f9dfea1ae60acc395a3a01c534944001c03cc3c1cc4f601ab5dd`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Filter Components Index
   3:  *
   4:  * Exports all filter-related components for the supervisor dashboard
   5:  */
   7: export { FilterPanel } from "./FilterPanel";
   8: export type {
   9:   FilterPanelProps,
```

### 839. `frontend/src/components/forms/DateRangePicker.tsx`
- Bytes: `4233`
- Lines: `164`
- SHA256: `e0c9dd964813ee42535b901d2c27a437e75b98144c31a635ab4b1829889104c0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `DateRangePickerProps`
  - `formatDate`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Date Range Picker Component
   3:  * Fully functional date range selection for reports and analytics
   4:  */
   6: import React, { useState } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 840. `frontend/src/components/forms/EnhancedButton.tsx`
- Bytes: `297`
- Lines: `11`
- SHA256: `95364a0ab4d81faac16d22ae5d91482461b06a04bb478658e2af6d3eb31ffda2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { ModernButton } from "../ui/ModernButton";
   4: export type EnhancedButtonProps = React.ComponentProps<typeof ModernButton>;
   6: const EnhancedButton: React.FC<EnhancedButtonProps> = (props) => {
   7:   return <ModernButton {...props} />;
   8: };
  10: export default EnhancedButton;
```

### 841. `frontend/src/components/forms/EnhancedTextInput.tsx`
- Bytes: `368`
- Lines: `15`
- SHA256: `de858ebe8b3f0c86d2a26338f55e823900eb1be72c31789a1da839cefa1edd62`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { Input } from "./Input";
   4: export type EnhancedTextInputProps = React.ComponentProps<typeof Input>;
   6: const EnhancedTextInput = React.forwardRef<any, EnhancedTextInputProps>(
   7:   (props, ref) => {
   8:     return <Input {...props} ref={ref} />;
   9:   },
  10: );
```

### 842. `frontend/src/components/forms/Input.tsx`
- Bytes: `3966`
- Lines: `170`
- SHA256: `1cb0c7e3ee21da4645f7ec595c1beda67d64d0f1af55feb217b55eb31b91d2be`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `InputProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Input Component - Enhanced text input
   3:  */
   5: import React from "react";
   6: import {
   7:   TextInput,
   8:   View,
   9:   Text,
```

### 843. `frontend/src/components/forms/SearchAutocomplete.tsx`
- Bytes: `16951`
- Lines: `646`
- SHA256: `55c9a76861e1f3898956ece09b293358cea23e1ddc83aa03e731d1408834b245`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SearchAutocompleteProps`
  - `handleQueryChange`
  - `handleSelectItem`
  - `handleClear`
  - `renderResultItem`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Search Autocomplete Component
   3:  * Enhanced search with dropdown suggestions after 4 characters
   4:  */
   6: import React, { useState, useEffect, useRef } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 844. `frontend/src/components/forms/index.ts`
- Bytes: `193`
- Lines: `6`
- SHA256: `aa99b86f54d48b83f5047462157ab968623df8d4ba565a2e4186e035d7cf6010`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: export * from "./DateRangePicker";
   2: // EnhancedButton re-exported from ui/ to avoid duplicate
   3: export * from "./EnhancedTextInput";
   4: export * from "./Input";
   5: export * from "./SearchAutocomplete";
```

### 845. `frontend/src/components/index.ts`
- Bytes: `371`
- Lines: `11`
- SHA256: `6a79aff0154440270e9b9894e8a99018ba635e798943a3b8122fcfb877e77874`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: export * from "./ui";
   2: export * from "./forms";
   3: export * from "./layout";
   4: export * from "./navigation";
   5: export * from "./charts";
   6: export { ErrorState } from "./feedback";
   7: export { NetworkStatusBanner } from "./feedback";
   8: export { ToastProvider } from "./feedback";
```

### 846. `frontend/src/components/layout/AdminLayout.tsx`
- Bytes: `4110`
- Lines: `162`
- SHA256: `ada200b2adbe38e98fc141279bc1d98cbb849bcdd5e66ef7fc6de4e205846728`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AdminLayoutProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * AdminLayout Component - Layout wrapper for admin routes
   3:  * Includes AdminSidebar (web/tablet) or Drawer (mobile), AppHeader, and Screen
   4:  */
   6: import React, { useState } from "react";
   7: import {
   8:   View,
   9:   StyleSheet,
```

### 847. `frontend/src/components/layout/Container.tsx`
- Bytes: `1504`
- Lines: `57`
- SHA256: `7fb9c728767d817e3402042f4c81bf55a779f129f2d272514ce15225f9046898`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ContainerProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Container Component - Responsive max-width container
   3:  * Centers content on large screens, full width on mobile
   4:  */
   6: import React from "react";
   7: import { View, StyleSheet, ViewStyle, useWindowDimensions } from "react-native";
   8: import { breakpoints, layout } from "../../styles/globalStyles";
  10: interface ContainerProps {
```

### 848. `frontend/src/components/layout/Header.tsx`
- Bytes: `2816`
- Lines: `127`
- SHA256: `32039cceafb26e038ffefc8b5f0ab826fb23b9e720cdc60534a72465549d6b9a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `HeaderProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Header Component - App header with navigation
   3:  */
   5: import React from "react";
   6: import {
   7:   View,
   8:   Text,
   9:   StyleSheet,
```

### 849. `frontend/src/components/layout/ResponsiveLayout.tsx`
- Bytes: `6277`
- Lines: `272`
- SHA256: `e1b46f9d08aa74a4a052cc319782ef73046247a498443e7f5d46b4526337362d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ResponsiveLayoutProps`
  - `getPadding`
  - `getMaxWidth`
  - `ResponsiveRowProps`
  - `ResponsiveGridProps`
  - `itemWidth`
  - `getResponsiveTextStyles`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * ResponsiveLayout Component - Auto-adjusting container for iOS UI alignment
   3:  *
   4:  * Features:
   5:  * - Automatic padding based on device size
   6:  * - Max width constraints for tablets
   7:  * - Safe area handling
   8:  * - Orientation-aware layouts
```

### 850. `frontend/src/components/layout/Screen.tsx`
- Bytes: `2780`
- Lines: `125`
- SHA256: `b1b6c2ad6596fd0c96ac93b40e34c2157d3392782633e9d429552daeda6d13e1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ScreenProps`
  - `content`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Screen Component - Wrapper for all screens
   3:  * Handles safe area insets, consistent padding, and scroll behavior
   4:  */
   6: import React from "react";
   7: import {
   8:   View,
   9:   StyleSheet,
```

### 851. `frontend/src/components/layout/Section.tsx`
- Bytes: `3022`
- Lines: `129`
- SHA256: `2bf9ae57c7176244ae6c443b0623327452f7d6bc64e2fe2236831f7887ea3500`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SectionProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Section Component - Content grouping with consistent spacing
   3:  * Provides title, subtitle, and optional action button
   4:  */
   6: import React from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 852. `frontend/src/components/layout/SettingGroup.tsx`
- Bytes: `1595`
- Lines: `80`
- SHA256: `1a5ae1185925a08314bcbe1775f78a7a1fe8986463f1b614cbe4dd40420c7b63`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SettingGroupProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Setting Group Component - Group of related settings
   3:  */
   5: import React from "react";
   6: import { View, Text, StyleSheet } from "react-native";
   7: import Ionicons from "@expo/vector-icons/Ionicons";
   8: import { useTheme } from "../../hooks/useTheme";
  10: interface SettingGroupProps {
```

### 853. `frontend/src/components/layout/SettingItem.tsx`
- Bytes: `3975`
- Lines: `167`
- SHA256: `f936141a09437902f93946c4d3bd248ed83c8cb8ae050ca618b67b87edede335`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SettingItemProps`
  - `handlePress`
  - `nextIndex`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Setting Item Component - Individual setting row
   3:  */
   5: import React from "react";
   6: import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
   7: import Ionicons from "@expo/vector-icons/Ionicons";
   8: import { useTheme } from "../../hooks/useTheme";
  10: interface SettingItemProps {
```

### 854. `frontend/src/components/layout/StaffLayout.tsx`
- Bytes: `2556`
- Lines: `102`
- SHA256: `d2f1e2a7146d1e8bebad5e3d342beebc0fa638a847c4f4fa87cd65052c31d177`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `StaffLayoutProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * StaffLayout Component - Layout wrapper for staff routes
   3:  * Includes AppHeader, Screen, and StaffTabBar (mobile)
   4:  */
   6: import React from "react";
   7: import { View, StyleSheet, Platform, ViewStyle } from "react-native";
   8: import { useSegments } from "expo-router";
   9: import { Screen } from "./Screen";
```

### 855. `frontend/src/components/layout/SupervisorLayout.tsx`
- Bytes: `2572`
- Lines: `104`
- SHA256: `f4790338007845a0d4b3086a909045485696f55a59b00f2e0109e1a28f58be17`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SupervisorLayoutProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * SupervisorLayout Component - Layout wrapper for supervisor routes
   3:  * Includes AppHeader with user info and Screen wrapper
   4:  */
   6: import React from "react";
   7: import { View, StyleSheet, ViewStyle, Alert } from "react-native";
   8: import { useRouter } from "expo-router";
   9: import { Screen, ScreenVariant } from "./Screen";
```

### 856. `frontend/src/components/layout/index.ts`
- Bytes: `465`
- Lines: `18`
- SHA256: `9a021fa49086d7c0aa7e63d671c2f2ff1e4ec93d238533bccd63b0e0a28b97c1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Layout Components - Exports
   3:  */
   5: export { Screen } from "./Screen";
   6: export type { ScreenVariant } from "./Screen";
   7: export { Section } from "./Section";
   8: export { Container } from "./Container";
   9: export { StaffLayout } from "./StaffLayout";
```

### 857. `frontend/src/components/modals/BulkEntryModal.tsx`
- Bytes: `5569`
- Lines: `211`
- SHA256: `a9a8d440aa36c8d12483ff8e54a2395e71c8ef37f544158ee3091bed3f85bbf9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `BulkEntryModalProps`
  - `handleParse`
  - `handleConfirm`
  - `resetAndClose`
- Excerpt (first non-empty lines):

```text
   1: import React, { useState } from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   TextInput,
   6:   StyleSheet,
   7:   ScrollView,
   8:   Alert,
```

### 858. `frontend/src/components/modals/ImageViewerModal.tsx`
- Bytes: `2587`
- Lines: `107`
- SHA256: `33d9441e85690c653c31d1e6d727f6faf61d4115cb3a2802dec51687adc66612`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ImageViewerModalProps`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import {
   3:   Modal,
   4:   StyleSheet,
   5:   View,
   6:   TouchableOpacity,
   7:   StatusBar,
   8:   FlatList,
```

### 859. `frontend/src/components/modals/PhotoCaptureModal.tsx`
- Bytes: `8130`
- Lines: `309`
- SHA256: `5c564728ec274a0569e6ec0863fec6139a84f32043c2154afe0e22c5eddcf80a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PhotoCaptureModalProps`
  - `handleCapture`
  - `handleConfirm`
  - `handleRetake`
  - `handleClose`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * PhotoCaptureModal Component
   3:  * Modal for capturing photos using the device camera
   4:  */
   6: import React, { useState, useRef } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 860. `frontend/src/components/modals/PinEntryModal.tsx`
- Bytes: `5863`
- Lines: `231`
- SHA256: `9c586a5f159ecc3d286dfc05912fb48035d9fac50ba03d371a499b97cd5686f6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PinEntryModalProps`
  - `handleSubmit`
  - `handleClose`
- Excerpt (first non-empty lines):

```text
   1: import React, { useState } from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   TextInput,
   6:   StyleSheet,
   7:   TouchableOpacity,
   8:   ActivityIndicator,
```

### 861. `frontend/src/components/modals/SearchableSelectModal.tsx`
- Bytes: `6486`
- Lines: `250`
- SHA256: `9d77d15e61a5b16ddd5fc68401db1311d392486e376c3a0a51cabcf7f0e7dcde`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SearchableSelectModalProps`
  - `handleSelect`
  - `handleClose`
  - `renderOption`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * SearchableSelectModal Component
   3:  * Modal with searchable dropdown for selecting options
   4:  */
   6: import React, { useState, useMemo } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 862. `frontend/src/components/modals/SerialScannerModal.tsx`
- Bytes: `20463`
- Lines: `726`
- SHA256: `5f821d0ed3d8f0f69d379385ead8ce563fe021f530b83c0d0b87a6bbc7fb5c09`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `DetectedCodeStatus`
  - `DetectedCode`
  - `SerialScannerModalProps`
  - `getFeedbackStyle`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * SerialScannerModal - Dedicated scanner for serial numbers
   3:  * Validates scanned codes as serial numbers (not barcodes)
   4:  * Collects detected candidates and lets user tap the correct serial to add
   5:  */
   6: import React, { useRef, useCallback, useState } from "react";
   7: import {
   8:   View,
```

### 863. `frontend/src/components/modals/index.ts`
- Bytes: `304`
- Lines: `10`
- SHA256: `299d97a721a8560e8df6fcc763944cdaf3c29772487b1099dc7868ab76106ef0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Modal Components - Exports
   3:  */
   5: export { SearchableSelectModal } from "./SearchableSelectModal";
   6: export type { SearchableSelectModalProps } from "./SearchableSelectModal";
   8: export { PhotoCaptureModal } from "./PhotoCaptureModal";
   9: export type { PhotoCaptureModalProps } from "./PhotoCaptureModal";
```

### 864. `frontend/src/components/navigation/AdminSidebar.tsx`
- Bytes: `13739`
- Lines: `539`
- SHA256: `035b06239a6c18770e9be99d2de2ad4298ddbbef46247767ecfec8142e9a0555`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SidebarItem`
  - `SidebarGroup`
  - `AdminSidebarProps`
  - `isActive`
  - `handleItemPress`
  - `handleLogout`
  - `toggleGroup`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * AdminSidebar Component - Extended sidebar for admin role
   3:  * Includes all supervisor sections plus admin-specific sections
   4:  */
   6: import React, { useState } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 865. `frontend/src/components/navigation/AppHeader.tsx`
- Bytes: `5606`
- Lines: `222`
- SHA256: `980b56728119764f83b97de04ba0cc7947cae821029fb7e447a4a00d3d2dca11`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `HeaderAction`
  - `AppHeaderProps`
  - `handleBack`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * AppHeader Component - Global header bar for all screens
   3:  * Replaces custom headers with consistent, accessible header
   4:  */
   6: import React from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 866. `frontend/src/components/navigation/BottomNavBar.tsx`
- Bytes: `4375`
- Lines: `180`
- SHA256: `066d4ac4678a0e688c7ebebff82ad603539999d123d6679523e53369c8f5614b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `BottomNavBarProps`
  - `handleTabPress`
  - `getDefaultInventoryTabs`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Bottom Navigation Bar - Shared Component v3.0
   3:  *
   4:  * A reusable bottom navigation bar for workflow screens.
   5:  * Supports customizable tabs with icons and callbacks.
   6:  */
   8: import React from "react";
   9: import {
```

### 867. `frontend/src/components/navigation/QuickActions.tsx`
- Bytes: `3039`
- Lines: `135`
- SHA256: `3cfb7c1824bbb469a9a28193b1ebe9985a8452f245c0dabc7a56b39ac18f0f82`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `QuickAction`
  - `QuickActionsProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Quick Actions Component
   3:  * Provides quick access buttons for common operations
   4:  */
   6: import React from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 868. `frontend/src/components/navigation/StaffTabBar.tsx`
- Bytes: `4789`
- Lines: `204`
- SHA256: `962645e6118dc0df617b9be665fe5dae2dbd678a7002a4d7a8d31ab92cf42c68`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `TabItem`
  - `StaffTabBarProps`
  - `handleTabPress`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * StaffTabBar Component - Bottom tab bar for staff role
   3:  * Mobile-only navigation (hidden on web)
   4:  */
   6: import React from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 869. `frontend/src/components/navigation/SupervisorSidebar.tsx`
- Bytes: `11634`
- Lines: `447`
- SHA256: `b875110716d91d24d57ae2474f646373b47a301bdea9c6b55b8f59130d3b5f3a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SidebarItem`
  - `SidebarGroup`
  - `SupervisorSidebarProps`
  - `isActive`
  - `handleItemPress`
  - `handleLogout`
  - `toggleGroup`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * SupervisorSidebar Component - Persistent sidebar for supervisor/admin
   3:  * Collapsible on mobile (drawer), always visible on web/tablet
   4:  */
   6: import React, { useState } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 870. `frontend/src/components/navigation/__tests__/BottomNavBar.test.tsx`
- Bytes: `6109`
- Lines: `209`
- SHA256: `89c4e5ca1c23d31169bb83847674ad65e4d89a9a83f747a0387468afe18a24dd`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * BottomNavBar Component Tests
   3:  * Tests for the shared bottom navigation bar component
   4:  */
   6: import { describe, it, expect, jest, beforeEach } from "@jest/globals";
   8: describe("BottomNavBar Component", () => {
   9:   beforeEach(() => {
  10:     jest.clearAllMocks();
```

### 871. `frontend/src/components/navigation/index.ts`
- Bytes: `409`
- Lines: `12`
- SHA256: `307de83c91f1beb32c23b1a9bc575f7f87f1c502958a083e2db504d97ce73760`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Navigation Components - Exports
   3:  */
   5: export { AppHeader } from "./AppHeader";
   6: export { StaffTabBar } from "./StaffTabBar";
   7: export { SupervisorSidebar } from "./SupervisorSidebar";
   8: export { AdminSidebar } from "./AdminSidebar";
   9: export { QuickActions } from "./QuickActions";
```

### 872. `frontend/src/components/premium/PremiumButton.tsx`
- Bytes: `889`
- Lines: `33`
- SHA256: `2a26fbd2f65802922eb9604011b521eead1198f95b203731d05a6e3b3d38402f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PremiumButtonProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * PremiumButton Component
   3:  * Re-exports ModernButton with consistent naming for premium UI components
   4:  */
   6: import React from "react";
   7: import { ViewStyle, TextStyle } from "react-native";
   8: import Ionicons from "@expo/vector-icons/Ionicons";
   9: import { ModernButton, ButtonVariant, ButtonSize } from "../ui/ModernButton";
```

### 873. `frontend/src/components/premium/PremiumCard.tsx`
- Bytes: `888`
- Lines: `33`
- SHA256: `da6c96e949f39847a537fd75beaac3235025bc7b8803a2e66ce92c8f729cfded`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PremiumCardProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * PremiumCard Component
   3:  * Re-exports ModernCard with consistent naming for premium UI components
   4:  */
   6: import React from "react";
   7: import { ViewStyle, StyleProp } from "react-native";
   8: import Ionicons from "@expo/vector-icons/Ionicons";
   9: import { ModernCard, CardVariant, CardElevation } from "../ui/ModernCard";
```

### 874. `frontend/src/components/premium/PremiumInput.tsx`
- Bytes: `10565`
- Lines: `374`
- SHA256: `2f4f21b7c8b8ee99465c6617ca540e3c7469e8dc609aa845854f151cee73ad09`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `InputVariant`
  - `PremiumInputProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * PremiumInput Component
   3:  * Enhanced input field with modern styling, validation, and accessibility
   4:  */
   6: /// <reference types="react" />
   7: import React, { useState, useMemo, useCallback } from "react";
   8: import {
   9:   View,
```

### 875. `frontend/src/components/premium/index.ts`
- Bytes: `500`
- Lines: `22`
- SHA256: `58358f7a16f2eeb86018a0b2557b7de6ef4065af06d59131f152ce6b8760320c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Premium UI Components - Exports
   3:  * High-quality, animated UI components with modern design
   4:  */
   6: export { PremiumButton } from "./PremiumButton";
   7: export type {
   8:   PremiumButtonProps,
   9:   ButtonVariant,
```

### 876. `frontend/src/components/scan/ActiveSectionHeader.tsx`
- Bytes: `3546`
- Lines: `130`
- SHA256: `7b13e72c602a913a119696b90f08bd471e608f2e2f46bbeb81fb39578995d8b1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `handleCloseSection`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { View, Text, StyleSheet, Alert } from "react-native";
   3: import { BlurView } from "expo-blur";
   4: import Ionicons from "@expo/vector-icons/Ionicons";
   5: import { PremiumButton } from "../premium/PremiumButton";
   6: import {
   7:   modernColors,
   8:   modernTypography,
```

### 877. `frontend/src/components/scan/BarcodeScanner.tsx`
- Bytes: `9386`
- Lines: `345`
- SHA256: `40de8542735ba524b8b77ceef2fe3c6672c830bfc5a5dcaabfbeb7c67cbe063a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `BarcodeScannerProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * BarcodeScanner Component
   3:  * Camera-based barcode scanner optimized for 1D barcodes
   4:  * Features: 1D-only mode, scan throttling, haptic feedback, visual overlay
   5:  */
   6: import React, { useRef, useCallback } from "react";
   7: import {
   8:   View,
```

### 878. `frontend/src/components/scan/BatchDetailsModal.tsx`
- Bytes: `11269`
- Lines: `389`
- SHA256: `e27af121b99c77734b9ee50ccc3ce00cf5e12d0acaa75f57f6cfc3e6b2048246`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Batch`
  - `BatchDetailsModalProps`
  - `handleCountedStockChange`
  - `handleBatchSelect`
  - `formatDate`
- Excerpt (first non-empty lines):

```text
   1: import React, { useState, useEffect, useCallback } from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   Modal,
   6:   TouchableOpacity,
   7:   StyleSheet,
   8:   ScrollView,
```

### 879. `frontend/src/components/scan/CameraView.tsx`
- Bytes: `1215`
- Lines: `39`
- SHA256: `167bbe15f02d8f65a6801281a591be577be90aed7ccc9cb738157514a9c4bac7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `CameraViewProps`
- Excerpt (first non-empty lines):

```text
   1: import React, { forwardRef } from "react";
   2: import { StyleSheet, ViewStyle } from "react-native";
   3: import { CameraView as ExpoCameraView, CameraType } from "expo-camera";
   5: interface CameraViewProps {
   6:   style?: ViewStyle;
   7:   facing?: CameraType;
   8:   ratio?: string; // '16:9' | '4:3' etc.
   9:   children?: React.ReactNode;
```

### 880. `frontend/src/components/scan/ItemDisplay.tsx`
- Bytes: `9995`
- Lines: `349`
- SHA256: `70bff28075a70f3da837a7e411d58d685aa9e8409d55dafad49d68917e23f168`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ItemDisplayProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * ItemDisplay Component
   3:  * Displays item information, stock quantity, MRP, and verification status
   4:  */
   5: import React from "react";
   6: import {
   7:   View,
   8:   Text,
```

### 881. `frontend/src/components/scan/ItemSearch.tsx`
- Bytes: `15320`
- Lines: `563`
- SHA256: `4ad914855c85f3ea8b311033a33ca31c8cf4ef66e8681abcd091d8047e913a9d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ItemSearchProps`
  - `handleBatchSelect`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * ItemSearch Component
   3:  * Search autocomplete for finding items by name or barcode
   4:  * Enhanced with pagination and infinite scroll
   5:  */
   6: import React, { useCallback, useRef, useState } from "react";
   7: import {
   8:   View,
```

### 882. `frontend/src/components/scan/LocationInput.tsx`
- Bytes: `3862`
- Lines: `150`
- SHA256: `c4b992253c547a4ebf88fa100ddfdd215f4018fdcaf639f0a106ed4951dd0341`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `LocationInputProps`
  - `handleFloorChange`
  - `handleRackChange`
  - `handleShelfChange`
  - `handleMarkLocationChange`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * LocationInput Component
   3:  * Input fields for warehouse location (Floor, Rack, Mark/Label)
   4:  */
   5: import React from "react";
   6: import { View, Text, TextInput, StyleSheet } from "react-native";
   8: interface LocationInputProps {
   9:   floorNo: string;
```

### 883. `frontend/src/components/scan/LocationVerificationSection.tsx`
- Bytes: `9111`
- Lines: `291`
- SHA256: `303625fb0d591f6cbb3813a80a5224d65b170f51e145f3d2fb79f7146102c9ce`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `typedRack`
  - `rackSuggestions`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { View, Text, TouchableOpacity } from "react-native";
   3: import Ionicons from "@expo/vector-icons/Ionicons";
   4: import { PremiumInput } from "@/components/premium/PremiumInput";
   5: import { modernColors } from "@/styles/modernDesignSystem";
   6: import { DEFAULT_FLOOR_OPTIONS } from "@/config/location";
   8: export type LocationVerificationSectionProps = {
   9:   floorNo?: string | null;
```

### 884. `frontend/src/components/scan/MRPVariantSelector.tsx`
- Bytes: `4969`
- Lines: `185`
- SHA256: `ff7f49427f9bfc6b1f8932ce081a3b41e86643095181f171122cb2dacf39e3a4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `MRPVariantSelectorProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * MRPVariantSelector Component
   3:  * Displays MRP variants and allows selection
   4:  */
   5: import React from "react";
   6: import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
   7: import { NormalizedMrpVariant } from "@/types/scan";
   8: import { MRP_MATCH_TOLERANCE } from "@/constants/scanConstants";
```

### 885. `frontend/src/components/scan/PhotoCapture.tsx`
- Bytes: `10307`
- Lines: `385`
- SHA256: `ccd815f4f06a02514c8756c890d89f69cb4f43d41dd9808f32bc57046113aac8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PhotoCaptureProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * PhotoCapture Component
   3:  * Handles photo proof capture, preview, and management
   4:  */
   5: import React from "react";
   6: import {
   7:   View,
   8:   Text,
```

### 886. `frontend/src/components/scan/QuantityInputForm.tsx`
- Bytes: `17750`
- Lines: `556`
- SHA256: `c4913fc737ad034e5a25d9d788ad21e6f1d81a7c8fd767f059ba4936bc5c8799`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `QuantityInputFormProps`
  - `handleDamageChange`
  - `toggleSwitch`
  - `handleSerialToggle`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * QuantityInputForm Component
   3:  * Form for entering counted quantity, damage quantities, MRP, and remarks
   4:  */
   5: import React, { useState } from "react";
   6: import {
   7:   View,
   8:   Text,
```

### 887. `frontend/src/components/scan/RackProgressCard.tsx`
- Bytes: `2990`
- Lines: `116`
- SHA256: `7a9f0ee8aa75910097efe3e7b98b4ce6fb589befbc30842d8bf6fa8d74890021`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `RackProgressCardProps`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { View, Text, StyleSheet } from "react-native";
   3: import {
   4:   modernColors,
   5:   modernTypography,
   6:   modernSpacing,
   7:   modernBorderRadius,
   8: } from "../../styles/modernDesignSystem";
```

### 888. `frontend/src/components/scan/ResultOverlay.tsx`
- Bytes: `2001`
- Lines: `84`
- SHA256: `3ef80fcd41adcd13a319b8dc7f3d959c8c140d72522ad0fafa756dfc1fbbc147`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ResultOverlayProps`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import {
   3:   View,
   4:   TouchableOpacity,
   5:   ActivityIndicator,
   6:   StyleSheet,
   7: } from "react-native";
   8: import Ionicons from "@expo/vector-icons/Ionicons";
```

### 889. `frontend/src/components/scan/ScanAreaOverlay.tsx`
- Bytes: `9201`
- Lines: `386`
- SHA256: `6f18fd12eaa4088999bb6e2db746518e676b69c784c87f207b68b067f673ddfb`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ScanAreaOverlayProps`
  - `getBorderColor`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * ScanAreaOverlay Component
   3:  * Visual overlay showing the optimal scan area for 1D barcodes
   4:  */
   5: import React, { useEffect, useRef } from "react";
   6: import {
   7:   View,
   8:   Text,
```

### 890. `frontend/src/components/scan/ScanFeedback.tsx`
- Bytes: `9358`
- Lines: `403`
- SHA256: `e0f973f2771bf10d656b7e18f7114dc29228e40073503710aea785238555c702`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ScanFeedbackProps`
  - `ScanToastProps`
  - `ScanIndicatorProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * ScanFeedback Component
   3:  * Visual feedback indicators for barcode scanning results
   4:  */
   5: import React, { useEffect, useRef } from "react";
   6: import {
   7:   View,
   8:   Text,
```

### 891. `frontend/src/components/scan/SectionFocusConfig.tsx`
- Bytes: `12147`
- Lines: `421`
- SHA256: `9b13250e685e3af8e61fe05829452a1b32798c3ac249d0f3570dc21f4f61d05f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `handleOpenModal`
  - `handleStartSection`
- Excerpt (first non-empty lines):

```text
   1: import React, { useState, useEffect } from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   StyleSheet,
   6:   Modal,
   7:   TouchableOpacity,
   8:   ScrollView,
```

### 892. `frontend/src/components/scan/SerialNumberEntry.tsx`
- Bytes: `8700`
- Lines: `315`
- SHA256: `8c756ce1fe8aa4598a6f00a83edbd3fb2ddb9ff1c5abc64ffcffdbedfe696ce0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SerialNumberEntryProps`
  - `handleSerialChange`
  - `handleRemove`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * SerialNumberEntry Component
   3:  * Handles serial number input, validation, and management
   4:  */
   5: import React from "react";
   6: import {
   7:   View,
   8:   Text,
```

### 893. `frontend/src/components/scan/SessionStartModal.tsx`
- Bytes: `3257`
- Lines: `148`
- SHA256: `55209cb65aadf374bc4d403529a55d15f8024ea1182ce71da429f2db300edd3e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SessionStartModalProps`
  - `handleStart`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * SessionStartModal Component
   3:  * Modal for starting a scanning session with location details
   4:  */
   5: import React from "react";
   6: import {
   7:   View,
   8:   Text,
```

### 894. `frontend/src/components/scan/VarianceReasonModal.tsx`
- Bytes: `3480`
- Lines: `151`
- SHA256: `82a938d22a536facf5be8c6947419f0ffcf724507c4832e3c66e706ec1b2a8c2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `VarianceReasonModalProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * VarianceReasonModal Component
   3:  * Modal for selecting variance reason when quantity differs
   4:  */
   5: import React from "react";
   6: import {
   7:   View,
   8:   Text,
```

### 895. `frontend/src/components/scan/__tests__/LocationVerificationSection.test.tsx`
- Bytes: `1347`
- Lines: `47`
- SHA256: `c55e29daeb356f95bec4a226cc0a9c055e54f531a2c63e5e687d4eec5a17534b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { render, fireEvent } from "@testing-library/react-native";
   3: import { LocationVerificationSection } from "@/components/scan/LocationVerificationSection";
   5: // Mock ThemeContext to avoid importing the entire store/api chain
   6: jest.mock("@/context/ThemeContext", () => ({
   7:   useThemeContextSafe: () => null,
   8: }));
  10: describe("LocationVerificationSection", () => {
```

### 896. `frontend/src/components/scan/index.ts`
- Bytes: `799`
- Lines: `20`
- SHA256: `61b2d45624de97efe35cfc284af8f194bd07eff24d31de77e2e333a9c21893b9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Scan Components Index
   3:  * Central export for all scan-related components
   4:  */
   6: export { SessionStartModal } from "./SessionStartModal";
   7: export { VarianceReasonModal } from "./VarianceReasonModal";
   8: export * from "./CameraView";
   9: export * from "./ResultOverlay";
```

### 897. `frontend/src/components/session/BulkActionBar.tsx`
- Bytes: `7873`
- Lines: `315`
- SHA256: `d183f4f6919dbfa80492e86ead3ee3b946c3e0e1dcb7918d79a1fc4d2344612d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `BulkActionBar`
  - `ActionButton`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * BulkActionBar - Toolbar for bulk operations on selected items
   3:  *
   4:  * Provides a contextual action bar with:
   5:  * - Selection count display
   6:  * - Available bulk actions
   7:  * - Animated show/hide based on selection
   8:  * - Confirmation dialogs for destructive actions
```

### 898. `frontend/src/components/settings/ChangePasswordModal.tsx`
- Bytes: `14315`
- Lines: `506`
- SHA256: `b002a57d4cc463d8573349057903f026415f939c9d30967bd1b43b989684cb56`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ChangePasswordModalProps`
  - `ChangePasswordModal`
  - `getStrengthColor`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Change Password Modal Component
   3:  *
   4:  * Modal for changing user password with validation and error handling.
   5:  */
   7: import React, { useState, useCallback } from "react";
   8: import {
   9:   Modal,
```

### 899. `frontend/src/components/settings/ChangePinModal.tsx`
- Bytes: `9731`
- Lines: `362`
- SHA256: `f82df8637bc507d68412a9ada77be3ec9cd59377c15ac6149f06c83075b85399`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ChangePinModalProps`
  - `ChangePinModal`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Change PIN Modal Component
   3:  *
   4:  * Modal for changing user PIN with validation and error handling.
   5:  */
   7: import React, { useState, useCallback } from "react";
   8: import {
   9:   Modal,
```

### 900. `frontend/src/components/settings/ColorPicker.tsx`
- Bytes: `6445`
- Lines: `243`
- SHA256: `6ca9eddc95c6f2ac3ced6a1847fe6668ab5aebe79e53d9c2fd4327f6f7e0fc24`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ColorPickerProps`
  - `handleColorSelect`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * ColorPicker - Theme color selection component
   3:  * Allows users to choose their preferred primary color for the app theme
   4:  */
   6: import React from "react";
   7: import { View, Text, StyleSheet, Platform, Pressable } from "react-native";
   8: import * as Haptics from "expo-haptics";
   9: import Ionicons from "@expo/vector-icons/Ionicons";
```

### 901. `frontend/src/components/settings/FontSizeSlider.tsx`
- Bytes: `4409`
- Lines: `173`
- SHA256: `3acde2f36a6aff53ddc0e997ff6a5eae4b277aaee8330ce08eb3f9b2d7071724`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `FontSizeSliderProps`
  - `handleValueChange`
  - `getSizeLabel`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * FontSizeSlider - Accessible font size adjustment component
   3:  * Allows users to customize their preferred font size for better readability
   4:  */
   6: import React from "react";
   7: import { View, Text, StyleSheet, Platform } from "react-native";
   8: import Slider from "@react-native-community/slider";
   9: import { selectionAsync } from "expo-haptics";
```

### 902. `frontend/src/components/settings/index.ts`
- Bytes: `399`
- Lines: `12`
- SHA256: `ae0c016b797a61410ca7def99ea09aa4ee34723fdf73d577868a387b571f4c18`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Settings Components Index
   3:  *
   4:  * Exports all settings-related components including PIN change,
   5:  * password change, font size slider, and color picker.
   6:  */
   8: export { ChangePinModal } from "./ChangePinModal";
   9: export { ChangePasswordModal } from "./ChangePasswordModal";
```

### 903. `frontend/src/components/staff/RecentScans.tsx`
- Bytes: `6676`
- Lines: `261`
- SHA256: `d86bbf78686f36107eb847b3a6db1ab59c0654f0ce0b538bf569609ea27c9df9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `RecentScansProps`
  - `loadItems`
  - `handlePress`
  - `handleLongPress`
  - `handlePressIn`
  - `handlePressOut`
  - `renderItem`
- Excerpt (first non-empty lines):

```text
   1: import React, { useEffect, useState, useRef } from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   StyleSheet,
   6:   FlatList,
   7:   TouchableOpacity,
   8:   Animated,
```

### 904. `frontend/src/components/suggestions/SmartSuggestionsPanel.tsx`
- Bytes: `16427`
- Lines: `569`
- SHA256: `d3b9f2d602b87cc63755f9c82f7b39011162b1ab4d19155f7b5fb6f66b30721b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SmartSuggestionsPanelProps`
  - `toggleExpanded`
  - `renderQuickActions`
  - `getIconColor`
  - `getConfidenceColor`
- Excerpt (first non-empty lines):

```text
   1: import React, { useState, useEffect, useRef } from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   TouchableOpacity,
   6:   StyleSheet,
   7:   Animated,
   8:   ScrollView,
```

### 905. `frontend/src/components/sync/ConflictResolutionModal.tsx`
- Bytes: `7086`
- Lines: `255`
- SHA256: `ed6cd03a25d4b53768cb6c8229a47cf264c504a44fcd9132fff86352c02d7ef0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ConflictResolutionModalProps`
  - `handleSelect`
  - `handleConfirm`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import {
   3:   Modal,
   4:   View,
   5:   Text,
   6:   StyleSheet,
   7:   ScrollView,
   8:   TouchableOpacity,
```

### 906. `frontend/src/components/ui/Accordion.tsx`
- Bytes: `4175`
- Lines: `191`
- SHA256: `1c1e1a472a83af9fc0098b4cd72952f0a7f57cf0c46c32920b862edb883dd745`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AccordionProps`
  - `toggleItem`
  - `AccordionItemComponentProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Accordion Component
   3:  * Collapsible content sections
   4:  * Phase 2: Design System - Core Components
   5:  */
   7: import React, { useState } from "react";
   8: import {
   9:   View,
```

### 907. `frontend/src/components/ui/ActivityFeedItem.tsx`
- Bytes: `5919`
- Lines: `237`
- SHA256: `c3735e27264d027481135aa42906c5fea7e8b14e8792c140ac4f696c7cd5914c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ActivityFeedItemProps`
  - `formatTimestamp`
  - `content`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * ActivityFeedItem Component - Aurora Design
   3:  *
   4:  * Animated activity feed item with glassmorphism
   5:  * Features:
   6:  * - Smooth entrance animation
   7:  * - Icon with gradient background
   8:  * - Timestamp formatting
```

### 908. `frontend/src/components/ui/AdminResponsiveGrid.tsx`
- Bytes: `1242`
- Lines: `54`
- SHA256: `f565c154f71506d30112ee7e4e8a311e57a798e113b913b688f0cf7c364e70b4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AdminResponsiveGridProps`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { View, useWindowDimensions, StyleSheet, ViewStyle } from "react-native";
   3: import { modernSpacing } from "../../styles/modernDesignSystem";
   5: interface AdminResponsiveGridProps {
   6:   children: React.ReactNode[] | React.ReactNode;
   7:   gap?: number;
   8:   style?: ViewStyle;
   9: }
```

### 909. `frontend/src/components/ui/AnimatedCard.tsx`
- Bytes: `7942`
- Lines: `332`
- SHA256: `51193c3ee76367d0bc32c8ffbc017428bd028c5405fa3697286d0a90f2154d3b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `renderCardContent`
  - `getVariantStyles`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * AnimatedCard Component
   3:  * Feature-rich card with entry animations, press feedback, and theme tokens
   4:  *
   5:  * Combines patterns from Aashu-Dubey repo with unified design system
   6:  */
   8: import React, { useCallback } from "react";
   9: import {
```

### 910. `frontend/src/components/ui/AnimatedCounter.tsx`
- Bytes: `2093`
- Lines: `84`
- SHA256: `54ef7095d0bea88e5fb5a00fa0295d1609d2dff57db7f78e18d7646879b63f95`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AnimatedCounterProps`
  - `updateDisplay`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * AnimatedCounter Component - Aurora Design v2.0
   3:  *
   4:  * Animated number counter with smooth transitions
   5:  * Features:
   6:  * - Smooth counting animation
   7:  * - Customizable duration
   8:  * - Number formatting
```

### 911. `frontend/src/components/ui/AnimatedInput.tsx`
- Bytes: `6213`
- Lines: `256`
- SHA256: `14c54ccde35f4f82e64701f7ed56642fa9e7508b09443e0d7051623f685223c5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AnimatedInputProps`
  - `getVariantStyles`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * AnimatedInput Component
   3:  * Input field with smooth focus animations and haptic feedback
   4:  * Inspired by rnx-ui input patterns
   5:  */
   7: import React, { useState, useRef, useCallback } from "react";
   8: import {
   9:   TextInput,
```

### 912. `frontend/src/components/ui/AnimatedListItem.tsx`
- Bytes: `4998`
- Lines: `217`
- SHA256: `51b3764dc5d281536688357ba00fd7c517edcf50fc870effb1fb46164c55a1f8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * AnimatedListItem - Staggered Animation Wrapper for List Items
   3:  *
   4:  * Features:
   5:  * - Fade + slide-up entrance animation
   6:  * - Staggered delay based on index
   7:  * - Spring-based smooth animations
   8:  * - Configurable animation properties
```

### 913. `frontend/src/components/ui/AnimatedPressable.tsx`
- Bytes: `3444`
- Lines: `143`
- SHA256: `de46585102d7269154923382c97b5d789fd00af1b008df5e7495c2d01fb8c1c8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AnimatedPressableProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * AnimatedPressable Component
   3:  * Modern pressable with spring animations inspired by native-springs
   4:  * Provides tactile feedback with scale and opacity animations
   5:  */
   7: import React, { useCallback } from "react";
   8: import {
   9:   Pressable,
```

### 914. `frontend/src/components/ui/AppearanceSettings.tsx`
- Bytes: `7460`
- Lines: `276`
- SHA256: `3280436177ac1ef81796b3fa60d1cb2caa6ca4bde91ad57f9e8ea4f6d428db87`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AppearanceSettingsProps`
  - `handleFontSizeChange`
  - `handleColorChange`
  - `content`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * AppearanceSettings Component
   3:  *
   4:  * Complete appearance customization section for Settings screen
   5:  * Combines Theme, Pattern, Layout, Font Size, and Color pickers
   6:  */
   8: import React from "react";
   9: import { View, Text, StyleSheet, ScrollView } from "react-native";
```

### 915. `frontend/src/components/ui/AuroraBackground.tsx`
- Bytes: `7452`
- Lines: `293`
- SHA256: `b2c69b06423ebae9c3abdf9ba9b0f094040ae045606adc41a67eb75ff90a1e1e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AuroraBackgroundProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * AuroraBackground Component v2.1
   3:  *
   4:  * Animated aurora gradient background with mesh effect
   5:  * Features:
   6:  * - Multiple gradient blobs with animation
   7:  * - Optional particle field overlay
   8:  * - Customizable colors
```

### 916. `frontend/src/components/ui/Avatar.tsx`
- Bytes: `4029`
- Lines: `178`
- SHA256: `e0baf6c12d91cefdb56d4d6825c76aeb483bb6921632271a66cf59ea43a8d219`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AvatarProps`
  - `getInitials`
  - `getBackgroundColor`
  - `renderContent`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Avatar Component
   3:  * Displays user profile images or initials
   4:  * Phase 2: Design System - Core Components
   5:  */
   7: import React from "react";
   8: import {
   9:   View,
```

### 917. `frontend/src/components/ui/Badge.tsx`
- Bytes: `2834`
- Lines: `123`
- SHA256: `7a08dbba9ef2cb0fd174961d75e37e5f5d244930a0a510544b7b52906b586cce`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `BadgeProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Badge Component
   3:  * Displays status indicators, counts, and labels
   4:  * Phase 2: Design System - Core Components
   5:  */
   7: import React from "react";
   8: import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
   9: import {
```

### 918. `frontend/src/components/ui/BottomSheet.tsx`
- Bytes: `2474`
- Lines: `108`
- SHA256: `45225d74915997f35f2680ff63d9c10dc58bd5a79f82acf1114a1f075e8ace57`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `BottomSheetProps`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { Modal, StyleSheet, Platform, TouchableOpacity } from "react-native";
   3: import Animated, {
   4:   useSharedValue,
   5:   useAnimatedStyle,
   6:   withTiming,
   7:   interpolate,
   8:   runOnJS,
```

### 919. `frontend/src/components/ui/Checkbox.tsx`
- Bytes: `3285`
- Lines: `141`
- SHA256: `9524d706e6e570bd8a7a750a04e9facab1f9fca3df7d9401e98f3b7499929f5f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `CheckboxProps`
  - `handlePress`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Checkbox Component
   3:  * Multiple selection checkboxes
   4:  * Phase 2: Design System - Core Components
   5:  */
   7: import React from "react";
   8: import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
   9: import Ionicons from "@expo/vector-icons/Ionicons";
```

### 920. `frontend/src/components/ui/Chip.tsx`
- Bytes: `3769`
- Lines: `169`
- SHA256: `3f84ff0a35be9843bf51e8cecc671e023b67ad44348f03640e7d29ce547ea7c8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ChipProps`
  - `getColors`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Chip Component
   3:  * Interactive tags with optional remove functionality
   4:  * Phase 2: Design System - Core Components
   5:  */
   7: import React from "react";
   8: import {
   9:   View,
```

### 921. `frontend/src/components/ui/ConfirmModal.tsx`
- Bytes: `8276`
- Lines: `330`
- SHA256: `453ddc2006c18813c25e52ca117263ac9ddc9f027e18fcd361bbe3a23fcd49ca`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ConfirmModal`
  - `handleConfirm`
  - `handleCancel`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * ConfirmModal Component
   3:  *
   4:  * A specialized modal for confirmation dialogs with confirm/cancel actions.
   5:  * Supports danger mode for destructive actions, loading states, and custom messaging.
   6:  *
   7:  * @module components/ui/ConfirmModal
   8:  *
```

### 922. `frontend/src/components/ui/EmptyState.tsx`
- Bytes: `1912`
- Lines: `90`
- SHA256: `a7aa2888c77120b76306f123e837c67e704171fee846e07bb095e8e250b6b309`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `EmptyStateProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * EmptyState Component - Empty state placeholder
   3:  * Safe, non-breaking addition for empty states
   4:  */
   6: import React from "react";
   7: import { View, Text, StyleSheet } from "react-native";
   8: import Ionicons from "@expo/vector-icons/Ionicons";
   9: import { useTheme } from "@/hooks/useTheme";
```

### 923. `frontend/src/components/ui/EnhancedBottomSheet.tsx`
- Bytes: `7879`
- Lines: `303`
- SHA256: `4a0263f306172080c80482ac112deb0d497e4264a0d57ddd45aa7145d8cf4b5d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SnapPoint`
  - `EnhancedBottomSheetProps`
  - `findNearestSnapPoint`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * EnhancedBottomSheet Component - Aurora Design v2.0
   3:  *
   4:  * Improved bottom sheet with gestures and snap points
   5:  * Features:
   6:  * - Gesture-driven interactions
   7:  * - Multiple snap points
   8:  * - Spring physics
```

### 924. `frontend/src/components/ui/EnhancedButton.tsx`
- Bytes: `7356`
- Lines: `305`
- SHA256: `c38a030c88d9edeaf1ee97970116ab9de05ae17a83d6b1bf8ae76f90d4e8ccc5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `renderIcon`
  - `renderContent`
  - `textElement`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * EnhancedButton - Material Design Inspired Button Component
   3:  *
   4:  * Features:
   5:  * - Types: solid, outline, text
   6:  * - Icon positions: left, right, top, bottom
   7:  * - Raised/shadow effect
   8:  * - Loading states
```

### 925. `frontend/src/components/ui/EnhancedInput.tsx`
- Bytes: `11214`
- Lines: `443`
- SHA256: `b12489452964386d5946660ccbe3802d5e3f7a99b08bad80563aad3defac7c07`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `getBorderColor`
  - `getIconColor`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * EnhancedInput - Material Design Inspired Input Component
   3:  *
   4:  * Features:
   5:  * - Floating label positions (container, border, box)
   6:  * - Error/success states with messages
   7:  * - Left and right icons
   8:  * - Password visibility toggle
```

### 926. `frontend/src/components/ui/FadeIn.tsx`
- Bytes: `3055`
- Lines: `139`
- SHA256: `0254d6e25247ddec92b4c0430ee03bef7e6fd8ff2483e77e6f3e087723c2c2a4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `FadeInProps`
  - `getTransform`
  - `StaggeredFadeInProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * FadeIn Animation Component
   3:  * Inspired by native-springs WaveFade pattern
   4:  * Provides smooth entrance animations for components
   5:  */
   7: import React, { useEffect, useRef } from "react";
   8: import { Animated, ViewStyle, StyleProp } from "react-native";
  10: interface FadeInProps {
```

### 927. `frontend/src/components/ui/FloatingActionButton.tsx`
- Bytes: `6152`
- Lines: `247`
- SHA256: `a50a74b2654710d4102a24731790839d3f2dfc1764c7d7f5b955a63a17c46c33`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `FABSize`
  - `FloatingActionButtonProps`
  - `handlePressIn`
  - `handlePressOut`
  - `getPositionStyle`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * FloatingActionButton Component - Premium FAB
   3:  * Features:
   4:  * - Gradient background
   5:  * - Pulse animation
   6:  * - Shadow and glow effects
   7:  * - Press animation
   8:  * - Optional mini variant
```

### 928. `frontend/src/components/ui/FloatingScanButton.tsx`
- Bytes: `5196`
- Lines: `213`
- SHA256: `cb49a53404b9367d306672d9824e0531e45cbcb8a908bdf2bbd06b2f608d4eb6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `FloatingScanButtonProps`
  - `handlePressIn`
  - `handlePressOut`
  - `handlePress`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * FloatingScanButton Component
   3:  *
   4:  * Large floating action button for scanning
   5:  * Features:
   6:  * - Pulse animation
   7:  * - Gradient background
   8:  * - Haptic feedback
```

### 929. `frontend/src/components/ui/GlassCard.tsx`
- Bytes: `5470`
- Lines: `205`
- SHA256: `124503184ffa7b31c773366ff31e9a62551d1d26012ef007b7cdf70890212c76`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `GlassCardProps`
  - `GlassCard`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * GlassCard Component - Enhanced v2.0
   3:  *
   4:  * Glassmorphism card with backdrop blur effect
   5:  * Features:
   6:  * - Translucent background with blur
   7:  * - Gradient border option
   8:  * - Shadow and elevation
```

### 930. `frontend/src/components/ui/InlineAlert.tsx`
- Bytes: `1884`
- Lines: `77`
- SHA256: `474d3fd5ddee4c4d7f833ebcdeb720a4b6e25749df7a00444da272eea2f44d4a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Props`
  - `InlineAlert`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { View, Text, StyleSheet } from "react-native";
   3: import Ionicons from "@expo/vector-icons/Ionicons";
   4: import { auroraTheme } from "@/theme/auroraTheme";
   6: export type InlineAlertType = "error" | "warning" | "success" | "info";
   8: interface Props {
   9:   type?: InlineAlertType;
  10:   message: string;
```

### 931. `frontend/src/components/ui/LayoutPicker.tsx`
- Bytes: `3857`
- Lines: `175`
- SHA256: `4e2ce53d3208c0f019dce533d76094edee4614e190c64af4fb4d16142411452c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `LayoutPickerProps`
  - `LayoutItemProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * LayoutPicker Component
   3:  *
   4:  * Select different layout arrangements for the app
   5:  */
   7: import React, { useCallback } from "react";
   8: import {
   9:   View,
```

### 932. `frontend/src/components/ui/LiveIndicator.tsx`
- Bytes: `3502`
- Lines: `154`
- SHA256: `2133e4da6f00f6aee5b3307f0dceebae83af8fc32ac5d5dcd16daf9c4a6e070a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `LiveIndicatorProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * LiveIndicator Component - Aurora Design
   3:  *
   4:  * Pulsing dot indicator for live/active status
   5:  * Features:
   6:  * - Smooth pulse animation
   7:  * - Customizable colors
   8:  * - Optional label
```

### 933. `frontend/src/components/ui/LoadingSpinner.tsx`
- Bytes: `1050`
- Lines: `50`
- SHA256: `4dfac4e359c69e7acc4c63177ddc6a0ddabbe0d7cfc754791630eb3532d9f7b1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `LoadingSpinnerProps`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { View, StyleSheet, ViewStyle, ActivityIndicator } from "react-native";
   3: import { colorPalette } from "@/theme/designTokens";
   5: export type SpinnerType =
   6:   | "CircleFlip"
   7:   | "Bounce"
   8:   | "Wave"
   9:   | "WanderingCubes"
```

### 934. `frontend/src/components/ui/Modal.stories.tsx`
- Bytes: `5240`
- Lines: `227`
- SHA256: `ab992fbeb0b58158794033fa02d41b221364994a1b7fe900fb9ddd84e80a71de`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Story`
  - `ModalWrapper`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Modal Component Stories
   3:  *
   4:  * Documentation and examples for the Modal component
   5:  */
   7: import type { Meta, StoryObj } from "@storybook/react";
   8: import { Modal } from "./Modal";
   9: import { View, Text, StyleSheet } from "react-native";
```

### 935. `frontend/src/components/ui/Modal.tsx`
- Bytes: `7103`
- Lines: `276`
- SHA256: `8d42d866467afdc18914eeed29a2a86e6ca98f331ad1f0a34021ede54a9d8772`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Modal Component - Modern modal dialog
   3:  * Safe, non-breaking addition to component library
   4:  */
   6: import React, { useEffect } from "react";
   7: import {
   8:   Modal as RNModal,
   9:   View,
```

### 936. `frontend/src/components/ui/ModernButton.tsx`
- Bytes: `10190`
- Lines: `395`
- SHA256: `9cddd61bdcdd90951eabdf201309aa084ff556384942aeff1c95758484009caf`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ModernButtonProps`
  - `handlePressIn`
  - `handlePressOut`
  - `getButtonStyles`
  - `getTextStyles`
  - `getIconColor`
  - `getSizeConfig`
  - `renderIcon`
  - `renderContent`
  - `renderButton`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Modern Button Component - Enhanced UI/UX
   3:  * Features:
   4:  * - Multiple variants (primary, secondary, outline, ghost, danger)
   5:  * - Size options (small, medium, large)
   6:  * - Smooth animations and micro-interactions
   7:  * - Loading states with spinners
   8:  * - Icon support (left/right)
```

### 937. `frontend/src/components/ui/ModernCard.tsx`
- Bytes: `10307`
- Lines: `402`
- SHA256: `830224bed523a4ab19b45aae36e49e29ef44115d9f0a8d5cb6d4b2ef240075b5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ModernCardProps`
  - `handlePressIn`
  - `handlePressOut`
  - `renderContent`
  - `renderCard`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Modern Card Component - Enhanced UI/UX
   3:  * Features:
   4:  * - Glassmorphism support
   5:  * - Smooth hover/press animations
   6:  * - Multiple elevation levels
   7:  * - Gradient backgrounds
   8:  * - Interactive states
```

### 938. `frontend/src/components/ui/ModernHeader.tsx`
- Bytes: `6648`
- Lines: `266`
- SHA256: `956c9b790e4a2bfafbcefef6cc5751560eed7e38f236bde51b2d26a930f83e43`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ModernHeaderProps`
  - `LogoWithBorder`
  - `onPressSettings`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Modern Header Component for Lavanya Mart Stock Verify
   3:  * Clean header with branding and navigation
   4:  */
   6: import React from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 939. `frontend/src/components/ui/ModernInput.tsx`
- Bytes: `6079`
- Lines: `231`
- SHA256: `d0d48af10ec4779e02ee6e4f18bc6091706469b8783ba2c3a0c5ad5a118d5e69`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ModernInputProps`
  - `togglePasswordVisibility`
  - `getInputContainerStyles`
  - `getInputStyles`
  - `getLabelStyles`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Modern Input Component for Lavanya Mart Stock Verify
   3:  * Accessible form input with modern design principles
   4:  */
   6: import React, { useState, useRef } from "react";
   7: import {
   8:   View,
   9:   Pressable,
```

### 940. `frontend/src/components/ui/MultiSelectList.tsx`
- Bytes: `12239`
- Lines: `468`
- SHA256: `cb21905d96bad32ce3a842dfafb73e7e613a856f0a2f91b9119c622a99b15273`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `renderEmpty`
  - `SelectableItemWrapperProps`
  - `SelectableItemWrapper`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * MultiSelectList - Selectable list component for bulk operations
   3:  *
   4:  * Provides a list with:
   5:  * - Individual item selection
   6:  * - Select all / deselect all
   7:  * - Selection count display
   8:  * - Animated selection states
```

### 941. `frontend/src/components/ui/MyPressable.tsx`
- Bytes: `4397`
- Lines: `185`
- SHA256: `024bde62b37085364bc9dd063c637c1aa835945646df337664ea28167d426f2c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * MyPressable - Enhanced Pressable with Platform-Specific Feedback
   3:  *
   4:  * Provides:
   5:  * - Ripple effect on Android
   6:  * - Opacity/scale feedback on iOS
   7:  * - Consistent touch feedback across platforms
   8:  *
```

### 942. `frontend/src/components/ui/OnlineStatus.tsx`
- Bytes: `1286`
- Lines: `57`
- SHA256: `bbb4295d433481f09647a1aad7e12d4c2da84b0a11c01a9c1386e83af3ece341`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import React, { useEffect, useState } from "react";
   2: import { View, Text, StyleSheet } from "react-native";
   3: import NetInfo from "@react-native-community/netinfo";
   4: import Ionicons from "@expo/vector-icons/Ionicons";
   6: export default function OnlineStatus() {
   7:   const [isConnected, setIsConnected] = useState<boolean | null>(true);
   9:   useEffect(() => {
  10:     const unsubscribe = NetInfo.addEventListener((state) => {
```

### 943. `frontend/src/components/ui/ParticleField.tsx`
- Bytes: `4707`
- Lines: `191`
- SHA256: `015f84f50046e2cda10b0d414a0831b432dcd82ca7b2018da1791542414991eb`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Particle`
  - `ParticleFieldProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * ParticleField Component - Aurora Design v2.0
   3:  *
   4:  * Floating particle animation background effect
   5:  * Features:
   6:  * - Floating particles with random motion
   7:  * - Glow effects
   8:  * - Performance optimized
```

### 944. `frontend/src/components/ui/PatternBackground.tsx`
- Bytes: `13190`
- Lines: `513`
- SHA256: `9e05cd9689d1466b2fa8862e5edbe2ef55bfcebabafe46dec3704f316d76c425`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PatternBackgroundProps`
  - `hexPath`
  - `angle`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * PatternBackground Component
   3:  *
   4:  * Renders various pattern overlays for visual variety:
   5:  * - Dots, Grid, Waves, Aurora, Mesh, Circuit, Hexagon
   6:  *
   7:  * Works with ThemeContext for dynamic pattern selection
   8:  */
```

### 945. `frontend/src/components/ui/PatternPicker.tsx`
- Bytes: `3876`
- Lines: `175`
- SHA256: `08a491db62dc5ddd8715856dd54db57d0839969ecec6381c9c5269989552746e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PatternPickerProps`
  - `PatternItemProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * PatternPicker Component
   3:  *
   4:  * Visual pattern selection for background arrangements
   5:  */
   7: import React, { useCallback } from "react";
   8: import {
   9:   View,
```

### 946. `frontend/src/components/ui/PremiumHeader.tsx`
- Bytes: `8307`
- Lines: `329`
- SHA256: `8762b6c978e907d73759f8db6c1bc0ba76ae0e0ea23d15c83b795868d72fe15d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PremiumHeaderProps`
  - `renderUserInfo`
  - `renderLogo`
  - `renderRightAction`
  - `createStyles`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * PremiumHeader Component - Premium app header with glassmorphism
   3:  * Features:
   4:  * - Animated logo
   5:  * - User info display
   6:  * - Glassmorphism effect
   7:  * - Logout/menu button
   8:  * - Status indicators
```

### 947. `frontend/src/components/ui/ProgressBar.tsx`
- Bytes: `3161`
- Lines: `136`
- SHA256: `2d51fcf91043fc51b052d2cea291683e8c7e1cf41e435c304add0d7e98328029`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ProgressBarProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * ProgressBar Component
   3:  * Displays loading progress with animations
   4:  * Phase 2: Design System - Core Components
   5:  */
   7: import React, { useEffect } from "react";
   8: import { View, Text, StyleSheet, ViewStyle } from "react-native";
   9: import Animated, {
```

### 948. `frontend/src/components/ui/ProgressRing.tsx`
- Bytes: `4047`
- Lines: `167`
- SHA256: `b76e1edb53652b26eb2323eeebb7582218d9189788bdc004db1f4556f50f4ad8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ProgressRingProps`
  - `radius`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * ProgressRing Component - Aurora Design
   3:  *
   4:  * Circular progress indicator with gradient
   5:  * Features:
   6:  * - Smooth animation
   7:  * - Gradient stroke
   8:  * - Center label
```

### 949. `frontend/src/components/ui/QuantityStepper.tsx`
- Bytes: `2982`
- Lines: `126`
- SHA256: `dd14e691841122d3d966ed3757d7d786a21a3843ddc2e406d13f660a03d9433d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Props`
  - `QuantityStepper`
  - `clamp`
  - `handleChange`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
   3: import * as Haptics from "expo-haptics";
   4: import Ionicons from "@expo/vector-icons/Ionicons";
   5: import { useThemeContext } from "../../context/ThemeContext";
   7: interface Props {
   8:   value: number;
   9:   onChange: (next: number) => void;
```

### 950. `frontend/src/components/ui/QuickStatCard.tsx`
- Bytes: `7419`
- Lines: `313`
- SHA256: `8b3bd9a7bd1ff79d07da71cae205c64edca9f6e2451d013e9573e22655c2da51`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `TrendDirection`
  - `CardVariant`
  - `QuickStatCardProps`
  - `handlePressIn`
  - `handlePressOut`
  - `renderContent`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * QuickStatCard Component - Modern statistics display
   3:  * Features:
   4:  * - Animated counter
   5:  * - Gradient background option
   6:  * - Icon with glow
   7:  * - Trend indicator
   8:  * - Multiple size variants
```

### 951. `frontend/src/components/ui/Radio.tsx`
- Bytes: `3634`
- Lines: `172`
- SHA256: `fdf4c31d73a8a01a485eac4c390489d684c18cee041f01578169d4e694cfcdf6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `RadioProps`
  - `RadioItemProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Radio Component
   3:  * Single selection radio buttons
   4:  * Phase 2: Design System - Core Components
   5:  */
   7: import React from "react";
   8: import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
   9: import Animated, {
```

### 952. `frontend/src/components/ui/ResponsiveText.tsx`
- Bytes: `3198`
- Lines: `125`
- SHA256: `e6cd6269c7337677ba058b637618eb78cf4923876fa4d5efbaee9c4cc8fb4988`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `getFontSize`
  - `getLineHeight`
  - `getColor`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * ResponsiveText Component - Modern Text Rendering
   3:  *
   4:  * Automatically scales text based on screen size and platform
   5:  * Ensures consistent typography across all devices
   6:  *
   7:  * Usage:
   8:  * <ResponsiveText variant="heading">Title</ResponsiveText>
```

### 953. `frontend/src/components/ui/RippleButton.tsx`
- Bytes: `8966`
- Lines: `356`
- SHA256: `86ac69d8078b1f7ac6858f033a6885d57569a7820ffd05063f5871f9c3eeb3b4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ButtonVariant`
  - `ButtonSize`
  - `RippleButtonProps`
  - `handleLayout`
  - `triggerRipple`
  - `maxScale`
  - `handlePress`
  - `content`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * RippleButton Component - Aurora Design v2.0
   3:  *
   4:  * Material-style ripple button with gradient support
   5:  * Features:
   6:  * - Ripple effect on press
   7:  * - Gradient backgrounds
   8:  * - Multiple variants
```

### 954. `frontend/src/components/ui/SafeView.tsx`
- Bytes: `1223`
- Lines: `59`
- SHA256: `021c0669ff2e447561b97039e41ff03f359d31eb291859570222a022c2f6e249`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SafeViewProps`
  - `defaultFallback`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * SafeView Component - Safe wrapper with error boundary
   3:  * Prevents crashes by catching errors in children
   4:  */
   6: import React, { ReactNode } from "react";
   7: import { View, StyleSheet, ViewStyle } from "react-native";
   8: import { ErrorBoundary } from "../ErrorBoundary";
   9: import { useTheme } from "../../hooks/useTheme";
```

### 955. `frontend/src/components/ui/ScanFeedback.tsx`
- Bytes: `7549`
- Lines: `298`
- SHA256: `299141b3bae0687b819ab3ccf7faf6460c05edc7ee3202d7d66341481148e2b8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ScanFeedbackProps`
  - `withRepeat`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * ScanFeedback Component - Aurora Design v2.0
   3:  *
   4:  * Visual and haptic feedback for barcode scanning
   5:  * Features:
   6:  * - Success/Error animations
   7:  * - Lottie-like animated feedback
   8:  * - Haptic patterns
```

### 956. `frontend/src/components/ui/ScreenContainer.tsx`
- Bytes: `7115`
- Lines: `268`
- SHA256: `3c9da81de493766bbb51ef76621d1aaeafd4661e6aa35bdaea0c0cf8e6441637`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `renderContent`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import {
   3:   View,
   4:   Text,
   5:   StyleSheet,
   6:   StatusBar,
   7:   ViewStyle,
   8:   StyleProp,
```

### 957. `frontend/src/components/ui/ScreenHeader.tsx`
- Bytes: `13097`
- Lines: `492`
- SHA256: `271c48aca894d9b300fed38060dffd215213eb7a3ee033bc2591c91614173253`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AnimatedButtonProps`
  - `renderUserInfo`
  - `renderTitle`
  - `renderContent`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * ScreenHeader Component - Reusable screen header with theme support
   3:  *
   4:  * Features:
   5:  * - Username display from authStore
   6:  * - Logout button with confirmation
   7:  * - Theme-aware styling using useThemeContext
   8:  * - Optional back button
```

### 958. `frontend/src/components/ui/Separator.tsx`
- Bytes: `3906`
- Lines: `175`
- SHA256: `8a73bdd371abd47dbc9fddc8b28e3e45430c840e6c1ac517b8bab0ed91a244c9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Separator - Clean Divider Component
   3:  *
   4:  * Features:
   5:  * - Horizontal and vertical orientations
   6:  * - Customizable thickness, color, spacing
   7:  * - Optional text label in center
   8:  *
```

### 959. `frontend/src/components/ui/SessionCard.tsx`
- Bytes: `9376`
- Lines: `363`
- SHA256: `e882a42db2774854f51c282ab433f946f2c9b8d46c0dd7ef7b40037b2701edec`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SessionStatus`
  - `SessionCardProps`
  - `handlePressIn`
  - `handlePressOut`
  - `renderProgressBar`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * SessionCard Component - Premium session display card
   3:  * Features:
   4:  * - Modern glass morphism design
   5:  * - Progress indicator
   6:  * - Status badge
   7:  * - Animated interactions
   8:  * - Rich session info display
```

### 960. `frontend/src/components/ui/Shimmer.tsx`
- Bytes: `5623`
- Lines: `243`
- SHA256: `d8e5e7f5dd835bcf74a56ac76d67e437cc71da53da50c25152ff41104911a1d7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ShimmerProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Shimmer Component - Aurora Design v2.0
   3:  *
   4:  * Elegant shimmer loading effect
   5:  * Features:
   6:  * - Smooth gradient animation
   7:  * - Customizable colors and speed
   8:  * - Multiple variants
```

### 961. `frontend/src/components/ui/Skeleton.tsx`
- Bytes: `5869`
- Lines: `235`
- SHA256: `4a110b1a35500fa352442c934f29f616ac34efcb4f82d117b7ec91ac0ca5c684`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SkeletonProps`
  - `getVariantStyle`
  - `SkeletonTextProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Skeleton Component - Loading placeholder
   3:  * Enhanced with shimmer gradient animation inspired by react-native-auto-skeleton
   4:  * Safe, non-breaking addition for loading states
   5:  */
   7: import React, { useEffect, useRef } from "react";
   8: import { View, StyleSheet, Animated, ViewStyle } from "react-native";
   9: import { LinearGradient } from "expo-linear-gradient";
```

### 962. `frontend/src/components/ui/SkeletonList.tsx`
- Bytes: `4399`
- Lines: `195`
- SHA256: `98f0525b1907049640f95cb338813f1090febc5f810afa3795d8df1105081cd2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SkeletonListProps`
  - `renderItem`
  - `content`
  - `SkeletonGridProps`
  - `SkeletonScreenProps`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * SkeletonList Component
   3:  * Auto-generate skeleton rows for lists
   4:  * Inspired by react-native-auto-skeleton patterns
   5:  */
   7: import React from "react";
   8: import { View, StyleSheet, ViewStyle } from "react-native";
   9: import { Skeleton, SkeletonListItem, SkeletonCard } from "./Skeleton";
```

### 963. `frontend/src/components/ui/SpeedDialMenu.tsx`
- Bytes: `8884`
- Lines: `347`
- SHA256: `e951bf74cda620dbf0eb2ea094ce4880a9111ec405e2f4d8ba6dafe0fa6b88c2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SpeedDialActionItemProps`
  - `toggleMenu`
  - `handleActionPress`
  - `getPositionStyles`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * SpeedDialMenu Component - Aurora Design
   3:  *
   4:  * Floating action button with expandable menu
   5:  * Features:
   6:  * - Smooth expand/collapse animation
   7:  * - Backdrop blur overlay
   8:  * - Haptic feedback
```

### 964. `frontend/src/components/ui/StatsCard.tsx`
- Bytes: `6620`
- Lines: `259`
- SHA256: `d16ef45f291a5fa54de7de6879cf8e43b2ef7610061d8e191ee3fcc32dd38b22`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `StatsCardProps`
  - `content`
  - `cardContent`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * StatsCard Component - Aurora Design v2.1
   3:  *
   4:  * Glassmorphic stats card with gradient accents
   5:  * Features:
   6:  * - Glass morphism effect
   7:  * - Gradient border option
   8:  * - Icon with gradient background
```

### 965. `frontend/src/components/ui/StatusBadge.tsx`
- Bytes: `4436`
- Lines: `187`
- SHA256: `32abfec5e90be1775dc3b8d3109fad66a8c74d05a2aedb5cd7f6540a39ee948b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `BadgeVariant`
  - `BadgeSize`
  - `StatusBadgeProps`
  - `content`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * StatusBadge Component - Modern status indicator
   3:  * Features:
   4:  * - Semantic color variants (success, warning, error, info, neutral)
   5:  * - Pill design with glow effects
   6:  * - Optional icon
   7:  * - Pulse animation for active states
   8:  * - Size variants
```

### 966. `frontend/src/components/ui/StickyFooter.tsx`
- Bytes: `1344`
- Lines: `58`
- SHA256: `f890f6dd267a6b436b9f972c77069b24df0a4b0268ffef0fee4743a7398b12f6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Props`
  - `StickyFooter`
- Excerpt (first non-empty lines):

```text
   1: import React from "react";
   2: import { View, StyleSheet } from "react-native";
   3: import { PremiumButton } from "@/components/premium/PremiumButton"; // Assuming this is already modern or will be
   4: import { useThemeContext } from "../../context/ThemeContext";
   6: interface Props {
   7:   title: string;
   8:   disabled?: boolean;
   9:   loading?: boolean;
```

### 967. `frontend/src/components/ui/SuccessFeedback.tsx`
- Bytes: `7065`
- Lines: `288`
- SHA256: `fd5094ec4cd6e59d82dde5aec3cedde55bef3b6894550e0ecd4247820cb73ad9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SuccessFeedbackProps`
  - `getVariantConfig`
  - `ToastFeedbackProps`
  - `getVariantColors`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * SuccessFeedback Component
   3:  * Provides visual and haptic feedback for successful actions
   4:  * Used for scan success, form submissions, etc.
   5:  */
   7: import React, { useEffect, useRef } from "react";
   8: import { Text, StyleSheet, Animated } from "react-native";
   9: import * as Haptics from "expo-haptics";
```

### 968. `frontend/src/components/ui/SwipeCard.tsx`
- Bytes: `7073`
- Lines: `260`
- SHA256: `7a114f8213ef5ce8e654647129d842f3a626ea2a94aa44715c330edcbc4ab014`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SwipeAction`
  - `SwipeCardProps`
  - `triggerHaptic`
  - `handleActionPress`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * SwipeCard Component - Aurora Design v2.0
   3:  *
   4:  * Swipeable card with actions
   5:  * Features:
   6:  * - Swipe gestures for quick actions
   7:  * - Haptic feedback
   8:  * - Smooth spring animations
```

### 969. `frontend/src/components/ui/Switch.tsx`
- Bytes: `2881`
- Lines: `131`
- SHA256: `2d5107c946815cc30379400a1b78e6c1db6d50d6c8e0b91c39e243957de180d2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SwitchProps`
  - `handlePress`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Switch Component
   3:  * Toggle control with smooth animations
   4:  * Phase 2: Design System - Core Components
   5:  */
   7: import React from "react";
   8: import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
   9: import Animated, {
```

### 970. `frontend/src/components/ui/SyncStatusPill.tsx`
- Bytes: `3577`
- Lines: `139`
- SHA256: `1a6386c2edc10bc39aaba5022dbe24f77aff951a04c8f077faff1eedd88d1102`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SyncStatus`
  - `SyncStatusPill`
  - `handleSync`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * SyncStatusPill Component
   3:  * Modern, unified status indicator for synchronization state
   4:  */
   6: import React, { useEffect, useState, useCallback } from "react";
   7: import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
   8: import Animated, {
   9:   useAnimatedStyle,
```

### 971. `frontend/src/components/ui/Tabs.tsx`
- Bytes: `5082`
- Lines: `214`
- SHA256: `3f509fc52752ac1c87f868f7c2a5a3b820e90f50944406f05b2681058353e980`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `TabsProps`
  - `handleTabLayout`
  - `renderTab`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Tabs Component
   3:  * Navigation tabs with smooth animations
   4:  * Phase 2: Design System - Core Components
   5:  */
   7: import React, { useState } from "react";
   8: import {
   9:   View,
```

### 972. `frontend/src/components/ui/ThemePicker.tsx`
- Bytes: `8206`
- Lines: `338`
- SHA256: `d4f210e9a16e014a8d538e4b0b645435abc37644f28ef59bbd50c38c367b798a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ThemePickerProps`
  - `ThemeCardProps`
  - `handlePressIn`
  - `handlePressOut`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * ThemePicker Component
   3:  *
   4:  * Visual theme selection grid with live preview
   5:  * Shows all available themes with color swatches
   6:  *
   7:  * // cSpell:ignore springify
   8:  */
```

### 973. `frontend/src/components/ui/ThemedScreen.tsx`
- Bytes: `7079`
- Lines: `278`
- SHA256: `bf6e99a78ca8fa29b2611b3221e1e4b3a14158e18811c0ab301a15f3f8212bb2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ThemedScreenProps`
  - `getLayoutSpacing`
  - `content`
  - `ThemedCardProps`
  - `getPadding`
  - `getCardStyle`
  - `ThemedTextProps`
  - `getColor`
  - `getSize`
  - `getWeight`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * ThemedScreen Component
   3:  *
   4:  * A wrapper component that provides consistent theming, pattern backgrounds,
   5:  * and layout arrangements across screens
   6:  */
   8: import React from "react";
   9: import {
```

### 974. `frontend/src/components/ui/Toast.tsx`
- Bytes: `5312`
- Lines: `216`
- SHA256: `bdbe9a3cb3c3af04a6e80c6970806b5f63dd73f054d4380040d90c1677919efb`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `appColors`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Toast Component
   3:  * Displays temporary notification messages
   4:  * Phase 2: Design System - Core Components
   5:  */
   7: import * as React from "react";
   8: import { useCallback, useEffect, useMemo } from "react";
   9: import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
```

### 975. `frontend/src/components/ui/TouchableFeedback.tsx`
- Bytes: `5131`
- Lines: `205`
- SHA256: `c4ac460ca4f000396a41e585d65e3ae7042aa11ace9aec3a81c614203f32ed9d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * TouchableFeedback Component
   3:  * Platform-aware touch feedback based on Aashu-Dubey/React-Native-UI-Templates
   4:  *
   5:  * Features:
   6:  * - Android: Material ripple effect
   7:  * - iOS: Opacity fade on press
   8:  * - Accessibility: Proper hit slop and feedback
```

### 976. `frontend/src/components/ui/UnifiedText.tsx`
- Bytes: `3679`
- Lines: `174`
- SHA256: `9f7542045a8cc52f4b4f8b0bd3767caa5df34f0f5bb47e0958121d5dfa5d8e7d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * UnifiedText Component
   3:  * Text component that uses unified typography tokens
   4:  *
   5:  * Features:
   6:  * - Consistent typography from unified system
   7:  * - Supports all text style variants
   8:  * - Accessibility props
```

### 977. `frontend/src/components/ui/UnifiedView.tsx`
- Bytes: `3824`
- Lines: `163`
- SHA256: `a3928956517682bd26f815d5eff15e14838c7febf064c749e9b88ea7d6ec924c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * UnifiedView Component
   3:  * View component that uses unified theme tokens
   4:  *
   5:  * Features:
   6:  * - Background color from theme
   7:  * - Padding/margin from spacing tokens
   8:  * - Border radius from radius tokens
```

### 978. `frontend/src/components/ui/index.ts`
- Bytes: `5615`
- Lines: `149`
- SHA256: `2eae7b83d9309fe5e86d783908afefe11dc326c1de1c066c5baf03c589f6dbc1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * UI Components Index
   3:  * Export all UI components from a single location
   4:  */
   6: export { Modal } from "./Modal";
   7: export { SafeView } from "./SafeView";
   8: export * from "./Skeleton";
   9: export * from "./GlassCard";
```

### 979. `frontend/src/config/environment.ts`
- Bytes: `9453`
- Lines: `353`
- SHA256: `f1ec6b745f6b870c68ad62987b4f830242abeddd72b2e031cc11e6c390c134d6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `BackendConfig`
  - `EnvironmentDetection`
  - `EnvironmentConfig`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Environment Configuration Manager
   3:  * Handles dynamic backend URL configuration for different environments
   4:  */
   6: import { Platform } from "react-native";
   7: import Constants from "expo-constants";
   8: import AsyncStorage from "@react-native-async-storage/async-storage";
   9: import { createLogger } from "../services/logging";
```

### 980. `frontend/src/config/index.ts`
- Bytes: `199`
- Lines: `12`
- SHA256: `65c2fedf8ec1088cf6d5acbc0dd017278a35224f1baa985f29d3e15337bbcc5e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Configuration exports
   3:  * Central export for all app configuration
   4:  */
   6: export {
   7:   SUPPORTED_1D_BARCODES,
   8:   SCANNER_CONFIG,
   9:   BarcodeValidator,
```

### 981. `frontend/src/config/location.ts`
- Bytes: `137`
- Lines: `9`
- SHA256: `13f26a7719cfe7a73cd4654a9e1d6fd078769d1db20231f7f8ecce79d5d0f3b6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: export const DEFAULT_FLOOR_OPTIONS: string[] = [
   2:   "Ground",
   3:   "First",
   4:   "Second",
   5:   "Top Godown",
   6:   "Main Godown",
   7:   "Damage Area",
   8: ];
```

### 982. `frontend/src/config/queryClient.ts`
- Bytes: `940`
- Lines: `31`
- SHA256: `69c744b8037d422f8991af3bcc67d5911ee46eb73c61dca514f0297c52140c98`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import { QueryClient } from "@tanstack/react-query";
   3: /**
   4:  * Global Query Client Configuration
   5:  * Optimized for offline-first usage and performance.
   6:  */
   7: export const queryClient = new QueryClient({
   8:   defaultOptions: {
   9:     queries: {
```

### 983. `frontend/src/config/scannerConfig.ts`
- Bytes: `5286`
- Lines: `210`
- SHA256: `622fcfd7755246a4a83aa734d1807e74d94d0b4bc304041eb901e70503325eb7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ScanThrottleManager`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Scanner Configuration for 1D Barcode Optimization
   3:  * Optimized for common retail/warehouse 1D barcodes
   4:  */
   6: import { BarcodeScanningResult } from "expo-camera";
   8: /**
   9:  * Supported 1D barcode types for stock verification
  10:  * Focus on the most common formats used in retail/warehouse
```

### 984. `frontend/src/constants/config.ts`
- Bytes: `450`
- Lines: `15`
- SHA256: `5dbafcbd925479f8e1e70d1cb25d8011754d5406ca8e967e36a1f79f55f8d114`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: export const API_TIMEOUT_MS =
   2:   Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || 10000;
   3: export const API_MAX_RETRIES = 3;
   4: export const API_RETRY_BACKOFF_MS = 750;
   6: export const QUERY_STALE_TIME_MS = 1000 * 60 * 5;
   7: export const QUERY_CACHE_TIME_MS = 1000 * 60 * 30;
   9: export const SESSION_PAGE_SIZE = 20;
  10: export const SEARCH_DEBOUNCE_MS = 500;
```

### 985. `frontend/src/constants/flags.ts`
- Bytes: `238`
- Lines: `11`
- SHA256: `9ecf2a5793cb5e5aa88166c845d85adf2c4aaf86d5b6c0d45e493485707317c1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: export const flags = {
   2:   enableDeepLinks: true,
   3:   enableHaptics: true,
   4:   enableAnimations: true,
   5:   enableSwipeActions: true,
   6:   enableDebugMode: __DEV__,
   7:   enableNetworkLogging: __DEV__,
   8:   enableOfflineQueue: true,
```

### 986. `frontend/src/constants/fontAssets.native.ts`
- Bytes: `455`
- Lines: `8`
- SHA256: `957539b80df3b7d5193cde88ffd42d92af5eda457e250d7d7f438dbcb30731b3`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: export const fontAssets = {
   2:   Inter_400Regular: require("../../node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf"),
   3:   Inter_500Medium: require("../../node_modules/@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf"),
   4:   Inter_600SemiBold: require("../../node_modules/@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf"),
   5:   Inter_700Bold: require("../../node_modules/@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf"),
   6: };
```

### 987. `frontend/src/constants/fontAssets.ts`
- Bytes: `55`
- Lines: `3`
- SHA256: `4ad87ffbf3e47bdaae4455c2a4946c323eef543336259d3c35bf2be946148ab1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: export const fontAssets: Record<string, number> = {};
```

### 988. `frontend/src/constants/fontAssets.web.ts`
- Bytes: `31`
- Lines: `3`
- SHA256: `6f646abab4b4d80020977cdf834776fc386e50700d73c6156e4dd19823f0abb2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: export const fontAssets = {};
```

### 989. `frontend/src/constants/index.ts`
- Bytes: `84`
- Lines: `4`
- SHA256: `033c977c00c9be738cca231341fd05812f8f6a86f0ee9ff84ea521e6604430ed`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: export * from "./scanConstants";
   2: export * from "./config";
   3: export * from "./flags";
```

### 990. `frontend/src/constants/permissions.ts`
- Bytes: `1135`
- Lines: `51`
- SHA256: `db9f5d6b0d17196a99f4f36acfa78e53e48a82dbe895ed99f9678ef520efb497`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Permission constants for Role-Based Access Control (RBAC)
   3:  */
   4: export enum Permission {
   5:   // Inventory
   6:   INVENTORY_VIEW = "inventory.view",
   7:   INVENTORY_EDIT = "inventory.edit",
   8:   INVENTORY_DELETE = "inventory.delete",
```

### 991. `frontend/src/constants/scanConstants.ts`
- Bytes: `1271`
- Lines: `39`
- SHA256: `d24cba2801860068c07c060bdf053d21ee26b09ddb163cea63e866c14ce72066`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Constants for scan screen
   3:  * Extracted from scan.tsx for better organization
   4:  */
   6: import Ionicons from "@expo/vector-icons/Ionicons";
   7: import { PhotoProofType } from "../types/scan";
   8: import { formatMrpValue } from "../utils/scanUtils";
  10: export const MRP_MATCH_TOLERANCE = 0.01;
```

### 992. `frontend/src/context/ThemeContext.tsx`
- Bytes: `17424`
- Lines: `593`
- SHA256: `cb663ff96594a0696887f11b4bfa5d05b01a960484d0f3bf42c15b709bdb7a2c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `hexToRgba`
  - `ThemeContextType`
  - `resolved`
  - `fallback`
  - `loadSettings`
  - `useThemeContext`
  - `useThemeContextSafe`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Theme Context - Global Theme Management
   3:  *
   4:  * Provides:
   5:  * - Full theme switching (6 variants)
   6:  * - System theme auto-detection
   7:  * - Persistent storage via MMKV
   8:  * - Pattern selection
```

### 993. `frontend/src/context/ThemeProvider.tsx`
- Bytes: `5662`
- Lines: `243`
- SHA256: `ef1973f7a3b26a2b6786fac85152ef38aa692ff15e25197861cee74e75b06340`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `useThemeContext`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * ThemeProvider Context
   3:  * Provides theme context for the entire app with dark mode support
   4:  *
   5:  * Features:
   6:  * - Automatic dark mode detection via useColorScheme
   7:  * - Manual theme override
   8:  * - Theme toggle
```

### 994. `frontend/src/db/localDb.ts`
- Bytes: `7208`
- Lines: `279`
- SHA256: `eb45d7f824dbf8c909cd249c974e25b55267399137f0bd3063daa418349d525c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ensureSchema`
  - `IF`
  - `IF`
  - `IF`
  - `initDb`
  - `getDb`
  - `saveLocalItems`
  - `getLocalItems`
  - `addPendingVerification`
  - `getPendingVerifications`
  - `updatePendingVerificationStatus`
  - `deletePendingVerification`
  - `clearPendingVerifications`
  - `mapLocalItemToAppItem`
- Excerpt (first non-empty lines):

```text
   1: import * as SQLite from "expo-sqlite";
   2: import type { CreateCountLinePayload, Item } from "@/types/scan";
   4: const DB_NAME = "stock_verify.db";
   6: export interface LocalItem {
   7:   barcode: string;
   8:   name: string;
   9:   category: string;
  10:   verified: number; // 0 or 1
```

### 995. `frontend/src/domains/README.md`
- Bytes: `1384`
- Lines: `48`
- SHA256: `d19e015b6eba0220fd22b911ed579a1771bc69a4189bf336918cdf79cba89b12`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Domain Boundaries
   3: This directory contains the domain logic for the application, organized by bounded contexts.
   5: ## Domains
   7: ### 1. Inventory (`/inventory`)
   9: **Responsibility**: Managing items, stock counts, and barcode scanning.
  11: - **Entities**: `Item`, `StockCount`, `BarcodeScan`.
  12: - **Key Operations**:
  13:   - Fetching item details by barcode.
```

### 996. `frontend/src/domains/auth/index.ts`
- Bytes: `414`
- Lines: `23`
- SHA256: `b15e5f931fe04e195ceac3e07482f22f94f626c554cc69c2e241f468e34a47e7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Auth Domain - Index
   3:  *
   4:  * Central export point for all auth domain functionality.
   5:  */
   7: // Types (canonical source)
   8: export {
   9:   User,
```

### 997. `frontend/src/domains/auth/services.ts`
- Bytes: `325`
- Lines: `11`
- SHA256: `d69dfb67945242043764261d601a2e81eb52a649dd8af90220d01d33afc5412c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Auth Domain - Services
   3:  *
   4:  * Re-exports auth-related services from the main API layer.
   5:  * Types are defined in ./types.ts to avoid conflicts.
   6:  */
   8: export { authApi } from "../../services/api/authApi";
   9: export { authService } from "../../services/auth";
```

### 998. `frontend/src/domains/auth/types.ts`
- Bytes: `1069`
- Lines: `54`
- SHA256: `cd3d2bc668dc8786c8b9c31e27b68a027fd37c5ed55016b7912c1d3fedf7e069`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import { z } from "zod";
   2: import { UserSchema, LoginResponseSchema } from "../../types/schemas";
   4: // Re-export Zod schemas
   5: export { UserSchema, LoginResponseSchema } from "../../types/schemas";
   7: // Inferred types
   8: export type User = z.infer<typeof UserSchema>;
   9: export type LoginResponse = z.infer<typeof LoginResponseSchema>;
  11: export interface UserSettings {
```

### 999. `frontend/src/domains/inventory/components/ItemFilters.tsx`
- Bytes: `17282`
- Lines: `601`
- SHA256: `edb981234e0a53dd59057f37b5b8e9136ba425dde64489890e995c4219e52726`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ItemFiltersProps`
  - `loadLocations`
  - `loadRackProgress`
  - `updateFilter`
  - `clearFilters`
  - `openModal`
  - `handleSelection`
  - `renderSelectionModal`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Item Filters Component
   3:  * Reusable filter UI for filtering items by category, subcategory, floor, rack, UOM, etc.
   4:  */
   5: import React, { useState, useEffect } from "react";
   6: import {
   7:   View,
   8:   Text,
```

### 1000. `frontend/src/domains/inventory/hooks.ts`
- Bytes: `1089`
- Lines: `41`
- SHA256: `0a3ff0c45b152df7c6f3b98c33bdc56af037a19b27676be2cac9becab9eb0470`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `useItemLookup`
  - `useSubmitCount`
  - `useCountLines`
- Excerpt (first non-empty lines):

```text
   1: import { useDomainAction } from "../../hooks/useDomainAction";
   2: import { getItemByBarcode, createCountLine, getCountLines } from "./services";
   4: /**
   5:  * Hook for looking up items by barcode.
   6:  * Usage:
   7:  * const { execute: lookupItem, isLoading, error, data: item } = useItemLookup();
   8:  * await lookupItem('123456');
   9:  */
```

### 1001. `frontend/src/domains/inventory/hooks/scan/index.ts`
- Bytes: `272`
- Lines: `10`
- SHA256: `7f2419a71ea06ec5504a0c913ba21cb78d928ac0c8dd92507f40728c6e35e47a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Scan Hooks Index
   3:  * Central export for all scan-related hooks
   4:  */
   6: export { useScanState } from "./useScanState";
   7: export { usePhotoState } from "./usePhotoState";
   8: export { useItemState } from "./useItemState";
   9: export { useWorkflowState } from "./useWorkflowState";
```

### 1002. `frontend/src/domains/inventory/hooks/scan/useBatchManagement.ts`
- Bytes: `2180`
- Lines: `75`
- SHA256: `34a5fec5c658d7ad5ccaa09f79c079cce0b93504080ee060b17cefe517984085`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `useBatchManagement`
  - `handleAddBatch`
  - `handleRemoveBatch`
  - `resetBatches`
- Excerpt (first non-empty lines):

```text
   1: import { useState } from "react";
   2: import { Alert } from "react-native";
   3: import { CountLineBatch } from "@/types/scan";
   5: export const useBatchManagement = () => {
   6:   const [isBatchMode, setIsBatchMode] = useState(false);
   7:   const [batches, setBatches] = useState<CountLineBatch[]>([]);
   9:   // Current batch input state
  10:   const [currentBatchQty, setCurrentBatchQty] = useState("");
```

### 1003. `frontend/src/domains/inventory/hooks/scan/useItemDetailLogic.ts`
- Bytes: `4345`
- Lines: `155`
- SHA256: `ec4fa78317c7f6430238e1aec5faf34fd23a99de31aaa8238df0a688b667bf1b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `useItemDetailLogic`
  - `loadItem`
- Excerpt (first non-empty lines):

```text
   1: import { useState, useEffect, useCallback, useRef } from "react";
   2: import { Alert } from "react-native";
   3: import { useLocalSearchParams, useRouter } from "expo-router";
   4: import { useScanSessionStore } from "@/store/scanSessionStore";
   5: import { getItemByBarcode, refreshItemStock } from "@/services/api";
   6: import { CountLineBatch, Item } from "@/types/scan";
   7: import { useItemForm } from "./useItemForm";
   8: import { useItemSubmission } from "./useItemSubmission";
```

### 1004. `frontend/src/domains/inventory/hooks/scan/useItemForm.ts`
- Bytes: `4736`
- Lines: `183`
- SHA256: `1db6354d060c0ac95f8a64bfc6ea4995fd3bfdf33ad107bdbe92fe29db9e752c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `useItemForm`
  - `handleSerialChange`
  - `updateSerialNumbersSize`
  - `validateForm`
  - `resetForm`
- Excerpt (first non-empty lines):

```text
   1: import { useState, useRef } from "react";
   2: import { Alert, TextInput } from "react-native";
   3: import { useBatchManagement } from "./useBatchManagement";
   4: import { Item } from "@/types/scan";
   6: export const useItemForm = () => {
   7:   // Core fields
   8:   const [quantity, setQuantity] = useState("");
   9:   const [mrp, setMrp] = useState("");
```

### 1005. `frontend/src/domains/inventory/hooks/scan/useItemState.ts`
- Bytes: `2291`
- Lines: `92`
- SHA256: `ff1312fd56ba18adfffc959d41e6fcf49f1cb527159f9a3ae9a0c11df46592c5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ItemState`
  - `useItemState`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * useItemState Hook
   3:  * Manages item-related state (current item, MRP variants, etc.)
   4:  */
   5: import { useState, useCallback } from "react";
   6: import { Item, NormalizedMrpVariant, VarianceReason } from "@/types/scan";
   7: import { getNormalizedMrpVariants } from "@/utils/scanUtils";
   9: interface ItemState {
```

### 1006. `frontend/src/domains/inventory/hooks/scan/useItemSubmission.ts`
- Bytes: `5439`
- Lines: `165`
- SHA256: `4bb4b498d5b449ba559dcdbb2efb80dafc24855c1043c8818b3c75c25f401e88`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `UseItemSubmissionProps`
  - `useItemSubmission`
  - `handleSubmit`
- Excerpt (first non-empty lines):

```text
   1: import { useState } from "react";
   2: import { Alert } from "react-native";
   3: import * as Haptics from "expo-haptics";
   4: import { useRouter } from "expo-router";
   5: import {
   6:   checkItemCounted,
   7:   createCountLine,
   8:   addQuantityToCountLine,
```

### 1007. `frontend/src/domains/inventory/hooks/scan/usePhotoState.ts`
- Bytes: `1374`
- Lines: `57`
- SHA256: `dd5cb1c8454f7c289062e54b36f64a083f604e30ad106daa5ce5bfd61646fd48`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PhotoState`
  - `usePhotoState`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * usePhotoState Hook
   3:  * Manages photo proof capture state
   4:  */
   5: import { useState, useCallback } from "react";
   6: import { PhotoProofType, PhotoProofDraft } from "@/types/scan";
   8: interface PhotoState {
   9:   photoProofs: PhotoProofDraft[];
```

### 1008. `frontend/src/domains/inventory/hooks/scan/useScanState.ts`
- Bytes: `1158`
- Lines: `49`
- SHA256: `4de224d9bee34b977e7132fe96214f9701691fe7c24e524742786c4dbf26ae52`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ScannerState`
  - `useScanState`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * useScanState Hook
   3:  * Manages scanner state (barcode scanning, manual entry, etc.)
   4:  */
   5: import { useState, useCallback } from "react";
   6: import { ScannerMode } from "@/types/scan";
   8: interface ScannerState {
   9:   showScanner: boolean;
```

### 1009. `frontend/src/domains/inventory/hooks/scan/useWorkflowState.ts`
- Bytes: `1835`
- Lines: `73`
- SHA256: `e6feb815f76764576ceb03ee886003f969c3045c6c6aa41801a69bac22b431a5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `useWorkflowState`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * useWorkflowState Hook
   3:  * Manages workflow state (steps, serial inputs, etc.)
   4:  */
   5: import { useState, useCallback } from "react";
   6: import { WorkflowState, SerialInput } from "@/types/scan";
   8: const initialState: WorkflowState = {
   9:   step: "scan",
```

### 1010. `frontend/src/domains/inventory/hooks/useItemByBarcodeQuery.ts`
- Bytes: `912`
- Lines: `34`
- SHA256: `cc49fe3a425204dd362664b44806ad1c581771c2619b2ca4ac74bf698aadb48a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `UseItemByBarcodeQueryOptions`
  - `useItemByBarcodeQuery`
- Excerpt (first non-empty lines):

```text
   1: import { useQuery } from "@tanstack/react-query";
   2: import { getItemByBarcode } from "@/services/api";
   4: interface UseItemByBarcodeQueryOptions {
   5:   barcode: string | null;
   6:   enabled?: boolean;
   7:   retryCount?: number;
   8: }
  10: /**
```

### 1011. `frontend/src/domains/inventory/hooks/useOptimizedSearch.ts`
- Bytes: `6099`
- Lines: `263`
- SHA256: `37414401852bd1b702ee7bc6ba4208a3a48613f7c4bbaf0024fb0c08ff3c128f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `fetchOptimizedSearch`
  - `offset`
  - `useOptimizedSearch`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * useOptimizedSearch - Debounced search hook with relevance scoring
   3:  *
   4:  * Features:
   5:  * - 300ms debounce for typing
   6:  * - Relevance-scored results
   7:  * - Pagination support
   8:  * - Loading and error states
```

### 1012. `frontend/src/domains/inventory/hooks/useSearchItemsQuery.ts`
- Bytes: `804`
- Lines: `30`
- SHA256: `48c4759368bf11ca70333ab5c40f7c9c12ff55d93f68a7466be0908e850ac015`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `UseSearchItemsQueryOptions`
  - `useSearchItemsQuery`
- Excerpt (first non-empty lines):

```text
   1: import { useQuery } from "@tanstack/react-query";
   2: import { searchItems } from "@/services/api";
   4: interface UseSearchItemsQueryOptions {
   5:   query: string;
   6:   enabled?: boolean;
   7:   minChars?: number;
   8: }
  10: /**
```

### 1013. `frontend/src/domains/inventory/index.ts`
- Bytes: `214`
- Lines: `15`
- SHA256: `edadf67acbd96148902491cd964cec9f7eb2975a236d4045a92d3cf2e5f19592`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Inventory Domain - Index
   3:  *
   4:  * Central export point for all inventory domain functionality.
   5:  */
   7: // Types
   8: export * from "./types";
  10: // Services
```

### 1014. `frontend/src/domains/inventory/services.ts`
- Bytes: `15082`
- Lines: `446`
- SHA256: `6fef8a3af152014430be54fd10f0e2622096b2382290ca846656bbb6174d6e26`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AxiosErrorLike`
  - `isOnline`
  - `getItemByBarcode`
  - `createCountLine`
  - `getCountLines`
- Excerpt (first non-empty lines):

```text
   1: import { useNetworkStore } from "../../store/networkStore";
   2: import { useAuthStore } from "../../store/authStore";
   3: import api from "../../services/httpClient";
   4: import { retryWithBackoff } from "../../utils/retry";
   5: import { validateBarcode } from "../../utils/validation";
   6: import { CreateCountLinePayload, Item } from "./types";
   7: import {
   8:   addToOfflineQueue,
```

### 1015. `frontend/src/domains/inventory/services/itemVerificationApi.ts`
- Bytes: `13594`
- Lines: `485`
- SHA256: `18e11edfc658ef1549fa12f1236509a14efb3fa1620ef5525862cb9c167c66cf`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ApiError`
  - `ItemVerificationAPI`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Item Verification API Service
   3:  * Handles verification, filtering, CSV export, and variance tracking
   4:  */
   5: import api from "@/services/httpClient";
   7: export interface VerificationRequest {
   8:   verified: boolean;
   9:   verified_qty?: number;
```

### 1016. `frontend/src/domains/inventory/services/recentRacksService.ts`
- Bytes: `1889`
- Lines: `75`
- SHA256: `718ad32762efb81a7b09c3eab15fffb8797adabfdf64dcaa1bb7be7b89e49fca`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `keyFor`
  - `f`
  - `normalize`
- Excerpt (first non-empty lines):

```text
   1: import AsyncStorage from "@react-native-async-storage/async-storage";
   3: const keyFor = (sessionId: string, floor: string | null | undefined) => {
   4:   const f = (floor || "").trim() || "__unknown__";
   5:   return `recent_racks:${sessionId}:${f}`;
   6: };
   8: const normalize = (v: string) => (v || "").trim();
  10: export const RecentRacksService = {
  11:   async getRecent(
```

### 1017. `frontend/src/domains/inventory/services/scanDeduplicationService.ts`
- Bytes: `1339`
- Lines: `55`
- SHA256: `e3aea3caeac7a86a904305618a6a6cef7fd6ace67bc96b9211bf53187b5e1a2d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ScanHistory`
  - `ScanDeduplicationService`
- Excerpt (first non-empty lines):

```text
   1: const DUPLICATE_THRESHOLD_MS = 3000; // 3 seconds
   3: interface ScanHistory {
   4:   barcode: string;
   5:   timestamp: number;
   6: }
   8: export class ScanDeduplicationService {
   9:   private lastScan: ScanHistory | null = null;
  11:   /**
```

### 1018. `frontend/src/domains/inventory/services/smartSuggestionsService.ts`
- Bytes: `16011`
- Lines: `527`
- SHA256: `3a9cbada49765bbe38d6cfc0295df1e4f161eab02abba22b1f081d447685df08`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `UserPattern`
  - `SmartSuggestionsService`
- Excerpt (first non-empty lines):

```text
   1: import {
   2:   AnalyticsService,
   3:   RecentItemsService,
   4:   RecentItem,
   5: } from "@/services/enhancedFeatures";
   6: import { Item } from "@/types/scan";
   8: export interface SuggestionItem {
   9:   id: string;
```

### 1019. `frontend/src/domains/inventory/types.ts`
- Bytes: `1760`
- Lines: `73`
- SHA256: `b3ce2065d011f1744c08f2007e54b7cb5d107185f2eb1feb623fb0274848ad34`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import { z } from "zod";
   2: import { ItemSchema } from "../../types/schemas";
   4: export type Item = z.infer<typeof ItemSchema> & {
   5:   // Add fields missing from ItemSchema but present in legacy Item type
   6:   id: string;
   7:   name: string;
   8:   uom?: string;
   9:   item_group?: string;
```

### 1020. `frontend/src/domains/reports/index.ts`
- Bytes: `528`
- Lines: `32`
- SHA256: `17b019b96cd2854a0ff0016e619c9d654e4f21cb259830094282c9c593d2c14b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Reports Domain - Index
   3:  *
   4:  * Central export point for all reports domain functionality.
   5:  */
   7: // Types (canonical source)
   8: export {
   9:   ReportType,
```

### 1021. `frontend/src/domains/reports/services.ts`
- Bytes: `430`
- Lines: `20`
- SHA256: `28fd7830733241b61683f4c72a58e50840c8f5c3821f887b585369708eca1a5a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Reports Domain - Services
   3:  *
   4:  * Re-exports report-related services from the main API layer.
   5:  * Types are defined in ./types.ts to avoid conflicts.
   6:  */
   8: export { reportApi } from "../../services/api/reportApi";
  10: // Activity and error logs (from main api.ts)
```

### 1022. `frontend/src/domains/reports/types.ts`
- Bytes: `2011`
- Lines: `98`
- SHA256: `20126d0883d662e312cb23da961e2750a34ad543348154591e020a26cacbdeb4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Reports Domain - Types
   3:  */
   5: export type ReportType =
   6:   | "stock_summary"
   7:   | "variance_report"
   8:   | "user_activity"
   9:   | "session_history"
```

### 1023. `frontend/src/hooks/index.ts`
- Bytes: `744`
- Lines: `26`
- SHA256: `2ea7f4a087bc70346e3eed904ebadd33edad57687b8656a290305bdaf1cf19a0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: export * from "./useTheme";
   2: export * from "./useAutoLogout";
   3: export * from "./usePermission";
   4: export * from "./useSafeState";
   5: export * from "./useSystemTheme";
   6: export * from "./useFormValidation";
   7: export * from "./useDebouncedCallback";
   8: export * from "./useAIBarcode";
```

### 1024. `frontend/src/hooks/scan/index.ts`
- Bytes: `303`
- Lines: `11`
- SHA256: `9de061373d912750ee4e00cddbf9c637267a94df5e9a8443fe987e0a2649406c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Scan Hooks - Re-export from domains/inventory
   3:  *
   4:  * This file maintains backward compatibility for imports.
   5:  * The canonical source is now in domains/inventory/hooks/scan/
   6:  *
   7:  * @deprecated Import from '@/domains/inventory/hooks/scan' instead
   8:  */
```

### 1025. `frontend/src/hooks/useAIBarcode.ts`
- Bytes: `2521`
- Lines: `105`
- SHA256: `7e5ccd96d6868ab0ecd6db907654354d01db4f6a1d80f65844f13f97dde7e979`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `UseAIBarcodeReturn`
  - `useAIBarcode`
  - `init`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * React Hook for AI-Powered Barcode Recognition
   3:  * Provides easy integration of AI barcode scanning in components
   4:  */
   6: import { useState, useEffect, useCallback } from "react";
   7: import {
   8:   aiBarcodeService,
   9:   BarcodeRecognitionOptions,
```

### 1026. `frontend/src/hooks/useAnimations.ts`
- Bytes: `8528`
- Lines: `326`
- SHA256: `7922728c8ec123cba41524cc1c7d9d947c1eb68358eb8024b0aa2da0d037a988`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `useEntryAnimation`
  - `useStaggeredEntry`
  - `useFadeIn`
  - `useScalePress`
  - `usePulse`
  - `useSlide`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Animation Hooks
   3:  * Reusable animation patterns inspired by Aashu-Dubey/React-Native-UI-Templates
   4:  *
   5:  * Features:
   6:  * - Entry animations with stagger support
   7:  * - Press scale feedback
   8:  * - Fade in/out
```

### 1027. `frontend/src/hooks/useAppVersion.ts`
- Bytes: `898`
- Lines: `35`
- SHA256: `c423be45cfd58f797e3d0712d41143c796f643534fff5dbbd0d5f4099048b442`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `useAppVersion`
  - `getAppInfo`
- Excerpt (first non-empty lines):

```text
   1: import { useEffect, useState } from "react";
   2: import Constants from "expo-constants";
   4: export const useAppVersion = () => {
   5:   const [appInfo, setAppInfo] = useState({
   6:     version: "Unknown",
   7:     buildVersion: "Unknown",
   8:     platform: "Unknown",
   9:     appName: "Stock Count",
```

### 1028. `frontend/src/hooks/useAutoConnection.ts`
- Bytes: `6309`
- Lines: `207`
- SHA256: `2a43897aac367c164a55f89a3d1ae6b421895530d5787ad14cdde6824a8658c8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `UseAutoConnectionOptions`
  - `UseAutoConnectionReturn`
  - `useAutoConnection`
  - `handleConnectionChange`
  - `attemptReconnect`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Auto Connection Hook
   3:  * Handles automatic backend connection setup and reconnection
   4:  */
   6: import { useEffect, useRef, useCallback, useState } from "react";
   7: import { Platform } from "react-native";
   8: import { createLogger } from "../services/logging";
   9: import ConnectionManager, { ConnectionInfo } from "../services/connectionManager";
```

### 1029. `frontend/src/hooks/useAutoLogout.ts`
- Bytes: `2785`
- Lines: `98`
- SHA256: `222047c6070af2e3d7e278ee363edc6f3832fae796f5c02c1bf6bc62c7c22a21`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `useAutoLogout`
- Excerpt (first non-empty lines):

```text
   1: import { useEffect, useRef, useCallback } from "react";
   2: import { AppState, Alert } from "react-native";
   3: import { useAuthStore } from "../store/authStore";
   4: import { useRouter } from "expo-router";
   6: const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
   7: const WARNING_TIMEOUT = 28 * 60 * 1000; // 28 minutes (2 min warning)
   9: export const useAutoLogout = (enabled: boolean = true) => {
  10:   const { logout, user } = useAuthStore();
```

### 1030. `frontend/src/hooks/useCameraEnhancement.ts`
- Bytes: `3276`
- Lines: `115`
- SHA256: `e1d0d25c1805599f8d75c3761d35e2278abe11a0e89c7761438dc1667dc7ee37`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `UseCameraEnhancementReturn`
  - `useCameraEnhancement`
  - `init`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * React Hook for Camera Enhancement
   3:  * Provides easy integration of enhanced camera features
   4:  * Phase 0: Enhanced Mobile Camera Features
   5:  */
   7: import { useState, useEffect, useCallback } from "react";
   8: import {
   9:   cameraEnhancementService,
```

### 1031. `frontend/src/hooks/useDebouncedCallback.ts`
- Bytes: `808`
- Lines: `20`
- SHA256: `e590a6dccf44653a723c8a95315a0941babe6574359724bca8109fd189d1f641`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import { useDebouncedCallback } from "use-debounce";
   2: import { SEARCH_DEBOUNCE_MS } from "../constants/config";
   4: /**
   5:  * Stable debounced callback hook that maintains a consistent reference across renders
   6:  *
   7:  * Note: useDebouncedCallback from 'use-debounce' already maintains a stable reference.
   8:  * This wrapper provides a consistent API and default delay configuration.
   9:  *
```

### 1032. `frontend/src/hooks/useDomainAction.ts`
- Bytes: `2577`
- Lines: `89`
- SHA256: `06559d1b4192b0d9c6b26fce96751df105832729bb092e2ad6232a967088c20d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `UseDomainActionOptions`
  - `UseDomainActionResult`
- Excerpt (first non-empty lines):

```text
   1: import { useState, useCallback } from "react";
   2: import { ApiResponse } from "../types/api";
   4: /**
   5:  * Options for useDomainAction hook.
   6:  * Supports two action types:
   7:  * 1. Raw action: (params: T) => Promise<R> - Returns data directly
   8:  * 2. API action: (params: T) => Promise<ApiResponse<R>> - Returns wrapped response
   9:  */
```

### 1033. `frontend/src/hooks/useFormValidation.ts`
- Bytes: `5198`
- Lines: `200`
- SHA256: `c7e587e9d043a6a3f949eff8f5fa84ce0e4146c00bdfba044a86f10f32b39889`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ValidationRule`
  - `FieldRules`
  - `getRuleMessage`
- Excerpt (first non-empty lines):

```text
   1: import { useCallback, useMemo, useState } from "react";
   3: type ValidationRule =
   4:   | string
   5:   | {
   6:       message: string;
   7:     };
   9: interface FieldRules {
  10:   required?: ValidationRule;
```

### 1034. `frontend/src/hooks/useHapticFeedback.ts`
- Bytes: `1163`
- Lines: `41`
- SHA256: `39a837f4e7dd260b5716a224a82953c7c9da0dd4090305cfeb6297a48dae71a4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `useHapticFeedback`
- Excerpt (first non-empty lines):

```text
   1: import { useCallback } from "react";
   2: import * as Haptics from "expo-haptics";
   4: export const useHapticFeedback = () => {
   5:   const triggerHaptic = useCallback(
   6:     (
   7:       type:
   8:         | "impactLight"
   9:         | "impactMedium"
```

### 1035. `frontend/src/hooks/useKeepAwake.ts`
- Bytes: `772`
- Lines: `27`
- SHA256: `9a6375d5ed81db6effc4ea9fd237613243448c2cc507f84c2847252b909ddc24`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `useKeepAwake`
- Excerpt (first non-empty lines):

```text
   1: import { useEffect } from "react";
   2: import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
   4: export const useKeepAwake = (enabled: boolean = true) => {
   5:   useEffect(() => {
   6:     if (enabled) {
   7:       try {
   8:         activateKeepAwake();
   9:         __DEV__ && console.log("Keep awake activated");
```

### 1036. `frontend/src/hooks/useKeyboardShortcuts.ts`
- Bytes: `1483`
- Lines: `55`
- SHA256: `995791235b6ba06f3e47937e80baff3cce15c6c75d926ba1108e16b4a5b6f896`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `useKeyboardShortcuts`
  - `handler`
- Excerpt (first non-empty lines):

```text
   1: import { useEffect } from "react";
   2: import { Platform } from "react-native";
   4: export interface KeyboardShortcut {
   5:   key: string;
   6:   shift?: boolean;
   7:   ctrl?: boolean;
   8:   alt?: boolean;
   9:   meta?: boolean;
```

### 1037. `frontend/src/hooks/usePerformanceMonitor.ts`
- Bytes: `3064`
- Lines: `117`
- SHA256: `3891e7c6945999204d71e9eb75cc4301c496f138c543ba8dba905351dcb909d6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PerformanceMetrics`
  - `PerformanceMonitorOptions`
  - `PerformanceMonitorReturn`
  - `usePerformanceMonitor`
  - `memory`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * usePerformanceMonitor Hook
   3:  * Monitors app performance metrics and provides performance monitoring capabilities
   4:  */
   6: import { useState, useEffect, useRef, useCallback } from "react";
   8: interface PerformanceMetrics {
   9:   fps?: number;
  10:   memoryUsage?: number;
```

### 1038. `frontend/src/hooks/usePermission.ts`
- Bytes: `2258`
- Lines: `72`
- SHA256: `19738e31156fff01e350bdd48692790718d3233c0515512f28897d8574737806`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `usePermission`
  - `hasPermission`
  - `hasAnyPermission`
  - `hasAllPermissions`
  - `hasRole`
  - `hasAnyRole`
- Excerpt (first non-empty lines):

```text
   1: import { useAuthStore } from "../store/authStore";
   2: import { Permission, Role } from "../constants/permissions";
   4: /**
   5:  * Custom hook for permission-based access control
   6:  * Provides methods to check if current user has specific permissions
   7:  */
   8: export const usePermission = () => {
   9:   const user = useAuthStore((state) => state.user);
```

### 1039. `frontend/src/hooks/usePermissions.ts`
- Bytes: `5136`
- Lines: `196`
- SHA256: `0c78bef4bf2b66918e7cbc259368f950ee0e359ed4ad39833ef452b570e3546b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `usePermissions`
  - `hasPermission`
  - `hasAnyPermission`
  - `hasAllPermissions`
  - `hasRole`
  - `isAdmin`
  - `isSupervisor`
  - `isStaff`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Permission Hook - Check user permissions in React Native components
   3:  *
   4:  * Usage:
   5:  *   const { hasPermission, hasRole, user } = usePermissions();
   6:  *
   7:  *   if (hasPermission('count:approve')) {
   8:  *     // Show approve button
```

### 1040. `frontend/src/hooks/usePersistentState.ts`
- Bytes: `2961`
- Lines: `108`
- SHA256: `faf96fa75a88a4e966253577d930f3703c9d9714b129a30a35adaf67f4ba6a9d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `loadValue`
  - `clearPersistentState`
  - `clearAllPersistentState`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * usePersistentState Hook
   3:  *
   4:  * A useState replacement that persists values to AsyncStorage.
   5:  * Useful for UI preferences like sidebar collapse state, theme, etc.
   6:  */
   8: import { useState, useEffect, useCallback } from "react";
   9: import AsyncStorage from "@react-native-async-storage/async-storage";
```

### 1041. `frontend/src/hooks/useResponsive.ts`
- Bytes: `7204`
- Lines: `266`
- SHA256: `ee9fed02c6069b5a0f59916340992a3919a0e03b2079828a5a91d3863840a4be`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `useResponsive`
  - `avgScale`
  - `wp`
  - `hp`
  - `normalize`
  - `spacing`
  - `fontSize`
  - `columns`
  - `padding`
  - `margin`
  - `borderRadius`
  - `iconSize`
  - `buttonHeight`
  - `inputHeight`
  - `cardPadding`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * useResponsive Hook - Auto-adjusting UI based on screen resolution
   3:  *
   4:  * Provides responsive values that automatically adapt to:
   5:  * - Different iPhone models (SE, Mini, Regular, Plus, Pro Max)
   6:  * - iPad sizes
   7:  * - Different orientations
   8:  * - Dynamic type sizes
```

### 1042. `frontend/src/hooks/useSafeAsync.ts`
- Bytes: `1438`
- Lines: `66`
- SHA256: `1e40e472d36e0f17ed40b425be353a3b9ff8c4c4bf681984d872f394d457c171`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `useSafeAsync`
  - `cleanup`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * useSafeAsync Hook
   3:  * Combines safe state management with safe async operations
   4:  * Prevents state updates on unmounted components and handles async errors gracefully
   5:  */
   7: import { useRef, useCallback, useEffect } from "react";
   8: import { safeAsync } from "@/utils/safeRender";
  10: /**
```

### 1043. `frontend/src/hooks/useSafeState.ts`
- Bytes: `1482`
- Lines: `66`
- SHA256: `d2ad37b019ee0384b43f7b0e3ca55f3d2842a8f29a7e6185708fdbc32571e591`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * useSafeState Hook
   3:  * Prevents state updates on unmounted components
   4:  */
   6: import { useState, useEffect, useRef, useCallback } from "react";
   8: /**
   9:  * Safe state hook that prevents updates after unmount
  10:  */
```

### 1044. `frontend/src/hooks/useSessionIntegrity.ts`
- Bytes: `7709`
- Lines: `296`
- SHA256: `46133236938b4096e1149821a5a2b82fe9b2437f096448399126e92d3cf3c03f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ItemVersion`
  - `SessionIntegrityState`
  - `SessionWarning`
  - `useSessionIntegrity`
  - `useAutoPause`
  - `useSessionManagement`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Session Integrity Hook - FR-M-34: Session integrity warnings
   3:  * Tracks master data versions and warns if data changed during session
   4:  */
   5: import { useState, useEffect, useCallback, useRef } from "react";
   7: interface ItemVersion {
   8:   item_code: string;
   9:   version: number;
```

### 1045. `frontend/src/hooks/useSessionsQuery.ts`
- Bytes: `575`
- Lines: `23`
- SHA256: `376aa26619bd704f7820bfcdf76bf66d7cbea161f3f65290e4a6283951b65022`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `UseSessionsQueryOptions`
  - `useSessionsQuery`
- Excerpt (first non-empty lines):

```text
   1: import { useQuery } from "@tanstack/react-query";
   2: import { getSessions } from "../services/api";
   3: import { SESSION_PAGE_SIZE } from "../constants/config";
   5: interface UseSessionsQueryOptions {
   6:   page?: number;
   7:   pageSize?: number;
   8:   enabled?: boolean;
   9: }
```

### 1046. `frontend/src/hooks/useSystemTheme.ts`
- Bytes: `162`
- Lines: `7`
- SHA256: `53e29b3da1cf0c065614eb262a37755ff19ee8b6c480ffc67731fbda436c1ff7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `useSystemTheme`
- Excerpt (first non-empty lines):

```text
   1: import { useColorScheme } from "react-native";
   3: export const useSystemTheme = () => {
   4:   const colorScheme = useColorScheme();
   5:   return colorScheme || "light";
   6: };
```

### 1047. `frontend/src/hooks/useTheme.ts`
- Bytes: `8382`
- Lines: `299`
- SHA256: `c359978b81900521d41282c36d6ad9bedae29142fead3ad021e847478d0e9a96`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `LegacyThemeColors`
  - `buildLegacyTheme`
  - `useTheme`
- Excerpt (first non-empty lines):

```text
   1: import { useColorScheme } from "react-native";
   2: import { useThemeContextSafe } from "../context/ThemeContext";
   4: type LegacyThemeColors = {
   5:   primary: string;
   6:   secondary: string;
   7:   muted: string;
   8:   background: string;
   9:   surface: string;
```

### 1048. `frontend/src/hooks/useVersionCheck.ts`
- Bytes: `4375`
- Lines: `143`
- SHA256: `e0437baaf49175f1c76457966696117592704de2d0f795a39e3a572fe8fc63b5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `useVersionCheck`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * useVersionCheck Hook
   3:  * Provides version checking and upgrade notification functionality
   4:  */
   5: import { useCallback, useEffect, useState, useRef } from "react";
   6: import { useAppVersion } from "./useAppVersion";
   7: import { checkVersion, VersionCheckResult } from "../services/versionService";
   9: export interface UseVersionCheckOptions {
```

### 1049. `frontend/src/hooks/useVoiceControl.ts`
- Bytes: `2024`
- Lines: `85`
- SHA256: `4e867adc4487809e6e6920e2db01f95d96121e5ec4da8372907d1e5ec9e087ee`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `UseVoiceControlReturn`
  - `useVoiceControl`
  - `init`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * React Hook for Voice Control
   3:  * Provides easy integration of voice commands in components
   4:  */
   6: import { useState, useEffect, useCallback } from "react";
   7: import {
   8:   voiceControlService,
   9:   type VoiceCommand,
```

### 1050. `frontend/src/hooks/useWebSocket.ts`
- Bytes: `2924`
- Lines: `94`
- SHA256: `f8340e3db39897b61483241ccbad05ef1261adba85f48e4b679dab48c8aa942d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `WebSocketMessage`
  - `useWebSocket`
  - `sendMessage`
- Excerpt (first non-empty lines):

```text
   1: import { useEffect, useRef, useState, useCallback } from "react";
   2: import { API_BASE_URL } from "../services/httpClient";
   3: import { useAuthStore } from "../store/authStore";
   4: import { storage } from "../services/storage/asyncStorageService";
   6: interface WebSocketMessage {
   7:   type: string;
   8:   [key: string]: any;
   9: }
```

### 1051. `frontend/src/index.ts`
- Bytes: `929`
- Lines: `26`
- SHA256: `fd9267e2f30d06e808dd3430fde7c7d16e9bf1e623e211f01b5abd310d696192`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: // Main entry point for src
   2: // Note: Be careful with duplicate exports across modules
   4: // Re-export only from store (which has the primary auth state)
   5: export { useAuthStore, AuthState } from "./store/authStore";
   6: export { useNetworkStore } from "./store/networkStore";
   7: export { useSettingsStore } from "./store/settingsStore";
   9: // Re-export commonly used hooks
  10: export { useTheme } from "./hooks/useTheme";
```

### 1052. `frontend/src/scanner/serialScanRules.ts`
- Bytes: `4060`
- Lines: `149`
- SHA256: `e5c1106cde1a7ad0fd20b5c37d92bd9ab5630be8f2c07baf46c59e4010ee4252`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `normalizeScanValue`
  - `t`
  - `val`
  - `isLikelyEanUpc`
  - `isSerialLike`
  - `isTooShort`
  - `scoreCandidate`
  - `t`
  - `decide`
- Excerpt (first non-empty lines):

```text
   1: // src/scanner/serialScanRules.ts
   3: export type ScanMode = "SERIAL" | "ITEM" | "AUTO";
   5: export type ScanCandidate = {
   6:   raw: string;
   7:   value: string; // normalized
   8:   symbology?: string; // expo "type"
   9: };
  11: export type ScanDecision =
```

### 1053. `frontend/src/scanner/useScanGate.ts`
- Bytes: `738`
- Lines: `29`
- SHA256: `d944cafe5a4c2e088a1a6ea788878c65d51bce246e57a2edd358fa09b36e0ced`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `useScanGate`
- Excerpt (first non-empty lines):

```text
   1: // src/scanner/useScanGate.ts
   2: import { useCallback, useRef } from "react";
   4: export function useScanGate() {
   5:   const lockRef = useRef(false);
   6:   const lastRef = useRef<{ value: string; ts: number }>({ value: "", ts: 0 });
   8:   const canProcess = useCallback((value: string, debounceMs = 900) => {
   9:     const now = Date.now();
  10:     const last = lastRef.current;
```

### 1054. `frontend/src/services/__tests__/api.test.ts`
- Bytes: `5090`
- Lines: `185`
- SHA256: `d9caa1bae1cd55b0f1fb1e71361fdeac37d2daba0fe920133ae1fd1809c6145b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * API Service Tests
   3:  * Tests for core API functionality
   4:  */
   6: import { describe, it, expect, jest, beforeEach } from "@jest/globals";
   7: import { isOnline } from "../api/api";
   8: import apiClient from "../httpClient";
   9: import { useNetworkStore } from "../../store/networkStore";
```

### 1055. `frontend/src/services/__tests__/sentry.test.ts`
- Bytes: `1641`
- Lines: `42`
- SHA256: `49e98727e2c933a1c86af466bc9de76733cb52d9f558dd456b40cf985337a5ca`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import { describe, it, expect, beforeEach, jest } from "@jest/globals";
   3: describe("sentry service smoke tests", () => {
   4:   beforeEach(() => {
   5:     jest.resetModules();
   6:     delete process.env.EXPO_PUBLIC_SENTRY_DSN;
   7:     delete process.env.EXPO_PUBLIC_APP_ENV;
   8:     const fetchMock: jest.Mock = jest.fn();
   9:     fetchMock.mockImplementation(async () => ({ ok: true }));
```

### 1056. `frontend/src/services/__tests__/storage.test.ts`
- Bytes: `8020`
- Lines: `276`
- SHA256: `f3b0229efd58f7d922d3a95bf387c0152c8ac53573b6a31e23b318ed864625c1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Storage Service Tests
   3:  * Tests for AsyncStorage wrapper and caching
   4:  */
   6: import {
   7:   describe,
   8:   it,
   9:   expect,
```

### 1057. `frontend/src/services/__tests__/syncBatch.test.ts`
- Bytes: `4221`
- Lines: `150`
- SHA256: `9e83ef6a7d16cff1810f04bf0850ec96a246779563fa2a344fa53de1833b6004`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import { syncOfflineQueue } from "../syncService";
   2: import * as api from "../api/api";
   3: import * as offlineStorage from "../offline/offlineStorage";
   5: // Mock dependencies
   6: jest.mock("../api/api");
   7: jest.mock("../offline/offlineStorage");
   8: jest.mock("../connectionManager", () => ({
   9:   __esModule: true,
```

### 1058. `frontend/src/services/aiBarcodeRecognition.ts`
- Bytes: `9204`
- Lines: `339`
- SHA256: `84228fe5beb04b65e7cea09fd021a3bfad2a5ef9d6457bd7f6106825dac3369e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AIBarcodeRecognitionService`
  - `TensorFlowBarcodeService`
  - `enhanceBarcodeImage`
  - `recognizeBarcodeWithAI`
  - `initializeAIBarcodeService`
  - `isAIBarcodeServiceAvailable`
  - `useAIBarcodeRecognition`
  - `init`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * AI-Powered Barcode Recognition Service
   3:  * Uses TensorFlow.js for client-side barcode recognition and OCR
   4:  * Provides enhanced barcode scanning with damage/fade detection
   5:  */
   7: import React from "react";
   8: import { Platform } from "react-native";
  10: export interface BarcodeRecognitionOptions {
```

### 1059. `frontend/src/services/analyticsService.ts`
- Bytes: `5848`
- Lines: `242`
- SHA256: `2030d1ed4d3165acc08dae8dbe3da51c609ba9d0de7dee039d784972e4904ae2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AnalyticsService`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Analytics Service
   3:  * Provides real-time metrics and analytics data
   4:  * Phase 0: Advanced Analytics Dashboard
   5:  */
   7: import {
   8:   getSessionsAnalytics,
   9:   getSystemStats,
```

### 1060. `frontend/src/services/animationService.ts`
- Bytes: `3794`
- Lines: `167`
- SHA256: `095d711d010edf665d92522801b9a00d4f5a9ec7242212f215df20069a0fa752`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AnimationService`
  - `pulse`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Animation Service - Smooth animations and transitions
   3:  */
   5: import { Animated, Easing } from "react-native";
   7: /**
   8:  * Animation Service
   9:  */
  10: export class AnimationService {
```

### 1061. `frontend/src/services/api/adminApi.ts`
- Bytes: `3357`
- Lines: `143`
- SHA256: `79c042c8f7b6e262f8c165a6d3dc007a91e41baaf6abccc56394a82ba8dc7504`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Admin API Service - Endpoints for admin dashboard functionality
   3:  * Provides access to KPIs, system status, active users, error logs, and performance metrics
   4:  */
   6: import api from "../httpClient";
   8: // Types
   9: export interface KPIResponse {
  10:   total_stock_value: number;
```

### 1062. `frontend/src/services/api/analyticsApi.ts`
- Bytes: `22133`
- Lines: `753`
- SHA256: `3ab69267ecc923d88adda1a9e4d00c901cebe58a50b1d8a16bd948e0159a47c4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AnalyticsApiError`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Analytics API Service
   3:  *
   4:  * Provides access to analytics and reporting data for supervisor dashboards.
   5:  * Includes session analytics, variance tracking, and performance metrics.
   6:  *
   7:  * @module services/api/analyticsApi
   8:  *
```

### 1063. `frontend/src/services/api/api.test.ts`
- Bytes: `1152`
- Lines: `47`
- SHA256: `8e0c6a0815338a149b2b09042ed0e7c5a9141f0cf1d5e51e0c1d5e74ba041179`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import { getWarehouses } from "./api";
   2: import api from "../httpClient";
   4: // Mock dependencies
   5: jest.mock("../httpClient", () => ({
   6:   get: jest.fn(),
   7:   post: jest.fn(),
   8: }));
  10: jest.mock("../../utils/network", () => ({
```

### 1064. `frontend/src/services/api/api.ts`
- Bytes: `93034`
- Lines: `3113`
- SHA256: `594176db59571393031752edf55aa2278f30bdbd45f53e6b015dec8e4bb395b5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `isOnline`
  - `createSession`
  - `createOfflineSession`
  - `getSessions`
  - `skip`
  - `skip`
  - `getSession`
  - `getSessionStats`
  - `getRackProgress`
  - `bulkCloseSessions`
  - `bulkReconcileSessions`
  - `bulkExportSessions`
  - `getSessionsAnalytics`
  - `getUnknownItems`
  - `mapUnknownToSku`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * API service layer: network-aware endpoints with offline fallbacks and caching.
   3:  * Most functions prefer online calls and transparently fall back to cache.
   4:  */
   5: import { useAuthStore } from "../../store/authStore";
   6: import api from "../httpClient";
   7: import { retryWithBackoff } from "../../utils/retry";
   8: import { validateBarcode } from "../../utils/validation";
```

### 1065. `frontend/src/services/api/authApi.ts`
- Bytes: `2923`
- Lines: `124`
- SHA256: `775f4984ccd7a036a34bff4796bb0858fa1455df901c6aeb3a4b6650d63047b7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Authentication API Service
   3:  *
   4:  * Handles authentication-related API calls including login, logout,
   5:  * PIN change, and password change.
   6:  */
   8: import api from "../httpClient";
  10: export interface ChangePinResponse {
```

### 1066. `frontend/src/services/api/enhancedApi.ts`
- Bytes: `2963`
- Lines: `117`
- SHA256: `474fd938bd493eec7062ae643dd36c6d30bb65b6da327785567f6fdf4a7e58f8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `EnhancedApiService`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Enhanced API service with better error handling and loading states
   3:  */
   4: import api from "../httpClient";
   5: import { Item } from "../../types/item";
   6: import { Session } from "../../types/session";
   7: import { PaginatedResponse } from "../../types/api";
   9: export class EnhancedApiService {
```

### 1067. `frontend/src/services/api/enhancedApiClient.ts`
- Bytes: `6936`
- Lines: `294`
- SHA256: `2ad9ae2c6b811d457755f23e7046e705dfafe31b67103a97884eda80e46b5670`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `EnhancedApiClient`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Enhanced API Client
   3:  * Upgraded API client with retry logic, better error handling, and standardized responses
   4:  */
   6: import axios from "axios";
   7: import api from "../httpClient";
   8: import { retryWithBackoff } from "../../utils/retry";
   9: import { ApiResponse, PaginatedResponse } from "../../types/api";
```

### 1068. `frontend/src/services/api/enhancedDatabaseApi.ts`
- Bytes: `7522`
- Lines: `261`
- SHA256: `64e36c12e071f4c3991fe52bdbcce09117600ee76ba1efb8b72855227daabfaf`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ApiError`
  - `EnhancedDatabaseAPI`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Enhanced Database API - Frontend service for advanced database operations
   3:  */
   4: import api from "../httpClient";
   5: import { Item } from "./itemVerificationApi";
   7: interface ApiError {
   8:   response?: {
   9:     data?: {
```

### 1069. `frontend/src/services/api/enrichmentApi.ts`
- Bytes: `6248`
- Lines: `228`
- SHA256: `402ad36c1b02bc6e6cdd33e53c85140f56f8c1e8d9838f25aaa9a1ff5d8fe6e3`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ApiError`
  - `enrichItem`
  - `getMissingFields`
  - `getEnrichmentHistory`
  - `validateEnrichmentData`
  - `message`
  - `getIncompleteItems`
  - `getEnrichmentStats`
  - `bulkImportEnrichments`
  - `message`
  - `checkItemQtyRealtime`
  - `recalculateCompleteness`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Enrichment API Service
   3:  * Frontend service for item data enrichment operations
   4:  */
   6: import apiClient from "../httpClient";
   7: import type {
   8:   EnrichmentData,
   9:   EnrichmentRequest,
```

### 1070. `frontend/src/services/api/index.ts`
- Bytes: `314`
- Lines: `11`
- SHA256: `94f85347534781ec4a3d183fd54f8d028b87e36a71b9dffbd4af1c6575d9e5e5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: export * from "./api";
   2: export * from "./adminApi";
   3: export * from "./authApi";
   4: export * from "./reportApi";
   5: export * from "./enhancedApi";
   6: export * from "./enhancedApiClient";
   7: export * from "./enhancedDatabaseApi";
   8: export * from "./enrichmentApi";
```

### 1071. `frontend/src/services/api/itemVerificationApi.ts`
- Bytes: `348`
- Lines: `11`
- SHA256: `d3ad804feaecde13f41180bd13829025740ce6f428ef6cb0036a01473223ba3e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Item Verification API - Re-export from domains/inventory
   3:  *
   4:  * This file maintains backward compatibility for imports.
   5:  * The canonical source is now in domains/inventory/services/
   6:  *
   7:  * @deprecated Import from '@/domains/inventory/services/itemVerificationApi' instead
   8:  */
```

### 1072. `frontend/src/services/api/models.ts`
- Bytes: `2424`
- Lines: `109`
- SHA256: `f21713853a873157065b0f109864c94b681ed0989e9bf1a6dc3ed1d7898dca00`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: // TypeScript interfaces generated from backend Pydantic models
   3: export interface PinLogin {
   4:   pin: string;
   5: }
   7: export interface UserInfo {
   8:   id: string;
   9:   username: string;
  10:   full_name: string;
```

### 1073. `frontend/src/services/api/notesApi.ts`
- Bytes: `764`
- Lines: `35`
- SHA256: `8413a2784e52c44d721df1ce9b3e1382ee0c8f73e002de9809de3ce7a1cbb593`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `listNotes`
  - `createNote`
  - `updateNote`
  - `deleteNote`
- Excerpt (first non-empty lines):

```text
   1: import apiClient from "../httpClient";
   3: export interface Note {
   4:   id?: string;
   5:   tenantId?: string;
   6:   userId?: string;
   7:   createdAt?: string;
   8:   tags?: string[];
   9:   body: string;
```

### 1074. `frontend/src/services/api/reportApi.ts`
- Bytes: `5283`
- Lines: `223`
- SHA256: `2a876eaf902be93567b4e4fcdaef746f34f2f81357d5b5cef4c51b9a29df1498`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `downloadReport`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Report Generation API Service - Endpoints for generating and exporting reports
   3:  */
   5: import api from "../httpClient";
   7: // Types
   8: export type ReportType =
   9:   | "stock_summary"
  10:   | "variance_report"
```

### 1075. `frontend/src/services/api/sessionApi.ts`
- Bytes: `12371`
- Lines: `450`
- SHA256: `317123ae8e74f9d32565f7e62fd3296037fb83a764ed8dd0dae1023db1e76b61`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SessionApiError`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Session API Service
   3:  *
   4:  * Handles all session-related API calls including:
   5:  * - Session CRUD operations
   6:  * - Bulk status updates (close, reconcile, export)
   7:  * - Session statistics and summaries
   8:  *
```

### 1076. `frontend/src/services/asyncStorageService.ts`
- Bytes: `951`
- Lines: `34`
- SHA256: `b5a51f2604fc90c52a6d9bff3a6bcabee99696054fa7d1dcb7e255cde355fc52`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import AsyncStorage from "@react-native-async-storage/async-storage";
   3: export const storage = {
   4:   getItem: async (key: string): Promise<string | null> => {
   5:     try {
   6:       return await AsyncStorage.getItem(key);
   7:     } catch {
   8:       return null;
   9:     }
```

### 1077. `frontend/src/services/audit/auditLogger.ts`
- Bytes: `1565`
- Lines: `67`
- SHA256: `e86d270480a91dfa96be40fef4ec2803def01272127f9a8d4452305e3065fa43`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import { logger } from "../logging";
   2: import { useAuthStore } from "../../store/authStore";
   4: /**
   5:  * Service for logging user actions for audit purposes.
   6:  * This can be used to track critical actions like stock updates, deletions, or syncs.
   7:  */
   8: export const auditLogger = {
   9:   /**
```

### 1078. `frontend/src/services/auth.ts`
- Bytes: `2416`
- Lines: `88`
- SHA256: `f65135bd46f745a46a3854427753f575b18a1afcffc18e396a0f02c5fe5f44a4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import apiClient from "./httpClient";
   2: import { useAuthStore } from "../store/authStore";
   3: import { secureStorage } from "./storage/secureStorage";
   5: const TOKEN_STORAGE_KEY = "auth_token";
   6: const REFRESH_TOKEN_STORAGE_KEY = "refresh_token";
   8: /**
   9:  * Authentication service for handling token management and user state.
  10:  * This service acts as a bridge between the Zustand auth store and the API.
```

### 1079. `frontend/src/services/authUnauthorizedHandler.ts`
- Bytes: `508`
- Lines: `19`
- SHA256: `bea3e9985ebcea86348907c6a54886d70ea34e0359b4b29d2f1fb9a627a068f6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `setUnauthorizedHandler`
  - `handleUnauthorized`
- Excerpt (first non-empty lines):

```text
   1: export type UnauthorizedHandler = () => void | Promise<void>;
   3: let handler: UnauthorizedHandler | null = null;
   5: export const setUnauthorizedHandler = (next: UnauthorizedHandler | null) => {
   6:   handler = next;
   7: };
   9: export const handleUnauthorized = () => {
  10:   try {
  11:     const result = handler?.();
```

### 1080. `frontend/src/services/backendUrl.ts`
- Bytes: `6347`
- Lines: `207`
- SHA256: `aff3d9e129dffccb7f5d43e52cea498a162667cd6394f1d6b0e66faa13997315`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `parsePort`
  - `getCandidatePorts`
  - `timeoutFetch`
  - `stripTrailingSlash`
  - `getInitialBackendUrl`
  - `buildCandidates`
  - `addCandidate`
  - `resolveBackendUrl`
  - `initializeBackendURL`
  - `getBackendURL`
- Excerpt (first non-empty lines):

```text
   1: import Constants from "expo-constants";
   2: import { Platform } from "react-native";
   4: const HEALTH_PATH = "/api/health";
   6: const parsePort = (value?: string | null): number | null => {
   7:   if (!value) return null;
   8:   const trimmed = value.trim();
   9:   if (!/^\d+$/.test(trimmed)) return null;
  10:   const port = Number(trimmed);
```

### 1081. `frontend/src/services/backgroundSync.ts`
- Bytes: `3047`
- Lines: `95`
- SHA256: `62dcdc99de388665f17ae8ea85a7530b7d3144e6fdf5e9491d0bf20df5fe91c8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `registerBackgroundSync`
  - `unregisterBackgroundSync`
- Excerpt (first non-empty lines):

```text
   1: import * as BackgroundFetch from "expo-background-fetch";
   2: import * as TaskManager from "expo-task-manager";
   3: import { Platform } from "react-native";
   4: import Constants from "expo-constants";
   5: import { syncQueue } from "./syncQueue";
   7: const BACKGROUND_SYNC_TASK = "BACKGROUND_SYNC_TASK";
   9: /**
  10:  * Define the background task.
```

### 1082. `frontend/src/services/backupService.ts`
- Bytes: `6288`
- Lines: `252`
- SHA256: `3bfb7db4b7fa6ea86c4fbc2a86aa62c81e4e7f76114bfc85858d76abdfb05a44`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `BackupItem`
  - `BackupSession`
  - `BackupCountLine`
  - `BackupPreferences`
  - `BackupAnalytics`
  - `BackupService`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Backup Service - Backup and restore functionality
   3:  * Handles backing up and restoring app data
   4:  */
   6: import AsyncStorage from "@react-native-async-storage/async-storage";
   7: import { Share } from "react-native";
   8: import { getCacheStats, clearAllCache } from "./offline/offlineStorage";
  10: interface BackupItem {
```

### 1083. `frontend/src/services/batchOperationsService.ts`
- Bytes: `5199`
- Lines: `200`
- SHA256: `137506e4c49ff244c57ed9a4846734807241ef36a5ce1b452745bcc42f6644c0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `BatchOperationsService`
  - `BatchItem`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Batch Operations Service - Bulk operations
   3:  * Handles batch counting, bulk updates, and mass operations
   4:  */
   6: import api, { createCountLine } from "./api/api";
   7: import { BatchProcessor } from "./monitoring/performanceService";
   8: import { handleErrorWithRecovery } from "./utils/errorRecovery";
  10: export interface BatchCountOperation {
```

### 1084. `frontend/src/services/cameraEnhancementService.ts`
- Bytes: `3965`
- Lines: `182`
- SHA256: `96496b744b7fbf76ab6b17c9f8da9479289bdee27b56ebfa28eadaa74de74b4d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `CameraEnhancementService`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Camera Enhancement Service
   3:  * Provides advanced camera features for barcode scanning
   4:  * Phase 0: Enhanced Mobile Camera Features
   5:  */
   7: import * as Brightness from "expo-brightness";
   9: export interface CameraSettings {
  10:   autoFocus: boolean;
```

### 1085. `frontend/src/services/connectionManager.ts`
- Bytes: `12142`
- Lines: `420`
- SHA256: `3de1617b998ed672d04a1f0d83823e91acd2ca8c7a70a68ff2b10fb8e122eeb3`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ConnectionInfo`
  - `ConnectionManager`
  - `normalize`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Dynamic Connection Manager
   3:  * Automatically detects and updates backend connection when ports/IPs change
   4:  */
   6: import { Platform } from "react-native";
   7: import Constants from "expo-constants";
   8: import AsyncStorage from "@react-native-async-storage/async-storage";
   9: import { createLogger } from "./logging";
```

### 1086. `frontend/src/services/deviceId.ts`
- Bytes: `870`
- Lines: `29`
- SHA256: `da9001d55edb2bc21eb4f575c286a711ba620f5fc2804727429f3482f9a841e6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `getDeviceId`
- Excerpt (first non-empty lines):

```text
   1: import * as Crypto from "expo-crypto";
   2: import { secureStorage } from "./storage/secureStorage";
   3: import { createLogger } from "./logging";
   5: const log = createLogger("deviceId");
   6: const DEVICE_ID_KEY = "device_id";
   8: /**
   9:  * Retrieves the persistent Device ID for this installation.
  10:  * Generates a new UUID if one does not exist.
```

### 1087. `frontend/src/services/devtools/reactotron.ts`
- Bytes: `589`
- Lines: `25`
- SHA256: `ec4996255946170cf8d9efd2e8b0ea04c2cae8a3ab339f457dc733772d375b47`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `initReactotron`
- Excerpt (first non-empty lines):

```text
   1: let initialized = false;
   3: export const initReactotron = async (): Promise<void> => {
   4:   if (!__DEV__ || initialized) return;
   6:   try {
   7:     const [{ default: Reactotron }] = await Promise.all([
   8:       import("reactotron-react-native"),
   9:     ]);
  11:     Reactotron.configure({ name: "Stock Final" })
```

### 1088. `frontend/src/services/enhancedFeatures.ts`
- Bytes: `2620`
- Lines: `85`
- SHA256: `e66e04288553cf9f0c0f606dbabefee8d92055da8116d4fe150d1fbc4911b7f3`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AnalyticsData`
- Excerpt (first non-empty lines):

```text
   1: import AsyncStorage from "@react-native-async-storage/async-storage";
   2: import type { Item } from "../types/scan";
   4: const RECENT_ITEMS_KEY = "stock_verify_recent_items";
   6: /** Recent item with scan timestamp */
   7: export interface RecentItem extends Item {
   8:   scanned_at: string;
   9:   floor_no?: string;
  10:   rack_no?: string;
```

### 1089. `frontend/src/services/enhancedSearchService.ts`
- Bytes: `3184`
- Lines: `134`
- SHA256: `6feb38c7f235b68a95f77f10e4a812a15a584c8c7268776b8f17c5ad4c6c8d0c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: // Enhanced Search Service for advanced item searching
   2: import {
   3:   searchItemsOptimized,
   4:   getSearchSuggestions as getApiSuggestions,
   5:   getSearchFilters,
   6: } from "./api/api";
   8: export interface SearchResult {
   9:   id: string;
```

### 1090. `frontend/src/services/errorRecovery.ts`
- Bytes: `879`
- Lines: `27`
- SHA256: `07bb19bb80daa4923a3f4bab11acea1d79034d0a46ba75773cd92020fad28574`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `handleErrorWithRecovery`
- Excerpt (first non-empty lines):

```text
   1: export const handleErrorWithRecovery = async (
   2:   operation: () => Promise<any>,
   3:   options: any,
   4: ) => {
   5:   try {
   6:     return await operation();
   7:   } catch (error: any) {
   8:     // Don't show generic alert if caller handles it, or show specific message
```

### 1091. `frontend/src/services/exportService.ts`
- Bytes: `11589`
- Lines: `404`
- SHA256: `c4505fbaf013f67c27a8d9b24ae8b6ef17c9be3bd79516e9cd27f694f3f7f434`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ExportRecord`
  - `ExportService`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Export Service
   3:  * Handles data export to CSV, Excel, and JSON formats
   4:  */
   6: import { Paths, File } from "expo-file-system";
   7: import * as Sharing from "expo-sharing";
   8: import { Alert } from "react-native";
   9: import type { Session } from "../types/session";
```

### 1092. `frontend/src/services/hapticService.ts`
- Bytes: `6117`
- Lines: `260`
- SHA256: `fb3c1c76265460fa1a56aaa234561fa60f3e707514eee4411669be7a78ad29c1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `HapticService`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Haptic Feedback Service
   3:  * Provides haptic feedback for scanner and other UI interactions
   4:  */
   5: import * as Haptics from "expo-haptics";
   6: import { Platform } from "react-native";
   7: import { SCANNER_CONFIG } from "../config/scannerConfig";
   9: /**
```

### 1093. `frontend/src/services/haptics.ts`
- Bytes: `625`
- Lines: `28`
- SHA256: `bd8c936a672677c58b70e11d7e455cc38418f291886bd8dceb584bcc18610a49`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: // Haptics service for vibration feedback
   2: export const haptics = {
   3:   light: () => {
   4:     // Implementation would use Expo Haptics
   5:     console.log("Light haptic feedback");
   6:   },
   8:   medium: () => {
   9:     // Implementation would use Expo Haptics
```

### 1094. `frontend/src/services/httpClient.ts`
- Bytes: `14362`
- Lines: `422`
- SHA256: `f52dff671307e13ed795bfbdc6aa3a451161b2f20f8403d1d725f945b8c22f0e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `updateBaseURL`
  - `summarizePayload`
  - `toFullUrl`
  - `base`
  - `path`
  - `summarizeResponseData`
  - `refreshAccessToken`
  - `performLogout`
- Excerpt (first non-empty lines):

```text
   1: import axios from "axios";
   2: import { BACKEND_URL } from "./backendUrl";
   3: import { createLogger } from "./logging";
   4: import { secureStorage } from "./storage/secureStorage";
   5: import { handleUnauthorized } from "./authUnauthorizedHandler";
   6: import { getDeviceId } from "./deviceId";
   7: import { useNetworkStore } from "../store/networkStore";
   8: import ConnectionManager, { ConnectionInfo } from "./connectionManager";
```

### 1095. `frontend/src/services/index.ts`
- Bytes: `882`
- Lines: `39`
- SHA256: `fd7f22c0e73819548c1ff6563d8cb9650c4285841c08f54fbc27eaf1ed0d29ff`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: // Main services export file
   2: export { storage } from "./asyncStorageService";
   3: export { getBackendURL } from "./backendUrl";
   5: // API services - only export what's available
   6: export {
   7:   createSession,
   8:   getSessions,
   9:   getSession,
```

### 1096. `frontend/src/services/logging.ts`
- Bytes: `4307`
- Lines: `165`
- SHA256: `ca1ae9c66046822708f247f2d350abc9653675ad6266cc3d885dc9fae690a12c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `LogLevel`
  - `LogEntry`
  - `LogSink`
  - `log`
  - `createLogger`
  - `normalizeContext`
  - `addLogSink`
  - `removeLogSink`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Structured Logging Service
   3:  *
   4:  * Provides environment-aware logging with proper sinks.
   5:  * Replaces scattered __DEV__ && console.log patterns.
   6:  */
   8: type LogLevel = "debug" | "info" | "warn" | "error";
  10: interface LogEntry {
```

### 1097. `frontend/src/services/microInteractions.ts`
- Bytes: `5208`
- Lines: `207`
- SHA256: `4ebeb085cc8e2da4f2910251cc8f42968a337adb8f8fcad7bbecfb0f1f04194d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `triggerHaptic`
  - `triggerImpact`
  - `triggerSelection`
  - `triggerNotification`
  - `triggerPattern`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * MicroInteractions Service - Aurora Design v2.0
   3:  *
   4:  * Unified haptic feedback and micro-interaction patterns
   5:  * Features:
   6:  * - Consistent haptic patterns
   7:  * - Platform-aware feedback
   8:  * - Interaction presets
```

### 1098. `frontend/src/services/mmkvStorage.ts`
- Bytes: `3806`
- Lines: `135`
- SHA256: `c066a1d417ba8dbbef0fea93dab9e5a21e184fa13d1235f14aaf8eea9f7601b0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `smallKeys`
- Excerpt (first non-empty lines):

```text
   1: import { createLogger } from "./logging";
   2: import AsyncStorage from "@react-native-async-storage/async-storage";
   4: const log = createLogger("mmkvStorage");
   6: // Use AsyncStorage with an in-memory cache for synchronous-like access.
   7: // react-native-mmkv v4 requires react-native-nitro-modules which cannot be
   8: // resolved in Expo Go (Metro resolves imports statically), so we use
   9: // AsyncStorage exclusively for maximum compatibility.
  11: log.info("Using AsyncStorage storage engine (Expo Go compatible)");
```

### 1099. `frontend/src/services/monitoring/databaseStatusService.ts`
- Bytes: `2375`
- Lines: `110`
- SHA256: `9454c64e1d18476a7992f9430e56c1a41dea2fc429ca4dad92eede80eb74d9c3`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `getDatabaseStatus`
  - `getSyncStatusData`
  - `getDatabaseSyncStatus`
  - `testDatabaseConnection`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Database Status Service
   3:  * Handles database connection status and sync status
   4:  */
   6: import api from "../api/api";
   7: import { getSyncStatus } from "../syncService";
   9: export interface DatabaseStatus {
  10:   configured: boolean;
```

### 1100. `frontend/src/services/monitoring/index.ts`
- Bytes: `79`
- Lines: `3`
- SHA256: `a7abf33c4b32f005d42c475bc9b01a89dad6072c3441c1cd1560935da2bc8ffa`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: export * from "./databaseStatusService";
   2: export * from "./performanceService";
```

### 1101. `frontend/src/services/monitoring/performanceService.ts`
- Bytes: `4460`
- Lines: `216`
- SHA256: `9130176900022e4c1c3d59671bd032f91780768021b317f3a5088612f7872214`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `later`
  - `LazyLoader`
  - `BatchProcessor`
  - `CacheManager`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Performance Service - Optimizations and caching
   3:  * Handles performance optimizations, debouncing, and lazy loading
   4:  */
   6: /**
   7:  * Debounce function - delays execution until after wait time
   8:  */
   9: export function debounce<T extends (...args: any[]) => any>(
```

### 1102. `frontend/src/services/networkService.ts`
- Bytes: `1916`
- Lines: `59`
- SHA256: `e597c3025983c0a5322611a1ba5bc99e7cb0e80b9fe8951638de574f570758aa`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `toReachableValue`
  - `applyNetInfoState`
  - `initializeNetworkListener`
- Excerpt (first non-empty lines):

```text
   1: import NetInfo from "@react-native-community/netinfo";
   2: import { flags } from "../constants/flags";
   3: import { useNetworkStore } from "../store/networkStore";
   5: function toReachableValue(
   6:   isConnected: boolean,
   7:   isInternetReachable: boolean | null | undefined,
   8: ): boolean | null {
   9:   // This app commonly runs on a local LAN backend.
```

### 1103. `frontend/src/services/notesApi.ts`
- Bytes: `1158`
- Lines: `53`
- SHA256: `047f22526725f1422356f3fd5a92195d6723ff048283944804155c7e179aac76`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `NotesResponse`
  - `ApiResult`
- Excerpt (first non-empty lines):

```text
   1: /** Note data structure */
   2: export interface Note {
   3:   id?: string;
   4:   content: string;
   5:   created_at?: string;
   6:   updated_at?: string;
   7:   created_by?: string;
   8: }
```

### 1104. `frontend/src/services/offline/index.ts`
- Bytes: `66`
- Lines: `3`
- SHA256: `c8f116bb8490d003b93f5ae80b7b47d326d196e4352eeb4fedc6a29106a639a2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: export * from "./offlineQueue";
   2: export * from "./offlineStorage";
```

### 1105. `frontend/src/services/offline/offlineCountLine.ts`
- Bytes: `5317`
- Lines: `186`
- SHA256: `32c4d13d5467fc0fd1ff313aaa55b734d4f567fbf774c1acff7be6455eee453d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `setDeviceContext`
  - `getDeviceContext`
  - `createOfflineCountLine`
  - `validateCountLineData`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Offline Count Line Service
   3:  *
   4:  * Single source of truth for creating offline count lines.
   5:  * Addresses code duplication in createCountLine.
   6:  */
   8: import { CreateCountLinePayload } from "../../types/scan";
   9: import { generateOfflineId } from "../../utils/uuid";
```

### 1106. `frontend/src/services/offline/offlineQueue.ts`
- Bytes: `9754`
- Lines: `296`
- SHA256: `10f916f10ed3ff772c1c299ffa865db5804cf64f00f476878d02a8ff8e094567`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `generateId`
  - `loadQueue`
  - `saveQueue`
  - `addConflict`
  - `existing`
  - `isMutatingMethod`
  - `enqueueMutation`
  - `flushOfflineQueue`
  - `startOfflineQueue`
  - `stopOfflineQueue`
  - `attachOfflineQueueInterceptors`
  - `method`
  - `errorCode`
  - `getQueueCount`
  - `listQueue`
- Excerpt (first non-empty lines):

```text
   1: import type { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
   2: // import apiClient from './httpClient';
   3: import { storage } from "../storage/asyncStorageService";
   4: import { useNetworkStore } from "../../store/networkStore";
   5: import { flags } from "../../constants/flags";
   6: import { toastService } from "../utils/toastService";
   7: import { onlineManager } from "@tanstack/react-query";
   9: // NOTE: This module is entirely gated by flags.enableOfflineQueue
```

### 1107. `frontend/src/services/offline/offlineStorage.ts`
- Bytes: `19935`
- Lines: `676`
- SHA256: `92c91d70a3300662e7052131576b2b882aab7b8730d4bf344f697a2c6c28b9ba`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `isCacheStale`
  - `assertValidCachedItem`
  - `assertValidCachedCountLine`
  - `cacheItem`
  - `getItemsCache`
  - `getItemFromCache`
  - `searchItemsInCache`
  - `code`
  - `name`
  - `barcode`
  - `clearItemsCache`
  - `addToOfflineQueue`
  - `getOfflineQueue`
  - `removeFromOfflineQueue`
  - `removeManyFromOfflineQueue`
- Excerpt (first non-empty lines):

```text
   1: import AsyncStorage from "@react-native-async-storage/async-storage";
   2: import { storage } from "../storage/asyncStorageService";
   3: import { levenshteinDistance } from "../../utils/algorithms";
   4: import { createLogger } from "../logging";
   6: const log = createLogger("OfflineStorage");
   8: const STORAGE_KEYS = {
   9:   ITEMS_CACHE: "items_cache",
  10:   OFFLINE_QUEUE: "offline_queue",
```

### 1108. `frontend/src/services/offline/syncService.ts`
- Bytes: `947`
- Lines: `37`
- SHA256: `1f93f99927082909cb2d8fea28c08ab352588ebffc73d30e17186fb4bd33d3b4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `startSyncService`
  - `run`
  - `stopSyncService`
- Excerpt (first non-empty lines):

```text
   1: import { syncOfflineQueue } from "../syncService";
   2: import { createLogger } from "../logging";
   4: const log = createLogger("offlineSyncService");
   5: const DEFAULT_INTERVAL_MS = 30000;
   7: let intervalId: ReturnType<typeof setInterval> | null = null;
   9: export function startSyncService(options?: {
  10:   intervalMs?: number;
  11:   runImmediately?: boolean;
```

### 1109. `frontend/src/services/offline/unifiedSyncStorage.ts`
- Bytes: `5075`
- Lines: `185`
- SHA256: `f25b2ef8b1377c3520bb93f2b3b4aff20545047dd44a0ef4484088be95a4ad61`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `UnifiedSyncStorage`
- Excerpt (first non-empty lines):

```text
   1: import { storage } from "../storage/asyncStorageService";
   2: import { createLogger } from "../logging";
   4: const log = createLogger("UnifiedSyncStorage");
   6: const UNIFIED_QUEUE_KEY = "unified_sync_queue:v1";
   8: export type SyncStatus = "pending" | "locked" | "error" | "synced";
  10: export interface UnifiedSyncItem {
  11:   id: string;
  12:   type: string;
```

### 1110. `frontend/src/services/offlineQueue.ts`
- Bytes: `399`
- Lines: `16`
- SHA256: `2212177e304193be99194f7dfaf6aceb09fcfa581e036b0c3e5dcf94fbd363a2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: // Compatibility facade: re-export the real offline queue implementation.
   2: // This keeps existing import paths working while enabling full offline support.
   4: export {
   5:   startOfflineQueue,
   6:   stopOfflineQueue,
   7:   attachOfflineQueueInterceptors,
   8:   enqueueMutation,
   9:   flushOfflineQueue,
```

### 1111. `frontend/src/services/pinAuth.tsx`
- Bytes: `12049`
- Lines: `490`
- SHA256: `65cbe1c7e428ffe147f6fe9cdfa217062c80b66cc1de18ff2f9c2514cb18f390`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `PINAuthService`
  - `PINPadProps`
  - `handleDigitPress`
  - `handleBackspace`
  - `usePINAuth`
  - `handlePINComplete`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * PIN Authentication Service
   3:  * Handles 4-digit PIN login and validation
   4:  */
   6: import React, { useState, useCallback } from "react";
   7: import {
   8:   View,
   9:   Text,
```

### 1112. `frontend/src/services/queryClient.ts`
- Bytes: `239`
- Lines: `11`
- SHA256: `fd7bc6e050f5fcf49dacecda89baa2333fd94bd1c13b08cabac785669ad8b9e3`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import { QueryClient } from "@tanstack/react-query";
   3: export const queryClient = new QueryClient({
   4:   defaultOptions: {
   5:     queries: {
   6:       staleTime: 5 * 60 * 1000, // 5 minutes
   7:       gcTime: 10 * 60 * 1000, // 10 minutes
   8:     },
   9:   },
```

### 1113. `frontend/src/services/scanDeduplicationService.ts`
- Bytes: `363`
- Lines: `11`
- SHA256: `e1ab3ef0afdad5a0d3665523c7e85449017118417826c2c4a8b9aed96a7a75ad`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Scan Deduplication Service - Re-export from domains/inventory
   3:  *
   4:  * This file maintains backward compatibility for imports.
   5:  * The canonical source is now in domains/inventory/services/
   6:  *
   7:  * @deprecated Import from '@/domains/inventory/services/scanDeduplicationService' instead
   8:  */
```

### 1114. `frontend/src/services/selfTestService.tsx`
- Bytes: `17352`
- Lines: `649`
- SHA256: `0139cf3e4a45857ee45a676d10b879451f4300beeb251b062fa241bba1800cb6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SelfTestService`
  - `getStatusColor`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Self-Test Service for Stock Verification System
   3:  * Comprehensive testing of all functionality
   4:  */
   6: import React, { useState, useCallback } from "react";
   7: import {
   8:   ScrollView,
   9:   View,
```

### 1115. `frontend/src/services/sentry.ts`
- Bytes: `3776`
- Lines: `145`
- SHA256: `179bec81179e7314683f0ee7721d6213a729566ffb5af8ed06588e56631dd188`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SentryRuntimeConfig`
  - `normalizeRelease`
  - `runtimeCandidate`
  - `buildEnvelopeUrl`
  - `generateEventId`
  - `parseStackFrames`
  - `initSentry`
  - `sendSentryEvent`
  - `captureException`
- Excerpt (first non-empty lines):

```text
   1: import Constants from "expo-constants";
   2: import { Platform } from "react-native";
   4: export interface CaptureContext {
   5:   context?: string;
   6:   message?: string;
   7:   [key: string]: unknown;
   8: }
  10: interface SentryRuntimeConfig {
```

### 1116. `frontend/src/services/session/heartbeatService.ts`
- Bytes: `5547`
- Lines: `225`
- SHA256: `2b76b805e465c47ca2e69e8a36a7440ebc9bcc13dd8138b14af129193adac123`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `HeartbeatResponse`
  - `HeartbeatConfig`
  - `HeartbeatService`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Heartbeat Service - Maintain session and rack locks
   3:  * Automatically sends heartbeats every 20-30 seconds
   4:  */
   6: import {
   7:   AppState,
   8:   AppStateStatus,
   9:   NativeEventSubscription,
```

### 1117. `frontend/src/services/sessionManager.ts`
- Bytes: `9415`
- Lines: `358`
- SHA256: `abc5357111a83016de29033d855f7d9ab52ffe2f9b1b44b3230c53e758045be6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `HeartbeatResponse`
  - `SessionManagerConfig`
  - `SessionManager`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Session Manager Service
   3:  *
   4:  * Comprehensive session management including:
   5:  * - Authentication session heartbeat
   6:  * - Session expiration handling
   7:  * - Token refresh coordination
   8:  * - App state awareness (foreground/background)
```

### 1118. `frontend/src/services/storage/asyncStorageService.ts`
- Bytes: `12076`
- Lines: `423`
- SHA256: `55706b820c0c4738250d14ebf35fbae40cf5eecec6fca56c2ffa4fa6f32913d0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AsyncStorageService`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Centralized AsyncStorage service to eliminate duplicate storage logic
   3:  */
   4: import AsyncStorage from "@react-native-async-storage/async-storage";
   5: import { Alert } from "react-native";
   7: export interface StorageItem<T = unknown> {
   8:   key: string;
   9:   value: T;
```

### 1119. `frontend/src/services/storage/index.ts`
- Bytes: `85`
- Lines: `3`
- SHA256: `a2638b7b9937c10dd89035bd73918fbf9d208ff7ab77399a0529ae900340fe7c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: export * from "./asyncStorageService";
   2: export { mmkvStorage } from "../mmkvStorage";
```

### 1120. `frontend/src/services/storage/secureStorage.ts`
- Bytes: `2241`
- Lines: `79`
- SHA256: `edfd5c343beb54446d48c4c23d59c3f72c65f66b973a5d7c5a6275846bc586d5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SecureStorage`
- Excerpt (first non-empty lines):

```text
   1: import * as SecureStore from "expo-secure-store";
   2: import { Platform } from "react-native";
   4: /**
   5:  * Platform-independent secure storage wrapper
   6:  * Uses expo-secure-store on native platforms
   7:  * Note: On web, SecureStore is not available, so this would need a fallback
   8:  * if we supported web for secure features. Ideally, we shouldn't store sensitive
   9:  * tokens on web local storage without careful consideration, but for now
```

### 1121. `frontend/src/services/storage/tokenStore.ts`
- Bytes: `1678`
- Lines: `75`
- SHA256: `a0439e9b6d9a6dcba36c95f6d7d2d247e5f999dd1f4bfc74e988055a776a8904`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Token Store Service
   3:  *
   4:  * Bridge between session management and secure storage.
   5:  * Uses authStore (Zustand) as the source of truth.
   6:  */
   8: import { secureStorage } from "./secureStorage";
  10: /**
```

### 1122. `frontend/src/services/sync/conflictResolution.test.ts`
- Bytes: `1685`
- Lines: `63`
- SHA256: `576e21a475d45b5c5eac8df926b435be27c642a9552b7a76124662d252027a93`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import {
   2:   resolveConflict,
   3:   serverWinsStrategy,
   4:   clientWinsStrategy,
   5:   mergeQuantityStrategy,
   6: } from "./conflictResolution";
   8: describe("Conflict Resolution Strategies", () => {
   9:   const clientData = { id: 1, name: "Item A", quantity: 10 };
```

### 1123. `frontend/src/services/sync/conflictResolution.ts`
- Bytes: `1272`
- Lines: `55`
- SHA256: `86ba8a7ec297ce893618743b31ae75890849048b59ae18e0bb552504d6218905`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Conflict Resolution Strategies
   3:  */
   5: export interface ConflictStrategy {
   6:   resolve<T>(clientData: T, serverData: T): T;
   7: }
   9: /**
  10:  * Server Wins Strategy
```

### 1124. `frontend/src/services/sync/enhancedSyncManager.ts`
- Bytes: `8571`
- Lines: `326`
- SHA256: `9cfda6c20c4c5c50576c760952c41fb22786d82864bfd7fb3dc9aa2ae71a7c4d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SyncManagerConfig`
  - `EnhancedSyncManager`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Enhanced Sync Manager - Batch processing with retry logic
   3:  * Handles offline queue sync with conflict detection
   4:  */
   6: import AsyncStorage from "@react-native-async-storage/async-storage";
   7: import api from "../httpClient";
   9: export interface SyncRecord {
  10:   client_record_id: string;
```

### 1125. `frontend/src/services/syncQueue.ts`
- Bytes: `3164`
- Lines: `115`
- SHA256: `e4c72188f9c5ce3c428928c45ebb879f41dda2cd01277af0639f47fa0e371cea`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import {
   2:   getPendingVerifications,
   3:   deletePendingVerification,
   4:   updatePendingVerificationStatus,
   5:   saveLocalItems,
   6:   LocalItem,
   7: } from "../db/localDb";
   8: import { syncBatch, isOnline } from "./api/api";
```

### 1126. `frontend/src/services/syncService.ts`
- Bytes: `7901`
- Lines: `279`
- SHA256: `61960b590d9a5ba5094f61abf1bb18a62d34581956648500173b4a3c1cbe0388`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `initializeSyncService`
  - `getSyncStatus`
  - `syncOfflineQueue`
  - `forceSync`
  - `cleanupOldFailedItems`
- Excerpt (first non-empty lines):

```text
   1: import {
   2:   getOfflineQueue,
   3:   removeManyFromOfflineQueue,
   4:   updateQueueItemRetries,
   5:   getCacheStats,
   6:   OfflineQueueItem,
   7:   removeFromOfflineQueue,
   8:   removeSessionFromCache,
```

### 1127. `frontend/src/services/themeService.ts`
- Bytes: `1989`
- Lines: `78`
- SHA256: `816eb008263ea4e5a50f2edb488ea80a4013c468d2dde2a40869d5fe726b994f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ThemeService`
- Excerpt (first non-empty lines):

```text
   1: export type Theme = "light" | "dark" | "system";
   2: export type ThemeColors = Record<string, string>;
   4: export const lightTheme: ThemeColors = {
   5:   background: "#ffffff",
   6:   surface: "#f8f9fa",
   7:   surfaceDark: "#e9ecef",
   8:   text: "#212529",
   9:   textSecondary: "#6c757d",
```

### 1128. `frontend/src/services/toastService.ts`
- Bytes: `482`
- Lines: `14`
- SHA256: `11a221a4dfb29fb104ebc887dd52287c3419b8c9728e59d7864737eaff59cad6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `showToast`
  - `showSuccessToast`
  - `showErrorToast`
  - `showInfoToast`
- Excerpt (first non-empty lines):

```text
   1: // Toast service for notifications
   2: export const showToast = (
   3:   message: string,
   4:   type: "success" | "error" | "info" = "info",
   5: ) => {
   6:   // Implementation would use a toast library
   7:   console.log(`[${type.toUpperCase()}] ${message}`);
   8: };
```

### 1129. `frontend/src/services/utils/autoErrorFinder.ts`
- Bytes: `9530`
- Lines: `359`
- SHA256: `11446a61c66f1bf4965e375578f21034399119df4c932ebd48ef9e2da3cea448`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AutoErrorFinder`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Auto Error Finder Service (Frontend)
   3:  * Automatically detects errors, broken functions, and runtime issues
   4:  */
   6: export interface CodeIssue {
   7:   file_path: string;
   8:   line_number: number;
   9:   issue_type:
```

### 1130. `frontend/src/services/utils/autoRecovery.ts`
- Bytes: `2331`
- Lines: `107`
- SHA256: `06fc595bca40f1d7ec9521640e9f2573489b1fc88bc39f5be4db620b208b4552`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AutoRecovery`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Auto Recovery Service (Frontend)
   3:  * Integrates with AutoErrorFinder for comprehensive error recovery
   4:  */
   6: import { AutoErrorFinder, RecoveryStats } from "./autoErrorFinder";
   7: import { ErrorHandler } from "./errorHandler";
   9: export class AutoRecovery {
  10:   /**
```

### 1131. `frontend/src/services/utils/errorHandler.ts`
- Bytes: `8519`
- Lines: `303`
- SHA256: `7259278c077e3b7e2aca2bf6d1a0880b031e3187d4a474df1dbcaaf4ab95b29e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ErrorHandler`
  - `NetworkMonitor`
  - `RetryHandler`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Centralized Error Handling Service
   3:  * Provides professional error handling for the entire application
   4:  */
   6: import { Alert } from "react-native";
   8: export interface ApiError {
   9:   message: string;
  10:   detail?: string;
```

### 1132. `frontend/src/services/utils/errorRecovery.ts`
- Bytes: `7811`
- Lines: `324`
- SHA256: `443fdafa3eb05771caebd5532c6333ecba67ee8aac7634af60c307c71d40514d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ErrorReporter`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Error Recovery Service
   3:  * Handles error recovery, retry strategies, and error reporting
   4:  *
   5:  * NOTE: Retry logic has been consolidated to utils/retry.ts
   6:  * This file now re-exports the standardized retry function for backward compatibility
   7:  */
   9: import { Alert } from "react-native";
```

### 1133. `frontend/src/services/utils/haptics.ts`
- Bytes: `1324`
- Lines: `53`
- SHA256: `59be1fecee92b205833a1d8f39d002a9c9f7184217ec85cbd9717faeff68082d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `canHaptic`
- Excerpt (first non-empty lines):

```text
   1: import * as Haptics from "expo-haptics";
   2: import { Platform } from "react-native";
   3: import { flags } from "../../constants/flags";
   5: const canHaptic = () => flags.enableHaptics && Platform.OS !== "web";
   7: export const haptics = {
   8:   success: async () => {
   9:     if (!canHaptic()) return;
  10:     try {
```

### 1134. `frontend/src/services/utils/index.ts`
- Bytes: `330`
- Lines: `11`
- SHA256: `614861964e8c69c80c4abccb11d1ef1760004e44e5bc7e0f0289145418a18c49`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: export * from "./autoErrorFinder";
   2: export * from "./autoRecovery";
   3: export * from "./errorHandler";
   4: export * from "./errorRecovery";
   5: export * from "./haptics";
   6: export * from "./notificationService";
   7: export * from "./queryClient";
   8: export * from "./themeService";
```

### 1135. `frontend/src/services/utils/notificationService.ts`
- Bytes: `4978`
- Lines: `211`
- SHA256: `8491d1fa6acda4ddb36f88de5026b578a2175b8a08f31629922364c6a5e2aea3`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `NotificationService`
  - `triggerValue`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Notification Service - User notifications and alerts
   3:  * Handles in-app notifications, badges, and alerts
   4:  */
   6: import { Platform } from "react-native";
   7: import Notifications, {
   8:   NotificationTriggerInput,
   9:   SchedulableTriggerInputTypes,
```

### 1136. `frontend/src/services/utils/queryClient.ts`
- Bytes: `719`
- Lines: `27`
- SHA256: `f96bb0a71b6d5d20a40af63d55f6598c410dd795658f386cdfa9eed9624e1929`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import { QueryClient } from "@tanstack/react-query";
   2: import {
   3:   API_MAX_RETRIES,
   4:   API_RETRY_BACKOFF_MS,
   5:   QUERY_CACHE_TIME_MS,
   6:   QUERY_STALE_TIME_MS,
   7: } from "../../constants/config";
   9: export const queryClient = new QueryClient({
```

### 1137. `frontend/src/services/utils/themeService.ts`
- Bytes: `6873`
- Lines: `284`
- SHA256: `fcc20e78fb464ccc15900a24dd7f0fc1f8a15f94ec5e8c8cad023ae35d2eb521`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ThemeService`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Theme Service - Theme management and customization
   3:  * Handles light/dark mode, colors, fonts, and styling
   4:  */
   6: import AsyncStorage from "@react-native-async-storage/async-storage";
   8: export interface ThemeColors {
   9:   // Primary colors
  10:   primary: string;
```

### 1138. `frontend/src/services/utils/toastService.ts`
- Bytes: `2772`
- Lines: `119`
- SHA256: `73321fed7964e473e0f9bd8b5dd4de6684c6c075764b915fc2a8f6b3864f5df3`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ToastEventHandler`
  - `ToastService`
  - `useToast`
  - `showToast`
  - `showSuccess`
  - `showError`
  - `showWarning`
  - `showInfo`
- Excerpt (first non-empty lines):

```text
   1: export interface ToastOptions {
   2:   duration?: "short" | "long";
   3:   position?: "top" | "bottom" | "center";
   4:   type?: "success" | "error" | "info" | "warning";
   5: }
   7: export interface ToastData {
   8:   id?: string;
   9:   message: string;
```

### 1139. `frontend/src/services/utils/validationService.ts`
- Bytes: `6969`
- Lines: `302`
- SHA256: `9f2f932aa7995bf652732e14cb5c8c02d9995a8806dd279f00e05ecd3ff0dfa7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ValidationService`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Validation Service - Data validation and sanitization
   3:  * Handles input validation, data sanitization, and validation rules
   4:  *
   5:  * @deprecated Use utils/validation.ts instead for barcode validation.
   6:  * This service is kept for backward compatibility but should not be used for new code.
   7:  * For barcode validation, use validateBarcode() and normalizeBarcode() from utils/validation.ts
   8:  */
```

### 1140. `frontend/src/services/versionService.ts`
- Bytes: `1961`
- Lines: `78`
- SHA256: `51a86beda44f9a3f0ec42bd3a95bbaf93b3ddf5b7074a9481962bf7bd056f1ee`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `checkVersion`
  - `getBackendVersion`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Version Check Service
   3:  * Provides app version checking and upgrade notification functionality
   4:  */
   5: import api from "./httpClient";
   7: export interface VersionCheckResult {
   8:   is_compatible: boolean;
   9:   is_latest: boolean;
```

### 1141. `frontend/src/services/voiceControlService.ts`
- Bytes: `3979`
- Lines: `157`
- SHA256: `8e8286e82bcbfe3cfdb663901ad83308c003bca796ef487dd6cfa91d2d8d93bd`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `VoiceControlService`
  - `speakText`
  - `parseVoiceCommand`
  - `initializeVoiceControl`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Voice Control Service
   3:  * Enables hands-free operation through voice commands
   4:  * Uses Expo Speech for recognition and feedback
   5:  */
   7: import { Platform } from "react-native";
   8: import * as Speech from "expo-speech";
  10: export type VoiceCommand =
```

### 1142. `frontend/src/services/websocket.ts`
- Bytes: `6381`
- Lines: `227`
- SHA256: `ab119059dde9d126fd513daee7ba708e69fb01ca104bc209b0079855ca1d47a0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `MessageHandler`
  - `WebSocketMessage`
  - `WebSocketService`
- Excerpt (first non-empty lines):

```text
   1: import { authService } from "./auth";
   3: type MessageHandler = (data: any) => void;
   5: interface WebSocketMessage {
   6:   type: string;
   7:   payload: any;
   8: }
  10: /**
  11:  * WebSocket service for real-time communication with the backend.
```

### 1143. `frontend/src/services/wifiConnectionService.ts`
- Bytes: `6864`
- Lines: `266`
- SHA256: `41db7a6bbfe26e59fb80f0ab0411f75a55f7386aa882e653780c7ccfecd87e94`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `WiFiConnectionService`
  - `useWiFiStatus`
  - `useWiFiStatusIndicator`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * WiFi Connection Monitoring Service
   3:  * Tracks WiFi status and notifies on disconnection
   4:  */
   6: import { useState, useEffect } from "react";
   7: import NetInfo, {
   8:   useNetInfo,
   9:   NetInfoChangeHandler,
```

### 1144. `frontend/src/store/__tests__/authStore.loadStoredAuthRace.test.ts`
- Bytes: `2779`
- Lines: `101`
- SHA256: `f1961130b9042312b5ee3dfdf56636c9be3a5bc19e96c607e86c7c2a5c880d00`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: const deferred = <T>() => {
   2:   let resolve!: (value: T) => void;
   3:   const promise = new Promise<T>((res) => {
   4:     resolve = res;
   5:   });
   6:   return { promise, resolve };
   7: };
   9: describe("authStore.loadStoredAuth race protection", () => {
```

### 1145. `frontend/src/store/authStore.ts`
- Bytes: `17140`
- Lines: `589`
- SHA256: `ede43a6523a61dd35320ea8f42958353cb30e1066b6c9eee3cfe743153bc298a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `User`
  - `AuthResult`
  - `parseAuthError`
- Excerpt (first non-empty lines):

```text
   1: import { create } from "zustand";
   2: import { secureStorage } from "../services/storage/secureStorage";
   3: import apiClient from "../services/httpClient";
   4: import { useSettingsStore } from "./settingsStore";
   5: import { setUnauthorizedHandler } from "../services/authUnauthorizedHandler";
   6: import { createLogger } from "../services/logging";
   7: import { useNetworkStore } from "./networkStore";
   8: import * as LocalAuthentication from "expo-local-authentication";
```

### 1146. `frontend/src/store/filterStore.ts`
- Bytes: `8339`
- Lines: `315`
- SHA256: `690b0c2554e43293ed58d2df3c61abd3e8a174aebd98518ef9703e837e03263f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `useFilters`
  - `useActiveFilterCount`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Filter Store - Zustand state management for filters
   3:  *
   4:  * Provides centralized filter state management with:
   5:  * - Persistent filter state across screens
   6:  * - Filter presets/saved filters
   7:  * - History of applied filters
   8:  *
```

### 1147. `frontend/src/store/index.ts`
- Bytes: `193`
- Lines: `7`
- SHA256: `6341bb38aa868fd3b1e65ec91121989415840f921e27a960e44b0aa628a209d9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: export * from "./authStore";
   2: export * from "./networkStore";
   3: export * from "./settingsStore";
   4: export * from "./scanSessionStore";
   5: export * from "./offlineStore";
   6: export * from "./filterStore";
```

### 1148. `frontend/src/store/networkStore.ts`
- Bytes: `919`
- Lines: `26`
- SHA256: `687b3c09b3c031b4b77e867b28713c4d2c9de78106d960a30a6c924e0c8b48f8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `NetworkState`
- Excerpt (first non-empty lines):

```text
   1: import { create } from "zustand";
   3: interface NetworkState {
   4:   isOnline: boolean;
   5:   connectionType: string;
   6:   isInternetReachable: boolean | null;
   7:   isRestrictedMode: boolean; // True if connected but blocked by LAN policy
   8:   setIsOnline: (isOnline: boolean) => void;
   9:   setConnectionType: (type: string) => void;
```

### 1149. `frontend/src/store/notificationStore.ts`
- Bytes: `4096`
- Lines: `139`
- SHA256: `3f7c1f2cb56660c1ca0c41c233333f1fad80f53da83f02b8a0bd0a4eb328a805`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `NotificationState`
  - `startNotificationPolling`
  - `stopNotificationPolling`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Notification Store - Manages user notifications and unread count
   3:  * Supports FR-M-23: Recount notifications
   4:  */
   5: import { create } from "zustand";
   6: import { persist, createJSONStorage } from "zustand/middleware";
   7: import {
   8:   getNotifications,
```

### 1150. `frontend/src/store/offlineStore.ts`
- Bytes: `977`
- Lines: `33`
- SHA256: `1d88ff91214fb5c1fd8252e4a73b5a7ff179307c8fc71066da920bb4882469e5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `OfflineState`
- Excerpt (first non-empty lines):

```text
   1: import { create } from "zustand";
   3: export interface SyncItem {
   4:   id: string;
   5:   operation: string;
   6:   payload: Record<string, unknown>;
   7:   timestamp: number;
   8: }
  10: interface OfflineState {
```

### 1151. `frontend/src/store/scanSessionStore.ts`
- Bytes: `2356`
- Lines: `79`
- SHA256: `6cf902f5ba63f577a0b08a404ca123a3de1ed3c0c5218ddefc0fc4b491672a17`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ScanSessionState`
- Excerpt (first non-empty lines):

```text
   1: import { create } from "zustand";
   2: import { createJSONStorage, persist } from "zustand/middleware";
   3: import AsyncStorage from "@react-native-async-storage/async-storage";
   5: interface ScanSessionState {
   6:   // Session Context
   7:   currentFloor: string | null;
   8:   currentRack: string | null; // Manual input for rack/shelf identifier
   9:   isSectionActive: boolean;
```

### 1152. `frontend/src/store/settingsStore.ts`
- Bytes: `6440`
- Lines: `229`
- SHA256: `b139cf3552bedcc07106671fc8c2330e61d80e1942e3ee8dc991e539b96bdd7c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SettingsState`
- Excerpt (first non-empty lines):

```text
   1: import { create } from "zustand";
   2: import { mmkvStorage } from "../services/mmkvStorage";
   3: import { ThemeService, Theme } from "../services/themeService";
   4: import { authApi, UserSettings } from "../services/api/authApi";
   5: import { createLogger } from "../services/logging";
   7: const log = createLogger("settingsStore");
   9: export interface Settings {
  10:   // Theme
```

### 1153. `frontend/src/styles/README.md`
- Bytes: `1488`
- Lines: `73`
- SHA256: `be8f15676debb3f878c152ec6ef81e33488a28102be9ca89fb4394c7cf8b25f4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Styles Directory
   3: This directory contains global styles and design tokens for the Stock Verification app.
   5: ## Files
   7: ### `globalStyles.ts`
   9: Global design system including:
  11: - **Color palette**: Consistent colors across the app
  12: - **Typography**: Font sizes and weights
  13: - **Spacing**: Standardized margins and padding
```

### 1154. `frontend/src/styles/globalStyles.ts`
- Bytes: `9960`
- Lines: `421`
- SHA256: `d7111e2d9e075f9283e26143632a73d2b62da4466db930b77767e8ed59058e9f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `defaultTheme`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Global Styles - Shared styles and design tokens
   3:  * Use these constants for consistent styling across the app
   4:  * Enhanced with dual-theme support and semantic color system
   5:  */
   7: import { StyleSheet, Platform } from "react-native";
   8: import { themes } from "../theme/themes";
  10: const defaultTheme = (themes.premium ||
```

### 1155. `frontend/src/styles/modernDesignSystem.ts`
- Bytes: `22196`
- Lines: `1029`
- SHA256: `0b8db1cff84500060c7fbf65aa92b0d5510d8220b772be8efdcd931949310eee`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Modern Design System - Enhanced UI/UX Upgrade v4.0
   3:  * Unified Design System (formerly Aurora + Modern)
   4:  *
   5:  * Features:
   6:  * - Professional Sapphire Blue primary with Emerald accents
   7:  * - Refined typography scale for better readability
   8:  * - Optimized spacing system for modern mobile layouts
```

### 1156. `frontend/src/styles/scanStyles.ts`
- Bytes: `36752`
- Lines: `1857`
- SHA256: `aa38d403c464e2da4fcadc145015b138bb5960df77b5d18a08bfbe344c6684d5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import { StyleSheet, Platform } from "react-native";
   3: export const styles = StyleSheet.create({
   4:   container: {
   5:     flex: 1,
   6:     backgroundColor: "#0F172A",
   7:   },
   8:   header: {
   9:     flexDirection: "row",
```

### 1157. `frontend/src/styles/screenStyles.ts`
- Bytes: `15042`
- Lines: `581`
- SHA256: `58ae67387f64a0c3f2e1f562821b92a4ab680230f86f4ab420b7a5d6e00f438c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `useScreenLayout`
  - `useScreenStyles`
  - `useThemeScreenStyles`
  - `useResponsiveHelpers`
  - `itemWidth`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Shared Screen Styles - Unified Layout System v2.0 (Responsive)
   3:  *
   4:  * Provides consistent styling patterns across all screens.
   5:  * Import these hooks in your screens for uniformity.
   6:  *
   7:  * Usage:
   8:  * import { useScreenStyles, useThemeScreenStyles } from '@/styles/screenStyles';
```

### 1158. `frontend/src/styles/screens/StaffHome.styles.ts`
- Bytes: `5557`
- Lines: `249`
- SHA256: `e2f813cd9919f604d730a7101bdabd7e8eefc092d2669afd2537b540f2b42f12`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import { StyleSheet } from "react-native";
   2: import {
   3:   borderRadius,
   4:   spacing,
   5:   typography,
   6:   colors,
   7: } from "../../styles/globalStyles";
   9: export const staffHomeStyles = StyleSheet.create({
```

### 1159. `frontend/src/styles/sharedStyles.ts`
- Bytes: `11116`
- Lines: `525`
- SHA256: `0ad5906a12abffb38de571ec1225e82b7c94207b21aea64ddfd2a5bcbae17166`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `createCardStyle`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Shared Style Constants for Uniformity Across All Pages
   3:  *
   4:  * Use these constants to maintain consistent spacing, sizing, and styling
   5:  * throughout the application.
   6:  */
   8: import { Platform, StyleSheet } from "react-native";
  10: // ============================================
```

### 1160. `frontend/src/theme/THEME_AUDIT.md`
- Bytes: `6521`
- Lines: `158`
- SHA256: `e2782ab134dfa599d131ed6cf42fa29eb754ed4aae9141e3841ee6f76b1b650b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Theme System Audit Report
   3: **Generated**: 2025-01-22
   4: **Task**: T001 - Audit existing theme files and document current state
   6: ---
   8: ## 1. Current Theme Files Inventory
  10: ### 1.1 Legacy Theme Files (DEPRECATED)
  12: | File                | Lines | Status        | Purpose                                        |
  13: | ------------------- | ----- | ------------- | ---------------------------------------------- |
```

### 1161. `frontend/src/theme/auroraTheme.ts`
- Bytes: `9706`
- Lines: `488`
- SHA256: `1acb7633a21cf7f160df85f6e208335db464abc2c8604d9c215b5a43ac72b6a8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Aurora Theme - Enhanced Design System v2.0
   3:  *
   4:  * Features:
   5:  * - Aurora gradient backgrounds (Blue-Cyan blend)
   6:  * - Glassmorphism effects with backdrop blur
   7:  * - Modern color palette from Kombai API
   8:  * - Professional typography (Manrope + Source Sans 3)
```

### 1162. `frontend/src/theme/designSystem.ts`
- Bytes: `3061`
- Lines: `173`
- SHA256: `99885b22ea15ecc700ebc370e69b1fb836b1eb80117dc823969b113f041d3447`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: // Design System for Premium Theme
   2: export const PremiumTheme = {
   3:   // Colors
   4:   colors: {
   5:     primary: "#007bff",
   6:     secondary: "#6c757d",
   7:     accent: "#28a745",
   8:     warning: "#ffc107",
```

### 1163. `frontend/src/theme/designTokens.ts`
- Bytes: `7062`
- Lines: `323`
- SHA256: `3c1195030ace4c6996bf5658599e2465eb91c1e4ebdfb0fa9c93714fc950a60a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Design Tokens System
   3:  * Comprehensive design tokens for consistent styling across the app
   4:  * Based on Material Design 3 and modern design system best practices
   5:  */
   7: // ==========================================
   8: // COLOR PALETTE - Semantic Colors with Shades
   9: // ==========================================
```

### 1164. `frontend/src/theme/enhancedColors.ts`
- Bytes: `6509`
- Lines: `235`
- SHA256: `0d9497a70b84812bd2967153fd759282c6dcc8f3d95ba47be57d24b9fcd2ec5e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `getContrastRatio`
  - `getLuminance`
  - `meetsWCAGAA`
  - `meetsWCAGAAA`
  - `generateSemanticColors`
  - `getColor`
  - `adjustBrightness`
  - `adjustOpacity`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Enhanced Color System
   3:  * WCAG AA/AAA compliant color system with semantic tokens
   4:  * Based on Material Design 3 color system
   5:  */
   7: import { lightTheme, darkTheme, ThemeColors } from "../services/themeService";
   9: // ==========================================
  10: // SEMANTIC COLOR TOKENS
```

### 1165. `frontend/src/theme/index.ts`
- Bytes: `1749`
- Lines: `86`
- SHA256: `fcd26cc12eecc9d7213733cf9118e092b080930c4d481ac2233bc628cc2009d3`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Theme System Index
   3:  * Central export for all theme-related modules
   4:  */
   6: // ==========================================
   7: // UNIFIED THEME SYSTEM (NEW - Recommended)
   8: // ==========================================
   9: // Import from unified for new development - selective exports to avoid conflicts
```

### 1166. `frontend/src/theme/modernDesign.ts`
- Bytes: `5221`
- Lines: `279`
- SHA256: `9d6f599634e86470c091c14dea21d188dde4193135077b095881aa0ced4e023e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Modern Design System for Lavanya Mart Stock Verify App
   3:  * Production-ready design tokens following modern UI/UX principles
   4:  */
   6: export const modernBranding = {
   7:   name: "Lavanya Mart",
   8:   tagline: "Stock Verification System",
   9:   colors: {
```

### 1167. `frontend/src/theme/themes.ts`
- Bytes: `18986`
- Lines: `770`
- SHA256: `a787f33beb2878e07d1cd1fc1469cb3798262f07b27718517afd4e68cc9be05f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Enhanced Theme System v3.0 - Aurora Pro
   3:  * Modern color schemes with improved contrast and visual appeal
   4:  * Includes vibrant gradients and glassmorphism support
   5:  */
   7: import {
   8:   modernLayout,
   9:   modernColors,
```

### 1168. `frontend/src/theme/typography.ts`
- Bytes: `6080`
- Lines: `217`
- SHA256: `ca68f265c8d1ac87f7afed43bbe386ee197f39ee620447025a8c8f1bf5ea04a7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `createTextStyles`
  - `getFontSize`
  - `getFontWeight`
  - `getLineHeight`
  - `getLetterSpacing`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Typography System
   3:  * Comprehensive typography styles and text components
   4:  * Based on Material Design 3 typography scale
   5:  */
   7: import { TextStyle } from "react-native";
   8: import { typography } from "./designTokens";
  10: // ==========================================
```

### 1169. `frontend/src/theme/uiConstants.ts`
- Bytes: `8126`
- Lines: `316`
- SHA256: `af36584fbb4333b9a43e7a228b83de40b4b1f2f1d1923af35311bba30f285021`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * UI Constants - Design System Constants
   3:  *
   4:  * Centralized design tokens inspired by:
   5:  * - CIS-Team/UI-UX-Roadmap-2024 (visual hierarchy, color theory, typography)
   6:  * - react-native-design-kit (component patterns)
   7:  * - React-Native-UI-Templates (animation timings)
   8:  *
```

### 1170. `frontend/src/theme/uiStandard.ts`
- Bytes: `3965`
- Lines: `211`
- SHA256: `49aca48868bdcf94d234a65ff07f8e646bf1e69916fa7dc102bc9e8777494e49`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * UI Standardization Constants
   3:  *
   4:  * Provides consistent styling values across all components.
   5:  * Use these values to ensure visual consistency throughout the app.
   6:  *
   7:  * Based on Material Design 3 guidelines and iOS HIG for accessibility.
   8:  */
```

### 1171. `frontend/src/theme/unified/MIGRATION_EXAMPLES.tsx`
- Bytes: `8870`
- Lines: `359`
- SHA256: `c9b1cf579676258a3b6fee2d32b02e3b478ffd08bb38dbff6b399724e2b48f4d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ListItemProps`
  - `StatsData`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Unified Design System - Migration Guide & Examples
   3:  *
   4:  * This file demonstrates the new patterns and how to migrate from old code.
   5:  *
   6:  * Key Benefits:
   7:  * - Single source of truth for all design tokens
   8:  * - Type-safe theme values
```

### 1172. `frontend/src/theme/unified/README.md`
- Bytes: `7938`
- Lines: `367`
- SHA256: `772e7af7a87011e2af6ec6af1140e9dab60993730155123bd89c676063056561`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `MyComponent`
- Excerpt (first non-empty lines):

```text
   1: # Unified Design Token System
   3: ## Overview
   5: This directory contains the unified design token system for the Stock Verification app. All visual constants—colors, spacing, typography, shadows, and animations—are defined here as TypeScript tokens.
   7: ## Quick Start
   9: ```typescript
  10: import {
  11:   colors,
  12:   semanticColors,
```

### 1173. `frontend/src/theme/unified/animations.ts`
- Bytes: `4005`
- Lines: `176`
- SHA256: `02a3b3ba66765e61814d38f3cadb3463a9681dfa8d87aa70d6b982f4ace74940`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Unified Animation System
   3:  * Consistent animation timings and easing curves
   4:  *
   5:  * Patterns inspired by Aashu-Dubey/React-Native-UI-Templates
   6:  * - Entry animations with staggered delays
   7:  * - Press scale feedback
   8:  * - Smooth transitions
```

### 1174. `frontend/src/theme/unified/colors.ts`
- Bytes: `5804`
- Lines: `225`
- SHA256: `f9c0bc890135ad3f2c17adf2a73978eb4d293eb465fffefe2bd7fd280b400a1d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Unified Color System
   3:  * Single source of truth for all colors in the app
   4:  *
   5:  * Migration: Replace hardcoded colors with these tokens
   6:  * Example: '#0EA5E9' → colors.primary[400]
   7:  */
   9: // ==========================================
```

### 1175. `frontend/src/theme/unified/index.ts`
- Bytes: `2283`
- Lines: `124`
- SHA256: `2aba53e574de7deab0f01b56cead5158f57b8dbb3b4413fb80928dadc45b71e5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Unified Theme System - Main Export
   3:  * Single import for all design tokens and utilities
   4:  *
   5:  * Usage:
   6:  * import { colors, spacing, radius, textStyles, shadows, duration } from '@/theme/unified';
   7:  */
   9: // Internal imports for unified theme object
```

### 1176. `frontend/src/theme/unified/radius.ts`
- Bytes: `1465`
- Lines: `58`
- SHA256: `931d815910b8284d16798057a95ac5c5ba6698d1248c7c7cbf78b845faffa879`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Unified Border Radius System
   3:  * Consistent corner rounding across all components
   4:  *
   5:  * Usage: radius.md → 12
   6:  * Migration: Replace borderRadius: 14 → radius.md
   7:  */
   9: // ==========================================
```

### 1177. `frontend/src/theme/unified/shadows.ts`
- Bytes: `5027`
- Lines: `200`
- SHA256: `fdb11eec706dbd6770753144696b944a22a252910ae4456ce897b337a02bf7f0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Unified Shadow System
   3:  * Consistent elevation and depth across components
   4:  *
   5:  * Uses both React Native shadows and Android elevation
   6:  */
   8: import { Platform, ViewStyle } from "react-native";
   9: import { colors } from "./colors";
```

### 1178. `frontend/src/theme/unified/spacing.ts`
- Bytes: `2288`
- Lines: `87`
- SHA256: `eaf2646d24c7d1c6fea0cc45422e79fa747deb3e7537a413b2c5e1a55387f856`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Unified Spacing System
   3:  * 4px base unit for consistent spacing throughout the app
   4:  *
   5:  * Usage: spacing.md → 16
   6:  * Usage in styles: { padding: spacing.md }
   7:  */
   9: // ==========================================
```

### 1179. `frontend/src/theme/unified/typography.ts`
- Bytes: `5826`
- Lines: `241`
- SHA256: `e9f7750f64aa8213fe483f42217d5a0181c0af063ce3c1924b6547bd119073e8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Unified Typography System
   3:  * Consistent text styling with custom font support
   4:  *
   5:  * Inspired by WorkSans patterns from Aashu-Dubey repo
   6:  * but using system fonts until custom fonts are configured
   7:  */
   9: import { Platform, TextStyle } from "react-native";
```

### 1180. `frontend/src/types/api.ts`
- Bytes: `1125`
- Lines: `64`
- SHA256: `72c14443d0b50497ddad0945366ced1eca4ba0b4919a0efd7d32f7ff1ac621ec`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * API Type Definitions
   3:  * Standardized types for API requests and responses
   4:  */
   6: /**
   7:  * Standard API response wrapper
   8:  */
   9: export interface ApiResponse<T> {
```

### 1181. `frontend/src/types/enrichment.ts`
- Bytes: `4288`
- Lines: `222`
- SHA256: `8c05dc42c9d101931605d70846c1b02b8a38d72092c398a88c02a1ee43143a21`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Item Enrichment Types
   3:  * TypeScript definitions for data enrichment features
   4:  */
   6: /**
   7:  * Enrichment data fields that can be added/corrected by staff
   8:  */
   9: export interface EnrichmentData {
```

### 1182. `frontend/src/types/expo-modules.d.ts`
- Bytes: `5676`
- Lines: `213`
- SHA256: `0d29b810198d8378d0f4476bcf08f8e3ff3cc56256d5c17b92268895254c3179`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `preventAutoHideAsync`
  - `hideAsync`
  - `impactAsync`
  - `notificationAsync`
  - `selectionAsync`
  - `Manifest`
  - `Constants`
  - `getBrightnessAsync`
  - `setBrightnessAsync`
  - `getSystemBrightnessAsync`
  - `setSystemBrightnessAsync`
  - `useSystemBrightnessAsync`
  - `isUsingSystemBrightnessAsync`
  - `getSystemBrightnessModeAsync`
  - `setSystemBrightnessModeAsync`
- Excerpt (first non-empty lines):

```text
   1: // Type declarations for Expo modules without bundled types
   3: declare module "expo-splash-screen" {
   4:   export function preventAutoHideAsync(): Promise<boolean>;
   5:   export function hideAsync(): Promise<boolean>;
   6: }
   8: declare module "expo-haptics" {
   9:   export enum ImpactFeedbackStyle {
  10:     Light = "light",
```

### 1183. `frontend/src/types/export.ts`
- Bytes: `1570`
- Lines: `91`
- SHA256: `fc702c8cde6fae90181c7a3013a84e5775f2b71bdc0dc38036166e1754f0632c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Export Type Definitions
   3:  * Types for data export functionality
   4:  */
   6: /**
   7:  * Export Format
   8:  */
   9: export type ExportFormat = "CSV" | "XLSX" | "JSON" | "PDF";
```

### 1184. `frontend/src/types/index.ts`
- Bytes: `319`
- Lines: `12`
- SHA256: `0d6b470087cfb8eac1f277c108f736fd9379a0b234f3141148c1ecba1f28a08d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: // Re-export scan types (primary)
   2: export * from "./scan";
   4: // Re-export item types (renamed to avoid conflicts)
   5: export { Item as ItemDetails, SearchResult as ItemSearchResult } from "./item";
   7: // API and user types
   8: export * from "./api";
   9: export * from "./user";
  10: export * from "./enrichment";
```

### 1185. `frontend/src/types/item.ts`
- Bytes: `1702`
- Lines: `88`
- SHA256: `485c25b81ded41096d6a4ae13fbe3236d6877906a6bf245637426ee3aa53da66`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Re-export Item from scan.ts as the canonical source
   3:  * This maintains backward compatibility while eliminating duplicate definitions
   4:  */
   5: export { Item } from "./scan";
   7: /**
   8:  * MRP Variant - different MRP values for the same item
   9:  * Extended version with more fields than scan.ts NormalizedMrpVariant
```

### 1186. `frontend/src/types/react-native-unistyles.d.ts`
- Bytes: `307`
- Lines: `9`
- SHA256: `35f86a76e5cf1a4880cfae004884e92665a841a81100e95cd8971dd96ee83f17`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: // Temporary module declaration so TypeScript does not error before dependency installation.
   2: declare module "react-native-unistyles" {
   3:   export const UnistylesProvider: React.ComponentType<any>;
   4:   export const UnistylesRuntime: {
   5:     getThemeName: () => string;
   6:     setTheme: (name: string) => void;
   7:   };
   8: }
```

### 1187. `frontend/src/types/reactotron-react-native.d.ts`
- Bytes: `99`
- Lines: `5`
- SHA256: `9080eb4cd99095e2b30a974da97331f3dc8cafd424ce21781985684327749e24`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: declare module "reactotron-react-native" {
   2:   const Reactotron: any;
   3:   export default Reactotron;
   4: }
```

### 1188. `frontend/src/types/scan.ts`
- Bytes: `5374`
- Lines: `223`
- SHA256: `fa8a950a9b8030d5e66c6dae7e9848003f904e8301c3e48b2120467d82a81ea2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Item - Canonical item interface for the entire application
   3:  * All components should import Item from this file or @/types/item (which re-exports this)
   4:  */
   5: export interface Item {
   6:   id: string;
   7:   name: string;
   8:   item_code: string;
```

### 1189. `frontend/src/types/schemas.ts`
- Bytes: `1774`
- Lines: `71`
- SHA256: `0e426aaf6546c3d0611e3f9cd5ec4439afcb0cc375aa40f91443c4c78cd34a15`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import { z } from "zod";
   3: /**
   4:  * Standard API Response Schema
   5:  */
   6: export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
   7:   z.object({
   8:     success: z.boolean(),
   9:     data: dataSchema.optional(),
```

### 1190. `frontend/src/types/session.ts`
- Bytes: `1627`
- Lines: `80`
- SHA256: `99fdee4827a7d60ba3602954df1aa8dcb4d7da356ccd64f569c0a60d6d7deb75`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Session Type Definitions
   3:  */
   5: export type SessionType = "STANDARD" | "BLIND" | "STRICT";
   7: export type SessionStatus =
   8:   | "OPEN"
   9:   | "ACTIVE"
  10:   | "CLOSED"
```

### 1191. `frontend/src/types/storage.ts`
- Bytes: `1153`
- Lines: `63`
- SHA256: `9534c4fc7445cfce1ff4bc136e5d1ef47d103c317e657e48d7bc758690d32e7a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Storage Type Definitions
   3:  * Types for offline storage and caching
   4:  */
   6: /**
   7:  * Storage Options
   8:  */
   9: export interface StorageOptions {
```

### 1192. `frontend/src/types/sync.ts`
- Bytes: `1136`
- Lines: `55`
- SHA256: `1a2e7a400d54f40870110e2b0222d0f09d1d2b383ee1227a940e5e5d5a7b7f85`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Sync Type Definitions
   3:  * Matches backend SyncRecord model
   4:  */
   6: export interface SyncRecord {
   7:   client_record_id: string;
   8:   session_id: string;
   9:   rack_id?: string | null;
```

### 1193. `frontend/src/types/unistyles.d.ts`
- Bytes: `221`
- Lines: `11`
- SHA256: `27b659307fb40c77e2c8a44b5fb50e6a54c462ea64ad8849ed1ea5fba8a2dcb0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import { AppTheme } from "@/theme/themes";
   3: declare module "react-native-unistyles" {
   4:   export interface UnistylesThemes {
   5:     light: AppTheme;
   6:     dark: AppTheme;
   7:     premium: AppTheme;
   8:     highContrast: AppTheme;
   9:   }
```

### 1194. `frontend/src/types/user.ts`
- Bytes: `386`
- Lines: `19`
- SHA256: `284636d65496d3c9c6a1fa86b8635ee3bdca0dfbffbb5d551d8bea5f859d0103`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: export interface User {
   2:   id: string;
   3:   username: string;
   4:   full_name: string;
   5:   role: "staff" | "supervisor" | "admin";
   6:   email?: string;
   7:   is_active: boolean;
   8:   permissions: string[];
```

### 1195. `frontend/src/utils/__tests__/itemBatchUtils.test.ts`
- Bytes: `1271`
- Lines: `42`
- SHA256: `61037d5adc2bfb2311821a72ac4a6d3fae9301286aa2501e1df27fc99fbad0b5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import {
   2:   dedupeItemsKeepingHighestStock,
   3:   getStockQty,
   4:   sortItemsByStockDesc,
   5: } from "../itemBatchUtils";
   7: describe("itemBatchUtils", () => {
   8:   it("returns stock from stock_qty or current_stock", () => {
   9:     expect(getStockQty({ stock_qty: 12 })).toBe(12);
```

### 1196. `frontend/src/utils/__tests__/scanUtils.serialFormat.test.ts`
- Bytes: `1068`
- Lines: `31`
- SHA256: `d69d9c5e65341679f698a52f23e777c9f3c0ef07fa0508fee0d30e2911b71f0e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import {
   2:   isSerialNumberFormat,
   3:   validateScannedSerial,
   4: } from "../scanUtils";
   6: describe("scanUtils serial format", () => {
   7:   it("accepts valid alphanumeric serial values", () => {
   8:     expect(isSerialNumberFormat("SN-AB12-34")).toBe(true);
   9:     expect(validateScannedSerial("SN-AB12-34", []).valid).toBe(true);
```

### 1197. `frontend/src/utils/__tests__/validation.test.ts`
- Bytes: `3309`
- Lines: `121`
- SHA256: `a95252694c81317881194444f2974e983a59322cce08d06b154dfbed4ca5eeb0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Validation Utilities Tests
   3:  * Tests for input validation functions
   4:  */
   6: import { describe, it, expect } from "@jest/globals";
   7: import { validateBarcode } from "../validation";
   9: describe("Barcode Validation", () => {
  10:   describe("Valid Barcodes", () => {
```

### 1198. `frontend/src/utils/algorithms.ts`
- Bytes: `3125`
- Lines: `120`
- SHA256: `da79191ac7e0da25a5e36d425ac1a58574031b611f0fabac732ee0d24680cb1f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `levenshteinDistance`
  - `longestCommonSubsequence`
  - `hammingDistance`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Algorithms Utility
   3:  * Implementations of standard algorithms for string matching and more.
   4:  * Inspired by TheAlgorithms/TypeScript repository.
   5:  */
   7: /**
   8:  * Calculates the Levenshtein distance between two strings.
   9:  * The Levenshtein distance is a string metric for measuring the difference between two sequences.
```

### 1199. `frontend/src/utils/backendUrl.ts`
- Bytes: `98`
- Lines: `6`
- SHA256: `7659adf4ff53b0a4e75cae69e64f50ea7ea359a95eca1ffcdcec07f6cfd56afb`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: export {
   2:   BACKEND_URL,
   3:   getBackendURL,
   4:   initializeBackendURL,
   5: } from "../services/backendUrl";
```

### 1200. `frontend/src/utils/clipboard.ts`
- Bytes: `1111`
- Lines: `48`
- SHA256: `23c3230de14f391435fee575509e7e9e78fc94e04fa757fdcdc0ce46e03bd70f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `copyToClipboard`
  - `getFromClipboard`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Clipboard Utilities
   3:  * Provides copy to clipboard functionality
   4:  */
   6: import * as Clipboard from "expo-clipboard";
   7: import { Platform } from "react-native";
   9: /**
  10:  * Copy text to clipboard
```

### 1201. `frontend/src/utils/csvExport.ts`
- Bytes: `3401`
- Lines: `130`
- SHA256: `5c16d2d6afeadffc74451582e55fd8ec31adfb33fee48f9bbd1512e2b49766fa`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `downloadCSV`
  - `convertToCSV`
  - `exportItemsToCSV`
  - `exportVariancesToCSV`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * CSV Export Utility
   3:  * Helper functions for exporting data to CSV
   4:  */
   6: export const downloadCSV = (csvContent: string, filename: string) => {
   7:   // For web
   8:   if (typeof window !== "undefined") {
   9:     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
```

### 1202. `frontend/src/utils/deviceInfo.ts`
- Bytes: `487`
- Lines: `15`
- SHA256: `757a6dcf06020b8fb9fac92464ff05c0b49f09a0870f9d1695bd82823ab7d365`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import { Dimensions, Platform } from "react-native";
   2: import Constants from "expo-constants";
   4: export const { width: windowWidth, height: windowHeight } =
   5:   Dimensions.get("window");
   6: export const { version, ios, android } = Constants?.expoConfig ?? {};
   8: export const isIos = Platform.OS === "ios";
   9: export const isAndroid = Platform.OS === "android";
  11: export const isWeb = Platform.OS === "web";
```

### 1203. `frontend/src/utils/errorHandler.ts`
- Bytes: `2702`
- Lines: `105`
- SHA256: `82846b51ced0f192905296fbe2c2a424172494c42be8f4e7b2366e3603046e7f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `getErrorMessage`
  - `getErrorCode`
  - `isRecoverableError`
  - `getUserFriendlyMessage`
  - `formatErrorForLogging`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Error Handler Utilities
   3:  * Centralized error handling to prevent crashes
   4:  */
   6: export interface AppError {
   7:   message: string;
   8:   code?: string;
   9:   recoverable?: boolean;
```

### 1204. `frontend/src/utils/errors.ts`
- Bytes: `6253`
- Lines: `256`
- SHA256: `aa1889e4b176c899dd479817a0362f1ddc85fb07d8afe9bcfc2681392fb6be57`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `AppError`
  - `isAppError`
  - `getUserMessage`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Domain Error Types for Stock Verification System
   3:  * Provides structured error handling with codes, severity levels, and user-friendly messages.
   4:  */
   6: /**
   7:  * Error severity levels for categorizing error handling behavior
   8:  */
   9: export type ErrorSeverity =
```

### 1205. `frontend/src/utils/eventEmitter.ts`
- Bytes: `1397`
- Lines: `67`
- SHA256: `ba7e9b17b5a138a1008a877e51a8e6bf7b0d44dcc041da1eb48d8096e31d6344`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `Callback`
  - `EventEmitter`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Simple Event Emitter for cross-service communication
   3:  */
   5: type Callback = (...args: any[]) => void;
   7: export class EventEmitter {
   8:   private events: Map<string, Callback[]> = new Map();
  10:   /**
  11:    * Subscribe to an event
```

### 1206. `frontend/src/utils/feedback.ts`
- Bytes: `1864`
- Lines: `88`
- SHA256: `a7249fa1871c639abec188a5682239cee644c2f9b367ac9e3e782df9e292a48c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `FeedbackOptions`
  - `showFeedback`
  - `createFeedbackManager`
  - `formatFeedback`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Feedback Utility Functions
   3:  * Provides reusable feedback mechanisms for user interactions
   4:  */
   6: export type FeedbackType = "success" | "error" | "info" | "warning";
   8: interface FeedbackOptions {
   9:   duration?: number;
  10:   type?: FeedbackType;
```

### 1207. `frontend/src/utils/haptics.ts`
- Bytes: `1778`
- Lines: `83`
- SHA256: `44faaa457c94ea77396e9843268757a9fc2ecb33bd86b98967887bd119d3a6de`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `hapticSuccess`
  - `hapticWarning`
  - `hapticError`
  - `hapticSelection`
  - `hapticLight`
  - `hapticMedium`
  - `hapticHeavy`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Haptic Feedback Utility
   3:  * Centralizes haptic feedback to avoid code duplication and ensure consistent behavior
   4:  */
   5: import { Platform } from "react-native";
   6: import * as Haptics from "expo-haptics";
   8: // Check if haptics are supported (native platforms only)
   9: const isHapticsSupported = Platform.OS !== "web";
```

### 1208. `frontend/src/utils/index.ts`
- Bytes: `172`
- Lines: `7`
- SHA256: `936fa5a89c111dc0b01cc882b13ee7dbae36fce159f201aedc30ef3934bdcc31`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: export * from "./scanUtils";
   2: export * from "./validation";
   3: export * from "./errorHandler";
   4: export * from "./backendUrl";
   5: export * from "./search";
   6: export * from "./retry";
```

### 1209. `frontend/src/utils/itemBatchUtils.ts`
- Bytes: `2367`
- Lines: `100`
- SHA256: `adeef67da87cf0a2f4533ab5c94e86f00f496be2548f3fca52759eb70583a906`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ItemWithStock`
  - `toNumber`
  - `toKeyText`
  - `compareText`
  - `itemFamilyKey`
  - `compareByStockThenIdentity`
  - `getStockQty`
- Excerpt (first non-empty lines):

```text
   1: type ItemWithStock = {
   2:   stock_qty?: unknown;
   3:   current_stock?: unknown;
   4:   batch_no?: unknown;
   5:   item_code?: unknown;
   6:   item_name?: unknown;
   7:   name?: unknown;
   8:   barcode?: unknown;
```

### 1210. `frontend/src/utils/network.ts`
- Bytes: `3841`
- Lines: `135`
- SHA256: `b1d6b0a421771ab034d6c3d26f3ea01d9d22e13601d49cf4e23c90070812e5a0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `getNetworkStatus`
  - `isDefinitelyOnline`
  - `shouldAttemptApiCall`
  - `isDefinitelyOffline`
  - `isNetworkUnknown`
  - `isOnline`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Network State Detection Utilities
   3:  *
   4:  * Provides three-state network model for reliable offline-first logic.
   5:  * Addresses the issue where unknown network state defaults to online.
   6:  */
   8: import { useNetworkStore } from "../store/networkStore";
  10: /**
```

### 1211. `frontend/src/utils/portDetection.ts`
- Bytes: `4955`
- Lines: `191`
- SHA256: `cd89c2b763bc5e32829732e797003c4032ab723ea647988be411d854bd9114c6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `detectFrontendPort`
  - `getFrontendPortSync`
  - `clearPortCache`
  - `getFrontendURL`
  - `getFrontendURLSync`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Dynamic Port Detection Utility
   3:  * Automatically detects which port the frontend is running on
   4:  * Supports Expo Metro bundler (8081) and Expo Web (19006, 19000-19002)
   5:  */
   7: import { Platform } from "react-native";
   8: import Constants from "expo-constants";
  10: // Common Expo ports
```

### 1212. `frontend/src/utils/retry.ts`
- Bytes: `1091`
- Lines: `42`
- SHA256: `c377ab39191f5ed1d06468616002fa39006adc6499e9d28fd4204c463aa8c1d7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `RetryOptions`
- Excerpt (first non-empty lines):

```text
   1: import { API_MAX_RETRIES, API_RETRY_BACKOFF_MS } from "../constants/config";
   3: interface RetryOptions {
   4:   retries?: number;
   5:   backoffMs?: number;
   6:   shouldRetry?: (error: Error) => boolean;
   7: }
   9: export const retryWithBackoff = async <T>(
  10:   operation: () => Promise<T>,
```

### 1213. `frontend/src/utils/roleNavigation.ts`
- Bytes: `895`
- Lines: `31`
- SHA256: `d44dd3e847adb5cc913cac91a3b9fc15277b7c4c9a6f56221d415141ae62cf3e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `getRouteForRole`
  - `isRouteAllowedForRole`
- Excerpt (first non-empty lines):

```text
   1: import { Platform } from "react-native";
   3: export type UserRole = "staff" | "supervisor" | "admin";
   5: export const getRouteForRole = (role: UserRole): string => {
   6:   switch (role) {
   7:     case "supervisor":
   8:       return "/supervisor/dashboard";
   9:     case "admin":
  10:       // Prefer the web dashboard on web; keep metrics as the default elsewhere
```

### 1214. `frontend/src/utils/safeRender.tsx`
- Bytes: `1593`
- Lines: `73`
- SHA256: `3df0d3b7d5ed77a56e1eccbd03d4e166b4c22528eb31d8e27a56145ff4a7e866`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `safeRender`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Safe Render Utilities
   3:  * Helper functions to prevent crashes during rendering
   4:  */
   6: import React, { ReactNode } from "react";
   7: import { ErrorBoundary } from "@/components/ErrorBoundary";
   9: /**
  10:  * Safely render a component with error boundary
```

### 1215. `frontend/src/utils/scanUtils.ts`
- Bytes: `7956`
- Lines: `287`
- SHA256: `7ea9d6a670b258119ee94996caa0c05de86857eeeee20ad7bff93632b597cb32`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `normalizeSerialValue`
  - `validateSerialNumber`
  - `validateSerialNumbers`
  - `isSerialNumberFormat`
  - `validateScannedSerial`
  - `toNumericMrp`
  - `formatMrpValue`
  - `normalizeMrpVariant`
  - `getNormalizedMrpVariants`
  - `register`
  - `getDefaultMrpForItem`
- Excerpt (first non-empty lines):

```text
   1: import { Item, NormalizedMrpVariant } from "../types/scan";
   3: export const normalizeSerialValue = (input: string) =>
   4:   input ? input.trim().toUpperCase() : "";
   6: /**
   7:  * Validate serial number format
   8:  * Allows alphanumeric characters and hyphens
   9:  * Returns error message if invalid, null if valid
  10:  */
```

### 1216. `frontend/src/utils/search.ts`
- Bytes: `4336`
- Lines: `186`
- SHA256: `3d162f15dd68ef9a9807185a038e840a8a18d9026d6873511d1071085593c78b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `fuzzyMatch`
  - `SearchableItem`
  - `SearchResult`
  - `highlightMatches`
  - `extractNumber`
- Excerpt (first non-empty lines):

```text
   1: import { levenshteinDistance } from "./algorithms";
   3: /**
   4:  * Search Utility Functions
   5:  * Provides fuzzy search and filtering capabilities
   6:  */
   8: /**
   9:  * Simple fuzzy match scoring
  10:  * @param pattern - Search pattern
```

### 1217. `frontend/src/utils/testSpritePort.ts`
- Bytes: `909`
- Lines: `43`
- SHA256: `8e621640b9fcd4bbcb99a3a5f54a356818942e140fdbc3f9e5631c783005eec4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `getTestSpritePort`
  - `getTestSpriteURL`
  - `getPortInfo`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * TestSprite Port Detection for Frontend
   3:  * Provides port information for TestSprite and other testing tools
   4:  */
   6: import { Platform } from "react-native";
   7: import { getFrontendPortSync, getFrontendURLSync } from "./portDetection";
   9: /**
  10:  * Get port for TestSprite testing
```

### 1218. `frontend/src/utils/uuid.ts`
- Bytes: `1750`
- Lines: `64`
- SHA256: `fd353d9ad6b9c1aa675edaac49e0c3bdda94aae46b9dd324d4b81ffa0b57e903`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `generateUUID`
  - `r`
  - `generateShortId`
  - `generateOfflineId`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * UUID Generator Utility
   3:  *
   4:  * Provides UUID v4 generation for unique identifiers.
   5:  * Uses crypto API when available, falls back to Math.random.
   6:  */
   8: /**
   9:  * Generate a UUID v4 string.
```

### 1219. `frontend/src/utils/validation.ts`
- Bytes: `4407`
- Lines: `166`
- SHA256: `62c6056277cadf6cad8b0efc0718da4c3b7a3d867263dee89f839ec2c3dee94d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `sanitizeBarcode`
  - `sanitizeText`
  - `validateQuantity`
  - `validateSessionName`
  - `normalizeBarcode`
  - `validateBarcode`
  - `validateMRP`
- Excerpt (first non-empty lines):

```text
   1: export interface ValidationResult<T = unknown> {
   2:   valid: boolean;
   3:   value?: T;
   4:   error?: string;
   5: }
   7: /**
   8:  * Minimum and maximum barcode length constants
   9:  */
```

### 1220. `frontend/test-results/.last-run.json`
- Bytes: `96`
- Lines: `6`
- SHA256: `6c29709e0abc08a59b8b5286a2ad3a2770910e0689d7dbbf5b513f50548c7a65`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "status": "failed",
   3:   "failedTests": [
   4:     "5e59759b0e82c0b9dd7e-09cc5c231699d5736100"
   5:   ]
   6: }
```

### 1221. `frontend/test-results/misplaced-item-Misplaced-I-44234-scanning-item-in-wrong-rack-Desktop-Chrome/error-context.md`
- Bytes: `170`
- Lines: `8`
- SHA256: `6437fd82b8c109e8bbbf04a653da4053f43f3fa10abfc4f56c0a19720dd362ee`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Page snapshot
   3: ```yaml
   4: - generic [ref=e9]:
   5:   - generic [ref=e10]: This screen doesn't exist.
   6:   - link "Go to home screen!" [ref=e11] [cursor=pointer]:
   7:     - /url: /
   8: ```
```

### 1222. `frontend/test_config.js`
- Bytes: `107`
- Lines: `3`
- SHA256: `fa7f685e994b71c663d514c0c2492bf5621916f993cfd9842532a1e7bd29a958`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: const config = require("./app.config.js");
   2: console.log("Backend URL in config:", config.extra.backendUrl);
```

### 1223. `frontend/tests/services/scanDeduplicationService.test.ts`
- Bytes: `1911`
- Lines: `67`
- SHA256: `fbeacdec8f43d650e7ad2a97708e63e65c29b4ebc7c2dd74cae3dd7dffa18316`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: // Verified import
   2: import { ScanDeduplicationService } from "@/services/scanDeduplicationService";
   4: describe("ScanDeduplicationService", () => {
   5:   let service: ScanDeduplicationService;
   7:   beforeEach(() => {
   8:     service = new ScanDeduplicationService();
   9:   });
  11:   describe("checkDuplicate", () => {
```

### 1224. `frontend/testsprite_tests/tmp/code_summary.json`
- Bytes: `6222`
- Lines: `181`
- SHA256: `03f4634d1a0e70b1d8eadb852efcf16c3ff3e492cc841a096d45639c4887dcf3`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "tech_stack": [
   3:     "TypeScript",
   4:     "React Native + Expo (expo-router, expo start web)",
   5:     "TanStack React Query",
   6:     "Zustand",
   7:     "Axios",
   8:     "Jest (jest-expo) + Testing Library",
```

### 1225. `frontend/testsprite_tests/tmp/config.json`
- Bytes: `116`
- Lines: `7`
- SHA256: `d18cd082a122a228477a2ad44d9a36327d04fee948d3fa0de273eef9d99c2d72`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "status": "commited",
   3:   "type": "frontend",
   4:   "scope": "codebase",
   5:   "localEndpoint": "http://localhost:8081"
   6: }
```

### 1226. `frontend/testsprite_tests/tmp/prd_files/README.md`
- Bytes: `9173`
- Lines: `377`
- SHA256: `56bfd7ce2a55800cf59152de400060140c5b5f6c9c0b4dd3239797e943022a86`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Implementation Plans Index
   3: **Project**: Stock Verification System
   4: **Date**: 2026-01-19
   5: **Status**: Planning Phase
   7: ---
   9: ## Overview
  11: This directory contains detailed implementation plans for closing the gaps identified in the Requirements Gap Analysis. Plans are organized by priority (P0, P1, P2) and include:
  13: - Technical design
```

### 1227. `frontend/tsconfig.json`
- Bytes: `1127`
- Lines: `58`
- SHA256: `8dccecaba952bb1cc44dfe77d7988ac08cc42bf31847f1cb9bee7ced9ffee7b9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "$schema": "https://json.schemastore.org/tsconfig",
   3:   "display": "Expo",
   4:   "compilerOptions": {
   5:     "allowJs": true,
   6:     "esModuleInterop": true,
   7:     "jsx": "react-native",
   8:     "lib": [
```

### 1228. `frontend/typescript-plugin-filter-text-errors.js`
- Bytes: `1196`
- Lines: `44`
- SHA256: `1d51d6adf596e909144127ae9578827cdd879305230a807c9e5f721e23a874a4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `init`
  - `create`
- Excerpt (first non-empty lines):

```text
   1: /**
   2:  * Custom TypeScript Language Service Plugin
   3:  * Filters out false positive "Text string must be rendered within <Text/>" errors
   4:  */
   6: function init(modules) {
   7:   // eslint-disable-next-line no-unused-vars
   8:   const _ts = modules.typescript;
  10:   function create(info) {
```

## ios

### 1229. `ios/.gitignore`
- Bytes: `321`
- Lines: `31`
- SHA256: `f8042134be9ad24176d8d630255be93f8a0223925ae88c34b603c8989baa8345`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # OSX
   2: #
   3: .DS_Store
   5: # Xcode
   6: #
   7: build/
   8: *.pbxuser
   9: !default.pbxuser
```

### 1230. `ios/Podfile`
- Bytes: `2449`
- Lines: `61`
- SHA256: `0b13195eaff34b0ee1f960e01e0cac6803fe72f6e67833eac4a5e8a0d02b7104`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: require File.join(File.dirname(`node --print "require.resolve('expo/package.json')"`), "scripts/autolinking")
   2: require File.join(File.dirname(`node --print "require.resolve('react-native/package.json')"`), "scripts/react_native_pods")
   4: require 'json'
   5: podfile_properties = JSON.parse(File.read(File.join(__dir__, 'Podfile.properties.json'))) rescue {}
   7: def ccache_enabled?(podfile_properties)
   8:   # Environment variable takes precedence
   9:   return ENV['USE_CCACHE'] == '1' if ENV['USE_CCACHE']
  11:   # Fall back to Podfile properties
```

### 1231. `ios/Podfile.properties.json`
- Bytes: `77`
- Lines: `5`
- SHA256: `4222d802ab80961762b71603a713160c16c0fa3ce5d6c74a111c67785872331a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "expo.jsEngine": "hermes",
   3:   "EX_DEV_CLIENT_NETWORK_INSPECTOR": "true"
   4: }
```

### 1232. `ios/STOCKVERIFY2dbmaped.xcodeproj/project.pbxproj`
- Bytes: `24189`
- Lines: `541`
- SHA256: `45861674997d8c14ca765a94e0255c3fd8fe950f4c20fef9042009e9f3e9c194`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: // !$*UTF8*$!
   2: {
   3:     archiveVersion = 1;
   4:     classes = {
   5:     };
   6:     objectVersion = 54;
   7:     objects = {
   9: /* Begin PBXBuildFile section */
```

### 1233. `ios/STOCKVERIFY2dbmaped.xcodeproj/xcshareddata/xcschemes/STOCKVERIFY2dbmaped.xcscheme`
- Bytes: `3414`
- Lines: `89`
- SHA256: `68507afeddc924ab9a3dcd3b27c2990cc9d93bf806ef4d22e2bbae5fbaac9698`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <?xml version="1.0" encoding="UTF-8"?>
   2: <Scheme
   3:    LastUpgradeVersion = "1130"
   4:    version = "1.3">
   5:    <BuildAction
   6:       parallelizeBuildables = "YES"
   7:       buildImplicitDependencies = "YES">
   8:       <BuildActionEntries>
```

### 1234. `ios/STOCKVERIFY2dbmaped.xcworkspace/contents.xcworkspacedata`
- Bytes: `237`
- Lines: `11`
- SHA256: `e9b3daa8a79b7909bf5a44dac03f43d9abefeb0d0beb61f9464fab0cef8dcd21`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <?xml version="1.0" encoding="UTF-8"?>
   2: <Workspace
   3:    version = "1.0">
   4:    <FileRef
   5:       location = "group:STOCKVERIFY2dbmaped.xcodeproj">
   6:    </FileRef>
   7:    <FileRef
   8:       location = "group:Pods/Pods.xcodeproj">
```

### 1235. `ios/STOCKVERIFY2dbmaped/AppDelegate.swift`
- Bytes: `2275`
- Lines: `71`
- SHA256: `614cbb9b09ac561c762a384c658d3c2a0cd28b30cc29b6e72cb25def9783e3d5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ReactNativeDelegate`
- Excerpt (first non-empty lines):

```text
   1: import Expo
   2: import React
   3: import ReactAppDependencyProvider
   5: @UIApplicationMain
   6: public class AppDelegate: ExpoAppDelegate {
   7:   var window: UIWindow?
   9:   var reactNativeDelegate: ExpoReactNativeFactoryDelegate?
  10:   var reactNativeFactory: RCTReactNativeFactory?
```

### 1236. `ios/STOCKVERIFY2dbmaped/Images.xcassets/AppIcon.appiconset/Contents.json`
- Bytes: `216`
- Lines: `15`
- SHA256: `4100413dfb07091d4a40a9bf5775a295d2521939292cc9c9806e2d2016d92899`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "images": [
   3:     {
   4:       "filename": "App-Icon-1024x1024@1x.png",
   5:       "idiom": "universal",
   6:       "platform": "ios",
   7:       "size": "1024x1024"
   8:     }
```

### 1237. `ios/STOCKVERIFY2dbmaped/Images.xcassets/Contents.json`
- Bytes: `62`
- Lines: `7`
- SHA256: `632a1481b9e3b957f3b34267728744d61272e3db32751432551b9eb7c58ad7a2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "info" : {
   3:     "version" : 1,
   4:     "author" : "expo"
   5:   }
   6: }
```

### 1238. `ios/STOCKVERIFY2dbmaped/Images.xcassets/SplashScreenBackground.colorset/Contents.json`
- Bytes: `349`
- Lines: `21`
- SHA256: `a73a1dbfd0330be97c93c8dd3d6b89919839ac095e01e72dda6324352a94de8f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "colors": [
   3:     {
   4:       "color": {
   5:         "components": {
   6:           "alpha": "1.000",
   7:           "blue": "1.00000000000000",
   8:           "green": "1.00000000000000",
```

### 1239. `ios/STOCKVERIFY2dbmaped/Info.plist`
- Bytes: `2398`
- Lines: `77`
- SHA256: `590a893cf52fbda14ad236202ec28a958216621b4ba4f5e3a812311d78161caa`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <?xml version="1.0" encoding="UTF-8"?>
   2: <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   3: <plist version="1.0">
   4:   <dict>
   5:     <key>CADisableMinimumFrameDurationOnPhone</key>
   6:     <true/>
   7:     <key>CFBundleDevelopmentRegion</key>
   8:     <string>$(DEVELOPMENT_LANGUAGE)</string>
```

### 1240. `ios/STOCKVERIFY2dbmaped/PrivacyInfo.xcprivacy`
- Bytes: `1283`
- Lines: `49`
- SHA256: `e4465baecfb4d203727fdc87011d0076d1d397345da3c96359b823376df3a0c2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <?xml version="1.0" encoding="UTF-8"?>
   2: <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   3: <plist version="1.0">
   4: <dict>
   5:     <key>NSPrivacyAccessedAPITypes</key>
   6:     <array>
   7:         <dict>
   8:             <key>NSPrivacyAccessedAPIType</key>
```

### 1241. `ios/STOCKVERIFY2dbmaped/STOCKVERIFY2dbmaped-Bridging-Header.h`
- Bytes: `102`
- Lines: `4`
- SHA256: `4a625b53abd4333ca454a4161ba62ab1b0cb44e8a4581326c0bcfe03dc26dd5c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: //
   2: // Use this file to import your target's public headers that you would like to expose to Swift.
   3: //
```

### 1242. `ios/STOCKVERIFY2dbmaped/STOCKVERIFY2dbmaped.entitlements`
- Bytes: `183`
- Lines: `6`
- SHA256: `11967a4990edd569f10d01076a3ef52f8c593765ce6389dfa215c109efec2644`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <?xml version="1.0" encoding="UTF-8"?>
   2: <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   3: <plist version="1.0">
   4:   <dict/>
   5: </plist>
```

### 1243. `ios/STOCKVERIFY2dbmaped/SplashScreen.storyboard`
- Bytes: `2760`
- Lines: `40`
- SHA256: `4d9e0668fbdb1083b322b136ebb60dc72555c6109df8d0a14c189284f1312996`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <?xml version="1.0" encoding="UTF-8"?>
   2: <document type="com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB" version="3.0" toolsVersion="24093.7" targetRuntime="iOS.CocoaTouch" propertyAccessControl="none" useAutolayout="YES" launchScreen="YES" useTraitCo...
   3:     <device id="retina6_12" orientation="portrait" appearance="light"/>
   4:     <dependencies>
   5:         <deployment identifier="iOS"/>
   6:         <plugIn identifier="com.apple.InterfaceBuilder.IBCocoaTouchPlugin" version="24053.1"/>
   7:         <capability name="Named colors" minToolsVersion="9.0"/>
   8:         <capability name="Safe area layout guides" minToolsVersion="9.0"/>
```

### 1244. `ios/STOCKVERIFY2dbmaped/Supporting/Expo.plist`
- Bytes: `365`
- Lines: `13`
- SHA256: `8ef0cc00f4bbd30199174ce5aa1225979a8f1aeb2209ef7d524b0cd3cff0afa4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: <?xml version="1.0" encoding="UTF-8"?>
   2: <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   3: <plist version="1.0">
   4:   <dict>
   5:     <key>EXUpdatesCheckOnLaunch</key>
   6:     <string>ALWAYS</string>
   7:     <key>EXUpdatesEnabled</key>
   8:     <false/>
```

## k8s

### 1245. `k8s/configmap.yaml`
- Bytes: `579`
- Lines: `25`
- SHA256: `e2b9dca6282bae7a153f5efa2e85100dafe8addef7619d4b857dae65aaef5619`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: apiVersion: v1
   2: kind: ConfigMap
   3: metadata:
   4:   name: stock-verify-config
   5: data:
   6:   ENVIRONMENT: "production"
   7:   APP_NAME: "Stock Verify API"
   8:   APP_VERSION: "2.1.0"
```

### 1246. `k8s/deployment.yaml`
- Bytes: `3536`
- Lines: `137`
- SHA256: `22bb555b7813060aafa1c11eb688a95350e4e62fa32ebca75361c85aa91698b7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: apiVersion: apps/v1
   2: kind: Deployment
   3: metadata:
   4:   name: stock-verify-backend
   5:   labels:
   6:     app: stock-verify-backend
   7: spec:
   8:   replicas: 2
```

### 1247. `k8s/hpa.yaml`
- Bytes: `373`
- Lines: `19`
- SHA256: `cc3e4338bcb2c5bbaf34cd50bf0800a62cd9576c741181b41239b72fe25a6b7d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: apiVersion: autoscaling/v2
   2: kind: HorizontalPodAutoscaler
   3: metadata:
   4:   name: stock-verify-backend
   5: spec:
   6:   scaleTargetRef:
   7:     apiVersion: apps/v1
   8:     kind: Deployment
```

### 1248. `k8s/ingress.yaml`
- Bytes: `1073`
- Lines: `41`
- SHA256: `a20e09cf392b2099cfee7b5833f3c74528aee0563b1468c93998aa3fd1ac2539`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: apiVersion: networking.k8s.io/v1
   2: kind: Ingress
   3: metadata:
   4:   name: stock-verify-ingress
   5:   annotations:
   6:     nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
   7:     nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
   8:     nginx.ingress.kubernetes.io/proxy-body-size: "10m"
```

### 1249. `k8s/pdb.yaml`
- Bytes: `172`
- Lines: `10`
- SHA256: `209d89806ed9e428a460793008dd83ce740b3e7388b5f5bce99007f047707189`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: apiVersion: policy/v1
   2: kind: PodDisruptionBudget
   3: metadata:
   4:   name: stock-verify-backend
   5: spec:
   6:   minAvailable: 1
   7:   selector:
   8:     matchLabels:
```

### 1250. `k8s/secrets.example.yaml`
- Bytes: `358`
- Lines: `11`
- SHA256: `32e5cc4a8a15d44d1f7866f19627319e2aff63ab44040940e16da49925fad81e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: apiVersion: v1
   2: kind: Secret
   3: metadata:
   4:   name: backend-secrets
   5: type: Opaque
   6: stringData:
   7:   mongodb-url: "mongodb://stock_app:CHANGE_ME@mongo:27017/stock_verification?authSource=stock_verification"
   8:   jwt-secret: "CHANGE_ME_TO_A_LONG_RANDOM_SECRET"
```

### 1251. `k8s/service.yaml`
- Bytes: `442`
- Lines: `28`
- SHA256: `25fdcade0693ee9b2d76ca8ec2a6677cf23fc82f4aa29924e101fe86a19661e7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: apiVersion: v1
   2: kind: Service
   3: metadata:
   4:   name: stock-verify-backend
   5: spec:
   6:   selector:
   7:     app: stock-verify-backend
   8:   ports:
```

## monitoring

### 1252. `monitoring/grafana/dashboards/backend-overview.json`
- Bytes: `2808`
- Lines: `110`
- SHA256: `f6ada14f35c81984c018b63474e09db74fc8eda3e9ea2c855ce53935bbd7366f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:   "annotations": {
   3:     "list": [
   4:       {
   5:         "builtIn": 1,
   6:         "datasource": "-- Grafana --",
   7:         "enable": true,
   8:         "hide": true,
```

### 1253. `monitoring/grafana/dashboards/dashboards.yml`
- Bytes: `220`
- Lines: `12`
- SHA256: `f17e86abcc4bc7c89ff9704fa49dbaa85347846fd7f7030bb85d3475d6fc352d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: apiVersion: 1
   3: providers:
   4:   - name: "Stock Verify"
   5:     orgId: 1
   6:     folder: "Stock Verify"
   7:     type: file
   8:     disableDeletion: false
   9:     allowUiUpdates: true
```

### 1254. `monitoring/grafana/datasources/datasource.yml`
- Bytes: `140`
- Lines: `9`
- SHA256: `9899f6354c570a5f60b89fec5b76d0a7df4e2fb1ac38337321da3228f244dac6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: apiVersion: 1
   3: datasources:
   4:   - name: Prometheus
   5:     type: prometheus
   6:     access: proxy
   7:     url: http://prometheus:9090
   8:     isDefault: true
```

### 1255. `monitoring/prometheus.yml`
- Bytes: `184`
- Lines: `10`
- SHA256: `7592a2b2820937743502797a8b63966ba50b114132876c0bff496da8784d2697`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: global:
   2:   scrape_interval: 15s
   3:   evaluation_interval: 15s
   5: scrape_configs:
   6:   - job_name: "backend"
   7:     metrics_path: /api/metrics
   8:     static_configs:
   9:       - targets: ["backend:8001"]
```

## nginx

### 1256. `nginx/Dockerfile`
- Bytes: `546`
- Lines: `22`
- SHA256: `466620e68e529f6ac90f984f5b9cf9d758d70994ca160abee00cd80eede7816a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: FROM node:22-bookworm-slim AS frontend-build
   3: WORKDIR /app
   5: COPY frontend/package.json frontend/package-lock.json ./frontend/
   6: RUN npm --prefix frontend ci --legacy-peer-deps
   8: COPY frontend ./frontend
  10: ARG EXPO_PUBLIC_BACKEND_URL
  11: ARG EXPO_PUBLIC_API_TIMEOUT
  12: ENV EXPO_PUBLIC_BACKEND_URL=${EXPO_PUBLIC_BACKEND_URL}
```

### 1257. `nginx/nginx.conf`
- Bytes: `7155`
- Lines: `230`
- SHA256: `d2412f5e23367d2656eef814128c02062b88f6d638807281be10c1f378841914`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: user nginx;
   2: worker_processes auto;
   3: error_log /var/log/nginx/error.log warn;
   4: pid /var/run/nginx.pid;
   6: events {
   7:     worker_connections 4096;
   8:     use epoll;
   9:     multi_accept on;
```

## redis

### 1258. `redis/redis.prod.conf`
- Bytes: `286`
- Lines: `25`
- SHA256: `074c7b695c5645b22878ada4b95f84e91b97952f756a1bd3bd9ef17639755012`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: bind 0.0.0.0
   2: protected-mode yes
   3: port 6379
   4: tcp-backlog 511
   5: timeout 0
   6: tcp-keepalive 300
   7: daemonize no
   8: supervised no
```

## requirements

### 1259. `requirements/README.md`
- Bytes: `909`
- Lines: `30`
- SHA256: `e3a5f6fe2ab0e8dc9430e25ff5e3b630190948e1bb0b57628b2cbef1bbc7c520`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Enterprise Requirements Structure
   3: This directory contains deterministic, enterprise-locked requirements with pinned versions for reproducible builds.
   5: ## Installation
   7: Install runtime dependencies:
   8: ```bash
   9: pip install -r requirements/requirements.txt
  10: ```
  12: Install development dependencies:
```

### 1260. `requirements/ai.txt`
- Bytes: `65`
- Lines: `4`
- SHA256: `c962980ecd960e7c3865fc21cf3c56c1164d24290486269b635aeeb3882e4924`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: rapidfuzz==3.5.2
   2: sentence-transformers==2.2.2
   3: copilotkit==0.1.39
```

### 1261. `requirements/base.txt`
- Bytes: `775`
- Lines: `47`
- SHA256: `03b6f288b4e23efe2a24fe30a860b4a89250d2e8d46ace77e955343ac64c7285`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Web / Server
   2: fastapi==0.115.0
   3: uvicorn[standard]==0.34.0
   4: gunicorn==23.0.0
   5: python-dotenv==1.0.1
   7: # Data / Validation
   8: pydantic==2.12.5
   9: pydantic-settings==2.7.0
```

### 1262. `requirements/dev.txt`
- Bytes: `213`
- Lines: `16`
- SHA256: `42f7a1d4e684bd11b343752adfaa0b9ae4fb2d6d75f3f8d3d6055e6a71f53df2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Test
   2: pytest==8.3.4
   3: pytest-asyncio==0.24.0
   4: pytest-cov==7.0.0
   5: httpx==0.27.2
   7: # Lint / Format / Types
   8: black==24.10.0
   9: isort==5.13.2
```

### 1263. `requirements/observability.txt`
- Bytes: `285`
- Lines: `9`
- SHA256: `397fea337c3272d9b91de928118eb10ba1dfd7be9e1f638783c18c5ac6316ad4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: opentelemetry-api==1.25.0
   2: opentelemetry-sdk==1.25.0
   3: opentelemetry-exporter-otlp-proto-http==1.25.0
   5: opentelemetry-instrumentation-fastapi==0.46b0
   6: opentelemetry-instrumentation-requests==0.46b0
   7: opentelemetry-instrumentation-logging==0.46b0
   8: opentelemetry-instrumentation-pymongo==0.46b0
```

### 1264. `requirements/requirements.txt`
- Bytes: `90`
- Lines: `5`
- SHA256: `eca13a025a8f7e48a0ad521f7017d5870cfcd7ad7a7026520f471dfcfb84f2a0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Enterprise locked entrypoint (deterministic)
   2: -r base.txt
   3: -r ai.txt
   4: -r observability.txt
```

## scripts

### 1265. `scripts/Untitled-8.ipynb`
- Bytes: `843`
- Lines: `35`
- SHA256: `a4fa2bad174557e48cbd6c851154cd362748cb82c3f8b16c41d6ee325f6f6161`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:  "cells": [
   3:   {
   4:    "cell_type": "code",
   5:    "execution_count": null,
   6:    "id": "485f0432",
   7:    "metadata": {},
   8:    "outputs": [],
```

### 1266. `scripts/backup.sh`
- Bytes: `2369`
- Lines: `86`
- SHA256: `47bdfef0ec53d9a5cc1281be02a8ab0077206d57c0939334ff46cf8cc9d2ed53`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   3: # MongoDB Backup Script
   4: # Runs daily via cron
   6: set -e
   8: # Configuration
   9: MONGO_HOST="${MONGO_HOST:-localhost}"
  10: MONGO_PORT="${MONGO_PORT:-27017}"
  11: MONGO_USERNAME="${MONGO_USERNAME:-admin}"
```

### 1267. `scripts/backup_mongo.sh`
- Bytes: `779`
- Lines: `33`
- SHA256: `674a08098f97c32688c4c6eaab2e9d800df10e4998ac01136be4cf6830301525`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   3: set -euo pipefail
   5: ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
   6: ENV_FILE="${ROOT_DIR}/.env.prod"
   8: if [ -f "$ENV_FILE" ]; then
   9:   set -a
  10:   . "$ENV_FILE"
  11:   set +a
```

### 1268. `scripts/check_db_indexes.py`
- Bytes: `496`
- Lines: `17`
- SHA256: `8368fe990a63aa0845ecea59bc0ac1e47fac9632deedc556b1f75a1205e889a5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: from motor.motor_asyncio import AsyncIOMotorClient
   5: async def check_indexes():
   6:     client = AsyncIOMotorClient("mongodb://localhost:27017")
   7:     db = client.stock_verification
   8:     for coll_name in ["sessions", "verification_sessions", "erp_items"]:
   9:         print(f"\nIndexes for {coll_name}:")
  10:         indexes = await db[coll_name].list_indexes().to_list(100)
```

### 1269. `scripts/check_kit_items.py`
- Bytes: `762`
- Lines: `24`
- SHA256: `fe04daae08b284da8edf41ccc0394f6b49479ef3b34167976421f69ff24aefe7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: from motor.motor_asyncio import AsyncIOMotorClient
   5: async def check_kit_items():
   6:     client = AsyncIOMotorClient("mongodb://localhost:27017")
   7:     db = client.stock_verification
   8:     # Search for 'kit' in item_name, item_code, category
   9:     query = {
  10:         "$or": [
```

### 1270. `scripts/check_login_attempts.py`
- Bytes: `753`
- Lines: `27`
- SHA256: `62de045c1c7abc5c607c068d6443365619e545fa06c4039b44ff4756f90d64a5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import os
   3: import sys
   4: from pathlib import Path
   6: # Add project root to path
   7: sys.path.insert(0, str(Path(__file__).parent))
   9: from backend.config import settings
  10: from motor.motor_asyncio import AsyncIOMotorClient
```

### 1271. `scripts/check_mongo_state.py`
- Bytes: `559`
- Lines: `21`
- SHA256: `a7b8b3aa186bdd1a82f6e3e134f01d311a5753ec0f4c7b261bc084e41fa994ad`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: from motor.motor_asyncio import AsyncIOMotorClient
   4: async def check_indexes():
   5:     client = AsyncIOMotorClient('mongodb://localhost:27017')
   6:     db = client.stock_verify
   8:     print("Indexes for erp_items:")
   9:     indexes = await db.erp_items.index_information()
  10:     for name, info in indexes.items():
```

### 1272. `scripts/check_sessions.py`
- Bytes: `1473`
- Lines: `48`
- SHA256: `3d4b1a9d58013fedab657926ee0c62e3540899e638ad736e79f8bf87188d27fc`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import os
   3: import sys
   4: from pprint import pprint
   6: # Add project root to path
   7: sys.path.append(os.getcwd())
   9: from motor.motor_asyncio import AsyncIOMotorClient
  10: from backend.config import settings
```

### 1273. `scripts/check_system_health.py`
- Bytes: `1107`
- Lines: `38`
- SHA256: `ec22c6c1f2906b59a1da609ac65c0826703014c78489e30cb4aefca0ae69bd91`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import os
   4: from motor.motor_asyncio import AsyncIOMotorClient
   6: MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
   9: async def check_system():
  10:     client = AsyncIOMotorClient(MONGO_URL)
  11:     db = client.stock_verification
  13:     print("--- Checks for 'erp_items' Collection ---")
```

### 1274. `scripts/check_users.py`
- Bytes: `491`
- Lines: `20`
- SHA256: `9b246d0941a183b75487dc03a39ef50a73a25456c4b7b08400181850001b3a59`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import os
   4: from motor.motor_asyncio import AsyncIOMotorClient
   6: MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
   7: client = AsyncIOMotorClient(MONGO_URL)
   8: db = client.stock_verification
  11: async def list_users():
  12:     users = await db.users.find({}).to_list(length=100)
```

### 1275. `scripts/check_users_db.py`
- Bytes: `667`
- Lines: `26`
- SHA256: `39ca160c1a4e98938039822069e4bf280d39f626c69a6e1efb503adfdba94de4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import os
   3: import sys
   4: from pathlib import Path
   6: # Add project root to path
   7: sys.path.insert(0, str(Path(__file__).parent))
   9: from backend.config import settings
  10: from motor.motor_asyncio import AsyncIOMotorClient
```

### 1276. `scripts/clean_start_ios.sh`
- Bytes: `252`
- Lines: `12`
- SHA256: `c048ff9a0bce40cb13b18121d5c8206c52fe2a1a531fce5388ee284f3696219a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   2: echo "Cleaning Expo Cache..."
   3: rm -rf ~/.expo
   4: rm -rf frontend/node_modules/.cache
   5: rm -rf frontend/.expo
   6: echo "Resetting Simulator..."
   7: xcrun simctl shutdown all
   8: xcrun simctl erase all
   9: echo "Starting Frontend..."
```

### 1277. `scripts/cleanup_codebase.sh`
- Bytes: `4518`
- Lines: `132`
- SHA256: `d83fdfd3ac62ebd8f96da6573dbda1d225de711cbdf0e2d186a917a92598d41f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: # Codebase Cleanup Script
   3: # Safely removes backup, duplicate, and temporary files
   5: set -e
   7: PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
   8: cd "$PROJECT_ROOT"
  10: echo "🧹 Starting codebase cleanup..."
  11: echo "Project root: $PROJECT_ROOT"
```

### 1278. `scripts/clear_sessions.py`
- Bytes: `1070`
- Lines: `33`
- SHA256: `aebb4fe675ff3bf8febe7d182122455af670cea0382224ca22a5e18bfd5012d2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import os
   3: import sys
   4: from pathlib import Path
   6: # Add project root to sys.path
   7: sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
   9: from backend.db.runtime import lifespan_db
  10: from backend.config import settings
```

### 1279. `scripts/db_audit_dupes.py`
- Bytes: `3148`
- Lines: `97`
- SHA256: `ddde423fc251c86ede7c8012c4098afabe4b3d8e95cbc216967a85196a31cb11`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: """
   2: Database Duplication Audit Utility
   3: Identifies duplicate barcodes, item codes, and overlapping count lines in MongoDB.
   4: """
   6: import asyncio
   7: import os
   8: import sys
   9: from pathlib import Path
```

### 1280. `scripts/deduplicate_all.py`
- Bytes: `1212`
- Lines: `43`
- SHA256: `99b17a4fb9927be3983eef893377799fdf4c61de936ac95d899dbb1734be3b2e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import os
   4: from motor.motor_asyncio import AsyncIOMotorClient
   6: MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
   7: client = AsyncIOMotorClient(MONGO_URL)
   8: db = client.stock_verification
  11: async def analyze_duplicates():
  12:     print("Analyze and Fix All Duplicates in erp_items...")
```

### 1281. `scripts/deploy_manual.sh`
- Bytes: `2641`
- Lines: `98`
- SHA256: `8f5778f3a3bb51ebc1b89832715a55f8ecd7e71aa283be13c1ad693d16ebe202`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: set -e
   4: # Configuration
   5: SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
   6: PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
   7: MONGO_DATA_DIR="$PROJECT_ROOT/backend/data/db"
   8: LOG_DIR="$PROJECT_ROOT/logs"
   9: BACKEND_PORT=8001
```

### 1282. `scripts/detect-frontend-port.js`
- Bytes: `2067`
- Lines: `95`
- SHA256: `fc695064302951f69be81117236913f868a2fb7cd70be43c917f01b74bcfc2b5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `checkPort`
  - `detectPort`
  - `main`
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env node
   2: /**
   3:  * Frontend Port Detection Script
   4:  * Detects which port the frontend is running on and outputs it as JSON
   5:  * Used by TestSprite and other tools to dynamically find the frontend port
   6:  */
   8: const http = require('http');
   9: const { promisify } = require('util');
```

### 1283. `scripts/ensure_indexes.py`
- Bytes: `486`
- Lines: `22`
- SHA256: `634ebdc6e716f5195eb6a5dc4c6ed248cc7e33b4841b0a756e01f462b9e908fe`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: from motor.motor_asyncio import AsyncIOMotorClient
   3: import sys
   4: import os
   6: # Add the project root to sys.path
   7: sys.path.append(os.getcwd())
   9: from backend.db.indexes import create_indexes
  12: async def run():
```

### 1284. `scripts/final_system_validation.sh`
- Bytes: `18043`
- Lines: `533`
- SHA256: `4b27b53515efc2ab5b80c96fead06520bc23a93d09d0a803dd3458894852e293`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   3: # Stock Verification System - Final System Validation Script
   4: # This script performs comprehensive end-to-end testing to validate all components work together
   6: set -e  # Exit on any error
   7: chmod +x "$0" 2>/dev/null || true  # Ensure script is executable
   9: # Colors for output
  10: RED='\033[0;31m'
  11: GREEN='\033[0;32m'
```

### 1285. `scripts/find_missing_barcodes.py`
- Bytes: `11537`
- Lines: `291`
- SHA256: `418e3b2a5fb0227f38ff4bdb44af9f7ec929bb52a625e97cdec2e7b091edc4e6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `BarcodeAnalyzer`
  - `__init__`
  - `login`
  - `get_existing_barcodes`
  - `find_missing_ranges`
  - `generate_report`
  - `main`
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env python3
   2: """
   3: Find Missing Barcodes in Series 510001-529999
   5: This script analyzes the inventory database to identify missing barcodes
   6: in the specified range. It queries the ERP system via the API and generates
   7: a comprehensive report.
   9: Usage:
  10:     python scripts/find_missing_barcodes.py [--start 510001] [--end 529999] [--output missing_barcodes.txt]
```

### 1286. `scripts/fix_default_users_pin.py`
- Bytes: `1559`
- Lines: `53`
- SHA256: `5bdc833d57a4688cf70ab3591b25d71f69b2d58945023a325308d04a44be58f0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import os
   3: import sys
   4: import logging
   6: # Add project root to path
   7: sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
   9: # Configure logging
  10: logging.basicConfig(level=logging.INFO)
```

### 1287. `scripts/fix_duplicate_db.py`
- Bytes: `1200`
- Lines: `41`
- SHA256: `94f86be92ea5050427e0665b97e15f92b9803cf45fdd610ec422d6aba1e5056f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import os
   4: from motor.motor_asyncio import AsyncIOMotorClient
   6: MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
   7: client: AsyncIOMotorClient = AsyncIOMotorClient(MONGO_URL)
   8: db = client.stock_verification
  11: async def fix_duplicate_10003():
  12:     item_code = "10003"
```

### 1288. `scripts/fix_expo.sh`
- Bytes: `796`
- Lines: `25`
- SHA256: `97d0c100fc1c2899d99991f526e1b21349b6d400ff19ac1df7878be55891cf47`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: # Fix Expo Stuck Issue by restarting with Tunnel and clearing cache
   4: SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
   5: PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
   7: echo "🛑 Stopping existing Expo processes..."
   8: pkill -f "expo start" || true
  10: echo "🧹 Clearing Metro bundler cache..."
  11: rm -rf "$PROJECT_ROOT/frontend/.expo"
```

### 1289. `scripts/format_code.ps1`
- Bytes: `1286`
- Lines: `33`
- SHA256: `ccab0b6cf37a5bc1bdd4680537a9bbcb684e1797e973f5b82d77cdc506d6ca1c`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Format code using Black, isort, and Prettier
   3: Write-Host "🔧 Formatting code..." -ForegroundColor Cyan
   5: # Format Python code
   6: Write-Host "📝 Formatting Python code..." -ForegroundColor Yellow
   7: if (Get-Command black -ErrorAction SilentlyContinue) {
   8:     black backend/ --line-length 100
   9:     Write-Host "✅ Black formatting complete" -ForegroundColor Green
  10: } else {
```

### 1290. `scripts/format_code.sh`
- Bytes: `935`
- Lines: `36`
- SHA256: `3365ebad701e28d981fac2339640b68c6c0a93769780cc0eb78b7d9ff30f72df`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: # Format code using Black, isort, and Prettier
   4: set -e
   6: echo "🔧 Formatting code..."
   8: # Format Python code
   9: echo "📝 Formatting Python code..."
  10: if command -v black &> /dev/null; then
  11:     black backend/ --line-length 100
```

### 1291. `scripts/generate_ssl.sh`
- Bytes: `713`
- Lines: `22`
- SHA256: `4f72d7d326929aa255f76b0f22e191a5afa55b60b74ab5ca671d8ebc60da823d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   3: # Generate self-signed SSL certificates for local development
   4: # Usage: ./generate_ssl.sh
   6: SSL_DIR="nginx/ssl"
   7: mkdir -p $SSL_DIR
   9: echo "Generating self-signed SSL certificates in $SSL_DIR..."
  11: openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  12:     -keyout $SSL_DIR/privkey.pem \
```

### 1292. `scripts/generate_workspace_code_report.py`
- Bytes: `11668`
- Lines: `396`
- SHA256: `8d33d0308f93a677f386d602bb67e436afa05a190495c03c91d2a39f7595a61a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `FileRow`
  - `_should_ignore`
  - `_iter_files`
  - `_count_loc`
  - `_kind_for`
  - `_safe_read_text`
  - `_extract_fastapi_routes`
  - `_extract_frontend_exports`
  - `main`
  - `md_table`
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env python3
   2: """Generate a workspace-wide code inventory + readable report.
   4: This repo is large (backend + frontend + docs). A literal per-line narrative
   5: report is not practical, so this script:
   7: - Inventories relevant files (path, type, size, LOC)
   8: - Produces aggregate stats (by extension and top-level folder)
   9: - Extracts lightweight structural signals from key entrypoints
  10: - Writes:
```

### 1293. `scripts/get-frontend-port.sh`
- Bytes: `912`
- Lines: `32`
- SHA256: `71a3c18a7faaabf1eb6cd583ac7c4879a4a65c33ebb4e4ca817ae372a611914e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: # Dynamic Frontend Port Detection Script
   3: # Detects which port the frontend is running on
   4: # Returns port number or exits with error
   6: SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
   7: PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
   9: # Try to detect port using Node.js script
  10: if command -v node &> /dev/null; then
```

### 1294. `scripts/health_check_summary.py`
- Bytes: `2557`
- Lines: `85`
- SHA256: `94d6da5bb9d20f9f573760f59a00cb43c46bff843e11981b426db2b9fffca280`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `check_file_exists`
  - `check_env_vars`
  - `main`
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env python3
   2: """
   3: scripts/health_check_summary.py
   5: A lightweight script to aggregate health checks from various components
   6: and emit a summary, suitable for CI/CD pipelines or local validation.
   7: """
   9: import sys
  10: import os
```

### 1295. `scripts/init_letsencrypt.sh`
- Bytes: `1469`
- Lines: `48`
- SHA256: `9548303aaf000a044423a50d377c6d6c7d3eaacfa6545a7922511a28a8163959`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   3: set -euo pipefail
   5: ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
   6: ENV_FILE="${ROOT_DIR}/.env.prod"
   8: if [ -f "$ENV_FILE" ]; then
   9:   set -a
  10:   . "$ENV_FILE"
  11:   set +a
```

### 1296. `scripts/launch_dev_terminals.ps1`
- Bytes: `1250`
- Lines: `33`
- SHA256: `71bfc47f8ea6b84941a19580925b382308a0e9e240eb541466e74dc3e4a76146`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Launch Backend and Frontend in Separate Developer Terminals
   2: # PowerShell Script
   4: $ErrorActionPreference = "Continue"
   6: $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
   7: $ProjectRoot = (Get-Item $ScriptDir).Parent.FullName
   9: Write-Host "🚀 Launching Developer Terminals..." -ForegroundColor Cyan
  11: # 1. Start Backend
  12: Write-Host "   Starting Backend Terminal..." -ForegroundColor Green
```

### 1297. `scripts/legacy/cleanup_old_docs.py`
- Bytes: `1768`
- Lines: `62`
- SHA256: `8e493baac95264cf7ad197388ffe43661dfbb1c346a8a3f582b618f5489347ee`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `setup_archive_dir`
  - `archive_files`
  - `main`
- Excerpt (first non-empty lines):

```text
   1: import os
   2: import shutil
   3: from datetime import datetime
   5: # Configuration
   6: DOCS_DIR = "docs"
   7: ARCHIVE_DIR = os.path.join(DOCS_DIR, "archive", "old_docs")
   8: FILES_TO_ARCHIVE = [
   9:     "Codebase Memory.md",
```

### 1298. `scripts/legacy/dev_start.sh`
- Bytes: `1217`
- Lines: `56`
- SHA256: `1d6fdb0ffd1b6189701710dc53a5f8014e7b4913d947cff156b2483109740545`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   3: # Colors for output
   4: GREEN='\033[0;32m'
   5: YELLOW='\033[1;33m'
   6: RED='\033[0;31m'
   7: NC='\033[0m' # No Color
   9: echo -e "${GREEN}🚀 Starting Stock Verify Development Environment...${NC}"
  11: # Function to kill process on a specific port
```

### 1299. `scripts/legacy/fix_whitespace.py`
- Bytes: `993`
- Lines: `40`
- SHA256: `4fc2df1423ad910d90bbf37e997f3781bcd0f27023c6c86a48394b5d98311640`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `fix_whitespace`
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env python3
   2: """Fix whitespace issues in files"""
   4: import re
   5: import sys
   6: from pathlib import Path
   9: def fix_whitespace(file_path: Path):
  10:     """Fix whitespace issues in a file"""
  11:     try:
```

### 1300. `scripts/legacy/generate_qr.py`
- Bytes: `993`
- Lines: `44`
- SHA256: `e327263ee3b90e11aee14de67d082865c508b443127a15f5323558392f90abc2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env python3
   2: import os
   3: import subprocess
   4: import sys
   6: if len(sys.argv) < 3:
   7:     print("Usage: generate_qr.py <URL> <output_png_path>")
   8:     sys.exit(2)
  10: url = sys.argv[1]
```

### 1301. `scripts/legacy/install_phase_0_dependencies.sh`
- Bytes: `2173`
- Lines: `74`
- SHA256: `644febe3c9fd040048bb1b403878c3e70e1592781a7ac40593c4a39fb0c7ca31`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   3: # Phase 0 Dependencies Installation Script
   4: # Stock Verify v2.1 Enhancement
   6: set -e
   8: echo "🚀 Installing Phase 0 Dependencies for Stock Verify v2.1"
   9: echo "========================================================="
  10: echo ""
  12: # Change to frontend directory
```

### 1302. `scripts/legacy/install_vibe_coding.sh`
- Bytes: `4323`
- Lines: `146`
- SHA256: `587a9f57d9d383849dc075ad5514377b1e0dc5ff07211c817fe6359715847b3d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: # =============================================================================
   3: # 🎵 Vibe Coding Tools Installation Script
   4: # Stock Verification System
   5: # =============================================================================
   7: set -e
   9: echo "🎵 ============================================="
  10: echo "   Vibe Coding Tools Installation"
```

### 1303. `scripts/legacy/install_vibe_coding_tools.sh`
- Bytes: `2708`
- Lines: `95`
- SHA256: `577017b0819d33573356b7a40a2813ed97c69afbaedc52d349546043e22f5159`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: # install_vibe_coding_tools.sh
   3: # Installs AI-assisted coding tools for the Stock Verification System
   5: set -e
   7: echo "🎵 Installing Vibe Coding Tools..."
   8: echo "=================================="
  10: # Check for Python
  11: if ! command -v python3 &> /dev/null; then
```

### 1304. `scripts/legacy/launch_system.sh`
- Bytes: `1829`
- Lines: `70`
- SHA256: `409956bfa07eb970a4e62ca90e9ba51a4cb6c85ef8f7c4f08833282c77dc41ee`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   3: echo "🚀 STARTING STOCK VERIFICATION SYSTEM"
   4: echo "====================================="
   5: echo ""
   7: # Navigate to project root
   8: cd /Users/noufi1/STOCK_VERIFY_2-db-maped
  10: # Create logs directory
  11: mkdir -p logs
```

### 1305. `scripts/legacy/npm-aliases.sh`
- Bytes: `2511`
- Lines: `54`
- SHA256: `9922da1007f00b055502276c1ea311183c12e591a0b794c7b13960d2468d9ac9`
- Binary: `yes`
- Content details: Binary file; textual symbol extraction skipped.

### 1306. `scripts/legacy/run_system.sh`
- Bytes: `470`
- Lines: `10`
- SHA256: `d6c157494383916271271e60a64df1ad67e3d4bb03b436418a28f72516cf6669`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: chmod +x /Users/noufi1/STOCK_VERIFY_2-db-maped/start_admin.sh
   2: chmod +x /Users/noufi1/STOCK_VERIFY_2-db-maped/start_backend_venv.sh
   3: chmod +x /Users/noufi1/STOCK_VERIFY_2-db-maped/start_frontend_expo.sh
   4: chmod +x /Users/noufi1/STOCK_VERIFY_2-db-maped/start_all_complete.sh
   5: chmod +x /Users/noufi1/STOCK_VERIFY_2-db-maped/stop_all_services.sh
   7: echo "🚀 Scripts made executable - starting complete system..."
   8: cd /Users/noufi1/STOCK_VERIFY_2-db-maped
   9: ./start_all_complete.sh
```

### 1307. `scripts/legacy/setup.ps1`
- Bytes: `1471`
- Lines: `54`
- SHA256: `1d2ed4baab703634f5c1b30d8eb76eb394e61f64d2534e5fd2037a39b96f1501`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: $ErrorActionPreference = "Stop"
   3: Write-Host "=== Stock Verify Setup (Windows) ===" -ForegroundColor Cyan
   5: function Assert-Command {
   6:     param(
   7:         [Parameter(Mandatory = $true)]
   8:         [string]$Name
   9:     )
  11:     if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
```

### 1308. `scripts/legacy/start-weknora.sh`
- Bytes: `949`
- Lines: `26`
- SHA256: `3e49a82e74d2fc9b11e493e3d100102d6c01e18cba9b27737827f283a36c5cdf`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: # Start separately managed WeKnora stack
   4: WEKNORA_DIR="research_repos/WeKnora"
   5: COMPOSE_FILE="docker-compose.weknora.yml"
   7: # Ensure configs exist
   8: if [ ! -f "$WEKNORA_DIR/config/config.yaml" ]; then
   9:     echo "Creating default WeKnora config..."
  10:     mkdir -p "$WEKNORA_DIR/config"
```

### 1309. `scripts/legacy/start_admin.sh`
- Bytes: `515`
- Lines: `17`
- SHA256: `56cb57e2eeec2950c72ebe181279aeb791c3163f37f5a816c0064d2fddf9e54f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: # Start Enhanced Admin Panel with Virtual Environment
   4: # Get the directory of the script
   5: SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
   6: PROJECT_ROOT="$SCRIPT_DIR"
   8: cd "$PROJECT_ROOT/admin-panel"
  10: echo "🚀 Starting Enhanced Admin Panel with Virtual Environment..."
  11: echo "📊 Dashboard URL: http://localhost:3000/dashboard.html"
```

### 1310. `scripts/legacy/start_all_complete.sh`
- Bytes: `5532`
- Lines: `164`
- SHA256: `68dd8ac6364d6820faa95d664500a4d5bf4c676ec5dcafe3ad37b1a51454559e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   3: # 🚀 STOCK VERIFICATION SYSTEM - COMPLETE STARTUP
   4: # =================================================
   5: # Starts all components of the Stock Verification System
   6: # - Enhanced Admin Panel (Port 3000)
   7: # - Backend API (Port 8001)
   8: # - Frontend Development Server (Port 8081)
  10: echo "🚀 STOCK VERIFICATION SYSTEM - COMPLETE STARTUP"
```

### 1311. `scripts/legacy/start_all_services.sh`
- Bytes: `1639`
- Lines: `63`
- SHA256: `0f347d67fa653f4140fa09aaadbb6e7dd6e9e26414a9184979b18f2ca9a25c44`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   3: # Colors for output
   4: RED='\033[0;31m'
   5: GREEN='\033[0;32m'
   6: YELLOW='\033[1;33m'
   7: NC='\033[0m' # No Color
   9: SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  10: BACKEND_PORT=8001
```

### 1312. `scripts/legacy/start_backend_now.sh`
- Bytes: `327`
- Lines: `9`
- SHA256: `4240bd8043a318a52d9be2988e8719b33edcadec859d7b12cf0264187f0bf2e6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: echo "🔧 Starting Backend API Server..."
   2: echo "API URL: http://localhost:8000"
   3: echo "Docs URL: http://localhost:8000/docs"
   4: echo ""
   6: cd /Users/noufi1/STOCK_VERIFY_2-db-maped/backend
   7: export PYTHONPATH="/Users/noufi1/STOCK_VERIFY_2-db-maped:${PYTHONPATH:-}"
   8: exec /Users/noufi1/STOCK_VERIFY_2-db-maped/.venv/bin/python server.py
```

### 1313. `scripts/legacy/start_frontend_expo.sh`
- Bytes: `1652`
- Lines: `57`
- SHA256: `d1a27fc77a9d4a1f5a613aa9d3cc544a6bfaf91e5900f559ffb0d8ca9e74eab3`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: # Start Frontend Development Server
   4: # Ensure we are in the script's directory
   5: cd "$(dirname "$0")"
   7: # Navigate to frontend
   8: cd frontend || exit
  10: echo "📱 Starting Frontend Development Server..."
  12: # 1. Detect LAN IP
```

### 1314. `scripts/legacy/start_services.ps1`
- Bytes: `1043`
- Lines: `33`
- SHA256: `efd523356d2c202d5746284528134e364b182c930c0b33e6f3106fd45b79dbcb`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Install dependencies
   2: Write-Host "📦 Installing dependencies..."
   3: pip install -r requirements.production.txt
   5: # Start MongoDB
   6: if ($IsWindows) {
   7:     net start MongoDB
   8: } else {
   9:     Write-Host "⚠️  Skipping 'net start MongoDB' (Not on Windows). Please ensure MongoDB is running manually (e.g., 'brew services start mongodb-community')."
```

### 1315. `scripts/legacy/start_with_qr.ps1`
- Bytes: `1494`
- Lines: `38`
- SHA256: `bd53c1856e2ce46363422d03acdaecad0db2ea183646a03d096eef361ce22fd2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Start Backend and Expo with QR Code
   2: # PowerShell script
   4: $ErrorActionPreference = "Continue"
   6: $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
   7: $ProjectRoot = (Get-Item $ScriptDir).Parent.FullName
   9: Write-Host "🛑 Stopping all existing services..." -ForegroundColor Yellow
  11: # Stop backend
  12: Get-Process python -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*python*" -and (Get-WmiObject Win32_Process -Filter "ProcessId = $($_.Id)").CommandLine -like "*backend\server.py*" } | Stop-Process -Fo...
```

### 1316. `scripts/legacy/stop_services.ps1`
- Bytes: `723`
- Lines: `22`
- SHA256: `bd5f00383fbb38fb71575f3485a4ef729a0a923b0f15eb21acacb04cdeb8c82e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Stop MongoDB if running
   2: if ((Get-Service -Name MongoDB -ErrorAction SilentlyContinue).Status -eq 'Running') {
   3:     net stop MongoDB
   4: }
   6: # Stop Uvicorn processes
   7: taskkill /IM uvicorn.exe /F 2>&1 | Out-Null
   9: # Stop Python processes in current directory
  10: Get-Process python | Where-Object { $_.Path -like "*$PWD*" } | Stop-Process -Force -ErrorAction SilentlyContinue
```

### 1317. `scripts/list_drivers.py`
- Bytes: `68`
- Lines: `4`
- SHA256: `6f24be42757d2a5687a95efbac09e3b56f1824fed1299d7cdc1bce19ec539830`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import pyodbc
   3: print(f"Available ODBC drivers: {pyodbc.drivers()}")
```

### 1318. `scripts/migrate_batch_id.py`
- Bytes: `3042`
- Lines: `92`
- SHA256: `d2a4e5183f9b2980366a1440f3f988e7c348272761031e722343a2181394bebd`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import logging
   3: import sys
   4: from pathlib import Path
   5: from datetime import datetime
   6: from motor.motor_asyncio import AsyncIOMotorClient
   8: # Add project root to path
   9: project_root = Path(__file__).parent.parent
```

### 1319. `scripts/mongo-init.js`
- Bytes: `745`
- Lines: `25`
- SHA256: `8c42142418696519a07645d4a96587564c136a758a86583b56c5f438cef3f4ff`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: const dbName = process.env.MONGO_INITDB_DATABASE || "stock_verification";
   2: const appUser = process.env.MONGO_APP_USER || "";
   3: const appPassword = process.env.MONGO_APP_PASSWORD || "";
   5: if (!appUser || !appPassword) {
   6:   print("MONGO_APP_USER or MONGO_APP_PASSWORD not set; skipping app user creation.");
   7: } else {
   8:   const appDb = db.getSiblingDB(dbName);
   9:   const existing = appDb.getUser(appUser);
```

### 1320. `scripts/monitor.sh`
- Bytes: `8479`
- Lines: `266`
- SHA256: `07422c0e4e97671d0c1f71b30a9c357c5ac5cc4e5e9c7146bba9bfc2e9ce526a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   3: # Production Monitoring Script
   4: # Run this periodically via cron to monitor application health
   6: set -e
   8: # Configuration
   9: APP_URL="${APP_URL:-http://localhost:8000}"
  10: ALERT_EMAIL="${ALERT_EMAIL:-admin@yourdomain.com}"
  11: SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"
```

### 1321. `scripts/production_readiness_checklist.sh`
- Bytes: `9751`
- Lines: `211`
- SHA256: `acf2a58d29234dfa9568d128da7e683007f4d6ee4b57e082e5bab938928a709b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   3: # Stock Verification System - Production Readiness Checklist Script
   4: # This script validates all production readiness requirements
   6: set -e
   7: chmod +x "$0" 2>/dev/null || true  # Ensure script is executable
   9: # Colors for output
  10: RED='\033[0;31m'
  11: GREEN='\033[0;32m'
```

### 1322. `scripts/push_all_required.sh`
- Bytes: `1426`
- Lines: `42`
- SHA256: `fb209e1a7fc24c289c0e1745c3f74191fa9b0bf88a64c676ea6f7f7386c7d252`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: set -e
   4: # Define the source and destination
   5: SRC="/Users/noufi1/cursor new/STOCK_VERIFY_2-db-maped"
   6: DEST="/tmp/stock-verify-system-temp-v2"
   8: # Create destination directory
   9: mkdir -p "$DEST"
  11: # Copy root files
```

### 1323. `scripts/push_github_folder.sh`
- Bytes: `468`
- Lines: `22`
- SHA256: `7ddeeb6508c2de6a8f7b8e93099f365bfffaf5a8333d5fb03d55aef9217c6541`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: set -e
   4: # Define the source and destination
   5: SRC="/Users/noufi1/cursor new/STOCK_VERIFY_2-db-maped"
   6: DEST="/tmp/stock-verify-system-temp-github"
   8: # Create destination directory
   9: mkdir -p "$DEST"
  11: # Copy .github folder
```

### 1324. `scripts/quick-status.sh`
- Bytes: `4032`
- Lines: `114`
- SHA256: `1c737003cb42c3a7815a774b63429ca1c837c354610b9b612b36cf42ae1ab394`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   3: # Stock Verification System - Quick Status Check
   4: # Usage: ./scripts/quick-status.sh
   6: set -e
   8: # Colors
   9: GREEN='\033[0;32m'
  10: YELLOW='\033[1;33m'
  11: RED='\033[0;31m'
```

### 1325. `scripts/repo_cleanup.sh`
- Bytes: `1338`
- Lines: `43`
- SHA256: `d1dda54ad5b63564c9c7cedad67489099e355facd1294e5ab4514411b3fd144a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env bash
   2: set -euo pipefail
   4: # Repo cleanup: remove generated artifacts, logs, archives, caches, and local venvs not used
   5: # Safe list only; does not touch source code.
   7: ROOT_DIR="$(cd "$(dirname "$0")"/.. && pwd)"
   8: cd "$ROOT_DIR"
  10: echo "Cleaning repository at: $ROOT_DIR"
  12: # Files (root)
```

### 1326. `scripts/restart_expo_lan.sh`
- Bytes: `1311`
- Lines: `40`
- SHA256: `c7e5ee5f195614fb9341c8145896e12aba164234bf9119ce27dcb343ad8da57d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: # Restart Expo in LAN mode with correct IP (en0)
   3: # Fixes "Stuck on opening project" and 502 Tunnel errors
   5: SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
   6: PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
   8: # Get WiFi IP
   9: WIFI_IP=$(ipconfig getifaddr en0)
  10: if [ -z "$WIFI_IP" ]; then
```

### 1327. `scripts/restore.sh`
- Bytes: `1797`
- Lines: `79`
- SHA256: `e02511d18130cb5414f7252dfd8e651db6d374b9a1203ab98e8acf2d7a013bc2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   3: # MongoDB Restore Script
   4: # Usage: ./restore.sh <backup_file.tar.gz>
   6: set -e
   8: if [ $# -eq 0 ]; then
   9:     echo "Usage: $0 <backup_file.tar.gz>"
  10:     echo "Example: $0 /backups/stock_count_backup_20250107_020000.tar.gz"
  11:     exit 1
```

### 1328. `scripts/restore_mongo.sh`
- Bytes: `841`
- Lines: `39`
- SHA256: `2b9e6fb4cc6747ec2bf0e6a9ab56a1154504bf994229be24a9760f52708a4836`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   3: set -euo pipefail
   5: if [ $# -lt 1 ]; then
   6:   echo "Usage: $0 <backup-archive.gz>"
   7:   exit 1
   8: fi
  10: BACKUP_FILE="$1"
  11: ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
```

### 1329. `scripts/run_pi_server.ps1`
- Bytes: `1083`
- Lines: `25`
- SHA256: `67d0910b3c7cfe70d6554c7bcd06a97c071b581fbb8d8aa0df9c603eb535e8aa`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Start the pi-server sidecar for Stock Verify System
   2: # This requires Node.js but doesn't require a full repo checkout if using npx
   4: $Port = 3000
   5: $Package = "@pi-api/server" # Assuming this is the package name based on research
   7: Write-Host "Starting pi-server sidecar on port $Port..." -ForegroundColor Cyan
   9: # Check if port is already in use
  10: $PortCheck = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
  11: if ($PortCheck) {
```

### 1330. `scripts/security_hardening.sh`
- Bytes: `6873`
- Lines: `271`
- SHA256: `eed1462bc95ee0ff54fa6f3c5a9990a4454ef6166dcceb20cb63a4eb9640d084`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   3: # Security Hardening Script for Production
   4: # Run this script on your production server before deployment
   6: set -e
   8: echo "🔒 Starting Security Hardening Process..."
  10: # Check if running as root
  11: if [ "$EUID" -ne 0 ]; then
  12:     echo "Please run as root (use sudo)"
```

### 1331. `scripts/seed_test_item.py`
- Bytes: `1007`
- Lines: `35`
- SHA256: `8af9907b5224aadf697dc3f785e16f02fd7a175de761e864e30d409e504c4011`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import os
   4: # cSpell:ignore Sujata Dynamix Upserted upserted
   6: from motor.motor_asyncio import AsyncIOMotorClient
   8: # Connect to local MongoDB
   9: MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
  10: client: AsyncIOMotorClient = AsyncIOMotorClient(MONGO_URL)
  11: db = client.stock_verification
```

### 1332. `scripts/set_admin_pin.py`
- Bytes: `594`
- Lines: `22`
- SHA256: `17a5cde912a203b44d40ac8facf376a55b072e400eef1695ffc02d272577efd1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import os
   4: from motor.motor_asyncio import AsyncIOMotorClient
   6: # Connect to local MongoDB
   7: MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
   8: client = AsyncIOMotorClient(MONGO_URL)
   9: db = client.stock_verification
  12: async def update_admin_pin():
```

### 1333. `scripts/setup-recommendations.sh`
- Bytes: `3200`
- Lines: `88`
- SHA256: `b861d327f1e2dbf731936b86da4fb60c774d66b780b6d7d8f4e134dd99249cf8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   3: # Stock Verification System - Setup Recommendations Implementation
   4: # This script implements the key recommendations from the diagnostic report
   6: set -e
   8: # Colors
   9: GREEN='\033[0;32m'
  10: YELLOW='\033[1;33m'
  11: RED='\033[0;31m'
```

### 1334. `scripts/setup_sql_and_sync.sh`
- Bytes: `8973`
- Lines: `248`
- SHA256: `4f819efeae6eb2ef8cf8ba2bd7dcb382c7503bc753c132d5f410240d9b69d47e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: # SQL Server Connection & Data Sync Setup Script
   3: # This script configures SQL Server connection and syncs all ERP data
   5: set -e
   7: echo ""
   8: echo "╔════════════════════════════════════════════════════════════════════════╗"
   9: echo "║         SQL SERVER CONNECTION & DATA SYNC SETUP                        ║"
  10: echo "╚════════════════════════════════════════════════════════════════════════╝"
```

### 1335. `scripts/spec-kit/bash/check-prerequisites.sh`
- Bytes: `4957`
- Lines: `167`
- SHA256: `d0ede7b7b22b74c7a87cca2a8d03319edcb1a441093927f8429f2fa05966c170`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env bash
   3: # Consolidated prerequisite checking script
   4: #
   5: # This script provides unified prerequisite checking for Spec-Driven Development workflow.
   6: # It replaces the functionality previously spread across multiple scripts.
   7: #
   8: # Usage: ./check-prerequisites.sh [OPTIONS]
   9: #
```

### 1336. `scripts/spec-kit/bash/common.sh`
- Bytes: `4890`
- Lines: `156`
- SHA256: `a95be1d3eff8d4aa4efdfbe197054fef7b6a03460ccbe2d5012cc61d5f017809`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env bash
   2: # Common functions and variables for all scripts
   4: # Get repository root, with fallback for non-git repositories
   5: get_repo_root() {
   6:     if git rev-parse --show-toplevel >/dev/null 2>&1; then
   7:         git rev-parse --show-toplevel
   8:     else
   9:         # Fall back to script location for non-git repos
```

### 1337. `scripts/spec-kit/bash/create-new-feature.sh`
- Bytes: `9338`
- Lines: `261`
- SHA256: `0de856176cba4af1ed3c7ddad64885f328a34141af90095b8f23bb685a361041`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env bash
   3: set -e
   5: JSON_MODE=false
   6: SHORT_NAME=""
   7: BRANCH_NUMBER=""
   8: ARGS=()
   9: i=1
  10: while [ $i -le $# ]; do
```

### 1338. `scripts/spec-kit/bash/setup-plan.sh`
- Bytes: `1609`
- Lines: `61`
- SHA256: `8c390e189b5d64906cbccafe1b49078b30496c399712f41f9441096d01d94bac`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env bash
   3: set -e
   5: # Parse command line arguments
   6: JSON_MODE=false
   7: ARGS=()
   9: for arg in "$@"; do
  10:     case "$arg" in
  11:         --json)
```

### 1339. `scripts/spec-kit/bash/update-agent-context.sh`
- Bytes: `24531`
- Lines: `774`
- SHA256: `5b5efba8b215e44294ec1c2628b4b8e3669eb13bb9b0d6ad14cebadd7289e9cc`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env bash
   3: # Update agent context files with information from plan.md
   4: #
   5: # This script maintains AI agent context files by parsing feature specifications
   6: # and updating agent-specific configuration files with project information.
   7: #
   8: # MAIN FUNCTIONS:
   9: # 1. Environment Validation
```

### 1340. `scripts/spec-kit/powershell/check-prerequisites.ps1`
- Bytes: `4785`
- Lines: `149`
- SHA256: `4566eb366af23ef14c1a00efc01720517ece5b99c93696e5947f16aee14bb432`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env pwsh
   3: # Consolidated prerequisite checking script (PowerShell)
   4: #
   5: # This script provides unified prerequisite checking for Spec-Driven Development workflow.
   6: # It replaces the functionality previously spread across multiple scripts.
   7: #
   8: # Usage: ./check-prerequisites.ps1 [OPTIONS]
   9: #
```

### 1341. `scripts/spec-kit/powershell/common.ps1`
- Bytes: `3711`
- Lines: `131`
- SHA256: `615d3da885dc9a121ad7d030ddf5c7d8c359c1eae66ec27a7737ea862f3d0269`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env pwsh
   2: # Common PowerShell functions analogous to common.sh
   4: function Get-RepoRoot {
   5:     try {
   6:         $result = git rev-parse --show-toplevel 2>$null
   7:         if ($LASTEXITCODE -eq 0) {
   8:             return $result
   9:         }
```

### 1342. `scripts/spec-kit/powershell/create-new-feature.ps1`
- Bytes: `9773`
- Lines: `290`
- SHA256: `1c13e6821040d5770a5ddbb200578b90881a11b6e515e19517d1146435359c14`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env pwsh
   2: # Create a new feature
   3: [CmdletBinding()]
   4: param(
   5:     [switch]$Json,
   6:     [string]$ShortName,
   7:     [int]$Number = 0,
   8:     [switch]$Help,
```

### 1343. `scripts/spec-kit/powershell/setup-plan.ps1`
- Bytes: `1849`
- Lines: `62`
- SHA256: `45b45613a419bf6affc8a9c3452ba54a83e69dfed9e3a257ec9393a1a3eb7c8f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env pwsh
   2: # Setup implementation plan for a feature
   4: [CmdletBinding()]
   5: param(
   6:     [switch]$Json,
   7:     [switch]$Help
   8: )
  10: $ErrorActionPreference = 'Stop'
```

### 1344. `scripts/spec-kit/powershell/update-agent-context.ps1`
- Bytes: `19211`
- Lines: `439`
- SHA256: `ad3cb792f014601a297d274e74dc7e5816e985a404aa9e6559a91de98066e2c1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env pwsh
   2: <#!
   3: .SYNOPSIS
   4: Update agent context files with information from plan.md (PowerShell version)
   6: .DESCRIPTION
   7: Mirrors the behavior of scripts/bash/update-agent-context.sh:
   8:  1. Environment Validation
   9:  2. Plan Data Extraction
```

### 1345. `scripts/start_all.ps1`
- Bytes: `1650`
- Lines: `53`
- SHA256: `b91f784daaf8a1a68a59ec8a26142b0e84c68b9fddb74e735046aced0f70927a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Start Both Services - Ensures only one instance of each runs
   2: # PowerShell script for Windows
   4: $ErrorActionPreference = "Continue"
   6: $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
   8: Write-Host "🛑 Stopping all existing services..." -ForegroundColor Yellow
   9: & "$ScriptDir\stop_all.ps1"
  11: Start-Sleep -Seconds 2
  13: Write-Host ""
```

### 1346. `scripts/start_all.sh`
- Bytes: `676`
- Lines: `35`
- SHA256: `65e8cef72534f13701c6ac15baff3c9605eb298cabe47d62b1a0b6252b2a5056`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: # Start Both Services - Ensures only one instance of each runs
   4: set -e
   6: SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
   7: PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
   9: echo "🛑 Stopping all existing services..."
  10: "$SCRIPT_DIR/stop_all.sh" 2>/dev/null || true
  12: sleep 2
```

### 1347. `scripts/start_backend.ps1`
- Bytes: `1273`
- Lines: `39`
- SHA256: `10b6a8126df2621a3e915f4a3eec4aa0ddb01cb1722df7536dfb68d08fb630e0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Start Backend Server - Ensures only one instance runs
   2: # PowerShell script for Windows
   4: $ErrorActionPreference = "Stop"
   6: $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
   7: $ProjectRoot = Split-Path -Parent $ScriptDir
   8: $BackendDir = Join-Path $ProjectRoot "backend"
  10: Write-Host "🔍 Checking for existing backend instances..." -ForegroundColor Yellow
  12: # Kill existing backend processes
```

### 1348. `scripts/start_backend.sh`
- Bytes: `1025`
- Lines: `38`
- SHA256: `32af5a24fa3c8bc3203363b7d496904999e01f77d9e699088cb933bda39e2de4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: # Start Backend Server - Ensures only one instance runs
   4: set -e
   6: SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
   7: PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
   8: BACKEND_DIR="$PROJECT_ROOT/backend"
  10: cd "$PROJECT_ROOT"
  12: echo "🔍 Checking for existing backend instances..."
```

### 1349. `scripts/start_frontend.ps1`
- Bytes: `1723`
- Lines: `49`
- SHA256: `736029bc005dcc529777ba615e5267a1c4c39675ea8f24d1624a014ac7c76e8e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Start Frontend (Expo) - Ensures only one instance runs
   2: # PowerShell script for Windows
   4: $ErrorActionPreference = "Stop"
   6: $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
   7: $ProjectRoot = Split-Path -Parent $ScriptDir
   8: $FrontendDir = Join-Path $ProjectRoot "frontend"
  10: Write-Host "ðŸ” Checking for existing frontend instances..." -ForegroundColor Yellow
  12: # Kill existing Expo/Metro processes
```

### 1350. `scripts/start_frontend.sh`
- Bytes: `1011`
- Lines: `37`
- SHA256: `b6510da842cfc3555851d7798c0c92458b37a17648792bf9171f251a94763055`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: # Start Frontend (Expo) - Ensures only one instance runs
   4: set -e
   6: SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
   7: PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
   8: FRONTEND_DIR="$PROJECT_ROOT/frontend"
  10: cd "$FRONTEND_DIR"
  12: echo "🔍 Checking for existing frontend instances..."
```

### 1351. `scripts/start_frontend_new_window.ps1`
- Bytes: `1408`
- Lines: `32`
- SHA256: `65c47e49d52c3aee108f04d2e6fea348607815cce637a2e0d7d628cf5e44851a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Start Frontend in New PowerShell Window
   2: # PowerShell script for macOS/Windows
   4: $ErrorActionPreference = "Continue"
   6: $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
   7: $ProjectRoot = (Get-Item $ScriptDir).Parent.FullName
   8: $FrontendDir = Join-Path $ProjectRoot "frontend"
  10: Write-Host "🚀 Starting Frontend (Expo) in new window..." -ForegroundColor Green
  12: # Check if we're on macOS or Windows
```

### 1352. `scripts/start_local_db.sh`
- Bytes: `2526`
- Lines: `91`
- SHA256: `7b41d721876a896ce5ddd019840241aa1a7e2cd288033acd7fafcce7cc038646`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: # Start Local MongoDB using backend/data/db
   4: PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
   5: DATA_DIR="$PROJECT_ROOT/backend/data/db"
   6: LOG_FILE="$PROJECT_ROOT/backend/data/mongod.log"
   7: REPAIR_LOG="$PROJECT_ROOT/backend/data/mongod-repair.log"
   8: MONGO_HOST="127.0.0.1"
   9: MONGO_PORT="27017"
```

### 1353. `scripts/start_with_redis.sh`
- Bytes: `1323`
- Lines: `58`
- SHA256: `ba8640c68e3c0703904466e1d8e5b7f4fd9d3ce3140f3b05ee72b0f0fb8695c6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   3: # StockVerify Startup Script with Redis
   4: # Starts Redis and the backend server
   6: set -e
   8: echo "🚀 Starting StockVerify with Redis..."
  10: # Check if Redis is installed
  11: if ! command -v redis-server &> /dev/null; then
  12:     echo "❌ Redis is not installed!"
```

### 1354. `scripts/stop_all.ps1`
- Bytes: `1055`
- Lines: `33`
- SHA256: `71f660d2bde1a59662e2bcaf32d50185276c204f645e262d74caf5a286657919`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Stop All Services
   2: # PowerShell script for Windows
   4: Write-Host "🛑 Stopping all services..." -ForegroundColor Yellow
   6: # Kill backend processes
   7: Get-Process | Where-Object {
   8:     $_.ProcessName -match "python" -and
   9:     $_.CommandLine -match "server\.py"
  10: } | Stop-Process -Force -ErrorAction SilentlyContinue
```

### 1355. `scripts/stop_all.sh`
- Bytes: `541`
- Lines: `24`
- SHA256: `9320fa1ef6476160f5fda91dbbd98d21a08eebcfeb753f0aa9737ae430b79d37`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: # Stop All Services
   4: echo "🛑 Stopping all services..."
   6: # Kill backend
   7: pkill -f "python.*server.py" 2>/dev/null || true
   8: pkill -f "uvicorn.*server" 2>/dev/null || true
  10: # Kill frontend
  11: pkill -f "expo" 2>/dev/null || true
```

### 1356. `scripts/sync-cheatsheets.sh`
- Bytes: `498`
- Lines: `19`
- SHA256: `f3bd124613446253d9f31335989d62c5fe5c6abc35b76ca660b1a0e15fbe3733`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: # Sync Cheat Sheets from research_repos to Admin Panel
   4: SOURCE_DIR="research_repos/cheat-sheet-pdf/pdf"
   5: DEST_DIR="admin-panel/public/cheat-sheets"
   7: # Create destination directory if it doesn't exist
   8: mkdir -p "$DEST_DIR"
  10: # Check if source directory exists
  11: if [ -d "$SOURCE_DIR" ]; then
```

### 1357. `scripts/sync_erp_full.py`
- Bytes: `8155`
- Lines: `189`
- SHA256: `5ef50defd12b70234c077c20d06da300e88ec3770d148f8d03d504824d53380a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `conv`
- Excerpt (first non-empty lines):

```text
   1: """ERP Full Sync Script - Synchronizes items from SQL Server to MongoDB.
   3: This script performs a complete synchronization of product data from the ERP
   4: system (SQL Server) to the local MongoDB database. It includes proper error
   5: handling, logging, and type annotations.
   6: """
   8: import asyncio
   9: import logging
  10: from datetime import date, datetime, timezone
```

### 1358. `scripts/system_health_monitor.sh`
- Bytes: `16574`
- Lines: `423`
- SHA256: `4914d2c25086ec926cbfa81df5a5c3e66ef9aa2b8420c37d20d03afbdedb07e8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   3: # Stock Verification System - System Health Monitor
   4: # Comprehensive system monitoring and health validation
   6: set -e
   7: chmod +x "$0" 2>/dev/null || true  # Ensure script is executable
   9: # Colors for output
  10: RED='\033[0;31m'
  11: GREEN='\033[0;32m'
```

### 1359. `scripts/test_admin_api.py`
- Bytes: `3196`
- Lines: `92`
- SHA256: `46dbb66cecbbe4909a1247ef23caa9c1232048a2ca460e51baabb72629d11d32`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   3: import httpx
   5: BASE_URL = "http://localhost:8001"
   8: async def test_admin_api():
   9:     async with httpx.AsyncClient() as client:
  10:         # 1. Login
  11:         print("--- Logging in as Admin ---")
  12:         login_payload = {"username": "admin", "password": "admin123"}
```

### 1360. `scripts/test_import_audit.py`
- Bytes: `475`
- Lines: `19`
- SHA256: `28d1fb963d6c5a829e00e6b539a56ebead62cf1c8e5bdd2237f15943172f19a0`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import sys
   2: from pathlib import Path
   3: import asyncio
   5: # Add project root to path
   6: project_root = Path(__file__).parent.parent
   7: sys.path.insert(0, str(project_root))
   9: try:
  10:     from backend.services.audit_service import AuditService, AuditEventType
```

### 1361. `scripts/test_incremental_sync.py`
- Bytes: `2577`
- Lines: `70`
- SHA256: `8c81df6f81b3ba41f6f449181a1d1b13272247ca7745ef60dc4bf7d9155a02b1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import os
   3: import sys
   4: import logging
   5: from datetime import datetime, timedelta
   6: from unittest.mock import MagicMock
   8: # Add the project root to sys.path
   9: sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
```

### 1362. `scripts/test_integration.sh`
- Bytes: `5131`
- Lines: `196`
- SHA256: `e1f26959612fe242c2744331e750f4ed256508054fbb4ba7c516145ddd8a3f15`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   3: # Integration Test Script for Phase 1-3 Upgrades
   4: # Tests Redis, MongoDB, Rack Management, Batch Sync, and Reporting
   6: set -e
   8: BASE_URL="http://localhost:8000"
   9: TOKEN=""
  11: echo "🧪 StockVerify Integration Tests"
  12: echo "================================"
```

### 1363. `scripts/test_login_manual.py`
- Bytes: `562`
- Lines: `21`
- SHA256: `5fd6b5f0056f4ac5ccfabd11f0038e9b5006e6202d808e8e833a6b15884970e2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `test_login`
- Excerpt (first non-empty lines):

```text
   1: import requests
   2: import json
   5: def test_login():
   6:     url = "http://localhost:8001/api/auth/login"
   7:     payload = {"username": "admin", "password": "admin123"}
   8:     headers = {"Content-Type": "application/json"}
  10:     print(f"Testing Login at {url}...")
  11:     try:
```

### 1364. `scripts/test_sql_conn.py`
- Bytes: `1058`
- Lines: `39`
- SHA256: `1113ebcb5c418f6356426a2b9b59f93565e2e8a10d6196a3b7078d9b4903812f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `test_sql_connection`
- Excerpt (first non-empty lines):

```text
   1: import pyodbc
   2: import os
   3: import sys
   4: from pathlib import Path
   6: # Add project root to path
   7: sys.path.insert(0, str(Path(__file__).parent))
   9: from backend.config import settings
  12: def test_sql_connection():
```

### 1365. `scripts/test_sql_conn_v2.py`
- Bytes: `1900`
- Lines: `57`
- SHA256: `72fa0addd4afcc249e1d0bcc9b9711cde3cb7cfad625f40f87be657735fd3da3`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `test_sql_connection`
- Excerpt (first non-empty lines):

```text
   1: import pyodbc
   2: import os
   3: import sys
   4: from pathlib import Path
   6: # Add project root to path
   7: sys.path.insert(0, str(Path(__file__).parent))
   9: from backend.config import settings
  10: from backend.utils.db_connection import SQLServerConnectionBuilder
```

### 1366. `scripts/validate-feature.sh`
- Bytes: `310`
- Lines: `14`
- SHA256: `9c465c7733debc52424ddda9b8b780faddccf326cf7f8f395425e101cb49682b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: # Feature Branch Validation Script
   3: # Runs all CI checks to ensure the feature is ready for merge
   5: set -e
   7: echo "🔍 Starting feature branch validation..."
   9: # 1. Run CI checks (Linting, Typechecking, Tests)
  10: echo "🚀 Running CI checks..."
  11: make ci
```

### 1367. `scripts/validate_deploy.sh`
- Bytes: `4990`
- Lines: `174`
- SHA256: `4764e6737a30a31d07b4812804cc8de17af43d4aaa0fda5782bbe1923901922f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/usr/bin/env bash
   2: # =============================================================================
   3: # validate_deploy.sh — Pre-deployment validation script
   4: # =============================================================================
   5: # Usage: bash scripts/validate_deploy.sh
   6: # =============================================================================
   7: set -euo pipefail
   9: RED='\033[0;31m'
```

### 1368. `scripts/verify_and_sync_item.py`
- Bytes: `2809`
- Lines: `87`
- SHA256: `61d5d0300019d7e2d861eb428779d4de82739e4f36d22825764259ad45ecf816`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: from motor.motor_asyncio import AsyncIOMotorClient
   3: import pyodbc
   4: import os
   5: from datetime import datetime, timezone
   6: from dotenv import load_dotenv
   8: load_dotenv()
  11: async def verify_item_sync(barcode):
```

### 1369. `scripts/verify_audit_watchdog.py`
- Bytes: `3243`
- Lines: `105`
- SHA256: `0dcf84244f514fc8921dd6959895b63babda4ed0587776b6e1a3b14eeade5eea`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import sys
   3: from pathlib import Path
   5: # Add project root to path
   6: project_root = Path(__file__).parent.parent
   7: sys.path.insert(0, str(project_root))
   9: from motor.motor_asyncio import AsyncIOMotorClient
  10: from backend.config import settings
```

### 1370. `scripts/verify_erp_live.py`
- Bytes: `1107`
- Lines: `34`
- SHA256: `ad4aeb3954a920dd8cf581ecf079229fe44b533c7aff80717551dd290a8846aa`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import os
   3: from motor.motor_asyncio import AsyncIOMotorClient
   6: async def check_erp_items():
   7:     client = AsyncIOMotorClient("mongodb://localhost:27017")
   8:     db = client.stock_verification
   9:     count = await db.erp_items.count_documents({})
  10:     print(f"Total ERP items in MongoDB: {count}")
```

### 1371. `scripts/verify_services.sh`
- Bytes: `3365`
- Lines: `120`
- SHA256: `66482422635fe145e75f073c73213a6d9d628333930e21d590eb0e30a23dc9b4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: #!/bin/bash
   2: # Verify All Services Are Running
   4: echo "🔍 Verifying Services Status..."
   5: echo ""
   7: # Colors
   8: GREEN='\033[0;32m'
   9: RED='\033[0;31m'
  10: YELLOW='\033[1;33m'
```

### 1372. `scripts/verify_setup.py`
- Bytes: `1513`
- Lines: `55`
- SHA256: `4b97b470ed1a5dff99d84c01111f6e2534ec265529d9c240cc0dbfbdd1c273b6`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `check_module`
  - `check_file`
  - `main`
- Excerpt (first non-empty lines):

```text
   1: import sys
   2: import importlib.util
   3: import os
   6: def check_module(module_name):
   7:     if importlib.util.find_spec(module_name) is None:
   8:         print(f"❌ {module_name} is NOT installed")
   9:         return False
  10:     print(f"✅ {module_name} is installed")
```

### 1373. `scripts/verify_sujata_db.py`
- Bytes: `2348`
- Lines: `72`
- SHA256: `6b16eed4cb848f17920fb11617d061eff28d150677b68e3c715e9959eab29117`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: import asyncio
   2: import os
   4: from motor.motor_asyncio import AsyncIOMotorClient
   6: MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
   7: client = AsyncIOMotorClient(MONGO_URL)
   8: db = client.stock_verification
  11: async def check_sujata():
  12:     collections = await db.list_collection_names()
```

## specs

### 1374. `specs/001-comprehensive-modernization/README.md`
- Bytes: `1088`
- Lines: `37`
- SHA256: `83f1731b9c284f6096e6e1d819c089f0b964aa5cbb8e60a4c9286585ab48cb0a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Comprehensive Modernization Specification
   3: **Spec ID:** 001-comprehensive-modernization
   4: **Status:** Specification Complete
   5: **Created:** 2025-11-13
   7: ## Overview
   9: This specification covers the comprehensive modernization of the STOCK_VERIFY application to transform it into a professional-grade, production-ready system.
  11: ## Documents
  13: - **spec.md** - Complete specification with requirements and user stories
```

### 1375. `specs/001-comprehensive-modernization/checklists/design-system.md`
- Bytes: `12026`
- Lines: `155`
- SHA256: `e517434c68cf9990c39b01db931de7468cbf0057bc0bbe532b0c49b856f703d5`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Design System Requirements Quality Checklist
   3: **Purpose:** Validate that the unified design system requirements in spec.md are complete, clear, consistent, and aligned with official React Native/Expo documentation and accessibility guidelines.
   5: **Created:** 2025-01-22
   6: **Focus:** Design tokens, theming, colors, accessibility, platform behavior
   7: **Depth:** Standard
   8: **Audience:** Reviewer (PR)
  10: ---
  12: ## Requirement Completeness
```

### 1376. `specs/001-comprehensive-modernization/plan.md`
- Bytes: `7647`
- Lines: `264`
- SHA256: `4511f5f237742648dd12853f71bac55e0d414a4f31e87515550ecb81e69f5177`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Implementation Plan: Comprehensive Modernization
   3: **Specification:** 001-comprehensive-modernization
   4: **Version:** 1.0
   5: **Date:** 2025-11-13
   7: ## Implementation Strategy
   9: This plan breaks down the comprehensive modernization into manageable phases with clear deliverables and dependencies.
  11: ## Phase 1: Design System Foundation (Week 1-2)
  13: ### 1.1 Enhanced Theme System
```

### 1377. `specs/001-comprehensive-modernization/spec.md`
- Bytes: `6799`
- Lines: `188`
- SHA256: `f92773ac9f9c2540bb777ee21bcb553c8546c8923a6ae48a0cf004c3c1d87650`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Comprehensive Modernization of STOCK_VERIFY Application
   3: **Specification ID:** 001-comprehensive-modernization
   4: **Version:** 1.0
   5: **Date:** 2025-11-13
   6: **Status:** Draft
   8: ## Overview
  10: Transform the STOCK_VERIFY application into a professional-grade, production-ready system with modern UI/UX, advanced features, comprehensive testing, and deployment readiness across mobile (React Native/Expo), web (E...
  12: ## Problem Statement
```

### 1378. `specs/001-comprehensive-modernization/tasks.md`
- Bytes: `20113`
- Lines: `386`
- SHA256: `3fb0a1820a413395567a4c52b65ff9d356dac31e3c4e404215ea7fb50b49ba3b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Tasks: Comprehensive Modernization of STOCK_VERIFY
   3: **Input**: Design documents from `/specs/001-comprehensive-modernization/`
   4: **Prerequisites**: plan.md ✓, spec.md ✓
   5: **Generated**: 2026-01-01
   6: **Total Tasks**: 108
   8: ## Format: `[ID] [P?] [Story?] Description`
  10: - **[P]**: Can run in parallel (different files, no dependencies)
  11: - **[Story]**: Which user story this task belongs to (US1=Staff, US2=Supervisor, US3=Admin, US4=Developer)
```

### 1379. `specs/002-system-modernization-and-enhancements/README.md`
- Bytes: `1993`
- Lines: `68`
- SHA256: `3a2a8544cddd388f8442ba1687696ece38d8f080775e9552a243ca0fa88f55f8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Comprehensive App Improvements Specification
   3: **Spec ID:** 002-system-modernization-and-enhancements
   4: **Status:** Specification Complete
   5: **Created:** 2025-11-13
   6: **Related:** 001-comprehensive-modernization
   8: ## Overview
  10: This specification covers 52 comprehensive improvements across performance, UI/UX, security, testing, features, and architecture to transform STOCK_VERIFY into a production-ready, enterprise-grade system.
  12: ## Documents
```

### 1380. `specs/002-system-modernization-and-enhancements/checklists/dependencies.md`
- Bytes: `6709`
- Lines: `75`
- SHA256: `7ea382ebeb17ea8dccd60b2d2d6274e9d4f60e25939b771b3cf4e55880e667e7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Dependencies & Packaging Checklist: Comprehensive App Improvements
   3: **Purpose**: Validate that dependency, packaging, and runtime prerequisites are fully specified, unambiguous, and acceptance-testable for the comprehensive improvements work.
   4: **Created**: 2025-12-24
   5: **Feature**: specs/002-system-modernization-and-enhancements/spec.md
   7: **Assumptions (defaults)**:
   8: - Depth: Standard (PR review gate)
   9: - Audience: Reviewer
  10: - Focus: Reporting/export + backend runtime prerequisites (plus cross-cutting dependency hygiene)
```

### 1381. `specs/002-system-modernization-and-enhancements/checklists/plan.md`
- Bytes: `1373`
- Lines: `34`
- SHA256: `7e00c681ad34cdf89416631735db14942628f5b6f588d6170d56ea41d8f05b37`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Plan Quality Checklist: Comprehensive App Improvements
   3: **Purpose**: Validate implementation plan quality and completeness
   4: **Created**: 2025-12-26
   5: **Feature**: [specs/002-system-modernization-and-enhancements/plan.md](../plan.md)
   7: ## Plan Structure
   9: - [x] Follows standard template
  10: - [x] Links to correct specification
  11: - [x] Defines clear phases and dependencies
```

### 1382. `specs/002-system-modernization-and-enhancements/checklists/requirements.md`
- Bytes: `1544`
- Lines: `36`
- SHA256: `157403017917584d4ff070b5977ff5dc2fff489d5325f7c13cf6968142051a83`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Specification Quality Checklist: Comprehensive App Improvements
   3: **Purpose**: Validate specification completeness and quality before proceeding to planning
   4: **Created**: 2025-12-26
   5: **Feature**: [specs/002-system-modernization-and-enhancements/spec.md](../spec.md)
   7: ## Content Quality
   9: - [x] No implementation details (languages, frameworks, APIs) *See note below*
  10: - [x] Focused on user value and business needs
  11: - [x] Written for non-technical stakeholders
```

### 1383. `specs/002-system-modernization-and-enhancements/contracts/analytics.yaml`
- Bytes: `12223`
- Lines: `485`
- SHA256: `8ee547ab5eaa08daaf4d64de4906519d41fe292b9ef8f842af892c4eb80accbd`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: openapi: 3.0.3
   2: info:
   3:   title: Stock Verify - Variance Analytics API
   4:   version: 1.0.0
   5:   description: |
   6:     Dashboard and analytics endpoints for variance analysis.
   7:     Provides insights into count accuracy and inventory discrepancies.
   9: servers:
```

### 1384. `specs/002-system-modernization-and-enhancements/contracts/api.yaml`
- Bytes: `1688`
- Lines: `71`
- SHA256: `ae2aab58aaf2e659ebceb7d19a819878bfbdb126f417a06084ea21d7b9bea30a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: openapi: 3.0.0
   2: info:
   3:   title: Stock Verify API - Enhanced
   4:   version: 2.0.0
   5:   description: Enhanced API contracts for comprehensive improvements.
   7: paths:
   8:   /api/users/me/preferences:
   9:     put:
```

### 1385. `specs/002-system-modernization-and-enhancements/contracts/auth.yaml`
- Bytes: `6299`
- Lines: `224`
- SHA256: `305facd695bdb3cccad10e0212c8e3f9c8fa9cfd24679570da96e42fb1f1182a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: openapi: 3.0.3
   2: info:
   3:   title: Stock Verify - Auth API (PIN/Password Management)
   4:   version: 2.0.0
   5:   description: Enhanced authentication endpoints for PIN and password management
   7: paths:
   8:   /api/auth/change-pin:
   9:     post:
```

### 1386. `specs/002-system-modernization-and-enhancements/contracts/offline.yaml`
- Bytes: `8222`
- Lines: `325`
- SHA256: `384f4d85a15320c128ee470d2a055a97eff9ff23c5c06f0417b3c80642ec32c8`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: openapi: 3.0.3
   2: info:
   3:   title: Stock Verify - Offline Sync API
   4:   version: 1.0.0
   5:   description: |
   6:     API endpoints for offline data synchronization.
   7:     Handles queue-based sync when device regains connectivity.
   9: servers:
```

### 1387. `specs/002-system-modernization-and-enhancements/contracts/realtime.yaml`
- Bytes: `6923`
- Lines: `253`
- SHA256: `f949e46f5fdddbf87d5316cb967aee258c2ff353f4266515f50421c140375c7e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: asyncapi: 2.6.0
   2: info:
   3:   title: Stock Verify - Real-Time WebSocket API
   4:   version: 1.0.0
   5:   description: WebSocket events for real-time updates (Supervisors only)
   7: servers:
   8:   production:
   9:     url: wss://api.stockverify.local/ws
```

### 1388. `specs/002-system-modernization-and-enhancements/data-model.md`
- Bytes: `9178`
- Lines: `311`
- SHA256: `2475aef1f7f7ba85581215ee27c979baae72c0b55d6f9b7f9da61c3d08316f7d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `UserPreferences`
  - `ItemLock`
  - `sync_queue`
  - `WebSocketConnection`
  - `VarianceAnalytics`
  - `RealTimeEvent`
  - `UserEnhancements`
  - `CountSessionEnhancements`
- Excerpt (first non-empty lines):

```text
   1: # Data Model: Comprehensive App Improvements
   3: **Date**: 2025-12-24
   4: **Feature**: 002-system-modernization-and-enhancements
   5: **Status**: Complete
   7: ## Overview
   9: This document defines the data entities and their relationships for the STOCK_VERIFY comprehensive improvements. It covers new entities for real-time updates, offline sync, theme preferences, and analytics.
  11: ---
  13: ## Entity Diagram
```

### 1389. `specs/002-system-modernization-and-enhancements/plan.md`
- Bytes: `3253`
- Lines: `74`
- SHA256: `5667841abf6992f509dc80b39937f409a2b94a20183f7d0a76ee541863ff6d30`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Implementation Plan: Comprehensive App Improvements
   3: **Branch**: `002-system-modernization-and-enhancements` | **Date**: 2025-12-25 | **Spec**: [specs/002-system-modernization-and-enhancements/spec.md](../spec.md)
   4: **Input**: Feature specification from `/specs/002-system-modernization-and-enhancements/spec.md`
   6: ## Summary
   8: This plan covers the comprehensive modernization of the Stock Verify system, including:
   9: 1.  **Real-time Updates**: WebSocket integration for live stock counts.
  10: 2.  **Enhanced Security**: PIN-based quick login and improved session management.
  11: 3.  **UI/UX Improvements**: Theme support, font scaling, and better search.
```

### 1390. `specs/002-system-modernization-and-enhancements/quickstart.md`
- Bytes: `7516`
- Lines: `344`
- SHA256: `8cc5bd39211c74fef284d1f54ccd9533a69cefda9a88808758fcdef9ae90327a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `SupervisorDashboard`
  - `CountScreen`
  - `handleCount`
  - `App`
  - `toggleTheme`
- Excerpt (first non-empty lines):

```text
   1: # Quickstart Guide - Stock Verify System Modernization
   3: This guide helps developers quickly set up and work with the enhanced Stock Verify system.
   5: ## Prerequisites
   7: - **Python 3.9+** (backend)
   8: - **Node.js 18+** and npm (frontend)
   9: - **MongoDB 5.0+** (local or Atlas)
  10: - **SQL Server** (read-only ERP connection, optional for local dev)
  11: - **Redis** (optional, for caching)
```

### 1391. `specs/002-system-modernization-and-enhancements/research.md`
- Bytes: `12723`
- Lines: `361`
- SHA256: `bc4526cd697291c06f7edbadcfb539d0a72fba5b44055622c2f27ae14d592ef1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals:
  - `ConnectionManager`
  - `__init__`
  - `IF`
  - `IF`
  - `ThemeState`
  - `CacheService`
  - `__init__`
- Excerpt (first non-empty lines):

```text
   1: # Research: Comprehensive App Improvements
   3: **Date**: 2025-12-24
   4: **Feature**: 002-system-modernization-and-enhancements
   5: **Status**: Complete
   7: ## Executive Summary
   9: This document captures technology decisions and best practices research for the comprehensive improvements to STOCK_VERIFY. All major unknowns have been resolved.
  11: ---
  13: ## 1. Real-Time WebSocket Implementation
```

### 1392. `specs/002-system-modernization-and-enhancements/spec.md`
- Bytes: `9510`
- Lines: `251`
- SHA256: `0ac5e326df88debf2bd42b8431473ac148f2a90bcfd1d35552a1de857ae8043b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Comprehensive App Improvements Specification
   3: **Specification ID:** 002-system-modernization-and-enhancements
   4: **Version:** 1.0
   5: **Date:** 2025-11-13
   6: **Status:** In Progress
   7: **Related Spec:** 001-comprehensive-modernization
   9: ## Overview
  11: This specification covers comprehensive improvements to the STOCK_VERIFY application across performance, UI/UX, security, testing, features, and architecture. These improvements will transform the app into a productio...
```

### 1393. `specs/002-system-modernization-and-enhancements/tasks.md`
- Bytes: `14193`
- Lines: `341`
- SHA256: `5cc6a7ea44202d26a94c64304921d6840c9cf301d3d6481d0b239c49571b737e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Tasks: Comprehensive App Improvements
   3: **Feature**: 002-system-modernization-and-enhancements
   4: **Input**: Design documents from `/specs/002-system-modernization-and-enhancements/`
   5: **Status**: In Progress (Generated: 2025-12-30)
   7: ---
   9: ## Format: `- [ ] [TaskID] [P?] [Story?] Description`
  11: - **[P]**: Can run in parallel (different files, no dependencies)
  12: - **[Story]**: User story label (US1, US2, US3, US4)
```

### 1394. `specs/003-stock-verification-dashboard/plan.md`
- Bytes: `2106`
- Lines: `62`
- SHA256: `1cb49c789e1903ad0de10a0ee22fbfa36c2387512456669dd82b848ca4a3e9d9`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Implementation Plan: Stock Verification Dashboard
   3: **Branch**: `003-stock-verification-dashboard` | **Date**: 2025-12-23 | **Spec**: [spec.md](spec.md)
   4: **Input**: Feature specification from `specs/003-stock-verification-dashboard/spec.md`
   6: ## Summary
   8: Implement a real-time dashboard for stock verification statistics. This includes a backend API to aggregate session data and a frontend screen in the React Native app to display progress, discrepancies, and staff perf...
  10: ## Technical Context
  12: **Language/Version**: Python 3.10+ (Backend), TypeScript/React Native (Frontend)
  13: **Primary Dependencies**: FastAPI, MongoDB (Motor), React Native, Zustand
```

### 1395. `specs/003-stock-verification-dashboard/spec.md`
- Bytes: `3494`
- Lines: `72`
- SHA256: `6cb69042ad6f3606f5f225a47b883e572b3fa81b608e71a84332be44b92f6f9d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Feature Specification: Stock Verification Dashboard
   3: **Feature Branch**: `003-stock-verification-dashboard`
   4: **Created**: 2025-12-23
   5: **Status**: Draft
   6: **Input**: User description: "Add a dashboard for stock verification statistics to help managers track progress and identify discrepancies."
   8: ## User Scenarios & Testing *(mandatory)*
  10: ### User Story 1 - View Overall Progress (Priority: P1)
  12: As a manager, I want to see a high-level summary of the current stock verification session, including total items counted vs. total items expected, so I can gauge overall progress.
```

### 1396. `specs/003-stock-verification-dashboard/tasks.md`
- Bytes: `1909`
- Lines: `43`
- SHA256: `97bbe19672d3188f47abe8144165cac41a780fab0ca1cce624b55ff4e8bc663d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Tasks: Stock Verification Dashboard
   3: **Input**: Design documents from `/specs/003-stock-verification-dashboard/`
   4: **Prerequisites**: plan.md, spec.md
   6: ## Phase 1: Setup (Shared Infrastructure)
   8: - [ ] T001 Create `backend/api/dashboard_summary_api.py` with basic router setup.
   9: - [ ] T002 Create `frontend/src/services/dashboardService.ts` for API communication.
  11: ## Phase 2: Foundational (Blocking Prerequisites)
  13: - [ ] T003 Implement `get_dashboard_summary` logic in `backend/services/dashboard_service.py` to aggregate MongoDB data.
```

### 1397. `specs/004-app-logic-docs/checklists/requirements.md`
- Bytes: `1331`
- Lines: `36`
- SHA256: `b45669425b5a4afc3480155ed1bb0700cdf422b182b50b26d291ec3a0b5a80a4`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Specification Quality Checklist: App Logic Documentation
   3: **Purpose**: Validate specification completeness and quality before proceeding to planning
   4: **Created**: 2025-12-28
   5: **Feature**: ../spec.md
   7: ## Content Quality
   9: - [x] No implementation details (languages, frameworks, APIs)
  10: - [x] Focused on user value and business needs
  11: - [x] Written for non-technical stakeholders
```

### 1398. `specs/004-app-logic-docs/contracts/existing-apis.md`
- Bytes: `3824`
- Lines: `121`
- SHA256: `6eafd81967a99e91881edc2e59237eac8314fb1da75910fbbe85469462cd6522`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Contracts: Existing APIs (Documentation Map)
   3: This is not a new API design; it’s a map from user actions to existing endpoints so documentation stays grounded in the running system.
   5: ## Auth
   7: - Login: `POST /api/auth/login`
   8: - Register: `POST /api/auth/register`
   9: - Current user (common pattern): `GET /api/auth/me` (if present in auth router)
  10: - Protected routes: Most app routes require `Authorization: Bearer <token>` via auth dependencies.
  12: Notes:
```

### 1399. `specs/004-app-logic-docs/contracts/openapi-excerpt.yaml`
- Bytes: `4605`
- Lines: `171`
- SHA256: `db7ea859bb2f69182ed5bd20bda0c59d6bca4fc7bf6280bc9878f326e4a91c75`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: openapi: 3.0.3
   2: info:
   3:   title: Stock Verify API (Excerpt)
   4:   version: "v-current"
   5:   description: |
   6:     Minimal OpenAPI excerpt for documentation purposes.
   7:     This file is not intended to be complete or authoritative; validate against `/api/docs`.
   9: servers:
```

### 1400. `specs/004-app-logic-docs/data-model.md`
- Bytes: `4897`
- Lines: `121`
- SHA256: `46e6eca6a0acc6ab18d8dfccdcae69f8d411d0d1619855977b9e171c6748cb7d`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Data Model: App Logic Documentation
   3: This is a *documentation* model: it reflects the conceptual entities and (where known) the MongoDB collections used by the Stock Verification System.
   5: ## Core Entities
   7: ### User
   8: - Key fields (conceptual): `id`, `username`, `role`, `permissions`
   9: - Used for: auth (JWT subject), authorization (RBAC), audit attribution.
  11: ### Session (Stock Verification Session)
  12: - Stored in Mongo collections:
```

### 1401. `specs/004-app-logic-docs/plan.md`
- Bytes: `12107`
- Lines: `256`
- SHA256: `53c6497c119536d33a23852c486691a19b085b15747e5c3535e23fde4d6e4b3f`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Implementation Plan: App Logic Documentation
   3: **Branch**: `004-app-logic-docs` | **Date**: 2025-12-28 | **Spec**: `specs/004-app-logic-docs/spec.md`
   4: **Input**: Feature specification from `specs/004-app-logic-docs/spec.md`
   6: **Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.
   8: ## Summary
  10: Produce a single, structured “App Logic Overview” (as documentation) that explains startup → auth → core stock verification workflow → offline sync → reporting, grounded in the actual FastAPI routes and MongoDB collec...
  12: ## Technical Context
  14: <!--
```

### 1402. `specs/004-app-logic-docs/quickstart.md`
- Bytes: `1812`
- Lines: `46`
- SHA256: `58b9cb06759a9a68a7650e0a56c1556d484028dfa0dc079c4a82eaf7c53324cd`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Quickstart: App Logic Documentation
   3: ## Purpose
   5: This spec produces an "App Logic Overview" that explains how the Stock Verification System behaves end-to-end (startup → auth → core workflows), grounded in the actual FastAPI routes and MongoDB collections.
   7: ## Where to Read
   9: - Primary output: docs/APP_LOGIC_OVERVIEW.md (long-lived overview)
  10: - Spec: `specs/004-app-logic-docs/spec.md`
  11: - Plan: `specs/004-app-logic-docs/plan.md`
  12: - Research: `specs/004-app-logic-docs/research.md`
```

### 1403. `specs/004-app-logic-docs/research.md`
- Bytes: `5547`
- Lines: `93`
- SHA256: `705abac3c28ea71bc874ea52f064cf6673e1cb660a85c3b40027888df756a4ce`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Research: App Logic Documentation
   3: ## Goal
   5: Resolve technical-context unknowns and lock decisions needed to produce accurate, low-risk app-logic documentation.
   7: ## Findings (from repository)
   9: ### Decision: Primary runtime entrypoint
  10: - Decision: Treat `uvicorn backend.server:app` as the canonical runtime entrypoint.
  11: - Rationale: `docker-compose.yml` and repo run guides consistently reference `backend.server:app`.
  12: - Alternatives considered:
```

### 1404. `specs/004-app-logic-docs/spec.md`
- Bytes: `9460`
- Lines: `142`
- SHA256: `b0d0db0214e5afa820035d343e202eb71e48b79eb7e96c07bacef1c01a5743dd`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Feature Specification: App Logic Documentation
   3: **Feature Branch**: `004-app-logic-docs`
   4: **Created**: 2025-12-28
   5: **Status**: Complete
   6: **Input**: User description: "Analyze the app logic"
   8: ## User Scenarios & Testing *(mandatory)*
  10: <!--
  11:   IMPORTANT: "Testing" in this section refers to ACCEPTANCE VALIDATION (can reviewers verify the feature works?),
```

### 1405. `specs/004-app-logic-docs/tasks.md`
- Bytes: `10845`
- Lines: `181`
- SHA256: `09666ab2d20ffa921d6f4b97c7acc02c850dcec075c16caa86cf621361896cdb`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   3: description: "Task list for App Logic Documentation"
   5: ---
   7: # Tasks: App Logic Documentation
   9: **Input**: Design documents from `specs/004-app-logic-docs/`
  10: **Prerequisites**: `specs/004-app-logic-docs/plan.md` (required), `specs/004-app-logic-docs/spec.md` (required), plus available docs: `research.md`, `data-model.md`, `contracts/`, `quickstart.md`
  12: **Tests**: Not code-level unit tests (documentation-only deliverable). **Validation** tasks in Phase 7 verify success criteria through reviewer testing and surveys.
  14: **Organization**: Tasks are grouped by user story so each story is independently reviewable.
```

### 1406. `specs/004-app-logic-docs/validation/incident-scenarios.md`
- Bytes: `6812`
- Lines: `177`
- SHA256: `f5f74bae41f895f66fd49264df0b96f452f536f2b34288c9a49b3c1cff5af8af`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Incident Scenarios for SC-003 Validation
   3: **Purpose**: Validate that support engineers can identify the correct owning subsystem for common incidents using `docs/APP_LOGIC_OVERVIEW.md` alone.
   5: **Success Criteria**:
   6: - **SC-003**: For a defined set of 5 common incidents, the time to identify the owning subsystem is reduced by at least 50% compared to a baseline without the documentation.
   8: ---
  10: ## Scenarios
  12: ### Scenario 1: "User cannot log in - keeps getting 401 Unauthorized"
  14: **Reported Symptom**:
```

### 1407. `specs/004-app-logic-docs/validation/review-survey-template.md`
- Bytes: `6609`
- Lines: `260`
- SHA256: `e004feeb0d8024895d95868c9599a34a00ce562e2f63268c0cb90887bb75aacb`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Review Survey Template for SC-004 Validation
   3: **Purpose**: Measure stakeholder satisfaction and clarity of the App Logic Overview documentation.
   5: **Success Criteria**:
   6: - **SC-004**: Stakeholders report improved clarity: at least 80% of reviewers rate the documentation as "clear" or better in a lightweight review survey.
   8: ---
  10: ## Survey Instructions
  12: **Target Audience**:
  13: - Developers (backend/frontend)
```

### 1408. `specs/004-app-logic-docs/validation/standard-questions.md`
- Bytes: `5867`
- Lines: `145`
- SHA256: `2de5765dbda28d44e0b72732d0b2efd36bd7412c5bec65a6101d583353ff934a`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Standard Questions for SC-001 & SC-002 Validation
   3: **Purpose**: Validate that a reviewer can answer these questions using `docs/APP_LOGIC_OVERVIEW.md` alone, without reading source code.
   5: **Success Criteria**:
   6: - **SC-001**: A new engineer can explain the end-to-end stock verification workflow after reading the documentation in under 30 minutes.
   7: - **SC-002**: For a defined set of 10 standard "how does this work?" questions, reviewers can answer at least 9 correctly using the documentation alone.
   9: ---
  11: ## Questions
  13: ### Q1: System Startup (FR-001)
```

## templates

### 1409. `templates/agent-file-template.md`
- Bytes: `464`
- Lines: `29`
- SHA256: `55ed438c2e861444ef22f45fe5238f3ebf0dc1cb6e53067d7232fbbf4ce82892`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # [PROJECT NAME] Development Guidelines
   3: Auto-generated from all feature plans. Last updated: [DATE]
   5: ## Active Technologies
   7: [EXTRACTED FROM ALL PLAN.MD FILES]
   9: ## Project Structure
  11: ```text
  12: [ACTUAL STRUCTURE FROM PLANS]
  13: ```
```

### 1410. `templates/checklist-template.md`
- Bytes: `1307`
- Lines: `41`
- SHA256: `0ad704b60af2df817aee1c0a2ecc0e0304b271d2de34047df1c891735967033e`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # [CHECKLIST TYPE] Checklist: [FEATURE NAME]
   3: **Purpose**: [Brief description of what this checklist covers]
   4: **Created**: [DATE]
   5: **Feature**: [Link to spec.md or relevant documentation]
   7: **Note**: This checklist is generated by the `/speckit.checklist` command based on feature context and requirements.
   9: <!--
  10:   ============================================================================
  11:   IMPORTANT: The checklist items below are SAMPLE ITEMS for illustration only.
```

### 1411. `templates/commands/analyze.md`
- Bytes: `7253`
- Lines: `188`
- SHA256: `d30f0f050c708b1da97beae86c34fff41e93e971462a1c3ef461d8ea71bb1bb2`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: description: Perform a non-destructive cross-artifact consistency and quality analysis across spec.md, plan.md, and tasks.md after task generation.
   3: scripts:
   4:   sh: scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks
   5:   ps: scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks
   6: ---
   8: ## User Input
  10: ```text
```

### 1412. `templates/commands/checklist.md`
- Bytes: `16870`
- Lines: `298`
- SHA256: `bb905b74dbcc232a76dd33f61ae53f381e096422a01d4f358d7a431481082e1b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: description: Generate a custom checklist for the current feature based on user requirements.
   3: scripts:
   4:   sh: scripts/bash/check-prerequisites.sh --json
   5:   ps: scripts/powershell/check-prerequisites.ps1 -Json
   6: ---
   8: ## Checklist Purpose: "Unit Tests for English"
  10: **CRITICAL CONCEPT**: Checklists are **UNIT TESTS FOR REQUIREMENTS WRITING** - they validate the quality, clarity, and completeness of requirements in a given domain.
```

### 1413. `templates/commands/clarify.md`
- Bytes: `11285`
- Lines: `181`
- SHA256: `ea016eaf0b9f0047d8f2157cfc774e4b26f495f246fa70775997242db02881f1`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: description: Identify underspecified areas in the current feature spec by asking up to 5 highly targeted clarification questions and encoding answers back into the spec.
   3: scripts:
   4:    sh: scripts/bash/check-prerequisites.sh --json --paths-only
   5:    ps: scripts/powershell/check-prerequisites.ps1 -Json -PathsOnly
   6: ---
   8: ## User Input
  10: ```text
```

### 1414. `templates/commands/constitution.md`
- Bytes: `5011`
- Lines: `79`
- SHA256: `4cdeaa2d5c408ef0c36c8ce6b23ce0404135a2a65a2dfb5bcc4891aa7f70b0b7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: description: Create or update the project constitution from interactive or provided principle inputs, ensuring all dependent templates stay in sync
   3: ---
   5: ## User Input
   7: ```text
   8: $ARGUMENTS
   9: ```
  11: You **MUST** consider the user input before proceeding (if not empty).
```

### 1415. `templates/commands/implement.md`
- Bytes: `7514`
- Lines: `138`
- SHA256: `74be2a020e3e1f30b7a2600b677044ca4db03b69e2f9b459f6bcdb06d82f22db`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: description: Execute the implementation plan by processing and executing all tasks defined in tasks.md
   3: scripts:
   4:   sh: scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks
   5:   ps: scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks
   6: ---
   8: ## User Input
  10: ```text
```

### 1416. `templates/commands/plan.md`
- Bytes: `3045`
- Lines: `88`
- SHA256: `be7cee4fb3d166b744a32c9640b4fa9ed5521fcfa3d43368fdb70a8e28ac52de`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: description: Execute the implementation planning workflow using the plan template to generate design artifacts.
   3: scripts:
   4:   sh: scripts/bash/setup-plan.sh --json
   5:   ps: scripts/powershell/setup-plan.ps1 -Json
   6: agent_scripts:
   7:   sh: scripts/bash/update-agent-context.sh __AGENT__
   8:   ps: scripts/powershell/update-agent-context.ps1 -AgentType __AGENT__
```

### 1417. `templates/commands/specify.md`
- Bytes: `12424`
- Lines: `253`
- SHA256: `0ea16ec78dd580967d932dc09df2cde339e0b1730ef718ac79bdb7ab3b907f86`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: description: Create or update the feature specification from a natural language feature description.
   3: scripts:
   4:   sh: scripts/bash/create-new-feature.sh --json "{ARGS}"
   5:   ps: scripts/powershell/create-new-feature.ps1 -Json "{ARGS}"
   6: ---
   8: ## User Input
  10: ```text
```

### 1418. `templates/commands/tasks.md`
- Bytes: `6136`
- Lines: `132`
- SHA256: `58c2789a13f5d186645b4b5ded27510608df4765b5446b455eafe112b2c11e47`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   2: description: Generate an actionable, dependency-ordered tasks.md for the feature based on available design artifacts.
   3: scripts:
   4:   sh: scripts/bash/check-prerequisites.sh --json
   5:   ps: scripts/powershell/check-prerequisites.ps1 -Json
   6: ---
   8: ## User Input
  10: ```text
```

### 1419. `templates/plan-template.md`
- Bytes: `3657`
- Lines: `105`
- SHA256: `d34545b3d65d9b83d179804bca1729da24007bf348f00afeb3ca660a9000fadf`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Implementation Plan: [FEATURE]
   3: **Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
   4: **Input**: Feature specification from `/specs/[###-feature-name]/spec.md`
   6: **Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.
   8: ## Summary
  10: [Extract from feature spec: primary requirement + technical approach from research]
  12: ## Technical Context
  14: <!--
```

### 1420. `templates/spec-template.md`
- Bytes: `3950`
- Lines: `116`
- SHA256: `ad98189bcae9bfd323f47898f08ecd0290e5d805c04d038b4947e1c6abd40b09`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: # Feature Specification: [FEATURE NAME]
   3: **Feature Branch**: `[###-feature-name]`
   4: **Created**: [DATE]
   5: **Status**: Draft
   6: **Input**: User description: "$ARGUMENTS"
   8: ## User Scenarios & Testing *(mandatory)*
  10: <!--
  11:   IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
```

### 1421. `templates/tasks-template.md`
- Bytes: `9170`
- Lines: `252`
- SHA256: `e63ab85ba885b469a12d69dee42385a27fc97b50ac7621f126ca3335a10ba13b`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: ---
   3: description: "Task list template for feature implementation"
   4: ---
   6: # Tasks: [FEATURE NAME]
   8: **Input**: Design documents from `/specs/[###-feature-name]/`
   9: **Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/
  11: **Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.
  13: **Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.
```

### 1422. `templates/vscode-settings.json`
- Bytes: `350`
- Lines: `14`
- SHA256: `3db3a1d8417d38a56b405f60b600dce666b4fc47be7fe332a0b051c4bd1fd4b7`
- Binary: `no`
- Decoding: `utf-8`
- Content signals: No matched symbols using generic language patterns.
- Excerpt (first non-empty lines):

```text
   1: {
   2:     "chat.promptFilesRecommendations": {
   3:         "speckit.constitution": true,
   4:         "speckit.specify": true,
   5:         "speckit.plan": true,
   6:         "speckit.tasks": true,
   7:         "speckit.implement": true
   8:     },
```

