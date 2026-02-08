# Dedupe canonical contentHash extraction

## Answer

No, the canonical path layout present in this repo does not embed a stable content hash. You must compute the hash from bytes (or read it from a manifest) to obtain a contentHash.

## Canonical Layout Observed

From the only canonical-ish layout artifacts in this repo (the dedupe matching scripts + reports):

- Media root is a fixed directory, and files are stored by human album-like folders and original filenames.
- There is no `by-hash/` (or similar) sharding directory, and filenames are not hashes.

Example tree (observed pattern):

```
/Volumes/ShMedia/Shafferography/ShafferographyMedia/
  Southwest Fall 2025/
    Sedona/
      IMG_2703.HEIC
    Zion/
      IMG_2538.HEIC
  Baja 2025/
    Shaffer Media/
      IMG_6111.heic
```

## Extraction Rule

No deterministic extraction rule exists from the path alone.

- Input: absolute canonical path
- Output: `contentHash` (string)
- Rule: return `null` (or equivalent) because the path does not encode a hash
- Validation: not applicable
- Error handling: return `null` and log “hash not embedded in canonical path” (do not throw)

Optional helper (non-production snippet):

```ts
// Returns null because no hash is embedded in the canonical path layout.
export function contentHashFromCanonicalPath(canonicalPath: string): string | null {
  void canonicalPath;
  return null;
}
```

## Examples

These are real paths derived from the repo’s dedupe report plus the script’s `MEDIA_ROOT` value. None contain an embedded hash; therefore all map to `null`.

- `/Volumes/ShMedia/Shafferography/ShafferographyMedia/Southwest Fall 2025/Sedona/IMG_2703.HEIC` → `null`
- `/Volumes/ShMedia/Shafferography/ShafferographyMedia/Southwest Fall 2025/Zion/IMG_2538.HEIC` → `null`
- `/Volumes/ShMedia/Shafferography/ShafferographyMedia/Southwest Fall 2025/Sedona/IMG_2736 2.HEIC` → `null`
- `/Volumes/ShMedia/Shafferography/ShafferographyMedia/Southwest Fall 2025/Zion/IMG_2492.HEIC` → `null`
- `/Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_6111.heic` → `null`

## Where This Comes From (Code References)

- `scripts/find-matching-media-files.sh` (defines `MEDIA_ROOT` and uses relative paths from it)
- `scripts/shaferrography-media-match-report-20251223-063133.txt` (contains relative media paths under `MEDIA_ROOT`)

## Notes on Ambiguity

No code in this repo constructs a canonical `by-hash` layout or embeds a hash in the filename. If another repo (e.g., a separate “photo archiver” project) owns the canonicalization, that would be the authoritative source for a hash-embedded layout.
