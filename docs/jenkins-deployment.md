# Jenkins Deployment Guide

This repository can be orchestrated by Jenkins without using GitHub Actions. The recommended Jenkins path mirrors the existing canonical runtime:

- verify with `./scripts/agent_ci.sh ci`
- build backend and nginx Docker images
- push them to GHCR
- deploy to the remote Docker host with `./scripts/deploy_remote_compose.sh`
- verify the live environment with `./scripts/post_deploy_smoke.sh`

## Create a New Jenkins Instance (Local)

Use the bundled local Jenkins bootstrap:

1. `make jenkins-up`
2. Open `http://localhost:8088`
3. Unlock Jenkins using:
   - `make jenkins-password`
4. Create a Pipeline job that points to this repository and uses the root `Jenkinsfile`

Stop local Jenkins:

- `make jenkins-down`

View logs:

- `make jenkins-logs`

## Jenkins Agent Requirements

Use a Linux Jenkins agent with:

- Docker CLI and daemon access
- Bash
- Git
- SSH client

The agent should satisfy the `linux && docker` label used by [Jenkinsfile](/D:/stk/Stock_final/Jenkinsfile).

## Required Jenkins Plugins

- Pipeline
- Git
- Credentials Binding
- SSH Agent
- ANSI Color

## Required Jenkins Credentials

Create these credentials in Jenkins:

- `ghcr-stock-verify`
  - Type: `Username with password`
  - Purpose: GHCR username/token for image push and remote host registry login
- `stock-verify-staging-ssh`
  - Type: `SSH Username with private key`
  - Purpose: SSH access to the staging Docker host
- `stock-verify-production-ssh`
  - Type: `SSH Username with private key`
  - Purpose: SSH access to the production Docker host
- `stock-verify-staging-env`
  - Type: `Secret text`
  - Purpose: full rendered `.env.prod` content for staging
- `stock-verify-production-env`
  - Type: `Secret text`
  - Purpose: full rendered `.env.prod` content for production
- `stock-verify-staging-smoke`
  - Type: `Username with password`
  - Purpose: optional authenticated smoke credentials for staging
- `stock-verify-production-smoke`
  - Type: `Username with password`
  - Purpose: optional authenticated smoke credentials for production

If you do not want authenticated smoke checks, create low-privilege smoke users instead of reusing operator accounts.

## Required Jenkins Environment Variables

Set these as job-level or folder-level environment variables:

- `DEPLOY_HOST_STAGING`
- `DEPLOY_USER_STAGING`
- `DEPLOY_PORT_STAGING`
- `DEPLOY_PATH_STAGING`
- `DEPLOY_HEALTHCHECK_URL_STAGING`
- `DEPLOY_APP_BASE_URL_STAGING`
- `DEPLOY_FRONTEND_URL_STAGING`
- `DEPLOY_KNOWN_HOSTS_STAGING`
- `DEPLOY_HOST_PRODUCTION`
- `DEPLOY_USER_PRODUCTION`
- `DEPLOY_PORT_PRODUCTION`
- `DEPLOY_PATH_PRODUCTION`
- `DEPLOY_HEALTHCHECK_URL_PRODUCTION`
- `DEPLOY_APP_BASE_URL_PRODUCTION`
- `DEPLOY_FRONTEND_URL_PRODUCTION`
- `DEPLOY_KNOWN_HOSTS_PRODUCTION`

`DEPLOY_PORT_*`, `DEPLOY_APP_BASE_URL_*`, `DEPLOY_FRONTEND_URL_*`, and `DEPLOY_KNOWN_HOSTS_*` may be left empty when appropriate. The deploy script falls back to port `22`, and it can use `ssh-keyscan` when known hosts are not supplied.

## Staging `.env.prod` Secret Text Template

The `stock-verify-staging-env` secret should contain the full rendered file body, for example:

```dotenv
DOMAIN=staging.example.com
CERTBOT_EMAIL=ops@example.com
DB_NAME=stock_verification
BACKEND_WORKERS=4
BACKEND_IMAGE=ghcr.io/mknoufi/stock_verify_ui-backend:placeholder
NGINX_IMAGE=ghcr.io/mknoufi/stock_verify_ui-nginx:placeholder
JWT_SECRET=replace-with-long-random-jwt-secret
JWT_REFRESH_SECRET=replace-with-long-random-refresh-secret
LOG_LEVEL=INFO
FORCE_HTTPS=true
ALLOWED_HOSTS=staging.example.com
CORS_ALLOW_ORIGINS=https://staging.example.com
AUTH_COOKIE_DOMAIN=staging.example.com
AUTH_COOKIE_SAMESITE=lax
AUTO_SEED_DEFAULT_USERS=false
AUTO_SEED_MOCK_ERP_DATA=false
MONGO_ROOT_USER=stockverify
MONGO_ROOT_PASSWORD=replace-with-long-random-mongo-password
REDIS_PASSWORD=replace-with-long-random-redis-password
EXPO_PUBLIC_API_TIMEOUT=30000
```

Notes:

- `BACKEND_IMAGE` and `NGINX_IMAGE` are overwritten by deploy runtime values.
- Keep `AUTO_SEED_DEFAULT_USERS=false` and `AUTO_SEED_MOCK_ERP_DATA=false` for real environments.
- A copy-paste version also lives in [docs/jenkins-staging.env.prod.example](/D:/stk/Stock_final/docs/jenkins-staging.env.prod.example).

## Pipeline Parameters

The Jenkins pipeline exposes:

- `DEPLOY_TARGET`
  - `none`: verify and optionally build/push only
  - `staging`: deploy to staging after build
  - `production`: deploy to production after build
- `BUILD_AND_PUSH_IMAGES`
  - `true`: build fresh images and push them
  - `false`: skip builds and deploy the tag given in `IMAGE_TAG`
- `PUSH_LATEST_TAG`
  - whether to also publish `:latest`
- `RUN_IMAGE_SCAN`
  - run Trivy CRITICAL scan on built images
- `RUN_SMOKE`
  - run post-deploy smoke after deployment
- `IMAGE_REPO`
  - defaults to `ghcr.io/mknoufi/stock_verify_ui`
- `IMAGE_TAG`
  - blank uses the current commit SHA prefix

## Rollback

To roll back, run the same Jenkins job with:

- `DEPLOY_TARGET=<staging|production>`
- `BUILD_AND_PUSH_IMAGES=false`
- `IMAGE_TAG=<previous-good-tag>`

The deploy step will render:

- `BACKEND_IMAGE=${IMAGE_REPO}-backend:${IMAGE_TAG}`
- `NGINX_IMAGE=${IMAGE_REPO}-nginx:${IMAGE_TAG}`

If you need a manual rollback outside Jenkins, use [scripts/rollback_remote_compose.sh](/D:/stk/Stock_final/scripts/rollback_remote_compose.sh).
