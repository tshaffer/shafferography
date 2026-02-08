# Shafferography lastModified usage report

Date: 2026-02-06

## mediaItem.lastModified

UI rendering
- `frontend/src/components/RightPanel.tsx` `RightPanel` — used to display “Last modified” date/time in the details panel. It is selected as the preferred source (`mediaItem.lastModified ?? mediaItem.fileModifiedAt`). Read-only display.

UI sorting
- No usages found.

UI filtering
- No usages found.

Backend queries or indexes
- No usages found. (Only schema/DTO mapping and storage assignment exist.)

Background jobs or import logic beyond initial assignment
- No usages found. (Assigned during import/reimport only.)

## mediaItem.exif.fileModifiedAt

UI rendering
- `frontend/src/components/RightPanel.tsx` `RightPanel` — used as a fallback for “Last modified” display if `mediaItem.lastModified` is null. Read-only display.

UI sorting/filtering
- No usages found.

Backend logic
- No usages found beyond import/storage and DTO mapping.

Other UI behavior (non-display)
- `frontend/src/utilities/utilities.ts` `getCacheBustedPhotoUrl` — appended as a cache-busting query param (`v=...`) for image URLs. Affects browser caching behavior.
- `frontend/src/components/GridCell.tsx` `MemoizedGridCell` — used in `React.memo` comparison to control re-rendering when `mediaItem.exif.fileModifiedAt` changes.

## Summary

- `mediaItem.lastModified`: Used only for UI display in `RightPanel`. No evidence of sorting, filtering, backend queries, or background jobs.
- `mediaItem.exif.fileModifiedAt`: Used for UI display fallback, cache-busting, and memoization. No evidence of sorting/filtering or backend logic beyond storage.

## Open questions

- None raised by code; usages are direct and unambiguous.
