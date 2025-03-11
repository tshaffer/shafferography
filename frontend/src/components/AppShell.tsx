import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Box, CssBaseline, styled } from "@mui/material";
import { loadMediaItems, loadMediaItemsByViewSpecParams, loadPhotoSets, reloadMediaItemsByViewSpec } from "../controllers";
import { TedTaggerDispatch, setAppInitialized, setDisplayedPhotoSetIds, setDisplayedPhotoStates, setGoogleUserProfile } from "../models";
import { getPhotoLayout, getSelectedMediaItems } from "../selectors";
import { MediaItem, PhotoLayout, PhotoState } from "../types";
import PhotosContainer from './PhotosContainer';
import Sidebar from './Sidebar';
import TopNavigationBar from './TopNavigationBar';
import RightPanel from './RightPanel';

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
  onLoadMediaItemsByViewSpecParams: (photoSetIds: string[], photoStates: PhotoState[]) => any;
  onLoadMediaItems: () => any;
  onLoadPhotoSets: () => any;
  onSetAppInitialized: () => any;
  onSetGoogleUserProfile: (googleUserProfile: any) => void;
  onSetDisplayedPhotoSetIds: (displayedPhotoSetIds: string[]) => any;
  onSetDisplayedPhotoStates: (displayedPhotoStates: PhotoState[]) => any;
}

