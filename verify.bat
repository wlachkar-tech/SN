@echo off
REM Student Management App - Setup Verification Script (Windows)
REM This script verifies the installation of the application

cls
echo ===============================================
echo Student Management App - Setup Verification
echo ===============================================
echo.

REM Check Node.js
echo Checking Node.js...
where node >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo [OK] Node.js installed: %NODE_VERSION%
) else (
    echo [ERROR] Node.js not found. Please install Node.js 16+
    pause
    exit /b 1
)

REM Check npm
echo.
echo Checking npm...
where npm >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo [OK] npm installed: %NPM_VERSION%
) else (
    echo [ERROR] npm not found
    pause
    exit /b 1
)

REM Check project structure
echo.
echo Checking project structure...

if exist "backend" (
    echo [OK] backend exists
) else (
    echo [ERROR] backend not found
)

if exist "frontend" (
    echo [OK] frontend exists
) else (
    echo [ERROR] frontend not found
)

if exist "backend\routes" (
    echo [OK] backend\routes exists
) else (
    echo [ERROR] backend\routes not found
)

if exist "frontend\app" (
    echo [OK] frontend\app exists
) else (
    echo [ERROR] frontend\app not found
)

REM Check important files
echo.
echo Checking important files...

if exist "backend\package.json" (
    echo [OK] backend\package.json exists
) else (
    echo [ERROR] backend\package.json not found
)

if exist "backend\server.js" (
    echo [OK] backend\server.js exists
) else (
    echo [ERROR] backend\server.js not found
)

if exist "frontend\package.json" (
    echo [OK] frontend\package.json exists
) else (
    echo [ERROR] frontend\package.json not found
)

if exist "README.md" (
    echo [OK] README.md exists
) else (
    echo [ERROR] README.md not found
)

REM Check dependencies
echo.
echo Checking backend dependencies...

if exist "backend\node_modules" (
    echo [OK] Backend node_modules exists
) else (
    echo [WARNING] Backend node_modules not found
    echo Run: cd backend ^&^& npm install
)

echo.
echo Checking frontend dependencies...

if exist "frontend\node_modules" (
    echo [OK] Frontend node_modules exists
) else (
    echo [WARNING] Frontend node_modules not found
    echo Run: cd frontend ^&^& npm install
)

REM Check environment files
echo.
echo Checking environment files...

if exist "backend\.env" (
    echo [OK] backend\.env exists
) else (
    echo [WARNING] backend\.env not found
    echo Run: cd backend ^&^& copy .env.example .env
)

if exist "frontend\.env.local" (
    echo [OK] frontend\.env.local exists
) else (
    echo [WARNING] frontend\.env.local not found
    echo Run: cd frontend ^&^& copy .env.local.example .env.local
)

REM Summary
echo.
echo ===============================================
echo Verification Complete!
echo ===============================================
echo.
echo Next steps:
echo 1. Configure environment files if needed
echo 2. Run: npm run dev (from root directory)
echo 3. Backend will start on http://localhost:5000
echo 4. Frontend will start on http://localhost:3000
echo.
echo For detailed setup instructions, see GETTING_STARTED.md
echo.
pause
