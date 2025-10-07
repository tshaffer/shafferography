import { StringToKeywordLUT, StringToKeywordNodeLUT, StringToNumberLUT, SurveyViewOrientation } from './base';
import {
  GoogleUserProfile,
  MediaItem,
  UndecidedGroup,
  MediaContentNode,
  MediaItemCountByPhotoStateByAlbumNodeId,
  MediaItemCountByUndecidedGroupPerAlbumNode
} from './entities';
import {
  DateSearchRuleType,
  KeywordSearchRuleType,
  MainDisplayMode,
  MatchRule,
  PhotoLayout,
  PhotoState,
  SearchRuleType,
} from './enums';
import { MediaManifest, ViewVariant } from './media';

export interface TedTaggerState {
  mediaContentTreeState: MediaContentTreeState;
  appState: AppState;
  keywordsState: KeywordsState;
  manifestState: ManifestState;
  mediaViewState: MediaViewState;
  mediaItemsCountState: MediaItemsCountState;
  mediaItemsState: MediaItemsState;
  photoViewSpec: PhotoViewSpec;
  searchUIState: SearchUIState;
  selectionsState: SelectedMediaItemsState;
  undecidedGroupsState: UndecidedGroupsState;
}

export interface MediaContentTreeState {
  nodes: MediaContentNode[];
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
  surveyViewOrientation: SurveyViewOrientation;
  displayMetadata: boolean;
  surveyModeZoomFactor: number;
  scrollPosition: number;
  fullScreenMode: boolean;
  mediaItemZoomFactorById: StringToNumberLUT;
  displayedAlbumNodeIds: string[];
  displayedPhotoStates: PhotoState[];
  groupUndecidedPhotos: boolean;
  displayedUndecidedGroupIds: string[];
}

export interface MediaItemsCountState {
  mediaItemCountByAlbumNode: StringToNumberLUT;
  mediaItemCountByPhotoState: StringToNumberLUT;
  mediaItemCountByPhotoStateByAlbumNodeId: MediaItemCountByPhotoStateByAlbumNodeId;
  mediaItemCountByUndecidedGroupPerAlbumNode: MediaItemCountByUndecidedGroupPerAlbumNode[];
}

export interface ManifestState {
  // byId: { [mediaId: string]: MediaManifest | null };
  // statusById: { [mediaId: string]: 'idle' | 'loading' | 'succeeded' | 'failed' };
  // errorById: { [mediaId: string]: string | null };
  byId: Record<string, MediaManifest | undefined>;
  statusById: Record<string, "idle" | "loading" | "succeeded" | "failed">;
  errorById: Record<string, string | undefined>;
}

export interface MediaViewState {
  // byId: { [mediaId: string]: ViewVariant };
  byId: Record<string, ViewVariant | undefined>;
}
