import { StringToKeywordLUT, StringToKeywordNodeLUT, StringToNumberLUT } from './base';
import { GoogleUserProfile, MediaItem, Album, UndecidedGroup, MediaItemCountByUndecidedGroupPerAlbum, MediaItemCountByPhotoStateByAlbumId } from './entities';
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
  appState: AppState;
  keywordsState: KeywordsState;
  mediaItemsState: MediaItemsState;
  photoViewSpec: PhotoViewSpec;
  searchUIState: SearchUIState;
  selectionsState: SelectedMediaItemsState;
  albumsState: AlbumsState;
  undecidedGroupsState: UndecidedGroupsState;
  mediaItemsCountState: MediaItemsCountState;
}

export interface AppState {
  appInitialized: boolean;
  mainDisplayMode: MainDisplayMode;
  fullScreenMediaItemId: string;
  googleUserProfile: GoogleUserProfile | null;
}

export interface MediaItemsState {
  mediaItems: MediaItem[];
  loupeViewMediaItemIds: string[];
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

export interface AlbumsState {
  albums: Album[];
}

export interface UndecidedGroupsState {
  undecidedGroups: UndecidedGroup[];
}

export interface PhotoViewSpec {
  photoLayout: PhotoLayout;
  numGridColumns: number;
  loupeViewMediaItemId: string;
  displayMetadata: boolean;
  surveyModeZoomFactor: number;
  scrollPosition: number;
  fullScreenMode: boolean;
  mediaItemZoomFactorById: StringToNumberLUT;
  displayedAlbumIds: string[];
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