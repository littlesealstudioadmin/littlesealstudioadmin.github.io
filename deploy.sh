#!/usr/bin/env bash

# 에러 발생 시 즉시 중단
set -e

echo "🧹 Clearing previous build artifacts..."
rm -rf dist

echo "🚀 Building Astro site..."
npm run build

echo "📂 Navigating to dist folder..."
cd dist

# pagefind search index generated inside dist.
# Generate .nojekyll to prevent GitHub Pages from ignoring folders starting with underscore.
touch .nojekyll

echo "🌐 Initializing temporary git repository in dist..."
git init
git checkout -b main
git config http.postBuffer 524288000
git add -A
git commit -m "deploy: static build release ($(date +'%Y-%m-%d %H:%M:%S'))"

echo "📤 Force-pushing static assets to remote main branch..."
git push -f https://github.com/littlesealstudioadmin/littlesealstudioadmin.github.io.git main:main

echo "🎉 Deployment complete!"
