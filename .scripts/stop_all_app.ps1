<#
.SYNOPSIS
    Stop all Stock Verify application processes
.DESCRIPTION
    This script stops both backend and frontend processes cleanly.
#>

Write-Host "🛑 Stopping Stock Verify Application..." -ForegroundColor Yellow

# Try to read status file if it exists
$statusFile = ".app_status.json"
if (Test-Path $statusFile) {
    try {
        $status = Get-Content $statusFile | ConvertFrom-Json
        Write-Host "Found status file, stopping tracked processes..." -ForegroundColor Gray

        # Stop backend
        if ($status.backendPid) {
            try {
                $backendProc = Get-Process -Id $status.backendPid -ErrorAction SilentlyContinue
                if ($backendProc) {
                    Write-Host "Stopping backend process (PID: $($status.backendPid))" -ForegroundColor Gray
                    Stop-Process -Id $status.backendPid -Force -ErrorAction SilentlyContinue
                    Write-Host "✅ Backend stopped" -ForegroundColor Green
                }
            }
            catch {
                Write-Host "Could not stop backend process: $($_.Exception.Message)" -ForegroundColor DarkYellow
            }
        }

        # Stop frontend
        if ($status.frontendPid) {
            try {
                $frontendProc = Get-Process -Id $status.frontendPid -ErrorAction SilentlyContinue
                if ($frontendProc) {
                    Write-Host "Stopping frontend process (PID: $($status.frontendPid))" -ForegroundColor Gray
                    Stop-Process -Id $status.frontendPid -Force -ErrorAction SilentlyContinue
                    Write-Host "✅ Frontend stopped" -ForegroundColor Green
                }
            }
            catch {
                Write-Host "Could not stop frontend process: $($_.Exception.Message)" -ForegroundColor DarkYellow
            }
        }

        # Remove status file
        Remove-Item $statusFile -Force -ErrorAction SilentlyContinue
    }
    catch {
        Write-Host "Could not read status file, falling back to process detection" -ForegroundColor Yellow
    }
}
else {
    Write-Host "No status file found, searching for application processes..." -ForegroundColor Yellow

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
            # Check if it's likely our backend
            $procInfo = Get-WmiObject -Class Win32_Process -Filter "ProcessId = $($proc.Id)" -ErrorAction SilentlyContinue
            if ($procInfo -and ($procInfo.CommandLine -like "*uvicorn*" -or $procInfo.CommandLine -like "*backend.server*")) {
                Write-Host "Stopping Python backend process ID: $($proc.Id)" -ForegroundColor Gray
                Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
            }
        }
        catch {
            Write-Host "Could not stop Python process $($proc.Id): $($_.Exception.Message)" -ForegroundColor DarkYellow
        }
    }
}

# Clean up any remaining port bindings
Write-Host "🧹 Cleaning up port bindings..." -ForegroundColor Yellow
$portsToClean = @(8000, 8081, 8082)
foreach ($port in $portsToClean) {
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

Write-Host "`n✅ All application processes stopped!" -ForegroundColor Green
