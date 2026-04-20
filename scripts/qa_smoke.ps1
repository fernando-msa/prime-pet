$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

function Check-Condition {
  param(
    [string]$Message,
    [scriptblock]$Condition
  )

  if (& $Condition) {
    Write-Host "[OK] $Message"
  } else {
    Write-Host "[FAIL] $Message"
    exit 1
  }
}

function File-Contains {
  param(
    [string]$Path,
    [string]$Pattern
  )

  $fullPath = Join-Path $root $Path
  if (-not (Test-Path $fullPath)) { return $false }
  return [bool](Select-String -Path $fullPath -SimpleMatch -Pattern $Pattern -Quiet)
}

Check-Condition "manifest.webmanifest existe" { Test-Path (Join-Path $root 'manifest.webmanifest') }
Check-Condition "sw.js existe" { Test-Path (Join-Path $root 'sw.js') }
Check-Condition "index registra service worker" { File-Contains -Path 'index.html' -Pattern "navigator.serviceWorker.register('./sw.js')" }
Check-Condition "client registra service worker" { File-Contains -Path 'client.html' -Pattern "navigator.serviceWorker.register('./sw.js')" }
Check-Condition "admin registra service worker" { File-Contains -Path 'admin.html' -Pattern "navigator.serviceWorker.register('./sw.js')" }
Check-Condition "index possui skip-link" { File-Contains -Path 'index.html' -Pattern 'skip-link' }
Check-Condition "admin possui funil local" { File-Contains -Path 'admin.html' -Pattern 'Funil local (7 dias)' }
Check-Condition "index possui rastreamento de métricas" { File-Contains -Path 'index.html' -Pattern 'primepet_metrics_events' }

Write-Host "`nSmoke QA concluído com sucesso."
