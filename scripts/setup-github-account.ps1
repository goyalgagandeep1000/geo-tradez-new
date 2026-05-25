# Clears old GitHub logins and signs in as goyalgagandeep1000 (browser — no PAT needed for daily git push)
$ErrorActionPreference = 'Continue'

Write-Host "`n=== GeoTradez GitHub setup ===" -ForegroundColor Cyan
Write-Host "Account: goyalgagandeep1000`n"

# 1) Erase GCM-stored GitHub credentials
Write-Host "Clearing Git Credential Manager cache..." -ForegroundColor Yellow
@'
protocol=https
host=github.com

'@ | git credential-manager erase 2>$null

git credential-manager github list 2>$null | ForEach-Object {
  if ($_ -match '^\s*(\S+)') {
    $acct = $Matches[1]
    if ($acct -ne 'goyalgagandeep1000') {
      Write-Host "  Removing GCM account: $acct"
      git credential-manager github logout $acct 2>$null
    }
  }
}

# 2) Remove Windows Credential Manager GitHub entries (Visual Studio / old user)
Write-Host "`nRemoving old Windows credentials (if present)..." -ForegroundColor Yellow
$toDelete = @(
  'git:https://github.com',
  'git:https://gagandeepgoyal0001@github.com',
  'GitHub for Visual Studio - https://gagandeepgoyal0001@github.com/',
  'GitHub - https://api.github.com/gagandeepgoyal0001'
)
foreach ($name in $toDelete) {
  Start-Process -FilePath 'cmdkey.exe' -ArgumentList @("/delete:$name") -Wait -NoNewWindow 2>$null | Out-Null
}

# 3) Configure Git to use GCM + correct username
Write-Host "Configuring Git..." -ForegroundColor Yellow
git config --global credential.helper manager
git config --global credential.https://github.com.username goyalgagandeep1000
git config --global init.defaultBranch main

Set-Location (Join-Path $PSScriptRoot '..')
git config --local --unset-all credential.helper 2>$null
git remote set-url origin https://github.com/goyalgagandeep1000/geo-tradez-new.git
git config --local credential.https://github.com.username goyalgagandeep1000

# 4) Browser login (stores credentials — no manual token after this)
Write-Host "`nA browser window will open." -ForegroundColor Green
Write-Host "Sign in as: goyalgagandeep1000 and approve Git access.`n" -ForegroundColor Green
git credential-manager github login --username goyalgagandeep1000 --browser --force

if ($LASTEXITCODE -eq 0) {
  Write-Host "`nLogin OK. Pushing to GitHub..." -ForegroundColor Green
  git push -u origin main
  if ($LASTEXITCODE -eq 0) {
    Write-Host "`nDone! Repo: https://github.com/goyalgagandeep1000/geo-tradez-new" -ForegroundColor Green
  } else {
    Write-Host "`nPush failed. Run: git push -u origin main" -ForegroundColor Red
  }
} else {
  Write-Host "`nLogin cancelled or failed. Run this script again or: git push -u origin main" -ForegroundColor Red
}
