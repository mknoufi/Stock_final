
Write-Host "PERFORMING CLEAN RESTART..."

# 1. Kill all related processes
Write-Host "Killing existing processes (Node, Python, Cloudflared)..."
Stop-Process -Name "node", "python", "cloudflared" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 2. Start Cloudflare Tunnel (Background/New Window)
Write-Host "Starting Cloudflare Tunnel..."
# We use Start-Process to run it independently
Start-Process -FilePath "cloudflared" -ArgumentList "tunnel", "run" -WindowStyle Minimized

# 3. Wait for Tunnel to initialize
Write-Host "Waiting 10 seconds for Tunnel to come online..."
Start-Sleep -Seconds 10

# 4. Start App Stack (Backend + Frontend with --clear)
Write-Host "Starting App Stack (Backend + Frontend with Cache Clear)..."
# We execute the existing start script which handles backend and frontend
# Note: start_with_tunnel.ps1 uses 'npx expo start --clear' in the frontend command if we modify it or passes args.
# Let's just call it. The script I wrote earlier hardcoded 'npx expo start --tunnel'.
# I will modify start_with_tunnel.ps1 to ensure --clear is present or just run the commands here.

# Actually, let's just trigger start_with_tunnel.ps1 and ensure IT has --clear
# or better, just replicate the logic here for a truly "fresh" start logic in one file.

# A. Start Backend (Localhost binding for IPv6/Cloudflare support)
$env:HOST = "localhost"
$BackendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m backend.server" -PassThru

# B. Wait for Backend
Write-Host "Waiting 10 seconds for Backend..."
Start-Sleep -Seconds 10

# C. Start Frontend with --clear and --tunnel
$BackendUrl = "https://app.lavanyaemart.app"
Write-Host "Starting Frontend with --clear --tunnel using API: $BackendUrl"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; `$env:EXPO_PUBLIC_BACKEND_URL='$BackendUrl'; npx expo start --clear --tunnel"

Write-Host "Clean restart complete."
