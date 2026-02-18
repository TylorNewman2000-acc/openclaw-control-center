#!/usr/bin/env bash
set -euo pipefail

BASE=${1:-http://127.0.0.1:8780}

echo "[smoke] GET $BASE/health"
resp=$(curl -s --max-time 5 "$BASE/health")

if [[ "$resp" != '{"status":"ok"}' ]]; then
  echo "[smoke] unexpected response: $resp" >&2
  exit 1
fi

echo "[smoke] ok"
