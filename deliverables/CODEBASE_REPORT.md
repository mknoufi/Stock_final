# Codebase Report - Stock Verify System

Scope: Full repository under d:\stk\stock-verify-system. This report summarizes architecture, major modules, data flows, testing, and operational readiness using in-repo documentation and source layout.

## Executive Summary

Stock Verify is a mobile-first inventory verification system with an offline-first workflow. It uses a FastAPI backend, MongoDB as the working database, and SQL Server as a read-only ERP source of truth. The frontend is a React Native (Expo) app with extensive domain services, UI components, and state management. The repo includes deployment artifacts (Docker, k8s, nginx), comprehensive documentation, and large test coverage for backend services.

Key references: docs/codebase_memory_v2.1.md, docs/PROJECT_REPORT.md, docs/APP_LOGIC_OVERVIEW.md, docs/TECHNICAL_SPECIFICATION.md, backend/server.py, frontend/package.json.

## System Architecture

- Backend API: FastAPI app wired in backend/server.py with extensive router modules and middleware.
- Data layer:
  - MongoDB is the primary working store for sessions, counts, users, and verification data.
  - SQL Server is a read-only ERP source for products, batches, and warehouse references.
  - Redis is referenced for locks, pubsub, and caching (optional/recommended per docs).
- Frontend: React Native (Expo SDK ~54) with offline queue, sync, and supervisor/admin views.
- Sync model: periodic and on-demand sync from SQL to Mongo; offline queue on device with batch sync and conflict handling.

## Repository Structure (Top Level)

- backend/ : FastAPI app, services, DB utilities, tests
- frontend/ : Expo app, UI components, services, state, tests
- scripts/ : operational scripts for start/stop, health checks, migrations, sync, validation
- k8s/, nginx/ : deployment configs
- docs/, deliverables/, specs/ : extensive documentation, plans, and reports
- agents/ : AI agent tooling and helper scripts

## Backend (FastAPI)

Entry point and lifecycle

- backend/server.py: app creation, router registration, CORS, middleware, lifespan startup/shutdown.
- backend/config.py: Pydantic settings with validation for secrets and environment config.

API surface (selected groups)

- Auth and access control: backend/api/auth.py, backend/api/pin_auth_api.py, backend/api/permissions_api.py, backend/api/user_management_api.py, backend/api/user_settings_api.py, backend/api/security_api.py.
- Core verification workflow: backend/api/session_management_api.py, backend/api/item_verification_api.py, backend/api/enhanced_item_api.py, backend/api/count_lines_api.py, backend/api/rack_api.py, backend/api/locations_api.py.
- Sync and ERP: backend/api/erp_api.py, backend/api/sync_batch_api.py, backend/api/sync_status_api.py, backend/api/sync_management_api.py, backend/api/sync_conflicts_api.py.
- Reporting and analytics: backend/api/report_generation_api.py, backend/api/reporting_api.py, backend/api/metrics_api.py, backend/api/dashboard_analytics_api.py.
- System and diagnostics: backend/api/health.py, backend/api/logs_api.py, backend/api/service_logs_api.py, backend/api/self_diagnosis_api.py.
- Real-time: backend/api/websocket_api.py.

Services layer highlights

- Sync/ERP: backend/services/sql_sync_service.py, backend/services/advanced_erp_sync.py, backend/services/change_detection_sync.py.
- Offline and conflict handling: backend/services/auto_sync_manager.py, backend/services/sync_conflicts_service.py, backend/services/batch_operations.py.
- Reporting: backend/services/advanced_report_service.py, backend/services/dynamic_report_service.py, backend/services/scheduled_export_service.py.
- Observability and diagnostics: backend/services/monitoring_service.py, backend/services/auto_diagnosis.py, backend/services/error_log.py.

Middleware and utilities

- Security and request handling: backend/middleware/_ and backend/utils/_.
- Notable utilities: port detection for Mongo and backend info, structured logging, auth helpers.

## Frontend (React Native + Expo)

App structure

- Expo Router screens in frontend/app/ with role-based sections (admin, supervisor, staff) and error routes.
- Core logic and UI in frontend/src/:
  - components/ : shared UI components and screen-level components
  - services/ : API clients, sync and offline queue, storage, auth, analytics, websocket
  - store/ : Zustand state for auth, sessions, filters, offline queue
  - hooks/ : domain-specific hooks for sync, permissions, scanning
  - theme/ and styles/ : design tokens, themes, unified theme system

Testing

