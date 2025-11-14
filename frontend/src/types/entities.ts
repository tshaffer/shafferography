import { MediaContentNodeType, PhotoState } from "./enums";
import { MediaItem } from '@shared/types/mediaItem';

export interface GeoData {
  latitude: number;
  longitude: number;
  altitude: number;
  latitudeSpan: number;
  longitudeSpan: number;
}

export interface PersonInPhoto {
  _id: string;
  name: string;
}

export interface PersonDTO { name: string }

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

export type FilteredMediaItemPropertyName = "uniqueId" | "googleMediaItemId" | "fileName" | "googleAlbumId" | "filePath" | "url" | "mimeType" | "takenAt" | "fileModifiedAt" | "exifModifiedAt" | "width" | "height" | "orientation" | "photoState";
export const FilteredMediaItemPropertyNames: FilteredMediaItemPropertyName[] = ["uniqueId", "googleMediaItemId", "fileName", "googleAlbumId", "filePath", "url", "mimeType", "takenAt", "fileModifiedAt", "exifModifiedAt", "width", "height", "orientation", "photoState"];

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
