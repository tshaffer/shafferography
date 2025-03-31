import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Box, CssBaseline, styled } from "@mui/material";
import { loadMediaItems, loadAlbums, loadUndecidedGroups, reloadMediaItemsByViewSpec } from "../controllers";
import { TedTaggerDispatch, setAppInitialized, setDisplayedAlbumIds, setDisplayedPhotoStates, setGoogleUserProfile } from "../models";
import { getPhotoLayout, getSelectedMediaItems } from "../selectors";
import { MediaItem, PhotoLayout, PhotoState } from "../types";
import PhotosContainer from './PhotosContainer';
import Sidebar from './Sidebar';
import TopNavigationBar from './TopNavigationBar';
import RightPanel from './RightPanel';
import { loadMediaItemCounts } from '../controllers/mediaItemCounts';

const drawerWidth = 240;

declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
  }
}

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'sidebarOpen' && prop !== 'rightPanelOpen',
})<{
  sidebarOpen?: boolean;
  rightPanelOpen?: boolean;
}>(({ theme, sidebarOpen = false, rightPanelOpen = false }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create(['margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: !sidebarOpen && !rightPanelOpen ? `-${drawerWidth}px` : !rightPanelOpen ? `0px` : !sidebarOpen ? `-${drawerWidth}px` : `0px`, // ✅ Fix marginLeft
  marginRight: `0px`,
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export interface AppShellProps {
  photoLayout: PhotoLayout;
  selectedMediaItems: MediaItem[];
  onReloadMediaItemsByViewSpec: () => any;
  onLoadMediaItemCounts: () => any;
  onLoadMediaItems: () => any;
  onLoadAlbums: () => any;
  onLoadUndecidedGroups: () => any;
  onSetAppInitialized: () => any;
  onSetGoogleUserProfile: (googleUserProfile: any) => void;
  onSetDisplayedAlbumIds: (displayedAlbumIds: string[]) => any;
  onSetDisplayedPhotoStates: (displayedPhotoStates: PhotoState[]) => any;
}

const AppShell = (props: AppShellProps) => {

  React.useEffect(() => {

    const initializeDisplayedAlbumIds = async (): Promise<string[]> => {
      let displayedAlbumIds: string[] = [];
      const displayedAlbumsStr: string | null = localStorage.getItem('displayedAlbumIds');
      if (displayedAlbumsStr) {
        displayedAlbumIds = displayedAlbumsStr.split(',');
        props.onSetDisplayedAlbumIds(displayedAlbumIds);
      }
      return displayedAlbumIds;
    }

    const initializeDisplayedPhotoStates = async (): Promise<PhotoState[]> => {
      let displayedPhotoStates: PhotoState[] = [];
      const displayedPhotoStatesStr: string | null = localStorage.getItem('displayedPhotoStates');
      if (displayedPhotoStatesStr) {
        displayedPhotoStates = displayedPhotoStatesStr
          .split(',')
          .map(level => level.trim()) // Trim spaces
          .filter((level): level is PhotoState => Object.values(PhotoState).includes(level as PhotoState)); // Ensure valid enum values

        props.onSetDisplayedPhotoStates(displayedPhotoStates);
      }
      return displayedPhotoStates;
    };

    props.onLoadAlbums()
      .then(function () {
        return initializeDisplayedPhotoStates()
      }).then(function () {
        return initializeDisplayedAlbumIds()
      }).then(function () {
        return props.onLoadUndecidedGroups();
      }).then(function () {
        return props.onLoadMediaItemCounts();
      }).then(function () {
        return props.onReloadMediaItemsByViewSpec();
      }).then(function () {
        return props.onSetAppInitialized();
      });
  }, []);

  return (
    <Box id='appShellBox'>
      <CssBaseline />
      <PhotosContainer />
    </Box>
  );
};

function mapStateToProps(state: any) {
  return {
    photoLayout: getPhotoLayout(state),
    selectedMediaItems: getSelectedMediaItems(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onReloadMediaItemsByViewSpec: reloadMediaItemsByViewSpec,
    onLoadMediaItemCounts: loadMediaItemCounts,
    onLoadMediaItems: loadMediaItems,
    onLoadAlbums: loadAlbums,
    onLoadUndecidedGroups: loadUndecidedGroups,
    onSetAppInitialized: setAppInitialized,
    onSetGoogleUserProfile: setGoogleUserProfile,
    onSetDisplayedAlbumIds: setDisplayedAlbumIds,
    onSetDisplayedPhotoStates: setDisplayedPhotoStates,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AppShell);
