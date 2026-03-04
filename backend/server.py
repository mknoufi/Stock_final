import logging
import os
import sys

import inspect
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Optional, TypeVar, cast

# Add the parent directory to Python path for proper imports
sys.path.insert(0, str(Path(__file__).parent.parent))

# Load environment variables from .env file
try:
    from dotenv import load_dotenv

    load_dotenv(Path(__file__).parent.parent / ".env")
except ImportError:
    pass

import jwt  # noqa: E402
import uvicorn  # noqa: E402
from fastapi import APIRouter, Depends, FastAPI, HTTPException  # noqa: E402
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer  # noqa: E402
from starlette.middleware.cors import CORSMiddleware  # noqa: E402
from starlette.requests import Request  # noqa: E402

import sentry_sdk  # noqa: E402
from sentry_sdk.integrations.fastapi import FastApiIntegration  # noqa: E402
from sentry_sdk.integrations.starlette import StarletteIntegration  # noqa: E402


from backend.api import supervisor_pin  # noqa: E402
from backend.api.admin_control_api import admin_control_router  # noqa: E402
from backend.api.admin_dashboard_api import admin_dashboard_router  # noqa: E402
from backend.api.auth import router as auth_router  # noqa: E402
from backend.api.count_lines_api import router as count_lines_router  # noqa: E402
from backend.api.analytics_api import router as analytics_router  # noqa: E402
from backend.api.dynamic_fields_api import dynamic_fields_router  # noqa: E402
from backend.api.dynamic_reports_api import dynamic_reports_router  # noqa: E402
from backend.api.erp_api import router as erp_router  # noqa: E402
from backend.api.error_reporting_api import router as error_reporting_router  # noqa: E402
from backend.api.exports_api import exports_router  # noqa: E402
from backend.api.health import health_router, info_router  # noqa: E402
from backend.api.item_verification_api import verification_router  # noqa: E402
from backend.api.locations_api import router as locations_router  # noqa: E402
from backend.api.logs_api import router as logs_router  # noqa: E402
from backend.api.mapping_api import router as mapping_router  # noqa: E402
from backend.api.master_settings_api import master_settings_router  # noqa: E402
from backend.api.metrics_api import metrics_router  # noqa: E402
from backend.api.notifications_api import router as notifications_router  # noqa: E402

# New feature API routers
from backend.api.permissions_api import permissions_router  # noqa: E402
from backend.api.preferences_api import router as preferences_router  # noqa: E402
from backend.api.rack_api import router as rack_router  # noqa: E402
from backend.api.realtime_dashboard_api import realtime_dashboard_router  # noqa: E402
from backend.api.report_generation_api import report_generation_router  # noqa: E402
from backend.api.reporting_api import router as reporting_router  # noqa: E402
from backend.api.schemas import ApiResponse, CountLineCreate, TokenResponse  # noqa: E402

from backend.api.search_api import router as search_router  # noqa: E402
from backend.api.security_api import security_router  # noqa: E402
from backend.api.self_diagnosis_api import self_diagnosis_router  # noqa: E402
from backend.api.service_logs_api import service_logs_router  # noqa: E402
from backend.api.session_management_api import router as session_mgmt_router  # noqa: E402
from backend.api.enhanced_item_api import enhanced_item_router  # noqa: E402
from backend.api.pi_api import router as pi_router  # noqa: E402

# Phase 1-3: New Upgrade APIs
from backend.api.sync_batch_api import router as sync_batch_router  # noqa: E402
from backend.api.unknown_items_api import router as unknown_items_router  # noqa: E402

# New feature services
from backend.api.sync_conflicts_api import sync_conflicts_router  # noqa: E402
from backend.api.sync_management_api import sync_management_router  # noqa: E402
from backend.api.sync_status_api import sync_router  # noqa: E402
from backend.api.user_management_api import user_management_router  # noqa: E402
from backend.api.user_settings_api import router as user_settings_router  # noqa: E402
from backend.api.variance_api import router as variance_router  # noqa: E402
from backend.api.websocket_api import router as websocket_router  # noqa: E402
from backend.api.sql_verification_api import router as sql_verification_router  # noqa: E402
from backend.auth.dependencies import get_current_user as auth_get_current_user  # noqa: E402
from backend.config import settings  # noqa: E402
from backend.core.lifespan import lifespan  # noqa: E402
from backend.core.globals import (  # noqa: E402
    cache_service,
    db,
    refresh_token_service,
)
from backend.exceptions import AuthenticationError, NotFoundError  # noqa: E402
from backend.exceptions import RateLimitError as RateLimitExceededError  # noqa: E402
from backend.exceptions import StockVerifyException as DatabaseError  # noqa: E402
from backend.exceptions import ValidationError  # noqa: E402

