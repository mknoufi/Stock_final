#!/usr/bin/env bash
# =============================================================================
# validate_deploy.sh — Pre-deployment validation script
# =============================================================================
# Usage: bash scripts/validate_deploy.sh
# =============================================================================
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS=0
FAIL=0
WARN=0

pass() { echo -e "  ${GREEN}✅ PASS${NC}: $1"; ((PASS++)); }
fail() { echo -e "  ${RED}❌ FAIL${NC}: $1"; ((FAIL++)); }
warn() { echo -e "  ${YELLOW}⚠️  WARN${NC}: $1"; ((WARN++)); }

echo "============================================"
echo "  Stock Verify — Deployment Validation"
echo "============================================"
echo ""

# -----------------------------------------------
# 1. Environment Variables
# -----------------------------------------------
echo "📋 Phase 1: Environment Variables"

if [ -f "backend/.env" ]; then
    pass "backend/.env exists"

    # Check critical vars
    if grep -q "^JWT_SECRET=" backend/.env; then
        JWT_VAL=$(grep "^JWT_SECRET=" backend/.env | cut -d'=' -f2-)
        if [ ${#JWT_VAL} -ge 32 ]; then
            pass "JWT_SECRET is >= 32 characters"
        else
            fail "JWT_SECRET is less than 32 characters"
        fi
        if echo "$JWT_VAL" | grep -qi "development\|placeholder\|change.me\|GENERATE"; then
            fail "JWT_SECRET contains placeholder value"
        else
            pass "JWT_SECRET is not a placeholder"
        fi
    else
        fail "JWT_SECRET not found in backend/.env"
    fi

    if grep -q "^ENVIRONMENT=" backend/.env; then
        ENV_VAL=$(grep "^ENVIRONMENT=" backend/.env | cut -d'=' -f2-)
        if [ "$ENV_VAL" = "production" ]; then
            pass "ENVIRONMENT=production"
        else
            warn "ENVIRONMENT=$ENV_VAL (not production)"
        fi
    else
        fail "ENVIRONMENT not set in backend/.env"
    fi

    if grep -q "^DEBUG=true" backend/.env; then
        fail "DEBUG=true in backend/.env"
    else
        pass "DEBUG is not true"
    fi

    if grep -q "^HOT_RELOAD=true" backend/.env; then
        fail "HOT_RELOAD=true in backend/.env"
    else
        pass "HOT_RELOAD is not enabled"
    fi

    if grep -q "^DEBUG_ENDPOINTS=true" backend/.env; then
        fail "DEBUG_ENDPOINTS=true in backend/.env"
    else
        pass "DEBUG_ENDPOINTS is not enabled"
    fi
else
    fail "backend/.env does not exist"
fi

echo ""

# -----------------------------------------------
# 2. Docker Build
# -----------------------------------------------
echo "🐳 Phase 2: Docker Build"

if command -v docker &> /dev/null; then
    pass "Docker is installed"
    if docker build -q -t stock-verify-backend ./backend > /dev/null 2>&1; then
        pass "Backend Docker image builds successfully"
    else
        fail "Backend Docker image build failed"
    fi
else
    warn "Docker not available — skipping build check"
fi

echo ""

# -----------------------------------------------
# 3. Backend Lint
# -----------------------------------------------
echo "🔍 Phase 3: Code Quality"

if command -v ruff &> /dev/null; then
    if cd backend && ruff check . > /dev/null 2>&1; then
        pass "Backend ruff check passes"
    else
        fail "Backend ruff check has errors"
    fi
    cd ..
else
    warn "ruff not installed — skipping lint check"
fi

echo ""

# -----------------------------------------------
# 4. Frontend Check
# -----------------------------------------------
echo "📱 Phase 4: Frontend"

if [ -f "frontend/.env" ]; then
    pass "frontend/.env exists"
    BACKEND_URL=$(grep "^EXPO_PUBLIC_BACKEND_URL=" frontend/.env | cut -d'=' -f2-)
    if echo "$BACKEND_URL" | grep -q "192\.168\.\|10\.0\.\|172\."; then
        warn "Frontend EXPO_PUBLIC_BACKEND_URL uses LAN IP: $BACKEND_URL"
    else
        pass "Frontend backend URL is not a LAN IP"
    fi
else
    fail "frontend/.env does not exist"
fi

echo ""

# -----------------------------------------------
# 5. File Hygiene
# -----------------------------------------------
echo "🧹 Phase 5: Repository Hygiene"

if [ -f ".env" ]; then
    warn "Root .env file exists (should only be in backend/ and frontend/)"
else
    pass "No root .env file"
fi

if [ -f "docker-compose.production.yml" ]; then
    pass "docker-compose.production.yml exists"
else
    fail "docker-compose.production.yml missing"
fi

echo ""

# -----------------------------------------------
# Summary
# -----------------------------------------------
echo "============================================"
echo "  Results: ${GREEN}${PASS} passed${NC}, ${RED}${FAIL} failed${NC}, ${YELLOW}${WARN} warnings${NC}"
echo "============================================"

if [ $FAIL -gt 0 ]; then
    echo -e "${RED}❌ NOT READY FOR DEPLOYMENT${NC}"
    exit 1
else
    echo -e "${GREEN}✅ READY FOR DEPLOYMENT${NC}"
    exit 0
fi
