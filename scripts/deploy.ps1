# OrbitSphere — push to GitHub and deploy to Vercel
# Run from repo root: .\scripts\deploy.ps1

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $RepoRoot

$git = "$env:LOCALAPPDATA\MinGit\cmd\git.exe"
$gh = "$env:LOCALAPPDATA\GitHubCLI\bin\gh.exe"
if (-not (Test-Path $git)) { $git = "git" }
if (-not (Test-Path $gh)) { $gh = "gh" }

Write-Host "`n=== OrbitSphere deploy ===`n" -ForegroundColor Cyan

# GitHub auth
& $gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "GitHub: not logged in. Run: gh auth login -h github.com -p https -w" -ForegroundColor Yellow
  exit 1
}

$remote = & $git remote get-url origin 2>$null
if (-not $remote) {
  Write-Host "Creating GitHub repo orbitsphere (public)..." -ForegroundColor Cyan
  & $gh repo create orbitsphere --public --source=. --remote=origin --push
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} else {
  Write-Host "Pushing to origin/main..." -ForegroundColor Cyan
  & $git push -u origin main
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

$repoUrl = (& $gh repo view --json url -q .url 2>$null)
Write-Host "GitHub: $repoUrl" -ForegroundColor Green

# Vercel auth
npx vercel whoami 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "`nVercel: not logged in. Run: npx vercel login" -ForegroundColor Yellow
  Write-Host "Then re-run this script." -ForegroundColor Yellow
  exit 1
}

Write-Host "`nDeploying to Vercel (production)..." -ForegroundColor Cyan
npx vercel --prod --yes
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "`n=== Done ===" -ForegroundColor Green
Write-Host "Set these in Vercel Project Settings > Environment Variables:" -ForegroundColor Yellow
Write-Host "  DATABASE_URL, DIRECT_URL (Neon PostgreSQL)"
Write-Host "  AUTH_SECRET, AUTH_URL, AUTH_TRUST_HOST=true"
Write-Host "  NEXT_PUBLIC_SITE_URL (your https://*.vercel.app URL)"
Write-Host "  CRON_SECRET"
Write-Host "`nAfter env vars: redeploy and run db:push + db:seed against Neon."