# Utils
from backend.utils.api_utils import result_to_response, sanitize_for_logging  # noqa: E402
from backend.utils.auth_utils import get_password_hash  # noqa: E402
from backend.utils.port_detector import PortDetector, save_backend_info  # noqa: E402
from backend.utils.result import Fail, Ok, Result  # noqa: E402
from backend.utils.tracing import instrument_fastapi_app  # noqa: E402

# Initialize logger early
logger = logging.getLogger("stock-verify")
if not logger.handlers:
    logging.basicConfig(level=logging.INFO)

# Optional Services
enrichment_router: Optional[APIRouter] = None
try:
    from backend.api.enrichment_api import enrichment_router as e_router  # noqa: E402

    enrichment_router = e_router
except ImportError:
    pass

enterprise_router: Optional[APIRouter] = None
ENTERPRISE_AVAILABLE = False
try:
    from backend.api.enterprise_api import enterprise_router as ent_router  # noqa: E402

    enterprise_router = ent_router
    ENTERPRISE_AVAILABLE = True
except ImportError as e:
    logger.info(f"Enterprise features not available: {e}")

notes_router: Optional[APIRouter] = None
try:
    from backend.api.notes_api import router as n_router  # noqa: E402

    notes_router = n_router
except ImportError:
    pass

v2_router: Optional[APIRouter] = None
backend_config_router: Optional[APIRouter] = None
try:
    from backend.api.v2 import v2_router as v2_r  # noqa: E402
    from backend.api.backend_config_api import router as bc_router  # noqa: E402

    v2_router = v2_r
    backend_config_router = bc_router
except ImportError:
    pass

reconciliation_router: Optional[APIRouter] = None
try:
    from backend.api.reconciliation_api import router as rec_router

    reconciliation_router = rec_router
except ImportError:
    pass

pin_auth_router: Optional[APIRouter] = None
try:
    from backend.api.pin_auth_api import router as pa_router  # noqa: E402

    pin_auth_router = pa_router
except ImportError:
    pass

SecurityHeadersMiddleware: Any = None
try:
    from backend.middleware.security_headers import SecurityHeadersMiddleware as SHM  # noqa: E402

    SecurityHeadersMiddleware = SHM
except ImportError:
    pass

T = TypeVar("T")
E = TypeVar("E", bound=Exception)
R = TypeVar("R")

RUNNING_UNDER_PYTEST = "pytest" in sys.modules

ROOT_DIR = Path(__file__).parent

# SECURITY: settings from backend.config already enforce strong secrets
SECRET_KEY: str = cast(str, settings.JWT_SECRET)
ALGORITHM = settings.JWT_ALGORITHM
security = HTTPBearer(auto_error=False)

# Initialize Sentry if DSN is provided
sentry_dsn = getattr(settings, "SENTRY_DSN", None)
if sentry_dsn:
    try:
        sentry_sdk.init(
            dsn=sentry_dsn,
            integrations=[
                StarletteIntegration(transaction_style="endpoint"),
                FastApiIntegration(transaction_style="endpoint"),
            ],
            traces_sample_rate=getattr(settings, "SENTRY_TRACES_SAMPLE_RATE", 0.1),
            profiles_sample_rate=getattr(settings, "SENTRY_PROFILES_SAMPLE_RATE", 0.1),
            environment=(
                getattr(settings, "SENTRY_ENVIRONMENT", None)
                or getattr(settings, "ENVIRONMENT", "development")
            ),
        )
        logger.info("Sentry SDK initialized")
    except Exception as e:
        logger.warning(f"Failed to initialize Sentry SDK: {e}")
else:
    logger.info("Sentry DSN not found, skipping Sentry initialization")
# Create FastAPI app with lifespan
app = FastAPI(
    title=getattr(settings, "APP_NAME", "Stock Count API"),
    description="Stock counting and ERP sync API",
    version=getattr(settings, "APP_VERSION", "1.0.0"),
    lifespan=lifespan,
)

# Attach OpenTelemetry tracing to the FastAPI app if enabled
try:
    instrument_fastapi_app(app)
except Exception:
    # Tracing should never prevent the app from starting
    pass

# SECURITY FIX: Configure CORS with specific origins instead of wildcard
# Configure CORS from settings with environment-aware defaults
_env = getattr(settings, "ENVIRONMENT", "development").lower()
if getattr(settings, "CORS_ALLOW_ORIGINS", None):
    _allowed_origins = [
        o.strip() for o in (settings.CORS_ALLOW_ORIGINS or "").split(",") if o.strip()
    ]
