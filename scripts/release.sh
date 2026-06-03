#!/usr/bin/env bash
# WarmKitty release: build web → archive → notarize → ZIP (Sparkle) + DMG (humans)
# → EdDSA-sign → generate localized appcast → publish to GitHub Releases + Pages.
#
# Prereqs (one-time):
#   xcrun notarytool store-credentials "notarytool-warmkitty" \
#     --apple-id <your-apple-id> --team-id RFW398ARA9 --password <app-specific-password>
#   gh auth login   (account that owns BarryBarrywu/warm-kitty)
#   ./.sparkle-tools/bin/generate_keys --account warmkitty   (once; public key already in Info.plist)
#   brew install gh pandoc
#   GitHub repo → Settings → Pages → Source: main / docs
#
# Usage:
#   ./scripts/release.sh           # release current version from Info.plist
#   ./scripts/release.sh 1.2.0     # bump version first, then release

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

SCHEME="WarmKitty"
CONFIG="Release"
BUILD_DIR="$PROJECT_ROOT/build/release"
ARCHIVE_PATH="$BUILD_DIR/WarmKitty.xcarchive"
EXPORT_DIR="$BUILD_DIR/export"
APP_PATH="$EXPORT_DIR/Warm Kitty.app"
KEYCHAIN_PROFILE="notarytool-warmkitty"
SIGN_IDENTITY="Developer ID Application: BaoLin Wu (RFW398ARA9)"
GH_REPO="BarryBarrywu/warm-kitty"
SPARKLE_ACCOUNT="warmkitty"
INFO_PLIST="$PROJECT_ROOT/Info.plist"

