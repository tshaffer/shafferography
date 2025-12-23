#!/usr/bin/env bash
set -euo pipefail

LOCAL_ROOT="/Users/tedshaffer/Pictures/ShafferographyInbox"
MEDIA_ROOT="/Volumes/ShMedia/Shafferography/ShafferographyMedia"

INDEX_FILE="$(mktemp /tmp/media-index.XXXXXX)"

cleanup() {
  rm -f "$INDEX_FILE"
}
trap cleanup EXIT

echo "Indexing media files..."

# Build index: lowercase filename + tab + relative path
find "$MEDIA_ROOT" -type f ! -name '._*' -print0 |
while IFS= read -r -d '' file; do
  base="$(basename "$file" | tr '[:upper:]' '[:lower:]')"
  rel="${file#$MEDIA_ROOT/}"
  printf "%s\t%s\n" "$base" "$rel" >> "$INDEX_FILE"
done

echo "Scanning local inbox..."

find "$LOCAL_ROOT" -type f ! -name '._*' -print0 |
while IFS= read -r -d '' file; do
  base="$(basename "$file" | tr '[:upper:]' '[:lower:]')"

  matches="$(grep -F $'\t' "$base"$'\t' "$INDEX_FILE" || true)"

  if [ -n "$matches" ]; then
    echo "MATCH: $(basename "$file")"
    echo "$matches" | cut -f2 | sed 's/^/  /'
  fi
done
