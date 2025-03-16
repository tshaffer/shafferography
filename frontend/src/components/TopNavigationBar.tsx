import React from 'react';
import { bindActionCreators } from 'redux';
import { useState } from 'react';
import { connect } from 'react-redux';

import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Toolbar, IconButton, Typography, Box, TextField, Tooltip, Divider, styled, Button, Dialog, DialogContent, DialogTitle, Slider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import LabelIcon from "@mui/icons-material/Label";
import ClearIcon from "@mui/icons-material/Clear";
import DownloadIcon from '@mui/icons-material/Download';
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

import { deselectAllPhotos, loadAndReplaceMediaItemsByViewSpec, reloadMediaItemsByViewSpec, setPhotoState } from '../controllers';
import { TedTaggerDispatch, setNumGridColumnsRedux, setPhotoLayoutRedux, setLoupeViewMediaItemIdRedux, setLoupeViewMediaItemIds } from '../models';
import { getNumGridColumns, getSelectedMediaItemsCount, getMediaItems, getMediaItemIds, getSelectedMediaItemIds, getSelectedMediaItems, getPhotoLayout, getDisplayedPhotoSetIds, getPhotoSets, getDisplayedPhotoStates } from '../selectors';
import { MediaItem, PhotoLayout, PhotoSet, PhotoState } from '../types';
import ImportFromDriveDialog from './ImportFromDriveDialog';
import UploadToGoogleDialog from './UploadToGoogleDialog';

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
  sidebarOpen: boolean;
  onOpenSidebar: () => void;
  rightPanelOpen: boolean;
  toggleRightPanel: () => void;
  selectedItemsCount: number;
}

export interface TopNavigationBarProps extends TopNavigationBarPropsFromParent {
  mediaItemIds: string[];
  selectedMediaItems: MediaItem[];
  selectedMediaItemIds: string[];
  photoLayout: PhotoLayout;
  numGridColumns: number;
  selectedMediaItemsCount: number;
  displayedPhotoSetIds: string[];
  displayedPhotoStates: string[];
  photoSets: PhotoSet[];

  onSetPhotoLayout: (photoLayout: PhotoLayout) => void;
  onSetLoupeViewMediaItemId: (id: string) => any;
  onSetLoupeViewMediaItemIds: (mediaItemIds: string[]) => any;
  onSetNumGridColumns: (numGridColumns: number) => void;
  onDeselectAllPhotos: () => void;
  onReloadMediaItemsByPhotoStates: (photoStates: PhotoState[]) => void;
  onSetPhotoState: (mediaItemIds: string[], photoState: PhotoState) => void;
  onReloadMediaItemsByViewSpec: () => any;
}

