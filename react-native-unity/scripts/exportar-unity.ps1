# Exporta o projeto Unity como unityLibrary para unity/builds/android e prepara para o React Native.
# Uso:
#   powershell -ExecutionPolicy Bypass -File scripts\exportar-unity.ps1                       (jogo padrao: Ctrl FPS)
#   powershell -ExecutionPolicy Bypass -File scripts\exportar-unity.ps1 -UnityProject C:\caminho\do\jogo -UnityVersion 6000.6.8f1
#
# Requisito: o projeto Unity precisa ter Assets/Editor/ExportParaReactNative.cs (copie deste repositorio).
param(
  [string]$UnityProject = "C:\dev\ctrlfps",
  [string]$UnityVersion = "",
  [switch]$Retrato
)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$tmp = Join-Path $root 'unity\export-tmp'
$dest = Join-Path $root 'unity\builds\android'
$log = Join-Path $root 'unity\export.log'

# Usa a mesma versao da Unity com que o projeto foi criado (ProjectSettings/ProjectVersion.txt)
if (-not $UnityVersion) {
  $UnityVersion = ((Get-Content (Join-Path $UnityProject 'ProjectSettings\ProjectVersion.txt') | Select-Object -First 1) -replace 'm_EditorVersion:\s*', '').Trim()
}
$UnityExe = "C:\Program Files\Unity\Hub\Editor\$UnityVersion\Editor\Unity.exe"
if (-not (Test-Path $UnityExe)) { throw "Unity $UnityVersion nao encontrada em $UnityExe" }

$extra = @()
if (-not $Retrato) { $extra += '-landscape' }

Write-Host "Exportando $UnityProject com Unity $UnityVersion (pode levar alguns minutos)..."
& $UnityExe -batchmode -quit -nographics -projectPath $UnityProject `
  -executeMethod ExportParaReactNative.Exportar -exportPath ($tmp -replace '\\','/') @extra -logFile $log | Out-Null
if (-not (Select-String -Path $log -Pattern 'EXPORT RESULT: Succeeded' -Quiet)) {
  Select-String -Path $log -Pattern 'error CS' | Select-Object -First 10 | ForEach-Object { Write-Host $_.Line }
  throw "Falha na exportacao da Unity. Veja $log"
}

if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
Move-Item $tmp $dest

# Remove o intent-filter (exigido pela biblioteca) e o enableOnBackInvokedCallback (conflita com o app)
node (Join-Path $PSScriptRoot 'fix-unity-manifest.js')

Write-Host "OK: unityLibrary atualizada em $dest"
Write-Host "Agora rode:  npx expo prebuild -p android --clean   e depois   npx expo run:android"
