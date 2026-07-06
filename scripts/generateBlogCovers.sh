#!/usr/bin/env bash
#
# Regenerate all 10 blog covers by CONTINUING an existing ChatGPT conversation
# (no new thread) via ai-browser-bridge. Flat-2D style, unified "nerd" character
# (round glasses, Apple Watch, curly hair), varied outfits, real devices
# (midnight-blue MacBook Air, iPhone), and select brand logos baked in.
#
# Usage:  bash scripts/generateBlogCovers.sh <conversationIdOrUrl>
#   Get the id with:  node .../bridge.js chat list --json
# Prereq: normal Chrome fully quit.
# Out:    client/public/blog/<slug>.png
#
set -uo pipefail

BRIDGE="/Users/yosefhayimsabag/Desktop/Code/ai-browser-bridge/dist/bridge.js"
BRIDGE_REPO="/Users/yosefhayimsabag/Desktop/Code/ai-browser-bridge"
OUT="/Users/yosefhayimsabag/Desktop/Code/portfolio/client/public/blog"
CONV="${1:-}"
if [ -z "$CONV" ]; then echo "!! pass the conversation id/url as arg 1"; exit 2; fi

STYLE="Flat 2D minimal vector illustration, modern editorial style. Simple bold clean shapes, limited muted palette with a single emerald-green accent, generous negative space, soft flat shading, subtle grain. Cartoonish and friendly, NOT 3D, NOT photorealistic. Wide 16:9 composition."
IDENTITY="The character is the SAME young man from the earlier images and reference photos in this conversation: warm olive Mediterranean skin, short dark curly hair faded on the sides, thick dark eyebrows, light stubble, and modern ROUND nerdy glasses, wearing an Apple Watch. Keep his face and round glasses identical."
DEVICES="Any laptop is a midnight-blue (dark navy) MacBook Air; any phone is an iPhone. Keep the devices consistent."
NEG="Avoid random or garbled text and any watermark; only the specific brand logos requested may appear."

mkdir -p "$OUT"

# slug|scene — all 10 posts, in blog.ts order.
POSTS=(
  "security-guard|Redraw the night security-guard cover: he works a lonely night shift, sitting on a plain chair under a single overhead light in a dark empty lobby, wearing a dark security-guard uniform and his round glasses, teaching himself to code on a glowing midnight-blue MacBook Air on his lap, an empty doorway behind him, quiet late-night solitude."
  "ebay-mcp|Redraw the eBay cover: he sits at a desk on a midnight-blue MacBook Air wearing a dark-green hoodie, while a large glowing central hub floats above him displaying the colorful lowercase eBay logo (red-blue-yellow-green letters); hundreds of thin clean green lines branch from the hub to a small friendly robot, and a small glowing 'MCP' Model-Context-Protocol emblem sits nearby. Airy and techy."
  "extensions|Redraw the extensions cover: he leans back relaxed in a graphic-print t-shirt while a floating browser window in front of him runs entirely on its own, little gears, cursors and download arrows moving hands-free around it; his closed midnight-blue MacBook Air rests on the desk."
  "vibe-coding|Redraw the vibe-coding cover: it is 3am, he wears a cozy hoodie, his face lit only by his glowing midnight-blue MacBook Air, cascading green lines of code and a glowing chat bubble beside him, an iPhone and a couple of empty coffee cups on the desk, obsessed and deeply focused in a dark room."
  "trading-bots|Redraw the trading-bots cover: night, he has fallen asleep with his head on a dark desk, wearing a nerdy knit sweater, while a small friendly robot beside him watches glowing red and green candlestick charts on a screen and trades for him; his midnight-blue MacBook Air glows softly."
  "smallbites|Redraw the SmallBites cover: a warm sunlit kitchen, he wears a casual flannel shirt over a tee, proudly holding up an iPhone that shows a clean simple baby-food app interface, a small bowl and spoon on the wooden table, cozy soft morning light."
  "qa-to-frontend|Redraw the first-job cover: he stands happy and belonging inside a bright modern startup office wearing a nerdy graphic tee, a wall sign clearly shows a 'Predicto AI' logo next to a 'BE ALL' company logo, a warm happy-hour vibe around him with a few colleagues, plants and drinks, the emotional feeling of finally getting inside."
  "bolt-asins|Redraw the Bolt ASINs cover: he gently places a rolled-up glowing green blueprint into an old wooden desk drawer, wearing a plain nerdy sweater, one soft dramatic beam of light, dust floating in the air, quiet and nostalgic — putting a project away in a drawer for later."
  "agentic-workflows|Redraw the agentic-workflows cover: he stands beside a friendly glowing AI robot, the two orchestrating a floating neatly-structured diagram of a codebase; three glowing panels behind them clearly display a 'Claude Code' logo, a 'Cursor' logo and a 'Codex' logo; he wears a modern zip hoodie, a calm sense of flow and orchestration."
  "idf-transfer|Redraw the military-to-tech cover as a split composition. LEFT: he is a young Israeli combat soldier in an olive IDF uniform with very short buzzed hair and NO glasses, gripping a Negev light machine gun, an intense locked-in determined expression, a Negev-desert outpost with a watchtower behind him. RIGHT: the same man dissolves into a present-day developer with his curly hair and round glasses, wearing a hoodie, typing code on a midnight-blue MacBook Air with green code panels beside him. Fierce discipline and motivation turning into engineering, muted serious tones with a green accent."
)

