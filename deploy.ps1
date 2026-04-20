# Max Pool — Auto Deploy Script
# Pushes both frontend and backend repos to trigger auto-deployment
# Usage: Right-click -> Run with PowerShell  OR  type: .\deploy.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Max Pool — Auto Deploy" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get commit message
$message = Read-Host "Commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($message)) {
    $message = "update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}

Write-Host ""

# ── FRONTEND (root repo → Netlify) ─────────────────────────────────────────
Write-Host "[1/2] Frontend (HTML / CSS / JS)..." -ForegroundColor Yellow
$frontendChanges = git status --porcelain 2>&1
if ($frontendChanges) {
    git add .
    git commit -m $message 2>&1 | Out-Null
    $pushResult = git push origin main 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Frontend pushed → Netlify deploying..." -ForegroundColor Green
    } else {
        Write-Host "  ✗ Frontend push failed:" -ForegroundColor Red
        Write-Host "    $pushResult" -ForegroundColor Red
    }
} else {
    Write-Host "  ○ No changes" -ForegroundColor Gray
}

Write-Host ""

# ── BACKEND (backend/ repo → Railway) ──────────────────────────────────────
Write-Host "[2/2] Backend (Node.js / API)..." -ForegroundColor Yellow
Set-Location backend
$backendChanges = git status --porcelain 2>&1
if ($backendChanges) {
    git add .
    git commit -m $message 2>&1 | Out-Null
    $pushResult = git push origin main 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Backend pushed → Railway deploying..." -ForegroundColor Green
    } else {
        Write-Host "  ✗ Backend push failed:" -ForegroundColor Red
        Write-Host "    $pushResult" -ForegroundColor Red
    }
} else {
    Write-Host "  ○ No changes" -ForegroundColor Gray
}
Set-Location ..

# ── SUMMARY ────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Done! Live in ~2 minutes:" -ForegroundColor Green
Write-Host "  Site:    https://max-pool-eg.com" -ForegroundColor White
Write-Host "  API:     https://maxpool-production.up.railway.app" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
