// repositories/mediaItem.repo.ts
import { FilterQuery } from 'mongoose';
import { PhotoState } from '../types';

import type { MediaItemStored } from '../models/mediaItem.model';
import type { CreateMediaItemInput, MediaItemDTO } from '../domain/mediaItem.types';

import { connection } from "../config"; // your already-initialized, connected mongoose Connection
import { getMediaItemModel } from '../models/getMediaItemModel';

import type { StringToNumberLUT } from '../domain/stats.types';

type ToDTOOpts = { includeExif?: boolean; includeExifMeta?: boolean };

function toDTO(doc: MediaItemStored, opts?: ToDTOOpts): MediaItemDTO {
  const exif: any = doc.exif || {};
  const dto: MediaItemDTO = {
    uniqueId: doc.uniqueId,
    googleMediaItemId: doc.googleMediaItemId,
    fileName: doc.fileName,
    googleAlbumId: doc.googleAlbumId,
    googleAlbumName: doc.googleAlbumName,

    creationTime: doc.creationTime ?? null,
    lastModified: doc.lastModified ?? null,

    width: exif.imageWidth ?? null,
    height: exif.imageHeight ?? null,
    orientation: exif.orientation ?? 0,
    takenAt: exif.takenAt ?? null,
    fileModifiedAt: exif.fileModifiedAt ?? null,
    exifModifiedAt: exif.exifModifiedAt ?? null,

    filePath: doc.filePath ?? '',
    url: doc.url ?? null,
    mimeType: doc.mimeType ?? null,

    photoState: doc.photoState,
    albumNodeId: doc.albumNodeId,
    undecidedGroupId: doc.undecidedGroupId ?? null,
    notes: doc.notes ?? null,
    keywordNodeIds: doc.keywordNodeIds ?? [],
    peopleRetrievedFromGoogle: !!doc.peopleRetrievedFromGoogle,
    people: (doc.people || []).map(p => ({ name: p?.name ?? '' })),
  };

  if (opts?.includeExif) dto.exif = doc.exif as any;
  if (opts?.includeExifMeta && doc.exifMeta) dto.exifMeta = doc.exifMeta as any;

  return dto;
}

/**
 * Insert a new media item. If uniqueId already exists, this throws by default.
 * If you prefer “insert-or-return-existing”, see the upsertInsertOrGet() below.
 */
export async function insert(
  create: CreateMediaItemInput,
  opts?: ToDTOOpts
): Promise<MediaItemDTO> {
  // Map simple string[] people into schema’s [{ name }]
  const peopleArray = (create.people ?? []).map((name) => ({ name }));

  const stored = await getMediaItemModel(connection).create({
    ...create,
    people: peopleArray,
  });

  return toDTO(stored.toObject(), opts);
}

/** Fetch by uniqueId. */
export async function getMediaItemFromDb(uniqueId: string, opts?: ToDTOOpts): Promise<MediaItemDTO | null> {
  const projection =
    opts?.includeExif || opts?.includeExifMeta ? {} : { exif: 0, exifMeta: 0 };
  const doc = await getMediaItemModel(connection).findOne({ uniqueId }, projection).lean<MediaItemStored>().exec();
  return doc ? toDTO(doc, opts) : null;
}

/** Generic find with optional projection (kept simple). */
export async function find(
  filter: FilterQuery<MediaItemStored>,
  options?: {
    includeExif?: boolean;
    limit?: number;
    skip?: number;
    sort?: Record<string, 1 | -1>;
  }
): Promise<MediaItemDTO[]> {
  const projection = options?.includeExif ? undefined : { exif: 0, exifMeta: 0 };

  const query = getMediaItemModel(connection).find(filter, projection)
    .sort(options?.sort ?? { creationTime: -1, uniqueId: 1 })
    .limit(options?.limit ?? 100);

  if (options?.skip != null) query.skip(options.skip); // allow 0

  const docs: MediaItemStored[] = await query.lean().exec();
  return docs.map(d => toDTO(d, { includeExif: options?.includeExif }));
}

/** Example convenience: find by album with pagination. */
export async function listByAlbum(
  albumNodeId: string,
  options?: { includeExif?: boolean; pageSize?: number; page?: number }
): Promise<MediaItemDTO[]> {
  const pageSize = options?.pageSize ?? 100;
  const skip = ((options?.page ?? 1) - 1) * pageSize;
  return find({ albumNodeId }, { includeExif: options?.includeExif, limit: pageSize, skip });
}

/**
 * Optional helper if you’d rather not throw on duplicate uniqueId.
 * Tries to insert; on duplicate key (11000), returns the existing document.
 */
