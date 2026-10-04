# ThinkLens Commit and Push Script (PowerShell)
param (
    [string]$Message = "feat: update ThinkLens reasoning audit engine"
)

Write-Host "==> Checking git status..." -ForegroundColor Cyan
git status --short

Write-Host "==> Staging all changes..." -ForegroundColor Cyan
git add .

# Check if there is anything to commit
$status = git status --porcelain
if ($status) {
    Write-Host "==> Committing with message: '$Message'..." -ForegroundColor Cyan
    git commit -m "$Message"
} else {
    Write-Host "==> Working directory clean, no new changes to commit." -ForegroundColor Yellow
}

Write-Host "==> Pushing to origin main..." -ForegroundColor Green
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n Successfully pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "`n Push failed. Please check your GitHub credentials or permissions." -ForegroundColor Red
}
