Set-Location 'D:\stk\stock-verify-system'
$proc = Start-Process -FilePath 'npm.cmd' -ArgumentList '--prefix','frontend','run','web' -WorkingDirectory (Get-Location) -PassThru
Write-Output ("Started frontend PID: {0}" -f $proc.Id)
