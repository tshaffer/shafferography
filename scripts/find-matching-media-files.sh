#!/usr/bin/env bash
set -euo pipefail

LOCAL_ROOT="/Users/tedshaffer/Pictures/ShafferographyInbox"
MEDIA_ROOT="/Volumes/ShMedia/Shafferography/ShafferographyMedia"

STAMP="$(date +%Y%m%d-%H%M%S)"
OUT_REPORT="./shaferrography-media-match-report-$STAMP.txt"
OUT_DEL_MATCH="./delete-one-or-more-matches-$STAMP.sh"
OUT_DEL_MISMATCH="./delete-file-size-mismatch-CANDIDATES-$STAMP.sh"

INDEX_FILE="$(mktemp /tmp/media-index.XXXXXX)"
ZERO_TMP="$(mktemp /tmp/zero.XXXXXX)"
MATCH_TMP="$(mktemp /tmp/match.XXXXXX)"
MISMATCH_TMP="$(mktemp /tmp/mismatch.XXXXXX)"

MATCH_DEL_LIST="$(mktemp /tmp/match-del.XXXXXX)"
MISMATCH_DEL_LIST="$(mktemp /tmp/mismatch-del.XXXXXX)"

cleanup() {
  rm -f "$INDEX_FILE" "$ZERO_TMP" "$MATCH_TMP" "$MISMATCH_TMP" \
        "$MATCH_DEL_LIST" "$MISMATCH_DEL_LIST"
}
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

echo "Scanning inbox..."

find "$LOCAL_ROOT" -type f ! -name '._*' ! -name '.DS_Store' -print0 |
while IFS= read -r -d '' inbox_file; do
  inbox_base="$(basename "$inbox_file" | tr '[:upper:]' '[:lower:]')"
  inbox_size="$(stat -f%z "$inbox_file")"

  name_matches="$(
    awk -F $'\t' -v n="$inbox_base" '$1==n {print $0}' "$INDEX_FILE"
  )"

  if [ -z "$name_matches" ]; then
    printf "%s\n" "$inbox_file" >> "$ZERO_TMP"
    continue
  fi

  size_matches="$(
    printf "%s\n" "$name_matches" |
      awk -F $'\t' -v sz="$inbox_size" '$2==sz {print $3}'
  )"

  if [ -n "$size_matches" ]; then
    # ---- One or More Matches (name+size) ----
    printf "%s\n" "$inbox_file" >> "$MATCH_DEL_LIST"

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
    # ---- File Size Mismatch (name match but no size match) ----
    printf "%s\n" "$inbox_file" >> "$MISMATCH_DEL_LIST"

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

# -------- Summary counts --------
ZERO_COUNT="$(wc -l < "$ZERO_TMP" | tr -d ' ')"
MATCH_COUNT="$(grep -c '^/' "$MATCH_TMP" || true)"
MISMATCH_COUNT="$(grep -c '^/' "$MISMATCH_TMP" || true)"

# -------- Final report --------
{
  echo "Summary"
  echo "======="
  echo "Zero Matches:        $ZERO_COUNT"
  echo "One or More Matches: $MATCH_COUNT"
  echo "File Size Mismatch:  $MISMATCH_COUNT"
  echo

  echo "Zero Matches"
  echo "============"
  if [ -s "$ZERO_TMP" ]; then cat "$ZERO_TMP"; else echo "(none)"; fi
  echo

  echo "One or More Matches"
  echo "==================="
  if [ -s "$MATCH_TMP" ]; then cat "$MATCH_TMP"; else echo "(none)"; fi
  echo

  echo "File Size Mismatch"
  echo "=================="
  if [ -s "$MISMATCH_TMP" ]; then cat "$MISMATCH_TMP"; else echo "(none)"; fi
} > "$OUT_REPORT"

# -------- Deletion scripts --------
# We generate safe scripts that (a) confirm the path exists, (b) only delete under LOCAL_ROOT,
# and (c) use rm -i by default.

make_safe_rm_script() {
  local in_list="$1"
  local out_script="$2"
  local header="$3"
  local comment_out="$4" # "yes" => prefix rm lines with "# "

  {
    echo "#!/usr/bin/env bash"
    echo "set -euo pipefail"
    echo
    echo "# $header"
    echo "# Generated: $(date)"
    echo "# Root constraint: only deletes files under:"
    echo "#   $LOCAL_ROOT"
    echo
    echo "LOCAL_ROOT=\"$LOCAL_ROOT\""
    echo
    echo "safe_rm() {"
    echo "  local p=\"\$1\""
    echo "  # Must exist"
    echo "  [ -e \"\$p\" ] || { echo \"SKIP (missing): \$p\"; return 0; }"
    echo "  # Must be under LOCAL_ROOT"
    echo "  case \"\$p\" in"
    echo "    \"\$LOCAL_ROOT\"/*) ;;"
    echo "    *) echo \"SKIP (outside LOCAL_ROOT): \$p\"; return 0 ;;"
    echo "  esac"
    echo "  rm -i -- \"\$p\""
    echo "}"
    echo
    echo "echo \"Starting deletes... (interactive rm -i)\""
    echo

    # De-dupe list, preserve order as best as possible:
    # awk '!seen[$0]++' works in macOS awk
    if [ -s "$in_list" ]; then
      awk '!seen[$0]++' "$in_list" | while IFS= read -r p; do
        if [ "$comment_out" = "yes" ]; then
          printf "# safe_rm %q\n" "$p"
        else
          printf "safe_rm %q\n" "$p"
        fi
      done
    else
      echo "# (no entries)"
    fi
    echo
    echo "echo \"Done.\""
  } > "$out_script"

  chmod +x "$out_script"
}

# One-or-more matches: active rm lines
make_safe_rm_script "$MATCH_DEL_LIST" "$OUT_DEL_MATCH" \
  "Delete inbox files that have one or more (name+size) matches in media" "no"

# Size mismatches: commented-out candidates so you can selectively enable
make_safe_rm_script "$MISMATCH_DEL_LIST" "$OUT_DEL_MISMATCH" \
  "CANDIDATES: inbox files with name matches but NO size matches (review before deleting)" "yes"

echo "Wrote report:          $OUT_REPORT"
echo "Wrote delete script:   $OUT_DEL_MATCH"
echo "Wrote candidate script:$OUT_DEL_MISMATCH"
