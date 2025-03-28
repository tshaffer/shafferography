import { StringToNumberLUT } from "baseTypes";
import { SearchRuleType, DateSearchRuleType, KeywordSearchRuleType, MatchRule, PhotoState } from "enums";

export interface GeoData {
  latitude: number;
  longitude: number;
  altitude: number;
  latitudeSpan: number;
  longitudeSpan: number;
}

export interface MediaItem {
  uniqueId: string;
  googleMediaItemId: string,
  fileName: string,
  googleAlbumId: string;
  googleAlbumName: string;
  filePath?: string,
  productUrl?: string,
  baseUrl?: string,
  mimeType?: string,
  creationTime?: string,
  width?: number,
  height?: number
  orientation?: number,
  description?: string,
  geoData?: GeoData,
  people?: string[],
  peopleRetrievedFromGoogle: boolean,
  keywordNodeIds: string[],
  photoState: PhotoState,
  albumId: string;
  undecidedGroupId?: string;
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

export interface Album {
  albumId: string;
  albumName: string;
}

export interface FileToImport {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  lastModifiedDate: string;
}

export interface UndecidedGroup {
  id: string;
  name: string;
  albumIds: string[];
  createdAt: string;
}

export interface MediaItemCountByUndecidedGroupPerAlbum {
  undecidedGroupId: string;
  albumId: string;
  count: number
}

export interface MediaItemCounts {
  mediaItemCountByAlbum: StringToNumberLUT;
  mediaItemCountByPhotoState: StringToNumberLUT;
  mediaItemCountByUndecidedGroupPerAlbum: MediaItemCountByUndecidedGroupPerAlbum[];
}

