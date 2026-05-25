# Encode a Supabase DB password for use in DATABASE_URL / DIRECT_URL
# Usage: .\scripts\encode-db-password.ps1
# Then paste the encoded password into your Supabase connection URI on Vercel.

$plain = Read-Host "Enter your Supabase database password (input is hidden)"
$secure = ConvertTo-SecureString $plain -AsPlainText -Force
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try {
  $plain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
} finally {
  [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
}

$encoded = [uri]::EscapeDataString($plain)
Write-Host ""
Write-Host "Encoded password (paste into Supabase URI on Vercel):" -ForegroundColor Green
Write-Host $encoded
Write-Host ""
Write-Host "If your password was:  MyPass@word" -ForegroundColor Yellow
Write-Host "Use in URI as:         MyPass%40word" -ForegroundColor Yellow
