import React from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { List, ListItemText, Divider, Typography, Box, Drawer, IconButton, styled, ListItemButton, Checkbox, FormControlLabel } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import CloudDoneIcon from '@mui/icons-material/CloudDone';
// import DeleteIcon from '@mui/icons-material/Delete';
// import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import MergePeopleDialog from './MergePeopleDialog';
import RetrievePeopleDialog from "./RetrievePeopleDialog";
import { deleteUndecidedGroup, getAlbumNamesWherePeopleNotRetrieved, mergePeopleTakeout, reloadMediaItemsByViewSpec, setPhotoState } from "../controllers";
import CheckboxListSelector from "./CheckboxListSelector";
import { Album, PhotoState, UndecidedGroup } from "../types";
import { setDisplayedAlbumIds, setDisplayedPhotoStates, setDisplayedUndecidedGroupIds, setGroupUndecidedPhotos, TedTaggerDispatch } from "../models";
import { getDisplayedAlbumIds, getDisplayedPhotoStates, getDisplayedUndecidedGroupIds, getDisplayedUndecidedGroups, getGroupUndecidedPhotos, getAlbums, getUndecidedGroups } from "../selectors";
import AlbumExpandableList from "./AlbumExpandableList";

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export interface SidebarPropsFromParent {
  open: boolean;
  onClose: () => void;
}

export interface SidebarProps extends SidebarPropsFromParent {
  displayedAlbumIds: string[];
  displayedPhotoStates: string[];
  groupUndecidedPhotos: boolean;
  displayedUndecidedGroupIds: string[];
  displayedUndecidedGroups: UndecidedGroup[];
  albums: Album[];
  undecidedGroups: UndecidedGroup[];
  onSetDisplayedPhotoStates: (displayedPhotoStates: PhotoState[]) => void;
  onSetPhotoState: (mediaItemIds: string[], photoState: PhotoState) => void;
  onSetDisplayedAlbumIds: (displayedAlbumIds: string[]) => void;
  onReloadMediaItemsByViewSpec: () => any;
  onSetGroupUndecidedPhotos: (groupUndecidedPhotos: boolean) => void;
  onSetDisplayedUndecidedGroupIds: (displayedUndecidedGroupIds: string[]) => void;
  onDeleteUndecidedGroup: (undecidedGroupId: string) => void;
}

