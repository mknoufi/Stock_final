# Stock Verify Application (v2.1)

This repository is available as a GitHub template. Use the template to create a new instance.
See `docs/STARTUP_GUIDE.md` for setup instructions.

## Start Here

Guides:
- `docs/START_HERE.md` (recommended first read)
- `docs/QUICK_START.md`
- `docs/VIBE_CODING_WORKFLOW.md`
- `docs/FEATURE_ROADMAP.md`
- `docs/STUDY_GUIDE_AGENTS_AND_VSCODE.md`

## Documentation

Core:
- `docs/codebase_memory_v2.1.md`
- `docs/STOCK_VERIFY_2.1_cursor_rules.md`
- `docs/verified_coding_policy.md`
- `docs/CHANGELOG.md`

Production:
- `docs/PRODUCTION_DEPLOYMENT_GUIDE.md`
- `docs/PRODUCTION_READINESS_CHECKLIST.md`
- `docs/FEATURE_ROADMAP.md`

## Quick Start

New deployments:
1) Read `docs/STARTUP_GUIDE.md`
2) Run `./init-new-instance.sh`

Development:

One-click startup:
```bash
make start
```

Individual services:
- Backend: `make backend` (port 8001)
- Frontend: `make frontend` (port 8081, LAN mode)
- Fix Expo: `make fix-expo` (tunnel mode)
- Stop all: `make stop`

Network configuration (dynamic IP):
1) Backend writes `backend_port.json` with its LAN IP on startup.
2) Frontend reads this file to configure the API client.
3) Docker/CI: set `EXPO_PUBLIC_BACKEND_URL` to override.

## Local LAN Deployment

1) Backend env:
   - Copy `backend/.env.example` to `backend/.env`.
   - Set `JWT_SECRET` and `JWT_REFRESH_SECRET` (32+ chars).
   - Set `MONGO_URL` and SQL Server settings as needed.
2) Frontend env:
   - Copy `frontend/.env.example` to `frontend/.env`.
   - Optionally set `EXPO_PUBLIC_BACKEND_URL` to your LAN IP.
3) Start services:
   - `make start` or `.\scripts\start_all.ps1` on Windows.
4) Verify:
   - `http://<LAN_IP>:8001/api/health`
   - Expo runs on `http://<LAN_IP>:8081`

## Testing

- Frontend: `cd frontend && npm run ci`
- Backend: `cd backend && python -m pytest`
- E2E: see `frontend/e2e/README.md` (Maestro)

Details: `docs/TESTING_GUIDE.md`

### Production Readiness Verification

Run these gates before merge/release:

```bash
python -m pytest backend/tests/test_basic.py -q
python -m pytest backend/tests/test_auth.py -q
cd frontend && npx tsc --noEmit
powershell -ExecutionPolicy Bypass -File scripts/repo_hygiene_check.ps1
```

## Production Deployment (Docker Compose)

1) Create production env:
   - `copy .env.production.example .env.prod` (Windows) or `cp .env.production.example .env.prod` (Linux/macOS).
2) Update secrets and domain values in `.env.prod`.
3) Provision TLS certificates:
   - `./scripts/init_letsencrypt.sh`
4) Start production stack:
   - `docker compose --env-file .env.prod -f docker-compose.prod.yml up -d`

Monitoring:
- Grafana: `https://<domain>/grafana`
- Prometheus: internal on `http://prometheus:9090`

Kubernetes manifests live in `k8s/` (see `k8s/secrets.example.yaml`).

## Configuration

- Backend port: 8001 (default)
- SQL Server: configured in `backend/config.py` (default `192.168.1.109`)
- Frontend: Expo SDK 54

## Maintenance

Archive old documentation:
```bash
python scripts/cleanup_old_docs.py
```

Kill frontend (macOS/Linux):
```bash
lsof -ti :8081,19000,19001,19002,19006 | xargs kill -9
```
