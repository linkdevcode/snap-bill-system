#!/usr/bin/env bash
# Sync main to the Cloudflare deploy mirror (linkdevcode/snap-bill).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
REMOTE="${DEPLOY_REMOTE:-deploy}"
URL="${DEPLOY_REPO_URL:-https://github.com/linkdevcode/snap-bill.git}"
if ! git remote get-url "$REMOTE" &>/dev/null; then
  git remote add "$REMOTE" "$URL"
fi
git push "$REMOTE" main --force
echo "Synced main -> $URL"
