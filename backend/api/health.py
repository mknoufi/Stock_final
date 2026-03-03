"""
Health Check Endpoints
Provides health, readiness, and liveness checks for monitoring and Kubernetes
"""

import logging
import os
import re
from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import APIRouter, Query, status
from fastapi.responses import JSONResponse
from backend.config import settings

logger = logging.getLogger(__name__)

health_router = APIRouter(prefix="/health", tags=["health"])
info_router = APIRouter(prefix="/api", tags=["info"])

# Import MongoDB status checker
try:
    from backend.utils.port_detector import PortDetector

    HAS_PORT_DETECTOR = True
except ImportError:
    HAS_PORT_DETECTOR = False
    logger.warning("PortDetector not available for MongoDB status checks")
    # Alert in health checks when PortDetector is missing
    environment = os.getenv("ENVIRONMENT", "development").lower()
    if environment in ("production", "staging"):
        logger.error(
            "CRITICAL: PortDetector missing in production/staging environment. "
            "MongoDB status checks will be degraded."
        )


def get_mongodb_status() -> dict[str, Any]:
    """Get MongoDB port and running status"""
    if not HAS_PORT_DETECTOR:
        return {
            "status": "unknown",
            "port": 27017,
            "is_running": False,
            "error": "Port detector not available",
        }

    try:
        mongo_status = PortDetector.get_mongo_status()
        return {
            "status": mongo_status["status"],
            "port": mongo_status["port"],
            "is_running": mongo_status["is_running"],
            "url": mongo_status["url"],
        }
    except Exception as e:
        logger.error(f"Error checking MongoDB status: {e}")
        return {"status": "error", "port": 27017, "is_running": False, "error": str(e)}


async def _build_readiness_checks() -> dict[str, Any]:
    checks: dict[str, Any] = {
        "mongodb": False,
        "sql_server": False,
        "timestamp": datetime.now(timezone.utc).replace(tzinfo=None).isoformat(),
    }

    # Run checks
    await _check_mongodb_health(checks)
    await _check_sql_server_health(checks)
    _check_system_resources_health(checks)

    return checks


def _is_sql_configured() -> bool:
    try:
        from backend.config import settings
        from backend.core import globals as g

        # 1. Check if sql_connector already has configuration (active state)
        if g.sql_connector and getattr(g.sql_connector, "config", None):
            return True

        # 2. Check settings (environment variables)
        sql_host = getattr(settings, "SQL_SERVER_HOST", None)
        sql_database = getattr(settings, "SQL_SERVER_DATABASE", None)
        sql_user = getattr(settings, "SQL_SERVER_USER", None)
        sql_password = getattr(settings, "SQL_SERVER_PASSWORD", None)

        sql_password_placeholder = isinstance(
            sql_password, str
        ) and sql_password.strip().lower() in {
            "",
            "your-sql-password",
            "change-me",
            "password",
            "changeme",
            "your-actual-sql-password",
        }
        sql_credentials_ready = (not sql_user) or (sql_password and not sql_password_placeholder)

        return bool(sql_host and sql_database and sql_credentials_ready)
    except Exception:
        return False


async def _get_cache_readiness() -> tuple[str, dict[str, Any]]:
    from backend.core.globals import cache_service

    if not cache_service:
        return "MISSING", {"reason": "Cache service not initialized"}

    try:
        status = await cache_service.get_status()
        if status.get("status") == "healthy":
            return "OK", {"details": status}
        return "MISSING", {"details": status, "reason": status.get("details", {}).get("error")}
    except Exception as exc:
        return "MISSING", {"reason": str(exc)}


async def _get_redis_readiness() -> tuple[str, dict[str, Any]]:
    from backend.core.globals import redis_service

    if not redis_service:
        return "DEGRADED", {"reason": "Redis service not initialized"}

    try:
        status = await redis_service.health_check()
        if status.get("status") == "healthy":
            return "OK", {"details": status}
        return "DEGRADED", {"details": status, "reason": status.get("error")}
    except Exception as exc:
        return "DEGRADED", {"reason": str(exc)}