const AppShell = (props: AppShellProps) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  // Save the access token, expiration, and Google ID in localStorage
  const saveTokens = (token: string, expiresIn: number, googleId: string) => {
    const expirationTime = Date.now() + expiresIn * 1000; // Convert to milliseconds
    localStorage.setItem('googleAccessToken', token);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
    localStorage.setItem('googleId', googleId);
    console.log('Tokens saved successfully.');
  };

  // Check if the access token is expired
  const isTokenExpired = (): boolean => {
    const accessToken = localStorage.getItem('googleAccessToken');
    const expiration = localStorage.getItem('tokenExpiration');

    // Return true if the access token or expiration is missing, or if the token has expired
    return !accessToken || !expiration || Date.now() > parseInt(expiration);
  };

  // Fetch the access token from the cookie
  const fetchAccessToken = async () => {
    // debugger;
    console.log('Fetching access token from /auth/token...');
    try {
      console.log('invoke fetch on auth/token');
      const response = await fetch('http://localhost:8080/auth/token', {  // successfully invokes server function
        // const response = await fetch('http://localhost:5173/auth/token', {  // fails to invoke server function
        // const response = await fetch('/auth/token', { // fails to invoke server function
        method: 'GET',
        credentials: 'include', // Include HTTP-only cookies
      });
      console.log('response from fetch on auth/token', response);
      // debugger;

      if (response.ok) {
        const data = await response.json();
        const { accessToken, googleId } = data;

        console.log('Access token fetched:', accessToken);
        console.log('Google ID fetched:', googleId);

        const expiresIn = 3600; // 1 hour validity

        // Save the token and Google ID to localStorage
        saveTokens(accessToken, expiresIn, googleId);

        setAccessToken(accessToken);
        setIsLoggedIn(true);
      } else {
        console.warn('No valid access token found. Attempting to refresh...');
        refreshAccessToken(); // Try refreshing if fetching fails
      }
    } catch (error) {
      console.error('Error fetching access token:', error);
      // debugger;
      // logout(); // Logout if fetching fails
    }
  };

  // Refresh the access token using the refresh token endpoint
  const refreshAccessToken = async () => {
    const googleId = localStorage.getItem('googleId');

    if (!googleId) {
      console.error('No Google ID found. Unable to refresh token.');
      setIsLoggedIn(false); // Set user as logged out without triggering a redirect loop
      return; // Prevent further execution
    }

    try {
      const response = await fetch('http://localhost:8080/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleId }),
      });

      if (response.ok) {
        const { accessToken, expiresIn } = await response.json();
        console.log('Token refreshed successfully:', accessToken);
        saveTokens(accessToken, expiresIn, googleId);
        setAccessToken(accessToken);
        setIsLoggedIn(true);
        fetchUserProfile();
      } else {
        console.warn('Failed to refresh access token. Logging out...');
        logout();
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      logout();
    }
  };

  // Logout function to clear localStorage and reload the app
  const logout = () => {
    console.log('Logging out...');
    localStorage.clear(); // Clear all localStorage data
    setIsLoggedIn(false); // Set state to logged out
    window.location.href = '/'; // Redirect to the home or login page
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const expiresIn = params.get('expiresIn');
    const googleId = params.get('googleId');
    const lastGoogleId = localStorage.getItem('googleId');
    const loggedOut = localStorage.getItem('loggedOut');

    // console.log('useEffect triggered.');
    // console.log('accessToken:', accessToken);
    // console.log('expiresIn:', expiresIn);
    // console.log('googleId:', googleId);
    // console.log('lastGoogleId:', lastGoogleId);
    // console.log('loggedOut:', loggedOut);

    // Handle the loggedOut flag and exit if needed
    if (loggedOut === 'true') {
      // console.log('User already logged out.');
      localStorage.removeItem('loggedOut');
      setIsLoggedIn(false);
      return; // Prevent further execution
    }

    // Detect user switch and clear localStorage if needed
    if (googleId && googleId !== lastGoogleId) {
      // console.log('Detected user switch. Clearing localStorage.');
      localStorage.clear();
    }

    // If query parameters are present, save tokens and clear the URL
    if (accessToken && expiresIn && googleId) {
      // console.log('Saving tokens from query params...');
      saveTokens(accessToken, parseInt(expiresIn), googleId);
      setIsLoggedIn(true);
      window.history.replaceState({}, document.title, '/'); // Clear query params from URL
    }
    // If tokens are not in the query params, attempt to fetch them from cookies
    else if (isTokenExpired()) {
      console.warn('Token expired or missing. Attempting to fetch from server...');
      fetchAccessToken(); // Invoke fetchAccessToken here
    } else {
      // console.log('Tokens are valid. User is logged in.');
      setIsLoggedIn(true);
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:8080/user-profile', { credentials: 'include' });
      // if (!response.ok) throw new Error('Failed to fetch user profile');
      const data = await response.json();
      // console.log('User Profile:', data);
      props.onSetGoogleUserProfile(data);
      return data;
    } catch (error) {
      // console.error(error);
    }
  };

  React.useEffect(() => {

    const initializeDisplayedPhotoSetIds = async (): Promise<string[]> => {
      let displayedPhotoSetIds: string[] = [];
      const displayedPhotoSetsStr: string | null = localStorage.getItem('displayedPhotoSetIds');
      if (displayedPhotoSetsStr) {
        displayedPhotoSetIds = displayedPhotoSetsStr.split(',');
        props.onSetDisplayedPhotoSetIds(displayedPhotoSetIds);
      }
      return displayedPhotoSetIds;
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

    props.onLoadPhotoSets()
      .then(function () {
        return initializeDisplayedPhotoStates()
      }).then(function (displayedPhotoStates: PhotoState[]) {
        return initializeDisplayedPhotoSetIds()
      }).then(function (displayedPhotoSetIds: string[]) {
        return props.onReloadMediaItemsByViewSpec();
      }).then(function () {
        return props.onSetAppInitialized();
      });
  }, []);

  if (!isLoggedIn) {
    return (
      // const response = await fetch('http://localhost:8080/auth/token', {
      <a href="http://localhost:8080/auth/google">Login with Google</a>
      // <a href="/auth/google">Login with Google</a>
    );
  }

  const handleOpenSidebar = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleRightPanel = () => {
    setRightPanelOpen((prev) => {
      return !prev;
    });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <TopNavigationBar
        sidebarOpen={sidebarOpen}
        rightPanelOpen={rightPanelOpen}
        onOpenSidebar={handleOpenSidebar}
        toggleRightPanel={toggleRightPanel}
        selectedItemsCount={props.selectedMediaItems.length}
      />
      <Sidebar
        open={sidebarOpen}
        onClose={handleCloseSidebar}
      />
      <Main sidebarOpen={sidebarOpen} rightPanelOpen={rightPanelOpen}>
        <DrawerHeader />
        <PhotosContainer />
      </Main>
      <RightPanel
        selectedMediaItems={props.selectedMediaItems}
        open={rightPanelOpen}
        onClose={toggleRightPanel}
      />
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
    onLoadMediaItemsByViewSpecParams: loadMediaItemsByViewSpecParams,
    onLoadMediaItems: loadMediaItems,
    onLoadPhotoSets: loadPhotoSets,
    onSetAppInitialized: setAppInitialized,
    onSetGoogleUserProfile: setGoogleUserProfile,
    onSetDisplayedPhotoSetIds: setDisplayedPhotoSetIds,
    onSetDisplayedPhotoStates: setDisplayedPhotoStates,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AppShell);
