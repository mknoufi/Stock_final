#!/bin/bash
# Stock Verify System - Deployment Script
# Usage: ./deploy.sh [staging|production]

set -e

ENVIRONMENT="${1:-staging}"
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.prod"

echo "🚀 Deploying Stock Verify System to ${ENVIRONMENT}..."

# Validate environment
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: $ENV_FILE not found"
    echo "   Run: cp .env.production.example .env.prod"
    exit 1
fi

# Pre-deployment checks
echo "📋 Running pre-deployment checks..."

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not installed"
    exit 1
fi

# Check Docker Compose
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose not available"
    exit 1
fi

echo "✅ Pre-deployment checks passed"

# Pull latest images
echo "📥 Pulling latest images..."
docker compose -f $COMPOSE_FILE pull

# Backup current state (if running)
echo "💾 Creating backup..."
docker compose -f $COMPOSE_FILE exec -T mongo mongodump --out /data/backup/$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

# Deploy
echo "🔄 Starting deployment..."
docker compose -f $COMPOSE_FILE up -d --build

# Wait for health checks
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Health check
echo "🏥 Running health checks..."
HEALTH_URL="http://localhost/health"
if curl -sf $HEALTH_URL > /dev/null; then
    echo "✅ Backend is healthy"
else
    echo "⚠️ Backend health check failed, checking logs..."
    docker compose -f $COMPOSE_FILE logs --tail=50 backend
fi

# Show status
echo ""
echo "📊 Service Status:"
docker compose -f $COMPOSE_FILE ps

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Access points:"
echo "  - API: http://localhost/api/v1"
echo "  - Health: http://localhost/health"
echo "  - Grafana: http://localhost/grafana"
echo ""
echo "View logs: docker compose -f $COMPOSE_FILE logs -f"
