# Stock Verify Application (v2.1)

This repository is available as a GitHub template. Use the template to create a new instance.
Use this README for the repo workflow, `backend/README.md` for backend governance constraints,
and `docs/TESTING_GUIDE.md` for verification commands.

## Start Here

Tracked guides:
- `backend/README.md`
- `docs/TESTING_GUIDE.md`
- `docs/user-wise-running-workflow-diagram.md`

## Documentation

This repository currently keeps a smaller tracked docs set. Keep this section aligned with the
files that actually exist in git so a fresh clone does not point at missing documentation.

## Quick Start

New deployments:
1) Copy the backend and frontend example env files.
2) Run `make install`.
3) Start services with `make start`.

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
- Backend: `./scripts/python.sh -m pytest backend/tests`
- E2E: `cd frontend && npx playwright test` or `npm run e2e:recount-smoke`

Details: `docs/TESTING_GUIDE.md` and `frontend/e2e/README.md`

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
./scripts/python.sh scripts/cleanup_old_docs.py
```

Kill frontend (macOS/Linux):
```bash
lsof -ti :8081,19000,19001,19002,19006 | xargs kill -9
```
