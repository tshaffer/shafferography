import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Box, CssBaseline, styled } from "@mui/material";
import {
  loadMediaContentTree,
  loadUndecidedGroups,
  reloadMediaItemsByViewSpec
} from "../controllers";
import {
  TedTaggerDispatch,
  setAppInitialized,
  setDisplayedAlbumNodeIds,
  setDisplayedPhotoStates,
  setGoogleUserProfile,
  setRightPanelOpen,
  setSidebarOpen
} from "../models";
import {
  getPhotoLayout,
  getRightPanelOpen,
  getSelectedMediaItems,
  getSidebarOpen
} from "../selectors";
import { MediaItem } from '@shared/types';
import { getServerUrl, PhotoLayout, PhotoState } from "../types";
import PhotosContainer from './PhotosContainer';
import Sidebar from './Sidebar';
import TopNavigationBar from './TopNavigationBar';
import RightPanel from './RightPanel';
import { loadMediaItemCounts } from '../controllers/mediaItemCounts';

const drawerWidth = 240;

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
  marginLeft: !sidebarOpen && !rightPanelOpen ? `-${drawerWidth}px` : !rightPanelOpen ? `0px` : !sidebarOpen ? `-${drawerWidth}px` : `0px`,
  marginRight: `0px`,
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const googleInterfaceEnabled = (): boolean => {
  return (window as any).__ENV__?.ENABLE_GOOGLE_INTERFACE === true ||
    (window as any).__ENV__?.ENABLE_GOOGLE_INTERFACE === 'true';
};

export interface AppShellProps {
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  photoLayout: PhotoLayout;
  selectedMediaItems: MediaItem[];
  onReloadMediaItemsByViewSpec: () => any;
  onLoadMediaItemCounts: () => any;
  onLoadAlbumTree: () => any;
  onLoadUndecidedGroups: () => any;
  onSetAppInitialized: () => any;
  onSetSidebarOpen: (open: boolean) => any;
  onSetRightPanelOpen: (open: boolean) => any;
  onSetGoogleUserProfile: (googleUserProfile: any) => void;
  onSetDisplayedAlbumNodeIds: (displayedAlbumNodeIds: string[]) => any;
  onSetDisplayedPhotoStates: (displayedPhotoStates: PhotoState[]) => any;
}

