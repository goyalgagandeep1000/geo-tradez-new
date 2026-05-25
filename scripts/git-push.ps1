# One-time push helper — uses PAT securely (not stored in shell history as a command)
param(
  [Parameter(Mandatory = $true)]
  [string]$Token
)

$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')

$pair = "goyalgagandeep1000:$Token"
$bytes = [System.Text.Encoding]::ASCII.GetBytes($pair)
$base64 = [Convert]::ToBase64String($bytes)

git -c credential.helper= -c "http.extraHeader=AUTHORIZATION: basic $base64" push -u origin main

if ($LASTEXITCODE -eq 0) {
  Write-Host 'Push succeeded!' -ForegroundColor Green
} else {
  Write-Host 'Push failed. Check token has repo scope and belongs to goyalgagandeep1000.' -ForegroundColor Red
  exit 1
}
