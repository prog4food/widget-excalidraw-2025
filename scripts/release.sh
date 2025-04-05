#!bin/sh
BIN="${BASH_SOURCE-$0}"
BIN="$(dirname "${BIN}")"
ROOT_DIR="$(cd "${BIN}/.."; pwd)"

# Self-hosting fonts
# https://docs.excalidraw.com/docs/@excalidraw/excalidraw/installation#self-hosting-fonts
[ -d "$ROOT_DIR/dist/public" ] && rm -r "$ROOT_DIR/dist/public"
mkdir -p "$ROOT_DIR/dist/public"
cp -f -r \
  "$ROOT_DIR/node_modules/@excalidraw/excalidraw/dist/prod/fonts" \
  -t "$ROOT_DIR/dist/public/"

# SiYuan widget files
cp -f \
  "$ROOT_DIR/README.md" \
  "$ROOT_DIR/icon.png" \
  "$ROOT_DIR/preview.png" \
  "$ROOT_DIR/widget.json" \
  -t "$ROOT_DIR/dist/"

# Create package.zip
cd ./dist/ && zip -r package.zip . -xpackage.zip