const TopNavigationBar: React.FC<any> = (props) => {

  const [isZoomDialogOpen, setIsZoomDialogOpen] = useState(false);
  const [showImportFromDriveDialog, setShowImportFromDriveDialog] = React.useState(false);
  const [showUploadToGoogleDialog, setShowUploadToGoogleDialog] = React.useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [uploadingToGoogle, setUploadingToGoogle] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const getShafferographyPaddingLeft = (): any => {
    if (props.sidebarOpen) {
      return '240px';
    } else {
      return 0;
    }
  }

  const handleCloseImportFromDriveDialog = () => {
    setShowImportFromDriveDialog(false);
  };

  const handleCloseUploadToGoogleDialogDialog = () => {
    setShowUploadToGoogleDialog(false);
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

      // set loupeViewMediaItemId and loupeViewMediaItemIds based on current selection state
      if (props.selectedMediaItemIds.length === 0) {    // not a real scenario but just in case.
        props.onSetLoupeViewMediaItemId(props.mediaItemIds[0]);
        props.onSetLoupeViewMediaItemIds(props.mediaItemIds);
      } else if (props.selectedMediaItemIds.length === 1) {
        props.onSetLoupeViewMediaItemId(props.selectedMediaItemIds[0]);
        props.onSetLoupeViewMediaItemIds(props.mediaItemIds);
      } else {
        props.onSetLoupeViewMediaItemId(props.selectedMediaItemIds[0]);
        props.onSetLoupeViewMediaItemIds(props.selectedMediaItemIds);
      }

      props.onSetPhotoLayout(PhotoLayout.Loupe);

    } else {
      props.onSetPhotoLayout(photoLayout);
    }
  }

  const handleSetPhotoState = (photoState: PhotoState) => {
    props.onSetPhotoState(props.selectedMediaItemIds, photoState)
      // .then(() => {
      //   props.onReloadMediaItemsByViewSpec();
      // });
  }

  const handleDeletePhotos = () => {
    props.onDeselectAllPhotos();
    handleSetPhotoState(PhotoState.Deleted);
  }

  const handleEnterFullScreenMode = () => {
    const elem = document.getElementById('loupeViewImage');
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

  const renderImportFromDriveDialog = (): JSX.Element => {
    return (
      <ImportFromDriveDialog
        open={showImportFromDriveDialog}
        onClose={handleCloseImportFromDriveDialog}
      />
    );
  }

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

          {/* Selection Count & Actions */}
          {props.selectedMediaItemsCount > 0 && (
            <React.Fragment>
              <Tooltip title="Deselect All">
                <span>
                  <IconButton color="inherit" onClick={props.onDeselectAllPhotos} disabled={(props.selectedMediaItemsCount === 0) || (props.photoLayout !== PhotoLayout.Grid)}><ClearIcon /></IconButton>
                </span>
              </Tooltip>
              <Typography variant="subtitle1" sx={{ mx: 2 }}>{props.selectedMediaItemsCount} selected</Typography>
            </React.Fragment>
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

          <Tooltip title="Assign Keywords">
            <span>
              <IconButton color="inherit" disabled={props.selectedMediaItemsCount === 0}><LabelIcon /></IconButton>
            </span>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ mx: 2, alignSelf: 'stretch', backgroundColor: "white" }} />
          <Tooltip title="Set Unreviewed">
            <span>
              <IconButton
                color="inherit"
                onClick={() => handleSetPhotoState(PhotoState.Unreviewed)}
                disabled={props.selectedMediaItemsCount === 0}
              >
                <MoreHoriz />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Set Undecided">
            <span>
              <IconButton
                color="inherit"
                onClick={() => handleSetPhotoState(PhotoState.Undecided)}
                disabled={props.selectedMediaItemsCount === 0}
              >
                <HelpOutline />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Set Ready for Upload">
            <span>
              <IconButton
                color="inherit"
                onClick={() => handleSetPhotoState(PhotoState.ReadyForUpload)}
                disabled={props.selectedMediaItemsCount === 0}
              >
                <CloudUpload />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Set Uploaded">
            <span>
              <IconButton
                color="inherit"
                onClick={() => handleSetPhotoState(PhotoState.Uploaded)}
                disabled={props.selectedMediaItemsCount === 0}
              >
                <CloudDone />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Delete Selected Photos">
            <span>
              <IconButton
                color="inherit"
                onClick={handleDeletePhotos}
                disabled={props.selectedMediaItemsCount === 0}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>

          {/* Divider for better grouping */}
          <Divider orientation="vertical" flexItem sx={{ mx: 2, alignSelf: 'stretch', backgroundColor: "white" }} />

          {/* View Mode Toggle Group */}
          <Tooltip title="Grid View">
            <IconButton color="inherit" onClick={() => handleUpdatePhotoLayout(PhotoLayout.Grid)}><ViewModuleIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Loupe View">
            <span>
              <IconButton color="inherit" onClick={() => handleUpdatePhotoLayout(PhotoLayout.Loupe)} disabled={props.selectedMediaItemsCount === 0}><ViewComfyIcon /></IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Survey Mode">
            <span>
              <IconButton color="inherit" onClick={() => handleUpdatePhotoLayout(PhotoLayout.Survey)} disabled={props.selectedMediaItemsCount < 2}><ViewCarouselIcon /></IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Full Screen">
            <span>
              <IconButton color="inherit" onClick={() => handleEnterFullScreenMode()} disabled={props.photoLayout !== PhotoLayout.Loupe}><FullscreenIcon /></IconButton>
            </span>
          </Tooltip>

          {/* Divider for better grouping */}
          <Divider orientation="vertical" flexItem sx={{ mx: 2, alignSelf: 'stretch', backgroundColor: "white" }} />

          {/* Import/Export */}
          <Tooltip title="Import from Drive">
            <IconButton color="inherit" onClick={() => setShowImportFromDriveDialog(true)}><DownloadIcon /></IconButton>
          </Tooltip>
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
            <IconButton color="inherit"><SettingsIcon /></IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {renderImportFromDriveDialog()}
      {renderUploadToGoogleDialog()}
      {renderZoomDialog()}

    </React.Fragment >
  )
}

function mapStateToProps(state: any): any {

  return {
    mediaItemIds: getMediaItemIds(state),
    selectedMediaItemIds: getSelectedMediaItemIds(state),
    selectedMediaItems: getSelectedMediaItems(state),
    photoLayout: getPhotoLayout(state),
    numGridColumns: getNumGridColumns(state),
    selectedMediaItemsCount: getSelectedMediaItemsCount(state),
    displayedPhotoSetIds: getDisplayedPhotoSetIds(state),
    displayedPhotoStates: getDisplayedPhotoStates(state),
    photoSets: getPhotoSets(state),
    mediaItems: getMediaItems(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onSetPhotoLayout: setPhotoLayoutRedux,
    onSetLoupeViewMediaItemId: setLoupeViewMediaItemIdRedux,
    onSetLoupeViewMediaItemIds: setLoupeViewMediaItemIds,
    onSetNumGridColumns: setNumGridColumnsRedux,
    onDeselectAllPhotos: deselectAllPhotos,
    onSetPhotoState: setPhotoState,
    onReloadMediaItemsByViewSpec: loadAndReplaceMediaItemsByViewSpec,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TopNavigationBar) as React.FC<any>;
