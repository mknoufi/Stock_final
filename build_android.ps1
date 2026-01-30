
Write-Host "Setting JAVA_HOME..."
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;" + $env:PATH
Write-Host "Using Java: $($env:JAVA_HOME)"
java -version

Write-Host "Building Android App (Native Development Build)..."
cd frontend
npx expo run:android