- Unit and component tests in frontend/**tests**/ and frontend/src/\*\*/**tests**.
- Playwright is present for e2e in frontend/devDependencies.

## Key Functions and Methods (Selected)

Note: This is a curated subset of high-impact functions and methods (not exhaustive).

Backend

- backend/server.py: create_access_token (JWT encoding), get_current_user (Bearer token decode + user fetch), init_default_users (seed staff1/supervisor), check_rate_limit (login throttling via cache), generate_auth_tokens (access+refresh tokens + store refresh token), refresh_token (refresh flow handler), create_count_line (validates session/item, computes variance and risk flags, persists count line), verify_stock/unverify_stock (supervisor-only verification toggles with activity logging).
- backend/auth/dependencies.py: AuthDependencies.initialize (wire db/secret/algorithm), properties (db/secret/algorithm/security accessors), JWTValidator.extract_token/decode_token (auth header parsing + JWT validation), UserRepository.get_user_by_username, require_permissions/require_role (dependency factories for permission and role checks).
- backend/services/sql_sync_service.py: helper converters (\_normalize_date, \_numeric_or_none, \_safe_optional_str), \_build_new_item_dict/\_build_metadata_candidates/\_compute_metadata_updates (ERP item doc creation and selective metadata updates), SQLSyncService.sync_single_item_by_barcode (single item refresh), sync_variance_only (variance-only sync), discover_new_items (create missing ERP items), nightly_full_sync (full reconciliation), sync_quantities_only (quantity-only update), check_item_qty_realtime (on-demand SQL qty check), start/stop (background sync loop), sync_now/sync_items/sync_all_items (variance sync aliases), get_stats/set_interval/enable/disable (service control and metrics).
- backend/services/sync_conflicts_service.py: detect_conflict (diff local vs server data and store conflict), get_conflicts/get_conflict_by_id, resolve_conflict (apply resolution strategy and update entity), \_apply_resolved_data (writes resolved data to correct collection).
- backend/api/session_management_api.py: get_sessions/create_session/get_active_sessions, get_session_detail, get_session_stats (aggregation summary), session_heartbeat (presence + lock renewal), update_session_status, complete_session (close + release rack), get_user_session_history, check_session_integrity (detect ERP item updates post-session start).
- backend/api/enhanced_item_api.py: init_enhanced_api (wires db/cache/monitoring and SQLSyncService), \_validate_barcode_format (strict normalization), \_build_relevance_stage/\_build_match_conditions/\_get_stock_level_filter/\_build_search_pipeline (Mongo aggregation search pipeline helpers), get_item_by_barcode_enhanced (multi-source lookup with cache + monitoring).
- backend/utils/port_detector.py: save_backend_info (writes backend_port.json), PortDetector.is_port_available/find_available_port/get_backend_port, is_mongo_running/find_mongo_port/get_mongo_url/get_mongo_status, get_local_ip, generate_frontend_config.

Frontend

- frontend/src/services/syncService.ts: initializeSyncService (network listener + sync trigger), getSyncStatus (queue stats), syncOfflineQueue (batch upload from unified queue), forceSync (alias), cleanupOldFailedItems (drop items after retry threshold).
- frontend/src/services/sync/enhancedSyncManager.ts: addToQueue/getQueue/getQueueSize/clearQueue, getConflicts/clearConflicts, syncQueue/\_syncQueueInternal (batch + retry loop), syncBatch (POST /api/sync/batch), calculateBackoff, getSyncStatus.
- frontend/src/services/api/api.ts: isOnline; session methods (createSession/getSessions/getSession/getSessionStats); item lookup and search (getItemByBarcode/searchItems/searchItemsOptimized/searchItemsSemantic/getSearchSuggestions); counting (createCountLine/getCountLines/addQuantityToCountLine); admin and ops endpoints (metrics, logs, mapping, reports, exports, sync conflicts, permissions); syncBatch (batch ops endpoint); grouped API objects (sessionsApi, countLineApi, itemsApi, mappingApi, exportsApi, syncApi, metricsApi, adminControlApi, reportsApi, sqlServerApi, securityApi, settingsApi).
- frontend/src/services/auth.ts: authService.getAccessToken/getRefreshToken/refreshToken, getCurrentUser/isAuthenticated, logout.
- frontend/src/services/offlineQueue.ts: re-exports startOfflineQueue/stopOfflineQueue/attachOfflineQueueInterceptors/enqueueMutation/flushOfflineQueue/getQueueCount/listQueue/getConflicts/getConflictsCount/resolveConflict from offline queue implementation.

## Data Flow and Core Workflow

From docs/APP_LOGIC_OVERVIEW.md and docs/TECHNICAL_SPECIFICATION.md:

- Startup: backend loads config, initializes Mongo, optional SQL pool, and services, then registers routes.
- Auth: JWT-based login and refresh flows, role-based permissions for staff/supervisor/admin.
- Sessions: sessions are created and managed via /api/sessions, with heartbeat and rack lock handling.
- Item lookup: ERP lookup via enhanced item endpoints, then verification and variance capture in MongoDB.
- Offline queue: mobile captures actions offline, batches sync to backend when connectivity returns.
- Conflict handling: backend services manage dedupe and resolution; supervisor views in UI.

## Testing and Quality

- Backend tests: extensive suite under backend/tests, plus evaluation tooling under backend/tests/evaluation.
- Frontend tests: Jest and RN testing library based suites.
- Test artifacts present (pytest_output.txt, test_output.txt, frontend/test-results/).

## Deployment and Ops

- docker-compose.yml and docker-compose.prod.yml for local and production-like runs.
- k8s/ contains deployment/configmap/service manifests.
- nginx/nginx.conf for reverse proxy routing.
- scripts/ includes start/stop, health checks, validation, and data maintenance tasks.

## Observability and Diagnostics

- Health endpoints in backend/api/health.py.
- Log and diagnostics APIs in backend/api/logs_api.py and backend/api/self_diagnosis_api.py.
- Error logging and auto-diagnosis services in backend/services/.

## Risks and Notable Issues

- README.md contains unresolved merge conflict markers; this should be resolved to avoid onboarding confusion.
- Working tree includes build/test artifacts (node_modules, .venv, coverage_html, test outputs), which can obscure repo status and inflate size.

## Suggested Next Steps

1. Resolve the README.md merge conflict and align content with the active documentation set.
2. Decide whether artifact directories should be gitignored or moved to a separate workspace.
3. Validate core flows end-to-end (login, session, item verification, offline sync) with current environment configs.

## References

- docs/codebase_memory_v2.1.md
- docs/PROJECT_REPORT.md
- docs/APP_LOGIC_OVERVIEW.md
- docs/TECHNICAL_SPECIFICATION.md
- docs/PRODUCTION_STATUS_SUMMARY.md
- backend/server.py
- backend/config.py
- frontend/package.json
