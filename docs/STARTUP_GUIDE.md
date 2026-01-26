# Stock Verification System - Startup Guide

## ✅ Completed & Fixed
- ✅ Expo QR Code generated: `frontend/expo-qr.png`
- ✅ MongoDB Docker container running with replica set
- ✅ Backend server successfully tested and running on port 8001
- ✅ Frontend (Expo) successfully tested and running on port 8081
- ✅ All services can communicate with each other

## 🚀 Fixed Issues
1. **MongoDB Replica Set**: Added `--replSet rs0` to docker-compose.yml and initialized
2. **Backend Configuration**: Verified PYTHONPATH and MONGO_URL environment variables work correctly
3. **Frontend Build**: Confirmed npm start works and Expo dev server initializes properly

## 🔧 Quick Start Commands

### Option 1: Docker (Recommended for Backend)
```bash
# Start Backend and MongoDB
docker-compose up -d

# Logs
docker-compose logs -f backend
```

### Option 2: Manual Setup

#### Start Backend (Terminal 1)
```bash
cd backend
# Ensure backend/.env is configured
uvicorn backend.server:app --host 0.0.0.0 --port 8001 --reload
```

✅ **Backend Running**: http://localhost:8001
- API Docs: http://localhost:8001/api/docs
- Health: http://localhost:8001/api/health

### ERP/SQL Connectivity (Batch Listing)
- Batch listing requires SQL Server to be reachable.
- If SQL is down, the UI shows "ERP Offline" and batch lists may be empty.
- Validate with `GET /api/item-batches/{item_code}` and check backend logs for SQL errors.

### Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```

✅ **Frontend Running**: http://localhost:8081 (Expo Dev Server)
- Scan QR code: `frontend/expo-qr.png`
- Or press `i` for iOS simulator
- Or press `a` for Android emulator

## 📋 Environment Variables Set Correctly

### Restart MongoDB if needed
```bash
cd /Users/noufi1/cursor new/STOCK_VERIFY_2-db-maped
docker-compose down
docker-compose up -d mongo
sleep 10
# Then run Step 1 again
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
pkill -9 -f "uvicorn|npm|node|python"
sleep 3
```

### Clear Frontend Cache
```bash
cd frontend
npm run reset-project
rm -rf node_modules/.cache
npm start
```

### Check Processes
```bash
ps aux | grep -E "node|npm|expo|python|uvicorn" | grep -v grep
```

### Docker Status
```bash
docker ps
docker logs stock_verify_2-db-maped-mongo-1 | tail -20
```

## 📱 Mobile Testing

Once all services are running:

1. **Expo Go App** (iOS/Android):
   - Scan QR code at: `frontend/expo-qr.png`
   - Or manually enter: `exp://192.168.0.110:8082`

2. **iOS Simulator**:
   - Press `i` in Expo dev terminal

3. **Android Emulator**:
   - Press `a` in Expo dev terminal

## 🔗 Important URLs

- Backend API: http://localhost:8001
- Swagger Docs: http://localhost:8001/api/docs
- Health Check: http://localhost:8001/api/health
- Frontend Web: http://localhost:8081 (Expo web)
- MongoDB: localhost:27018

## 🎯 Quick Start (All-in-One)

```bash
#!/bin/bash
cd /Users/noufi1/cursor new/STOCK_VERIFY_2-db-maped

# Kill old processes
pkill -9 -f "uvicorn|npm|node|python" 2>/dev/null || true

# Start MongoDB
docker-compose down 2>/dev/null || true
docker-compose up -d mongo
sleep 10

# Initialize replica set
docker exec stock_verify_2-db-maped-mongo-1 mongosh --eval "rs.initiate()" 2>/dev/null || true
sleep 5

echo "=== MongoDB is running ==="
docker ps --filter "name=mongo" --format "{{.Names}}: {{.Status}}"

# Start backend in background
echo "Starting backend..."
cd backend
export PYTHONPATH=..
export MONGO_URL="mongodb://localhost:27018/stock_verify?replicaSet=rs0"
uvicorn backend.server:app --host 0.0.0.0 --port 8001 --reload &
BACKEND_PID=$!
sleep 5

echo "=== Backend running on http://localhost:8001 ==="
echo "=== Starting frontend... ==="

cd ../frontend
npm start

echo "Scan QR code at frontend/expo-qr.png"
```