export async function upsertInsertOrGet(
  create: CreateMediaItemInput,
  opts?: ToDTOOpts
): Promise<MediaItemDTO> {
  try {
    return await insert(create, opts);
  } catch (err: any) {
    if (err && err.code === 11000) {
      const existing = await getMediaItemFromDb(create.uniqueId, opts);
      if (existing) return existing;
    }
    throw err;
  }
}

/**
 * Counts of media items grouped by photoState.
 * Returns: { [photoState]: count }
 */
export async function countByPhotoState(): Promise<StringToNumberLUT> {
  const rows: Array<{ photoState: string; count: number }> = await getMediaItemModel(connection).aggregate([
    { $group: { _id: '$photoState', count: { $sum: 1 } } },
    { $project: { _id: 0, photoState: '$_id', count: 1 } },
  ]);

  const lut: StringToNumberLUT = {};
  for (const { photoState, count } of rows) lut[photoState] = count;
  return lut;
}

/**
 * Counts of media items grouped by albumNodeId.
 * Returns: { [albumNodeId]: count }
 */
export async function countByAlbumNode(): Promise<StringToNumberLUT> {
  const rows: Array<{ albumNodeId: string; count: number }> = await getMediaItemModel(connection).aggregate([
    { $group: { _id: '$albumNodeId', count: { $sum: 1 } } },
    { $project: { _id: 0, albumNodeId: '$_id', count: 1 } },
  ]);

  const lut: StringToNumberLUT = {};
  for (const { albumNodeId, count } of rows) lut[albumNodeId] = count;
  return lut;
}

/**
 * Nested counts by albumNodeId then photoState.
 * Returns: { [albumNodeId]: { [photoState]: count } }
 */
export async function countByPhotoStateByAlbumNode(): Promise<Record<string, Record<string, number>>> {
  const rows: Array<{ albumNodeId: string; photoState: string; count: number }> = await getMediaItemModel(connection).aggregate([
    { $group: { _id: { albumNodeId: '$albumNodeId', photoState: '$photoState' }, count: { $sum: 1 } } },
    { $project: { _id: 0, albumNodeId: '$_id.albumNodeId', photoState: '$_id.photoState', count: 1 } },
  ]);

  const mapping: Record<string, Record<string, number>> = {};
  for (const { albumNodeId, photoState, count } of rows) {
    if (!mapping[albumNodeId]) mapping[albumNodeId] = {};
    mapping[albumNodeId][photoState] = count;
  }
  return mapping;
}

// existing toDTO(...) should already be here in this repo

type FindForPhotoStateParams = {
  albumNodeIds: string[];
  photoStates: PhotoState[];
  groupUndecidedPhotos: boolean;
  undecidedGroupIds: string[];
};

/**
 * Find media items filtered by albumNodeIds + photoStates.
 * If photoStates includes 'Undecided' and groupUndecidedPhotos=true,
 * only include Undecided items whose undecidedGroupId is in undecidedGroupIds.
 */
export async function findForPhotoState(params: FindForPhotoStateParams): Promise<MediaItemDTO[]> {
  const { albumNodeIds, photoStates, groupUndecidedPhotos, undecidedGroupIds } = params;

  const baseConditions: any[] = [
    { albumNodeId: { $in: albumNodeIds } },
    { photoState: { $in: photoStates } },
  ];

  // preserve your original grouping logic
  if (photoStates.includes(PhotoState.Undecided) && groupUndecidedPhotos) {
    baseConditions.push({
      $or: [
        { photoState: { $ne: PhotoState.Undecided } },
        {
          $and: [
            { photoState: PhotoState.Undecided },
            { undecidedGroupId: { $in: undecidedGroupIds } },
          ],
        },
      ],
    });
  }

  const filter: FilterQuery<MediaItemStored> = { $and: baseConditions };

  const docs: MediaItemStored[] = await getMediaItemModel(connection)
    .find(filter, { /* projection: keep exif out if you want: exif: 0, exifMeta: 0 */ })
    .sort({ creationTime: -1, uniqueId: 1 })
    .lean()
    .exec();

  return docs.map(d => toDTO(d, { includeExif: false }));
}

/** getAllMediaItemsFromDb -> repo.findAll */
export async function getAllMediaItemsFromDb(opts?: ToDTOOpts): Promise<MediaItemDTO[]> {
  const projection = opts?.includeExif || opts?.includeExifMeta ? {} : { exif: 0, exifMeta: 0 };
  const docs = await getMediaItemModel(connection).find({}, projection).sort({ creationTime: -1, uniqueId: 1 }).lean<MediaItemStored[]>().exec();
  return docs.map(d => toDTO(d, opts));
}

