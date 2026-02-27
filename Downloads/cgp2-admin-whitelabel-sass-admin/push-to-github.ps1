param(
    [string]$Remote = 'https://github.com/lijianan733/cgp2-admin-whitelabel-sass-admin.git',
    [string]$Branch = 'master'
)

Set-Location -Path (Split-Path -Path $MyInvocation.MyCommand.Path -Parent)

if (-not (Test-Path ".git")) {
    git init
}

# Stage all changes
git add -A

# Commit if there are staged changes
$hasStaged = git diff --cached --name-only | Select-String . -Quiet
if ($hasStaged) {
    git commit -m "Initial commit"
} else {
    Write-Output "No staged changes to commit. Skipping commit."
}

# Configure remote
# Remove existing origin if present to avoid errors
git remote remove origin 2>$null
git remote add origin $Remote

git branch -M $Branch

# Push (will ask for credentials if needed)
git push -u origin $Branch
