#!/usr/bin/env bash
set -euo pipefail

# Config
BRANCH_PREFIX="feature/assets"
BRANCH_NAME="${BRANCH_PREFIX}/assets-build-$(date +%Y%m%d%H%M)"
REMOTE="${REMOTE:-origin}"
RUN_STORYBOOK="${RUN_STORYBOOK:-0}" # set to 1 to run storybook build

echo "Creating branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

echo "Installing dev dependencies (sharp svgo @svgr/core svg-sprite-cli glob)..."
npm install --no-audit --no-fund --save-dev sharp svgo @svgr/core svg-sprite-cli glob

# 1) Run SVGO optimizations (if svgo.config.js present, otherwise default)
if [ -f svgo.config.js ]; then
  echo "Running SVGO on public/icons, public/avatars, public/textures"
  npx svgo -f public/icons -r --config=svgo.config.js || true
  npx svgo -f public/avatars -r --config=svgo.config.js || true
  npx svgo -f public/textures -r --config=svgo.config.js || true
else
  echo "svgo.config.js not found — running basic svgo:"
  npx svgo -f public/icons -r || true
  npx svgo -f public/avatars -r || true
  npx svgo -f public/textures -r || true
fi

# 2) Rasterize avatars & textures (requires tools/rasterize-assets.js)
if [ -f tools/rasterize-assets.js ]; then
  echo "Running rasterization script..."
  node tools/rasterize-assets.js
else
  echo "ERROR: tools/rasterize-assets.js not found. Please add it and re-run."
  exit 1
fi

# 3) Generate React components from icons (svgr)
if [ -f tools/generate-svgr.js ]; then
  echo "Generating React icon components via SVGR..."
  node tools/generate-svgr.js
else
  echo "Warning: tools/generate-svgr.js not found. Skipping SVGR generation."
fi

# 4) Generate SVG sprite for discipline glyphs
# Prefer tools/generate-sprite-svg.js (svgstore, compatible with current Node). svg-sprite-cli often fails on Node 18+ (primordials).
echo "Generating SVG sprite for discipline glyphs..."
mkdir -p public/sprites
if [ -f tools/generate-sprite-svg.js ]; then
  node tools/generate-sprite-svg.js
else
  echo "Warning: tools/generate-sprite-svg.js missing; trying svg-sprite-cli (legacy)"
  npx svg-sprite -s -o public/sprites public/icons/discipline-*.svg || true
fi
if [ -f tools/generate-sprite-css.js ]; then
  node tools/generate-sprite-css.js || true
fi

# 5) Run optional Storybook build for QA
if [ "$RUN_STORYBOOK" = "1" ]; then
  echo "Building Storybook..."
  npx storybook build || true
fi

# 6) Stage generated assets and key folders
echo "Staging generated assets..."
git add public/avatars/raster || true
git add public/textures/raster || true
git add public/sprites || true
git add app/components/icons-react || true
git add public/icons || true
git add public/avatars || true
git add public/textures || true
git add tools/ci-assets-and-commit.sh || true

# 7) Commit
COMMIT_MSG="chore(assets): svgo optimize, rasterize avatars/textures, svgr, sprite $(date +%Y-%m-%d)"
git commit -m "$COMMIT_MSG" || {
  echo "No changes to commit."
}

# 8) Push branch
echo "Pushing branch to remote $REMOTE..."
git push -u "$REMOTE" "$BRANCH_NAME"

echo "Done. Branch pushed: $BRANCH_NAME"
echo "Run PR against main/master and run visual QA (Storybook)."
