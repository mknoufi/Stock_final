# ruff: noqa: E402
# flake8: noqa: E402

import asyncio
import logging
import os
import sys
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.security import HTTPBearer

# API Initialization (Keep existing imports to ensure routes aren't broken if they depend on side effects)
from backend.api.enhanced_item_api import init_enhanced_api
from backend.api.erp_api import init_erp_api

from backend.api.metrics_api import set_monitoring_service
from backend.api.sync_management_api import set_change_detection_service
from backend.api.sync_status_api import set_auto_sync_manager
from backend.auth.dependencies import init_auth_dependencies
from backend.config import settings
from backend.core import globals as g
from backend.core.startup_helpers import (
    init_mongodb,
    init_redis_services,
    init_sql_server,
    init_services,
    init_enterprise_services,
)
from backend.db.initialization import init_default_users, init_mock_erp_data
from backend.db.migrations import MigrationManager
from backend.db.runtime import set_client, set_db
from backend.services.auto_sync_manager import AutoSyncManager
from backend.services.change_detection_sync import ChangeDetectionSyncService
from backend.services.database_health import DatabaseHealthService
from backend.services.scheduled_export_service import ScheduledExportService
from backend.services.sql_sync_service import SQLSyncService
from backend.services.sync_conflicts_service import SyncConflictsService
from backend.services.runtime import set_cache_service, set_refresh_token_service
from backend.services.refresh_token import RefreshTokenService
from backend.services.batch_operations import BatchOperationsService
from backend.services.redis_service import close_redis
from backend.services.mdns_service import start_mdns, stop_mdns
from backend.services.rate_limiter import ConcurrentRequestHandler, RateLimiter
from backend.sql_server_connector import SQLServerConnector
from backend.utils.port_detector import PortDetector, save_backend_info
from backend.utils.logging_config import setup_logging
from backend.utils.tracing import init_tracing

# --- Global Logic (Deprecated but maintained for compatibility if imported) ---
# NOTE: pwd_context is removed as it was unused and duplicated in auth_utils.py

# Security defaults
# SECURITY: settings from backend.config already enforce strong secrets
# Note: These are module level for easy import if needed, but consumers should use settings
SECRET_KEY = settings.JWT_SECRET
ALGORITHM = settings.JWT_ALGORITHM
security = HTTPBearer(auto_error=False)

# Setup logging
logger = setup_logging(
    log_level=settings.LOG_LEVEL,
    log_format=settings.LOG_FORMAT,
    log_file=settings.LOG_FILE or "app.log",
    app_name=settings.APP_NAME,
)

# Initialize tracing
try:
    init_tracing()
except Exception:
    pass

project_root = Path(__file__).parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

RUNNING_UNDER_PYTEST = "pytest" in sys.modules
if not RUNNING_UNDER_PYTEST:
    logging.basicConfig(level=logging.INFO)
else:
    logging.getLogger().setLevel(logging.INFO)
logger = logging.getLogger(__name__)

# Backward-compatible module-level handle for tests and legacy patches.
migration_manager = None