elif _env == "development":
    # Base development origins (localhost variants)
    _allowed_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8081",
        "http://127.0.0.1:8081",
        "exp://localhost:8081",
    ]
    # Add additional dev origins from environment if configured
    if getattr(settings, "CORS_DEV_ORIGINS", None):
        dev_origins = [o.strip() for o in (settings.CORS_DEV_ORIGINS or "").split(",") if o.strip()]
        _allowed_origins.extend(dev_origins)
        logger.info(f"Added {len(dev_origins)} additional CORS origins from CORS_DEV_ORIGINS")
else:
    _allowed_origins = []
    if not getattr(settings, "CORS_ALLOW_ORIGINS", None):
        logger.warning(
            "CORS_ALLOW_ORIGINS not configured for non-development environment; "
            "requests may be blocked"
        )

_allowed_origins.extend(['https://app.lavanyaemart.app', 'https://stock.lavanyaemart.app'])
app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    # Allow local network IPs for development (Expo Go, LAN access)
    allow_origin_regex=(
        r"(https?|exp)://(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|"
        r"10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(:\d+)?"
    ),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Device-ID",
        "X-Requested-With",
        "X-Request-ID",
    ],
)

# Add security headers middleware (OWASP best practices)
if SecurityHeadersMiddleware is not None:
    try:
        # Enable security headers (strict CSP in production)
        strict_csp = os.getenv("STRICT_CSP", "false").lower() == "true"
        force_https = os.getenv("FORCE_HTTPS", "false").lower() == "true"

        app.add_middleware(
            SecurityHeadersMiddleware,  # type: ignore[arg-type]
            STRICT_CSP=strict_csp,
            force_https=force_https,
        )
        logger.info("✓ Security headers middleware enabled")
    except Exception as e:
        logger.warning(f"Security headers middleware registration failed: {str(e)}")
else:
    logger.warning("Security headers middleware not available")

# Create API router
api_router = APIRouter()
activity_log_service: Any = None


async def _maybe_await(value: Any) -> Any:
    """Compatibility helper for code paths that may return sync or async values."""
    return await value if inspect.isawaitable(value) else value


async def create_count_line(
    request: Request,
    line_data: CountLineCreate,
    current_user: dict[str, Any],
) -> dict[str, Any]:
    """
    Legacy compatibility helper retained for tests and old direct imports.

    This is intentionally lightweight and delegates the full API behavior to
    `backend.api.count_lines_api` routes.
    """
    session = await _maybe_await(db.sessions.find_one({"id": line_data.session_id}))
    if not session:
        session = await _maybe_await(db.sessions.find_one({"session_id": line_data.session_id}))
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    erp_item = await _maybe_await(db.erp_items.find_one({"item_code": line_data.item_code}))
    if not erp_item:
        raise HTTPException(status_code=404, detail="Item not found in ERP")

    erp_qty = erp_item.get("stock_qty", 0)
    count_line = {
        "id": str(uuid.uuid4()),
        "session_id": line_data.session_id,
        "item_code": line_data.item_code,
        "item_name": erp_item.get("item_name", ""),
        "barcode": erp_item.get("barcode"),
        "counted_qty": line_data.counted_qty,
        "erp_qty": erp_qty,
        "variance": line_data.counted_qty - erp_qty,
        "counted_by": current_user.get("username"),
        "counted_at": datetime.now(timezone.utc).replace(tzinfo=None),
        "status": "pending",
        "verified": False,
        "verified_at": None,
        "verified_by": None,
        "floor_no": line_data.floor_no,
        "rack_no": line_data.rack_no,
    }

    await _maybe_await(db.count_lines.insert_one(count_line))

    if line_data.floor_no or line_data.rack_no:
        await _maybe_await(
            db.erp_items.update_one(
                {"item_code": line_data.item_code},
                {"$set": {"floor_no": line_data.floor_no, "rack_no": line_data.rack_no}},
            )
        )

    return count_line


async def verify_stock(line_id: str, current_user: dict[str, Any]) -> dict[str, Any]:
    """Legacy compatibility helper retained for tests and old direct imports."""
    if current_user.get("role") not in {"supervisor", "admin"}:
        raise HTTPException(status_code=403, detail="Supervisor access required")

    update_result = await _maybe_await(
        db.count_lines.update_one(
            {"id": line_id},
            update={
                "$set": {
                    "verified": True,
                    "verified_by": current_user["username"],
                    "verified_at": datetime.now(timezone.utc).replace(tzinfo=None),
                }
            },
        )
    )
    if getattr(update_result, "modified_count", 0) == 0:
        raise HTTPException(status_code=404, detail="Count line not found")

    if activity_log_service:
        await activity_log_service.log_activity(
            user=current_user["username"],
            role=current_user.get("role", ""),
            action="verify_stock",
            entity_type="count_line",
            entity_id=line_id,
        )

    return {"message": "Stock verified", "verified": True}


