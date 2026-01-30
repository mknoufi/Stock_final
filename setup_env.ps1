
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env -Force
}
if (-not (Test-Path frontend\.env)) {
    Copy-Item frontend\.env.example frontend\.env -Force
}

$content = Get-Content .env
$newContent = @()
foreach ($line in $content) {
    if ($line -match "JWT_SECRET=") {
        $newContent += "JWT_SECRET=a_very_long_random_secret_string_for_development_mode_only_123456"
    }
    else {
        $newContent += $line
    }
}
$newContent += "JWT_REFRESH_SECRET=another_very_long_random_refresh_secret_string_for_development_mode_only_987654"

Set-Content .env $newContent
Write-Host "Environment files updated."
