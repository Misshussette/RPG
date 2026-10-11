# Importe une archive ZIP fournie par l'utilisateur SANS publier le jeu tiers sur GitHub.
# Exemple : powershell -ExecutionPolicy Bypass -File scripts/import-reference.ps1 -Archive "$env:USERPROFILE\Downloads\eclipse-sources.zip"
param(
    [Parameter(Mandatory=$true)][string]$Archive,
    [string]$AssetsDirectory
)
$ErrorActionPreference = 'Stop'
$project = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$reference = Join-Path $project 'private-reference'
$source = (Resolve-Path -LiteralPath $Archive).Path
if (-not $source.EndsWith('.zip', [StringComparison]::OrdinalIgnoreCase)) { throw 'Archive ZIP attendue.' }
$staging = Join-Path ([System.IO.Path]::GetTempPath()) ('eb-ref-' + [guid]::NewGuid().ToString('N'))
try {
    New-Item -ItemType Directory -Path $staging -Force | Out-Null
    Expand-Archive -LiteralPath $source -DestinationPath $staging -Force
    # Le HTML applicatif complet est le plus grand HTML de l’archive fournie.
    $app = Get-ChildItem $staging -File -Recurse -Filter '*.html' | Sort-Object Length -Descending | Select-Object -First 1
    if (-not $app -or $app.Length -lt 1000000) { throw 'Aucun HTML applicatif complet n’a été trouvé dans cette archive.' }
    New-Item -ItemType Directory -Path $reference -Force | Out-Null
    Copy-Item -LiteralPath $app.FullName -Destination (Join-Path $reference 'index.html') -Force
    $bundledAssets = Join-Path $app.DirectoryName 'assets'
    if (Test-Path $bundledAssets) { Copy-Item -LiteralPath $bundledAssets -Destination (Join-Path $reference 'assets') -Recurse -Force }
    if ($AssetsDirectory) {
        $images = (Resolve-Path -LiteralPath $AssetsDirectory).Path
        if (-not (Test-Path -LiteralPath $images -PathType Container)) { throw 'Le dossier des images est introuvable.' }
        $targetAssets = Join-Path $reference 'assets'
        New-Item -ItemType Directory -Path $targetAssets -Force | Out-Null
        Get-ChildItem -LiteralPath $images -Force | Copy-Item -Destination $targetAssets -Recurse -Force
    }
    Write-Host 'Application de référence importée localement.' -ForegroundColor Green
    Write-Host 'Dossier privé : ' $reference
    if (-not (Test-Path (Join-Path $reference 'assets'))) {
        Write-Warning 'Les images externes ne figurent pas dans ce ZIP. Ajoutez un dossier assets/ séparément si vous en avez un.'
    }
    Write-Host 'Démarrage : npm run reference:dev'
}
finally { Remove-Item -LiteralPath $staging -Force -Recurse -ErrorAction SilentlyContinue }