const Sidebar: React.FC<any> = (props: any) => {

  const { open, onClose } = props;

  const [showMergePeopleDialog, setShowMergePeopleDialog] = React.useState(false);
  const [showRetrievePeopleDialog, setShowRetrievePeopleDialog] = React.useState(false);
  const [mergingPeople, setMergingPeople] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const getAlbumById = (albumId: string): Album | undefined => {
    return props.albums.find((album: Album) => album.albumId === albumId);
  }

  const getUndecidedGroupName = (albumIds: string[]): string => {
    const names = albumIds
      .map(id => getAlbumById(id))
      .filter((album): album is Album => album !== undefined)
      .map(album => album.albumName);

    return `${names.join('_')}`;
  };

  const getGroupedUndecidedGroups = (): Record<string, UndecidedGroup[]> => {
    const groupedUndecidedGroups: Record<string, UndecidedGroup[]> = {};

    const undecidedGroups: UndecidedGroup[] = props.undecidedGroups;

    for (const undecidedGroup of undecidedGroups) {
      const undecidedGroupNamePrefix = getUndecidedGroupName(undecidedGroup.albumIds);
      if (!groupedUndecidedGroups[undecidedGroupNamePrefix]) {
        groupedUndecidedGroups[undecidedGroupNamePrefix] = [];
      }
      groupedUndecidedGroups[undecidedGroupNamePrefix].push(undecidedGroup);
    }

    return groupedUndecidedGroups;
  };

  const handleRetrievePeople = async () => {
    console.log('handleRetrievePeople');
    const albumNames = await getAlbumNamesWherePeopleNotRetrieved();
    console.log('albumNames', albumNames);
  };

  const handleCloseMergePeopleDialog = () => {
    setShowMergePeopleDialog(false);
  };

  const handleMergePeople = async (albumName: string) => {
    console.log('handleMergePeople',
      albumName);

    mergePeopleTakeout(albumName).then((response) => {
      console.log('mergePeopleTakeout response', response);
    });
  }

  const handleCloseRetrievePeopleDialog = () => {
    setShowRetrievePeopleDialog(false);
  };

  const handleAlbumChange = (selectedAlbumIds: string[]) => {
    props.onSetDisplayedAlbumIds(selectedAlbumIds);
    props.onReloadMediaItemsByViewSpec();
    localStorage.setItem('displayedAlbumIds', selectedAlbumIds.join(','));
  };

  const handlePhotoStatesToViewChange = (selectedPhotoStates: PhotoState[]) => {
    props.onSetDisplayedPhotoStates(selectedPhotoStates);
    props.onReloadMediaItemsByViewSpec();
    localStorage.setItem('displayedPhotoStates', selectedPhotoStates.join(','));
  };

  const handleGroupUndecidedPhotosToggle = () => {
    const newGroupUndecidedPhotos = !props.groupUndecidedPhotos;
    props.onSetGroupUndecidedPhotos(newGroupUndecidedPhotos);
    props.onReloadMediaItemsByViewSpec();
  }

  function handleUndecidedGroupToggle(selectedUndecidedGroups: UndecidedGroup[]): void {
    const selectedUndecidedGroupIds: string[] = selectedUndecidedGroups.map((group) => group.id);
    props.onSetDisplayedUndecidedGroupIds(selectedUndecidedGroupIds);
    props.onReloadMediaItemsByViewSpec();
  }

  const handleDeleteUndecidedGroup = (undecidedGroup: UndecidedGroup) => {
    console.log('Sidebar: handleDeleteUndecidedGroup', undecidedGroup);
    props.onDeleteUndecidedGroup(undecidedGroup.id);
  }

  const renderAlbumsToDisplayChooser = () => {
    return (
      <React.Fragment>
        <Typography variant="subtitle1" sx={{ px: 2, mt: 2 }}>Albums</Typography>
        <Box>
          {props.albums.length === 0 ? (
            <Typography variant="body2">No Albums Available</Typography>
          ) : (
            <Box>
              <CheckboxListSelector
                label="Select Albums"
                items={props.albums}
                selectedItems={props.albums.filter((set: Album) => props.displayedAlbumIds.includes(set.albumId))}
                getItemLabel={(item: Album) => item.albumName}
                onChange={(selected) => handleAlbumChange(selected.map((set: Album) => set.albumId))}
                maxHeight={350}
              />
            </Box>
          )}
        </Box>
      </React.Fragment>
    )
  };

  const renderPhotoStatesToDisplayChooser = () => {

    // Define photo states with icons
    const photoStateOptions = [
      { label: "Unreviewed", value: PhotoState.Unreviewed, icon: "●" },
      { label: "Ready for Upload", value: PhotoState.ReadyForUpload, icon: "☁" },
      { label: "Uploaded", value: PhotoState.Uploaded, icon: "✅" },
      { label: "Deleted", value: PhotoState.Deleted, icon: "🗑️" },
      { label: "Undecided", value: PhotoState.Undecided, icon: "❓" },
    ];
    // const photoStateOptions = [
    //   { label: "Unreviewed", value: PhotoState.Unreviewed, icon: <HourglassEmptyIcon /> },
    //   { label: "Ready for Upload", value: PhotoState.ReadyForUpload, icon: <CloudUploadIcon /> },
    //   { label: "Uploaded", value: PhotoState.Uploaded, icon: <CloudDoneIcon /> },
    //   { label: "Deleted", value: PhotoState.Deleted, icon: <DeleteIcon /> },
    //   { label: "Undecided", value: PhotoState.Undecided, icon: <HelpOutlineIcon /> },
    // ];

    // Currently selected photo states
    const selectedPhotoStates = photoStateOptions.filter((set) =>
      props.displayedPhotoStates.includes(set.value)
    );

    const groupedUndecidedGroups = getGroupedUndecidedGroups();

    return (
      <React.Fragment>
        <Typography variant="subtitle1" sx={{ px: 2, mt: 2 }}>
          Photo States
        </Typography>

        <Box sx={{ px: 0 }}>

          <CheckboxListSelector
            label="Photo States"
            items={photoStateOptions}
            selectedItems={selectedPhotoStates}
            getItemLabel={(item) => `${item.icon} ${item.label}`} // Ensuring icons display correctly
            onChange={(photoStates) =>
              handlePhotoStatesToViewChange(photoStates.map((photoState) => photoState.value))
            }
          />

          {props.undecidedGroups && (props.undecidedGroups.length > 0) && props.displayedPhotoStates.includes(PhotoState.Undecided) && (<FormControlLabel
            control={
              <Checkbox
                checked={props.groupUndecidedPhotos}
                onChange={handleGroupUndecidedPhotosToggle}
              />
            }
            label='Specify groups'
            sx={{ "marginTop": '-16px', 'marginLeft': '24px', "& .MuiFormControlLabel-label": { fontSize: "0.85rem" } }}
          />
          )}

          {props.displayedPhotoStates.includes(PhotoState.Undecided) && props.groupUndecidedPhotos && (
            <div>
              <AlbumExpandableList
                groupedUndecidedGroups={groupedUndecidedGroups}
                onUndecidedGroupToggle={handleUndecidedGroupToggle}
                onDeleteUndecidedGroup={handleDeleteUndecidedGroup}
              />
            </div>
          )}
        </Box>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={() => onClose()}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List
          dense
          sx={{ '& .MuiListItemButton-root': { py: 0 }, '& .MuiCheckbox-root': { py: 0.25 } }}
        >
          <ListItemButton
            onClick={() => setShowRetrievePeopleDialog(true)}
            sx={{
              mx: 1,
              border: '1px solid',
              borderColor: 'primary.main',
              borderRadius: 1,
              color: 'primary.main', // sets the text color for the button
              '&:hover': {
                borderColor: 'primary.dark',
                color: 'primary.dark'
              }
            }}
          >
            <ListItemText
              primary="Albums without People"
              primaryTypographyProps={{ sx: { fontSize: '16px', color: 'inherit' } }}
            />
          </ListItemButton>

          <ListItemButton
            onClick={() => setShowMergePeopleDialog(true)}
            sx={{
              mx: 1,
              border: '1px solid',
              borderColor: 'primary.main',
              borderRadius: 1, // Optional: adds rounded corners
              color: 'primary.main', // sets the text color for the button
              '&:hover': {
                borderColor: 'primary.dark',
                color: 'primary.dark'
              }
            }}
          >
            <ListItemText
              primary="Merge People"
              primaryTypographyProps={{ sx: { fontSize: '16px' } }}
            />
          </ListItemButton>

          <Divider sx={{ my: 2 }} />

          {renderAlbumsToDisplayChooser()}

          {renderPhotoStatesToDisplayChooser()}
        </List>

      </Drawer>
      <MergePeopleDialog
        open={showMergePeopleDialog}
        onMergePeople={handleMergePeople}
        onClose={handleCloseMergePeopleDialog}
      />
      <RetrievePeopleDialog
        open={showRetrievePeopleDialog}
        onClose={handleCloseRetrievePeopleDialog}
      />
    </React.Fragment>
  );
};

function mapStateToProps(state: any): any {
  return {
    undecidedGroups: getUndecidedGroups(state),
    groupUndecidedPhotos: getGroupUndecidedPhotos(state),
    displayedAlbumIds: getDisplayedAlbumIds(state),
    displayedPhotoStates: getDisplayedPhotoStates(state),
    displayedUndecidedGroups: getDisplayedUndecidedGroups(state),
    displayedUndecidedGroupIds: getDisplayedUndecidedGroupIds(state),
    albums: getAlbums(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onSetPhotoState: setPhotoState,
    onSetDisplayedAlbumIds: setDisplayedAlbumIds,
    onSetDisplayedPhotoStates: setDisplayedPhotoStates,
    onSetGroupUndecidedPhotos: setGroupUndecidedPhotos,
    onSetDisplayedUndecidedGroupIds: setDisplayedUndecidedGroupIds,
    onReloadMediaItemsByViewSpec: reloadMediaItemsByViewSpec,
    onDeleteUndecidedGroup: deleteUndecidedGroup,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar) as React.FC<any>;

// 67dea903a4b3f742c25fedd8