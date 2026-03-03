<#
.SYNOPSIS
    Complete application startup script for Stock Verify System
.DESCRIPTION
    This script starts both backend and frontend with proper dependency management.
    It stops all existing processes before starting new ones and ensures backend is running before starting frontend.
#>

# Stop all existing Node.js and Python processes related to our application
Write-Host "🛑 Stopping existing application processes..." -ForegroundColor Yellow

# Kill Node.js processes (frontend)
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
foreach ($proc in $nodeProcesses) {
    try {
        Write-Host "Stopping Node.js process ID: $($proc.Id)" -ForegroundColor Gray
        Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    }
    catch {
        Write-Host "Could not stop process $($proc.Id): $($_.Exception.Message)" -ForegroundColor DarkYellow
    }
}

# Kill Python processes (backend)
$pythonProcesses = Get-Process -Name "python*" -ErrorAction SilentlyContinue | Where-Object {$_.ProcessName -match "python"}
foreach ($proc in $pythonProcesses) {
    try {
        # Check if it's likely our backend by checking the working directory or command line
        $procInfo = Get-WmiObject -Class Win32_Process -Filter "ProcessId = $($proc.Id)" -ErrorAction SilentlyContinue
        if ($procInfo -and $procInfo.CommandLine -like "*uvicorn*" -or $procInfo.CommandLine -like "*backend.server*") {
            Write-Host "Stopping Python backend process ID: $($proc.Id)" -ForegroundColor Gray
            Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
        }
    }
    catch {
        Write-Host "Could not stop Python process $($proc.Id): $($_.Exception.Message)" -ForegroundColor DarkYellow
    }
}

# Wait a moment for processes to fully terminate
Start-Sleep -Seconds 2

# Clear any existing port bindings
Write-Host "🧹 Cleaning up port bindings..." -ForegroundColor Yellow

# Check and clean ports 8000 (backend) and 8081/8082 (frontend)
$portsToCheck = @(8000, 8081, 8082)
foreach ($port in $portsToCheck) {
    $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    foreach ($conn in $connections) {
        try {
            $process = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "Killing process $($process.ProcessName) (PID: $($process.Id)) using port $port" -ForegroundColor Gray
                Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
            }
        }
        catch {
            Write-Host "Could not clean port ${port}: $($_.Exception.Message)" -ForegroundColor DarkYellow
        }
    }
}

# Wait for cleanup to complete
Start-Sleep -Seconds 3

Set-Location 'D:\stk\stock-verify-system'

# Function to test if backend is ready
function Test-BackendReady {
    param(
        [int]$Port = 8000,
        [int]$TimeoutSeconds = 30
    )

    $endTime = (Get-Date).AddSeconds($TimeoutSeconds)

    while ((Get-Date) -lt $endTime) {
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:$Port/health" -TimeoutSec 5 -ErrorAction Stop
            if ($response.status -eq "healthy") {
                return $true
            }
        }
        catch {
            Write-Host "⏳ Waiting for backend to be ready..." -ForegroundColor Blue
            Start-Sleep -Seconds 2
        }
    }

    return $false
}

# Start Backend
Write-Host "🚀 Starting Backend Server..." -ForegroundColor Green
$backendProc = Start-Process -FilePath '.venv\Scripts\python.exe' -ArgumentList '-m','uvicorn','backend.server:app','--host','0.0.0.0','--port','8000' -WorkingDirectory (Get-Location) -PassThru -NoNewWindow
Write-Host "Backend started with PID: $($backendProc.Id)" -ForegroundColor Cyan

# Wait for backend to be ready
Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Blue
$backendReady = Test-BackendReady -Port 8000 -TimeoutSeconds 60

if (-not $backendReady) {
    Write-Host "❌ Backend failed to start properly!" -ForegroundColor Red
    Write-Host "Check the backend logs for errors" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backend is ready!" -ForegroundColor Green

# Start Frontend
Write-Host "🚀 Starting Frontend Application..." -ForegroundColor Green

# Set environment variables for frontend to connect to backend
$env:EXPO_PUBLIC_BACKEND_URL = "http://localhost:8000"
$env:EXPO_PUBLIC_API_URL = "http://localhost:8000"

# Start frontend with automatic port selection
$frontendProc = Start-Process -FilePath 'npm.cmd' -ArgumentList '--prefix','frontend','run','web' -WorkingDirectory (Get-Location) -PassThru -NoNewWindow
Write-Host "Frontend started with PID: $($frontendProc.Id)" -ForegroundColor Cyan

# Wait a moment for frontend to start
Start-Sleep -Seconds 5

# Display status
Write-Host "`n🎉 Application Started Successfully!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:8081 (or next available port)" -ForegroundColor Yellow
Write-Host "`nProcess IDs:" -ForegroundColor Cyan
Write-Host "Backend PID:  $($backendProc.Id)" -ForegroundColor Gray
Write-Host "Frontend PID: $($frontendProc.Id)" -ForegroundColor Gray
Write-Host "`nTo stop all processes, run: Get-Process -Id $($backendProc.Id),$($frontendProc.Id) | Stop-Process -Force" -ForegroundColor DarkGray

# Create a simple status file for tracking
$status = @{
    backendPid = $backendProc.Id
    frontendPid = $frontendProc.Id
    backendUrl = "http://localhost:8000"
    frontendUrl = "http://localhost:8081"
    startedAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
} | ConvertTo-Json

$status | Out-File -FilePath ".app_status.json" -Encoding UTF8

Write-Host "`n✨ Application is ready to use!" -ForegroundColor Green
