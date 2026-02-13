#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${MONGO_URI:-}" ]]; then
  echo "ERROR: MONGO_URI is not set"
  exit 1
fi

if [[ $# -lt 1 ]]; then
  echo "Usage: MONGO_URI='mongodb+srv://...' $0 /path/to/output-dir"
  exit 1
fi

OUTPUT_DIR="$1"

if [[ ! -d "$OUTPUT_DIR" ]]; then
  echo "ERROR: Output dir does not exist: $OUTPUT_DIR"
  exit 1
fi

SHAFFER_MEDIAITEMS_CHUNK_SIZE="${SHAFFER_MEDIAITEMS_CHUNK_SIZE:-500}"

if ! [[ "$SHAFFER_MEDIAITEMS_CHUNK_SIZE" =~ ^[0-9]+$ ]]; then
  echo "ERROR: SHAFFER_MEDIAITEMS_CHUNK_SIZE must be an integer"
  exit 1
fi

EXPORT_COLLECTIONS=(
  albums
  deletedmediaitems
  keywordnodes
  keywords
  mediacontenttree
  tags
  takeouts
  undecidedgroups
  users
  legacyMediaItems
  mediaitems_preRestore_2025-10-05T12-50-36-858Z
)

echo "Backing up Shafferography to: $OUTPUT_DIR"

echo "Exporting non-chunked collections..."
for COLLECTION in "${EXPORT_COLLECTIONS[@]}"; do
  echo "  - $COLLECTION"
  mongoexport \
    --uri "$MONGO_URI" \
    --collection "$COLLECTION" \
    --jsonFormat=canonical \
    --out "$OUTPUT_DIR/${COLLECTION}.json"
done

MEDIAITEMS_DIR="$OUTPUT_DIR/mediaitems"
mkdir -p "$MEDIAITEMS_DIR"

DOC_COUNT_RAW=$(mongosh "$MONGO_URI" --quiet --eval 'print(db.mediaitems.countDocuments({}))')
DOC_COUNT=$(echo "$DOC_COUNT_RAW" | tr -d '[:space:]')

if ! [[ "$DOC_COUNT" =~ ^[0-9]+$ ]]; then
  echo "ERROR: Unable to determine mediaitems count (got: $DOC_COUNT_RAW)"
  exit 1
fi

echo "Exporting mediaitems in chunks (count=$DOC_COUNT, chunkSize=$SHAFFER_MEDIAITEMS_CHUNK_SIZE)..."

CHUNK_INDEX=0
SKIP=0
SORT_SPEC='{ _id: 1 }'

while [[ "$SKIP" -lt "$DOC_COUNT" ]]; do
  CHUNK_INDEX=$((CHUNK_INDEX + 1))
  CHUNK_FILE=$(printf "%s/mediaitems-%06d.json" "$MEDIAITEMS_DIR" "$CHUNK_INDEX")
  echo "  - chunk $CHUNK_INDEX (skip=$SKIP, limit=$SHAFFER_MEDIAITEMS_CHUNK_SIZE)"
  mongoexport \
    --uri "$MONGO_URI" \
    --collection "mediaitems" \
    --sort "$SORT_SPEC" \
    --skip "$SKIP" \
    --limit "$SHAFFER_MEDIAITEMS_CHUNK_SIZE" \
    --jsonFormat=canonical \
    --out "$CHUNK_FILE"
  SKIP=$((SKIP + SHAFFER_MEDIAITEMS_CHUNK_SIZE))
done

EXPORTED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
cat <<MANIFEST > "$MEDIAITEMS_DIR/manifest.json"
{
  "collection": "mediaitems",
  "chunkSize": $SHAFFER_MEDIAITEMS_CHUNK_SIZE,
  "docCount": $DOC_COUNT,
  "exportedAt": "$EXPORTED_AT",
  "sort": { "_id": 1 }
}
MANIFEST

echo "Backup complete."
