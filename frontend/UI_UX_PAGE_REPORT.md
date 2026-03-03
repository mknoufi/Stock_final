# UI/UX Page Report

Generated: 2026-02-17 19:12:23

Scope: `frontend/app/**/*.tsx` route files excluding `_layout.tsx`.

Total route files reviewed: 60

## Summary

- Admin: 18 pages
- Public: 12 pages
- Staff: 10 pages
- Supervisor: 20 pages

## Page-by-Page Inventory

| Area | Route | File | Purpose | Key Features | UI Patterns | LOC | UX Risk Notes |
|---|---|---|---|---|---|---:|---|
| Public | `/` | `index.tsx` | App bootstrap/loading and auth-aware routing gateway | Appearance/settings controls; Startup initialization state | Form Input | 190 | Form interactions; keep validation and error messaging explicit. |
| Public | `/+not-found` | `+not-found.tsx` | Fallback page for unknown routes | Core informational content | Static Content | 50 | Low structural risk from static analysis. |
| Admin | `/admin` | `admin/index.tsx` | Admin Index - Default route redirects to dashboard | Role-based redirect | Redirect | 9 | Low structural risk from static analysis. |
| Admin | `/admin/ai-assistant` | `admin/ai-assistant.tsx` | Ai Assistant page for operational workflows | Appearance/settings controls; Copilot AI assistant interaction | Form Input | 270 | Form interactions; keep validation and error messaging explicit. |
| Admin | `/admin/control-panel` | `admin/control-panel.tsx` | Control Panel page for operational workflows | KPI and analytics visualization; User/role management actions; Appearance/settings controls | Analytics, Form Input, Settings | 1021 | Large screen complexity; enforce strict component boundaries. Form interactions; keep validation and error messaging explicit. |
| Admin | `/admin/control-panel-v2` | `admin/control-panel-v2.tsx` | Admin Control Panel v2.0 - Aurora Design Features: - Real-time system health monitoring - Service status management (Backend, Frontend, DB) - Critical issues tracking - System statistics - Aurora UI components (Glass cards, gradients, animations) | Realtime status updates; User/role management actions; Appearance/settings controls | Form Input, Realtime Updates, Settings | 608 | Live data updates; throttle rendering and show stale/offline indicators. Form interactions; keep validation and error messaging explicit. |
| Admin | `/admin/dashboard` | `admin/dashboard.tsx` | Dashboard page for operational workflows | KPI and analytics visualization; Realtime status updates; User/role management actions; Appearance/settings controls | Camera/Scan, Analytics, Form Input, Realtime Updates | 406 | Camera path present; validate permission-denied and offline fallback UX. Live data updates; throttle rendering and show stale/offline indicators. Form interactions; keep validation and error messaging explicit. |
| Admin | `/admin/dashboard-web` | `admin/dashboard-web.tsx` | Admin Dashboard Web v2.0 - Aurora Design System Features: - Real-time system monitoring (Health, Stats, Sessions) - Interactive charts (Line, Bar, Pie) - Detailed reporting engine - Analytics and metrics - Aurora UI components (Glassmorphism, Gradients) | KPI and analytics visualization; Modal-based task flows; Realtime status updates; Appearance/settings controls; Export/download operations | Analytics, Form Input, Modal Flow, Realtime Updates | 1381 | Large screen complexity; enforce strict component boundaries. Many modal states; verify keyboard/focus and dismissal consistency. Live data updates; throttle rendering and show stale/offline indicators. Form interactions; keep validation and error messaging explicit. |
| Admin | `/admin/item-live-detail` | `admin/item-live-detail.tsx` | Item Live Detail page for operational workflows | Password/OTP recovery; KPI and analytics visualization; Realtime status updates; Appearance/settings controls; Export/download operations | Analytics, Form Input, Realtime Updates | 599 | Live data updates; throttle rendering and show stale/offline indicators. Form interactions; keep validation and error messaging explicit. |
| Admin | `/admin/live-view` | `admin/live-view.tsx` | Live View page for operational workflows | Password/OTP recovery; KPI and analytics visualization; Realtime status updates; User/role management actions; Appearance/settings controls | Analytics, Form Input, Realtime Updates | 614 | Live data updates; throttle rendering and show stale/offline indicators. Form interactions; keep validation and error messaging explicit. |
| Admin | `/admin/logs` | `admin/logs.tsx` | Logs page for operational workflows | Realtime status updates; Appearance/settings controls | Form Input, Realtime Updates | 303 | Live data updates; throttle rendering and show stale/offline indicators. Form interactions; keep validation and error messaging explicit. |
| Admin | `/admin/metrics` | `admin/metrics.tsx` | Metrics page for operational workflows | KPI and analytics visualization; User/role management actions; Appearance/settings controls | Analytics, Form Input, Settings | 981 | Large screen complexity; enforce strict component boundaries. Form interactions; keep validation and error messaging explicit. |
| Admin | `/admin/permissions` | `admin/permissions.tsx` | Permissions page for operational workflows | User/role management actions; Appearance/settings controls | Form Input | 491 | Form interactions; keep validation and error messaging explicit. |
| Admin | `/admin/realtime-dashboard` | `admin/realtime-dashboard.tsx` | Realtime Dashboard page for operational workflows | Password/OTP recovery; Barcode/serial scanning workflows; Modal-based task flows; Realtime status updates; Appearance/settings controls | Camera/Scan, Form Input, Modal Flow, Realtime Updates, Settings | 1195 | Large screen complexity; enforce strict component boundaries. Many modal states; verify keyboard/focus and dismissal consistency. Camera path present; validate permission-denied and offline fallback UX. Live data updates; throttle rendering and show stale/offline indicators. Form interactions; keep validation and error messaging explicit. |
| Admin | `/admin/reports` | `admin/reports.tsx` | Reports page for operational workflows | User/role management actions; Appearance/settings controls; Export/download operations; Report query and generation | Form Input | 390 | Form interactions; keep validation and error messaging explicit. |
| Admin | `/admin/security` | `admin/security.tsx` | Security page for operational workflows | KPI and analytics visualization; Realtime status updates; Appearance/settings controls | Analytics, Form Input, Realtime Updates | 857 | Live data updates; throttle rendering and show stale/offline indicators. Form interactions; keep validation and error messaging explicit. |
| Admin | `/admin/settings` | `admin/settings.tsx` | Settings page for operational workflows | Realtime status updates; Appearance/settings controls | Form Input, Realtime Updates, Settings | 485 | Live data updates; throttle rendering and show stale/offline indicators. Form interactions; keep validation and error messaging explicit. |
| Admin | `/admin/sql-config` | `admin/sql-config.tsx` | Sql Config page for operational workflows | Realtime status updates; Appearance/settings controls | Form Input, Realtime Updates, Settings | 433 | Live data updates; throttle rendering and show stale/offline indicators. Form interactions; keep validation and error messaging explicit. |
| Admin | `/admin/unknown-items` | `admin/unknown-items.tsx` | Unknown Items page for operational workflows | Structured list/table view; Barcode/serial scanning workflows; Modal-based task flows; User/role management actions; Appearance/settings controls | Camera/Scan, Data List, Form Input, Modal Flow | 336 | Many modal states; verify keyboard/focus and dismissal consistency. Camera path present; validate permission-denied and offline fallback UX. Form interactions; keep validation and error messaging explicit. |
| Admin | `/admin/users` | `admin/users.tsx` | User Management Screen Admin panel for managing users - list, create, edit, delete | Modal-based task flows; User/role management actions; Appearance/settings controls | Form Input, Modal Flow | 1060 | Large screen complexity; enforce strict component boundaries. Many modal states; verify keyboard/focus and dismissal consistency. Form interactions; keep validation and error messaging explicit. |
| Public | `/debug` | `debug.tsx` | Developer troubleshooting and diagnostics page | Core informational content | Form Input | 25 | Form interactions; keep validation and error messaging explicit. |
| Public | `/forgot-password` | `forgot-password.tsx` | Forgot Password Screen Initiates the password reset flow via WhatsApp OTP | Password/OTP recovery; Appearance/settings controls | Form Input | 115 | Form interactions; keep validation and error messaging explicit. |
| Public | `/help` | `help.tsx` | Help Screen - App documentation and help Refactored to use Aurora Design System | KPI and analytics visualization; Barcode/serial scanning workflows; Appearance/settings controls | Camera/Scan, Analytics, Form Input, Settings | 508 | Camera path present; validate permission-denied and offline fallback UX. Form interactions; keep validation and error messaging explicit. |
| Public | `/login` | `login.tsx` | Modern Login Screen - Lavanya Mart Stock Verify Clean, accessible login with modern design | Credential/PIN authentication; Password/OTP recovery; Appearance/settings controls; Offline/sync conflict handling | Form Input, Settings | 756 | Form interactions; keep validation and error messaging explicit. |
| Public | `/notifications` | `notifications.tsx` | Notifications Screen - Display user notifications Part of FR-M-23: Recount notifications | Structured list/table view; Barcode/serial scanning workflows; Appearance/settings controls | Camera/Scan, Data List, Form Input, Settings | 348 | Camera path present; validate permission-denied and offline fallback UX. Form interactions; keep validation and error messaging explicit. |
| Public | `/otp-verification` | `otp-verification.tsx` | OTP Verification Screen Verifies the 6-digit code sent via WhatsApp | Password/OTP recovery; Appearance/settings controls | Form Input | 162 | Form interactions; keep validation and error messaging explicit. |
| Public | `/register` | `register.tsx` | User registration and account setup flow | Password/OTP recovery; Offline/sync conflict handling | Form Input | 534 | Form interactions; keep validation and error messaging explicit. |
| Public | `/reset-password` | `reset-password.tsx` | Reset Password Screen Final step: Set new password using the validated reset token | Appearance/settings controls | Form Input | 127 | Form interactions; keep validation and error messaging explicit. |
| Public | `/security` | `security.tsx` | Security preferences and session/device controls | Appearance/settings controls | Form Input, Settings | 259 | Form interactions; keep validation and error messaging explicit. |
| Staff | `/staff` | `staff/index.tsx` | Staff Index - Default route redirects to home | Role-based redirect | Redirect | 9 | Low structural risk from static analysis. |
| Staff | `/staff/appearance` | `staff/appearance.tsx` | Appearance Settings Screen for Staff Allows staff users to customize theme, patterns, and layout arrangements | User/role management actions; Appearance/settings controls | Settings | 31 | Low structural risk from static analysis. |
| Staff | `/staff/components/SectionLists` | `staff/components/SectionLists.tsx` | Sectionlists page for operational workflows | Structured list/table view; Appearance/settings controls | Camera/Scan, Data List, Form Input | 578 | Camera path present; validate permission-denied and offline fallback UX. Form interactions; keep validation and error messaging explicit. |
| Staff | `/staff/history` | `staff/history.tsx` | History page for operational workflows | Modal-based task flows; Appearance/settings controls | Form Input, Modal Flow | 565 | Many modal states; verify keyboard/focus and dismissal consistency. Form interactions; keep validation and error messaging explicit. |
| Staff | `/staff/home` | `staff/home.tsx` | Home page for operational workflows | Barcode/serial scanning workflows; Appearance/settings controls | Camera/Scan, Form Input | 547 | Camera path present; validate permission-denied and offline fallback UX. Form interactions; keep validation and error messaging explicit. |
| Staff | `/staff/item-detail` | `staff/item-detail.tsx` | Modern Item Detail Screen - Lavanya Mart Stock Verify Clean, efficient item verification interface | Password/OTP recovery; Structured list/table view; Barcode/serial scanning workflows; Modal-based task flows; Realtime status updates | Camera/Scan, Data List, Form Input, Modal Flow, Realtime Updates, Settings | 4400 | Very large screen file; break into smaller feature modules. Many modal states; verify keyboard/focus and dismissal consistency. Camera path present; validate permission-denied and offline fallback UX. Live data updates; throttle rendering and show stale/offline indicators. Form interactions; keep validation and error messaging explicit. |
| Staff | `/staff/new-session` | `staff/new-session.tsx` | New Session page for operational workflows | Password/OTP recovery; Appearance/settings controls; Session creation and setup | Camera/Scan, Form Input | 343 | Camera path present; validate permission-denied and offline fallback UX. Form interactions; keep validation and error messaging explicit. |
| Staff | `/staff/scan` | `staff/scan.tsx` | Modern Scan Screen - Lavanya Mart Stock Verify Clean, efficient scanning interface | Password/OTP recovery; Barcode/serial scanning workflows; Modal-based task flows; Realtime status updates; User/role management actions | Camera/Scan, Form Input, Modal Flow, Realtime Updates, Settings | 1960 | Very large screen file; break into smaller feature modules. Many modal states; verify keyboard/focus and dismissal consistency. Camera path present; validate permission-denied and offline fallback UX. Live data updates; throttle rendering and show stale/offline indicators. Form interactions; keep validation and error messaging explicit. |
| Staff | `/staff/serial-scanner` | `staff/serial-scanner.tsx` | Serial Scanner page for operational workflows | Barcode/serial scanning workflows; User/role management actions; Appearance/settings controls | Camera/Scan, Form Input, Settings | 322 | Camera path present; validate permission-denied and offline fallback UX. Form interactions; keep validation and error messaging explicit. |
| Staff | `/staff/settings` | `staff/settings.tsx` | Staff Settings Screen - Modern Minimal Design Essential settings for staff users with clean UI | Barcode/serial scanning workflows; User/role management actions; Appearance/settings controls | Camera/Scan, Form Input, Settings | 714 | Camera path present; validate permission-denied and offline fallback UX. Form interactions; keep validation and error messaging explicit. |
| Supervisor | `/supervisor` | `supervisor/index.tsx` | Supervisor Index - Default route redirects to dashboard | Role-based redirect | Redirect | 9 | Low structural risk from static analysis. |
| Supervisor | `/supervisor/activity-logs` | `supervisor/activity-logs.tsx` | Activity Logs Screen - View application activity and audit logs Refactored to use Aurora Design System | Barcode/serial scanning workflows; Appearance/settings controls | Camera/Scan, Form Input, Settings | 464 | Camera path present; validate permission-denied and offline fallback UX. Form interactions; keep validation and error messaging explicit. |
| Supervisor | `/supervisor/appearance` | `supervisor/appearance.tsx` | Appearance Settings Screen Allows users to customize theme, patterns, and layout arrangements | User/role management actions; Appearance/settings controls | Settings | 30 | Low structural risk from static analysis. |
| Supervisor | `/supervisor/dashboard` | `supervisor/dashboard.tsx` | Dashboard page for operational workflows | KPI and analytics visualization; Modal-based task flows; Realtime status updates; Offline/sync conflict handling | Analytics, Form Input, Modal Flow, Realtime Updates | 789 | Many modal states; verify keyboard/focus and dismissal consistency. Live data updates; throttle rendering and show stale/offline indicators. Form interactions; keep validation and error messaging explicit. |
| Supervisor | `/supervisor/db-mapping` | `supervisor/db-mapping.tsx` | Database Mapping Configuration Screen Allows supervisors to select tables and columns for ERP mapping Deep Ocean Design System | Barcode/serial scanning workflows; Modal-based task flows; Appearance/settings controls | Camera/Scan, Form Input, Modal Flow, Settings | 1056 | Large screen complexity; enforce strict component boundaries. Many modal states; verify keyboard/focus and dismissal consistency. Camera path present; validate permission-denied and offline fallback UX. Form interactions; keep validation and error messaging explicit. |
| Supervisor | `/supervisor/dead-letter` | `supervisor/dead-letter.tsx` | Dead Letter page for operational workflows | Password/OTP recovery; Realtime status updates; Appearance/settings controls; Offline/sync conflict handling | Form Input, Realtime Updates | 508 | Live data updates; throttle rendering and show stale/offline indicators. Form interactions; keep validation and error messaging explicit. |
| Supervisor | `/supervisor/error-logs` | `supervisor/error-logs.tsx` | Error Logs Screen - View application errors and exceptions for monitoring Refactored to use Aurora Design System | Modal-based task flows; Appearance/settings controls | Form Input, Modal Flow, Settings | 1073 | Large screen complexity; enforce strict component boundaries. Many modal states; verify keyboard/focus and dismissal consistency. Form interactions; keep validation and error messaging explicit. |
| Supervisor | `/supervisor/export` | `supervisor/export.tsx` | Export Reports Screen Refactored to use Deep Ocean Design System | KPI and analytics visualization; Appearance/settings controls; Export/download operations; Manual report export controls | Analytics, Form Input, Settings | 452 | Form interactions; keep validation and error messaging explicit. |
| Supervisor | `/supervisor/export-results` | `supervisor/export-results.tsx` | Export Results Screen Displays a list of export jobs and allows downloading completed exports. Refactored to use Deep Ocean Design System | Appearance/settings controls; Export/download operations; Export job history and download | Form Input, Settings | 542 | Form interactions; keep validation and error messaging explicit. |
| Supervisor | `/supervisor/export-schedules` | `supervisor/export-schedules.tsx` | Export Schedules Screen Allows creating, editing, and managing automated export schedules. Refactored to use Deep Ocean Design System | Modal-based task flows; Appearance/settings controls; Export/download operations; Scheduled export management | Form Input, Modal Flow, Settings | 803 | Many modal states; verify keyboard/focus and dismissal consistency. Form interactions; keep validation and error messaging explicit. |
| Supervisor | `/supervisor/items` | `supervisor/items.tsx` | Items page for operational workflows | Password/OTP recovery; Appearance/settings controls; Export/download operations | Form Input | 579 | Form interactions; keep validation and error messaging explicit. |
| Supervisor | `/supervisor/notes` | `supervisor/notes.tsx` | Notes Screen Manage supervisor notes Refactored to use Aurora Design System | Appearance/settings controls | Form Input, Settings | 402 | Form interactions; keep validation and error messaging explicit. |
| Supervisor | `/supervisor/offline-queue` | `supervisor/offline-queue.tsx` | Offline Queue Screen Manage offline actions and conflicts Refactored to use Aurora Design System | Appearance/settings controls; Offline/sync conflict handling | Form Input, Settings | 472 | Form interactions; keep validation and error messaging explicit. |
| Supervisor | `/supervisor/session/[id]` | `supervisor/session/[id].tsx` | Session Detail page for operational workflows | Password/OTP recovery; Barcode/serial scanning workflows; Appearance/settings controls | Camera/Scan, Form Input | 745 | Camera path present; validate permission-denied and offline fallback UX. Form interactions; keep validation and error messaging explicit. |
| Supervisor | `/supervisor/sessions` | `supervisor/sessions.tsx` | Sessions page for operational workflows | Password/OTP recovery; Barcode/serial scanning workflows; Appearance/settings controls | Camera/Scan, Form Input | 419 | Camera path present; validate permission-denied and offline fallback UX. Form interactions; keep validation and error messaging explicit. |
| Supervisor | `/supervisor/settings` | `supervisor/settings.tsx` | Settings Screen - App settings and preferences Refactored to use Aurora Design System | Barcode/serial scanning workflows; Modal-based task flows; Appearance/settings controls | Camera/Scan, Form Input, Modal Flow, Settings | 489 | Many modal states; verify keyboard/focus and dismissal consistency. Camera path present; validate permission-denied and offline fallback UX. Form interactions; keep validation and error messaging explicit. |
| Supervisor | `/supervisor/sync-conflicts` | `supervisor/sync-conflicts.tsx` | Sync Conflicts Screen Review and resolve data synchronization conflicts Refactored to use Aurora Design System | Modal-based task flows; Appearance/settings controls; Offline/sync conflict handling | Form Input, Modal Flow, Settings | 899 | Many modal states; verify keyboard/focus and dismissal consistency. Form interactions; keep validation and error messaging explicit. |
| Supervisor | `/supervisor/variance-details` | `supervisor/variance-details.tsx` | Variance Details page for operational workflows | Password/OTP recovery; Barcode/serial scanning workflows; Modal-based task flows; Appearance/settings controls; Detailed variance investigation | Camera/Scan, Form Input, Modal Flow, Settings | 1306 | Large screen complexity; enforce strict component boundaries. Many modal states; verify keyboard/focus and dismissal consistency. Camera path present; validate permission-denied and offline fallback UX. Form interactions; keep validation and error messaging explicit. |
| Supervisor | `/supervisor/variances` | `supervisor/variances.tsx` | Variance List Screen Displays all items with variances (verified qty != system qty) Refactored to use Aurora Design System | Password/OTP recovery; Modal-based task flows; Appearance/settings controls; Export/download operations; Variance triage and review queue | Camera/Scan, Form Input, Modal Flow | 1560 | Very large screen file; break into smaller feature modules. Many modal states; verify keyboard/focus and dismissal consistency. Camera path present; validate permission-denied and offline fallback UX. Form interactions; keep validation and error messaging explicit. |
| Supervisor | `/supervisor/watchtower` | `supervisor/watchtower.tsx` | Watchtower page for operational workflows | KPI and analytics visualization; Realtime status updates; Appearance/settings controls; Offline/sync conflict handling; Supervisor watchtower monitoring | Camera/Scan, Analytics, Form Input, Realtime Updates, Settings | 605 | Camera path present; validate permission-denied and offline fallback UX. Live data updates; throttle rendering and show stale/offline indicators. Form interactions; keep validation and error messaging explicit. |
| Public | `/welcome` | `welcome.tsx` | Landing/onboarding screen with role entry points | Password/OTP recovery; Barcode/serial scanning workflows; Realtime status updates; Appearance/settings controls; Role-driven entry points | Camera/Scan, Form Input, Realtime Updates | 654 | Camera path present; validate permission-denied and offline fallback UX. Live data updates; throttle rendering and show stale/offline indicators. Form interactions; keep validation and error messaging explicit. |