async def unverify_stock(line_id: str, current_user: dict[str, Any]) -> dict[str, Any]:
    """Legacy compatibility helper retained for tests and old direct imports."""
    if current_user.get("role") not in {"supervisor", "admin"}:
        raise HTTPException(status_code=403, detail="Supervisor access required")

    update_result = await _maybe_await(
        db.count_lines.update_one(
            {"id": line_id},
            update={"$set": {"verified": False, "verified_by": None, "verified_at": None}},
        )
    )
    if getattr(update_result, "modified_count", 0) == 0:
        raise HTTPException(status_code=404, detail="Count line not found")

    if activity_log_service:
        await activity_log_service.log_activity(
            user=current_user["username"],
            role=current_user.get("role", ""),
            action="unverify_stock",
            entity_type="count_line",
            entity_id=line_id,
        )

    return {"message": "Stock verification removed", "verified": False}


async def get_count_lines(
    session_id: str,
    current_user: dict[str, Any],
    page: int = 1,
    page_size: int = 50,
    verified: Optional[bool] = None,
) -> dict[str, Any]:
    """Legacy compatibility helper retained for tests and old direct imports."""
    del current_user  # compatibility signature; role checks happen at route level
    skip = (page - 1) * page_size
    filter_query: dict[str, Any] = {"session_id": session_id}
    if verified is not None:
        filter_query["verified"] = verified

    total = await _maybe_await(db.count_lines.count_documents(filter_query))
    lines_cursor = (
        db.count_lines.find(filter_query, {"_id": 0})
        .sort("counted_at", -1)
        .skip(skip)
        .limit(page_size)
    )
    lines = await _maybe_await(lines_cursor.to_list(page_size))

    return {
        "items": lines,
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": (total + page_size - 1) // page_size,
            "has_next": skip + page_size < total,
            "has_prev": page > 1,
        },
    }

# Register all routers with the app
app.include_router(health_router, prefix="/api", tags=["health_api"])  # Also at /api/health
app.include_router(health_router, tags=["health"])  # Root level /health
app.include_router(info_router)  # Version check and info endpoints at /api/*


# Add root endpoint
@app.get("/", status_code=200)
async def root():
    """Root endpoint - basic service information"""
    return {
        "service": "stock-verify-backend",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {"health": "/health", "api": "/api", "docs": "/docs"},
    }


app.include_router(permissions_router, prefix="/api")  # Permissions management
app.include_router(user_management_router, prefix="/api")  # User management CRUD
app.include_router(mapping_router)  # Database mapping endpoints via mapping_api
app.include_router(exports_router, prefix="/api")  # Export functionality

app.include_router(auth_router, prefix="/api")
# items_router is included in v2_router, so we don't register it separately
app.include_router(search_router)  # Search API (has prefix /api/items)
app.include_router(metrics_router, prefix="/api")  # Metrics and monitoring
app.include_router(sync_router, prefix="/api")  # Sync status
app.include_router(sync_management_router, prefix="/api")  # Sync management
app.include_router(self_diagnosis_router, prefix="/api/diagnosis")  # Self-diagnosis tools
app.include_router(security_router)  # Security dashboard (has its own prefix)
app.include_router(verification_router)
app.include_router(erp_router, prefix="/api")  # ERP endpoints
app.include_router(variance_router, prefix="/api")  # Variance reasons and trendspoints
app.include_router(admin_control_router)  # Admin control endpoints
app.include_router(dynamic_fields_router)  # Dynamic fields management
app.include_router(dynamic_reports_router)  # Dynamic reports (has prefix /api/dynamic-reports)
app.include_router(realtime_dashboard_router, prefix="/api")  # Real-time dashboard (SSE/WebSocket)
app.include_router(logs_router, prefix="/api")  # Error and Activity logs
app.include_router(master_settings_router)  # Master settings
app.include_router(service_logs_router)  # Service logs
app.include_router(locations_router)  # Locations (Zones/Warehouses)
app.include_router(count_lines_router, prefix="/api")  # Count lines management
app.include_router(analytics_router, prefix="/api")  # Analytics and Heatmaps