async def _get_sql_readiness(checks: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    if not _is_sql_configured():
        return "DISABLED", {"reason": "SQL Server not configured"}

    if checks.get("sql_server"):
        return "CONNECTED", {}

    reason = checks.get("sql_server_error") or "SQL Server unhealthy"
    return "DISABLED", {"reason": reason}


def _get_autosync_readiness() -> tuple[str, dict[str, Any]]:
    from backend.core.globals import auto_sync_manager

    if not auto_sync_manager:
        return "OFF", {"reason": "Auto-sync manager not initialized"}

    try:
        status = auto_sync_manager.get_status()
        if status.get("enabled") and status.get("running"):
            return "ACTIVE", {"details": status}
        if not status.get("enabled"):
            return "OFF", {"reason": "Auto-sync disabled", "details": status}
        return "OFF", {"reason": "Auto-sync not running", "details": status}
    except Exception as exc:
        return "OFF", {"reason": str(exc)}


def _get_sql_last_sync() -> Optional[str]:
    from backend.core.globals import sql_sync_service

    if not sql_sync_service:
        return None
    try:
        stats = sql_sync_service.get_stats()
        return stats.get("last_sync")
    except Exception:
        return None


async def build_ready_payload() -> dict[str, Any]:
    checks = await _build_readiness_checks()

    mongo_ok = bool(checks.get("mongodb"))
    sql_status, sql_details = await _get_sql_readiness(checks)
    cache_status, cache_details = await _get_cache_readiness()
    autosync_status, autosync_details = _get_autosync_readiness()

    sql_enabled = _is_sql_configured()
    try:
        from backend.core.globals import sql_connector

        sql_enabled = sql_enabled or bool(getattr(sql_connector, "config", None))
    except Exception:
        pass

    payload = {
        "system_ready": mongo_ok,
        "mongo": "OK" if mongo_ok else "OFFLINE",
        "sql": "CONNECTED" if sql_status == "CONNECTED" else "OFFLINE",
        "cache": "OK" if cache_status == "OK" else "DEGRADED",
        "autosync": "ACTIVE" if autosync_status == "ACTIVE" else "OFF",
        "timestamp": datetime.now(timezone.utc).replace(tzinfo=None).isoformat(),
        "features": {
            "sql": {
                "enabled": sql_enabled,
                "status": "CONNECTED" if sql_status == "CONNECTED" else "OFFLINE",
                "last_sync": _get_sql_last_sync(),
                **({"reason": sql_details.get("reason")} if sql_details.get("reason") else {}),
            },
            "cache": {"status": cache_status, **cache_details},
            "autosync": {"status": autosync_status, **autosync_details},
        },
    }

    return payload


async def _check_mongodb_health(checks: dict[str, Any]) -> None:
    from backend.core.globals import database_health_service

    if not database_health_service:
        checks["mongodb"] = False
        checks["mongodb_error"] = "Health service not initialized"
        return

    try:
        mongo_result = await database_health_service.check_mongo_health()
        checks["mongodb"] = mongo_result.get("status") == "healthy"
        if not checks["mongodb"]:
            checks["mongodb_error"] = mongo_result.get("error")
    except Exception as exc:
        logger.error(f"MongoDB health check failed: {exc}")
        checks["mongodb_error"] = str(exc)


async def _check_sql_server_health(checks: dict[str, Any]) -> None:
    from backend.core.globals import database_health_service

    if not database_health_service:
        checks["sql_server"] = False
        checks["sql_server_error"] = "Health service not initialized"
        return

    try:
        sql_result = await database_health_service.check_sql_server_health()
        checks["sql_server"] = sql_result.get("status") == "healthy"
        if sql_result.get("status") != "healthy":
            checks["sql_server_error"] = sql_result.get("error")
    except Exception as exc:
        logger.error(f"SQL Server health check failed: {exc}")
        checks["sql_server_error"] = str(exc)


def _check_system_resources_health(checks: dict[str, Any]) -> None:
    try:
        resources = _gather_system_resources()
        checks["system_resources"] = resources

        # Check disk space
        if resources["disk"]["status"] == "critical":
            checks["disk_space"] = False
            checks["disk_error"] = "Disk space critical"
        else:
            checks["disk_space"] = True
    except Exception as exc:
        logger.warning(f"System resource check check failed: {exc}")
        checks["system_resources_error"] = str(exc)


async def _build_startup_checks() -> dict[str, Any]:
    from backend.core.globals import database_health_service

    checks: dict[str, Any] = {
        "mongodb": False,
        "sql_server": False,
        "migrations": True,
        "timestamp": datetime.now(timezone.utc).replace(tzinfo=None).isoformat(),
    }

    if not database_health_service:
        return checks

    try:
        mongo_result = await database_health_service.check_mongo_health()
        checks["mongodb"] = mongo_result.get("status") == "healthy"
    except Exception as exc:
        logger.error(f"MongoDB startup check failed: {exc}")

    try:
        sql_result = await database_health_service.check_sql_server_health()
        checks["sql_server"] = sql_result.get("status") == "healthy"
    except Exception as exc:
        logger.error(f"SQL Server startup check failed: {exc}")

    return checks


def _build_mongo_pool_info() -> dict[str, Any]:
    return {
        "max_pool_size": "unknown",
        "pool_available": "unknown",
    }


def _gather_system_resources() -> dict[str, Any]:
    import time

    import psutil

    process = psutil.Process(os.getpid())

    try:
        uptime_seconds = max(0.0, time.time() - process.create_time())
    except Exception as exc:
        logger.warning(f"Uptime calculation failed: {exc}")
        uptime_seconds = 0.0

    try:
        disk_usage = psutil.disk_usage("/")
        disk_free_gb = disk_usage.free / (1024**3)
        disk_total_gb = disk_usage.total / (1024**3)
        disk_percent = disk_usage.percent
    except Exception as exc:
        logger.warning(f"Disk usage check failed: {exc}")
        disk_free_gb = 0
        disk_total_gb = 0
        disk_percent = 0

    return {
        "memory_mb": round(process.memory_info().rss / 1024 / 1024, 2),
        "cpu_percent": round(process.cpu_percent(interval=0.1), 2),
        "threads": process.num_threads(),
        "uptime_seconds": uptime_seconds,
        "disk": {
            "free_gb": round(disk_free_gb, 2),
            "total_gb": round(disk_total_gb, 2),
            "used_percent": round(disk_percent, 2),
            "status": (
                "healthy" if disk_percent < 90 else "warning" if disk_percent < 95 else "critical"
            ),
        },
    }


def _augment_sql_pool_stats(connection_pool, connection_pools: dict[str, Any]) -> None:
    if connection_pool is None:
        return

    try:
        pool_stats = connection_pool.get_stats()
        connection_pools["sql_server"] = {
            "initialized": True,
            "pool_size": pool_stats.get("pool_size", 0),
            "available": pool_stats.get("available", 0),
            "checked_out": pool_stats.get("checked_out", 0),
            "utilization_percent": pool_stats.get("utilization_percent", 0),
        }
    except Exception as exc:
        connection_pools["sql_server"] = {
            "initialized": True,
            "error": str(exc),
        }


@info_router.get("/version", status_code=status.HTTP_200_OK)
async def get_version() -> dict[str, Any]:
    """
    Get application version and build information

    Usage: Version checking, debugging, monitoring
    """
    try:
        from backend.config import settings

        version_info = {
            "version": getattr(settings, "APP_VERSION", "1.0.0"),
            "name": getattr(settings, "APP_NAME", "Stock Count API"),
            "environment": getattr(
                settings, "ENVIRONMENT", os.getenv("ENVIRONMENT", "development")
            ),
            "build_time": datetime.now(timezone.utc).replace(tzinfo=None).isoformat(),
        }

        return version_info
    except Exception as e:
        logger.error(f"Error getting version: {e}")
        return {
            "version": "unknown",
            "name": "Stock Count API",
            "environment": os.getenv("ENVIRONMENT", "unknown"),
            "error": str(e),
        }


@health_router.get("", status_code=status.HTTP_200_OK, include_in_schema=False)
@health_router.get("/", status_code=status.HTTP_200_OK)
async def health_check() -> dict[str, Any]:
    """
    Basic health check endpoint
    Returns 200 if service is running

    Usage: Monitoring systems, load balancers
    """
    return await build_ready_payload()


@health_router.get("/live", status_code=status.HTTP_200_OK)
async def liveness_check() -> dict[str, Any]:
    """
    Kubernetes liveness probe
    Returns 200 if application is alive (not deadlocked)

    Usage: k8s livenessProbe
    Failure action: Restart container
    """
    return {"alive": True, "timestamp": datetime.now(timezone.utc).replace(tzinfo=None).isoformat()}


@health_router.get("/ready", status_code=status.HTTP_200_OK)
async def readiness_check() -> dict[str, Any]:
    """
    Kubernetes readiness probe
    Returns 200 if application is ready to serve traffic
    Checks: Database connections, critical services, connection pools

    Usage: k8s readinessProbe
    Failure action: Remove from load balancer
    """
    payload = await build_ready_payload()
    if not payload.get("system_ready"):
        return JSONResponse(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, content=payload)
    return payload


@health_router.get("/features", status_code=status.HTTP_200_OK)
async def feature_flags() -> dict[str, Any]:
    """
    Feature flag and dependency availability snapshot.
    Returns explicit enabled/disabled/degraded states with reasons.
    """
    from backend.core.globals import auto_sync_manager, sql_sync_service
    from backend.api import sync_management_api
    from backend.services import search_service

    ready_payload = await build_ready_payload()

    redis_status, redis_details = await _get_redis_readiness()

    def normalize_status(value: str) -> str:
        if value in {"OK", "CONNECTED", "ACTIVE"}:
            return "enabled"
        if value == "DEGRADED":
            return "degraded"
        return "disabled"

    features: dict[str, Any] = {
        "redis": {"status": normalize_status(redis_status), **redis_details},
        "cache": ready_payload.get("features", {}).get("cache", {}),
        "sql_server": ready_payload.get("features", {}).get("sql", {}),
        "auto_sync": ready_payload.get("features", {}).get("autosync", {}),
    }

    if sql_sync_service:
        try:
            stats = sql_sync_service.get_stats()
            status = "enabled" if stats.get("enabled") else "disabled"
            if stats.get("enabled") and not stats.get("running"):
                status = "degraded"
            features["erp_sync"] = {"status": status, "details": stats}
        except Exception as exc:
            features["erp_sync"] = {"status": "degraded", "reason": str(exc)}
    else:
        features["erp_sync"] = {
            "status": "disabled",
            "reason": "ERP sync service not initialized",
        }

    try:
        change_detection = getattr(sync_management_api, "_change_detection_service", None)
        if change_detection:
            features["change_detection"] = {
                "status": "enabled",
                "details": change_detection.get_stats(),
            }
        else:
            features["change_detection"] = {
                "status": "disabled",
                "reason": "Change detection service not initialized",
            }
    except Exception as exc:
        features["change_detection"] = {
            "status": "degraded",
            "reason": str(exc),
        }

    try:
        search_instance = getattr(search_service, "_search_service", None)
        if search_instance:
            features["search"] = {"status": "enabled"}
        else:
            features["search"] = {
                "status": "disabled",
                "reason": "Search service not initialized",
            }
    except Exception as exc:
        features["search"] = {"status": "degraded", "reason": str(exc)}

    # Visual search (VLM) feature state
    vlm_enabled = (
        str(getattr(settings, "VLM_ENABLED", "")).lower() == "true"
        or str(os.getenv("VLM_ENABLED", "")).lower() == "true"
        or bool(getattr(settings, "VLM_ENDPOINT", None) or os.getenv("VLM_ENDPOINT"))
    )
    features["vlm"] = (
        {"status": "enabled"}
        if vlm_enabled
        else {"status": "disabled", "reason": "VLM not configured"}
    )

    if auto_sync_manager is None and _is_sql_configured():
        features["auto_sync"]["reason"] = (
            features["auto_sync"].get("reason") or "Auto-sync not initialized"
        )

    return {
        "timestamp": datetime.now(timezone.utc).replace(tzinfo=None).isoformat(),
        "features": features,
    }


@health_router.get("/startup", status_code=status.HTTP_200_OK)
async def startup_check() -> dict[str, Any]:
    """
    Kubernetes startup probe
    Returns 200 when application has finished starting up
    Used for slow-starting applications

    Usage: k8s startupProbe
    Failure action: Restart container after failureThreshold
    """
    startup_checks = await _build_startup_checks()

    # MongoDB is required, SQL Server is optional
    startup_complete = startup_checks["mongodb"] and startup_checks["migrations"]

    if not startup_complete:
        return {
            "started": False,
            "checks": startup_checks,
            "message": "Startup in progress",
        }

    return {"started": True, "checks": startup_checks, "message": "Startup complete"}


@health_router.get("/detailed", status_code=status.HTTP_200_OK)
async def detailed_health_check() -> dict[str, Any]:
    """
    Detailed health check with metrics
    Includes version, uptime, database status, and performance metrics

    Usage: Monitoring dashboards, troubleshooting
    """
    from backend.config import settings
    from backend.core.globals import database_health_service

    resources = _gather_system_resources()
    mongo_pool_info = _build_mongo_pool_info()

    if database_health_service:
        db_health = await database_health_service.get_detailed_health()
    else:
        db_health = {"status": "unknown", "error": "Health service not initialized"}

    ready_payload = await build_ready_payload()

    return {
        **ready_payload,
        "details": {
            **db_health,
            "service": "stock-verify-api",
            "version": getattr(settings, "APP_VERSION", "1.0.0"),
            "resources": resources,
            "connection_pools": {"mongodb": mongo_pool_info},
        },
    }


def _parse_version(version_str: str) -> tuple[int, int, int]:
    """
    Parse a version string into a tuple of (major, minor, patch).
    Handles versions like '1.0.0', '1.2.3-beta', '2.0', '1' and tolerates common variants.
    """
    if not version_str:
        return (0, 0, 0)

    # Remove any suffix like -beta, -rc, +build, etc., and strip whitespace
    version_clean = re.split(r"[-+]", version_str)[0].strip()

    # Use a regex to reliably capture up to three numeric components
    m = re.match(r"^(\d+)(?:\.(\d+))?(?:\.(\d+))?", version_clean)
    if not m:
        return (0, 0, 0)

    major = int(m.group(1))
    minor = int(m.group(2)) if m.group(2) is not None else 0
    patch = int(m.group(3)) if m.group(3) is not None else 0
    return (major, minor, patch)


def _compare_versions(
    client_version: str, min_version: str, current_version: str
) -> dict[str, Any]:
    """
    Compare client version against minimum and current versions.
    Returns compatibility status and update information.
    """
    client = _parse_version(client_version)
    minimum = _parse_version(min_version)
    current = _parse_version(current_version)

    # Check if client meets minimum requirement
    is_compatible = client >= minimum

    # Check if client is outdated (not the latest)
    is_latest = client >= current

    # Determine update type if update is available
    update_type: Optional[str] = None
    if not is_latest:
        if current[0] > client[0]:
            update_type = "major"
        elif current[1] > client[1]:
            update_type = "minor"
        elif current[2] > client[2]:
            update_type = "patch"

    return {
        "is_compatible": is_compatible,
        "is_latest": is_latest,
        "update_available": not is_latest,
        "update_type": update_type,
        "client_version": client_version,
        "minimum_version": min_version,
        "current_version": current_version,
        "force_update": not is_compatible,
    }


@info_router.get("/version/check", status_code=status.HTTP_200_OK)
async def check_version(
    client_version: str = Query(
        ...,
        description="Client/app version to check compatibility (e.g., '1.0.0')",
        pattern=r"^\d+(\.\d+)*(-[\w.]+)?$",
    ),
) -> dict[str, Any]:
    """
    Check client version compatibility and get update information.

    Returns:
    - is_compatible: Whether the client meets minimum version requirements
    - is_latest: Whether the client has the latest version
    - update_available: Whether an update is available
    - update_type: Type of update available (major, minor, patch)
    - force_update: Whether the client must update to continue using the app

    Usage: App startup version check, update prompts
    """
    try:
        from backend.config import settings

        current_version = getattr(settings, "APP_VERSION", "1.0.0")
        min_version = getattr(settings, "MIN_CLIENT_VERSION", "1.0.0")

        result = _compare_versions(client_version, min_version, current_version)

        # Add timestamp and extra info
        result["timestamp"] = datetime.now(timezone.utc).replace(tzinfo=None).isoformat()
        result["app_name"] = getattr(settings, "APP_NAME", "Stock Count")

        # Add release notes URL or changelog info if available
        result["release_notes_url"] = None
        result["changelog"] = None

        return result
    except Exception as e:
        logger.error(f"Error checking version: {e}")
        # Return a safe default that doesn't force updates on error
        return {
            "is_compatible": True,
            "is_latest": True,
            "update_available": False,
            "update_type": None,
            "client_version": client_version,
            "minimum_version": "1.0.0",
            "current_version": "1.0.0",
            "force_update": False,
            "timestamp": datetime.now(timezone.utc).replace(tzinfo=None).isoformat(),
            "error": str(e),
        }
