/** @module Model:base */

import { combineReducers } from 'redux';
import { TedTaggerState } from '../types';

import { appStateReducer } from './appState';
import { mediaItemsStateReducer } from './mediaItems';
import { selectedMediaItemsStateReducer } from './selectedMediaItems';
import { keywordsStateReducer } from './keywords';
import { searchUIStateReducer } from './searchUI';
import { photoViewSpecReducer } from './photoViewSpec';
import { undecidedGroupsStateReducer } from './undecidedGroups';
import { mediaItemsCountStateReducer } from './mediaItemsCount';
import { albumTreeStateReducer } from './mediaContentTree';
import { mediaViewReducer } from './mediaView';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootReducer = combineReducers<TedTaggerState>({
  mediaContentTreeState: albumTreeStateReducer,
  appState: appStateReducer,
  mediaItemsState: mediaItemsStateReducer,
  selectionsState: selectedMediaItemsStateReducer,
  keywordsState: keywordsStateReducer,
  searchUIState: searchUIStateReducer,
  photoViewSpec: photoViewSpecReducer,
  undecidedGroupsState: undecidedGroupsStateReducer,
  mediaItemsCountState: mediaItemsCountStateReducer,
  mediaViewState: mediaViewReducer,
});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

