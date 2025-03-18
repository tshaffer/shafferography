import { UndecidedGroup, UndecidedGroupsState } from '../types';
import { TedTaggerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_UNDECIDED_GROUP = 'ADD_UNDECIDED_GROUP';
export const ADD_UNDECIDED_GROUPS = 'ADD_UNDECIDED_GROUPS';
export const DELETE_UNDECIDED_GROUP = 'DELETE_UNDECIDED_GROUP';

// ------------------------------------
// Actions
// ------------------------------------

interface AddUndecidedGroupPayload {
  undecidedGroup: UndecidedGroup;
}

export const addUndecidedGroupRedux = (
  undecidedGroup: UndecidedGroup,
): any => {
  console.log('undecidedGroups.ts: addUndecidedGroupRedux', undecidedGroup);
  return {
    type: ADD_UNDECIDED_GROUP,
    payload: {
      undecidedGroup
    }
  };
};

interface AddUndecidedGroupsPayload {
  undecidedGroups: UndecidedGroup[];
}

export const addUndecidedGroups = (
  undecidedGroups: UndecidedGroup[],
): any => {
  return {
    type: ADD_UNDECIDED_GROUPS,
    payload: {
      undecidedGroups
    }
  };
};

interface DeleteUndecidedGroupPayload {
  undecidedGroupId: string;
}

export const deleteUndecidedGroupRedux = (
  undecidedGroupId: string,
): any => {
  return {
    type: DELETE_UNDECIDED_GROUP,
    payload: {
      undecidedGroupId
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: UndecidedGroupsState =
{
  undecidedGroups: [],
};

export const undecidedGroupsStateReducer = (
  state: UndecidedGroupsState = initialState,
  action: TedTaggerModelBaseAction<AddUndecidedGroupsPayload & AddUndecidedGroupPayload & DeleteUndecidedGroupPayload>
): UndecidedGroupsState => {
  switch (action.type) {
    case ADD_UNDECIDED_GROUP: {
      const { undecidedGroup } = action.payload as AddUndecidedGroupPayload;
      // Prevent duplicates
      if (state.undecidedGroups.some((set) => set.id === undecidedGroup.id)) {
        return state; // No changes if duplicate exists
      }
      return {
        ...state,
        undecidedGroups: [...state.undecidedGroups, undecidedGroup], // Append new undecidedGroup
      };
    }
    case ADD_UNDECIDED_GROUPS: {
      const { undecidedGroups } = action.payload as AddUndecidedGroupsPayload;
      // Create a set of existing IDs to prevent duplicates
      const existingids = new Set(state.undecidedGroups.map((set) => set.id));
      const newUndecidedGroups = undecidedGroups.filter(
        (set) => !existingids.has(set.id) // Exclude duplicates
      );
      return {
        ...state,
        undecidedGroups: [...state.undecidedGroups, ...newUndecidedGroups], // Merge new unique undecidedGroups
      };
    }
    case DELETE_UNDECIDED_GROUP: {
      const { undecidedGroupId } = action.payload as DeleteUndecidedGroupPayload;
      return {
        ...state,
        undecidedGroups: state.undecidedGroups.filter((set) => set.id !== undecidedGroupId), // Remove the specified undecidedGroup
      };
    }
    default:
      return state;
  }
};
