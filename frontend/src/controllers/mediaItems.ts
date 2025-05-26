import axios from 'axios';
import isEqual from 'lodash/isEqual';

import {
  TedTaggerAnyPromiseThunkAction,
  TedTaggerDispatch,
  addMediaItems,
  addKeywordToMediaItemIdsRedux,
  removeKeywordFromMediaItemIdsRedux,
  setPhotoStateRedux,
  clearMediaItems,
  updateMediaItemsRedux,
  setMediaItemNotesRedux
} from '../models';
import {
  serverUrl, apiUrlFragment, ServerMediaItem, MediaItem, TedTaggerState, MatchRule, SearchRule,
  PhotoState,
  PhotoLayout,
} from '../types';
import { cloneDeep } from 'lodash';
import {
  getDisplayedAlbumIds,
  getDisplayedAlbumNodeIds,
  getDisplayedPhotoStates,
  getDisplayedUndecidedGroupIds,
  getGroupUndecidedPhotos,
  getMatchRule,
  getMediaItemIds,
  getMediaItems,
  getPhotoLayout,
  getSearchRules,
  getSelectedMediaItemIds,
  getUndecidedGroupIds,
} from '../selectors';
import { deselectMediaItems } from './selectMediaItem';
import { loadMediaItemCounts } from './mediaItemCounts';


const deselectHiddenMediaItems = (): any => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    const updatedState = getState();
    const selectedMediaItemIds: string[] = getSelectedMediaItemIds(updatedState);
    const mediaItemIds: string[] = getMediaItemIds(updatedState);
    const selectedHiddenMediaItemsIds = selectedMediaItemIds.filter(id => !new Set(mediaItemIds).has(id));
    dispatch(deselectMediaItems(selectedHiddenMediaItemsIds));
  };
}

const loadMediaItemsByViewSpecParams = (albumIds: string[], albumNodeIds: string[], photoStates: PhotoState[], groupUndecidedPhotos: boolean, undecidedGroupIds: string[]): any => {

  return (dispatch: TedTaggerDispatch, getState: any) => {

    let path = serverUrl + apiUrlFragment + 'mediaItemsByViewSpec';
    path += '?albumIds=' + albumIds.join(',');
    path += '&albumNodeIds=' + albumNodeIds.join(',');
    path += '&photoStates=' + JSON.stringify(photoStates);
    path += '&groupUndecidedPhotos=' + JSON.stringify(groupUndecidedPhotos);
    path += '&undecidedGroupIds=' + undecidedGroupIds.join(',');

    return axios.get(path)
      .then((mediaItemsResponse: any) => {
        dispatch(replaceMediaItems(mediaItemsResponse.data));

        const state = getState();
        const photoLayout: PhotoLayout = getPhotoLayout(state);
        if (photoLayout !== PhotoLayout.Loupe) {
          dispatch(deselectHiddenMediaItems());
        }
        
        return Promise.resolve();
      });
  }
};

export const reloadMediaItemsByViewSpec = (): any => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    const state: TedTaggerState = getState();
    const albumIds: string[] = getDisplayedAlbumIds(state);
    const albumNodeIds: string[] = getDisplayedAlbumNodeIds(state);
    const photoStates: PhotoState[] = getDisplayedPhotoStates(state);
    const groupUndecidedPhotos: boolean = getGroupUndecidedPhotos(state);
    const undecidedGroupIds: string[] = getDisplayedUndecidedGroupIds(state);
    dispatch(clearMediaItems());
    dispatch(loadMediaItemsByViewSpecParams(albumIds, albumNodeIds, photoStates, groupUndecidedPhotos, undecidedGroupIds));
  }
};

export const loadAndReplaceMediaItemsByViewSpec = (): any => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    const state: TedTaggerState = getState();
    const albumIds: string[] = getDisplayedAlbumIds(state);
    const albumNodeIds: string[] = getDisplayedAlbumIds(state);
    const photoStates: PhotoState[] = getDisplayedPhotoStates(state);
    const groupUndecidedPhotos: boolean = getGroupUndecidedPhotos(state);
    const undecidedGroupIds: string[] = getUndecidedGroupIds(state);
    return dispatch(loadMediaItemsByViewSpecParams(albumIds, albumNodeIds, photoStates, groupUndecidedPhotos, undecidedGroupIds))
      .then(() => {
        return Promise.resolve();
      });
  }
};

export const loadMediaItems = (): any => {

  return (dispatch: TedTaggerDispatch) => {

    const specifyDateRange = false;
    const startDate = (new Date()).toISOString();
    const endDate = (new Date()).toISOString();

    let path = serverUrl
      + apiUrlFragment
      + 'mediaItemsToDisplay';

    path += '?specifyDateRange=' + specifyDateRange;
    path += '&startDate=' + startDate;
    path += '&endDate=' + endDate;

    path += '&specifyTagsInSearch=false&tagSelector=untagged&tagIds=&tagSearchOperator=OR';

    return axios.get(path)
      .then((mediaItemsResponse: any) => {

        const mediaItems: MediaItem[] = [];
        const mediaItemEntitiesFromServer: ServerMediaItem[] = (mediaItemsResponse as any).data;

        // derive mediaItems from serverMediaItems
        for (const mediaItemEntityFromServer of mediaItemEntitiesFromServer) {

          // TEDTODO - replace any
          const mediaItem: any = cloneDeep(mediaItemEntityFromServer);
          mediaItems.push(mediaItem as MediaItem);

        }
        dispatch(addMediaItems(mediaItems));
      });
  };
};

