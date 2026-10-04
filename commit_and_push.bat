@echo off
setlocal enabledelayedexpansion

set "MSG=%~1"
if "%MSG%"=="" set "MSG=feat: update ThinkLens reasoning audit engine"

echo [1/3] Staging files...
git add .

git diff-index --quiet HEAD --
if %ERRORLEVEL% NEQ 0 (
    echo [2/3] Committing changes with message: "%MSG%"...
    git commit -m "%MSG%"
) else (
    echo [2/3] No uncommitted changes detected.
)

echo [3/3] Pushing to origin main...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Successfully pushed to GitHub!
) else (
    echo.
    echo Push failed. Please check credentials or network.
)
pause
