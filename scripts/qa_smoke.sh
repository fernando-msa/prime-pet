#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

check() {
  local msg="$1"
  local cmd="$2"
  if eval "$cmd" >/dev/null; then
    echo "[OK] $msg"
  else
    echo "[FAIL] $msg"
    exit 1
  fi
}

check "manifest.webmanifest existe" "test -f manifest.webmanifest"
check "sw.js existe" "test -f sw.js"
check "index registra service worker" "grep -q \"navigator.serviceWorker.register('./sw.js')\" index.html"
check "client registra service worker" "grep -q \"navigator.serviceWorker.register('./sw.js')\" client.html"
check "admin registra service worker" "grep -q \"navigator.serviceWorker.register('./sw.js')\" admin.html"
check "index possui skip-link" "grep -q \"skip-link\" index.html"
check "admin possui funil local" "grep -q \"Funil local (7 dias)\" admin.html"
check "index possui rastreamento de métricas" "grep -q \"primepet_metrics_events\" index.html"

printf '\nSmoke QA concluído com sucesso.\n'
