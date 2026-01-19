
Write-Host "Starting Stock Verify App..."

# Start Backend
Write-Host "Starting Backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m backend.server | Tee-Object -FilePath backend_log.txt"

# Wait a bit for backend to initialize
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "Starting Frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npx expo start --clear"

Write-Host "App started. Backend running in one window, Frontend in another."
Write-Host "Backend Health: http://localhost:8001/api/health"
Write-Host "Frontend Access: http://localhost:8081"
