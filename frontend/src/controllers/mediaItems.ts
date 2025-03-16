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
  updateMediaItemsRedux
} from '../models';
import {
  serverUrl, apiUrlFragment, ServerMediaItem, MediaItem, TedTaggerState, MatchRule, SearchRule,
  PhotoState,
} from '../types';
import { cloneDeep } from 'lodash';
import {
  getDisplayedPhotoSetIds,
  getDisplayedPhotoStates,
  getMatchRule,
  getMediaItems,
  getSearchRules,
} from '../selectors';


export const loadMediaItemsByViewSpecParams = (photoSetIds: string[], photoStates: PhotoState[]): any => {
  return (dispatch: TedTaggerDispatch) => {

    let path = serverUrl + apiUrlFragment + 'mediaItemsByViewSpec';
    path += '?photoSetIds=' + photoSetIds.join(',');
    path += '&photoStates=' + JSON.stringify(photoStates);

    return axios.get(path)
      .then((mediaItemsResponse: any) => {
        dispatch(replaceMediaItems(mediaItemsResponse.data));
      });
  }
};

export const reloadMediaItemsByViewSpec = (): any => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    const state: TedTaggerState = getState();
    const photoSetIds: string[] = getDisplayedPhotoSetIds(state);
    const photoStates: PhotoState[] = getDisplayedPhotoStates(state);
    dispatch(clearMediaItems());
    dispatch(loadMediaItemsByViewSpecParams(photoSetIds, photoStates));
  }
};

export const loadAndReplaceMediaItemsByViewSpec = (): any => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    const state: TedTaggerState = getState();
    const photoSetIds: string[] = getDisplayedPhotoSetIds(state);
    const photoStates: PhotoState[] = getDisplayedPhotoStates(state);
    dispatch(loadMediaItemsByViewSpecParams(photoSetIds, photoStates));
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

    let hasChanges = false;

    for (const mediaItemEntityFromServer of mediaItemEntitiesFromServer) {
      const mediaItem: MediaItem = cloneDeep(mediaItemEntityFromServer) as MediaItem;
      
      const existingItem = currentMediaItemsMap.get(mediaItem.uniqueId);

      if (!existingItem || !isEqual(existingItem, mediaItem)) {
        hasChanges = true;
        mediaItems.push(mediaItem); // Add only changed or new items
      }
    }

    if (hasChanges) {
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
      return Promise.resolve();
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return Promise.reject();
    });
  };
};
