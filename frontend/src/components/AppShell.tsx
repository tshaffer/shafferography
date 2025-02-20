import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Box, CssBaseline, styled } from "@mui/material";
import { loadMediaItems, loadMediaItemsByPhotoSet, loadPhotoSets } from "../controllers";
import { TedTaggerDispatch, setAppInitialized, setPhotoSetId } from "../models";
import { getPhotoLayout, getSelectedMediaItems } from "../selectors";
import { MediaItem, PhotoLayout } from "../types";
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
  onLoadMediaItems: () => any;
  onLoadMediaItemsByPhotoSet: (photoSetId: string) => any;
  onLoadPhotoSets: () => any;
  onSetAppInitialized: () => any;
  onSetPhotoSetId: (photoSetId: string) => any;
}

const AppShell = (props: AppShellProps) => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  React.useEffect(() => {

    const initializePhotoSetId = async (): Promise<string | null> => {
      const photoSetId: string | null = localStorage.getItem('photoSetId');
      if (photoSetId) {
        props.onSetPhotoSetId(photoSetId);
      }
      return photoSetId;
    }

    props.onLoadPhotoSets()
      .then(function () {
        return initializePhotoSetId()
      }).then(function (photoSetId: string | null) {
        console.log('photoSetId: ', photoSetId);
        if (!photoSetId) {
          return props.onLoadMediaItems()
        } else {
          return props.onLoadMediaItemsByPhotoSet(photoSetId)
        }
      }).then(function () {
        return props.onSetAppInitialized();
      });
  }, []);

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
    onLoadMediaItems: loadMediaItems,
    onLoadMediaItemsByPhotoSet: loadMediaItemsByPhotoSet,
    onLoadPhotoSets: loadPhotoSets,
    onSetAppInitialized: setAppInitialized,
    onSetPhotoSetId: setPhotoSetId,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AppShell);
