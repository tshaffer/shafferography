import {
  UndecidedGroup,
  TedTaggerState
} from '../types';

export const getUndecidedGroups = (state: TedTaggerState): UndecidedGroup[] => {
  return state.undecidedGroupsState.undecidedGroups;
};

export const getUndecidedGroupIds = (state: TedTaggerState): string[] => {
  return getUndecidedGroups(state).map(undecidedGroup => undecidedGroup.id);
};

export const getUndecidedGroup = (state: TedTaggerState, undecidedGroupId: string): UndecidedGroup | undefined => {
  return getUndecidedGroups(state).find(undecidedGroup => undecidedGroup.id === undecidedGroupId);
}
