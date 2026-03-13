"""Cookie helpers for browser-based authentication flows."""

from __future__ import annotations

from typing import Optional

from fastapi import Request, Response

from backend.config import settings


def _cookie_domain() -> Optional[str]:
    domain = getattr(settings, "AUTH_COOKIE_DOMAIN", None)
    return domain or None


def _cookie_secure() -> bool:
    env = getattr(settings, "ENVIRONMENT", "development").lower()
    return bool(getattr(settings, "FORCE_HTTPS", False) or env in {"production", "staging"})


def _cookie_samesite() -> str:
    configured = str(getattr(settings, "AUTH_COOKIE_SAMESITE", "lax")).lower()
    if configured == "none" and not _cookie_secure():
        # Browsers reject SameSite=None cookies without Secure.
        return "lax"
    return configured


def _cookie_kwargs(max_age_seconds: int) -> dict[str, object]:
    cookie_kwargs: dict[str, object] = {
        "httponly": True,
        "max_age": max_age_seconds,
        "expires": max_age_seconds,
        "path": "/",
        "secure": _cookie_secure(),
        "samesite": _cookie_samesite(),
    }
    domain = _cookie_domain()
    if domain:
        cookie_kwargs["domain"] = domain
    return cookie_kwargs


def set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    access_max_age = int(getattr(settings, "ACCESS_TOKEN_EXPIRE_MINUTES", 15) * 60)
    refresh_max_age = int(getattr(settings, "REFRESH_TOKEN_EXPIRE_DAYS", 30) * 24 * 60 * 60)
    response.set_cookie(
        getattr(settings, "AUTH_ACCESS_COOKIE_NAME", "sv_access_token"),
        access_token,
        **_cookie_kwargs(access_max_age),
    )
    response.set_cookie(
        getattr(settings, "AUTH_REFRESH_COOKIE_NAME", "sv_refresh_token"),
        refresh_token,
        **_cookie_kwargs(refresh_max_age),
    )


def clear_auth_cookies(response: Response) -> None:
    domain = _cookie_domain()
    delete_kwargs: dict[str, object] = {"path": "/"}
    if domain:
        delete_kwargs["domain"] = domain
    response.delete_cookie(
        getattr(settings, "AUTH_ACCESS_COOKIE_NAME", "sv_access_token"),
        **delete_kwargs,
    )
    response.delete_cookie(
        getattr(settings, "AUTH_REFRESH_COOKIE_NAME", "sv_refresh_token"),
        **delete_kwargs,
    )


def _normalize_cookie_token(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    normalized = value.strip()
    if len(normalized) >= 2 and normalized[0] == normalized[-1] == '"':
        normalized = normalized[1:-1]
    return normalized or None


def get_access_token_cookie(request: Request) -> Optional[str]:
    return _normalize_cookie_token(
        request.cookies.get(getattr(settings, "AUTH_ACCESS_COOKIE_NAME", "sv_access_token"))
    )


def get_refresh_token_cookie(request: Request) -> Optional[str]:
    return _normalize_cookie_token(
        request.cookies.get(getattr(settings, "AUTH_REFRESH_COOKIE_NAME", "sv_refresh_token"))
    )