/** updateMediaItemFieldsInDb -> repo.updateFieldsByUniqueId ($set partial) */
export async function updateMediaItemFieldsInDb(
  uniqueId: string,
  updates: Partial<MediaItemDTO>
): Promise<MediaItemDTO | null> {
  const doc = await getMediaItemModel(connection).findOneAndUpdate(
    { uniqueId },
    { $set: updates },
    { new: true }
  ).lean<MediaItemStored>().exec();

  return doc ? toDTO(doc) : null;
}

/** updateSingleMediaItemFieldsInDb -> same as above; kept for clarity */
export const updateSingleMediaItemFieldsInDb = updateMediaItemFieldsInDb;

/** updateMediaItemsFieldsInDb -> repo.updateManyFields */
export async function updateMediaItemsFieldsInDb(uniqueIds: string[], updates: Partial<MediaItemDTO>) {
  return getMediaItemModel(connection).updateMany(
    { uniqueId: { $in: uniqueIds } },
    { $set: updates }
  ).exec();
}
/** addMediaItemToMediaItemsDBTable -> repo.insertOneFromDTO
 * NOTE: in the new flow, inserts usually come from CreateMediaItem (service).
 * This keeps a DTO-based insert for backwards compatibility.
 */
export async function addMediaItemToMediaItemsDBTable(dto: MediaItemDTO): Promise<string | undefined> {
  try {
    // Minimal mapping: keep DTO fields that match stored model
    const storedLike: Partial<MediaItemStored> = {
      uniqueId: dto.uniqueId,
      googleMediaItemId: dto.googleMediaItemId,
      fileName: dto.fileName,
      googleAlbumId: dto.googleAlbumId,
      googleAlbumName: dto.googleAlbumName,
      filePath: dto.filePath ?? '',
      url: dto.url ?? undefined,
      mimeType: dto.mimeType ?? undefined,
      creationTime: dto.creationTime ?? undefined,
      lastModified: dto.lastModified ?? undefined,
      peopleRetrievedFromGoogle: dto.peopleRetrievedFromGoogle ?? false,
      people: (dto.people ?? []).map(p => ({ name: p.name })),
      keywordNodeIds: dto.keywordNodeIds ?? [],
      photoState: dto.photoState as any,
      albumNodeId: dto.albumNodeId,
      undecidedGroupId: dto.undecidedGroupId ?? undefined,
      notes: dto.notes ?? undefined,
      // optional heavy fields only if provided explicitly
      exif: dto.exif as any,
      // dto.exifMeta if you allow it from callers:
      // exifMeta: dto.exifMeta as any
    };

    const doc = await getMediaItemModel(connection).create(storedLike);
    return doc._id.toString();
  } catch (err: any) {
    if (err && err.code === 11000) return undefined;
    throw err;
  }
}

/** getGoogleAlbumNamesWherePeopleNotRetrieved -> repo.getAlbumNamesWherePeopleNotRetrieved */
export async function getGoogleAlbumNamesWherePeopleNotRetrieved(): Promise<string[]> {
  return getMediaItemModel(connection).distinct('googleAlbumName', {
    peopleRetrievedFromGoogle: false,
    googleAlbumName: { $ne: '' }
  }).exec() as unknown as string[];
}

/** getMediaItemsInNamedAlbumFromDb -> repo.getMediaItemsInNamedAlbum */
export async function getMediaItemsInNamedAlbum(googleAlbumName: string): Promise<MediaItemDTO[]> {
  const docs = await getMediaItemModel(connection).find({ googleAlbumName })
    .sort({ creationTime: -1, uniqueId: 1 })
    .lean<MediaItemStored[]>()
    .exec();
  return docs.map(d => toDTO(d));
}

/** assignMediaItemsToUndecidedGroupDb -> repo.assignToUndecidedGroup */
export async function assignToUndecidedGroup(undecidedGroupId: string, mediaItemIds: string[]): Promise<void> {
  await getMediaItemModel(connection).updateMany(
    { uniqueId: { $in: mediaItemIds } },
    { $set: { undecidedGroupId } }
  ).exec();
}

/** Clear undecidedGroupId on media items for a given group (used by service below). */
export async function clearUndecidedGroupOnItems(undecidedGroupId: string): Promise<void> {
  await getMediaItemModel(connection).updateMany(
    { undecidedGroupId },
    { $unset: { undecidedGroupId: '' } }
  ).exec();
}

export async function getByUniqueId(uniqueId: string) {
  return getMediaItemModel(connection).findOne({ uniqueId }).lean().exec();
}

export async function updateByUniqueId(uniqueId: string, updates: Partial<MediaItemDTO>) {
  return getMediaItemModel(connection)
    .updateOne({ uniqueId }, { $set: updates })
    .exec();
}