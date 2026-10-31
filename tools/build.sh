#!/bin/sh
# build.sh: the extension as the zip addons.mozilla.org takes (the version is the one number in extension/manifest.json)
set -e
cd "$(dirname "$0")/.."
V=$(python3 -c "import json;print(json.load(open('extension/manifest.json'))['version'])")
mkdir -p build; rm -f "build/drive-full-path-$V.zip"
(cd extension && zip -q -r -X "../build/drive-full-path-$V.zip" manifest.json content.js icons)
echo "build/drive-full-path-$V.zip"
