# Stock Verify System - OpenMemory Guide

## Overview
The Stock Verify System is a stock counting and ERP synchronization application. It consists of a FastAPI backend and an Expo-based mobile/web frontend.

## Architecture
### Backend
- **Framework**: FastAPI
- **Primary Database**: MongoDB (using Motor for async operations)
- **ERP Integration**: SQL Server (using `SQLServerConnector` with `pyodbc` or `pymssql`)
- **Key Services**:
    - `lifespan.py`: Manages startup and shutdown of global services (MongoDB, SQL Connector, etc.).
    - `sql_server_connector.py`: Handles connections and queries to the ERP database.
    - `database_health.py`: Monitors health of MongoDB and SQL Server.
- **Entry Point**: `backend/server.py`

### Frontend
- **Framework**: Expo (React Native)
- **Navigation**: Expo Router (`app/` directory)
- **Backend Discovery**: `src/services/backendUrl.ts` probes candidate ports to find a healthy backend instance.

## User Defined Namespaces
- backend
- frontend
- database
- erp

## Components
### [Component] - SQLServerConnector
- **Location**: `backend/sql_server_connector.py`
- **Purpose**: Bridge between the application and the ERP SQL Server.
- **I/O**: Input is item identifiers; Output is item batch information.

### [Component] - BackendDiscovery
- **Location**: `frontend/src/services/backendUrl.ts`
- **Purpose**: Automatically resolves the backend API URL by probing multiple candidate ports and hosts.

## Patterns
### SQL-MongoDB Fallback
When fetching item batches, the system first attempts to query SQL Server. If it fails or is disconnected, it falls back to querying MongoDB (`erp_items` collection).

## Current Issues & Status
- **SQL Connection**: Currently failing due to placeholder password in `.env`.
- **Frontend URL**: Backend runs on dynamic ports; frontend needs to include 8085 in its probe list.
- **ERP Sync**: Background sync service is currently disabled in `lifespan.py`.
