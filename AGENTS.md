# Stock Verify System - AI & Background Agents

This guide documents the various automated processes and AI-powered interfaces within the Stock Verify System.

## 🤖 AI Assistant (CopilotKit)

The application integrates **CopilotKit** to provide an intelligent, context-aware AI assistant for Admin and Supervisor users.

- **Frontend Interface**: Located in `frontend/app/admin/ai-assistant.tsx`.
- **Purpose**: Allows users to query system status, ask questions about stock variances using natural language, and receive help with complex workflows.
- **Backend Service**: The backend utilizes the `copilotkit` library to provide a runtime endpoint (typically `/api/copilotkit`) that connects to LLMs.

## 🌉 Sync Bridge Agent

A critical background service that synchronizes inventory data from the legacy SQL Server ERP to the modern MongoDB-based system.

- **File**: `backend/scripts/sync_bridge_agent.py`
- **Operation**:
  - Pulls full item batches from SQL Server via `SQLServerConnector`.
  - Normalizes and builds item dictionaries using `_build_new_item_dict`.
  - Pushes batches to the Cloud API via `POST /api/erp/sync/batch`.
- **Configuration**: Uses `ERP_SYNC_INTERVAL` (default: 3600s) for polling frequency.

## 🛠️ Developer Standards for Agents

When contributing to or creating new agents:

1.  **Logging**: Always use the standard `logging` module. Agents should log to both `stdout` and a dedicated file.
2.  **Retry Logic**: Implement exponential backoff for network or database failures (use the `tenacity` library).
3.  **Error Handling**: Wrap loops in try-except blocks to prevent agent crashes from intermittent failures.
4.  **Security**: Use `X-Sync-Token` for agent-to-API communication.

## 🚀 Key Commands

- **Run Sync Agent**: `python backend/scripts/sync_bridge_agent.py`
- **Verify Backend Health**: `pytest backend/tests`
- **Verify Frontend Types**: `cd frontend && npx tsc --noEmit`

---

_Last Updated: February 2026_
