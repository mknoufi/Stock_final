
Write-Host "Installing Backend Dependencies..."
pip install -r requirements.production.txt
# Ensure main dev requirements are also installed if production one missed something
if (Test-Path "backend/requirements.txt") {
    pip install -r backend/requirements.txt
}
if (Test-Path "backend/backend/requirements.txt") {
    pip install -r backend/backend/requirements.txt
}

if (!(Test-Path "frontend\node_modules")) {
    Write-Host "Installing Frontend Dependencies (this may take a while)..."
    cd frontend
    npm install --legacy-peer-deps
    cd ..
}
else {
    Write-Host "Frontend dependencies seem to be present."
}

Write-Host "Dependencies ready."
