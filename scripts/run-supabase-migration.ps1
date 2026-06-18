# Run OrbitSphere Supabase migrations against LOCAL PostgreSQL
$ErrorActionPreference = "Stop"

$root = Split-Path $PSScriptRoot -Parent
$pgBin = "$env:LOCALAPPDATA\PostgreSQL\pgsql\bin"
$psql = Join-Path $pgBin "psql.exe"

if (-not (Test-Path $psql)) {
  Write-Host "psql not found. Run: npm run postgres:install && npm run postgres:start" -ForegroundColor Red
  exit 1
}

& "$root\scripts\start-postgres.ps1" | Out-Null

$databaseUrl = $env:DATABASE_URL
if (-not $databaseUrl) {
  $envFile = Join-Path $root ".env.local"
  if (Test-Path $envFile) {
    foreach ($line in Get-Content $envFile) {
      if ($line -match '^\s*DATABASE_URL="([^"]+)"') {
        $databaseUrl = $Matches[1]
        break
      }
    }
  }
}

if (-not $databaseUrl) {
  $databaseUrl = "postgresql://postgres@localhost:5432/orbitsphere"
}

$conn = ($databaseUrl -replace '\?.*$', '')

$paths = @()
$bootstrap = Join-Path $root "supabase\local\00000_supabase_bootstrap.sql"
if (Test-Path $bootstrap) { $paths += $bootstrap }

Get-ChildItem (Join-Path $root "supabase\migrations") -Filter "*.sql" |
  Sort-Object Name |
  ForEach-Object { $paths += $_.FullName }

foreach ($path in $paths) {
  $file = Split-Path $path -Leaf
  Write-Host "Running $file ..." -ForegroundColor Cyan
  & $psql $conn -v ON_ERROR_STOP=1 -f $path
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Migration failed: $file" -ForegroundColor Red
    exit $LASTEXITCODE
  }
}

Write-Host ""
Write-Host "Local migrations applied successfully." -ForegroundColor Green
Write-Host "Verify:" -ForegroundColor Yellow
& $psql $conn -c "SELECT name, slug FROM public.categories ORDER BY sort_order;"
& $psql $conn -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;"
