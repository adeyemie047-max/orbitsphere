# OrbitSphere — connect Neon, migrate, seed, sync Vercel env
# Run from repo root: .\scripts\setup-database.ps1

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $RepoRoot

$ProductionUrl = "https://orbitsphere-blue.vercel.app"

function Load-DotEnv($path) {
  if (-not (Test-Path $path)) { return @{} }
  $vars = @{}
  Get-Content $path | ForEach-Object {
    if ($_ -match '^\s*([^#=]+)=(.*)$') {
      $k = $matches[1].Trim()
      $raw = ($_ -split '=', 2)[1].Trim().Trim('"').Trim("'")
      $vars[$k] = $raw
    }
  }
  return $vars
}

function Set-DotEnvLine($path, $key, $value) {
  $lines = if (Test-Path $path) { Get-Content $path } else { @() }
  $escaped = $value -replace '"', '\"'
  $newLine = "$key=`"$escaped`""
  $found = $false
  $out = foreach ($line in $lines) {
    if ($line -match "^\s*$key\s*=") { $found = $true; $newLine } else { $line }
  }
  if (-not $found) { $out += $newLine }
  $out | Set-Content $path -Encoding utf8
}

Write-Host "`n=== OrbitSphere database setup ===`n" -ForegroundColor Cyan

# Step 1: Pull env from Vercel if Neon integration is connected
Write-Host "Checking Vercel environment variables..." -ForegroundColor Cyan
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
$vercelEnv = npx vercel env ls 2>&1 | Out-String
if ($vercelEnv -match "DATABASE_URL") {
  Write-Host "Pulling production env from Vercel into .env.local..." -ForegroundColor Cyan
  npx vercel env pull .env.local --environment=production --yes 2>&1 | Out-Null
} else {
  Write-Host "No DATABASE_URL on Vercel yet." -ForegroundColor Yellow
  Write-Host "  1. Open: https://vercel.com/adeyemie047-maxs-projects/~/integrations/accept-terms/neon"
  Write-Host "  2. Accept Neon terms, then run: npx vercel integration add neon"
  Write-Host "  3. Re-run this script`n"
}

$local = Load-DotEnv ".env.local"

# Map Neon unpooled URL to DIRECT_URL for Prisma
if (-not $local["DIRECT_URL"] -and $local["DATABASE_URL_UNPOOLED"]) {
  Set-DotEnvLine ".env.local" "DIRECT_URL" $local["DATABASE_URL_UNPOOLED"]
  Write-Host "Set DIRECT_URL from DATABASE_URL_UNPOOLED" -ForegroundColor Green
  $local = Load-DotEnv ".env.local"
}

$dbUrl = $local["DATABASE_URL"]
$directUrl = $local["DIRECT_URL"]

if (-not $dbUrl -or $dbUrl -match "localhost") {
  Write-Host "`nDATABASE_URL is missing or still points to localhost." -ForegroundColor Red
  Write-Host "Either connect Neon via Vercel (steps above) or paste Neon URLs into .env.local:"
  Write-Host "  DATABASE_URL  = pooled connection string"
  Write-Host "  DIRECT_URL    = direct (unpooled) connection string`n"
  exit 1
}

if (-not $directUrl) {
  Write-Host "DIRECT_URL is missing. Add Neon's direct/unpooled connection string." -ForegroundColor Red
  exit 1
}

# Ensure auth + site URLs for production seed/build
if (-not $local["AUTH_SECRET"]) {
  $secret = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
  Set-DotEnvLine ".env.local" "AUTH_SECRET" $secret
  Write-Host "Generated AUTH_SECRET" -ForegroundColor Green
}
if (-not $local["CRON_SECRET"]) {
  $cron = [Convert]::ToBase64String((1..24 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
  Set-DotEnvLine ".env.local" "CRON_SECRET" $cron
  Write-Host "Generated CRON_SECRET" -ForegroundColor Green
}
Set-DotEnvLine ".env.local" "AUTH_URL" $ProductionUrl
Set-DotEnvLine ".env.local" "NEXT_PUBLIC_SITE_URL" $ProductionUrl
Set-DotEnvLine ".env.local" "AUTH_TRUST_HOST" "true"

Write-Host "`nInstalling dependencies..." -ForegroundColor Cyan
npm install 2>&1 | Out-Null

Write-Host "Pushing schema to Neon..." -ForegroundColor Cyan
npm run db:push
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Seeding demo articles and editorial users..." -ForegroundColor Cyan
npm run db:seed
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "`n=== Database ready ===" -ForegroundColor Green
Write-Host "Editorial login:"
Write-Host "  admin@orbitsphere.ng / Password123!"

# Push auth env to Vercel if missing
$local = Load-DotEnv ".env.local"
$authKeys = @("AUTH_SECRET", "AUTH_URL", "NEXT_PUBLIC_SITE_URL", "AUTH_TRUST_HOST", "CRON_SECRET", "DIRECT_URL")
Write-Host "`nSyncing auth env to Vercel production..." -ForegroundColor Cyan
foreach ($key in $authKeys) {
  if (-not $local[$key]) { continue }
  if ($vercelEnv -notmatch $key) {
    $local[$key] | npx vercel env add $key production 2>&1 | Out-Null
    Write-Host "  Added $key" -ForegroundColor Green
  }
}

Write-Host "`nRedeploying production..." -ForegroundColor Cyan
npx vercel --prod --yes 2>&1 | Select-Object -Last 5
Write-Host "`nLive: $ProductionUrl/dashboard" -ForegroundColor Green
