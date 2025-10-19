import { StringToNumberLUT } from "../types";
import { SearchRuleType, DateSearchRuleType, KeywordSearchRuleType, MatchRule, MediaContentNodeType } from "./enums";

export interface PersonInPhoto {
  name: string;
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