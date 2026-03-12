"""App composition snapshot tests for refactor safety.

These tests guard route inventory and middleware order so refactors can
mechanically move code without accidentally changing externally visible behavior.
"""

from __future__ import annotations

import json
from pathlib import Path

from fastapi import FastAPI


SNAPSHOT_PATH = (
    Path(__file__).resolve().parent.parent.parent
    / "docs"
    / "refactor-baseline"
    / "backend-app-snapshot.json"
)


def _load_snapshot() -> dict:
    if not SNAPSHOT_PATH.exists():
        raise AssertionError(f"Missing snapshot file: {SNAPSHOT_PATH}")
    return json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))


def _collect_runtime_snapshot(app: FastAPI) -> dict:
    routes: list[dict] = []
    for route in app.routes:
        path = getattr(route, "path", None)
        methods = sorted(
            m for m in (getattr(route, "methods", set()) or set()) if m not in {"HEAD", "OPTIONS"}
        )
        name = getattr(route, "name", None)
        if path:
            routes.append({"path": path, "methods": methods, "name": name})

    normalized_routes = sorted(routes, key=lambda item: (item["path"], item["methods"]))

    return {
        "total_routes": len(normalized_routes),
        "middleware_order": [m.cls.__name__ for m in app.user_middleware],
        "routes": normalized_routes,
    }


def test_app_middleware_order_matches_baseline():
    from backend.server import app

    expected = _load_snapshot()
    actual = _collect_runtime_snapshot(app)
    assert actual["middleware_order"] == expected["middleware_order"], (
        "Middleware order changed. Update snapshot only when intentionally "
        "changing app composition."
    )


def test_app_route_inventory_matches_baseline():
    from backend.server import app

    expected = _load_snapshot()
    actual = _collect_runtime_snapshot(app)

    assert actual["total_routes"] == expected["total_routes"], (
        "Route count drift detected. If intentional, regenerate "
        "docs/refactor-baseline/backend-app-snapshot.json."
    )
    assert actual["routes"] == expected["routes"], (
        "Route inventory drift detected. If intentional, regenerate "
        "docs/refactor-baseline/backend-app-snapshot.json."
    )


def test_critical_routes_are_present():
    from backend.server import app

    actual = _collect_runtime_snapshot(app)
    signatures = {(r["path"], tuple(r["methods"])) for r in actual["routes"]}

    critical_signatures = {
        ("/health", ("GET",)),
        ("/api/health", ("GET",)),
        ("/api/auth/login", ("POST",)),
        ("/api/sessions", ("GET",)),
        ("/api/sessions", ("POST",)),
        ("/api/v2/erp/items/filtered", ("GET",)),
        ("/api/sync/batch", ("POST",)),
        ("/api/v2/verification/items/{item_code}/verify-qty", ("POST",)),
    }
    critical_paths = {"/ws/updates"}

    missing = sorted(critical_signatures - signatures)
    if critical_paths:
        paths = {r["path"] for r in actual["routes"]}
        missing_paths = sorted(critical_paths - paths)
    else:
        missing_paths = []

    assert not missing and not missing_paths, (
        f"Critical routes missing: signatures={missing}, paths={missing_paths}"
    )
