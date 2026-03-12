# Testing Environment Contract

> This document defines all required environment variables for running the Stock Verify 2026 test suite.
> Any test run without these variables **will fail** — this is by design to enforce secure defaults.

## Required Variables

| Variable | Test Value | Purpose | Required By |
|---|---|---|---|
| `PIN_SALT` | `test-pin-salt-not-for-production` | Salt for PIN lookup hashes (prevents rainbow table attacks) | `utils/crypto_utils.py` |
| `JWT_SECRET` | `test-jwt-secret-key-for-testing-only` | JWT token signing key | `auth/jwt_provider.py` |
| `JWT_REFRESH_SECRET` | `test-jwt-refresh-secret-key-for-testing-only` | JWT refresh token signing key | `auth/jwt_provider.py` |
| `JWT_ALGORITHM` | `HS256` | JWT algorithm | `auth/jwt_provider.py` |
| `MONGO_URL` | `mongodb://localhost:27017/stock_count_test` | MongoDB connection string | `conftest.py` |
| `DB_NAME` | `stock_count_test` | MongoDB database name | `conftest.py` |
| `REDIS_URL` | `redis://localhost:6379/15` | Redis connection (uses DB 15 for test isolation) | `conftest.py` |
| `APP_ENV` | `test` | Application environment flag | General |
| `TESTING` | `true` | Testing mode flag | General |
| `RATE_LIMIT_PER_MINUTE` | `1000` | Higher rate limits to prevent test interference | Rate limiter |
| `LOG_LEVEL` | `DEBUG` | Verbose logging during tests | Logger |
| `AUTH_SINGLE_SESSION` | `false` | Disable session enforcement in tests | Auth middleware |

## Where Variables Are Set

All test environment variables are bootstrapped in:

```
backend/tests/conftest.py  (lines 17-34)
```

This runs **before any application imports**, ensuring `crypto_utils.py` and other security modules find the required values.

## CI Configuration

CI pipelines (`/.github/workflows/main.yml`) also set these variables in the `env:` block of the test job. See the `backend-test` job.

## ⚠️ Security Notes

- These values are **test-only** — never use them in production
- Production `PIN_SALT` must be a cryptographically random string (min 32 chars)
- Production `JWT_SECRET` must be rotated regularly
- If `PIN_SALT` is missing in production, `crypto_utils.py` will raise `ValueError` — this is intentional fail-closed behavior

## Optional Variables (External Dependencies)

| Variable | Purpose | Impact if Missing |
|---|---|---|
| `SQL_SERVER_HOST` | ERP SQL Server connection | SQL-related tests use mocks |
| `SQL_SERVER_DATABASE` | ERP database name | SQL-related tests use mocks |

## Running Tests Locally

```bash
# Backend
cd backend
source venv/bin/activate
python -m pytest tests/ -v

# Frontend
cd frontend
npx jest --verbose
```

No additional `.env` file is needed — `conftest.py` handles all test environment configuration.
