<#
PowerShell helper to initialize Git repo and push to GitHub.

Usage:
  1. Install Git: https://git-scm.com/download/win
  2. Create a GitHub Personal Access Token (PAT) with `repo` scope
     and set it in your environment: $env:GITHUB_PAT or set user input when prompted.
  3. Run in project root (PowerShell):
     .\push_to_github.ps1 -RemoteUrl "https://github.com/wlachkar-tech/sm-.git" -Branch "main" -UserEmail "w.lachkar@esisa.ac.ma"

Notes:
  - This script will not install Git for you. It checks for Git and exits if absent.
  - If push fails due to authentication, provide a PAT when prompted or set GITHUB_PAT env var.
#>
param(
    [string]$RemoteUrl = "https://github.com/wlachkar-tech/sm-.git",
    [string]$Branch = "main",
    [string]$UserName = "",
    [string]$UserEmail = "w.lachkar@esisa.ac.ma",
    [switch]$Force
)

function Fail($msg){ Write-Host "ERROR: $msg" -ForegroundColor Red; exit 1 }

# Check git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Fail "Git is not installed. Install Git from https://git-scm.com/download/win and re-run this script."
}

# Ensure in repo root
$root = Get-Location
Write-Host "Working directory: $root"

# Configure user if provided
if ($UserName -ne "") {
    git config --global user.name "$UserName"
    Write-Host "Set git user.name = $UserName"
}
if ($UserEmail -ne "") {
    git config --global user.email "$UserEmail"
    Write-Host "Set git user.email = $UserEmail"
}

# Initialize repo if needed
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..."
    git init || Fail "git init failed"
} else {
    Write-Host "Git repository already initialized."
}

# Ensure branch exists and is checked out
$localBranch = git rev-parse --abbrev-ref HEAD 2>$null
if ($LASTEXITCODE -ne 0 -or $localBranch -eq "HEAD") {
    Write-Host "Creating and switching to branch '$Branch'..."
    git checkout -b $Branch || Fail "Failed to create branch $Branch"
} else {
    Write-Host "Current branch: $localBranch"
    if ($localBranch -ne $Branch) {
        git checkout $Branch -ErrorAction SilentlyContinue
        if ($LASTEXITCODE -ne 0) {
            git checkout -b $Branch || Fail "Failed to switch/create branch $Branch"
        }
    }
}

# Add files and commit
Write-Host "Staging all files..."
git add -A || Fail "git add failed"

# Commit message
$commitMsg = "Initial commit — Student Management App"
# If no commits yet, create one
$hasCommits = git rev-parse --verify HEAD 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating initial commit..."
    git commit -m "$commitMsg" || Fail "git commit failed"
} else {
    Write-Host "Repository already has commits. Creating a new commit with staged changes (if any)."
    git commit -m "$commitMsg" -a || Write-Host "No changes to commit or commit failed (maybe nothing staged)"
}

# Add remote if missing or update
$existingRemote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Adding remote origin -> $RemoteUrl"
    git remote add origin $RemoteUrl || Fail "git remote add failed"
} else {
    Write-Host "Remote 'origin' already set to: $existingRemote"
    if ($existingRemote -ne $RemoteUrl) {
        if ($Force) {
            Write-Host "Updating remote origin to $RemoteUrl"
            git remote set-url origin $RemoteUrl || Fail "git remote set-url failed"
        } else {
            Write-Host "Remote origin differs. Use -Force to overwrite."
        }
    }
}

# Attempt push
Write-Host "Pushing to remote origin/$Branch..."

# Prefer using existing credential helper; if GITHUB_PAT is present, use token URL as fallback
if ($env:GITHUB_PAT) {
    Write-Host "GITHUB_PAT found in environment — using token-based push (temporary URL)."
    # Parse remote to build auth URL
    $authUrl = $RemoteUrl
    if ($authUrl.StartsWith("https://")) {
        # insert token (username optional). Use 'x-access-token' as username placeholder if not provided
        $user = if ($env:GITHUB_USERNAME) { $env:GITHUB_USERNAME } else { "x-access-token" }
        $authUrlWithToken = $authUrl -replace "https://", "https://$user:$($env:GITHUB_PAT)@"
        git push $authUrlWithToken $Branch --set-upstream || Write-Host "Push failed using token URL. Try 'git push origin $Branch' and authenticate interactively."
    } else {
        Write-Host "Remote is not HTTPS; trying standard push."
        git push origin $Branch --set-upstream || Write-Host "Push failed. Authenticate and try again."
    }
} else {
    git push origin $Branch --set-upstream || Write-Host "Push failed. If authentication error, create a GitHub PAT and set it in environment variable GITHUB_PAT, or use Git credential manager."
}

Write-Host "Done. If push failed due to authentication, follow the instructions in the project README to set up a PAT and re-run this script."
