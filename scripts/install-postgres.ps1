# Install portable PostgreSQL 17 to %LOCALAPPDATA%\PostgreSQL (no admin required)
$ErrorActionPreference = "Stop"
$base = "$env:LOCALAPPDATA\PostgreSQL"
$pgRoot = "$base\pgsql"
$data = "$base\data"
$log = "$base\postgres.log"
$zip = "$base\postgresql-portable.zip"
$url = "https://get.enterprisedb.com/postgresql/postgresql-17.5-1-windows-x64-binaries.zip"

Write-Host "`n=== OrbitSphere local PostgreSQL install ===`n" -ForegroundColor Cyan

# VC++ runtime (required for postgres.exe on Windows)
winget install Microsoft.VCRedist.2015+.x64 --accept-package-agreements --accept-source-agreements 2>&1 | Out-Null

New-Item -ItemType Directory -Force -Path $base | Out-Null

if (-not (Test-Path "$pgRoot\bin\postgres.exe")) {
  if (-not (Test-Path $zip)) {
    Write-Host "Downloading PostgreSQL 17 binaries (~300 MB)..." -ForegroundColor Cyan
    $ProgressPreference = "SilentlyContinue"
    Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
  }
  Write-Host "Extracting..." -ForegroundColor Cyan
  Expand-Archive -Path $zip -DestinationPath $base -Force
  $extracted = Get-ChildItem $base -Directory | Where-Object { $_.Name -like "pgsql*" } | Select-Object -First 1
  if ($extracted -and $extracted.FullName -ne $pgRoot) {
    if (Test-Path $pgRoot) { Remove-Item -Recurse -Force $pgRoot }
    Move-Item $extracted.FullName $pgRoot
  }
}

if (-not (Test-Path $data)) {
  Write-Host "Initializing database cluster..." -ForegroundColor Cyan
  & "$pgRoot\bin\initdb.exe" -D $data -U postgres -A trust -E UTF8 --locale=C
}

$status = & "$pgRoot\bin\pg_ctl.exe" -D $data status 2>&1 | Out-String
if ($status -notmatch "server is running") {
  & "$pgRoot\bin\pg_ctl.exe" -D $data -l $log start -o "-p 5432"
  Start-Sleep -Seconds 3
}

$dbExists = & "$pgRoot\bin\psql.exe" -U postgres -p 5432 -tc "SELECT 1 FROM pg_database WHERE datname='orbitsphere'" 2>&1
if ($dbExists -notmatch "1") {
  & "$pgRoot\bin\psql.exe" -U postgres -p 5432 -c "CREATE DATABASE orbitsphere;"
}

Write-Host "`n=== Done ===" -ForegroundColor Green
Write-Host "Location: $pgRoot"
Write-Host "Data:     $data"
Write-Host "Port:     5432"
Write-Host "Database: orbitsphere"
Write-Host "User:     postgres (trust auth, no password)"
Write-Host "`nStart: .\scripts\start-postgres.ps1"
Write-Host "Stop:  .\scripts\stop-postgres.ps1"
