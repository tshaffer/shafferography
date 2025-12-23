#!/usr/bin/env bash
set -euo pipefail

LOCAL_ROOT="/Users/tedshaffer/Pictures/ShafferographyInbox"
MEDIA_ROOT="/Volumes/ShMedia/Shafferography/ShafferographyMedia"

# Output report file (timestamped). Change if you want a fixed name.
OUT_FILE="./shaferrography-media-match-report-$(date +%Y%m%d-%H%M%S).txt"

INDEX_FILE="$(mktemp /tmp/media-index.XXXXXX)"
cleanup() { rm -f "$INDEX_FILE"; }
trap cleanup EXIT

[ -d "$LOCAL_ROOT" ] || { echo "Missing $LOCAL_ROOT" >&2; exit 1; }
[ -d "$MEDIA_ROOT" ] || { echo "Missing $MEDIA_ROOT" >&2; exit 1; }

echo "Indexing media files (name + size)..."

# Index format:
# lowercase_filename<TAB>size_bytes<TAB>relative/path
find "$MEDIA_ROOT" -type f ! -name '._*' -print0 |
while IFS= read -r -d '' file; do
  base="$(basename "$file" | tr '[:upper:]' '[:lower:]')"

  # macOS stat:
  size="$(stat -f%z "$file")"

  rel="${file#$MEDIA_ROOT/}"
  printf "%s\t%s\t%s\n" "$base" "$size" "$rel" >> "$INDEX_FILE"
done

# Optional: sort the index to make grep a bit faster / deterministic
LC_ALL=C sort -o "$INDEX_FILE" "$INDEX_FILE"

ZERO_TMP="$(mktemp /tmp/zero.XXXXXX)"
MATCH_TMP="$(mktemp /tmp/match.XXXXXX)"
MISMATCH_TMP="$(mktemp /tmp/mismatch.XXXXXX)"
cleanup2() { rm -f "$ZERO_TMP" "$MATCH_TMP" "$MISMATCH_TMP"; }
trap cleanup2 EXIT

echo "Scanning inbox and producing report..."

find "$LOCAL_ROOT" -type f ! -name '._*' -print0 |
while IFS= read -r -d '' inbox_file; do
  inbox_base_orig="$(basename "$inbox_file")"
  inbox_base="$(printf "%s" "$inbox_base_orig" | tr '[:upper:]' '[:lower:]')"
  inbox_size="$(stat -f%z "$inbox_file")"

  # All name matches (regardless of size)
  name_matches="$(grep -F $'\t' "$inbox_base"$'\t' "$INDEX_FILE" || true)"

  if [ -z "$name_matches" ]; then
    # No filename matches at all
    printf "%s\n" "$inbox_file" >> "$ZERO_TMP"
    continue
  fi

  # Size matches among name matches: exact size match
  # We match lines: "<name>\t<size>\t<relpath>"
  size_matches="$(printf "%s\n" "$name_matches" | awk -F'\t' -v sz="$inbox_size" '$2==sz {print $3}')"

  if [ -n "$size_matches" ]; then
    # One or more matches by both name and size
    match_count="$(printf "%s\n" "$size_matches" | sed '/^$/d' | wc -l | tr -d ' ')"

    {
      echo "$inbox_file"
      echo "  size: $inbox_size"
      if [ "$match_count" -ge 2 ]; then
        echo "  MULTIPLE MATCHES"
      fi
      printf "%s\n" "$size_matches" | sed 's/^/  /'
      echo
    } >> "$MATCH_TMP"
  else
    # Name matched, but size didn't match any of them
    {
      echo "$inbox_file"
      echo "  inbox size: $inbox_size"
      echo "  name matches (different size):"
      # show candidate sizes + relpaths to help you see what's up
      printf "%s\n" "$name_matches" | awk -F'\t' '{print "  " $2 "  " $3}'
      echo
    } >> "$MISMATCH_TMP"
  fi
done

# Write final report
{
  echo "Zero Matches"
  echo "============"
  if [ -s "$ZERO_TMP" ]; then
    cat "$ZERO_TMP"
  else
    echo "(none)"
  fi
  echo

  echo "One or More Matches"
  echo "==================="
  if [ -s "$MATCH_TMP" ]; then
    cat "$MATCH_TMP"
  else
    echo "(none)"
  fi
  echo

  echo "File Size Mismatch"
  echo "=================="
  if [ -s "$MISMATCH_TMP" ]; then
    cat "$MISMATCH_TMP"
  else
    echo "(none)"
  fi
} > "$OUT_FILE"

echo "Wrote report: $OUT_FILE"
