import asyncio
import logging
import sys
from typing import Any, Tuple

from motor.motor_asyncio import AsyncIOMotorClient

from backend.config import settings
from backend.services.database_optimizer import DatabaseOptimizer

# Services
from backend.services.redis_service import init_redis as _init_redis_client
from backend.services.pubsub_service import get_pubsub_service
from backend.services.lock_manager import get_lock_manager
from backend.sql_server_connector import SQLServerConnector
from backend.core import globals as g

logger = logging.getLogger(__name__)


async def init_mongodb(settings) -> Tuple[AsyncIOMotorClient, Any, Any]:
    """Initialize MongoDB connection and optimizer."""
    mongo_url = settings.MONGO_URL.rstrip("/")
    mongo_client_options = {
        "maxPoolSize": 100,
        "minPoolSize": 10,
        "maxIdleTimeMS": 45000,
        "serverSelectionTimeoutMS": 5000,
        "connectTimeoutMS": 20000,
        "socketTimeoutMS": 20000,
        "retryWrites": True,
        "retryReads": True,
    }
    client = AsyncIOMotorClient(mongo_url, **mongo_client_options)

    # Database optimizer
    # Logic from lifespan:
    # if not RUNNING_UNDER_PYTEST: client = db_optimizer.optimize_client()
    # We return client unmodified or modify it here if we can detect pytest environment
    # or pass a flag. For now, we return it as is, and let lifespan handle optimization wrapping
    # if strictly needed, OR we replicate logic.
    # Lifespan line 188: if not RUNNING_UNDER_PYTEST: ...
    # We can assume RUNNING_UNDER_PYTEST is handled by caller or check sys.modules
    RUNNING_UNDER_PYTEST = "pytest" in sys.modules
    if not RUNNING_UNDER_PYTEST:
        db_optimizer = DatabaseOptimizer(
            mongo_client=client,
            max_pool_size=100,
            min_pool_size=10,
            max_idle_time_ms=45000,
            server_selection_timeout_ms=5000,
            connect_timeout_ms=20000,
            socket_timeout_ms=20000,
        )
        client = db_optimizer.optimize_client()

    db = client[settings.DB_NAME]

    return client, db, None  # 3rd element was unused in previous thought, removing to be cleaner


async def init_redis_services() -> Tuple[Any, Any, Any]:
    """Initialize Redis, PubSub, and Lock Manager."""
    try:
        logger.info("≡ƒôª Phase 1: Initializing Redis services...")
        redis_service = await _init_redis_client()
        logger.info("Γ£ô Redis service initialized")

        pubsub_service = get_pubsub_service(redis_service)
        await pubsub_service.start()
        logger.info("Γ£ô Pub/Sub service started")

        lock_manager = get_lock_manager(redis_service)
        logger.info("Γ£ô Lock manager initialized")

        return redis_service, pubsub_service, lock_manager
    except Exception as e:
        logger.warning(f"ΓÜá∩╕Å Redis services not available: {str(e)}")
        logger.warning("Multi-user locking and real-time updates will be disabled")
        return None, None, None


async def init_sql_server(settings, sql_connector: SQLServerConnector, db: Any = None) -> bool:
    """Initialize SQL Server connection, prioritizing database-stored config."""
    sql_host = getattr(settings, "SQL_SERVER_HOST", None)
    sql_port = getattr(settings, "SQL_SERVER_PORT", 1433)
    sql_database = getattr(settings, "SQL_SERVER_DATABASE", None)
    sql_user = getattr(settings, "SQL_SERVER_USER", None)
    sql_password = getattr(settings, "SQL_SERVER_PASSWORD", None)

    # Try to load from MongoDB if db is provided
    if db is not None:
        try:
            db_config = await db.erp_config.find_one({}, {"_id": 0})
            if db_config:
                logger.info(
                    "≡ƒôä Found SQL configuration in MongoDB, overriding environment settings"
                )
                if db_config.get("host"):
                    sql_host = db_config["host"]
                if db_config.get("port"):
                    sql_port = db_config["port"]
                if db_config.get("database"):
                    sql_database = db_config["database"]
                if db_config.get("user"):
                    sql_user = db_config["user"]
                if db_config.get("password"):
                    sql_password = db_config["password"]
        except Exception as e:
            logger.warning(f"Failed to load SQL config from MongoDB: {e}")

    sql_password_placeholder = isinstance(sql_password, str) and sql_password.strip().lower() in {
        "",
        "your-sql-password",
        "change-me",
        "password",
        "changeme",
        "your-actual-sql-password",
    }
    sql_credentials_ready = (not sql_user) or (sql_password and not sql_password_placeholder)

    # Attach to router (moved logic)
    try:
        from backend.api.count_lines_api import router as count_lines_router

        setattr(count_lines_router, "sql_connector", sql_connector)
        logger.info("Γ£ô SQL connector attached to count_lines_router")
    except Exception as e:
        logger.warning(f"Failed to attach SQL connector to count_lines_router: {str(e)}")

    if sql_host and sql_database and sql_credentials_ready:
        logger.info(
            f"Attempting to connect to SQL Server at {sql_host}:{sql_port}/{sql_database}..."
        )
        try:
            startup_sql_timeout = getattr(settings, "SQL_STARTUP_CONNECT_TIMEOUT", 5)
            await asyncio.wait_for(
                asyncio.to_thread(
                    sql_connector.connect, sql_host, sql_port, sql_database, sql_user, sql_password
                ),
                timeout=startup_sql_timeout,
            )
            logger.info("OK: SQL Server connection established")
            return True
        except Exception as e:
            logger.warning(f"SQL Server connection failed: {str(e)}")
            return False
    else:
        logger.warning("SQL Server credentials not configured.")
        return False


