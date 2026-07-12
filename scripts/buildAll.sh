#!/usr/bin/env bash
# Build all portfolio eras and assemble the unified dist/ the worker serves.
#
#   clientV3 (current)  -> dist/        served at /
#   clientV1 (frozen)   -> dist/v1/     served at /v1/   (Vite base '/v1/')
#   clientV2 (frozen)   -> dist/v2/     served at /v2/   (Vite base '/v2/')
#   clientV4 (JTS)      -> dist/v4/     served at /v4/   (Vite base '/v4/')
#
# wrangler.jsonc points assets.directory at dist/. Deploy = this script + `wrangler deploy`.
set -euo pipefail
cd "$(dirname "$0")/.."

build_era() {
  local dir="$1" label="$2"
  echo "▶ ${dir} — ${label}"
  # Prefer lockfile when present; allow first-time installs for new eras.
  if [[ -f "${dir}/pnpm-lock.yaml" ]]; then
    ( cd "${dir}" && HUSKY=0 pnpm install --frozen-lockfile --silent && pnpm build )
  else
    ( cd "${dir}" && HUSKY=0 pnpm install --silent && pnpm build )
  fi
}

echo "▶ shared — runtime modules used by the worker"
( cd shared && HUSKY=0 pnpm install --frozen-lockfile --silent )

build_era clientV3 "current, served at /"
build_era clientV1 "frozen snapshot, served at /v1/"
build_era clientV2 "frozen snapshot, served at /v2/"

echo "▶ clientV4 — JTS studio era, served at /v4/ (media via /media/v4 → R2)"
if [[ -f clientV4/pnpm-lock.yaml ]]; then
  ( cd clientV4 && HUSKY=0 pnpm install --frozen-lockfile --silent && pnpm build:prod )
else
  ( cd clientV4 && HUSKY=0 pnpm install --silent && pnpm build:prod )
fi

echo "▶ assembling dist/ (v3 at root, v1 + v2 + v4 nested)"
rm -rf dist
cp -R clientV3/dist dist
cp -R clientV1/dist dist/v1
cp -R clientV2/dist dist/v2
cp -R clientV4/dist dist/v4

echo "✓ dist/ ready — / (v3), /v1/ (v1), /v2/ (v2), /v4/ (v4)"