# ---------- 1. Version handling ----------
NEW_VERSION="${1:-}"
if [ -n "$NEW_VERSION" ]; then
  if ! [[ "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Version must be x.y.z (got: $NEW_VERSION)" >&2; exit 1
  fi
  CURRENT_BUILD="$(/usr/libexec/PlistBuddy -c "Print :CFBundleVersion" "$INFO_PLIST")"
  NEW_BUILD=$((CURRENT_BUILD + 1))
  echo "==> Bump to $NEW_VERSION (build $NEW_BUILD)"
  /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $NEW_VERSION" "$INFO_PLIST"
  /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $NEW_BUILD" "$INFO_PLIST"
  xcodegen generate
fi

VERSION="$(/usr/libexec/PlistBuddy -c "Print :CFBundleShortVersionString" "$INFO_PLIST")"
TAG="v$VERSION"
ZIP_PATH="$BUILD_DIR/WarmKitty-${VERSION}.zip"

echo "==> WarmKitty $VERSION → tag $TAG → repo $GH_REPO"

# ---------- 2. Pre-flight ----------
command -v gh >/dev/null     || { echo "gh not installed: brew install gh" >&2; exit 1; }
command -v pandoc >/dev/null || { echo "pandoc not installed: brew install pandoc" >&2; exit 1; }
if gh release view "$TAG" --repo "$GH_REPO" >/dev/null 2>&1; then
  echo "Release $TAG already exists. Bump version first." >&2; exit 1
fi

NOTES_DIR="$PROJECT_ROOT/docs/release-notes/$TAG"
NOTES_EN="$NOTES_DIR/en.md"
[ -f "$NOTES_EN" ] || { echo "Missing $NOTES_EN" >&2; exit 1; }

SPARKLE_BIN="$PROJECT_ROOT/.sparkle-tools/bin"
[ -x "$SPARKLE_BIN/generate_appcast" ] || {
  echo "Sparkle tools missing. Re-vendor .sparkle-tools/ (see plan Task 1)." >&2; exit 1; }

# ---------- 3. Build app ----------
rm -rf "$BUILD_DIR"; mkdir -p "$BUILD_DIR"

echo "==> Archive"
xcodebuild -project WarmKitty.xcodeproj -scheme "$SCHEME" -configuration "$CONFIG" \
  -archivePath "$ARCHIVE_PATH" CODE_SIGN_IDENTITY="$SIGN_IDENTITY" archive
[ -d "$ARCHIVE_PATH" ] || { echo "FAIL: no archive" >&2; exit 1; }

echo "==> Export .app"
cat > "$BUILD_DIR/ExportOptions.plist" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>method</key><string>developer-id</string>
  <key>teamID</key><string>RFW398ARA9</string>
  <key>signingStyle</key><string>manual</string>
  <key>signingCertificate</key><string>Developer ID Application</string>
</dict></plist>
EOF
xcodebuild -exportArchive -archivePath "$ARCHIVE_PATH" -exportPath "$EXPORT_DIR" \
  -exportOptionsPlist "$BUILD_DIR/ExportOptions.plist"

echo "==> Verify signature"
codesign --verify --deep --strict --verbose=2 "$APP_PATH"

# ---------- 4. Notarize the app, staple ----------
echo "==> Zip + notarize app"
ditto -c -k --keepParent "$APP_PATH" "$ZIP_PATH"
xcrun notarytool submit "$ZIP_PATH" --keychain-profile "$KEYCHAIN_PROFILE" --wait
xcrun stapler staple "$APP_PATH"
xcrun stapler validate "$APP_PATH"
echo "==> Repackage stapled .app (this ZIP is the Sparkle enclosure)"
rm "$ZIP_PATH"
ditto -c -k --keepParent "$APP_PATH" "$ZIP_PATH"

# ---------- 4.5. DMG for human download ----------
echo "==> Build + notarize DMG"
DMG_PATH="$BUILD_DIR/WarmKitty.dmg"
DMG_STAGE="$BUILD_DIR/dmg-stage"
rm -rf "$DMG_STAGE" "$DMG_PATH"; mkdir -p "$DMG_STAGE"
cp -R "$APP_PATH" "$DMG_STAGE/"
ln -s /Applications "$DMG_STAGE/Applications"
hdiutil create -volname "Warm Kitty" -srcfolder "$DMG_STAGE" -ov -format UDZO "$DMG_PATH"
codesign --force --sign "$SIGN_IDENTITY" "$DMG_PATH"
xcrun notarytool submit "$DMG_PATH" --keychain-profile "$KEYCHAIN_PROFILE" --wait
xcrun stapler staple "$DMG_PATH"
xcrun stapler validate "$DMG_PATH"

# ---------- 5. Appcast (EdDSA-signed, localized) ----------
echo "==> Build appcast pool"
POOL="$BUILD_DIR/appcast-pool"; mkdir -p "$POOL"
cp "$ZIP_PATH" "$POOL/"
[ -f "$PROJECT_ROOT/docs/appcast.xml" ] && cp "$PROJECT_ROOT/docs/appcast.xml" "$POOL/appcast.xml"

NOTES_HTML="$POOL/WarmKitty-${VERSION}.html"
pandoc -f markdown -t html "$NOTES_EN" -o "$NOTES_HTML"

echo "==> generate_appcast (signs with the 'warmkitty' EdDSA key from Keychain)"
"$SPARKLE_BIN/generate_appcast" \
  --account "$SPARKLE_ACCOUNT" \
  --download-url-prefix "https://github.com/$GH_REPO/releases/download/$TAG/" \
  --link "https://github.com/$GH_REPO/releases/tag/$TAG" \
  "$POOL"

echo "==> Inject localized notes"
LOCALIZED_ARGS=()
for lang in zh-Hans zh-Hant ja; do
  src="$NOTES_DIR/$lang.md"
  [ -f "$src" ] || continue
  html="$POOL/WarmKitty-${VERSION}.${lang}.html"
  pandoc -f markdown -t html "$src" -o "$html"
  LOCALIZED_ARGS+=("$lang=$html")
done
if [ ${#LOCALIZED_ARGS[@]} -gt 0 ]; then
  /usr/bin/python3 "$PROJECT_ROOT/scripts/inject-localized-notes.py" \
    "$POOL/appcast.xml" "$VERSION" "${LOCALIZED_ARGS[@]}"
fi

mkdir -p "$PROJECT_ROOT/docs"
cp "$POOL/appcast.xml" "$PROJECT_ROOT/docs/appcast.xml"

# ---------- 6. Publish ----------
echo "==> Publish GitHub release $TAG"
gh release create "$TAG" "$ZIP_PATH" "$DMG_PATH" \
  --repo "$GH_REPO" --title "Warm Kitty $VERSION" --notes-file "$NOTES_EN" --latest
RELEASE_URL="$(gh release view "$TAG" --repo "$GH_REPO" --json url -q .url)"

echo "==> Commit + push release artifacts"
git add docs/appcast.xml Info.plist WarmKitty.xcodeproj "docs/release-notes/$TAG"
if git diff --cached --quiet; then echo "  (nothing to commit)"; else
  git commit -m "release: $VERSION"
  git push origin main
fi

echo ""
echo "Done."
echo "  GitHub release: $RELEASE_URL"
echo "  Appcast:        https://barrybarrywu.github.io/warm-kitty/appcast.xml"
