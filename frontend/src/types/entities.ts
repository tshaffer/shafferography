import { MediaContentNodeType, PhotoState } from "./enums";

export interface PersonInPhoto {
  name: string;
}

export interface MediaItemPropertiesFromExif {
  // Timestamps (ISO 8601 strings)
  takenAt?: string;         // from DateTimeOriginal/CreateDate
  fileModifiedAt?: string;  // from FileModifyDate (filesystem mtime via exiftool)
  exifModifiedAt?: string;  // from ModifyDate

  // Dimensions
  width?: number;           // ImageWidth (current/visible)
  height?: number;          // ImageHeight (current/visible)
  originalWidth?: number;   // ExifImageWidth (original capture)
  originalHeight?: number;  // ExifImageHeight (original capture)
  orientation?: number;    // Orientation

  // Exposure / optics
  fNumber?: number;         // FNumber (e.g., 2.2)
  exposureTime?: string;    // ExposureTime (e.g., "1/203" or "0.50s")
  iso?: number;             // ISO
  focalLengthMm?: number;   // FocalLength in mm
  focalLength35mm?: number; // FocalLengthIn35mmFormat in mm

  // Human-readable place (if embedded)
  city?: string;            // City
  state?: string;           // Province-State / State
  country?: string;         // Country

  // GPS (decimal degrees / meters / degrees)
  gpsLatitude?: number;         // GPSLatitude
  gpsLongitude?: number;        // GPSLongitude
  gpsAltitudeM?: number;        // GPSAltitude (meters)
  gpsImgDirectionDeg?: number;  // GPSImgDirection (bearing)
}

export interface MediaItem {
  uniqueId: string;
  googleMediaItemId: string,
  fileName: string,
  googleAlbumId: string;
  googleAlbumName: string;
  filePath?: string,
  url?: string,
  mimeType?: string,
  exif: MediaItemPropertiesFromExif,
  peopleRetrievedFromGoogle: boolean,
  people?: PersonInPhoto[],
  keywordNodeIds: string[],
  photoState: PhotoState,
  albumNodeId: string;
  undecidedGroupId?: string;
  notes?: string;
}


export interface Keyword {
  keywordId: string;
  label: string;
  type: string;
}

export interface KeywordNode {
  nodeId: string;
  keywordId: string;
  parentNodeId?: string;
  childrenNodeIds?: string[];
}

export interface KeywordNodeDeep {
  nodeId: string;
  keywordId: string;
  childNodeIds: string[];
  childNodes: KeywordNodeDeep[];
}

export interface KeywordTreeDeep {
  root: KeywordNodeDeep;
}

export interface KeywordData {
  keywords: Keyword[];
  keywordNodes: KeywordNode[];
  keywordRootNodeId: string;
}

export interface GridRowData {
  mediaItemIndex: number;
  numMediaItems: number;
  rowHeight: number;
  cellWidths: number[];
}

export interface GoogleUserProfile {
  googleId: string;
  email: string;
  name: string;
}

export interface FileToImport {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export interface PhotoStateOption {
  value: PhotoState;
  label: string;
  icon?: any;
}

export type FilteredTopLevelKey =
  | "uniqueId"
  | "googleMediaItemId"
  | "fileName"
  | "googleAlbumId"
  | "filePath"
  | "url"
  | "mimeType"
  | "photoState";

export const FilteredTopLevelKeys: FilteredTopLevelKey[] = [
  "uniqueId",
  "googleMediaItemId",
  "fileName",
  "googleAlbumId",
  "filePath",
  "url",
  "mimeType",
  "photoState",
];

export type FilteredMediaItemPicker = Pick<MediaItem, FilteredTopLevelKey> & {
  width?: number;   // from mediaItem.exif.width
  height?: number;  // from mediaItem.exif.height
};

export interface UndecidedGroup {
  id: string;
  name: string;
  albumNodeIds: string[];
  createdAt: string;
}

export interface MediaItemCountByPhotoStateByAlbumNodeId {
  [albumNodeId: string]: {
    [photoState: string]: number;
  };
}

export interface MediaItemCountByUndecidedGroupPerAlbumNode {
  undecidedGroupId: string;
  albumNodeId: string;
  count: number
}

export type MediaContentNode = GroupNode | AlbumNode;

export interface GroupNode {
  id: string;
  name: string;
  type: MediaContentNodeType.Group;
  children: MediaContentNode[];
}

export interface AlbumNode {
  id: string;
  name: string;
  type: MediaContentNodeType.Album;
}

export interface MediaContentTree {
  nodes: MediaContentNode[];
}
