import { PhotoState } from "../types";

export interface PersonDTO { name: string }

export interface MediaItemDTO {
  // IDs & names
  uniqueId: string;
  googleMediaItemId: string;
  fileName: string;
  googleAlbumId: string;
  googleAlbumName: string;

  // Promoted canonical timestamps (good for sorting/filtering)
  creationTime: string | null;   // derived from EXIF/FS
  lastModified: string | null;   // usually FS mtime

  // Flattened EXIF bits the UI uses often
  width: number | null;
  height: number | null;
  orientation: number;           // default 0
  takenAt: string | null;        // EXIF capture time
  fileModifiedAt: string | null; // EXIF FileModifyDate
  exifModifiedAt: string | null; // EXIF ModifyDate

  // Paths & misc
  filePath: string;
  url: string | null;
  mimeType: string | null;

  // App state
  photoState: PhotoState;
  albumNodeId: string;
  undecidedGroupId: string | null;
  notes: string | null;
  keywordNodeIds: string[];
  peopleRetrievedFromGoogle: boolean;
  people: PersonDTO[];

  // Optional heavy payloads
  exif?: Record<string, unknown>;
  exifMeta?: {
    readAtIso: string;
    tool: string;
    toolVersion?: string;
    schemaVersion: number;
    sourcePathHash?: string | null;
  };
}

export interface CreateMediaItemInput {
  uniqueId: string;
  googleMediaItemId: string;
  fileName: string;
  googleAlbumId: string;
  googleAlbumName: string;
  filePath?: string;
  url?: string;
  mimeType?: string;
  creationTime?: string;
  lastModified?: string;
  peopleRetrievedFromGoogle: boolean;
  people?: string[];          // accept simple array; we’ll map to [{name}]
  keywordNodeIds: string[];
  photoState: PhotoState;
  albumNodeId: string;
  undecidedGroupId?: string;
  notes?: string;

  // subdocuments (optional)
  exif?: Record<string, unknown>;
  exifMeta?: {
    readAtIso: string;
    tool: string;
    toolVersion?: string;
    schemaVersion: number;
    sourcePathHash?: string;
  };
}

