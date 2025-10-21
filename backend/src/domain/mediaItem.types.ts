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
  exif?: MediaItemPropertiesFromExif;
  exifMeta?: {
    readAtIso: string;
    tool: string;
    toolVersion?: string;
    schemaVersion: number;
    sourcePathHash?: string | null;
  };
}

export interface MediaItemPropertiesFromExif {
  // Timestamps (ISO 8601 strings)
  takenAt?: string;         // from DateTimeOriginal/CreateDate
  fileModifiedAt?: string;  // from FileModifyDate
  exifModifiedAt?: string;  // from ModifyDate

  // Dimensions
  imageWidth?: number;
  imageHeight?: number;
  orientation?: number;

  // Camera metadata
  fNumber?: number;
  exposureTime?: string;
  iso?: number;
  focalLengthMm?: number | string;
  focalLength35mm?: number | string;

  // GPS metadata
  gpsLatitude?: number;
  gpsLongitude?: number;
  gpsAltitudeM?: number;
  gpsAltitudeRef?: string;
  gpsDateTime?: string;
  gpsImgDirectionDeg?: number;
  gpsImgDirectionRef?: string;
  gpsSpeed?: number;
  gpsSpeedRef?: string;

  // Offsets
  offsetTime?: string;
  offsetTimeOriginal?: string;
  offsetTimeDigitized?: string;

  // Human place
  city?: string;
  state?: string;
  country?: string;
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
  exif?: MediaItemPropertiesFromExif;
  exifMeta?: {
    readAtIso: string;
    tool: string;
    toolVersion?: string;
    schemaVersion: number;
    sourcePathHash?: string;
  };
}

