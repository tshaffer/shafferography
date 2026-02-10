# Filename metadata usage report

Date: 2026-02-10

## Summary
- No Exif/XMP/QuickTime filename tags are read or persisted anywhere in this repo.
- All filename usage comes from filesystem basenames, sidecar JSON, or existing DB fields.
- ExifTool pseudo tags like `FileName` / `Directory` are not referenced in code.

## Where filenames come from (write paths)
- `backend/src/services/importLocal.service.ts` — `buildMediaItemFromLocal` sets `fileName` from `path.basename(filePath)`; filePath is the actual filesystem path passed to import.
- `backend/src/scripts/importCanon.ts` — `fileName` uses `sidecar.original.filename` if present, else `sha256 + ext` from canonical path.

## Where filenames are used (read paths)
- Backend
  - `backend/src/controllers/googleUploader.ts` — uses `mediaItem.fileName` for Google Photos upload and status tracking.
  - `backend/src/controllers/peopleMerger.ts` / `backend/src/controllers/app.ts` — uses `mediaItem.fileName` to locate Takeout supplemental metadata JSON.
- Frontend (display only)
  - `frontend/src/components/GridCell.tsx` — displays `mediaItem.fileName`.
  - `frontend/src/components/RightPanel.tsx` — displays `mediaItem.fileName`.
  - `frontend/src/components/PhotoProperties.tsx` — displays `mediaItem.fileName`.
  - `frontend/src/components/LoupeView.tsx` — uses `mediaItem.fileName` for title.

## EXIF / embedded metadata usage
- `exiftool.read(...)` is used for time/GPS/camera data only (`backend/src/services/importLocal.service.ts`, `backend/src/scripts/importCanon.ts`).
- No code reads Exif/XMP/QuickTime filename-related tags (`FileName`, `OriginalFileName`, `DocumentName`, `XMP:FileName`, etc.).
- No code persists “original filename” from embedded metadata; only sidecar JSON provides an “original filename” in canon import.
