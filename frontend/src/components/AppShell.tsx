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

type ViewMode = "grid" | "loupe" | "survey" | "fullscreen";

const photos = [
  { id: 1, src: "/images/J&M-2.jpg" },
  { id: 2, src: "/images/J&M-3.jpg" },
  { id: 3, src: "/images/J&M-4.jpg" },
  { id: 4, src: "/images/J&M-5.jpg" },
  { id: 5, src: "/images/J&M-10.jpg" },
  { id: 6, src: "/images/J&M-11.jpg" },
  { id: 7, src: "/images/J&M-12.jpg" },
  { id: 8, src: "/images/J&M-13.jpg" },
  { id: 9, src: "/images/J&M-14.jpg" },
  { id: 11, src: "/images/J&M-15.jpg" },
  { id: 12, src: "/images/J&M-16.jpg" },
  { id: 13, src: "/images/J&M-17.jpg" },
  { id: 14, src: "/images/J&M-18.jpg" },
  { id: 15, src: "/images/J&M-19.jpg" },
  { id: 16, src: "/images/J&M-20.jpg" },
  { id: 17, src: "/images/J&M-21.jpg" },
  { id: 18, src: "/images/J&M-22.jpg" },
  { id: 19, src: "/images/J&M-23.jpg" },
  { id: 20, src: "/images/J&M-24.jpg" },
  { id: 21, src: "/images/J&M-25.jpg" },
];

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
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [loupeIndex, setLoupeIndex] = useState<number>(0);

  React.useEffect(() => {
    props.onLoadMediaItems()
      .then(function () {
        return props.onSetAppInitialized();
      });
  }, []);

  // useEffect(() => {
  //   if (viewMode === "loupe") {
  //     if (selectedPhotos.length === 1) {
  //       console.log('useEffect: selectedPhotos.length === 1');
  //       setLoupeIndex(0);
  //     } else if (selectedPhotos.length > 1) {
  //       // const minSelectedPhoto = Math.min(...selectedPhotos);
  //       // setLoupeIndex(minSelectedPhoto);
  //       console.log('useEffect: selectedPhotos.length > 1');
  //       setLoupeIndex(0);
  //     }
  //     setLoupeIndex(0);
  //   }
  // }, [viewMode, selectedPhotos]);

  // useEffect(() => {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     console.log('handleKeyDown', event.key);
  //     console.log('loupeIndex', loupeIndex);
  //     if (viewMode === "loupe") {
  //       if (selectedPhotos.length > 1) {
  //         if (event.key === "ArrowRight" && loupeIndex < selectedPhotos.length - 1) {
  //           setLoupeIndex(loupeIndex + 1);
  //         } else if (event.key === "ArrowLeft" && loupeIndex > 0) {
  //           setLoupeIndex(loupeIndex - 1);
  //         }
  //       } else {
  //         if (event.key === "ArrowRight" && loupeIndex < photos.length - 1) {
  //           setLoupeIndex(loupeIndex + 1);
  //         } else if (event.key === "ArrowLeft" && loupeIndex > 0) {
  //           setLoupeIndex(loupeIndex - 1);
  //         }
  //       }
  //     }
  //   };
  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => window.removeEventListener("keydown", handleKeyDown);
  // }, [viewMode, loupeIndex, selectedPhotos]);

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
