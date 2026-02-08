# googleMediaItemId retrieval — importFromTakeout (current branch)

## Inline call chain (quick reference)
1) `backend/src/routes/routes.ts` → `importFromTakeoutEndpoint`
2) `backend/src/controllers/app.ts` → `importFromTakeout(googleAccessToken, takeout.albumName, takeout.path)`
3) `backend/src/controllers/takeouts.ts`:
   - `getGoogleAlbumDataByName(...)` → `albumId`
   - `getAlbumMediaItemsFromGoogle(googleAccessToken, albumId, ...)` → `googleMediaItemsInAlbum[]`
   - For each Google item: `googleMediaItemId = mediaItemMetadataFromGoogleAlbum.id`
   - Branch:
     - `addAllMediaItemsFromTakeout(...)` if DB empty
     - `mergeMediaItemsFromAlbumWithDb(...)` → `getTakeoutAlbumMediaItems(...)` if DB has items
   - Both branches set `googleMediaItemId` from the Google API media item `id`

## Short diagram
```
POST /api/v1/importFromTakeout
  └─ importFromTakeoutEndpoint (app.ts)
      └─ importFromTakeout (takeouts.ts)
          ├─ getGoogleAlbumDataByName → albumId
          ├─ getAlbumMediaItemsFromGoogle → [GoogleMediaItem]
          │     └─ googleMediaItemId = mediaItemMetadataFromGoogleAlbum.id
          └─ if db empty:
              └─ addAllMediaItemsFromTakeout (sets googleMediaItemId from API id)
             else:
              └─ mergeMediaItemsFromAlbumWithDb
                    └─ getTakeoutAlbumMediaItems (sets googleMediaItemId from API id)
```

## Key code locations
- `backend/src/routes/routes.ts` — route registration
- `backend/src/controllers/app.ts` — `importFromTakeoutEndpoint`
- `backend/src/controllers/takeouts.ts` — `importFromTakeout`, `addAllMediaItemsFromTakeout`, `getTakeoutAlbumMediaItems`
