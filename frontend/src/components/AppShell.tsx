import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Box, CssBaseline, styled } from "@mui/material";
import { loadMediaItems } from "../controllers";
import { TedTaggerDispatch, setAppInitialized } from "../models";
import { getPhotoLayout } from "../selectors";
import { PhotoLayout } from "../types";
import PhotosContainer from './PhotosContainer';
import Sidebar from './Sidebar';
import TopNavigationBar from './TopNavigationBar';

const drawerWidth = 240;

declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
  }
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
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
  onLoadMediaItems: () => any;
  onSetAppInitialized: () => any;
}

const AppShell = (props: AppShellProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  React.useEffect(() => {
    props.onLoadMediaItems()
      .then(function () {
        return props.onSetAppInitialized();
      });
  }, []);

  const handleOpenSidebar = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <TopNavigationBar
        sidebarOpen={isSidebarOpen}
        onOpenSidebar={handleOpenSidebar}
      />
      <Sidebar
        open={isSidebarOpen}
        onClose={handleCloseSidebar}
      />
      <Main open={isSidebarOpen}>
        <DrawerHeader />
        <PhotosContainer />
      </Main>
    </Box>
  );
};

function mapStateToProps(state: any) {
  return {
    photoLayout: getPhotoLayout(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onLoadMediaItems: loadMediaItems,
    onSetAppInitialized: setAppInitialized,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AppShell);
