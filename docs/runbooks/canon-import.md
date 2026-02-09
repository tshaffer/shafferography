# Canon import runbook (Shafferography)

Date: 2026-02-07

## MongoDB partial unique index on contentHash

```
use pgPhotos

// Optional: see existing indexes first
db.mediaitems.getIndexes()

// Create a partial unique index: unique only when contentHash is a non-empty string
// NOTE: On Atlas, $ne "" in partialFilterExpression can error. If you hit that, use the alternate command below.
db.mediaitems.createIndex(
  { contentHash: 1 },
  {
    name: "uniq_contentHash_when_present",
    unique: true,
    partialFilterExpression: { contentHash: { $type: "string", $ne: "" } }
  }
)

// Alternate (Atlas-compatible) partial filter:
// db.mediaitems.createIndex(
//   { contentHash: 1 },
//   {
//     name: "uniq_contentHash_when_present",
//     unique: true,
//     partialFilterExpression: { contentHash: { $type: "string" } }
//   }
// )

// Verify index exists
db.mediaitems.getIndexes().filter(ix => ix.name === "uniq_contentHash_when_present")

// Verify uniqueness is enforced (safe test)
const TEST_HASH = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"; // 64 a's

db.mediaitems.insertOne({
  uniqueId: "test-uniqueid-1",
  googleMediaItemId: "",
  fileName: "test.jpg",
  filePath: "/tmp/test.jpg",
  url: "http://localhost:8080/canonicalMedia/test.jpg",
  googleAlbumId: null,
  googleAlbumName: null,
  peopleRetrievedFromGoogle: false,
  people: [],
  keywordNodeIds: [],
  photoState: "Unreviewed",
  albumNodeId: "test-album",
  contentHash: TEST_HASH
})

db.mediaitems.insertOne({
  uniqueId: "test-uniqueid-2",
  googleMediaItemId: "",
  fileName: "test2.jpg",
  filePath: "/tmp/test2.jpg",
  url: "http://localhost:8080/canonicalMedia/test2.jpg",
  googleAlbumId: null,
  googleAlbumName: null,
  peopleRetrievedFromGoogle: false,
  people: [],
  keywordNodeIds: [],
  photoState: "Unreviewed",
  albumNodeId: "test-album",
  contentHash: TEST_HASH
})

// Cleanup test docs
db.mediaitems.deleteMany({ contentHash: TEST_HASH })
```

## Canon import CLI

### Build (if needed)

```
cd backend
npm run build
```

### Run (node, built JS)

```
node dist/scripts/importCanon.js \
  --albumNodeId <id> \
  --canonDir "/Volumes/ShMedia/PHOTO_ARCHIVE/CANONICAL/by-hash" \
  --googleAlbumName "My Album" \
  --dryRun \
  --limit 25
```

### Run (ts-node)

```
cd backend
TS_NODE_PROJECT=./tsconfig.json npx ts-node -r tsconfig-paths/register ./src/scripts/importCanon.ts \
  --albumNodeId <id> \
  --canonDir "/Volumes/ShMedia/PHOTO_ARCHIVE/CANONICAL/by-hash" \
  --googleAlbumName "My Album" \
  --dryRun \
  --limit 25
```

### Run (npm script)

```
cd backend
npm run canon-import -- \
  --albumNodeId <id> \
  --canonDir "/Volumes/ShMedia/PHOTO_ARCHIVE/CANONICAL/by-hash" \
  --googleAlbumName "My Album" \
  --dryRun \
  --limit 25
```

### Run (root-level proxy)

```
npm run canon-import -- \
  --albumNodeId <id> \
  --canonDir "/Volumes/ShMedia/PHOTO_ARCHIVE/CANONICAL/by-hash" \
  --googleAlbumName "My Album" \
  --dryRun \
  --limit 25
```

### Run (create or reuse album under parent)

```
npm run canon-import -- \
  --albumName "Imported Feb 2026" \
  --parentAlbumNodeId <parentId> \
  --canonDir "/Volumes/ShMedia/PHOTO_ARCHIVE/CANONICAL/by-hash" \
  --googleAlbumName "My Album" \
  --dryRun \
  --limit 25
```

### Run (root-level proxy)

```
npm run canon-import -- \
  --albumNodeId <id> \
  --canonDir "/Volumes/ShMedia/PHOTO_ARCHIVE/CANONICAL/by-hash" \
  --googleAlbumName "My Album" \
  --dryRun \
  --limit 25
```

Note: Use the root-level proxy when you’re already at the repo root. Use the backend-local command if you need to rely on backend-local node resolution or want to run from `backend/`.
If you see npm warnings about unknown `--albumNodeId` flags, make sure you include the `--` separator after `npm run canon-import`.

Example (real run, edit values):

```
npm run canon-import -- \
  --albumNodeId "3deb1782-e88f-4a08-b693-1afb39c917d3" \
  --canonDir "/Volumes/ShMedia/PHOTO_ARCHIVE/CANONICAL/by-hash" \
  --googleAlbumName "My Album" \
  --dryRun \
  --limit 25
```

### Optional flags

- `--since <ISO>`: only import files with mtime after this timestamp
- `--limit <N>`: cap number of files processed
- `--dryRun`: no DB writes
- `--noGeocode`: skip reverse geocoding (city/state/country)
- `--googleAlbumName <string>`: override googleAlbumName for all imported items
- `--albumNodeId <id>`: attach items to an existing album node
- `--albumName <name>` + `--parentAlbumNodeId <id>`: find or create album under parent and attach items

Notes:
- Canon imports set `googleMediaItemId` to `canon:<hash>`.
- `googleAlbumId` is always null for canon imports; `googleAlbumName` is only set when the CLI flag is provided.
- `--albumNodeId` is mutually exclusive with `--albumName` + `--parentAlbumNodeId`.
- `--albumName` and `--parentAlbumNodeId` must be provided together.

## Static mounts

- `/shafferographyMedia` → `BASE_MEDIA_PATH`
- `/canonicalMedia` → `CANON_MEDIA_PATH`

Verify in browser:
- `http://localhost:8080/canonicalMedia/<sha>.<ext>`
