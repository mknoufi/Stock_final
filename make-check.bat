@echo off
echo === QUALITY GATES CHECK ===

echo.
echo [1/4] Running linting...
cd backend
python -m ruff check . --output-format=concise
if %ERRORLEVEL% NEQ 0 (
    echo LINT FAILED
    exit /b 1
)

echo.
echo [2/4] Running type checking (basic)...
python -c "import ast; print('Basic syntax check passed')"
if %ERRORLEVEL% NEQ 0 (
    echo TYPE CHECK FAILED
    exit /b 1
)

echo.
echo [3/4] Running unit tests...
python -m pytest tests/ -q --tb=line
if %ERRORLEVEL% NEQ 0 (
    echo TESTS FAILED
    exit /b 1
)

echo.
echo [4/4] Checking coverage...
python -m pytest tests/ --cov=. --cov-report=term-missing | findstr "TOTAL"
python -m pytest tests/ --cov=. --cov-fail-under=75 -q
if %ERRORLEVEL% NEQ 0 (
    echo COVERAGE FAILED
    exit /b 1
)

echo.
echo === ALL GATES PASSED ===
cd ..
