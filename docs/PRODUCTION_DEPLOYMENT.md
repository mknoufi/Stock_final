# Production Deployment Guide

> Stock Verification System

---

## Prerequisites

- Docker & Docker Compose installed
- MongoDB 6.0+
- Node.js 18+ (for frontend builds)
- Python 3.11+ (for local backend development)

---

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Frontend   │────▶│   Backend    │────▶│   MongoDB   │
│ React Native │     │ FastAPI/     │     │   6.0       │
│   (Expo)     │     │ Gunicorn     │     │             │
└─────────────┘     └──────┬───────┘     └─────────────┘
                           │
                    ┌──────▼───────┐
                    │  SQL Server  │
                    │  (ERP, R/O)  │
                    └──────────────┘
```

---

## Environment Setup

### Backend (`backend/.env`)

Copy the example and fill in production values:

```bash
cp backend/.env.example backend/.env
```

**Critical variables** to update for production:

| Variable | Description | Example |
|----------|-------------|---------|
| `ENVIRONMENT` | Must be `production` | `production` |
| `JWT_SECRET` | Min 32 chars, cryptographically random | `openssl rand -hex 32` |
| `JWT_REFRESH_SECRET` | Min 32 chars, different from JWT_SECRET | `openssl rand -hex 32` |
| `MONGO_URL` | MongoDB connection string | `mongodb://mongo:27017` |
| `DEBUG` | Must be `false` | `false` |
| `HOT_RELOAD` | Must be `false` | `false` |
| `DEBUG_ENDPOINTS` | Must be `false` | `false` |
| `WORKERS` | Gunicorn workers (2× CPU cores + 1) | `4` |

### Frontend (`frontend/.env`)

```bash
EXPO_PUBLIC_BACKEND_URL=https://your-production-domain.com
EXPO_PUBLIC_API_TIMEOUT=30000
EXPO_PUBLIC_DEBUG_MODE=false
```

---

## Docker Deployment

### Production

```bash
# Validate first
bash scripts/validate_deploy.sh

# Build and start
docker compose -f docker-compose.production.yml up -d --build

# Check health
curl http://localhost:8001/health
```

### Development

```bash
docker compose up -d
```

---

## Startup Order

1. **MongoDB** starts first (health check: `mongosh --eval "db.adminCommand('ping')"`)
2. **Backend** waits for MongoDB health, then starts with gunicorn
3. **Frontend** built separately via `eas build` or `expo start`

---

## Health Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /health` | Basic liveness check |
| `GET /api/system/health` | Detailed system health with DB status |

---

## Rollback Procedure

1. **Stop current deployment**:

   ```bash
   docker compose -f docker-compose.production.yml down
   ```

2. **Restore previous image**:

   ```bash
   docker compose -f docker-compose.production.yml up -d --no-build
   ```

3. **Database rollback** (if schema changed):
   - Restore from MongoDB backup:

     ```bash
     mongorestore --uri="mongodb://localhost:27017" --db=stock_verification /path/to/backup/
     ```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check `docker logs <container>` for `RuntimeError` from config guards |
| MongoDB connection failed | Verify `MONGO_URL` and MongoDB is running: `mongosh --eval "db.stats()"` |
| JWT errors | Regenerate secrets: `openssl rand -hex 32` |
| CORS errors | Update `CORS_ALLOW_ORIGINS` in backend `.env` |
| Frontend can't reach backend | Verify `EXPO_PUBLIC_BACKEND_URL` points to production URL |

---

## Security Checklist

- [ ] JWT secrets are cryptographically random (min 32 chars)
- [ ] `ENVIRONMENT=production`
- [ ] `DEBUG=false`
- [ ] `HOT_RELOAD=false`
- [ ] `DEBUG_ENDPOINTS=false`
- [ ] MongoDB has authentication enabled
- [ ] SQL Server uses read-only credentials
- [ ] No `.env` files committed to git
- [ ] HTTPS enabled (via reverse proxy)
