import React from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { List, ListItem, ListItemText, Divider, Typography, Box, Drawer, IconButton, styled, ListItemButton } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import MergePeopleDialog from './MergePeopleDialog';
import RetrievePeopleDialog from "./RetrievePeopleDialog";
import { getAlbumNamesWherePeopleNotRetrieved, mergePeopleTakeout, reloadMediaItemsByViewSpec, setPhotoState } from "../controllers";
import CheckboxListSelector from "./CheckboxListSelector";
import { PhotoSet, PhotoState, PhotoStateOption } from "../types";
import { setDisplayedPhotoSetIds, setDisplayedPhotoStates, TedTaggerDispatch } from "../models";
import { getDisplayedPhotoSetIds, getDisplayedPhotoStates, getPhotoSets } from "../selectors";
import { photoStateOptions } from "../constants";

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
  displayedPhotoSetIds: string[];
  displayedPhotoStates: string[];
  photoSets: PhotoSet[];
  onSetDisplayedPhotoStates: (displayedPhotoStates: PhotoState[]) => void;
  onSetPhotoState: (mediaItemIds: string[], photoState: PhotoState) => void;
  onSetDisplayedPhotoSetIds: (displayedPhotoSetIds: string[]) => void;
  onReloadMediaItemsByViewSpec: () => any;
}

const Sidebar: React.FC<any> = (props: any) => {

  const { open, onClose } = props;

  const [showMergePeopleDialog, setShowMergePeopleDialog] = React.useState(false);
  const [showRetrievePeopleDialog, setShowRetrievePeopleDialog] = React.useState(false);
  const [mergingPeople, setMergingPeople] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

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

  const handlePhotoSetChange = (selectedPhotoSetIds: string[]) => {
    props.onSetDisplayedPhotoSetIds(selectedPhotoSetIds);
    props.onReloadMediaItemsByViewSpec();
    localStorage.setItem('displayedPhotoSetIds', selectedPhotoSetIds.join(','));
  };

  const handlePhotoStatesToViewChange = (selectedPhotoStates: PhotoState[]) => {
    props.onSetDisplayedPhotoStates(selectedPhotoStates);
    props.onReloadMediaItemsByViewSpec();
    localStorage.setItem('displayedPhotoStates', selectedPhotoStates.join(','));
  };

  const renderPhotoSetsToDisplayChooser = () => {
    return (
      <React.Fragment>
        <Typography variant="subtitle1" sx={{ px: 2, mt: 2 }}>Photo Sets</Typography>
        <Box>
          {props.photoSets.length === 0 ? (
            <Typography variant="body2">No Photo Sets Available</Typography>
          ) : (
            <Box>
              <CheckboxListSelector
                label="Select Photo Sets"
                items={props.photoSets}
                selectedItems={props.photoSets.filter((set: PhotoSet) => props.displayedPhotoSetIds.includes(set.photoSetId))}
                getItemLabel={(item: PhotoSet) => item.photoSetName}
                onChange={(selected) => handlePhotoSetChange(selected.map((set: PhotoSet) => set.photoSetId))}
              />
            </Box>
          )}
        </Box>
      </React.Fragment>
    )
  };

  const renderPhotoStatesToDisplayChooser = () => {
    return (
      <React.Fragment>
        <Typography variant="subtitle1" sx={{ px: 2, mt: 2 }}>Photo States</Typography>
        <Box>
          <CheckboxListSelector
            label="Photo States"
            items={photoStateOptions}
            selectedItems={photoStateOptions.filter((set: PhotoStateOption) => props.displayedPhotoStates.includes(set.value))}
            getItemLabel={(item) => item.label}
            onChange={(photoStates: PhotoStateOption[]) => handlePhotoStatesToViewChange(photoStates.map((photoStateOption: PhotoStateOption) => photoStateOption.value))}
          />
        </Box>
      </React.Fragment>
    )
  }

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
        <List>

          <ListItemButton onClick={() => setShowRetrievePeopleDialog(true)}>
            <ListItemText primary="Retrieve Albums without People" />
          </ListItemButton>

          <ListItemButton onClick={() => setShowMergePeopleDialog(true)}>
            <ListItemText primary="Merge People" />
          </ListItemButton>
          {/* <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1">Keywords</Typography>
          <ListItem button>
            <ListItemText primary="+ Add Keyword" />
          </ListItem> */}

          <Divider sx={{ my: 2 }} />

          {/* Photo Set Selection */}
          {renderPhotoSetsToDisplayChooser()}

          {/* Photo State Selection */}
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
    displayedPhotoSetIds: getDisplayedPhotoSetIds(state),
    displayedPhotoStates: getDisplayedPhotoStates(state),
    photoSets: getPhotoSets(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onSetDisplayedPhotoSetIds: setDisplayedPhotoSetIds,
    onReloadMediaItemsByViewSpec: reloadMediaItemsByViewSpec,
    onSetDisplayedPhotoStates: setDisplayedPhotoStates,
    onSetPhotoState: setPhotoState,

  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar) as React.FC<any>;
