# Ultra-Detailed Codebase Report

## Table of Contents
1. [Project Overview](#project-overview)
2. [Backend Architecture](#backend-architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [Core Services](#core-services)
5. [Configuration & Deployment](#configuration--deployment)
6. [Security & Authentication](#security--authentication)
7. [Database & Data Models](#database--data-models)
8. [API Endpoints](#api-endpoints)

---

## Project Overview

### Project Name
STOCK_VERIFY_2-db-maped (Stock Verify Application v2.1)

### Description
A comprehensive stock verification system with mobile frontend, FastAPI backend, MongoDB primary database, optional SQL Server integration for ERP data synchronization, Redis caching, and advanced features like AI-powered search, biometric authentication, and real-time monitoring.

### Technology Stack
- **Backend**: FastAPI, Python 3.11+, Pydantic, PyMongo, Redis
- **Frontend**: React Native, Expo SDK 54, Expo Router, Zustand, Axios
- **Database**: MongoDB (primary), SQL Server (optional ERP sync)
- **Caching**: Redis with in-memory fallback
- **Authentication**: JWT, PIN-based, Biometric (Expo LocalAuthentication)
- **Deployment**: Docker Compose, Kubernetes (optional)
- **Monitoring**: Grafana, Prometheus, Sentry

---

## Backend Architecture

### Main Entry Point: `backend/server.py`

**Lines 1-828**

This is the primary FastAPI application entry point with the following responsibilities:

#### Key Components:

1. **Application Initialization**
   - Creates FastAPI app instance with title, version, and description
   - Configures CORS middleware with wildcard origins for development
   - Sets up security middleware (HTTPBearer)
   - Registers API routers:
     - `/api/v2/items` - Item management endpoints
     - `/api/v2/users` - User management
     - `/api/v2/auth` - Authentication endpoints
     - `/api/v2/sessions` - Inventory session management
     - `/api/v2/unknown-items` - Unknown item handling
     - `/api/v2/admin` - Administrative operations
     - `/api/v2/monitoring` - Monitoring and health checks

2. **Authentication Dependencies**
   - Imports `get_current_user` from `auth.dependencies`
   - Imports `require_admin` for admin-only endpoints
   - Imports `require_permissions` for permission-based access control

3. **Helper Functions**
   - `generate_tokens()`: Creates access and refresh JWT tokens
   - `create_access_token()`: Generates access token with expiration
   - `create_refresh_token()`: Generates refresh token with longer expiration
   - `get_password_hash()`: Hashes passwords using bcrypt
   - `verify_password()`: Verifies password against hash

4. **Startup Operations**
   - Initializes default admin user if not exists
   - Seeds mock ERP data for testing
   - Configures logging with structured format

5. **Default Routes**
   - `GET /`: Root endpoint returning API information
   - `GET /health`: Health check endpoint

#### Dependencies:
- FastAPI, Uvicorn
- Pydantic for validation
- PyMongo for MongoDB
- Redis for caching
- Python-jose for JWT
- Passlib for password hashing
- Various internal services

---

### Configuration: `backend/config.py`

**Lines 1-507**

Defines application settings using Pydantic `BaseSettings` for type-safe configuration with validation.

#### Configuration Classes:

1. **AppSettings** (Main configuration)
   - `APP_NAME`: Application name ("Stock Verify API")
   - `APP_VERSION`: Version string
   - `DEBUG`: Boolean for debug mode
   - `ENVIRONMENT`: Environment (development/production)

2. **Database Settings**
   - `MONGO_URL`: MongoDB connection URL with auto-detection for localhost
   - `MONGO_DATABASE`: Database name
   - `SQL_SERVER_HOST`: Optional SQL Server host for ERP sync
   - `SQL_SERVER_DATABASE`: SQL Server database name
   - `SQL_SERVER_USER`: SQL Server username
   - `SQL_SERVER_PASSWORD`: SQL Server password

3. **Security Settings**
   - `JWT_SECRET`: Must be at least 32 characters, no insecure defaults
   - `JWT_REFRESH_SECRET`: Must be at least 32 characters
   - `JWT_ALGORITHM`: Algorithm for JWT (HS256)
   - `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`: Access token expiration (default 30)
   - `JWT_REFRESH_TOKEN_EXPIRE_DAYS`: Refresh token expiration (default 7)
   - `SESSION_TIMEOUT_MINUTES`: Session timeout (default 480)
   - `MAX_CONCURRENT_SESSIONS`: Maximum concurrent sessions per user (default 3)
   - `MIN_CLIENT_VERSION`: Minimum client version requirement

4. **Caching Settings**
   - `REDIS_URL`: Redis connection URL
   - `CACHE_TTL_SECONDS`: Default cache TTL (default 300)
   - `ENABLE_CACHE`: Enable/disable caching

5. **Rate Limiting Settings**
   - `ENABLE_RATE_LIMITING`: Enable rate limiting
   - `DEFAULT_RATE_LIMIT`: Default requests per minute (default 60)
   - `DEFAULT_BURST`: Default burst allowance (default 10)
   - `RATE_LIMIT_STORAGE`: Storage backend (redis/memory)

6. **Sync Service Settings**
   - `ENABLE_ERP_SYNC`: Enable ERP synchronization
   - `ERP_SYNC_INTERVAL_MINUTES`: Sync interval (default 5)
   - `ENABLE_CHANGE_DETECTION`: Enable change detection
   - `CHANGE_DETECTION_INTERVAL_SECONDS`: Detection interval (default 30)
   - `ENABLE_AUTO_SYNC`: Enable automatic sync

7. **Logging Settings**
   - `LOG_LEVEL`: Logging level (default INFO)
   - `LOG_FORMAT`: Log format (json/text)
   - `SENTRY_DSN`: Sentry DSN for error tracking
   - `ENABLE_SENTRY`: Enable Sentry integration

8. **Server Settings**
   - `HOST`: Server host (default 0.0.0.0)
   - `PORT`: Server port (default 8001)
   - `WORKERS`: Number of worker processes (default 1)

#### Validators:
- `validate_jwt_secret`: Ensures JWT secret is at least 32 characters
- `validate_mongo_url`: Validates MongoDB URL format
- `validate_min_client_version`: Validates client version format

#### Fallback Mechanism:
- Provides fallback configuration if Pydantic initialization fails
- Logs warnings for missing required environment variables

---

### API Schemas: `backend/api/schemas.py`

**Lines 1-349**

Defines Pydantic models for API request/response validation.

#### Key Schema Classes:

1. **ApiResponse** (Base response model)
   - `success`: Boolean indicating operation success
   - `message`: Human-readable message
   - `data`: Optional payload data
   - `error`: Optional error details

2. **ERPItem** (ERP item data)
   - `item_code`: Unique item identifier
   - `description`: Item description
   - `uom`: Unit of measure
   - `category`: Item category
   - `price`: Item price
   - `stock_qty`: Current stock quantity

3. **UserInfo** (User information)
   - `user_id`: Unique user identifier
   - `username`: Username
   - `email`: Email address
   - `role`: User role (admin/staff/supervisor)
   - `permissions`: List of permissions
   - `is_active`: Active status

4. **TokenResponse** (Authentication response)
   - `access_token`: JWT access token
   - `refresh_token`: JWT refresh token
   - `token_type`: Token type (bearer)
   - `expires_in`: Expiration time in seconds
   - `user`: User information

5. **LoginRequest** (Login credentials)
   - `username`: Username
   - `password`: Password
   - `device_id`: Device identifier

6. **PINLoginRequest** (PIN-based login)
   - `user_id`: User ID
   - `pin`: 6-digit PIN
   - `device_id`: Device identifier

7. **CountLineCreate** (Inventory count line)
   - `session_id`: Session identifier
   - `item_code`: Item code
   - `quantity`: Counted quantity
   - `location`: Location code
   - `serial_numbers`: Optional list of serial numbers
   - `notes`: Optional notes

8. **Session** (Inventory session)
   - `session_id`: Unique session identifier
   - `user_id`: User who created session
   - `warehouse_id`: Warehouse identifier
   - `location`: Location code
   - `status`: Session status (draft/in_progress/completed)
   - `created_at`: Creation timestamp
   - `updated_at`: Last update timestamp

9. **UnknownItem** (Unknown item report)
   - `item_code`: Unknown item code
   - `description`: Description
   - `image_url`: Optional image URL
   - `reported_by`: User who reported
   - `timestamp`: Report timestamp

10. **PasswordResetRequest** (Password reset)
    - `email`: Email address
    - `new_password`: New password
    - `confirm_password`: Password confirmation

#### Custom Validators:
- `pin_match`: Validates PIN format (6 digits)
- `password_match`: Validates password confirmation matches
- `password_strength`: Validates password complexity

---

### Authentication Dependencies: `backend/auth/dependencies.py`

**Lines 1-322**

Provides FastAPI authentication and authorization dependencies.

#### Key Classes:

1. **AuthDependencies**
   - Manages database connection settings
   - Manages JWT configuration (secret, algorithm)
   - Provides token validation logic

2. **JWTValidator**
   - `extract_token()`: Extracts JWT from Authorization header
   - `decode_token()`: Decodes and validates JWT
   - `validate_access_token()`: Validates access token expiration
   - `validate_refresh_token()`: Validates refresh token

3. **UserRepository**
   - `get_user_by_id()`: Fetches user by ID
   - `get_user_by_username()`: Fetches user by username
   - `get_user_by_email()`: Fetches user by email
   - `update_user()`: Updates user data

#### Authentication Functions:

1. **get_current_user**
   - Dependency for extracting and validating authenticated user
   - Raises HTTPException 401 if token invalid
   - Returns user object

2. **require_admin**
   - Dependency for admin-only endpoints
   - Checks if user has admin role
   - Raises HTTPException 403 if not admin

3. **require_permissions**
   - Dependency for permission-based access control
   - Checks if user has required permissions
   - Raises HTTPException 403 if permissions missing

4. **require_role**
   - Dependency for role-based access control
   - Checks if user has required role
   - Raises HTTPException 403 if role mismatch

#### Security Features:
- Uses `fastapi.security.HTTPBearer` for token handling
- Token expiration validation
- Role and permission checking
- Graceful error handling with HTTP exceptions

---

### Application Lifespan: `backend/core/lifespan.py`

**Lines 1-843**

Manages FastAPI application startup and shutdown events.

#### Startup Sequence:

1. **Database Initialization**
   - Connects to MongoDB
   - Creates database indexes
   - Initializes Redis connection
   - Connects to SQL Server (if configured)

2. **Service Initialization**
   - `CacheService`: Redis caching with in-memory fallback
   - `RateLimiter`: Token bucket rate limiting
   - `MonitoringService`: Metrics and health checks
   - `AuditService`: Audit logging
   - `SecurityService`: Security event logging

3. **Sync Service Initialization**
   - `ERP_SYNC_SERVICE`: ERP data synchronization
   - `CHANGE_DETECTION_SERVICE`: Change detection
   - `AUTO_SYNC_SERVICE`: Automatic synchronization

4. **Authentication Setup**
   - Password hashing (Argon2/bcrypt)
   - JWT secret generation (if not set)
   - Session management

5. **Network Services**
   - mDNS for local network discovery
   - Service registration

6. **Database Migrations**
   - Runs pending migrations
   - Creates required indexes
   - Seeds default data

7. **Default Data**
   - Creates default admin user
   - Seeds mock ERP data (if enabled)

8. **Enterprise Features** (conditional)
   - Feature flags service
   - Data governance service
   - Compliance service

9. **Health Checks**
   - Database connectivity
   - Redis connectivity
   - Service availability
   - Critical component verification

#### Shutdown Sequence:

1. Closes database connections
2. Shuts down sync services
3. Flushes cache
4. Stops monitoring
5. Closes network services

#### Service Injection:
- Injects services into global contexts for access across the application
- Provides dependency injection for FastAPI endpoints

---

### API v2 Items: `backend/api/v2/items.py`

**Lines 1-410**

Defines API v2 endpoints for item management.

#### Endpoints:

1. **GET /api/v2/items**
   - Paginated item retrieval with fuzzy search
   - Query parameters:
     - `page`: Page number (default 1)
     - `page_size`: Items per page (default 50)
     - `search`: Search query for fuzzy matching
     - `category`: Filter by category
   - Uses `rapidfuzz` for fuzzy string matching
   - Returns paginated list of items

2. **GET /api/v2/items/ai-search**
   - AI-powered semantic search
   - Query parameters:
     - `query`: Search query
     - `limit`: Result limit (default 10)
   - Integrates with `ai_search_service`
   - Returns semantically similar items

3. **GET /api/v2/items/{item_code}**
   - Single item retrieval by code
   - Returns item details or 404 if not found

4. **POST /api/v2/items/identify**
   - Visual item identification (placeholder)
   - Request body: Image data
   - Returns identified item code

5. **GET /api/v2/items/{item_code}/details**
   - Item details with optional SQL verification
   - Query parameters:
     - `verify_sql`: Boolean to enable SQL verification
   - Integrates with `sql_verification_service`
   - Returns item details with ERP verification status

#### Dependencies:
- `ai_search_service`: AI-powered search
- `sql_verification_service`: SQL Server verification
- `rapidfuzz`: Fuzzy string matching
- MongoDB for data storage

#### Features:
- Pagination support
- Fuzzy search with configurable threshold
- AI semantic search
- Visual identification (placeholder)
- SQL verification for ERP data

---

## Frontend Architecture

### Root Layout: `frontend/app/_layout.tsx`

**Lines 1-519**

Root layout for React Native application using Expo Router.

#### Key Components:

1. **Global Providers**
   - `QueryClientProvider`: React Query for data fetching
   - `ErrorBoundary`: Error handling boundary
   - `ThemeProvider`: Theme management
   - `ToastProvider`: Toast notifications
   - `AuthGuard`: Authentication guard

2. **Initialization Sequence**
   - Font loading (custom fonts)
   - Storage initialization (AsyncStorage)
   - Backend URL discovery (mDNS)
   - Authentication state restoration
   - Settings initialization
   - Background sync setup
   - Theme initialization

3. **Splash Screen Management**
   - Shows splash screen during initialization
   - Hides splash screen when ready
   - Handles loading states

4. **Error Handling**
   - Global error boundary
   - Error logging
   - User-friendly error messages

#### Dependencies:
- Expo Router for navigation
- React Query for data fetching
- Zustand for state management
- AsyncStorage for persistence
- Expo LocalAuthentication for biometrics

---

### Login Screen: `frontend/app/login.tsx`

**Lines 1-733**

Modern login screen with two authentication modes.

#### Features:

1. **PIN Login Mode**
   - 6-digit PIN input
   - Biometric authentication (placeholder)
   - Haptic feedback on input
   - PIN validation

2. **Credentials Login Mode**
   - Username/password input
   - Password visibility toggle
   - Form validation
   - Remember me option

3. **Authentication Integration**
   - Uses `useAuthStore` for authentication logic
   - Handles session conflicts
   - Token persistence
   - Auto-login on app start

4. **UI Components**
   - Animated transitions
   - Loading states
   - Error messages
   - Success feedback

#### Dependencies:
- `useAuthStore`: Authentication state management
- `useSettingsStore`: Settings management
- `useNetworkStore`: Network status
- `secureStorage`: Secure token storage
- `httpClient`: HTTP client for API calls

---

### Authentication Store: `frontend/src/store/authStore.ts`

**Lines 1-482**

Zustand store for frontend authentication state management.

#### State:
- `user`: User information
- `isAuthenticated`: Authentication status
- `isLoading`: Loading state
- `token`: JWT access token
- `refreshToken`: JWT refresh token
- `sessionExpiry`: Session expiration time

#### Actions:

1. **login(credentials)**
   - Login with username/password
   - Stores tokens in secure storage
   - Sets user information
   - Starts session heartbeat

2. **loginWithPIN(userId, pin)**
   - Login with PIN
   - Validates PIN
   - Stores tokens
   - Sets user information

3. **biometricLogin()**
   - Biometric authentication
   - Uses Expo LocalAuthentication
   - Falls back to PIN if needed

4. **logout()**
   - Clears tokens
   - Clears user data
   - Stops heartbeat
   - Navigates to login

5. **refreshToken()**
   - Refreshes access token
   - Updates stored tokens
   - Handles token expiration

6. **setupPIN(pin)**
   - Sets up PIN for user
   - Validates PIN format
   - Stores PIN hash

7. **startHeartbeat()**
   - Starts periodic session heartbeat
   - Keeps session alive
   - Handles session expiration

8. **checkSessionExpiry()**
   - Checks if session is expired
   - Auto-logout if expired

#### Integrations:
- `secureStorage`: Token persistence
- `httpClient`: API communication
- `useSettingsStore`: Settings integration
- `useNetworkStore`: Network status

---

### HTTP Client: `frontend/src/services/httpClient.ts`

**Lines 1-431**

Configures Axios instance for backend API communication.

#### Features:

1. **Dynamic Base URL**
   - Uses `ConnectionManager` to discover backend URL
   - Handles changing network conditions (LAN IP)
   - Auto-reconnects on network changes

2. **Request Interceptor**
   - Attaches device ID header
   - Injects authentication token
   - Adds timestamp for request tracking

3. **Response Interceptor**
   - Handles 401 unauthorized responses
   - Attempts token refresh
   - Implements 401 circuit breaker
   - Handles network errors

4. **Token Refresh Flow**
   - Detects 401 responses
   - Calls refresh endpoint
   - Updates stored tokens
   - Retries original request

5. **Error Handling**
   - Network error logging
   - Session revocation handling
   - Graceful degradation

6. **Circuit Breaker**
   - Prevents logout storms
   - Limits retry attempts
   - Provides fallback behavior

#### Integrations:
- `secureStorage`: Token retrieval
- `useNetworkStore`: Network status
- `useAuthStore`: Authentication state

---

### Frontend Package Configuration: `frontend/package.json`

**Lines 1-144**

Frontend project manifest for React Native/Expo application.

#### Project Metadata:
- `name`: "stock-verify-app"
- `version`: "1.0.0"
- `private`: true

#### Scripts:
- `start`: Start Expo development server
- `android`: Build for Android
- `ios`: Build for iOS
- `web`: Build for web
- `lint`: Run ESLint
- `test`: Run Jest tests
- `typecheck`: Run TypeScript type checking

#### Dependencies:
- Expo SDK 54
- React Native 0.81.5
- React 19.1.0
- Expo Router for navigation
- Zustand for state management
- Axios for HTTP requests
- React Query for data fetching
- Expo LocalAuthentication for biometrics
- Various UI libraries

#### Development Dependencies:
- TypeScript
- ESLint
- Jest
- Storybook
- Babel
- Metro bundler

#### Lint-staged:
- Configured for code formatting and linting on commit

---

## Core Services

### Cache Service: `backend/services/cache_service.py`

**Lines 1-291**

Redis-based caching service with in-memory fallback.

#### Features:

1. **Redis Operations**
   - Async Redis operations using `redis.asyncio`
   - Connection pooling
   - Automatic reconnection

2. **In-Memory Fallback**
   - Falls back to in-memory cache if Redis unavailable
   - Thread-safe operations using `asyncio.Lock`
   - Graceful degradation

3. **Serialization**
   - `CustomJSONEncoder` for `ObjectId` and `datetime` serialization
   - Handles complex data types

4. **Cache Methods**
   - `get(key)`: Retrieve cached value
   - `set(key, value, ttl)`: Store value with TTL
   - `delete(key)`: Delete cached value
   - `clear_prefix(prefix)`: Clear all keys with prefix
   - `clear_pattern(pattern)`: Clear keys matching pattern
   - `get_or_set(key, factory, ttl)`: Get or compute and cache

5. **Health Monitoring**
   - `get_status()`: Returns cache status (redis/memory)
   - Provides metrics (hit rate, miss rate, size)

#### Usage:
```python
cache = CacheService(redis_url)
await cache.set("key", {"data": "value"}, ttl=300)
value = await cache.get("key")
```

---

### Rate Limiter: `backend/services/rate_limiter.py`

**Lines 1-200**

Token bucket algorithm for rate limiting.

#### Features:

1. **Token Bucket Algorithm**
   - Configurable rate (tokens per second)
   - Configurable burst allowance
   - Automatic token replenishment

2. **Per-User/Endpoint Limiting**
   - Separate limits per user
   - Separate limits per endpoint
   - Configurable default rates

3. **Concurrent Request Handling**
   - `ConcurrentRequestHandler` class
   - Semaphore-based limiting
   - Queue management
   - Prevents server overload

4. **Rate Limit Methods**
   - `is_allowed(user_id, endpoint)`: Check if request allowed
   - Returns rate limit info (remaining, reset_time)
   - Tracks request counts

5. **Async Safety**
   - Uses `asyncio.Lock` for thread safety
   - Non-blocking operations

#### Usage:
```python
limiter = RateLimiter(rate=60, burst=10)
allowed, info = await limiter.is_allowed(user_id, endpoint)
if not allowed:
    raise HTTPException(429, "Rate limit exceeded")
```

---

## Configuration & Deployment

### Docker Compose: `docker-compose.yml`

**Lines 1-26**

Multi-service Docker application configuration.

#### Services:

1. **Backend Service**
   - Build context: `./backend`
   - Port: 8001
   - Environment files: `.env.example`, `.env.docker.example`
   - Depends on: `mongo`
   - Volume mount: Local backend directory
   - Health checks configured

2. **Mongo Service**
   - Image: `mongo:6.0`
   - Port: 27017 (local only)
   - Volume: `mongo_data` for persistence
   - No authentication (development mode)

#### Usage:
```bash
docker-compose up -d
docker-compose down
```

---

### Root Package Configuration: `package.json`

**Lines 1-38**

Root project manifest for monorepo management.

#### Project Metadata:
- `name`: "STOCK_VERIFY_2-db-maped"
- `version`: "1.0.0"

#### Scripts:
- `android`: Build Android app
- `ios`: Build iOS app

#### Dependencies:
- Nx for monorepo management
- Expo SDK 54
- React 19.1.0
- React Native 0.81.5
- Various development tools

#### Development Dependencies:
- `@expo/cli`
- `@nx/docker`
- `@nx/eslint`
- `@nx/jest`
- `@nx/expo`
- `@nx/react-native`
- `@nx/storybook`
- `@nx/web`
- TypeScript
- ESLint
- Jest

---

### README: `README.md`

**Lines 1-108**

Project documentation and quick start guide.

#### Sections:

1. **Overview**
   - Application description
   - Version information
   - Feature highlights

2. **Documentation Links**
   - Startup guides
   - Coding workflows
   - Feature roadmaps

3. **Quick Start**
   - Development setup
   - Local LAN deployment
   - Environment variable configuration
   - Service startup commands

4. **Testing**
   - Frontend testing
   - Backend testing
   - E2E testing

5. **Production Deployment**
   - Docker Compose setup
   - Monitoring tools (Grafana, Prometheus)
   - Configuration details

6. **Configuration**
   - Default ports
   - SQL Server settings
   - Environment variables

7. **Maintenance**
   - Database migrations
   - Backup scripts
   - Health checks

---

## Security & Authentication

### JWT Authentication

#### Token Generation:
- Access tokens: 30-minute expiration
- Refresh tokens: 7-day expiration
- HS256 algorithm
- Secret must be at least 32 characters

#### Token Validation:
- Signature verification
- Expiration checking
- User validation against database
- Session verification

#### Token Storage:
- Secure storage on frontend
- HTTP-only cookies (optional)
- Token refresh on 401 responses

### Password Security

#### Hashing:
- Argon2 or bcrypt
- Salt generation
- Configurable work factor

#### Validation:
- Minimum 8 characters
- Complexity requirements
- No common passwords

### PIN Authentication

#### PIN Format:
- 6 digits
- Stored as hash
- Biometric fallback

#### PIN Management:
- Setup via UI
- Reset via admin
- Expiration after failed attempts

### Biometric Authentication

#### Features:
- Expo LocalAuthentication
- Face ID / Touch ID
- Fallback to PIN
- Secure storage

---

## Database & Data Models

### MongoDB Schema

#### Collections:

1. **users**
   - `user_id`: ObjectId
   - `username`: string
   - `email`: string
   - `password_hash`: string
   - `pin_hash`: string (optional)
   - `role`: string (admin/staff/supervisor)
   - `permissions`: array
   - `is_active`: boolean
   - `created_at`: datetime
   - `updated_at`: datetime

2. **items**
   - `item_code`: string (unique)
   - `description`: string
   - `uom`: string
   - `category`: string
   - `price`: decimal
   - `stock_qty`: integer
   - `image_url`: string (optional)
   - `created_at`: datetime
   - `updated_at`: datetime

3. **sessions**
   - `session_id`: ObjectId
   - `user_id`: ObjectId
   - `warehouse_id`: string
   - `location`: string
   - `status`: string (draft/in_progress/completed)
   - `created_at`: datetime
   - `updated_at`: datetime

4. **count_lines**
   - `line_id`: ObjectId
   - `session_id`: ObjectId
   - `item_code`: string
   - `quantity`: integer
   - `location`: string
   - `serial_numbers`: array
   - `notes`: string
   - `created_at`: datetime
   - `updated_at`: datetime

5. **unknown_items**
   - `item_code`: string
   - `description`: string
   - `image_url`: string
   - `reported_by`: ObjectId
   - `timestamp`: datetime

### SQL Server Integration

#### Purpose:
- ERP data synchronization
- Read-only access to ERP data
- Periodic sync intervals

#### Tables:
- ERP items table
- Stock quantities
- Item categories

#### Sync Process:
- Background sync service
- Change detection
- Conflict resolution

---

## API Endpoints

### Authentication Endpoints

#### POST /api/v2/auth/login
- Request: `{ username, password, device_id }`
- Response: `{ access_token, refresh_token, user }`

#### POST /api/v2/auth/login/pin
- Request: `{ user_id, pin, device_id }`
- Response: `{ access_token, refresh_token, user }`

#### POST /api/v2/auth/refresh
- Request: `{ refresh_token }`
- Response: `{ access_token, refresh_token }`

#### POST /api/v2/auth/logout
- Headers: `Authorization: Bearer {token}`
- Response: `{ success: true }`

#### POST /api/v2/auth/setup-pin
- Request: `{ pin }`
- Response: `{ success: true }`

### Item Endpoints

#### GET /api/v2/items
- Query: `?page=1&page_size=50&search=query&category=cat`
- Response: `{ items: [], total, page, page_size }`

#### GET /api/v2/items/{item_code}
- Response: `{ item_code, description, uom, category, price, stock_qty }`

#### GET /api/v2/items/ai-search
- Query: `?query=search_term&limit=10`
- Response: `{ items: [] }`

#### GET /api/v2/items/{item_code}/details
- Query: `?verify_sql=true`
- Response: `{ item, verified, source }`

### Session Endpoints

#### POST /api/v2/sessions
- Request: `{ warehouse_id, location }`
- Response: `{ session_id, status, created_at }`

#### GET /api/v2/sessions/{session_id}
- Response: `{ session_id, user_id, status, count_lines: [] }`

#### POST /api/v2/sessions/{session_id}/lines
- Request: `{ item_code, quantity, location, serial_numbers, notes }`
- Response: `{ line_id, created_at }`

#### PUT /api/v2/sessions/{session_id}/complete
- Response: `{ success: true, completed_at }`

### User Endpoints

#### GET /api/v2/users/me
- Response: `{ user_id, username, email, role, permissions }`

#### PUT /api/v2/users/me/password
- Request: `{ current_password, new_password }`
- Response: `{ success: true }`

### Admin Endpoints

#### GET /api/v2/admin/users
- Response: `{ users: [] }`

#### POST /api/v2/admin/users
- Request: `{ username, email, password, role }`
- Response: `{ user_id, created_at }`

#### PUT /api/v2/admin/users/{user_id}
- Request: `{ role, is_active }`
- Response: `{ success: true }`

### Monitoring Endpoints

#### GET /api/v2/monitoring/health
- Response: `{ status, services: {} }`

#### GET /api/v2/monitoring/metrics
- Response: `{ metrics: {} }`

---

## Architecture Patterns

### Backend Patterns

1. **Dependency Injection**
   - Services injected via FastAPI dependencies
   - Global context for shared services
   - Testable architecture

2. **Repository Pattern**
   - `UserRepository` for user data
   - `ItemRepository` for item data
   - Abstraction over database operations

3. **Service Layer**
   - Business logic in services
   - Clear separation from API layer
   - Reusable components

4. **Middleware Pattern**
   - Authentication middleware
   - Rate limiting middleware
   - Error handling middleware

### Frontend Patterns

1. **State Management**
   - Zustand for global state
   - Local state for component state
   - React Query for server state

2. **Composition Pattern**
   - Reusable hooks
   - Component composition
   - Provider pattern

3. **Navigation Pattern**
   - Expo Router for file-based routing
   - Nested screens
   - Modal navigation

4. **Error Boundary Pattern**
   - Global error boundary
   - Component-level boundaries
   - Graceful error handling

---

## Performance Optimizations

### Backend Optimizations

1. **Caching**
   - Redis for distributed caching
   - In-memory fallback
   - TTL-based expiration

2. **Rate Limiting**
   - Token bucket algorithm
   - Per-user limits
   - Per-endpoint limits

3. **Database Indexing**
   - Indexed queries
   - Compound indexes
   - Query optimization

4. **Async Operations**
   - Async/await throughout
   - Non-blocking I/O
   - Concurrent request handling

### Frontend Optimizations

1. **Data Fetching**
   - React Query caching
   - Background refetching
   - Optimistic updates

2. **Rendering**
   - React.memo for memoization
   - Lazy loading
   - Code splitting

3. **Storage**
   - AsyncStorage for persistence
   - Secure storage for sensitive data
   - IndexedDB for large data

4. **Network**
   - Request batching
   - Connection pooling
   - Retry logic

---

## Monitoring & Logging

### Backend Monitoring

1. **Health Checks**
   - Database connectivity
   - Redis connectivity
   - Service availability

2. **Metrics**
   - Request counts
   - Response times
   - Error rates

3. **Logging**
   - Structured logging
   - Log levels
   - Error tracking (Sentry)

### Frontend Monitoring

1. **Error Tracking**
   - Global error boundary
   - Error logging
   - User feedback

2. **Performance**
   - Render times
   - Network latency
   - Memory usage

3. **Analytics**
   - User actions
   - Feature usage
   - Session tracking

---

## Deployment

### Development Deployment

1. **Local Development**
   - Backend: `uvicorn backend.server:app --reload`
   - Frontend: `expo start`
   - MongoDB: Docker or local installation

2. **Docker Compose**
   - `docker-compose up -d`
   - Services: backend, mongo
   - Volumes for persistence

### Production Deployment

1. **Docker**
   - Multi-stage builds
   - Alpine images
   - Security scanning

2. **Kubernetes**
   - Deployment manifests
   - Horizontal Pod Autoscaling
   - Ingress configuration

3. **Monitoring**
   - Grafana dashboards
   - Prometheus metrics
   - Alerting rules

---

## Security Best Practices

1. **Authentication**
   - JWT with strong secrets
   - Token expiration
   - Refresh token rotation

2. **Authorization**
   - Role-based access control
   - Permission-based access
   - Principle of least privilege

3. **Data Protection**
   - Encryption at rest
   - Encryption in transit
   - Secure storage

4. **Input Validation**
   - Pydantic schemas
   - Type checking
   - Sanitization

5. **Error Handling**
   - Generic error messages
   - No sensitive data in errors
   - Proper HTTP status codes

---

## Testing

### Backend Testing

1. **Unit Tests**
   - Service logic
   - Utility functions
   - Schema validation

2. **Integration Tests**
   - API endpoints
   - Database operations
   - Service interactions

3. **E2E Tests**
   - Complete workflows
   - User scenarios
   - Performance tests

### Frontend Testing

1. **Unit Tests**
   - Components
   - Hooks
   - Utilities

2. **Integration Tests**
   - User flows
   - Navigation
   - State management

3. **E2E Tests**
   - App navigation
   - Authentication flows
   - Feature usage

---

## Conclusion

This codebase represents a comprehensive stock verification system with:

- Modern architecture using FastAPI and React Native
- Robust authentication and authorization
- Flexible data storage (MongoDB + optional SQL Server)
- Advanced features (AI search, biometrics, real-time sync)
- Production-ready deployment (Docker, Kubernetes)
- Comprehensive monitoring and logging
- Security best practices throughout

The system is designed for scalability, maintainability, and security, with clear separation of concerns and well-documented components.