# Phase 1-3: New Upgrade Routers
app.include_router(sync_batch_router)  # Batch sync API (has prefix /api/sync)
app.include_router(unknown_items_router)  # Unknown items management
app.include_router(rack_router)  # Rack management (has prefix /api/racks)
app.include_router(session_mgmt_router)  # Session management (has prefix /api/sessions)
app.include_router(user_settings_router)  # User settings (has prefix /api/user)
app.include_router(
    preferences_router, prefix="/api"
)  # User preferences (has prefix /api/users/me/preferences)
app.include_router(reporting_router)  # Reporting API (has prefix /api/reports)
app.include_router(admin_dashboard_router, prefix="/api")  # Admin Dashboard API
app.include_router(report_generation_router, prefix="/api")  # Report Generation API
app.include_router(error_reporting_router)  # Error Reporting API (has prefix /api/admin)
app.include_router(websocket_router)  # WebSocket updates (endpoint at /ws/updates)
app.include_router(sql_verification_router)  # SQL verification endpoints
app.include_router(enhanced_item_router)  # Enhanced Item API (has prefix /api/v2/erp/items)
app.include_router(pi_router)  # pi-mono integration (/api/pi)
logger.info("✓ Phase 1-3 upgrade routers registered")
logger.info("✓ Admin Dashboard, Report Generation, and Dynamic Reports APIs registered")

# Enterprise API (audit, security, feature flags, governance)
if ENTERPRISE_AVAILABLE and enterprise_router is not None:
    app.include_router(enterprise_router, prefix="/api")
    logger.info("✓ Enterprise API router registered at /api/enterprise/*")


@app.get("/api/mapping/test_direct")
def test_direct():
    return {"status": "ok"}


# Debug: Print all registered routes
for route in app.routes:
    if hasattr(route, "path"):
        logger.info(f"Route: {route.path}")
# Import and include Notes API router locally to avoid top-level import churn
# Include feature API routers
if notes_router or sync_conflicts_router:
    try:
        if notes_router:
            app.include_router(notes_router, prefix="/api")  # Notes feature
        if sync_conflicts_router:
            app.include_router(sync_conflicts_router, prefix="/api")  # Sync conflicts feature
    except Exception as _e:
        logger.warning(f"Feature API router registration failed: {_e}")

# Import and include Enrichment API router
if enrichment_router:
    try:
        app.include_router(enrichment_router)  # Enrichment endpoints
        logger.info("✓ Enrichment API router registered")
    except Exception as _e:
        logger.warning(f"Enrichment API router not available: {_e}")

# Include API v2 router (upgraded endpoints)
if v2_router and backend_config_router:
    try:
        app.include_router(v2_router)
        app.include_router(backend_config_router)
        logger.info("✓ API v2 router registered")
    except Exception as e:
        logger.warning(f"API v2 router registration failed: {e}")

# Register routers with clear prefixes
app.include_router(supervisor_pin.router, prefix="/api", tags=["Supervisor"])
# Register PIN auth router
if pin_auth_router:
    try:
        app.include_router(pin_auth_router, prefix="/api", tags=["PIN Auth"])
    except Exception as _e:
        logger.warning(f"PIN auth API router registration failed: {_e}")

if reconciliation_router:
    try:
        app.include_router(reconciliation_router)
    except Exception as _e:
        logger.warning(f"Reconciliation router registration failed: {_e}")

# ============================================================================
# Frontend Static Files Serving (Single Executable Mode)
# ============================================================================
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Path to frontend build artifacts
FRONTEND_DIST = ROOT_DIR.parent / "frontend" / "dist"

if FRONTEND_DIST.exists():
    logger.info(f"Serving frontend from {FRONTEND_DIST}")

    # Mount static assets (js, css, media)
    # Expo web build puts assets in dist/assets and other root files
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="assets")

    # Check for other common Expo web folders if they exist
    for folder in ["static", "fonts", "images"]:
        if (FRONTEND_DIST / folder).exists():
            app.mount(f"/{folder}", StaticFiles(directory=str(FRONTEND_DIST / folder)), name=folder)

    # Catch-all route for SPA (must be last)
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Allow API requests to pass through (though they should be caught above)
        if (
            full_path.startswith("api/")
            or full_path.startswith("docs")
            or full_path.startswith("openapi.json")
        ):
            raise HTTPException(status_code=404, detail="Not Found")

        # Prevent path traversal
        if ".." in full_path:
            raise HTTPException(status_code=404, detail="Not Found")

        # Check if specific file exists in dist (e.g., favicon.ico, manifest.json)
        file_path = FRONTEND_DIST / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)

        # Default to index.html for SPA routing
        return FileResponse(FRONTEND_DIST / "index.html")
else:
    logger.warning(
        f"Frontend dist not found at {FRONTEND_DIST}. Run 'npm run build:web' in frontend/."
    )


# Pydantic Models


# Note: verify_password and get_password_hash are imported from backend.utils.auth_utils (line 72)


def create_access_token(data: dict[str, Any]) -> str:
    """Create a JWT access token from user data"""
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> dict[str, Any]:
    return await auth_get_current_user(request, credentials)


