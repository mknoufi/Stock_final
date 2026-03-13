"""Compatibility wrapper for legacy middleware setup imports."""

import logging

from fastapi import FastAPI

from backend.app.middleware import register_middleware
from backend.config import settings

logger = logging.getLogger(__name__)

try:
    from backend.middleware.security_headers import SecurityHeadersMiddleware
except ImportError:  # pragma: no cover - optional middleware
    SecurityHeadersMiddleware = None


def setup_middleware(app: FastAPI) -> None:
    """Delegate to the canonical middleware registration path."""
    register_middleware(
        app,
        settings=settings,
        logger=logger,
        security_headers_middleware=SecurityHeadersMiddleware,
    )
