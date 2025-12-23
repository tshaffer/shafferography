#!/usr/bin/env bash
set -euo pipefail

LOCAL_ROOT="/Users/tedshaffer/Pictures/ShafferographyInbox"
MEDIA_ROOT="/Volumes/ShMedia/Shafferography/ShafferographyMedia"

OUT_FILE="./shaferrography-media-match-report-$(date +%Y%m%d-%H%M%S).txt"

INDEX_FILE="$(mktemp /tmp/media-index.XXXXXX)"
ZERO_TMP="$(mktemp /tmp/zero.XXXXXX)"
MATCH_TMP="$(mktemp /tmp/match.XXXXXX)"
MISMATCH_TMP="$(mktemp /tmp/mismatch.XXXXXX)"

cleanup() { rm -f "$INDEX_FILE" "$ZERO_TMP" "$MATCH_TMP" "$MISMATCH_TMP"; }
trap cleanup EXIT

[ -d "$LOCAL_ROOT" ] || { echo "Missing $LOCAL_ROOT" >&2; exit 1; }
[ -d "$MEDIA_ROOT" ] || { echo "Missing $MEDIA_ROOT" >&2; exit 1; }

echo "Indexing media files (name + size)..."

# Index format:
# lowercase_filename<TAB>size_bytes<TAB>relative/path
find "$MEDIA_ROOT" -type f ! -name '._*' ! -name '.DS_Store' -print0 |
while IFS= read -r -d '' file; do
  base="$(basename "$file" | tr '[:upper:]' '[:lower:]')"
  size="$(stat -f%z "$file")"
  rel="${file#$MEDIA_ROOT/}"
  printf "%s\t%s\t%s\n" "$base" "$size" "$rel" >> "$INDEX_FILE"
done

LC_ALL=C sort -o "$INDEX_FILE" "$INDEX_FILE"

echo "Scanning inbox and producing report..."

find "$LOCAL_ROOT" -type f ! -name '._*' ! -name '.DS_Store' -print0 |
while IFS= read -r -d '' inbox_file; do
  inbox_base_orig="$(basename "$inbox_file")"
  inbox_base="$(printf "%s" "$inbox_base_orig" | tr '[:upper:]' '[:lower:]')"
  inbox_size="$(stat -f%z "$inbox_file")"

  # All name matches (exact match on field 1)
  name_matches="$(
    awk -F $'\t' -v n="$inbox_base" '$1==n {print $0}' "$INDEX_FILE"
  )"

  if [ -z "$name_matches" ]; then
    printf "%s\n" "$inbox_file" >> "$ZERO_TMP"
    continue
  fi

  # Size matches among the name matches (field 2 equals inbox_size); output field 3 (relative path)
  size_matches="$(
    printf "%s\n" "$name_matches" |
      awk -F $'\t' -v sz="$inbox_size" '$2==sz {print $3}'
  )"

  if [ -n "$size_matches" ]; then
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
    {
      echo "$inbox_file"
      echo "  inbox size: $inbox_size"
      echo "  name matches (different size):"
      printf "%s\n" "$name_matches" |
        awk -F $'\t' '{print "  " $2 "  " $3}'
      echo
    } >> "$MISMATCH_TMP"
  fi
done

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
