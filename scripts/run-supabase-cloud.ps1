# Push OrbitSphere migrations to Supabase Cloud
$ErrorActionPreference = "Stop"

$root = Split-Path $PSScriptRoot -Parent
$envFile = Join-Path $root ".env.local"

function Read-EnvValue($name) {
  $fromEnv = [Environment]::GetEnvironmentVariable($name)
  if ($fromEnv) { return $fromEnv }
  if (Test-Path $envFile) {
    foreach ($line in Get-Content $envFile) {
      if ($line -match "^\s*$name=`"([^`"]+)`"") { return $Matches[1] }
    }
  }
  return $null
}

$dbUrl = Read-EnvValue "SUPABASE_DB_URL"

$projectRef = Read-EnvValue "SUPABASE_PROJECT_REF"
$accessToken = Read-EnvValue "SUPABASE_ACCESS_TOKEN"

# Prefer Supabase CLI when linked / token available
$supabaseCli = Get-Command supabase -ErrorAction SilentlyContinue
if (-not $supabaseCli) {
  $npxSupabase = Join-Path $root "node_modules\.bin\supabase.cmd"
  if (Test-Path $npxSupabase) { $supabaseCli = $npxSupabase }
}

if ($accessToken -and $projectRef -and $supabaseCli) {
  Write-Host "Pushing migrations via Supabase CLI (project: $projectRef)..." -ForegroundColor Cyan
  $env:SUPABASE_ACCESS_TOKEN = $accessToken
  Push-Location $root
  try {
    & $supabaseCli link --project-ref $projectRef --yes 2>$null
    & $supabaseCli db push
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  } finally {
    Pop-Location
  }
  Write-Host "Supabase Cloud migrations applied via CLI." -ForegroundColor Green
  exit 0
}

if (-not $dbUrl) {
  Write-Host "Supabase Cloud is NOT configured yet." -ForegroundColor Red
  Write-Host ""
  Write-Host "Your schema is only on LOCAL Postgres (npm run db:supabase)." -ForegroundColor Yellow
  Write-Host "Production on Vercel uses Neon, not Supabase." -ForegroundColor Yellow
  Write-Host ""
  Write-Host "To deploy to Supabase Cloud, add to .env.local:" -ForegroundColor Yellow
  Write-Host '  SUPABASE_DB_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"'
  Write-Host '  SUPABASE_PROJECT_REF="your-project-ref"'
  Write-Host '  SUPABASE_ACCESS_TOKEN="your-personal-access-token"'
  Write-Host ""
  Write-Host "Get these from: https://supabase.com/dashboard -> Project Settings"
  Write-Host "GitHub auto-deploy: add the same secrets to your repo, then push main."
  Write-Host "Then run: npm run db:supabase-cloud"
  exit 1
}

if ($dbUrl -match 'localhost|127\.0\.0\.1') {
  Write-Host "SUPABASE_DB_URL points to localhost - that is not Supabase Cloud." -ForegroundColor Red
  Write-Host "Set SUPABASE_DB_URL to your Supabase project connection string." -ForegroundColor Yellow
  exit 1
}

# Fallback: run cloud migrations directly via psql (skip local bootstrap)
$pgBin = "$env:LOCALAPPDATA\PostgreSQL\pgsql\bin\psql.exe"
if (-not (Test-Path $pgBin)) {
  Write-Host "psql not found and Supabase CLI not configured." -ForegroundColor Red
  exit 1
}

$conn = ($dbUrl -replace "\?.*$", "")
$migrationDir = Join-Path $root "supabase\migrations"
$files = Get-ChildItem $migrationDir -Filter "*.sql" | Sort-Object Name

if ($files.Count -eq 0) {
  Write-Host "No migrations found in $migrationDir" -ForegroundColor Red
  exit 1
}

Write-Host "Applying $($files.Count) migration(s) to Supabase Cloud via psql..." -ForegroundColor Cyan
foreach ($file in $files) {
  Write-Host "  -> $($file.Name)" -ForegroundColor Cyan
  & $pgBin $conn -v ON_ERROR_STOP=1 -f $file.FullName
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Migration failed: $($file.Name)" -ForegroundColor Red
    exit $LASTEXITCODE
  }
}

Write-Host "Supabase Cloud migrations applied." -ForegroundColor Green
& $pgBin $conn -c "SELECT name, slug FROM public.categories ORDER BY sort_order LIMIT 5;"
