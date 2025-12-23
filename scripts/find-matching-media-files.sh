#!/usr/bin/env bash
set -euo pipefail

LOCAL_ROOT="/Users/tedshaffer/Pictures/ShafferographyInbox"
MEDIA_ROOT="/Volumes/ShMedia/Shafferography/ShafferographyMedia"

# Safety checks
[ -d "$LOCAL_ROOT" ] || { echo "Missing $LOCAL_ROOT"; exit 1; }
[ -d "$MEDIA_ROOT" ] || { echo "Missing $MEDIA_ROOT"; exit 1; }

declare -A media_index

echo "Indexing media files..."

# Build index: filename(lowercase) -> list of relative paths
while IFS= read -r -d '' file; do
  name="$(basename "$file" | tr '[:upper:]' '[:lower:]')"
  rel="${file#$MEDIA_ROOT/}"
  media_index["$name"]+="$rel"$'\n'
done < <(find "$MEDIA_ROOT" -type f ! -name '._*' -print0)

echo "Scanning local inbox..."

# Scan local files and report matches
while IFS= read -r -d '' file; do
  name="$(basename "$file" | tr '[:upper:]' '[:lower:]')"

  if [[ -n "${media_index[$name]:-}" ]]; then
    echo "MATCH: $(basename "$file")"
    printf "%s" "${media_index[$name]}" | sed 's/^/  /'
  fi
done < <(find "$LOCAL_ROOT" -type f ! -name '._*' -print0)
