#!/usr/bin/env sh
# Envoltorio POSIX: delega en Node (sin jq).
# Uso igual que vercel-sync-env.mjs; exporta VERCEL_TOKEN, VERCEL_PROJECT_ID, etc.

set -e
ROOT="$(CDPATH='' cd -- "$(dirname "$0")/.." && pwd)"
exec node "$ROOT/scripts/vercel-sync-env.mjs" "$@"
