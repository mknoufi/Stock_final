# Refactor Baseline - Backend App Composition

This folder contains baseline artifacts used to ensure refactors preserve runtime behavior.

## Artifacts

- `backend-app-snapshot.json`
  - Normalized route inventory (path + methods + name)
  - Middleware order (`app.user_middleware`)
  - Summary counts

## Current Baseline

- Total routes: `337`
- Middleware order:
  - `GZipMiddleware`
  - `SecurityHeadersMiddleware`
  - `CORSMiddleware`

## How To Regenerate

Run from repository root:

```bash
JWT_SECRET=test-jwt-secret-key-for-testing-only-123 \
JWT_REFRESH_SECRET=test-refresh-secret-key-for-testing-only-123 \
DEBUG=false \
backend/venv/bin/python - <<'PY'
import json
from collections import Counter
from pathlib import Path
from backend.server import app

routes = []
for r in app.routes:
    path = getattr(r, "path", None)
    methods = sorted(m for m in (getattr(r, "methods", set()) or set()) if m not in {"HEAD", "OPTIONS"})
    name = getattr(r, "name", None)
    if path:
        routes.append({"path": path, "methods": methods, "name": name})

sig_counter = Counter((x["path"], tuple(x["methods"])) for x in routes)
duplicate_signatures = [
    {"path": p, "methods": list(m), "count": c}
    for (p, m), c in sorted(sig_counter.items())
    if c > 1
]

snapshot = {
    "total_routes": len(routes),
    "middleware_order": [m.cls.__name__ for m in app.user_middleware],
    "unique_path_method_signatures": len(sig_counter),
    "duplicate_signature_count": len(duplicate_signatures),
    "duplicate_signatures": duplicate_signatures,
    "routes": sorted(routes, key=lambda x: (x["path"], x["methods"])),
}

out = Path("docs/refactor-baseline/backend-app-snapshot.json")
out.write_text(json.dumps(snapshot, indent=2), encoding="utf-8")
print(f"Wrote {out} with {snapshot['total_routes']} routes")
PY
```

## Verification

Run:

```bash
cd backend && ../backend/venv/bin/pytest tests/test_app_composition_snapshot.py -q
```