# Initialize default users
async def init_default_users():
    """Create default users if they don't exist"""
    try:
        # Check for staff1
        staff_exists = await db.users.find_one({"username": "staff1"})
        if not staff_exists:
            await db.users.insert_one(
                {
                    "username": "staff1",
                    "hashed_password": get_password_hash("staff123"),
                    "full_name": "Staff Member",
                    "role": "staff",
                    "is_active": True,
                    "permissions": [],
                    "created_at": datetime.now(timezone.utc).replace(tzinfo=None),
                }
            )
            logger.info("Default user created: staff1/staff123")

        # Check for supervisor
        supervisor_exists = await db.users.find_one({"username": "supervisor"})
        if not supervisor_exists:
            await db.users.insert_one(
                {
                    "username": "supervisor",
                    "hashed_password": get_password_hash("super123"),
                    "full_name": "Supervisor",
                    "role": "supervisor",
                    "is_active": True,
                    "permissions": [],
                    "created_at": datetime.now(timezone.utc).replace(tzinfo=None),
                }
            )
            logger.info("Default user created: supervisor/super123")

        # Check for admin
        admin_exists = await db.users.find_one({"username": "admin"})
        if not admin_exists:
            await db.users.insert_one(
                {
                    "username": "admin",
                    "hashed_password": get_password_hash("admin123"),
                    "full_name": "Administrator",
                    "role": "admin",
                    "is_active": True,
                    "permissions": [],
                    "created_at": datetime.now(timezone.utc).replace(tzinfo=None),
                }
            )
            logger.info("Default user created: admin/admin123")
    except Exception as e:
        logger.error(f"Error creating default users: {str(e)}")
        raise


# Initialize mock ERP data
async def init_mock_erp_data():
    count = await db.erp_items.count_documents({})
    if count == 0:
        mock_items = [
            {
                "item_code": "ITEM001",
                "item_name": "Rice Bag 25kg",
                "barcode": "1234567890123",
                "stock_qty": 150.0,
                "mrp": 1200.0,
                "category": "Food",
                "warehouse": "Main",
                "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200",
            },
            {
                "item_code": "ITEM002",
                "item_name": "Cooking Oil 5L",
                "barcode": "1234567890124",
                "stock_qty": 80.0,
                "mrp": 650.0,
                "category": "Food",
                "warehouse": "Main",
            },
            {
                "item_code": "ITEM003",
                "item_name": "Sugar 1kg",
                "barcode": "1234567890125",
                "stock_qty": 200.0,
                "mrp": 50.0,
                "category": "Food",
                "warehouse": "Main",
            },
            {
                "item_code": "ITEM004",
                "item_name": "Tea Powder 250g",
                "barcode": "1234567890126",
                "stock_qty": 95.0,
                "mrp": 180.0,
                "category": "Beverages",
                "warehouse": "Main",
            },
            {
                "item_code": "ITEM005",
                "item_name": "Soap Bar",
                "barcode": "1234567890127",
                "stock_qty": 300.0,
                "mrp": 25.0,
                "category": "Personal Care",
                "warehouse": "Main",
            },
            {
                "item_code": "ITEM006",
                "item_name": "Shampoo 200ml",
                "barcode": "1234567890128",
                "stock_qty": 120.0,
                "mrp": 150.0,
                "category": "Personal Care",
                "warehouse": "Main",
            },
            {
                "item_code": "ITEM007",
                "item_name": "Toothpaste",
                "barcode": "1234567890129",
                "stock_qty": 180.0,
                "mrp": 75.0,
                "category": "Personal Care",
                "warehouse": "Main",
            },
            {
                "item_code": "ITEM008",
                "item_name": "Wheat Flour 10kg",
                "barcode": "1234567890130",
                "stock_qty": 90.0,
                "mrp": 400.0,
                "category": "Food",
                "warehouse": "Main",
            },
            {
                "item_code": "ITEM009",
                "item_name": "Detergent Powder 1kg",
                "barcode": "1234567890131",
                "stock_qty": 110.0,
                "mrp": 120.0,
                "category": "Household",
                "warehouse": "Main",
            },
            {
                "item_code": "ITEM010",
                "item_name": "Biscuits Pack",
                "barcode": "1234567890132",
                "stock_qty": 250.0,
                "mrp": 30.0,
                "category": "Snacks",
                "warehouse": "Main",
            },
            {
                "item_code": "ITEM_TEST_E2E",
                "item_name": "E2E Test Item",
                "barcode": "513456",
                "stock_qty": 100.0,
                "mrp": 999.0,
                "category": "Test",
                "warehouse": "Main",
            },
        ]
        await db.erp_items.insert_many(mock_items)
        logging.info("Mock ERP data initialized")


