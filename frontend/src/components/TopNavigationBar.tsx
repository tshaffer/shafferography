import React from 'react';
import { bindActionCreators } from 'redux';
import { useState } from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';

import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Toolbar, IconButton, Typography, Box, TextField, Tooltip, Divider, styled, Button, Dialog, DialogContent, DialogTitle, Slider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import LabelIcon from "@mui/icons-material/Label";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TuneIcon from '@mui/icons-material/Tune';
import UploadIcon from '@mui/icons-material/Upload';   // Upload to Google
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutline from '@mui/icons-material/HelpOutline';
import CloudUpload from '@mui/icons-material/CloudUpload';
import CloudDone from '@mui/icons-material/CloudDone';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import ReplayIcon from '@mui/icons-material/Replay';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import ConstructionIcon from '@mui/icons-material/Construction';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import CropIcon from '@mui/icons-material/Crop';

import { deselectAllPhotos, loadAndReplaceMediaItemsByViewSpec, reimportPhotosFromDrive, setAlbumNodeId, setPhotoState } from '../controllers';
import { TedTaggerDispatch, setNumGridColumnsRedux, setPhotoLayoutRedux, setLoupeViewMediaItemIdRedux, setLoupeViewMediaItemIds, removeLoupeViewMediaItemId, setFocusedSurveyViewMediaItemId, setSurveyViewMediaItemIds, setDisplayMetadata, setFullScreenMode, setSurveyViewOrientation } from '../models';
import { getNumGridColumns, getSelectedMediaItemsCount, getMediaItems, getMediaItemIds, getSelectedMediaItemIds, getSelectedMediaItems, getPhotoLayout, getLoupeViewMediaItemId, getLoupeViewMediaItemIds, getFocusedSurveyViewMediaItemId, getSurveyViewMediaItemIds, getDisplayMetadata, getRightPanelOpen, getSidebarOpen, getFullScreenMode, getSurveyViewOrientation, getMediaContentTree } from '../selectors';
import { MediaContentNode, MediaItem, PhotoLayout, PhotoState, SurveyViewOrientation, SurveyViewOrientations, TedTaggerState } from '../types';
import UploadToGoogleDialog from './UploadToGoogleDialog';
import SetUndecidedGroup from './SetUndecidedGroup';
import SettingsDialog from './SettingsDialog';
import MovePhotosDialog from './MovePhotosDialog';
import { CropperModal } from './CropperModal';
import { cropMediaItem } from '../controllers/photoCropper';

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  sidebarOpen?: boolean;
  rightPanelOpen?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'sidebarOpen' && prop !== 'rightPanelOpen',
})<AppBarProps>(({ theme, sidebarOpen = false, rightPanelOpen = false }) => {
  return {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px - ${rightPanelOpen ? drawerWidth : 0}px)`, // Adjust width dynamically
    marginLeft: sidebarOpen ? `${drawerWidth}px` : 0,
    marginRight: rightPanelOpen ? `${drawerWidth}px` : 0,
  };
});

export interface TopNavigationBarPropsFromParent {
  onOpenSidebar: () => void;
  toggleRightPanel: () => void;
  selectedItemsCount: number;
}

export interface TopNavigationBarDerivedStateProps {
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  mediaItemIds: string[];
  selectedMediaItems: MediaItem[];
  selectedMediaItemIds: string[];
  photoLayout: PhotoLayout;
  numGridColumns: number;
  selectedMediaItemsCount: number;
  mediaItems: MediaItem[];
  loupeViewMediaItemId: string;
  loupeViewMediaItemIds: string[];
  surveyViewOrientation: SurveyViewOrientation;
  focusedSurveyViewMediaItemId: string;
  surveyViewMediaItemIds: string[];
  displayMetadata: boolean;
  fullScreenMode: boolean;
  mediaContentNodes: MediaContentNode[];
}

export interface TopNavigationBarDerivedActionCreatorProps {
  onSetPhotoLayout: (photoLayout: PhotoLayout) => void;
  onSetLoupeViewMediaItemId: (id: string) => any;
  onSetLoupeViewMediaItemIds: (mediaItemIds: string[]) => any;
  onSetFocusedSurveyViewMediaItemId: (id: string) => any;
  onSetSurveyViewOrientation: (orientation: SurveyViewOrientation) => any;
  onSetSurveyViewMediaItemIds: (mediaItemIds: string[]) => any;
  onSetNumGridColumns: (numGridColumns: number) => void;
  onDeselectAllPhotos: () => void;
  onReloadMediaItemsByPhotoStates: (photoStates: PhotoState[]) => void;
  onSetPhotoState: (mediaItemIds: string[], photoState: PhotoState) => any;
  onSetAlbumNodeId: (mediaItemIds: string[], albumNodeId: string) => any;
  onReloadMediaItemsByViewSpec: () => any;
  onRemoveLoupeViewMediaItemId: (mediaItemId: string) => any;
  onSetDisplayMetadata: (displayMetadata: boolean) => any;
  onReimportMediaItems: () => any;
}

export interface TopNavigationProps extends TopNavigationBarDerivedStateProps, TopNavigationBarDerivedActionCreatorProps, TopNavigationBarPropsFromParent { }

const TopNavigationBar: React.FC<any> = (props: TopNavigationProps) => {

  const dispatch = useDispatch();

  const [isZoomDialogOpen, setIsZoomDialogOpen] = useState(false);
  const [showUploadToGoogleDialog, setShowUploadToGoogleDialog] = React.useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadingToGoogle, setUploadingToGoogle] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [undecidedGroupAnchorEl, setUndecidedGroupAnchorEl] = useState<null | HTMLElement>(null);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showMovePhotosDialog, setShowMovePhotosDialog] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);

  React.useEffect(() => {
    if (props.photoLayout === PhotoLayout.Loupe) {
      updateLoupeViewMediaItemProps();
    }
  }, [props.mediaItemIds]);

  React.useEffect(() => {
    if (props.photoLayout === PhotoLayout.Survey) {
      updateSurveyViewMediaItemProps();
    }
  }, [props.selectedMediaItemIds]);

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      dispatch(setFullScreenMode(isFullscreen));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [dispatch]);

  const getShafferographyPaddingLeft = (): any => {
    if (props.sidebarOpen) {
      return '240px';
    } else {
      return 0;
    }
  }

  const handleCloseSpecifyUndecidedGroupUI = () => {
    setUndecidedGroupAnchorEl(null);
  };

  const handleCloseUploadToGoogleDialogDialog = () => {
    setShowUploadToGoogleDialog(false);
  };

  const handleSetShowMetadata = (updatedShowMetadata: boolean) => {
    props.onSetDisplayMetadata(updatedShowMetadata);
  };

  const handleSetSurveyPhotoLayout = (surveyViewOrientation: SurveyViewOrientation) => {
    props.onSetSurveyViewOrientation(surveyViewOrientation);
    handleUpdatePhotoLayout(PhotoLayout.Survey);
  };

  function handleUpdatePhotoLayout(photoLayout: PhotoLayout): void {

    // return if the photo layout is already set to the requested layout.
    if (photoLayout === props.photoLayout) {
      return;
    }

    // capture the scroll position if transitioning out of Grid layout.
    // if (props.photoLayout === PhotoLayout.Grid && photoLayout !== PhotoLayout.Grid) {
    //   const divElement = document.getElementById('centerColumn') as HTMLDivElement | null;
    //   if (divElement) {
    //     const scrollPosition: number = divElement.scrollTop;
    //     props.onSetScrollPosition(scrollPosition);
    //   }
    // }

    if (photoLayout === PhotoLayout.Loupe) {

      if (props.selectedMediaItemIds.length === 0) {
        props.onSetLoupeViewMediaItemId(props.mediaItemIds[0]);
        props.onSetLoupeViewMediaItemIds(props.mediaItemIds);
      } else if (props.selectedMediaItemIds.length === 1) {
        props.onSetLoupeViewMediaItemId(props.selectedMediaItemIds[0]);
        props.onSetLoupeViewMediaItemIds(props.mediaItemIds);
      } else {
        props.onSetLoupeViewMediaItemId(props.selectedMediaItemIds[0]);
        props.onSetLoupeViewMediaItemIds(props.selectedMediaItemIds);
      }

      props.onDeselectAllPhotos();

      props.onSetPhotoLayout(PhotoLayout.Loupe);

    } else if (photoLayout === PhotoLayout.Survey) {

      props.onSetFocusedSurveyViewMediaItemId(props.selectedMediaItemIds[0]);
      props.onSetSurveyViewMediaItemIds(props.selectedMediaItemIds);

      props.onSetPhotoLayout(PhotoLayout.Survey);

    } else {

      props.onSetPhotoLayout(photoLayout);

    }
  }

  const handleSetPhotoState = (photoState: PhotoState) => {
    if (props.photoLayout === PhotoLayout.Loupe) {
      props.onSetPhotoState([props.loupeViewMediaItemId], photoState)
        .then(() => {
          props.onReloadMediaItemsByViewSpec()
            .then(() => { });
        });
    } else if (props.photoLayout === PhotoLayout.Survey) {
      props.onSetPhotoState([props.focusedSurveyViewMediaItemId], photoState)
        .then(() => {
          props.onReloadMediaItemsByViewSpec()
            .then(() => { });
        });
    } else {
      props.onSetPhotoState(props.selectedMediaItemIds, photoState)
        .then(() => {
          props.onReloadMediaItemsByViewSpec();
        });
    }
  }

  const updateLoupeViewMediaItemProps = () => {

    if (props.loupeViewMediaItemIds.length === 0) {
      return;
    }

    const loupeViewMediaItemId = props.loupeViewMediaItemId;

    const loupeViewMediaItemIndex = props.loupeViewMediaItemIds.indexOf(loupeViewMediaItemId);
    if (loupeViewMediaItemIndex < 0) {
      debugger;
    }

    const mediaItemIndex = props.mediaItemIds.indexOf(loupeViewMediaItemId);
    if (mediaItemIndex >= 0) {
      return;
    }

    let newLoupeViewMediaItemIndex = -1;
    const prevLoupeViewMediaItemIndex = loupeViewMediaItemIndex - 1;
    const nextLoupeViewMediaItemIndex = loupeViewMediaItemIndex + 1;
    if (nextLoupeViewMediaItemIndex < props.loupeViewMediaItemIds.length) {
      newLoupeViewMediaItemIndex = nextLoupeViewMediaItemIndex;
    } else if (prevLoupeViewMediaItemIndex >= 0) {
      newLoupeViewMediaItemIndex = prevLoupeViewMediaItemIndex;
    }

    // set new loupe view media item id if any remain
    if (newLoupeViewMediaItemIndex >= 0) {
      const newLoupeViewMediaItemId = props.loupeViewMediaItemIds[newLoupeViewMediaItemIndex];
      props.onSetLoupeViewMediaItemId(newLoupeViewMediaItemId);
    }

    // remove deleted media item from loupe view media item ids
    props.onRemoveLoupeViewMediaItemId(props.loupeViewMediaItemId);
  }

  const updateSurveyViewMediaItemProps = () => {

    const focusedSurveyViewMediaItemId = props.focusedSurveyViewMediaItemId;

    const focusedSurveyViewMediaItemIndex = props.surveyViewMediaItemIds.indexOf(focusedSurveyViewMediaItemId);
    if (focusedSurveyViewMediaItemIndex < 0) {
      debugger;
    }

    const numSurveyViewMediaItems = props.selectedMediaItemIds.length;  // because props.surveyViewMediaItemIds is not updated yet

    if (numSurveyViewMediaItems === 1) {
      props.onSetPhotoLayout(PhotoLayout.Grid);
      return;
    }

    props.onSetSurveyViewMediaItemIds(props.selectedMediaItemIds);

    const mediaItemIndex = props.selectedMediaItemIds.indexOf(focusedSurveyViewMediaItemId);
    if (mediaItemIndex >= 0) {
      return;
    }

    if (numSurveyViewMediaItems > 1) {
      let newSurveyViewMediaItemIndex = -1;
      const prevSurveyViewMediaItemIndex = focusedSurveyViewMediaItemIndex - 1;
      const nextSurveyViewMediaItemIndex = focusedSurveyViewMediaItemIndex + 1;
      if (nextSurveyViewMediaItemIndex < numSurveyViewMediaItems) {
        newSurveyViewMediaItemIndex = nextSurveyViewMediaItemIndex;
      } else if (prevSurveyViewMediaItemIndex >= 0) {
        newSurveyViewMediaItemIndex = prevSurveyViewMediaItemIndex;
      } else {
        debugger;
      }
      const newSurveyViewMediaItemId = props.surveyViewMediaItemIds[newSurveyViewMediaItemIndex];
      props.onSetFocusedSurveyViewMediaItemId(newSurveyViewMediaItemId);
    }
  }

  const handleEnterFullScreenMode = () => {
    const elem = document.getElementById('centerColumn');
    if (elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    }
  };

  const handleOpenMoreOptionsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  function handleSliderChange(event: Event, value: number | number[]): void {
    props.onSetNumGridColumns(value as number);
  }

  const handleMovePhotos = (newAlbumId: string) => {
    console.log('handleMovePhotos');
    console.log(props.selectedMediaItems);
    console.log('New Album ID:', newAlbumId);
    props.onSetAlbumNodeId(props.selectedMediaItemIds, newAlbumId)
      .then(() => {
        props.onReloadMediaItemsByViewSpec()
          .then(() => {
            setShowMovePhotosDialog(false);
          });
      });
  }

  const handleReloadMediaItems = () => {
    console.log('handleReloadMediaItems');
    console.log(props.selectedMediaItems[0]);
    props.onReimportMediaItems();
  }

  const handleCropMediaItem = () => {
    setCropOpen(true);
    // cropMediaItem(props.selectedMediaItemIds[0]);
    // setIsCropping(true);
  }


  /*  Prior slider version
          <DialogContent style={{ paddingTop: '34px' }}>
          <Slider
            value={props.numGridColumns}
            onChange={handleSliderChange}
            valueLabelDisplay="on"
            step={1}
            marks
            min={2}
            max={10}
          />
          <Button onClick={() => setIsSettingsOpen(false)} fullWidth variant="contained" sx={{ mt: 2 }}>
            Close
          </Button>
        </DialogContent>
  */
  const marks = [
    {
      value: 2,
      label: '2',
    },
    {
      value: 3,
      label: '3',
    },
    {
      value: 4,
      label: '4',
    },
    {
      value: 5,
      label: '5',
    },
    {
      value: 6,
      label: '6',
    },
    {
      value: 7,
      label: '7',
    },
    {
      value: 8,
      label: '8',
    },
    {
      value: 9,
      label: '9',
    },
    {
      value: 10,
      label: '10',
    },
  ];

  const renderUploadToGoogleDialog = (): JSX.Element => {
    return (
      <UploadToGoogleDialog
        mediaItemIds={props.selectedMediaItemIds}
        mediaItems={props.selectedMediaItems}
        open={showUploadToGoogleDialog}
        onClose={handleCloseUploadToGoogleDialogDialog}
      />
    );
  }

  const renderZoomDialog = (): JSX.Element => {
    return (
      <Dialog open={isZoomDialogOpen} onClose={() => setIsZoomDialogOpen(false)}>
        <DialogTitle>Zoom In / Out</DialogTitle>
        <DialogContent> {/* Increased bottom padding */}
          <Slider
            size='small'
            value={props.numGridColumns}
            onChange={handleSliderChange}
            valueLabelDisplay='auto'
            step={1}
            marks
            min={2}
            max={10}
          />
          <Button onClick={() => setIsZoomDialogOpen(false)} fullWidth variant="contained" sx={{ mt: 2 }}>
            Close
          </Button>
        </DialogContent>
      </Dialog>

    );
  }

  const renderSettingsDialog = (): JSX.Element => {
    return (
      <SettingsDialog
        open={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
        showMetadata={props.displayMetadata}
        onSetShowMetadata={(showMetadata) => handleSetShowMetadata(showMetadata)}
      />
    );
  }

  const renderMovePhotosDialog = (): JSX.Element => {
    const mediaContentNodes: MediaContentNode[] = props.mediaContentNodes;
    return (
      <MovePhotosDialog
        open={showMovePhotosDialog}
        onClose={() => setShowMovePhotosDialog(false)}
        onMovePhotos={handleMovePhotos}
        mediaContentNodes={mediaContentNodes}
        mediaItemsToMove={props.selectedMediaItems}
      />
    );
  }

  const showSpecifyUndecidedGroupUI = (event: React.MouseEvent<HTMLElement>) => {
    setUndecidedGroupAnchorEl(event.currentTarget);
  };

  const getSetPhotoStateButtonDisabled = (): boolean => {
    if (props.photoLayout === PhotoLayout.Loupe) {
      return false;
    }
    return props.selectedMediaItemsCount === 0;

  }

  const renderSetPhotoStateUI = () => {
    return (
      <React.Fragment>
        <Tooltip title="Set Unreviewed">
          <span>
            <IconButton color="inherit" onClick={() => handleSetPhotoState(PhotoState.Unreviewed)} disabled={getSetPhotoStateButtonDisabled()}>
              <MoreHoriz />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Set Pending Edits">
          <span>
            <IconButton color="inherit" onClick={() => handleSetPhotoState(PhotoState.PendingEdits)} disabled={getSetPhotoStateButtonDisabled()}>
              <ConstructionIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Set Undecided">
          <span>
            <IconButton color="inherit" onClick={showSpecifyUndecidedGroupUI} disabled={getSetPhotoStateButtonDisabled()}>
              <HelpOutline />
            </IconButton>
          </span>
        </Tooltip>

        <SetUndecidedGroup
          open={Boolean(undecidedGroupAnchorEl)}
          undecidedGroupEl={undecidedGroupAnchorEl}
          onHandleSetPhotoState={handleSetPhotoState}
          onClose={handleCloseSpecifyUndecidedGroupUI}
        />

        <Tooltip title="Set Ready for Upload">
          <span>
            <IconButton color="inherit" onClick={() => handleSetPhotoState(PhotoState.ReadyForUpload)} disabled={getSetPhotoStateButtonDisabled()}>
              <CloudUpload />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Set Uploaded">
          <span>
            <IconButton color="inherit" onClick={() => handleSetPhotoState(PhotoState.Uploaded)} disabled={getSetPhotoStateButtonDisabled()}>
              <CloudDone />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Delete Selected Photos">
          <span>
            <IconButton color="inherit" onClick={() => handleSetPhotoState(PhotoState.Deleted)} disabled={getSetPhotoStateButtonDisabled()}>
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      </React.Fragment>
    );
  };

  const renderItemCountAndActions = (): JSX.Element | null => {
    if (props.photoLayout === PhotoLayout.Loupe) {
      return renderLoupeViewItemCountAndActions();
    } else if (props.photoLayout === PhotoLayout.Survey) {
      return null;
    } else if (props.photoLayout === PhotoLayout.Grid) {
      return renderGridItemCountAndActions();
    }
    return null;
  };

  const renderGridItemCountAndActions = (): JSX.Element => {
    return (
      <React.Fragment>
        {/* Selection Count & Actions */}
        {props.selectedMediaItemsCount > 0 && (
          <>
            <Tooltip title="Deselect All">
              <span>
                <IconButton
                  color="inherit"
                  onClick={props.onDeselectAllPhotos}
                  disabled={props.selectedMediaItemsCount === 0 || props.photoLayout !== PhotoLayout.Grid}
                >
                  <ClearIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Typography variant="subtitle1" sx={{ m4: '4px' }}>
              {props.selectedMediaItemsCount} selected
            </Typography>
          </>
        )}

        <Tooltip title="Toggle Right Panel">
          <span>
            <IconButton
              color="inherit"
              onClick={props.toggleRightPanel}
              disabled={props.selectedItemsCount !== 1}
            >
              {props.rightPanelOpen ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Move Photos">
          <span>
            <IconButton
              color="inherit"
              onClick={() => setShowMovePhotosDialog(true)}
              disabled={props.selectedMediaItemsCount === 0}
            >
              <TrendingFlatIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Assign Keywords">
          <span>
            <IconButton
              color="inherit"
              disabled={props.selectedMediaItemsCount === 0}
            >
              <LabelIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Reload Photo">
          <span>
            <IconButton
              color="inherit"
              disabled={props.selectedMediaItemsCount !== 1}
              onClick={handleReloadMediaItems}
            >
              <ReplayIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Crop Photo">
          <span>
            <IconButton
              color="inherit"
              disabled={props.selectedMediaItemsCount !== 1}
              onClick={handleCropMediaItem}
            >
              <CropIcon />
            </IconButton>
          </span>
        </Tooltip>

        {renderCropperModal()}

      </React.Fragment>
    );
  };

  type AspectRatio = number | 'free';

  type CropData = {
    x: number; y: number; width: number; height: number;
    rotate: number; scaleX: number; scaleY: number;
    naturalWidth: number; naturalHeight: number;
    aspectRatio?: AspectRatio;
  };


  async function handleSaveEdits(args: { mediaItemId: string; cropData: CropData; backupOriginal?: boolean | undefined; }): Promise<void> {
    console.log('handleSaveEdits called with:', args);
    return cropMediaItem(args.mediaItemId, args.cropData, false);
  };

  const renderCropperModal = (): JSX.Element => {
    if (props.selectedMediaItemsCount !== 1) {
      return <></>;
    }
    return (
      <CropperModal
        open={cropOpen}
        onClose={() => setCropOpen(false)}
        mediaItem={props.selectedMediaItems[0]}
        onSaveEdits={handleSaveEdits}
      />
    );
  }

  const renderLoupeViewItemCountAndActions = (): JSX.Element => {
    return (
      <React.Fragment>
        <Typography variant="subtitle1" sx={{ mx: 2 }}>
          {props.loupeViewMediaItemIds.length} {props.loupeViewMediaItemIds.length === 1 ? 'item' : 'items'}
        </Typography>
      </React.Fragment>
    )
  }

  const isGridActive = props.photoLayout === PhotoLayout.Grid;
  const isLoupeActive = props.photoLayout === PhotoLayout.Loupe;
  const isSurveyViewVertical = (props.photoLayout === PhotoLayout.Survey) && (props.surveyViewOrientation === SurveyViewOrientations.Vertical);
  const isSurveyViewHorizontal = (props.photoLayout === PhotoLayout.Survey) && (props.surveyViewOrientation === SurveyViewOrientations.Horizontal);
  const isSurveyDisabled = props.selectedMediaItemsCount < 2;

  return (
    <React.Fragment>
      <AppBar sidebarOpen={props.sidebarOpen} rightPanelOpen={props.rightPanelOpen} position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={props.onOpenSidebar}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              props.sidebarOpen && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ paddingLeft: getShafferographyPaddingLeft(), flexGrow: 1 }}>Shafferography</Typography>

          <Tooltip title="Zoom In / Out">
            <IconButton color="inherit" onClick={() => setIsZoomDialogOpen(true)}>
              <TuneIcon />
            </IconButton>
          </Tooltip>

          {/* Search Bar */}
          <Box sx={{ display: "flex", alignItems: "center", mx: 2 }}>
            <SearchIcon />
            <TextField variant="outlined" size="small" placeholder="Search photos..." sx={{ ml: 1, backgroundColor: "white", borderRadius: 1 }} />
          </Box>

          <Divider orientation="vertical" flexItem sx={{ mx: 2, alignSelf: 'stretch', backgroundColor: "white" }} />

          {renderItemCountAndActions()}

          <Divider orientation="vertical" flexItem sx={{ mx: 2, alignSelf: 'stretch', backgroundColor: "white" }} />

          {renderSetPhotoStateUI()}

          <Divider orientation="vertical" flexItem sx={{ mx: 2, alignSelf: 'stretch', backgroundColor: "white" }} />

          {/* View Mode Toggle Group */}
          <Tooltip title="Grid View">
            <span>
              <IconButton
                onClick={() => handleUpdatePhotoLayout(PhotoLayout.Grid)}
                sx={{
                  backgroundColor: isGridActive ? (theme) => theme.palette.primary.main : 'transparent',
                  color: isGridActive ? '#fff' : (theme) => theme.palette.text.secondary,
                  borderRadius: '6px',
                  '&:hover': {
                    backgroundColor: isGridActive
                      ? (theme) => theme.palette.primary.dark
                      : (theme) => theme.palette.action.hover,
                  },
                }}
              >
                <ViewModuleIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Loupe View">
            <span>
              <IconButton
                onClick={() => handleUpdatePhotoLayout(PhotoLayout.Loupe)}
                sx={{
                  backgroundColor: isLoupeActive ? (theme) => theme.palette.primary.main : 'transparent',
                  color: isLoupeActive ? '#fff' : (theme) => theme.palette.text.secondary,
                  borderRadius: '6px',
                  '&:hover': {
                    backgroundColor: isLoupeActive
                      ? (theme) => theme.palette.primary.dark
                      : (theme) => theme.palette.action.hover,
                  },
                }}
              >
                <ViewComfyIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Survey Mode - Vertical Split">
            <span>
              <IconButton
                onClick={() => handleSetSurveyPhotoLayout(SurveyViewOrientations.Vertical)}
                disabled={isSurveyDisabled}
                sx={{
                  backgroundColor: isSurveyViewVertical ? (theme) => theme.palette.primary.main : 'transparent',
                  color: isSurveyViewVertical ? '#fff' : (theme) => theme.palette.text.secondary,
                  borderRadius: '6px',
                  '&:hover': {
                    backgroundColor: !isSurveyDisabled && isSurveyViewVertical
                      ? (theme) => theme.palette.primary.dark
                      : (theme) => theme.palette.action.hover,
                  },
                }}
              >
                <VerticalSplitIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Survey Mode - Horizontal Split">
            <span>
              <IconButton
                onClick={() => handleSetSurveyPhotoLayout(SurveyViewOrientations.Horizontal)}
                disabled={isSurveyDisabled}
                sx={{
                  backgroundColor: isSurveyViewHorizontal ? (theme) => theme.palette.primary.main : 'transparent',
                  color: isSurveyViewHorizontal ? '#fff' : (theme) => theme.palette.text.secondary,
                  borderRadius: '6px',
                  '&:hover': {
                    backgroundColor: !isSurveyDisabled && isSurveyViewHorizontal
                      ? (theme) => theme.palette.primary.dark
                      : (theme) => theme.palette.action.hover,
                  },
                }}
              >
                <HorizontalSplitIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: 2,
              alignSelf: 'stretch',
              backgroundColor: 'rgba(255, 255, 255, 0.5)', // 50% opacity white
            }}
          />

          <Tooltip title="Full Screen Mode">
            <span>
              <IconButton
                color="inherit"
                onClick={handleEnterFullScreenMode}
              >
                <FullscreenIcon />
              </IconButton>
            </span>
          </Tooltip>

          {/* Divider for better grouping */}
          <Divider orientation="vertical" flexItem sx={{ mx: 2, alignSelf: 'stretch', backgroundColor: "white" }} />

          {/* Export */}
          <Tooltip title="Upload to Google">
            <span>
              <IconButton color="inherit" onClick={() => setShowUploadToGoogleDialog(true)} disabled={props.selectedMediaItemsCount === 0}><UploadIcon /></IconButton>
            </span>
          </Tooltip>

          {/* More Options Menu */}
          <Tooltip title="More Options">
            <IconButton color="inherit" onClick={handleOpenMoreOptionsMenu}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Settings">
            <IconButton onClick={() => setShowSettingsDialog(true)} color="inherit"><SettingsIcon /></IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {renderUploadToGoogleDialog()}
      {renderZoomDialog()}
      {renderSettingsDialog()}
      {renderMovePhotosDialog()}

    </React.Fragment >
  )
}

function mapStateToProps(state: TedTaggerState): TopNavigationBarDerivedStateProps {

  return {
    sidebarOpen: getSidebarOpen(state),
    rightPanelOpen: getRightPanelOpen(state),
    mediaItemIds: getMediaItemIds(state),
    selectedMediaItemIds: getSelectedMediaItemIds(state),
    selectedMediaItems: getSelectedMediaItems(state),
    photoLayout: getPhotoLayout(state),
    numGridColumns: getNumGridColumns(state),
    selectedMediaItemsCount: getSelectedMediaItemsCount(state),
    mediaItems: getMediaItems(state),
    loupeViewMediaItemId: getLoupeViewMediaItemId(state),
    loupeViewMediaItemIds: getLoupeViewMediaItemIds(state),
    surveyViewOrientation: getSurveyViewOrientation(state),
    focusedSurveyViewMediaItemId: getFocusedSurveyViewMediaItemId(state),
    surveyViewMediaItemIds: getSurveyViewMediaItemIds(state),
    displayMetadata: getDisplayMetadata(state),
    fullScreenMode: getFullScreenMode(state),
    mediaContentNodes: getMediaContentTree(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onSetPhotoLayout: setPhotoLayoutRedux,
    onSetLoupeViewMediaItemId: setLoupeViewMediaItemIdRedux,
    onSetFocusedSurveyViewMediaItemId: setFocusedSurveyViewMediaItemId,
    onSetLoupeViewMediaItemIds: setLoupeViewMediaItemIds,
    onSetSurveyViewOrientation: setSurveyViewOrientation,
    onSetSurveyViewMediaItemIds: setSurveyViewMediaItemIds,
    onSetNumGridColumns: setNumGridColumnsRedux,
    onDeselectAllPhotos: deselectAllPhotos,
    onSetPhotoState: setPhotoState,
    onSetAlbumNodeId: setAlbumNodeId,
    onReloadMediaItemsByViewSpec: loadAndReplaceMediaItemsByViewSpec,
    onRemoveLoupeViewMediaItemId: removeLoupeViewMediaItemId,
    onSetDisplayMetadata: setDisplayMetadata,
    onReimportMediaItems: reimportPhotosFromDrive,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TopNavigationBar) as React.FC<any>;
