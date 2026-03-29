# Script to move the generated beach background to the assets folder
$source = "C:\Users\usuario\.gemini\antigravity\brain\038af4d6-6dcd-44e2-80e0-576123d44782\beach_bg_premium_1774797335725.png"
$destination = "c:\Users\usuario\Documents\Renato2D\renato2D\public\assets\beach_bg_premium.png"

if (Test-Path $source) {
    if (!(Test-Path "c:\Users\usuario\Documents\Renato2D\renato2D\public\assets")) {
        New-Item -ItemType Directory -Path "c:\Users\usuario\Documents\Renato2D\renato2D\public\assets" -Force
    }
    Copy-Item -Path $source -Destination $destination -Force
    Write-Host "Asset moved successfully to $destination" -ForegroundColor Green
} else {
    Write-Host "Source file not found at $source" -ForegroundColor Red
}
