# Shafferography creationTime / takenAt usage report

Date: 2026-02-06

## mediaItem.creationTime

UI rendering
- `frontend/src/components/RightPanel.tsx` `RightPanel` — used as the primary “Photo taken” timestamp (`mediaItem.creationTime ?? mediaItem.takenAt`). Formatted with `fmtWeekdayMonthDayYearAbbrev` and `fmtTime12h`. Read-only display.

UI behavior
- Sorting: No UI sorting usage found.
- Filtering: No UI filtering usage found.
- Grouping: No UI grouping usage found.

Backend behavior
- Queries/sorting: Used as the default sort key in repository queries: `.sort({ creationTime: -1, uniqueId: 1 })` in `find`, `findForPhotoState`, and `getAllMediaItemsFromDb`. This drives API result order.
- Indexes: No explicit indexes on `creationTime` found in code.
- Endpoint logic: No explicit endpoint logic beyond repo usage.
- Derived computations: None found.

Usages (evidence)
- `frontend/src/components/RightPanel.tsx` `RightPanel` — displayed as “Photo taken” (primary value). Read-only display.
- `backend/src/repositories/mediaItem.repo.ts` `find`, `findForPhotoState`, `getAllMediaItemsFromDb` — used for default sort order. Behavior-driving (query ordering).

## mediaItem.exif.takenAt

UI rendering
- `frontend/src/components/GridCell.tsx` `GridCell` — displayed in grid metadata as `formattedCreationDate` using `dayjs(mediaItem.exif?.takenAt).format('MM/DD/YYYY hh:mm A')`. Read-only display.
- `frontend/src/components/PhotoProperties.tsx` `PhotoProperties` — displayed as a date string via `formatISOString` when present. Read-only display.
- `frontend/src/components/RightPanel.tsx` `RightPanel` — used as fallback for “Photo taken” if `creationTime` is null. Formatted with `fmtWeekdayMonthDayYearAbbrev` and `fmtTime12h`. Read-only display.

UI behavior
- Sorting: No UI sorting usage found.
- Filtering: No UI filtering usage found. (Note: `takenAt` appears in filterable property lists but no filter logic is present in this codebase.)
- Grouping: No UI grouping usage found.

Backend behavior
- Queries/indexes: No backend queries or indexes use `exif.takenAt`.
- Endpoint logic: No explicit endpoint logic beyond DTO mapping.
- Derived computations: None found.

Usages (evidence)
- `frontend/src/components/GridCell.tsx` `GridCell` — displayed in grid metadata. Read-only display.
- `frontend/src/components/PhotoProperties.tsx` `PhotoProperties` — displayed in details panel. Read-only display.
- `frontend/src/components/RightPanel.tsx` `RightPanel` — fallback “Photo taken” display. Read-only display.

## Summary

- `mediaItem.creationTime`: Used for UI display (primary “Photo taken” value) and for backend query sorting. Not used for UI sorting/filtering/grouping beyond display.
- `mediaItem.exif.takenAt`: Used for UI display in multiple components and as a fallback display value. Not used for backend queries or UI sorting/filtering/grouping.

## Notes

- `frontend/src/types/entities.ts` includes `takenAt` in `FilteredMediaItemPropertyNames`, but no active filtering logic referencing it is present in this repo.
