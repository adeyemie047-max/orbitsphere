# Open Cloudinary signup, then sync credentials to Vercel when ready.
# Usage:
#   1. Run: .\scripts\setup-cloudinary.ps1
#   2. Sign up (GitHub recommended) and copy API keys
#   3. Save to .env.cloudinary.local (see .env.cloudinary.local.example)
#   4. Run: .\scripts\sync-cloudinary-vercel.ps1

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $RepoRoot

Write-Host "`n=== OrbitSphere Cloudinary setup ===`n" -ForegroundColor Cyan
Write-Host "Opening Cloudinary free signup in your browser..." -ForegroundColor Yellow
Start-Process "https://cloudinary.com/users/register/free"

Write-Host @"

After signup:
  1. Go to https://console.cloudinary.com/settings/api-keys
  2. Copy Cloud name, API Key, and API Secret
  3. Create .env.cloudinary.local (copy from .env.cloudinary.local.example)
  4. Run: .\scripts\sync-cloudinary-vercel.ps1

"@ -ForegroundColor White

$envFile = Join-Path $RepoRoot ".env.cloudinary.local"
if (Test-Path $envFile) {
  Write-Host "Found .env.cloudinary.local — syncing to Vercel now..." -ForegroundColor Green
  & (Join-Path $RepoRoot "scripts\sync-cloudinary-vercel.ps1")
}
