#!bin/sh
BIN="$(dirname "${0}")"
ROOT_DIR="$(cd "${BIN}/.."; pwd)"

# Self-hosting fonts
# https://docs.excalidraw.com/docs/@excalidraw/excalidraw/installation#self-hosting-fonts
echo [..] Copying excalidraw files
[ -d "$ROOT_DIR/dist/public" ] && rm -r "$ROOT_DIR/dist/public"
mkdir -p "$ROOT_DIR/dist/public"
cp -f -r \
  "$ROOT_DIR/node_modules/@excalidraw/excalidraw/dist/prod/fonts" \
  -t "$ROOT_DIR/dist/public/"

# SiYuan widget files
echo [..] Copying widget files
cp -f \
  "$ROOT_DIR/README.md" \
  "$ROOT_DIR/icon.png" \
  "$ROOT_DIR/preview.png" \
  "$ROOT_DIR/widget.json" \
  -t "$ROOT_DIR/dist/"

# Fix './public/' links in README widget files
echo [..] Fixing README.md
sed -i 's!(\./public/!(./!g' "$ROOT_DIR/dist/README.md"

### Not used
# # Get widget version from githib release tag
# [ "$GITHUB_REF_TYPE" = "tag" ] && [ ! -z "$GITHUB_REF_NAME" ] && \
#   WIDGET_VER="${GITHUB_REF_NAME#v}"

# # Set widget version in widget.json
# [ ! -z "$WIDGET_VER" ] && {
#   echo [..] Set version: $WIDGET_VER
#   sed -E -i "s!\"version\": \"[^\"]+\",!\"version\": \"$WIDGET_VER\"!" "$ROOT_DIR/dist/widget.json"
# }

# Creating package.zip
echo [..] package.zip
[ -f "$ROOT_DIR/dist/package.zip" ] && rm -f "$ROOT_DIR/dist/package.zip"
cd "$ROOT_DIR/dist/" && zip -q -r package.zip . -xpackage.zip
echo [Ok]
ls -lah package.zip