## Notes

- This report is based on static code inspection, not runtime screen captures.
- `staff/components/SectionLists.tsx` is inside the app folder and included in this inventory, but appears to be a shared screen component rather than a direct route entrypoint.
- `Key Features` are inferred from route names, comments, and explicit code signals, capped to the top 5 per page for readability.

## User-Wise Workflow

### Public User Workflow (Unauthenticated)

1. Entry: `/` -> `/welcome`
2. Authentication path: `/login`
3. Recovery path: `/forgot-password` -> `/otp-verification` -> `/reset-password`
4. Support path: `/help`
5. Post-login auto-redirect (by role): Staff -> `/staff/home`, Supervisor -> `/supervisor/dashboard`, Admin -> `/admin/dashboard`

### Staff Workflow

1. Landing: `/staff` -> `/staff/home`
2. Start work session: `/staff/new-session`
3. Execute scanning: `/staff/scan` and `/staff/serial-scanner`
4. Verify item details and submit: `/staff/item-detail`
5. Review history: `/staff/history`
6. Personal preferences: `/staff/settings` and `/staff/appearance`
7. Shared utilities available during flow: `/notifications`, `/help`, `/security`

### Supervisor Workflow

1. Landing: `/supervisor` -> `/supervisor/dashboard`
2. Monitor active sessions: `/supervisor/sessions` -> `/supervisor/session/[id]`
3. Variance management: `/supervisor/variances` -> `/supervisor/variance-details`
4. Resolve data issues: `/supervisor/sync-conflicts`, `/supervisor/offline-queue`, `/supervisor/dead-letter`
5. Governance and logs: `/supervisor/activity-logs`, `/supervisor/error-logs`, `/supervisor/watchtower`
6. Data mapping and control: `/supervisor/db-mapping`, `/supervisor/items`, `/supervisor/notes`
7. Reporting and export: `/supervisor/export`, `/supervisor/export-schedules`, `/supervisor/export-results`
8. Preferences: `/supervisor/settings` and `/supervisor/appearance`

