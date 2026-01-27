"""
Backend Configuration API Endpoints
Provides backend connection information for frontend discovery
"""

import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from backend.utils.port_detector import PortDetector, save_backend_info

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/config", tags=["configuration"])


class BackendInfoResponse(BaseModel):
    """Backend information response model"""

    port: int
    ip: str
    url: str
    pid: int
    timestamp: str
    environment: str = "development"
    version: str = "1.0.0"
    is_healthy: bool = True


class FrontendConfigResponse(BaseModel):
    """Frontend configuration response model"""

    EXPO_PUBLIC_BACKEND_URL: str
    EXPO_PUBLIC_API_TIMEOUT: int = 30000
    EXPO_PUBLIC_FRONTEND_PORT: int = 8081
    FRONTEND_URL: str = "http://localhost:8081"
    environment: str = "development"


@router.get("/backend-info", response_model=BackendInfoResponse)
async def get_backend_info() -> BackendInfoResponse:
    """
    Get backend connection information for frontend discovery
    """
    try:
        # Get current port information
        port_info = await _get_current_port_info()

        # Get environment
        environment = "development"
        if PortDetector.get_mongo_status()["url"].startswith("mongodb://mongo:"):
            environment = "production"  # Running in Docker

        return BackendInfoResponse(
            port=port_info["port"],
            ip=port_info["ip"],
            url=port_info["url"],
            pid=port_info["pid"],
            timestamp=port_info["timestamp"],
            environment=environment,
            version="1.0.0",
            is_healthy=True,
        )
    except Exception as e:
        logger.error(f"Error getting backend info: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get backend information",
        ) from e


@router.get("/frontend-config", response_model=FrontendConfigResponse)
async def get_frontend_config() -> FrontendConfigResponse:
    """
    Get frontend configuration with dynamic backend URL
    """
    try:
        # Get backend connection info
        backend_info = await _get_current_port_info()

        # Build frontend config
        config = FrontendConfigResponse(
            EXPO_PUBLIC_BACKEND_URL=backend_info["url"],
            EXPO_PUBLIC_API_TIMEOUT=30000,
            EXPO_PUBLIC_FRONTEND_PORT=8081,
            FRONTEND_URL=f"http://{backend_info['ip']}:8081",
            environment="development",
        )

        return config
    except Exception as e:
        logger.error(f"Error generating frontend config: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate frontend configuration",
        ) from e


@router.post("/detect-network", response_model=Dict[str, Any])
async def detect_network_changes() -> Dict[str, Any]:
    """
    Detect network changes and update port configuration
    """
    try:
        # Force port re-detection
        logger.info("Network change detection requested")

        # Detect current IP and available port
        local_ip = PortDetector.get_local_ip()
        backend_port = PortDetector.get_backend_port()

        # Save updated configuration
        from backend.utils.port_detector import save_backend_info

        save_backend_info(backend_port, local_ip)

        return {
            "status": "success",
            "message": "Network detection completed",
            "local_ip": local_ip,
            "backend_port": backend_port,
            "backend_url": f"http://{local_ip}:{backend_port}",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
    except Exception as e:
        logger.error(f"Error during network detection: {e}")
        return {
            "status": "error",
            "message": f"Network detection failed: {str(e)}",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }


async def _get_current_port_info() -> Dict[str, Any]:
    """Get current port information from various sources"""
    try:
        # Try to read from saved file first
        root_dir = Path(__file__).parent.parent
        port_file = root_dir / "backend_port.json"

        if port_file.exists():
            with open(port_file, "r") as f:
                import json

                port_info = json.load(f)

            logger.info("Retrieved port info from file", port_info)
            return port_info
        else:
            # Generate fresh port info
            logger.info("No saved port info, generating new")
            local_ip = PortDetector.get_local_ip()
            backend_port = PortDetector.get_backend_port()

            port_info = {
                "port": backend_port,
                "ip": local_ip,
                "url": f"http://{local_ip}:{backend_port}",
                "pid": Path(__file__).parent.parent.parent.stat().st_ino,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }

            # Save for future use
            save_backend_info(backend_port, local_ip)
            return port_info

    except Exception as e:
        logger.error(f"Error getting port info: {e}")
        # Return fallback info
        return {
            "port": 8001,
            "ip": "127.0.0.1",
            "url": "http://localhost:8001",
            "pid": 0,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }


@router.get("/health/extended", response_model=Dict[str, Any])
async def extended_health_check() -> Dict[str, Any]:
    """
    Extended health check with connection status
    """
    try:
        # Basic health
        basic_health = await _basic_health_check()

        # Database connections
        mongo_status = PortDetector.get_mongo_status()
        mongo_healthy = mongo_status["is_running"]

        # Network connectivity
        port_info = await _get_current_port_info()

        # System resources
        import psutil

        process = psutil.Process()

        return {
            "status": "healthy" if basic_health and mongo_healthy else "degraded",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "version": "1.0.0",
            "uptime_seconds": process.create_time() if hasattr(process, "create_time") else 0,
            "memory_mb": round(process.memory_info().rss / 1024 / 1024, 2),
            "cpu_percent": process.cpu_percent(),
            "database": {
                "mongodb": {
                    "status": "connected" if mongo_healthy else "disconnected",
                    "port": mongo_status["port"],
                    "url": mongo_status["url"],
                }
            },
            "network": {
                "backend_port": port_info["port"],
                "backend_url": port_info["url"],
                "local_ip": port_info["ip"],
                "is_healthy": basic_health,
            },
            "endpoints": {
                "backend_info": "/api/config/backend-info",
                "frontend_config": "/api/config/frontend-config",
                "network_detection": "/api/config/detect-network",
                "extended_health": "/api/health/extended",
            },
        }
    except Exception as e:
        logger.error(f"Extended health check failed: {e}")
        return {
            "status": "error",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "error": str(e),
        }


async def _basic_health_check() -> bool:
    """Perform basic health checks"""
    try:
        # Check database connectivity
        from backend.core.globals import database_health_service

        if database_health_service:
            mongo_result = await database_health_service.check_mongo_health()
            return mongo_result.get("status") == "healthy"
        else:
            # Fallback: try direct MongoDB connection
            mongo_status = PortDetector.get_mongo_status()
            return mongo_status["is_running"]

    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return False


@router.post("/reset-connection", response_model=Dict[str, Any])
async def reset_connection_state() -> Dict[str, Any]:
    """
    Reset connection state and force reconnection
    """
    try:
        logger.info("Connection reset requested")

        # Force port re-detection
        local_ip = PortDetector.get_local_ip()
        backend_port = PortDetector.get_backend_port()

        # Update configuration files
        save_backend_info(backend_port, local_ip)

        return {
            "status": "success",
            "message": "Connection state reset",
            "new_backend_url": f"http://{local_ip}:{backend_port}",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "action": "frontend_should_reconnect",
        }

    except Exception as e:
        logger.error(f"Connection reset failed: {e}")
        return {
            "status": "error",
            "message": f"Connection reset failed: {str(e)}",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
