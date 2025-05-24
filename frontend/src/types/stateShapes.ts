import { StringToKeywordLUT, StringToKeywordNodeLUT, StringToNumberLUT } from './base';
import { GoogleUserProfile, MediaItem, Album, UndecidedGroup, MediaItemCountByUndecidedGroupPerAlbum, MediaItemCountByPhotoStateByAlbumId, AlbumTree, AlbumNode } from './entities';
import {
  DateSearchRuleType,
  KeywordSearchRuleType,
  MainDisplayMode,
  MatchRule,
  PhotoLayout,
  PhotoState,
  SearchRuleType,
} from './enums';

export interface TedTaggerState {
  albumsState: AlbumsState;
  albumTreeState: AlbumTreeState;
  appState: AppState;
  keywordsState: KeywordsState;
  mediaItemsCountState: MediaItemsCountState;
  mediaItemsState: MediaItemsState;
  photoViewSpec: PhotoViewSpec;
  searchUIState: SearchUIState;
  selectionsState: SelectedMediaItemsState;
  undecidedGroupsState: UndecidedGroupsState;
}

export interface AlbumsState {
  albums: Album[];
}

export interface AlbumTreeState {
  nodes: AlbumNode[];
  selectedNodeIds: Set<string>;
}

export interface AppState {
  appInitialized: boolean;
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  mainDisplayMode: MainDisplayMode;
  fullScreenMediaItemId: string;
  googleUserProfile: GoogleUserProfile | null;
}

export interface MediaItemsState {
  mediaItems: MediaItem[];
  loupeViewMediaItemIds: string[];
  surveyViewMediaItemIds: string[];
}

export interface SelectedMediaItemsState {
  lastClickedId: string | null;
  selectedMediaItemIds: string[];
}

export interface KeywordsState {
  keywordsById: StringToKeywordLUT;
  keywordNodesByNodeId: StringToKeywordNodeLUT;
  keywordRootNodeId: string;
}

export interface SearchUIState {
  matchRule: MatchRule;
  searchRules: SearchRule[];
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

export interface LocalStorageState {
  folders: string[];
}

export interface UndecidedGroupsState {
  undecidedGroups: UndecidedGroup[];
}

export interface PhotoViewSpec {
  photoLayout: PhotoLayout;
  numGridColumns: number;
  loupeViewMediaItemId: string;
  focusedSurveyViewMediaItemId: string;
  displayMetadata: boolean;
  surveyModeZoomFactor: number;
  scrollPosition: number;
  fullScreenMode: boolean;
  mediaItemZoomFactorById: StringToNumberLUT;
  displayedAlbumIds: string[];
  displayedAlbumNodeIds: string[];
  displayedPhotoStates: PhotoState[];
  groupUndecidedPhotos: boolean;
  displayedUndecidedGroupIds: string[];
}

export interface MediaItemsCountState {
  mediaItemCountByAlbum: StringToNumberLUT;
  mediaItemCountByPhotoState: StringToNumberLUT;
  mediaItemCountByPhotoStateByAlbumId: MediaItemCountByPhotoStateByAlbumId;
  mediaItemCountByUndecidedGroupPerAlbum: MediaItemCountByUndecidedGroupPerAlbum[];
}