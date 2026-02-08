#!/usr/bin/env bash
set -euo pipefail

# CANDIDATES: inbox files with name matches but NO size matches (review before deleting)
# Generated: Tue Dec 23 07:33:53 PST 2025
# Root constraint: only deletes files under:
#   /Users/tedshaffer/Pictures/ShafferographyInbox

LOCAL_ROOT="/Users/tedshaffer/Pictures/ShafferographyInbox"

safe_rm() {
  local p="$1"
  # Must exist
  [ -e "$p" ] || { echo "SKIP (missing): $p"; return 0; }
  # Must be under LOCAL_ROOT
  case "$p" in
    "$LOCAL_ROOT"/*) ;;
    *) echo "SKIP (outside LOCAL_ROOT): $p"; return 0 ;;
  esac
    rm -v -- "$p"
}

echo "Starting deletes... (interactive rm -i)"

safe_rm /Users/tedshaffer/Pictures/ShafferographyInbox/IMG_2386.HEIC
safe_rm /Users/tedshaffer/Pictures/ShafferographyInbox/IMG_2461.HEIC
safe_rm /Users/tedshaffer/Pictures/ShafferographyInbox/IMG_0082.HEIC
safe_rm /Users/tedshaffer/Pictures/ShafferographyInbox/IMG_2401.HEIC
safe_rm /Users/tedshaffer/Pictures/ShafferographyInbox/IMG_0083.HEIC
safe_rm /Users/tedshaffer/Pictures/ShafferographyInbox/IMG_2440.HEIC
safe_rm /Users/tedshaffer/Pictures/ShafferographyInbox/IMG_2442.HEIC
safe_rm /Users/tedshaffer/Pictures/ShafferographyInbox/IMG_2415.HEIC
safe_rm /Users/tedshaffer/Pictures/ShafferographyInbox/IMG_2383.HEIC
safe_rm /Users/tedshaffer/Pictures/ShafferographyInbox/IMG_2423.HEIC
safe_rm /Users/tedshaffer/Pictures/ShafferographyInbox/IMG_2435.HEIC
safe_rm /Users/tedshaffer/Pictures/ShafferographyInbox/IMG_2399.HEIC
safe_rm /Users/tedshaffer/Pictures/ShafferographyInbox/IMG_2412.HEIC
safe_rm /Users/tedshaffer/Pictures/ShafferographyInbox/IMG_2389.HEIC
safe_rm /Users/tedshaffer/Pictures/ShafferographyInbox/IMG_2413.HEIC
safe_rm /Users/tedshaffer/Pictures/ShafferographyInbox/IMG_2385.HEIC

echo "Done."