async def init_services(db, redis_service) -> dict:
    """Initialize functional services."""
    services = {}

    # 1. Cache Service
    try:
        from backend.services.cache_service import CacheService

        # Use settings module directly as lifespan does
        cache_service = CacheService(
            redis_url=getattr(settings, "REDIS_URL", None),
            default_ttl=getattr(settings, "CACHE_TTL", 3600),
        )
        await cache_service.initialize()
        services["cache_service"] = cache_service
    except Exception as e:
        logger.error(f"Failed to initialize cache service: {e}")
        services["cache_service"] = None

    # 2. Lock Service
    try:
        from backend.services.lock_service import LockService

        # Use db as per original lifespan
        lock_service = LockService(db)
        await lock_service.initialize()
        services["lock_service"] = lock_service
    except Exception as e:
        logger.error(f"Failed to initialize lock service: {e}")
        services["lock_service"] = None

    # 3. Variant Service
    try:
        from backend.services.variant_service import VariantService

        variant_service = VariantService(db)
        services["variant_service"] = variant_service
    except Exception as e:
        logger.error(f"Failed to initialize variant service: {e}")
        services["variant_service"] = None

    # 4. Snapshot Service
    try:
        from backend.services.snapshot_service import SnapshotService

        snapshot_service = SnapshotService(db)
        services["snapshot_service"] = snapshot_service
    except Exception as e:
        logger.error(f"Failed to initialize snapshot service: {e}")
        services["snapshot_service"] = None

    # 5. Activity & Error Logs
    from backend.services.activity_log import ActivityLogService
    from backend.services.error_log import ErrorLogService

    services["activity_log_service"] = ActivityLogService(db)
    services["error_log_service"] = ErrorLogService(db)

    return services


async def init_enterprise_services(app, db) -> None:
    """Initialize enterprise services if available."""
    if not g.ENTERPRISE_AVAILABLE:
        app.state.enterprise_audit = None
        app.state.enterprise_security = None
        app.state.feature_flags = None
        app.state.data_governance = None
        return

    try:
        from backend.services.enterprise_audit import EnterpriseAuditService

        app.state.enterprise_audit = EnterpriseAuditService(db)
        await app.state.enterprise_audit.initialize()
        logger.info("Γ£ô Enterprise audit service initialized")
    except Exception as e:
        app.state.enterprise_audit = None
        logger.warning(f"Enterprise audit service not available: {str(e)}")

    try:
        from backend.services.enterprise_security import EnterpriseSecurityService

        app.state.enterprise_security = EnterpriseSecurityService(db)
        await app.state.enterprise_security.initialize()
        logger.info("Γ£ô Enterprise security service initialized")
    except Exception as e:
        app.state.enterprise_security = None
        logger.warning(f"Enterprise security service not available: {str(e)}")

    try:
        from backend.services.feature_flags import FeatureFlagService

        app.state.feature_flags = FeatureFlagService(db)
        await app.state.feature_flags.initialize()
        logger.info("Γ£ô Feature flags service initialized")
    except Exception as e:
        app.state.feature_flags = None
        logger.warning(f"Feature flags service not available: {str(e)}")

    try:
        from backend.services.data_governance import DataGovernanceService

        app.state.data_governance = DataGovernanceService(db)
        await app.state.data_governance.initialize()
        logger.info("Γ£ô Data governance service initialized")
    except Exception as e:
        app.state.data_governance = None
        logger.warning(f"Data governance service not available: {str(e)}")
