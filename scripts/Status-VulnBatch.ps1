[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $repoRoot

Write-Host "VulnBatch status" -ForegroundColor Cyan
& docker compose ps
if ($LASTEXITCODE -ne 0) {
    throw "Docker could not read VulnBatch status."
}

try {
    $ready = Invoke-RestMethod -Uri "http://localhost:8787/readyz" -TimeoutSec 3
    if ($ready.status -eq "ready") {
        Write-Host "VulnBatch is ready at http://localhost:8787" -ForegroundColor Green
        exit 0
    }
}
catch {
    # The container status above is the useful fallback.
}

Write-Host "VulnBatch is not ready. Double-click Start VulnBatch.bat." -ForegroundColor Yellow
exit 1
