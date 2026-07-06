#!/usr/bin/env bash
#
# Generate a new flat-2D hero portrait for the landing section, driving ChatGPT
# through ai-browser-bridge with Joseph's likeness attached. Fresh single-image
# conversation so the download is unambiguous.
#
# Run:  bash scripts/generateHero.sh
# Out:  client/public/images-of-me/hero-2d.png
#
set -uo pipefail

BRIDGE="/Users/yosefhayimsabag/Desktop/Code/ai-browser-bridge/dist/bridge.js"
BRIDGE_REPO="/Users/yosefhayimsabag/Desktop/Code/ai-browser-bridge"
OUTIMG="/Users/yosefhayimsabag/Desktop/Code/portfolio/client/public/images-of-me/hero-2d.png"

PROMPT="Generate exactly one image with a FULLY TRANSPARENT background (PNG with alpha). A clean flat 2D minimal vector illustration of the same young man from the attached reference images: short dark curly hair faded on the sides, thick dark eyebrows, light stubble, warm olive Mediterranean skin. Show him from the waist up, facing forward with a friendly confident slight smile, arms lightly crossed, wearing a clean white henley shirt. Vertical portrait framing, full upper body centered, subject fully cut out on a transparent background, soft flat shading, a single subtle emerald-green accent detail, generous clean negative space. NOT 3D, NOT photorealistic. No background, no scene, no text, no letters, no numbers, no logos, no watermark."

node "$BRIDGE" --repo "$BRIDGE_REPO" ask "$PROMPT" \
  --attach .cover-refs/hero.png .cover-refs/me.png --fresh --images 1 --timeout 300 || {
  echo "!! ask failed (session expired? run: node $BRIDGE login)"; exit 1;
}

tmp="$(mktemp -d)"
node "$BRIDGE" --repo "$BRIDGE_REPO" download --out "$tmp" >/dev/null 2>&1 || true
# Fresh conversation => one generated image; prefer the "Generated image" file.
src="$(find "$tmp" -maxdepth 1 -type f -name 'Generated image*' | head -1)"
[ -z "$src" ] && src="$tmp/$(ls -S "$tmp" 2>/dev/null | head -1)"
if [ -n "$src" ] && [ -f "$src" ]; then
  sips -s format png "$src" --out "$OUTIMG" >/dev/null 2>&1 || cp "$src" "$OUTIMG"
  echo "saved -> $OUTIMG"
else
  echo "!! nothing downloaded"
fi
rm -rf "$tmp"

# Close the bridge browser — this is the final generation step.
node "$BRIDGE" --repo "$BRIDGE_REPO" stop >/dev/null 2>&1 || true
echo "done (bridge stopped)."
