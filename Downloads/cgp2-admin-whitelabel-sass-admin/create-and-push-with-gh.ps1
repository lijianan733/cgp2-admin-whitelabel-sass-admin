param(
    [string]$Owner = 'lijianan733',
    [string]$Repo = 'cgp2-admin-whitelabel-sass-admin',
    [string]$Visibility = 'public', # public or private
    [string]$Branch = 'master'
)

Set-Location -Path (Split-Path -Path $MyInvocation.MyCommand.Path -Parent)

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "GitHub CLI 'gh' 未安装或不可用。请先安装 https://github.com/cli/cli 。"
    exit 1
}

if (-not (Test-Path ".git")) {
    git init
}

git add -A
$hasStaged = git diff --cached --name-only | Select-String . -Quiet
if ($hasStaged) {
    git commit -m "Initial commit"
}
else {
    Write-Output "No staged changes to commit. Skipping commit."
}

$fullName = "$Owner/$Repo"

# 检查远程仓库是否存在
$exists = $false
try {
    gh repo view $fullName -q "nameWithOwner" > $null 2>&1
    if ($LASTEXITCODE -eq 0) { $exists = $true }
}
catch {
    $exists = $false
}

if (-not $exists) {
    Write-Output "仓库 $fullName 不存在，正在使用 gh 创建并推送。"
    $visFlag = if ($Visibility -eq 'private') { '--private' } else { '--public' }
    gh repo create $fullName $visFlag --source=. --remote=origin --push
    if ($LASTEXITCODE -ne 0) {
        Write-Error "使用 gh 创建或推送失败。请检查 gh 的认证状态或网络。"
        exit 2
    }
}
else {
    Write-Output "仓库 $fullName 已存在，设置远程并推送本地分支。"
    git remote remove origin 2>$null
    git remote add origin "https://github.com/$fullName.git"
    git branch -M $Branch
    git push -u origin $Branch
    if ($LASTEXITCODE -ne 0) {
        Write-Error "推送失败。请根据提示解决权限或冲突问题。"
        exit 3
    }
}

Write-Output "操作完成。已推送到 https://github.com/$fullName.git"