import { MediaContentNodeType, PhotoState } from "./enums";

export interface GeoData {
  latitude: number;
  longitude: number;
  altitude: number;
  latitudeSpan: number;
  longitudeSpan: number;
}

export interface ServerPerson {
  _id: string;
  name: string;
}

export interface ServerMediaItem {
  uniqueId: string;
  googleMediaItemId: string,
  fileName: string,
  googleAlbumId: string;
  filePath?: string,
  url?: string,
  mimeType?: string,
  creationTime?: string,
  lastModified?: string,
  width?: number,
  height?: number
  orientation?: number,
  description?: string,
  geoData?: GeoData,
  people?: ServerPerson[],
  keywordNodeIds: string[],
  photoState: PhotoState,
  undecidedGroupId?: string;
  notes?: string;
  albumNodeId?: string;
}

export interface MediaItem {
  uniqueId: string;
  googleMediaItemId: string,
  fileName: string,
  googleAlbumId: string;
  filePath?: string,
  url?: string,
  mimeType?: string,
  creationTime?: string,
  lastModified?: string,
  width?: number,
  height?: number
  orientation?: number,
  description?: string,
  geoData?: GeoData,
  people?: string[],
  keywordNodeIds: string[],
  photoState: PhotoState,
  undecidedGroupId?: string;
  notes?: string;
  albumNodeId?: string;

    // support for variants
  derivatives: Derivative[];
  preferredDerivativeId?: string | null;
}

export type OutFormat = "heic" | "jpeg" | "jpg" | "png";

export interface Derivative {
  derivativeId: string;
  label: string;                  // e.g. "Crop A", "Web 1600", etc.
  format: OutFormat;
  width: number;
  height: number;
  mimeType: string;
  absPath: string;                // absolute path on disk
  createdAt: Date;
  markPreferred?: boolean;        // optional flag you may set when generating
  url?: string;                  // URL to access via backend (filled in when sending to client)
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

export type FilteredMediaItemPropertyName = "googleMediaItemId" | "fileName" | "googleAlbumId" | "filePath" | "url" | "mimeType" | "creationTime" | "lastModified" | "width" | "height" | "orientation" | "photoState";
export const FilteredMediaItemPropertyNames: FilteredMediaItemPropertyName[] = ["googleMediaItemId", "fileName", "googleAlbumId", "filePath", "url", "mimeType", "creationTime", "lastModified", "width", "height", "orientation", "photoState"];

export type FilteredMediaItemPicker = Pick<MediaItem, FilteredMediaItemPropertyName>;

export const FILTERED_MEDIA_ITEM_KEYS: (keyof FilteredMediaItemPicker)[] = FilteredMediaItemPropertyNames;

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
