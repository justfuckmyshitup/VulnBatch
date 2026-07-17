[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $repoRoot

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw "Docker Desktop is not installed or Docker is not on PATH."
}

Write-Host "Stopping VulnBatch..." -ForegroundColor Cyan
& docker compose stop
if ($LASTEXITCODE -ne 0) {
    throw "Docker could not stop VulnBatch."
}
Write-Host "VulnBatch is stopped. Your data was preserved." -ForegroundColor Green
