import { StringToNumberLUT } from "baseTypes";
import { SearchRuleType, DateSearchRuleType, KeywordSearchRuleType, MatchRule, PhotoState, MediaContentNodeType } from "enums";

export interface PersonInPhoto {
  name: string;
}

export interface MediaItemPropertiesFromExif {
  // Timestamps
  takenAt?: string;          // DateTimeOriginal/CreateDate
  fileModifiedAt?: string;   // FileModifyDate
  exifModifiedAt?: string;   // ModifyDate

  // Dimensions (match schema)
  imageWidth?: number;       // ImageWidth (current/visible)
  imageHeight?: number;      // ImageHeight (current/visible)
  exifImageWidth?: number;   // ExifImageWidth (original)
  exifImageHeight?: number;  // ExifImageHeight (original)
  orientation?: number;      // Orientation

  // Exposure / optics
  fNumber?: number;
  exposureTime?: string;
  iso?: number;
  focalLengthMm?: number;
  focalLength35mm?: number;

  // Place
  city?: string;
  state?: string;
  country?: string;

  // GPS
  gpsLatitude?: number;
  gpsLongitude?: number;
  gpsAltitudeM?: number;
  gpsImgDirectionDeg?: number;
}

export interface MediaItemStored {
  _id: any;
  uniqueId: string;
  googleMediaItemId: string;
  fileName: string;
  googleAlbumId: string;
  googleAlbumName: string;
  filePath?: string;
  url?: string;
  mimeType?: string;
  exif?: MediaItemPropertiesFromExif;
  peopleRetrievedFromGoogle: boolean;
  people?: { name: string }[];
  keywordNodeIds: string[];
  photoState: string; // or PhotoState
  albumNodeId: string;
  undecidedGroupId?: string;
  notes?: string;
}

// Returned by API (flattened)
export interface MediaItem {
  uniqueId: string;
  googleMediaItemId: string;
  fileName: string;
  googleAlbumId: string;
  googleAlbumName: string;

  width: number | null;       // from exif.imageWidth
  height: number | null;      // from exif.imageHeight
  orientation: number;        // default 0
  takenAt: string | null;     // from exif.takenAt

  filePath: string;
  url: string | null;
  mimeType: string | null;
  photoState: string;
  albumNodeId: string;
  undecidedGroupId: string | null;
  notes: string | null;
  keywordNodeIds: string[];
  peopleRetrievedFromGoogle: boolean;
  people: { name: string }[];

  // optional raw exif
  exif?: MediaItemStored["exif"];
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