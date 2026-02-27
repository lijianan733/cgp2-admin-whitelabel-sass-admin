@echo off
REM 在 Windows CMD 中执行的简易脚本
cd /d %~dp0
IF NOT EXIST .git (
  git init
)

git add -A
for /f "tokens=*" %%i in ('git diff --cached --name-only') do set HASSTAGED=1
if defined HASSTAGED (
  git commit -m "Initial commit"
) else (
  echo No staged changes to commit. Skipping commit.
)

REM 先尝试移除已有 origin（忽略错误）
git remote remove origin 2>nul
git remote add origin https://github.com/lijianan733/cgp2-admin-whitelabel-sass-admin.git

git branch -M master

git push -u origin master