# Routes


# Helper functions for login
async def check_rate_limit(ip_address: str) -> Result[bool, Exception]:
    """
    Check if the IP has exceeded the login attempt limit.

    Rate limiting is configurable via RATE_LIMIT_ENABLED environment variable.
    Default: Enabled in production, disabled in development.
    """
    # Check if rate limiting is enabled (default: True for production)
    rate_limit_enabled = os.getenv("RATE_LIMIT_ENABLED", "true").lower() == "true"

    if not rate_limit_enabled:
        logger.debug(f"Rate limiting disabled for IP: {ip_address}")
        return Ok(True)

    namespace = "login_attempts"
    key = ip_address

    # Get current attempt count
    attempts = (await cache_service.get(namespace, key)) or 0
    try:
        attempts = int(attempts)
    except (ValueError, TypeError):
        attempts = 0

    # Configuration: max attempts and TTL
    max_attempts = int(getattr(settings, "RATE_LIMIT_MAX_ATTEMPTS", 5))
    ttl_seconds = int(getattr(settings, "RATE_LIMIT_TTL_SECONDS", 300))

    if attempts >= max_attempts:
        # Block for configured TTL period
        await cache_service.set(namespace, key, attempts, ttl=ttl_seconds)
        logger.warning(f"Rate limit exceeded for IP {ip_address}: {attempts} attempts")
        return Fail(
            RateLimitExceededError(
                f"Too many login attempts. Please try again in {ttl_seconds // 60} minutes.",
                retry_after=ttl_seconds,
            )
        )

    # Increment attempt counter with TTL
    await cache_service.set(namespace, key, attempts + 1, ttl=ttl_seconds)
    logger.debug(
        f"Rate limit check passed for IP {ip_address}: {attempts + 1}/{max_attempts} attempts"
    )
    return Ok(True)


async def find_user_by_username(username: str) -> Result[dict[str, Any], Exception]:
    """Find a user by username with error handling."""
    try:
        user = await db.users.find_one({"username": username})
        if not user:
            return Fail(NotFoundError("User not found"))
        return Ok(user)
    except Exception as e:
        logger.error(f"Error finding user {sanitize_for_logging(username)}: {str(e)}")
        return Fail(DatabaseError("Error accessing user data"))


async def generate_auth_tokens(
    user: dict[str, Any], ip_address: str, request: Request
) -> Result[dict[str, Any], Exception]:
    """Generate access and refresh tokens with error handling."""
    try:
        # Generate access token
        access_token_expires = timedelta(
            minutes=getattr(settings, "ACCESS_TOKEN_EXPIRE_MINUTES", 15)
        )
        access_token = create_access_token(
            {"sub": user["username"], "role": user.get("role", "staff")}
        )

        # Generate refresh token using service
        refresh_payload = {"sub": user["username"], "role": user.get("role", "staff")}
        refresh_token = refresh_token_service.create_refresh_token(refresh_payload)
        refresh_token_expires = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(
            days=getattr(settings, "REFRESH_TOKEN_EXPIRE_DAYS", 30)
        )

        # Store refresh token via service
        await refresh_token_service.store_refresh_token(
            refresh_token,
            user["username"],
            refresh_token_expires,
            ip_address=ip_address,
            user_agent=request.headers.get("user-agent"),
        )

        return Ok(
            {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "expires_in": int(access_token_expires.total_seconds()),
            }
        )
    except Exception as e:
        logger.error(f"Error generating auth tokens: {str(e)}")
        return Fail(DatabaseError("Error generating authentication tokens"))


async def log_failed_login_attempt(
    username: str, ip_address: str, user_agent: Optional[str], error: str
) -> None:
    """Log a failed login attempt."""
    try:
        await db.login_attempts.insert_one(
            {
                "username": username,
                "ip_address": ip_address,
                "user_agent": user_agent,
                "success": False,
                "timestamp": datetime.now(timezone.utc).replace(tzinfo=None),
                "error": error,
            }
        )
    except Exception as e:
        logger.error(f"Failed to log login attempt: {str(e)}")


async def log_successful_login(user: dict[str, Any], ip_address: str, request: Request) -> None:
    """Log a successful login."""
    try:
        await db.login_attempts.insert_one(
            {
                "user_id": user["_id"],
                "username": user["username"],
                "ip_address": ip_address,
                "user_agent": request.headers.get("user-agent"),
                "success": True,
                "timestamp": datetime.now(timezone.utc).replace(tzinfo=None),
            }
        )

        # Update last login timestamp
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login_at": datetime.now(timezone.utc).replace(tzinfo=None)}},
        )

        # Log to monitoring
        # monitoring_service.log_event(
        #     "user_login",
        #     user_id=user["_id"],
        #     username=user["username"],
        #     ip_address=ip_address,
        #     user_agent=request.headers.get("user-agent")
        # )
    except Exception as e:
        logger.error(f"Failed to log successful login: {str(e)}")


