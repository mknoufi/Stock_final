$ErrorActionPreference = "Stop"

$trackedFiles = git ls-files

$patterns = @(
    "(^|/)__pycache__/",
    "^backend/dist/",
    "^backend/build/",
    "(^|/)node_modules/",
    "^[^/]*tmp_",
    "(^|/)tmp_",
    "\.log$",
    "_output\.txt$",
    "_results[^/]*\.txt$",
    "_debug[^/]*\.txt$"
)

$violations = @()
foreach ($file in $trackedFiles) {
    $normalized = $file -replace "\\", "/"
    foreach ($pattern in $patterns) {
        if ($normalized -match $pattern) {
            $violations += $normalized
            break
        }
    }
}

if ($violations.Count -gt 0) {
    Write-Host "Repository hygiene check failed. Forbidden tracked artifacts found:" -ForegroundColor Red
    $violations | Sort-Object -Unique | ForEach-Object { Write-Host " - $_" }
    exit 1
}

Write-Host "Repository hygiene check passed." -ForegroundColor Green
