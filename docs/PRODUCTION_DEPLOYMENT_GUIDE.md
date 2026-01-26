# 🚀 Production Deployment Guide - Stock Verify v2.1

**Last Updated**: December 2025
**Version**: 2.1
**Status**: Production Ready

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Infrastructure Requirements](#infrastructure-requirements)
3. [Security Hardening](#security-hardening)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Deployment Options](#deployment-options)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Monitoring & Logging](#monitoring--logging)
9. [Backup & Disaster Recovery](#backup--disaster-recovery)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Pre-Deployment Checklist

### ✅ Code Quality & Testing
- [x] All 142 backend tests passing
- [x] Frontend builds successfully
- [x] CI/CD pipeline validates all commits
- [x] Code formatted with Black/Prettier
- [x] Type checking passes (MyPy/TypeScript)
- [x] Security scanning completed (Trivy)
- [ ] Load testing completed (recommended)
- [ ] Penetration testing performed (recommended)

### ✅ Documentation
- [x] API documentation up to date
- [x] Architecture documented
- [x] Deployment guide available (this document)
- [ ] Operations runbook created
- [ ] Incident response procedures documented

### ✅ Security Requirements
- [ ] SSL/TLS certificates obtained
- [ ] Secrets rotated and secured
- [ ] Firewall rules configured
- [ ] Security headers verified
- [ ] CORS origins whitelisted
- [ ] Rate limiting tested

### ✅ Infrastructure
- [ ] Production servers provisioned
- [ ] Database servers configured
- [ ] Load balancer set up (if applicable)
- [ ] DNS records configured
- [ ] CDN configured (optional)
- [ ] Monitoring tools installed

---

## 🏗️ Infrastructure Requirements

### Minimum Server Specifications

#### Backend Server
```yaml
CPU: 4 cores (8+ recommended)
RAM: 8GB (16GB+ recommended)
Storage: 50GB SSD (100GB+ for logs/backups)
OS: Ubuntu 22.04 LTS or RHEL 8+
```

#### Database Server (MongoDB)
```yaml
CPU: 4 cores (8+ recommended)
RAM: 16GB (32GB+ recommended)
Storage: 100GB SSD (scalable)
Replica Set: 3 nodes minimum for HA
```

#### Optional Components
- **Redis Cache**: 2 cores, 4GB RAM, 10GB storage
- **SQL Server**: Existing ERP system (read-only access)
- **Nginx/Load Balancer**: 2 cores, 4GB RAM

### Network Requirements
- **Bandwidth**: 100Mbps minimum, 1Gbps recommended
- **Latency**: <50ms between components
- **Ports**: 80 (HTTP), 443 (HTTPS), 8001 (Backend), 27017 (MongoDB), 6379 (Redis)

### Supported Deployment Platforms
✅ **Docker + Docker Compose** (Recommended for single-server)
✅ **Kubernetes** (Recommended for multi-server/HA)
✅ **AWS ECS/Fargate**
✅ **Google Cloud Run**
✅ **Azure Container Instances**
✅ **Traditional VMs** (systemd services)

---

## 🔒 Security Hardening

### 1. SSL/TLS Configuration

#### Using Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (already configured)
sudo certbot renew --dry-run
```

#### Certificate Locations (for nginx config)
```nginx
ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
```

### 2. Generate Secure Secrets

```bash
# Generate JWT secrets (64 characters minimum)
python3 -c "import secrets; print('JWT_SECRET=' + secrets.token_urlsafe(64))"
python3 -c "import secrets; print('JWT_REFRESH_SECRET=' + secrets.token_urlsafe(64))"

# Store in environment file (NEVER commit to git)
echo "JWT_SECRET=<generated_secret>" >> .env.prod
echo "JWT_REFRESH_SECRET=<generated_secret>" >> .env.prod
```

### 3. Database Security

#### MongoDB Authentication
```bash
# Create admin user
mongosh admin --eval '
  db.createUser({
    user: "admin",
    pwd: "<strong_password>",
    roles: [ { role: "root", db: "admin" } ]
  })
'

# Create application user
mongosh stock_verify --eval '
  db.createUser({
    user: "stock_app",
    pwd: "<strong_password>",
    roles: [
      { role: "readWrite", db: "stock_verify" },
      { role: "dbAdmin", db: "stock_verify" }
    ]
  })
'
```

#### Connection String with Authentication
```
mongodb://stock_app:<password>@mongo-server:27017/stock_verify?authSource=stock_verify
```

### 4. Firewall Configuration

```bash
# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Backend (only from localhost or load balancer)
sudo ufw allow from <load_balancer_ip> to any port 8001

# MongoDB (only from backend servers)
sudo ufw allow from <backend_ip> to any port 27017

# Enable firewall
sudo ufw enable
```

### 5. Security Headers

Already configured in `nginx/nginx.conf`:
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Content-Security-Policy
- ✅ Referrer-Policy

### 6. Rate Limiting

Configure in `.env.prod`:
```bash
RATE_LIMIT_ENABLED=true
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_BURST=10
MAX_CONCURRENT=100
```

---

## ⚙️ Environment Configuration

### Production Environment File

Create `.env.prod` at the repository root (used by `docker-compose.prod.yml`):

```bash
# ========================================
# PRODUCTION CONFIGURATION
# ========================================

# Application
ENVIRONMENT=production
APP_NAME=Stock Verify API
APP_VERSION=2.1.0
LOG_LEVEL=INFO
LOG_FORMAT=json

# Server
HOST=0.0.0.0
PORT=8001
WORKERS=4
RELOAD=false

# MongoDB (REQUIRED)
MONGO_URL=mongodb://stock_app:<password>@mongo-primary:27017,mongo-secondary:27017,mongo-tertiary:27017/stock_verify?replicaSet=rs0&authSource=stock_verify
DB_NAME=stock_verify

# JWT Security (REQUIRED - Use generated secrets)
JWT_SECRET=<64-char-secret-from-generation>
JWT_REFRESH_SECRET=<64-char-secret-from-generation>
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=15
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# SQL Server (OPTIONAL - ERP Integration)
SQL_SERVER_HOST=erp-server.company.local
SQL_SERVER_PORT=1433
SQL_SERVER_DATABASE=E_MART_KITCHEN_CARE
SQL_SERVER_USER=readonly_service_account
SQL_SERVER_PASSWORD=<secure_password>

# Redis (HIGHLY RECOMMENDED)
REDIS_URL=redis://redis-server:6379/0
CACHE_TTL=3600
CACHE_MAX_AGE=300

# Security
FORCE_HTTPS=true
RATE_LIMIT_ENABLED=true
RATE_LIMIT_PER_MINUTE=60
BLOCK_SANITIZATION_VIOLATIONS=true

# CORS (CRITICAL - Whitelist only)
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com,https://www.yourdomain.com

# Performance
USE_CONNECTION_POOL=true
POOL_SIZE=20
MAX_OVERFLOW=10
MAX_REQUEST_SIZE_MB=10
REQUEST_TIMEOUT_SECONDS=30

# ERP Sync
ERP_SYNC_ENABLED=true
ERP_SYNC_INTERVAL=3600

# Monitoring (Optional but recommended)
SENTRY_DSN=https://<key>@sentry.io/<project>
SENTRY_ENVIRONMENT=production
ENABLE_METRICS=true
ENABLE_AUDIT_LOG=true

# Backup
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30
```

### Frontend Environment

Set Expo web build variables in `.env.prod`:

```bash
EXPO_PUBLIC_BACKEND_URL=https://api.yourdomain.com
EXPO_PUBLIC_API_TIMEOUT=10000
EXPO_PUBLIC_SENTRY_DSN=<sentry_dsn>
```

---

## 🗄️ Database Setup

### 1. MongoDB Replica Set (High Availability)

#### Initialize Replica Set
```bash
# On primary node
mongosh --eval '
  rs.initiate({
    _id: "rs0",
    members: [
      { _id: 0, host: "mongo-primary:27017", priority: 2 },
      { _id: 1, host: "mongo-secondary:27017", priority: 1 },
      { _id: 2, host: "mongo-tertiary:27017", priority: 1 }
    ]
  })
'

# Verify status
mongosh --eval 'rs.status()'
```

#### Create Indexes (Critical for Performance)
```bash
# Run migrations
cd backend
python -m backend.db.init_db

# Verify indexes
mongosh stock_verify --eval 'db.sessions.getIndexes()'
```

### 2. MongoDB Backup Configuration

```bash
# Create backup directory
sudo mkdir -p /backups/mongodb
sudo chown mongodb:mongodb /backups/mongodb

# Add to crontab (automated daily backups)
0 2 * * * mongodump --uri="mongodb://backup_user:<password>@localhost:27017/stock_verify" --out=/backups/mongodb/$(date +\%Y\%m\%d) && find /backups/mongodb -mtime +30 -delete
```

### 3. Redis Setup (Cache Layer)

```bash
# Install Redis
sudo apt-get install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: maxmemory 2gb
# Set: maxmemory-policy allkeys-lru
# Set: requirepass <strong_password>

# Restart Redis
sudo systemctl restart redis-server
sudo systemctl enable redis-server
```

---

## 🚢 Deployment Options

### Option 1: Docker Compose (Recommended for Single Server)

Use `docker-compose.prod.yml` with the root `.env.prod` file for production.

#### 1. Prepare the Server
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt-get install docker-compose-plugin

# Clone repository
git clone https://github.com/mknoufi/STOCK_VERIFY_ui.git
cd STOCK_VERIFY_ui
```

#### 2. Configure Environment
```bash
# Create production env file
cp .env.production.example .env.prod
nano .env.prod  # Edit with your values
```

#### 3. Provision TLS Certificates (Recommended)
```bash
./scripts/init_letsencrypt.sh
```

#### 4. Deploy
```bash
# Build and start services
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d

# View logs
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f

# Check status
docker compose --env-file .env.prod -f docker-compose.prod.yml ps
```

### Option 2: Kubernetes (Recommended for Multi-Server/HA)

#### 1. Prepare Kubernetes Cluster
```bash
# Ensure kubectl is configured
kubectl cluster-info

# Create namespace
kubectl create namespace stock-verify-prod
```

#### 2. Create Secrets
```bash
# MongoDB credentials
kubectl create secret generic mongodb-secret \
  --from-literal=username=stock_app \
  --from-literal=password=<strong_password> \
  -n stock-verify-prod

# JWT secrets
kubectl create secret generic jwt-secrets \
  --from-literal=jwt-secret=<64-char-secret> \
  --from-literal=jwt-refresh-secret=<64-char-secret> \
  -n stock-verify-prod

# SQL Server credentials (if using ERP)
kubectl create secret generic sql-server-secret \
  --from-literal=host=erp-server.local \
  --from-literal=username=readonly_user \
  --from-literal=password=<password> \
  -n stock-verify-prod
```

#### 3. Deploy Application
```bash
# Apply configurations
kubectl apply -f k8s/configmap.yaml -n stock-verify-prod
kubectl apply -f k8s/deployment.yaml -n stock-verify-prod
kubectl apply -f k8s/service.yaml -n stock-verify-prod

# Check deployment status
kubectl get pods -n stock-verify-prod
kubectl get services -n stock-verify-prod

# View logs
kubectl logs -f deployment/stock-verify-backend -n stock-verify-prod
```

#### 4. Configure Ingress (HTTPS)
```bash
# Install cert-manager for SSL
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ingress with TLS
kubectl apply -f k8s/ingress.yaml -n stock-verify-prod
```

### Option 3: GitHub Actions (CI/CD Deployment)

#### Automated Deployment on Push to Main

Already configured in `.github/workflows/deploy.yaml`

**Setup Required:**
1. Add GitHub Secrets:
   - `KUBE_CONFIG`: Kubernetes config file (base64 encoded)
   - Optional: Docker registry credentials

2. Push to main branch triggers deployment:
```bash
git push origin main
```

3. Manual deployment:
```bash
# Via GitHub UI: Actions → Deploy to Production → Run workflow
# Or via CLI:
gh workflow run deploy.yaml
```

---

## ✅ Post-Deployment Verification

### 1. Health Checks

```bash
# Backend health check
curl https://api.yourdomain.com/health
# Expected: {"status": "ok", "version": "2.1.0"}

# Detailed health check
curl https://api.yourdomain.com/health/detailed
# Expected: Detailed system status including DB, Redis, disk, memory

# API documentation
curl https://api.yourdomain.com/api/docs
# Should return OpenAPI documentation
```

### 2. Security Verification

```bash
# Test HTTPS enforcement
curl -I http://yourdomain.com
# Expected: 301 redirect to https://

# Verify security headers
curl -I https://yourdomain.com
# Check for X-Frame-Options, X-Content-Type-Options, etc.

# Test rate limiting
for i in {1..100}; do curl https://api.yourdomain.com/api/items; done
# Should receive 429 after limit exceeded
```

### 3. Functional Testing

```bash
# Test authentication
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your_password"}'
# Expected: JWT token in response

# Test protected endpoint
curl https://api.yourdomain.com/api/items \
  -H "Authorization: Bearer <token>"
# Expected: Items list
```

### 4. Database Connectivity

```bash
# From backend container/pod
mongosh "mongodb://stock_app:<password>@mongo-server:27017/stock_verify" --eval 'db.runCommand({ping: 1})'
# Expected: { ok: 1 }

# Test SQL Server (if configured)
curl https://api.yourdomain.com/api/mapping/test-connection
# Expected: Connection successful
```

### 5. Monitoring Dashboard

```bash
# Access metrics endpoint (if enabled)
curl https://api.yourdomain.com/metrics
# Expected: Prometheus-format metrics
```

---

## 📊 Monitoring & Logging

### 1. Application Monitoring

#### Setup Sentry (Error Tracking)
```bash
# Already integrated in backend
# Add Sentry DSN to environment:
SENTRY_DSN=https://<key>@sentry.io/<project>
SENTRY_ENVIRONMENT=production
```

#### Prometheus Metrics
```yaml
# Scrape configuration for Prometheus
- job_name: 'stock-verify'
  static_configs:
    - targets: ['backend:8001']
  metrics_path: '/metrics'
```

### 2. Log Management

#### Structured JSON Logging (Enabled by default)
```bash
# View logs
docker-compose logs -f backend
# Or for Kubernetes
kubectl logs -f deployment/stock-verify-backend -n stock-verify-prod

# Logs include:
# - timestamp
# - correlation_id (request tracking)
# - user_id (for authenticated requests)
# - endpoint
# - status_code
# - duration
```

#### Log Aggregation (Recommended)
- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **Loki + Grafana**: Lightweight alternative
- **CloudWatch**: For AWS deployments
- **Stackdriver**: For GCP deployments

### 3. Performance Monitoring

#### Key Metrics to Monitor
```yaml
API Response Time:
  - Target: <200ms (p95)
  - Alert: >500ms (p95)

Database Queries:
  - Target: <50ms (p95)
  - Alert: >200ms (p95)

Error Rate:
  - Target: <0.1%
  - Alert: >1%

Active Users:
  - Monitor concurrent sessions
  - Alert on unusual spikes

Resource Usage:
  - CPU: Alert >80%
  - Memory: Alert >85%
  - Disk: Alert >90%
```

### 4. Uptime Monitoring

#### External Services (Recommended)
- **UptimeRobot**: Free tier available
- **Pingdom**: Comprehensive monitoring
- **StatusCake**: Multi-location checks

#### Configuration
```bash
# Monitor endpoints:
https://yourdomain.com/health          # Every 5 minutes
https://api.yourdomain.com/health      # Every 5 minutes

# Alert channels:
- Email
- SMS (critical alerts)
- Slack/Discord webhook
- PagerDuty (for on-call)
```

---

## 💾 Backup & Disaster Recovery

### 1. Automated Backups

#### MongoDB Backup (Configured in docker-compose.yml)
```yaml
backup:
  build:
    context: .
    dockerfile: backend/backup.Dockerfile
  environment:
    BACKUP_CRON_SCHEDULE: "0 2 * * *"  # Daily at 2 AM
    BACKUP_RETENTION_DAYS: 30
```

#### Manual Backup
```bash
# Create backup
mongodump --uri="mongodb://backup_user:<password>@localhost:27017/stock_verify" --out=/backups/manual_backup_$(date +%Y%m%d_%H%M%S)

# Compress backup
tar -czf stock_verify_backup_$(date +%Y%m%d).tar.gz /backups/manual_backup_*

# Upload to cloud storage (S3, GCS, etc.)
aws s3 cp stock_verify_backup_*.tar.gz s3://your-backup-bucket/
```

### 2. Backup Testing

```bash
# Test restore process monthly
mongorestore --uri="mongodb://localhost:27017" --drop /backups/test_restore

# Verify data integrity
mongosh stock_verify --eval 'db.sessions.countDocuments()'
```

### 3. Disaster Recovery Plan

#### RTO (Recovery Time Objective): 4 hours
#### RPO (Recovery Point Objective): 24 hours (daily backups)

**Recovery Steps:**
1. **Provision new infrastructure** (30 mins)
2. **Restore MongoDB from backup** (1-2 hours)
3. **Deploy application** (30 mins)
4. **Verify functionality** (1 hour)
5. **Update DNS** (5 mins + propagation)

### 4. High Availability Setup

```yaml
MongoDB Replica Set:
  - 3 nodes minimum
  - Automatic failover
  - Read scaling

Backend Services:
  - 3+ replicas
  - Load balanced
  - Health checks enabled

Geographic Distribution:
  - Multi-region deployment (optional)
  - CDN for static assets
  - DNS failover
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Backend Won't Start

```bash
# Check logs
docker-compose logs backend

# Common causes:
# - Missing JWT_SECRET
# - MongoDB connection failed
# - Port already in use

# Solutions:
# Verify environment variables
docker-compose exec backend env | grep JWT_SECRET

# Test MongoDB connection
docker-compose exec mongo mongosh --eval 'db.runCommand({ping: 1})'

# Check port availability
sudo lsof -i :8001
```

#### 2. High CPU Usage

```bash
# Check container stats
docker stats

# Identify slow queries
mongosh stock_verify --eval 'db.currentOp({"secs_running": {$gte: 3}})'

# Review backend logs for slow endpoints
docker-compose logs backend | grep "duration"
```

#### 3. Database Connection Timeouts

```bash
# Increase connection pool
# In .env.prod:
POOL_SIZE=30
MAX_OVERFLOW=20

# Monitor connections
mongosh --eval 'db.serverStatus().connections'
```

#### 4. Frontend Can't Connect to Backend

```bash
# Verify CORS configuration
# In .env.prod:
CORS_ORIGINS=https://yourdomain.com

# Check API URL in frontend
# In .env.prod:
EXPO_PUBLIC_BACKEND_URL=https://api.yourdomain.com

# Test from browser console
fetch('https://api.yourdomain.com/health')
```

#### 5. SSL Certificate Issues

```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Check certificate expiry
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates
```

### Performance Optimization

#### Enable Redis Caching
```bash
# In .env.prod
REDIS_URL=redis://redis-server:6379/0

# Restart backend
docker-compose restart backend
```

#### Database Optimization
```bash
# Analyze slow queries
mongosh stock_verify --eval 'db.setProfilingLevel(1, 100)'

# Review profiled queries
mongosh stock_verify --eval 'db.system.profile.find().limit(10).sort({ts:-1}).pretty()'

# Add missing indexes
mongosh stock_verify --eval 'db.sessions.createIndex({created_at: -1})'
```

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks

**Daily:**
- ✅ Monitor error logs
- ✅ Check system resources
- ✅ Review backup completion

**Weekly:**
- ✅ Review performance metrics
- ✅ Check security alerts
- ✅ Update dependencies (if needed)

**Monthly:**
- ✅ Test backup restoration
- ✅ Review access logs
- ✅ Security audit
- ✅ Performance tuning

**Quarterly:**
- ✅ Disaster recovery drill
- ✅ Security penetration test
- ✅ Capacity planning review

### Emergency Contacts

```yaml
Infrastructure Issues:
  - DevOps Team: devops@company.com
  - On-Call: +1-XXX-XXX-XXXX

Application Issues:
  - Development Team: dev@company.com
  - Technical Lead: lead@company.com

Database Issues:
  - DBA Team: dba@company.com

Security Incidents:
  - Security Team: security@company.com
  - CISO: ciso@company.com
```

---

## ✅ Production Readiness Sign-Off

**Before going live, ensure all items are checked:**

- [ ] SSL/TLS certificates installed and tested
- [ ] Environment variables configured and validated
- [ ] Database replica set configured
- [ ] Automated backups running
- [ ] Monitoring and alerting configured
- [ ] Security scanning completed
- [ ] Load testing performed
- [ ] Disaster recovery plan tested
- [ ] Documentation updated
- [ ] Operations team trained
- [ ] Incident response procedures in place
- [ ] Support contacts updated

**Sign-off:**
- [ ] Technical Lead: _______________ Date: ___________
- [ ] DevOps Lead: _________________ Date: ___________
- [ ] Security Lead: ________________ Date: ___________
- [ ] Product Owner: _______________ Date: ___________

---

**Document Version:** 1.0
**Last Updated:** December 2025
**Next Review:** March 2026