### Admin Workflow

1. Landing: `/admin` -> `/admin/dashboard`
2. Command and monitoring views: `/admin/dashboard-web`, `/admin/control-panel`, `/admin/control-panel-v2`, `/admin/realtime-dashboard`, `/admin/live-view`, `/admin/item-live-detail`
3. User and access governance: `/admin/users`, `/admin/permissions`, `/admin/security`
4. Configuration and operations: `/admin/settings`, `/admin/sql-config`, `/admin/unknown-items`, `/admin/logs`
5. Intelligence and analysis: `/admin/metrics`, `/admin/reports`, `/admin/ai-assistant`
6. Shared utilities available during flow: `/notifications`, `/help`, `/security`

## Route Matrix

| Area | Route | Main Components | APIs/Services Used | Primary Actions |
|---|---|---|---|---|
| Public | `/` | AuroraBackground, GlassCard | logging, authStore | Navigate/redirect, Authenticate, Create/start session, Export/download, Manage settings/access |
| Public | `/+not-found` | - | - | Create/start session, Export/download |
| Admin | `/admin` | - | - | Navigate/redirect, Export/download, Monitor KPIs/live status |
| Admin | `/admin/ai-assistant` | ui | httpClient | Create/start session, Export/download, Resolve sync/offline, Manage settings/access |
| Admin | `/admin/control-panel` | ui | api | Authenticate, Create/start session, Submit/update data, Export/download, Resolve sync/offline |
| Admin | `/admin/control-panel-v2` | ui | api | Authenticate, Create/start session, Export/download, Resolve sync/offline, Monitor KPIs/live status |
| Admin | `/admin/dashboard` | ui, ToastProvider, AutoGrid | api, httpClient | Authenticate, Scan items, Create/start session, Submit/update data, Export/download |
| Admin | `/admin/dashboard-web` | ScreenContainer, GlassCard, AnimatedPressable, SimpleLineChart, SimpleBarChart | api | Authenticate, Create/start session, Submit/update data, Delete/remove records, Export/download |
| Admin | `/admin/item-live-detail` | GlassCard, ui | itemVerificationApi, httpClient | Recover account, Create/start session, Export/download, Resolve sync/offline, Review/approve variances |
| Admin | `/admin/live-view` | GlassCard, ui | itemVerificationApi, httpClient | Recover account, Create/start session, Submit/update data, Export/download, Resolve sync/offline |
| Admin | `/admin/logs` | ui | api | Create/start session, Export/download, Resolve sync/offline, Manage settings/access |
| Admin | `/admin/metrics` | ui | api | Create/start session, Submit/update data, Export/download, Resolve sync/offline, Monitor KPIs/live status |
| Admin | `/admin/permissions` | ui, GlassCard, AnimatedPressable | api | Create/start session, Delete/remove records, Export/download, Resolve sync/offline, Manage settings/access |
| Admin | `/admin/realtime-dashboard` | ui | api | Recover account, Scan items, Create/start session, Submit/update data, Delete/remove records |
| Admin | `/admin/reports` | ui | api | Create/start session, Delete/remove records, Export/download, Resolve sync/offline, Monitor KPIs/live status |
| Admin | `/admin/security` | ui, GlassCard, AnimatedPressable | api | Authenticate, Create/start session, Submit/update data, Export/download, Resolve sync/offline |
| Admin | `/admin/settings` | AppearanceSettings, ui | api | Create/start session, Submit/update data, Export/download, Resolve sync/offline, Monitor KPIs/live status |
| Admin | `/admin/sql-config` | ScreenContainer, GlassCard, AnimatedPressable | api | Create/start session, Submit/update data, Export/download, Resolve sync/offline, Manage settings/access |
| Admin | `/admin/unknown-items` | ui | api | Scan items, Create/start session, Submit/update data, Delete/remove records, Export/download |
| Admin | `/admin/users` | ui, UserFormModal | httpClient | Authenticate, Create/start session, Submit/update data, Delete/remove records, Export/download |
| Public | `/debug` | - | - | Export/download |
| Public | `/forgot-password` | AuthScreenShell, ModernCard, ModernInput, ModernButton | httpClient, logging | Recover account, Create/start session, Export/download, Resolve sync/offline, Manage settings/access |
| Public | `/help` | ui | - | Authenticate, Scan items, Create/start session, Submit/update data, Delete/remove records |
| Public | `/login` | ui, ModernButton, ModernCard, ModernInput | httpClient, authStore, settingsStore | Navigate/redirect, Authenticate, Recover account, Create/start session, Submit/update data |
| Public | `/notifications` | ui, ModernCard, VirtualList | api | Authenticate, Scan items, Create/start session, Submit/update data, Export/download |
| Public | `/otp-verification` | AuthScreenShell, ModernCard, ModernInput, ModernButton | httpClient, logging | Recover account, Create/start session, Export/download, Resolve sync/offline, Manage settings/access |
| Public | `/register` | AppLogo | asyncStorageService, logging, api, authStore | Navigate/redirect, Authenticate, Recover account, Create/start session, Submit/update data |
| Public | `/reset-password` | AuthScreenShell, ModernCard, ModernInput, ModernButton | httpClient, logging | Navigate/redirect, Authenticate, Create/start session, Export/download, Resolve sync/offline |
| Public | `/security` | ui, ModernCard, ModernInput, ModernButton | authStore, settingsStore | Authenticate, Create/start session, Submit/update data, Export/download, Resolve sync/offline |
| Staff | `/staff` | - | - | Navigate/redirect, Export/download |
| Staff | `/staff/appearance` | ui, ScreenContainer | - | Authenticate, Export/download, Manage settings/access |
| Staff | `/staff/components/SectionLists` | ui | - | Scan items, Create/start session, Submit/update data, Export/download, Manage settings/access |
| Staff | `/staff/history` | PinEntryModal, PullToRefresh, BottomSheet, LoadingSkeleton, SwipeableRow | api, haptics, authStore | Authenticate, Create/start session, Delete/remove records, Export/download, Resolve sync/offline |
| Staff | `/staff/home` | ScreenContainer, GlassCard, LoadingSpinner | authStore | Scan items, Create/start session, Submit/update data, Export/download, Resolve sync/offline |
| Staff | `/staff/item-detail` | SerialScannerModal, PhotoCaptureModal, VarianceReasonModal, BatchListCard, ui | api, httpClient, enhancedFeatures, toastService, settingsStore | Authenticate, Recover account, Scan items, Create/start session, Submit/update data |
| Staff | `/staff/new-session` | ui | api, toastService | Recover account, Scan items, Create/start session, Submit/update data, Export/download |
| Staff | `/staff/scan` | CameraView, ui, SearchableSelectModal | api, enhancedFeatures, toastService, websocket, authStore | Authenticate, Recover account, Scan items, Create/start session, Submit/update data |
| Staff | `/staff/serial-scanner` | CameraView, ui, ModernButton | - | Authenticate, Scan items, Create/start session, Export/download, Manage settings/access |
| Staff | `/staff/settings` | AppearanceSettings, ui | authStore, settingsStore | Authenticate, Scan items, Create/start session, Submit/update data, Export/download |
| Supervisor | `/supervisor` | - | - | Navigate/redirect, Export/download, Monitor KPIs/live status |
| Supervisor | `/supervisor/activity-logs` | ToastProvider, ui | api | Authenticate, Scan items, Create/start session, Submit/update data, Export/download |
| Supervisor | `/supervisor/appearance` | ui, ScreenContainer | - | Authenticate, Export/download, Manage settings/access |
| Supervisor | `/supervisor/dashboard` | ui, ToastProvider, CommandCenterLayout, AutoGrid | api, httpClient | Create/start session, Submit/update data, Export/download, Resolve sync/offline, Review/approve variances |
| Supervisor | `/supervisor/db-mapping` | ToastProvider, ui | api | Scan items, Create/start session, Submit/update data, Export/download, Resolve sync/offline |
| Supervisor | `/supervisor/dead-letter` | ui, ToastProvider | itemVerificationApi, authStore | Recover account, Create/start session, Export/download, Resolve sync/offline, Monitor KPIs/live status |
| Supervisor | `/supervisor/error-logs` | ToastProvider, ui | api | Create/start session, Submit/update data, Export/download, Resolve sync/offline, Manage settings/access |
| Supervisor | `/supervisor/export` | LogoutButton, ui | api, exportService | Authenticate, Create/start session, Submit/update data, Export/download, Resolve sync/offline |
| Supervisor | `/supervisor/export-results` | ui | api | Create/start session, Submit/update data, Delete/remove records, Export/download, Resolve sync/offline |
| Supervisor | `/supervisor/export-schedules` | ui | api | Create/start session, Submit/update data, Delete/remove records, Export/download, Resolve sync/offline |
| Supervisor | `/supervisor/items` | ItemFilters, ui | itemVerificationApi | Recover account, Create/start session, Submit/update data, Export/download, Resolve sync/offline |
| Supervisor | `/supervisor/notes` | ui, ToastProvider | notesApi | Create/start session, Submit/update data, Delete/remove records, Export/download, Resolve sync/offline |
| Supervisor | `/supervisor/offline-queue` | ui | offlineQueue, httpClient | Create/start session, Submit/update data, Export/download, Resolve sync/offline, Manage settings/access |
| Supervisor | `/supervisor/session/[id]` | ToastProvider, ui, EnhancedButton, SkeletonList | api, itemVerificationApi | Recover account, Scan items, Create/start session, Submit/update data, Delete/remove records |
| Supervisor | `/supervisor/sessions` | ui, ToastProvider, SkeletonList | api | Recover account, Scan items, Create/start session, Submit/update data, Export/download |
| Supervisor | `/supervisor/settings` | AppearanceSettings, ui, settings | settingsStore | Scan items, Create/start session, Submit/update data, Export/download, Resolve sync/offline |
| Supervisor | `/supervisor/sync-conflicts` | ui | api | Create/start session, Submit/update data, Delete/remove records, Export/download, Resolve sync/offline |
| Supervisor | `/supervisor/variance-details` | ui, RescanRequestModal, ApproveWithRemarkModal, SupervisorVerifyModal, ToastProvider | itemVerificationApi, api, logging, ReliableItemVerificationAPI | Recover account, Scan items, Create/start session, Export/download, Resolve sync/offline |
| Supervisor | `/supervisor/variances` | SkeletonList, ItemFilters, ui, RescanRequestModal, ApproveWithRemarkModal | itemVerificationApi, toastService | Recover account, Scan items, Create/start session, Submit/update data, Delete/remove records |
| Supervisor | `/supervisor/watchtower` | ui | api | Scan items, Create/start session, Submit/update data, Export/download, Resolve sync/offline |
| Public | `/welcome` | - | logging, publicAnalyticsService, analyticsService, authStore | Navigate/redirect, Authenticate, Recover account, Scan items, Create/start session |