@api_router.post("/auth/refresh", response_model=ApiResponse[TokenResponse])
@result_to_response(success_status=200)
async def refresh_token(request: Request) -> Result[dict[str, Any], Exception]:
    """
    Refresh access token using refresh token.

    Request body should contain: {"refresh_token": "uuid-string"}
    """
    try:
        body = await request.json()
        refresh_token_value = body.get("refresh_token")

        if not refresh_token_value:
            return Fail(ValidationError("Refresh token is required"))

        from backend.services.runtime import get_refresh_token_service

        service = get_refresh_token_service()
        refreshed = await service.refresh_access_token(refresh_token_value)
        if not refreshed:
            return Fail(AuthenticationError("Invalid or expired refresh token"))

        return Ok(refreshed)
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        return Fail(e)


@api_router.post("/auth/logout")
async def logout(
    request: Request, current_user: dict[str, Any] = Depends(get_current_user)
) -> dict[str, Any]:
    """
    Logout user by revoking their refresh token.

    Request body should contain: {"refresh_token": "uuid-string"}
    """
    try:
        try:
            body = await request.json()
        except Exception:
            body = {}
        refresh_token_value = body.get("refresh_token")

        if refresh_token_value:
            from backend.services.runtime import get_refresh_token_service

            service = get_refresh_token_service()
            payload = await service.verify_refresh_token(refresh_token_value)
            if payload and payload.get("sub") == current_user.get("username"):
                await service.revoke_token(refresh_token_value)

        return {"message": "Logged out successfully"}
    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        raise HTTPException(status_code=500, detail="Logout failed") from e


# Register api_router AFTER all routes have been defined
app.include_router(
    api_router, prefix="/api"
)  # Main API endpoints with auth, sessions, items, count-lines

app.include_router(notifications_router)


# Run the server if executed directly
if __name__ == "__main__":
    # Validate environment variables before starting
    try:
        from backend.utils.env_validation import validate_environment, get_env_summary

        validate_environment()
        logger.info("Environment configuration validated successfully")
        logger.info(f"Environment summary: {get_env_summary()}")
    except ImportError:
        logger.warning("Environment validation module not found, skipping validation")
    except ValueError as e:
        logger.error(f"Environment validation failed: {e}")
        raise

    # Get configured port as starting point
    start_port = int(getattr(settings, "PORT", os.getenv("PORT", 8001)))
    # Use PortDetector to find port and IP
    port = PortDetector.find_available_port(start_port, range(start_port, start_port + 10))
    local_ip = PortDetector.get_local_ip()

    # Set PORT env var for lifespan to pick up
    os.environ["PORT"] = str(port)

    # Check for SSL certificates
    # Try to find certs in project root/nginx/ssl
    project_root = Path(__file__).parent.parent
    default_key = project_root / "nginx" / "ssl" / "privkey.pem"
    default_cert = project_root / "nginx" / "ssl" / "fullchain.pem"

    ssl_keyfile = os.getenv("SSL_KEYFILE", str(default_key))
    ssl_certfile = os.getenv("SSL_CERTFILE", str(default_cert))

    # Allow explicit disable via env var
    disable_ssl = os.getenv("DISABLE_SSL", "false").lower() == "true"

    use_ssl = (not disable_ssl) and os.path.exists(ssl_keyfile) and os.path.exists(ssl_certfile)

    # Save port to file for other services to discover
    protocol = "https" if use_ssl else "http"
    save_backend_info(port, local_ip, protocol)

    if use_ssl:
        logger.info(f"🔒 SSL certificates found. Starting server with HTTPS on port {port}...")
        uvicorn.run(
            "backend.server:app",
            host=os.getenv("HOST", "127.0.0.1"),  # Listen on localhost only for security
            port=port,
            reload=False,
            log_level="info",
            access_log=True,
            ssl_keyfile=ssl_keyfile,
            ssl_certfile=ssl_certfile,
        )
    else:
        logger.warning("⚠️  No SSL certificates found. Starting server with HTTP (Unencrypted)...")
        logger.info(f"Starting server on port {port}...")
        uvicorn.run(
            "backend.server:app",
            host=os.getenv("HOST", "0.0.0.0"),  # Listen on all interfaces for LAN access
            port=port,
            reload=False,
            log_level="info",
            access_log=True,
        )
