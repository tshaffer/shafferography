import { TedTaggerState, ViewVariant } from '../types';

export const getViewVariant = (state: TedTaggerState, id: string): ViewVariant | null => {
  return state.mediaViewState.byId[id] || null;
}