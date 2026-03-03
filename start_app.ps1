
Write-Host "Starting Stock Verify App..."

# Start Backend
Write-Host "Starting Backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m backend.server --host 0.0.0.0 | Tee-Object -FilePath backend_log.txt"

# Wait a bit for backend to initialize
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "Starting Frontend (Network)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npx expo start --clear --host lan"

Write-Host "App started. Backend running in one window, Frontend in another."
Write-Host "Backend Health: http://<YOUR_IP>:8001/api/health"
Write-Host "Frontend Access: http://<YOUR_IP>:8081"
