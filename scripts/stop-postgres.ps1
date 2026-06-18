# Stop local PostgreSQL
$pg = "$env:LOCALAPPDATA\PostgreSQL\pgsql"
$data = "$env:LOCALAPPDATA\PostgreSQL\data"

& "$pg\bin\pg_ctl.exe" -D $data stop -m fast 2>&1
Write-Host "PostgreSQL stopped." -ForegroundColor Yellow
