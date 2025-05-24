/** @module Model:base */

import { combineReducers } from 'redux';
import { TedTaggerState } from '../types';

import { appStateReducer } from './appState';
import { mediaItemsStateReducer } from './mediaItems';
import { selectedMediaItemsStateReducer } from './selectedMediaItems';
import { keywordsStateReducer } from './keywords';
import { searchUIStateReducer } from './searchUI';
import { photoViewSpecReducer } from './photoViewSpec';
import { albumsStateReducer } from './albums';
import { undecidedGroupsStateReducer } from './undecidedGroups';
import { mediaItemsCountStateReducer } from './mediaItemsCount';
import { albumTreeStateReducer } from './albumTree';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootReducer = combineReducers<TedTaggerState>({
  albumsState: albumsStateReducer,
  albumTreeState: albumTreeStateReducer,
  appState: appStateReducer,
  mediaItemsState: mediaItemsStateReducer,
  selectionsState: selectedMediaItemsStateReducer,
  keywordsState: keywordsStateReducer,
  searchUIState: searchUIStateReducer,
  photoViewSpec: photoViewSpecReducer,
  undecidedGroupsState: undecidedGroupsStateReducer,
  mediaItemsCountState: mediaItemsCountStateReducer,
});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

