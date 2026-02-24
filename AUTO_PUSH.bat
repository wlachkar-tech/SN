@echo off
REM ============================================================
REM Automated Git Installation & Repository Push Script
REM ============================================================
REM This script will:
REM 1. Check if Git is installed, if not install it
REM 2. Configure Git user
REM 3. Initialize and push to GitHub
REM ============================================================

setlocal enabledelayedexpansion

echo.
echo ====================================================
echo  Student Management App - GitHub Push
echo ====================================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if !errorlevel! neq 0 (
    echo Git is not installed. Downloading and installing...
    
    REM Download Git installer (winget method - if available)
    winget install Git.Git -e --silent >nul 2>&1
    
    if !errorlevel! neq 0 (
        echo Installing Git via Chocolatey (if available)...
        choco install git -y >nul 2>&1
        
        if !errorlevel! neq 0 (
            echo.
            echo ERROR: Could not auto-install Git.
            echo.
            echo Please install Git manually from: https://git-scm.com/download/win
            echo Then run this script again.
            echo.
            pause
            exit /b 1
        )
    )
    
    echo Git installed successfully!
    REM Refresh PATH
    set PATH=%PATH%;C:\Program Files\Git\cmd
)

echo Git is installed. Verifying...
git --version

echo.
echo ====================================================
echo  Configuring Git User
echo ====================================================
echo.

REM Set Git user configuration
git config --global user.name "W. Lachkar"
git config --global user.email "w.lachkar@esisa.ac.ma"

echo Git user configured:
git config --global user.name
git config --global user.email

echo.
echo ====================================================
echo  Initializing Repository
echo ====================================================
echo.

cd /d C:\Users\HUAWEI\Desktop\student

REM Check if already a git repo
if exist .git (
    echo Repository already initialized.
) else (
    echo Initializing new git repository...
    git init
    echo Repository initialized!
)

echo.
echo ====================================================
echo  Staging Files
echo ====================================================
echo.

echo Adding all files...
git add .
echo Files staged!

echo.
echo ====================================================
echo  Creating Commit
echo ====================================================
echo.

REM Check if there are changes to commit
git diff-index --quiet HEAD
if !errorlevel! equ 0 (
    echo No changes to commit. Repository is up to date.
) else (
    echo Creating commit...
    git commit -m "Initial commit - Student Management App Vercel-ready"
    echo Commit created!
)

echo.
echo ====================================================
echo  Setting Up Remote
echo ====================================================
echo.

REM Check if remote already exists
git remote get-url origin >nul 2>&1
if !errorlevel! equ 0 (
    echo Remote 'origin' already configured.
    echo Current remote: 
    git remote get-url origin
) else (
    echo Adding remote repository...
    git remote add origin https://github.com/wlachkar-tech/sm-.git
    echo Remote added!
)

echo.
echo ====================================================
echo  Pushing to GitHub
echo ====================================================
echo.

REM Ensure branch is main
git branch -M main

echo Pushing to GitHub...
git push -u origin main

if !errorlevel! equ 0 (
    echo.
    echo ====================================================
    echo  SUCCESS! Code pushed to GitHub
    echo ====================================================
    echo.
    echo Your code is now at:
    echo https://github.com/wlachkar-tech/sm-
    echo.
    echo Next steps:
    echo 1. Go to https://vercel.com
    echo 2. Click "New Project"
    echo 3. Import the GitHub repository
    echo 4. Set environment variables
    echo 5. Deploy!
    echo.
) else (
    echo.
    echo ====================================================
    echo  ERROR: Push failed
    echo ====================================================
    echo.
    echo This might be due to:
    echo - GitHub authentication (use Personal Access Token)
    echo - Network connection issues
    echo - Repository URL issues
    echo.
    echo To fix:
    echo 1. Create a GitHub PAT: https://github.com/settings/tokens
    echo 2. Use PAT as password when prompted
    echo.
)

pause
endlocal
