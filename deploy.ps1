# Stock Verify System - Windows Deployment Script
# Usage: .\deploy.ps1 [-Environment staging|production]

param(
    [string]$Environment = "staging"
)

$ErrorActionPreference = "Stop"
$ComposeFile = "docker-compose.prod.yml"
$EnvFile = ".env.prod"

Write-Host "🚀 Deploying Stock Verify System to $Environment..." -ForegroundColor Cyan

# Validate environment
if (-not (Test-Path $EnvFile)) {
    Write-Host "❌ Error: $EnvFile not found" -ForegroundColor Red
    Write-Host "   Run: Copy-Item .env.production.example .env.prod" -ForegroundColor Yellow
    exit 1
}

# Pre-deployment checks
Write-Host "📋 Running pre-deployment checks..." -ForegroundColor Yellow

# Check Docker
try {
    docker --version | Out-Null
    Write-Host "✅ Docker available" -ForegroundColor Green
}
catch {
    Write-Host "❌ Docker not installed" -ForegroundColor Red
    exit 1
}

# Pull latest images
Write-Host "📥 Pulling latest images..." -ForegroundColor Yellow
docker compose -f $ComposeFile pull

# Deploy
Write-Host "🔄 Starting deployment..." -ForegroundColor Yellow
docker compose -f $ComposeFile up -d --build

# Wait for health checks
Write-Host "⏳ Waiting for services to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Health check
Write-Host "🏥 Running health checks..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost/health" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend is healthy" -ForegroundColor Green
    }
}
catch {
    Write-Host "⚠️ Backend health check failed, checking logs..." -ForegroundColor Yellow
    docker compose -f $ComposeFile logs --tail=50 backend
}

# Show status
Write-Host ""
Write-Host "📊 Service Status:" -ForegroundColor Cyan
docker compose -f $ComposeFile ps

Write-Host ""
Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Access points:" -ForegroundColor Cyan
Write-Host "  - API: http://localhost/api/v1"
Write-Host "  - Health: http://localhost/health"
Write-Host "  - Grafana: http://localhost/grafana"
Write-Host ""
Write-Host "View logs: docker compose -f $ComposeFile logs --follow"