@asynccontextmanager
async def lifespan(app: FastAPI):  # noqa: C901
    """
    Refactored Lifespan Context Manager.
    Delegates initialization to helpers in backend.core.startup_helpers.
    """
    # Startup
    logger.info("≡ƒÜÇ Starting StockVerify application...")

    # 1. Initialize MongoDB
    client, db, _ = await init_mongodb(settings)

    # Initialize runtime globals for legacy access
    set_client(client)
    set_db(db)
    g.db = db
    g.client = client

    # 2. Initialize Redis Services (Redis, PubSub, LockManager)
    redis_service, pubsub_service, lock_manager = await init_redis_services()
    g.redis_service = redis_service
    g.pubsub_service = pubsub_service

    # 3. Initialize SQL Server Connector
    sql_connector = SQLServerConnector()
    g.sql_connector = sql_connector
    sql_connected = await init_sql_server(settings, sql_connector, db)

    # 4. Initialize Core Services (Cache, Locks, Variants, Snapshots, Logs)
    services = await init_services(db, redis_service)

    # Inject into globals and local vars for further setup
    cache_service = services["cache_service"]
    set_cache_service(cache_service)
    g.cache_service = cache_service
    g.rate_limiter = RateLimiter(
        default_rate=getattr(settings, "RATE_LIMIT_PER_MINUTE", 100),
        default_burst=getattr(settings, "RATE_LIMIT_BURST", 20),
        per_user=True,
    )
    g.concurrent_handler = ConcurrentRequestHandler(
        max_concurrent=getattr(settings, "MAX_CONCURRENT", 50),
        queue_size=getattr(settings, "QUEUE_SIZE", 100),
    )
    g.activity_log_service = services["activity_log_service"]
    g.error_log_service = services["error_log_service"]
    g.lock_service = services["lock_service"]
    g.variant_service = services["variant_service"]
    g.snapshot_service = services["snapshot_service"]

    # Refresh Token & Batch Operations
    refresh_token_service = RefreshTokenService(db, settings.JWT_SECRET, settings.JWT_ALGORITHM)
    set_refresh_token_service(refresh_token_service)
    g.refresh_token_service = refresh_token_service
    g.batch_operations = BatchOperationsService(db)

    # 5. Initialize Auth Dependencies
    init_auth_dependencies(db, settings.JWT_SECRET, settings.JWT_ALGORITHM)

    # 6. mDNS Service
    try:
        logger.info("≡ƒîÉ Starting mDNS service...")
        mdns_port = int(os.getenv("PORT", getattr(settings, "PORT", 8001)))
        await start_mdns(port=mdns_port)
    except Exception as e:
        logger.warning(f"ΓÜá∩╕Å mDNS service failed to start: {e}")

    # 7. Database Migration
    global migration_manager
    migration_manager = MigrationManager(db)
    g.migration_manager = migration_manager
    # CRITICAL: Verify MongoDB availability
    try:
        await db.command("ping")
        logger.info("Γ£à MongoDB connection verified")

        # Init Defaults
        await init_default_users(db)
        await init_mock_erp_data(db)

        # Run Migrations
        await migration_manager.ensure_indexes()
        await migration_manager.run_migrations()
    except Exception as e:
        logger.error(f"Γ¥î MongoDB initialization failed: {e}")
        if os.getenv("ENVIRONMENT", "development").lower() not in ["development", "dev"]:
            raise SystemExit("MongoDB required") from e

    # 8. Functional Services (Sync, Export, Health)

    # Database Health
    database_health_service = DatabaseHealthService(
        mongo_db=db,
        sql_connector=sql_connector,
        check_interval=60,
        mongo_uri=settings.MONGO_URL,
        db_name=settings.DB_NAME,
        mongo_client_options={},  # passed inside db init, not easily accessible here but health service handles it
    )
    database_health_service.start()
    g.database_health_service = database_health_service

    # ERP Sync Service
    erp_sync_service = None
    if getattr(settings, "ERP_SYNC_ENABLED", True):
        try:
            erp_sync_service = SQLSyncService(
                sql_connector=sql_connector,
                mongo_db=db,
                sync_interval=getattr(settings, "ERP_SYNC_INTERVAL", 3600),
                enabled=True,
            )
            # await erp_sync_service.start() # Start async
            # Note: in original lifespan it was awaited line 580
            # We will await it below
        except Exception as e:
            logger.warning(f"ERP sync init failed: {e}")

    g.sql_sync_service = erp_sync_service

    # Change Detection
    change_detection_sync = None
    if getattr(settings, "CHANGE_DETECTION_ENABLED", True):
        change_detection_sync = ChangeDetectionSyncService(
            sql_connector=sql_connector,
            mongo_db=db,
            sync_interval=getattr(settings, "CHANGE_DETECTION_INTERVAL", 300),
            enabled=True,
        )
        set_change_detection_service(change_detection_sync)

    # Auto Sync Manager
    auto_sync_manager = None
    if getattr(settings, "AUTO_SYNC_ENABLED", True):
        auto_sync_manager = AutoSyncManager(
            sql_connector=sql_connector,
            mongo_db=db,
            sync_interval=getattr(settings, "AUTO_SYNC_INTERVAL", 3600),
            check_interval=30,
            enabled=sql_connected,
        )
        set_auto_sync_manager(auto_sync_manager)
        g.auto_sync_manager = auto_sync_manager

        if sql_connected:
            asyncio.create_task(auto_sync_manager.start())

    # Start Sync Services
    if erp_sync_service:
        await erp_sync_service.start()
    if change_detection_sync:
        await change_detection_sync.start()

    # Scheduled Export
    scheduled_export_service = ScheduledExportService(db)
    scheduled_export_service.start()
    g.scheduled_export_service = scheduled_export_service

    # Sync Conflicts
    sync_conflicts_service = SyncConflictsService(db)
    g.sync_conflicts_service = sync_conflicts_service

    # Monitoring (for Metrics API)
    monitoring_service = None  # Need to import MonitoringService?
    # Original lifespan line 258: monitoring_service = MonitoringService(...)
    from backend.services.monitoring_service import MonitoringService

    monitoring_service = MonitoringService(
        history_size=getattr(settings, "METRICS_HISTORY_SIZE", 1000),
    )
    set_monitoring_service(monitoring_service)
    g.monitoring_service = monitoring_service

    # 9. Initialize APIs
    if services["cache_service"]:
        init_erp_api(db, services["cache_service"])
        init_enhanced_api(db, services["cache_service"], monitoring_service, sql_connector)

    else:
        logger.warning("Cache service missing, skipping full API init")

    # CountLines API Init - Self-contained now
    logger.info("Γ£ô CountLines API initialized")

    # 10. Enterprise Services
    await init_enterprise_services(app, db)
    # Inject enterprise helpers to globals
    if g.ENTERPRISE_AVAILABLE:
        g.enterprise_audit_service = getattr(app.state, "enterprise_audit", None)
        g.enterprise_security_service = getattr(app.state, "enterprise_security", None)

    # 11. Search Service
    try:
        from backend.services.search_service import init_search_service

        init_search_service(db)
    except Exception as e:
        logger.error(f"Search init failed: {e}")

    # Port Info
    try:
        port = int(os.getenv("PORT", getattr(settings, "PORT", 8001)))
        save_backend_info(port, PortDetector.get_local_ip(), "http")
    except Exception:
        pass

    logger.info("Γ£à Application startup complete")

    yield

    # Shutdown
    logger.info("≡ƒ¢æ Shutting down...")

    # Stop Services
    if scheduled_export_service:
        await scheduled_export_service.stop()
    if database_health_service:
        await database_health_service.stop()
    if auto_sync_manager:
        await auto_sync_manager.stop()

    # Stop Redis
    if pubsub_service:
        await pubsub_service.stop()
    await close_redis()

    if "client" in locals() and client:
        client.close()

    await stop_mdns()
    logger.info("Γ£ô Shutdown complete")