const replaceMediaItems = (mediaItemEntitiesFromServer: ServerMediaItem[]): any => {
  return (dispatch: TedTaggerDispatch, getState: any) => {

    const state: TedTaggerState = getState();
    const currentMediaItems: MediaItem[] = getMediaItems(state) || []; // Get current media items
    const currentMediaItemsMap = new Map(currentMediaItems.map((mediaItem: MediaItem) => [mediaItem.uniqueId, mediaItem]));

    const mediaItems: MediaItem[] = [];
    let mediaItemChanges = false;

    if (currentMediaItems.length === mediaItemEntitiesFromServer.length) {
      for (const mediaItemEntityFromServer of mediaItemEntitiesFromServer) {
        const mediaItem: MediaItem = cloneDeep(mediaItemEntityFromServer) as MediaItem;

        const existingItem = currentMediaItemsMap.get(mediaItem.uniqueId);

        if (!existingItem || !isEqual(existingItem, mediaItem)) {
          mediaItemChanges = true;
          mediaItems.push(mediaItem); // Add only changed or new items
        }
      }

      if (mediaItemChanges) {
        dispatch(updateMediaItemsRedux(mediaItems)); // Dispatch only if there are changes
      }
    }
    else {
      for (const mediaItemEntityFromServer of mediaItemEntitiesFromServer) {
        mediaItems.push(cloneDeep(mediaItemEntityFromServer) as MediaItem); // Add only changed or new items
      }
      dispatch(updateMediaItemsRedux(mediaItems)); // Dispatch only if there are changes
    }
  };
};

export const loadMediaItemsFromSearchSpec = (): TedTaggerAnyPromiseThunkAction => {

  return (dispatch: TedTaggerDispatch, getState: any) => {

    const state: TedTaggerState = getState();

    const matchRule: MatchRule = getMatchRule(state);
    const searchRules: SearchRule[] = getSearchRules(state);

    let path = serverUrl
      + apiUrlFragment
      + 'mediaItemsToDisplayFromSearchSpec';

    path += '?matchRule=' + matchRule;
    path += '&searchRules=' + JSON.stringify(searchRules);

    return axios.get(path)
      .then((mediaItemsResponse: any) => {
        dispatch(replaceMediaItems(mediaItemsResponse.data));
      });
  };
};

export const updateKeywordAssignedToSelectedMediaItems = (
  keywordNodeId: string,
  selectedMediaItemIds: string[],
  assignKeyword: boolean
): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    if (assignKeyword) {
      dispatch(addKeywordToMediaItemIdsRedux(selectedMediaItemIds, keywordNodeId));
    } else {
      dispatch(removeKeywordFromMediaItemIdsRedux(selectedMediaItemIds, keywordNodeId));
    }
    return Promise.resolve();
  };
};

export const addKeywordToMediaItems = (
  mediaItemIds: string[],
  keywordNodeId: string,
): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {

    // const path = serverUrl + apiUrlFragment + 'addKeywordToMediaItems';

    // const uniqueIds: string[] = mediaItems.map((mediaItem: MediaItem) => {
    //   return mediaItem.uniqueId;
    // });

    dispatch(addKeywordToMediaItemIdsRedux(mediaItemIds, keywordNodeId));
    return Promise.resolve();
    // const updateKeywordsInMediaItemsBody = {
    //   mediaItemIds: uniqueIds,
    //   tagId: keywordNode.id,
    // };

    // return axios.post(
    //   path,
    //   updateKeywordsInMediaItemsBody
    // ).then((response) => {
    //   dispatch(addTagToMediaItemsRedux(mediaItems, keywordNode.id));
    //   // return mediaItems.uniqueId;
    // }).catch((error) => {
    //   console.log('error');
    //   console.log(error);
    //   return '';
    // });
  };
};

export const setPhotoState = (mediaItemIds: string[], photoState: PhotoState): any => {

  return (dispatch: TedTaggerDispatch) => {

    const path = serverUrl + apiUrlFragment + 'setPhotoState';

    const setPhotoStateBody = { mediaItemIds, photoState };

    return axios.post(
      path,
      setPhotoStateBody
    ).then((response) => {
      dispatch(setPhotoStateRedux(mediaItemIds, photoState));
      dispatch(loadMediaItemCounts());
      return Promise.resolve();
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return Promise.reject();
    });
  };
};

export const setMediaItemNotes = (uniqueId: string, notes: string): any => {

  return (dispatch: TedTaggerDispatch) => {

    const path = serverUrl + apiUrlFragment + 'setMediaItemNotes';

    const setMediaItemNotesBody = { uniqueId, notes };

    return axios.post(
      path,
      setMediaItemNotesBody
    ).then((response) => {
      dispatch(setMediaItemNotesRedux(uniqueId, notes));
      return Promise.resolve();
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return Promise.reject();
    });
  };
};