#!/usr/bin/env bash
# Safe deploy for Cloudflare CI: ensure OpenNext build output exists before deploy.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

COMPILED_CONFIG=".open-next/.build/open-next.config.edge.mjs"
WORKER=".open-next/worker.js"

if [[ ! -f "$COMPILED_CONFIG" || ! -f "$WORKER" ]]; then
  echo "[cloudflare-deploy] Missing .open-next output — running cf-build..."
  npm run build:cloudflare
fi

echo "[cloudflare-deploy] Deploying to Cloudflare..."
npx opennextjs-cloudflare deploy
