#!/usr/bin/env bash
# Build all three portfolio eras and assemble the unified dist/ the worker serves.
#
#   clientV3 (current)  -> dist/        served at /
#   clientV1 (frozen)   -> dist/v1/     served at /v1/   (Vite base '/v1/')
#   clientV2 (frozen)   -> dist/v2/     served at /v2/   (Vite base '/v2/')
#
# wrangler.jsonc points assets.directory at dist/. Deploy = this script + `wrangler deploy`.
set -euo pipefail
cd "$(dirname "$0")/.."

build_era() {
  local dir="$1" label="$2"
  echo "▶ ${dir} — ${label}"
  ( cd "${dir}" && HUSKY=0 pnpm install --frozen-lockfile --silent && pnpm build )
}

echo "▶ shared — runtime modules used by the worker"
( cd shared && HUSKY=0 pnpm install --frozen-lockfile --silent )

build_era clientV3 "current, served at /"
build_era clientV1 "frozen snapshot, served at /v1/"
build_era clientV2 "frozen snapshot, served at /v2/"

echo "▶ assembling dist/ (v3 at root, v1 + v2 nested)"
rm -rf dist
cp -R clientV3/dist dist
cp -R clientV1/dist dist/v1
cp -R clientV2/dist dist/v2

echo "✓ dist/ ready — / (v3), /v1/ (v1), /v2/ (v2)"
