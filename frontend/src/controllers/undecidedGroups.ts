import axios from 'axios';
import { TedTaggerAnyPromiseThunkAction, TedTaggerDispatch, addUndecidedGroupRedux, addUndecidedGroups, deleteMediaItemsRedux, deleteUndecidedGroupRedux, removeUndecidedGroupIdFromMediaItems } from '../models';
import { serverUrl, apiUrlFragment, UndecidedGroup } from '../types';
import { getMediaItemIdsByUndecidedGroupId } from '../selectors';

export const loadUndecidedGroups = (): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    const path = serverUrl + apiUrlFragment + 'undecidedGroups';
    return axios.get(path)
      .then((response: any) => {
        const undecidedGroups: UndecidedGroup[] = response.data;
        dispatch(addUndecidedGroups(undecidedGroups));
        return Promise.resolve();
      }).catch((error) => {
        console.log('error');
        console.log(error);
        return '';
      });
  };
};

export const assignMediaItemsToUndecidedGroup = (undecidedGroupId: string, mediaItemIds: string[]): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    const path = serverUrl + apiUrlFragment + 'undecidedGroup/undecided-group';
    const assignMediaItemsToUndecidedGroupBody = { undecidedGroupId, mediaItemIds };
    return axios.put(path, assignMediaItemsToUndecidedGroupBody)
      .then((response: any) => {
        return Promise.resolve();
      }).catch((error) => {
        console.log('error');
        console.log(error);
        return '';
      });
  };
}

export const addUndecidedGroup = (photoSetIds: string[], undecidedGroupName: string): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'undecidedGroup';

    const undecidedGroupBody: Partial<UndecidedGroup> = { albumIds: photoSetIds, name: undecidedGroupName };
    return axios.post(path, undecidedGroupBody)
      .then((response: any) => {
        const undecidedGroup: UndecidedGroup = response.data;
        dispatch(addUndecidedGroupRedux(undecidedGroup));
        return Promise.resolve(undecidedGroup);
      }).catch((error) => {
        console.log('error');
        console.log(error);
        return '';
      });
  };
}

export const deleteUndecidedGroup = (undecidedGroupId: string): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'undecidedGroups/' + undecidedGroupId;

    return axios.delete(path)
      .then((response: any) => {

        // Remove the reference to the undecided group from all media items.
        const mediaItemIds: string[] = getMediaItemIdsByUndecidedGroupId(getState(), undecidedGroupId);
        dispatch(removeUndecidedGroupIdFromMediaItems(mediaItemIds));
        
        // Delete the undecided group document itself.
        dispatch(deleteUndecidedGroupRedux(undecidedGroupId));
        
        // update mediaItemsToDisplay (remove the ones where the groupId was removed) - might not be necessary if there were none displayed.
        dispatch(deleteMediaItemsRedux(mediaItemIds));
        
        return Promise.resolve();
      }).catch((error) => {
        console.log('error');
        console.log(error);
        return '';
      });
  };
}
