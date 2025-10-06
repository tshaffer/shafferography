import { StringToNumberLUT } from "baseTypes";
import { SearchRuleType, DateSearchRuleType, KeywordSearchRuleType, MatchRule, PhotoState, MediaContentNodeType } from "enums";
import { Types } from "mongoose";

export interface GeoData {
  latitude: number;
  longitude: number;
  altitude: number;
  latitudeSpan: number;
  longitudeSpan: number;
}

export type OutFormat = "heic" | "jpeg" | "jpg" | "png";

export interface Derivative {
  _id: Types.ObjectId;
  label: string;                  // e.g. "Crop A", "Web 1600", etc.
  format: OutFormat;
  width: number;
  height: number;
  mimeType: string;
  absPath: string;                // absolute path on disk
  createdAt: Date;
  markPreferred?: boolean;        // optional flag you may set when generating
}

export interface MediaItem {
  uniqueId: string;
  googleMediaItemId: string;
  fileName: string;
  googleAlbumId: string;
  googleAlbumName: string;

  creationTime?: string;
  lastModified?: string;
  orientation?: number;
  description?: string;
  geoData?: GeoData;
  people?: string[];
  peopleRetrievedFromGoogle: boolean;
  keywordNodeIds: string[];
  photoState: PhotoState;
  albumNodeId: string;
  undecidedGroupId?: string;
  notes?: string;

  // original version
  filePath?: string;
  url?: string;
  width?: number;
  height?: number
  mimeType?: string;

  // support for variants
  derivatives: Derivative[];
  preferredDerivativeId?: Types.ObjectId | null;
}

export interface DateRangeSpecification {
  specifyDateRange: boolean;
  startDate?: string;
  endDate?: string;
}

export interface Keyword {
  keywordId: string;
  label: string;
  type: string;
}

export interface KeywordNode {
  nodeId: string;
  keywordId: string;
  parentNodeId: string;
  childrenNodeIds: string[];
}

export interface KeywordData {
  keywords: Keyword[];
  keywordNodes: KeywordNode[];
  keywordRootNodeId: string;
}

export interface SearchRule {
  searchRuleType: SearchRuleType;
  searchRule: KeywordSearchRule | DateSearchRule;
}

export interface DateSearchRule {
  dateSearchRuleType: DateSearchRuleType;
  date: string;
  date2?: string;
}

export interface KeywordSearchRule {
  keywordSearchRuleType: KeywordSearchRuleType;
  keywordNodeId?: string;
}

export interface SearchSpec {
  matchRule: MatchRule;
  searchRules: SearchRule[];
}

export interface User {
  googleId: string;
  email: string;
  name: string; // Add this property
  refreshToken?: string;
}

export interface UserWithToken extends User {
  accessToken: string;
}

export interface FileToImport {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

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

export interface MediaItemCounts {
  mediaItemCountByAlbumNode: StringToNumberLUT;
  mediaItemCountByPhotoState: StringToNumberLUT;
  mediaItemCountByPhotoStateByAlbumNodeId: MediaItemCountByPhotoStateByAlbumNodeId;
  mediaItemCountByUndecidedGroupPerAlbumNode: MediaItemCountByUndecidedGroupPerAlbumNode[];
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
  // _id: string;
  nodes: MediaContentNode[];
}