import { MainDisplayMode, TedTaggerState } from '../types';

export const getAppInitialized = (state: TedTaggerState): boolean => {
  return state.appState.appInitialized;
};

export const getSidebarOpen = (state: TedTaggerState): boolean => {
  return state.appState.sidebarOpen;
};

export const getRightPanelOpen = (state: TedTaggerState): boolean => {
  return state.appState.rightPanelOpen;
};

export const getMainDisplayMode = (state: TedTaggerState): MainDisplayMode => {
  return state.appState.mainDisplayMode;
}; 

export const getFullScreenMediaItemId = (state: TedTaggerState): string => {
  return state.appState.fullScreenMediaItemId;
};