first=1
for entry in "${POSTS[@]}"; do
  slug="${entry%%|*}"
  scene="${entry#*|}"
  echo "==> generating: $slug"
  if [ "$first" = "1" ]; then
    # Open the EXISTING conversation and continue it — no new thread. Re-attach
    # the likeness refs (safe: attaching to an existing thread does not fork it).
    node "$BRIDGE" --repo "$BRIDGE_REPO" ask "Generate exactly one image. $scene $IDENTITY $DEVICES $STYLE $NEG" \
      --conversation "$CONV" --attach .cover-refs/hero.png .cover-refs/me.png --images 1 --timeout 300 || {
      echo "    !! first ask failed (Chrome still open, bad conversation id, or session expired?)"; exit 1;
    }
    first=0
  else
    node "$BRIDGE" --repo "$BRIDGE_REPO" ask "Generate exactly one more image. $scene $IDENTITY $DEVICES $STYLE $NEG" \
      --images 1 --timeout 300 || { echo "    !! ask failed for $slug"; }
  fi
done

echo "=== all asks issued; extracting the newest 10 images in order ==="
tmp=/tmp/cover-extract-v2
rm -rf "$tmp"; mkdir -p "$tmp"
node "$BRIDGE" --repo "$BRIDGE_REPO" download --json --out "$tmp" > "$tmp/manifest.json" 2>/dev/null || true

python3 - "$tmp" "$OUT" <<'PY'
import json, os, subprocess, sys
tmp, out = sys.argv[1], sys.argv[2]
slugs = ["security-guard","ebay-mcp","extensions","vibe-coding","trading-bots",
         "smallbites","qa-to-frontend","bolt-asins","agentic-workflows","idf-transfer"]
manifest = json.load(open(os.path.join(tmp, "manifest.json")))
gen = [e for e in manifest if os.path.basename(e["path"]).startswith("Generated image")]
print(f"generated images in conversation: {len(gen)}; taking newest {len(slugs)}")
gen = gen[-len(slugs):]  # this conversation may already hold the v1 covers; keep the latest batch
for slug, e in zip(slugs, gen):
    dst = os.path.join(out, slug + ".png")
    r = subprocess.run(["sips","-s","format","png", e["path"], "--out", dst],
                       capture_output=True, text=True)
    ok = "ok" if r.returncode == 0 and os.path.exists(dst) else "FAIL"
    print(f"  {slug:20s} <- {os.path.basename(e['path'])[:38]:38s} [{ok}]")
if len(gen) != len(slugs):
    print("!! COUNT MISMATCH — verify manually before trusting the mapping")
PY

echo "Done. Covers written to $OUT (browser left open)."
