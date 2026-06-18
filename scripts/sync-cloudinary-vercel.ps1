# Sync Cloudinary env vars to Vercel Production and redeploy.
# Usage:
#   1. Create .env.cloudinary.local with:
#        CLOUDINARY_CLOUD_NAME=your_cloud_name
#        CLOUDINARY_API_KEY=your_api_key
#        CLOUDINARY_API_SECRET=your_api_secret
#   2. Run: .\scripts\sync-cloudinary-vercel.ps1

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $RepoRoot

$envFile = Join-Path $RepoRoot ".env.cloudinary.local"
if (-not (Test-Path $envFile)) {
  Write-Host "Missing $envFile" -ForegroundColor Red
  Write-Host "Create it with CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET"
  exit 1
}

function Get-EnvVal($key) {
  $line = Get-Content $envFile | Where-Object { $_ -match "^$key=" } | Select-Object -First 1
  if (-not $line) { return $null }
  if ($line -match "^$key=`"(.+)`"$") { return $matches[1] }
  if ($line -match "^$key=(.+)$") { return $matches[1].Trim('"') }
  return $null
}

$keys = @("CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET")
foreach ($key in $keys) {
  $val = Get-EnvVal $key
  if (-not $val) {
    Write-Host "$key is missing in .env.cloudinary.local" -ForegroundColor Red
    exit 1
  }
  $val | npx vercel env add $key production --force | Out-Null
  Write-Host "Synced $key to Vercel Production" -ForegroundColor Green
}

Write-Host "`nRedeploying to Vercel production..." -ForegroundColor Cyan
npx vercel --prod --yes
Write-Host "`nDone. Test upload at /dashboard/media on production." -ForegroundColor Green