const AppShell = (props: AppShellProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const saveTokens = (token: string, expiresIn: number, googleId: string) => {
    const expirationTime = Date.now() + expiresIn * 1000;
    localStorage.setItem('googleAccessToken', token);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
    localStorage.setItem('googleId', googleId);
  };

  const isTokenExpired = (): boolean => {
    const accessToken = localStorage.getItem('googleAccessToken');
    const expiration = localStorage.getItem('tokenExpiration');
    return !accessToken || !expiration || Date.now() > parseInt(expiration);
  };

  const fetchAccessToken = async () => {
    try {
      const response = await fetch(getServerUrl() + '/auth/token', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const { accessToken, googleId } = data;
        const expiresIn = 3600;
        saveTokens(accessToken, expiresIn, googleId);
        setAccessToken(accessToken);
        setIsLoggedIn(true);
      } else {
        refreshAccessToken();
      }
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  const refreshAccessToken = async () => {
    const googleId = localStorage.getItem('googleId');
    if (!googleId) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await fetch(getServerUrl() + '/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleId }),
      });

      if (response.ok) {
        const { accessToken, expiresIn } = await response.json();
        saveTokens(accessToken, expiresIn, googleId);
        setAccessToken(accessToken);
        setIsLoggedIn(true);
        fetchUserProfile();
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      logout();
    }
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  useEffect(() => {
    if (!googleInterfaceEnabled()) {
      setIsLoggedIn(true); // allow user to proceed if google auth is off
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const expiresIn = params.get('expiresIn');
    const googleId = params.get('googleId');
    const lastGoogleId = localStorage.getItem('googleId');
    const loggedOut = localStorage.getItem('loggedOut');

    if (loggedOut === 'true') {
      localStorage.removeItem('loggedOut');
      setIsLoggedIn(false);
      return;
    }

    if (googleId && googleId !== lastGoogleId) {
      localStorage.clear();
    }

    if (accessToken && expiresIn && googleId) {
      saveTokens(accessToken, parseInt(expiresIn), googleId);
      setIsLoggedIn(true);
      window.history.replaceState({}, document.title, '/');
    } else if (isTokenExpired()) {
      fetchAccessToken();
    } else {
      setIsLoggedIn(true);
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(getServerUrl() + '/user-profile', { credentials: 'include' });
      const data = await response.json();
      props.onSetGoogleUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const initializeDisplayedAlbumNodeIds = async (): Promise<string[]> => {
      const displayedAlbumsStr = localStorage.getItem('displayedAlbumNodeIds');
      const displayedAlbumNodeIds = displayedAlbumsStr ? displayedAlbumsStr.split(',') : [];
      props.onSetDisplayedAlbumNodeIds(displayedAlbumNodeIds);
      return displayedAlbumNodeIds;
    };

    const initializeDisplayedPhotoStates = async (): Promise<PhotoState[]> => {
      const displayedPhotoStatesStr = localStorage.getItem('displayedPhotoStates');
      const displayedPhotoStates = displayedPhotoStatesStr
        ? displayedPhotoStatesStr
          .split(',')
          .map(level => level.trim())
          .filter((level): level is PhotoState => Object.values(PhotoState).includes(level as PhotoState))
        : [];

      props.onSetDisplayedPhotoStates(displayedPhotoStates);
      return displayedPhotoStates;
    };

    props.onLoadAlbumTree()
      .then(initializeDisplayedPhotoStates)
      .then(initializeDisplayedAlbumNodeIds)
      .then(props.onLoadUndecidedGroups)
      .then(props.onLoadMediaItemCounts)
      .then(props.onReloadMediaItemsByViewSpec)
      .then(props.onSetAppInitialized);
  }, []);

  if (!isLoggedIn) {
    if (googleInterfaceEnabled()) {
      const href = getServerUrl() + '/auth/token';
      return <a href={href}>Login with Google</a>;
    } else {
      return <div>Google interface is disabled.</div>;
    }
  }

  const handleOpenSidebar = () => props.onSetSidebarOpen(true);
  const handleCloseSidebar = () => props.onSetSidebarOpen(false);
  const toggleRightPanel = () => props.onSetRightPanelOpen(!props.rightPanelOpen);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <TopNavigationBar
        sidebarOpen={props.sidebarOpen}
        rightPanelOpen={props.rightPanelOpen}
        onOpenSidebar={handleOpenSidebar}
        toggleRightPanel={toggleRightPanel}
        selectedItemsCount={props.selectedMediaItems.length}
      />
      <Sidebar open={props.sidebarOpen} onClose={handleCloseSidebar} />
      <Main sidebarOpen={props.sidebarOpen} rightPanelOpen={props.rightPanelOpen}>
        <DrawerHeader />
        <PhotosContainer />
      </Main>
      <RightPanel
        mediaItem={props.selectedMediaItems[0]}
        open={props.rightPanelOpen}
        onClose={toggleRightPanel}
      />
    </Box>
  );
};

function mapStateToProps(state: any) {
  return {
    sidebarOpen: getSidebarOpen(state),
    rightPanelOpen: getRightPanelOpen(state),
    photoLayout: getPhotoLayout(state),
    selectedMediaItems: getSelectedMediaItems(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => bindActionCreators({
  onSetSidebarOpen: setSidebarOpen,
  onSetRightPanelOpen: setRightPanelOpen,
  onReloadMediaItemsByViewSpec: reloadMediaItemsByViewSpec,
  onLoadMediaItemCounts: loadMediaItemCounts,
  onLoadAlbumTree: loadMediaContentTree,
  onLoadUndecidedGroups: loadUndecidedGroups,
  onSetAppInitialized: setAppInitialized,
  onSetGoogleUserProfile: setGoogleUserProfile,
  onSetDisplayedAlbumNodeIds: setDisplayedAlbumNodeIds,
  onSetDisplayedPhotoStates: setDisplayedPhotoStates,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppShell);
