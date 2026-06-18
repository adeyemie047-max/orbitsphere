# Start local PostgreSQL (portable install)
$pg = "$env:LOCALAPPDATA\PostgreSQL\pgsql"
$data = "$env:LOCALAPPDATA\PostgreSQL\data"
$log = "$env:LOCALAPPDATA\PostgreSQL\postgres.log"

if (-not (Test-Path "$pg\bin\pg_ctl.exe")) {
  Write-Host "PostgreSQL not installed. Run: .\scripts\install-postgres.ps1" -ForegroundColor Red
  exit 1
}

$status = & "$pg\bin\pg_ctl.exe" -D $data status 2>&1 | Out-String
if ($status -match "server is running") {
  Write-Host "PostgreSQL already running on port 5432" -ForegroundColor Green
  exit 0
}

& "$pg\bin\pg_ctl.exe" -D $data -l $log start -o "-p 5432"
if ($LASTEXITCODE -eq 0) {
  Write-Host "PostgreSQL started on localhost:5432" -ForegroundColor Green
} else {
  Write-Host "Failed to start PostgreSQL. See $log" -ForegroundColor Red
  exit 1
}
