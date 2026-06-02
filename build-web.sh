#!/bin/sh
set -e
esbuild web-src/app.jsx \
  --bundle=false \
  --platform=browser \
  --jsx=transform \
  --outfile=Resources/web/app.js
echo "Built Resources/web/app.js"
