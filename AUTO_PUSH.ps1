#requires -RunAsAdministrator

<#
.SYNOPSIS
    Automated Git Installation & GitHub Push Script
    
.DESCRIPTION
    This script:
    1. Checks if Git is installed (installs if not)
    2. Configures Git user
    3. Initializes repository (if needed)
    4. Stages and commits all files
    5. Pushes to GitHub
    
.PARAMETER GitPath
    Path to Git executable (auto-detected if not provided)
    
.EXAMPLE
    .\AUTO_PUSH.ps1
    
.NOTES
    Author: GitHub Copilot
    Date: February 24, 2026
    Requires: Administrator privileges (for Git installation if needed)
#>

param(
    [string]$GitPath = ""
)

function Write-Header {
    param([string]$Text)
    Write-Host ""
    Write-Host "====================================================" -ForegroundColor Cyan
    Write-Host "  $Text" -ForegroundColor Cyan
    Write-Host "====================================================" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Success {
    param([string]$Text)
    Write-Host "✓ $Text" -ForegroundColor Green
}

function Write-Error {
    param([string]$Text)
    Write-Host "✗ ERROR: $Text" -ForegroundColor Red
}

function Write-Info {
    param([string]$Text)
    Write-Host "→ $Text" -ForegroundColor Yellow
}

# ============================================================
# STEP 1: Check & Install Git
# ============================================================

Write-Header "Checking Git Installation"

# Try to detect git
$gitExists = $false
try {
    $gitVersion = Invoke-Expression "git --version" 2>$null
    if ($gitVersion) {
        Write-Success "Git is installed"
        Write-Info $gitVersion
        $gitExists = $true
    }
} catch {
    Write-Info "Git not found in system PATH"
}

if (-not $gitExists) {
    Write-Header "Installing Git"
    
    Write-Info "Attempting to install Git via Winget..."
    try {
        winget install Git.Git -e --silent
        Start-Sleep -Seconds 2
        $gitVersion = Invoke-Expression "git --version" 2>$null
        if ($gitVersion) {
            Write-Success "Git installed successfully!"
            Write-Info $gitVersion
        }
    } catch {
        Write-Error "Winget installation failed"
        
        Write-Info "Attempting to install Git via Chocolatey..."
        try {
            choco install git -y
            Start-Sleep -Seconds 2
            $gitVersion = Invoke-Expression "git --version" 2>$null
            if ($gitVersion) {
                Write-Success "Git installed successfully!"
                Write-Info $gitVersion
            }
        } catch {
            Write-Error "Could not auto-install Git"
            Write-Host ""
            Write-Host "Please install Git manually:" -ForegroundColor Yellow
            Write-Host "  https://git-scm.com/download/win" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Then run this script again." -ForegroundColor Yellow
            Read-Host "Press Enter to exit"
            exit 1
        }
    }
}

# ============================================================
# STEP 2: Configure Git User
# ============================================================

Write-Header "Configuring Git User"

Write-Info "Setting git user.name to: W. Lachkar"
git config --global user.name "W. Lachkar"

Write-Info "Setting git user.email to: w.lachkar@esisa.ac.ma"
git config --global user.email "w.lachkar@esisa.ac.ma"

Write-Success "Git user configured"

# ============================================================
# STEP 3: Navigate to Project
# ============================================================

Write-Header "Navigating to Project Directory"

$projectPath = "C:\Users\HUAWEI\Desktop\student"
if (Test-Path $projectPath) {
    Set-Location $projectPath
    Write-Success "Current directory: $projectPath"
} else {
    Write-Error "Project directory not found: $projectPath"
    Read-Host "Press Enter to exit"
    exit 1
}

# ============================================================
# STEP 4: Initialize Repository
# ============================================================

Write-Header "Initializing Repository"

if (Test-Path ".git") {
    Write-Info "Repository already initialized"
} else {
    Write-Info "Initializing new git repository..."
    git init
    Write-Success "Repository initialized"
}

# ============================================================
# STEP 5: Stage Files
# ============================================================

Write-Header "Staging Files"

Write-Info "Adding all files..."
git add .
Write-Success "All files staged"

# Show what will be committed
Write-Info "Files to be committed:"
git diff-index --cached HEAD --name-only | ForEach-Object {
    Write-Host "  + $_"
}

# ============================================================
# STEP 6: Create Commit
# ============================================================

Write-Header "Creating Commit"

$hasChanges = -not (git diff-index --quiet --cached HEAD)

if ($hasChanges) {
    Write-Info "Creating commit..."
    git commit -m "Initial commit - Student Management App Vercel-ready"
    Write-Success "Commit created"
} else {
    Write-Info "No changes to commit"
}

# ============================================================
# STEP 7: Configure Remote
# ============================================================

Write-Header "Configuring Remote Repository"

$remoteUrl = "https://github.com/wlachkar-tech/sm-.git"

try {
    $currentRemote = git remote get-url origin 2>$null
    if ($currentRemote) {
        Write-Info "Remote 'origin' already configured"
        Write-Info "Current URL: $currentRemote"
    } else {
        throw "No remote found"
    }
} catch {
    Write-Info "Adding remote repository: $remoteUrl"
    git remote add origin $remoteUrl
    Write-Success "Remote 'origin' added"
}

# ============================================================
# STEP 8: Set Branch
# ============================================================

Write-Header "Configuring Branch"

Write-Info "Setting branch to: main"
git branch -M main
Write-Success "Branch set to main"

# ============================================================
# STEP 9: Push to GitHub
# ============================================================

Write-Header "Pushing to GitHub"

Write-Info "Pushing code to GitHub..."
Write-Info "This may ask for authentication (GitHub PAT or credentials)"
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Header "SUCCESS - Code Pushed to GitHub!"
    
    Write-Host "" 
    Write-Host "✓ Your code is now on GitHub:" -ForegroundColor Green
    Write-Host "  https://github.com/wlachkar-tech/sm-" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Go to https://vercel.com" -ForegroundColor White
    Write-Host "2. Click 'New Project'" -ForegroundColor White
    Write-Host "3. Import GitHub repository: wlachkar-tech/sm-" -ForegroundColor White
    Write-Host "4. Set environment variables:" -ForegroundColor White
    Write-Host "   - NEXTAUTH_URL = https://your-project.vercel.app" -ForegroundColor Gray
    Write-Host "   - NEXTAUTH_SECRET = (run: openssl rand -hex 32)" -ForegroundColor Gray
    Write-Host "5. Click Deploy" -ForegroundColor White
    Write-Host ""
    Write-Host "Estimated deployment time: 5-10 minutes" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Error "Push failed"
    Write-Host ""
    Write-Host "Possible causes:" -ForegroundColor Yellow
    Write-Host "1. Authentication issue - need GitHub PAT" -ForegroundColor White
    Write-Host "2. Network connectivity issue" -ForegroundColor White
    Write-Host "3. Remote URL issue" -ForegroundColor White
    Write-Host ""
    Write-Host "To fix:" -ForegroundColor Yellow
    Write-Host "1. Create GitHub PAT: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "   - Select 'repo' scope" -ForegroundColor Gray
    Write-Host "2. When asked for password, use the PAT instead" -ForegroundColor White
    Write-Host "3. Run this script again" -ForegroundColor White
}

Write-Host ""
Read-Host "Press Enter to exit"
