Set-Location 'D:\stk\stock-verify-system'
$proc = Start-Process -FilePath '.venv\Scripts\python.exe' -ArgumentList '-m','uvicorn','backend.server:app','--host','0.0.0.0','--port','8000' -WorkingDirectory (Get-Location) -PassThru
Write-Output ("Started backend PID: {0}" -f $proc.Id)
