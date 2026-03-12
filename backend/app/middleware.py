"""Middleware registration for FastAPI app composition."""

from __future__ import annotations

import os
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware
from starlette.middleware.cors import CORSMiddleware


def register_middleware(
    app: FastAPI,
    *,
    settings: Any,
    logger: Any,
    security_headers_middleware: Any = None,
) -> None:
    """Register app middleware while preserving current behavior/order."""
    env = getattr(settings, "ENVIRONMENT", "development").lower()

    if getattr(settings, "CORS_ALLOW_ORIGINS", None):
        allowed_origins = [
            o.strip() for o in (settings.CORS_ALLOW_ORIGINS or "").split(",") if o.strip()
        ]
    elif env == "development":
        allowed_origins = [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:8081",
            "http://127.0.0.1:8081",
            "exp://localhost:8081",
        ]
        if getattr(settings, "CORS_DEV_ORIGINS", None):
            dev_origins = [o.strip() for o in (settings.CORS_DEV_ORIGINS or "").split(",") if o.strip()]
            allowed_origins.extend(dev_origins)
            logger.info(f"Added {len(dev_origins)} additional CORS origins from CORS_DEV_ORIGINS")
    else:
        allowed_origins = []
        if not getattr(settings, "CORS_ALLOW_ORIGINS", None):
            logger.warning(
                "CORS_ALLOW_ORIGINS not configured for non-development environment; "
                "requests may be blocked"
            )

    cors_origin_regex = None
    if env == "development":
        cors_origin_regex = (
            r"(https?|exp)://(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|"
            r"10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(:\d+)?"
        )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_origin_regex=cors_origin_regex,
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

    if security_headers_middleware is not None:
        try:
            strict_csp = os.getenv("STRICT_CSP", "false").lower() == "true"
            force_https = os.getenv("FORCE_HTTPS", "false").lower() == "true"

            app.add_middleware(
                security_headers_middleware,  # type: ignore[arg-type]
                STRICT_CSP=strict_csp,
                force_https=force_https,
            )
            logger.info("✓ Security headers middleware enabled")
        except Exception as exc:
            logger.warning(f"Security headers middleware registration failed: {exc}")
    else:
        logger.warning("Security headers middleware not available")

    app.add_middleware(GZipMiddleware, minimum_size=1000)

