
Write-Host "Starting Stock Verify App with Tunnel (IPv6/Localhost Fix)..."

# 0. Kill existing backend on port 8001 to ensure we can bind to it
Write-Host "Checking for existing process on port 8001..."
try {
    $tcp = Get-NetTCPConnection -LocalPort 8001 -ErrorAction SilentlyContinue
    if ($tcp) {
        Write-Host "Killing process ID $($tcp.OwningProcess) on port 8001..."
        Stop-Process -Id $tcp.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}
catch {
    # Ignore errors if no process found
}

# 1. Set HOST to localhost to support IPv6 (::1) which Cloudflare prefers
$env:HOST = "localhost"
Write-Host "Setting HOST environment variable to '$env:HOST' to fix Cloudflare 502 error (IPv6 support)."

# 1b. Start Backend
Write-Host "Starting Backend..."
$BackendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m backend.server" -PassThru

# 2. Wait for Backend to initialize locally
Write-Host "Waiting 15 seconds for backend to start..."
Start-Sleep -Seconds 15

# 3. Check Tunnel URL
$BackendUrl = "https://app.lavanyaemart.app"
Write-Host "Checking backend via Tunnel at $BackendUrl..."
$TunnelActive = $false

try {
    # Retry a few times
    for ($i = 0; $i -lt 5; $i++) {
        $request = Invoke-WebRequest -Uri "$BackendUrl/api/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($request.StatusCode -eq 200) {
            Write-Host "SUCCESS: Backend is accessible via Tunnel at $BackendUrl"
            $TunnelActive = $true
            break
        }
        Write-Host "Attempt $($i+1): Tunnel status $($request.StatusCode). Waiting..."
        Start-Sleep -Seconds 3
    }
}
catch {
    Write-Host "Tunnel check exception: $_"
}

# 4. Start Frontend
Write-Host "Starting Frontend (Expo Tunnel)..."
if ($TunnelActive) {
    Write-Host "Using Tunnel URL: $BackendUrl"
    # Pass the URL to the frontend process
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; `$env:EXPO_PUBLIC_BACKEND_URL='$BackendUrl'; npx expo start --tunnel"
}
else {
    Write-Host "Tunnel check failed (still 502?). Starting frontend anyway."
    Write-Host "Note: If you see 502 Bad Gateway, make sure 'cloudflared' is running."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npx expo start --tunnel"
}

Write-Host "App started."
