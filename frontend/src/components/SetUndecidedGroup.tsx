import React from 'react';
import { bindActionCreators } from 'redux';
import { useState } from 'react';
import { connect } from 'react-redux';

import { TextField, Button, Collapse, List, ListItem, ListItemText, Popover, ListItemButton } from "@mui/material";

import { addUndecidedGroup, assignMediaItemsToUndecidedGroup } from '../controllers';
import { TedTaggerDispatch } from '../models';
import { getSelectedMediaItemIds, getDisplayedAlbumNodeIds, getUndecidedGroups, getMediaContentTree } from '../selectors';
import { MediaContentNode, PhotoState, TedTaggerState, UndecidedGroup } from '../types';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

export interface SetUndecidedGroupPropsFromParent {
  open: boolean;
  undecidedGroupEl: HTMLElement | null;
  onHandleSetPhotoState: (photoState: PhotoState) => void;
  onClose: () => void;
}

export interface SetUndecidedGroupDerivedStateProps {
  selectedMediaItemIds: string[];
  displayedAlbumNodeIds: string[];
  albumNodes: MediaContentNode[];
  undecidedGroups: UndecidedGroup[];
  onAddUndecidedGroup: (albumIds: string[], undecidedGroupName: string) => any;
  onAssignMediaItemsToUndecidedGroup: (undecidedGroupId: string, mediaItemIds: string[]) => any;
}

export interface SetUndecidedGroupDerivedActionCreatorProps {
  selectedMediaItemIds: string[];
  displayedAlbumNodeIds: string[];
  albums: MediaContentNode[];
  undecidedGroups: UndecidedGroup[];
  onAddUndecidedGroup: (albumIds: string[], undecidedGroupName: string) => any;
  onAssignMediaItemsToUndecidedGroup: (undecidedGroupId: string, mediaItemIds: string[]) => any;
}

export interface SetUndecidedGroupAllProps extends SetUndecidedGroupDerivedStateProps, SetUndecidedGroupDerivedActionCreatorProps, SetUndecidedGroupPropsFromParent { }

const SetUndecidedGroup: React.FC<any> = (props: SetUndecidedGroupAllProps) => {

  const [undecidedGroupName, setUndecidedGroupName] = useState("");
  const [lastUndecidedGroup, setLastUndecidedGroup] = useState<UndecidedGroup | null>(null);
  const [showOtherAlbums, setShowOtherAlbums] = useState(false);

  React.useEffect(() => {
    if (props.open) {
      setUndecidedGroupName(`${getUndecidedGroupName(props.displayedAlbumNodeIds)}-${props.undecidedGroups.length}`); // Auto-incremented default name
    }
  }, [props.open]);


  const getAlbumById = (albumId: string): MediaContentNode | undefined => {
    return props.albumNodes.find((albumNode: MediaContentNode) => albumNode.id === albumId);
  }

  const getUndecidedGroupName = (albumIds: string[]): string => {
    const names = albumIds
      .map(id => getAlbumById(id))
      .filter((album): album is MediaContentNode => album !== undefined)
      .map(album => album.name);

    return `${names.join('_')}`;
  };

  // Setting photos as Undecided in group: No Group
  // Setting photos as Undecided in group: undecidedGroup-1
  const handleSetUndecided = (undecidedGroup: UndecidedGroup | null) => {
    console.log(`Setting photos as Undecided in group: ${undecidedGroup?.name || "No Group"}`);
    if (undecidedGroup) {
      props.onAssignMediaItemsToUndecidedGroup(undecidedGroup.id, props.selectedMediaItemIds);
      setLastUndecidedGroup(undecidedGroup);
    }
    props.onHandleSetPhotoState(PhotoState.Undecided);
    handleCloseSpecifyUndecidedGroupUI();
  };

  // Create undecidedGroup named: UndecidedGroup-4
  const handleCreateUndecidedGroup = (undecidedGroupName: string) => {
    console.log(`Create undecidedGroup named: ${undecidedGroupName}`);
    props.onAddUndecidedGroup(props.displayedAlbumNodeIds, undecidedGroupName)
      .then((undecidedGroup: UndecidedGroup) => {
        props.onAssignMediaItemsToUndecidedGroup(undecidedGroup.id, props.selectedMediaItemIds);
        setLastUndecidedGroup(undecidedGroup);
        props.onHandleSetPhotoState(PhotoState.Undecided);
        handleCloseSpecifyUndecidedGroupUI();
      });
  };

  const handleCloseSpecifyUndecidedGroupUI = () => {
    setShowOtherAlbums(false);
    props.onClose();
  };

  const buttonStyle = {
    borderRadius: 1,
    border: '1px solid rgba(0, 0, 0, 0.12)',
    cursor: 'pointer',
    transition: 'background-color 0.3s, border 0.3s',
    '&:hover': {
      backgroundColor: 'action.hover',
      border: '1px solid',
      borderColor: 'divider',
    },
  };

  const renderSpecifyUndecidedGroupUI = () => {
    return (
      <Popover
        open={props.open}
        anchorEl={props.undecidedGroupEl}
        onClose={handleCloseSpecifyUndecidedGroupUI}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <List>
          {/* No Group Option */}
          <ListItemButton onClick={() => handleSetUndecided(null)} sx={buttonStyle}>
            <ListItemText primary="Mark as Undecided (No Group)" />
          </ListItemButton>

          {/* Create New Group with Name Input */}
          <ListItem>
            <TextField
              label="New Group Name"
              variant="outlined"
              size="small"
              fullWidth
              value={undecidedGroupName}
              onChange={(e) => setUndecidedGroupName(e.target.value)}
            />
            <Button onClick={() => handleCreateUndecidedGroup(undecidedGroupName)}>
              Create
            </Button>
          </ListItem>

          {/* Add to Last Undecided Group */}
          {lastUndecidedGroup && (
            <ListItemButton onClick={() => handleSetUndecided(lastUndecidedGroup)} sx={buttonStyle}>
              <ListItemText primary={`Add to Last Group: ${lastUndecidedGroup.name}`} />
            </ListItemButton>
          )}

          {/* Expandable Other Groups */}
          <ListItemButton onClick={() => setShowOtherAlbums(!showOtherAlbums)} sx={buttonStyle}>
            <ListItemText primary="Add to Existing Group from Another AlbumNode" />
            {showOtherAlbums ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={showOtherAlbums} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {props.undecidedGroups.map((undecidedGroup: UndecidedGroup) => (
                <ListItemButton
                  key={undecidedGroup.id}
                  onClick={() => handleSetUndecided(undecidedGroup)}
                  sx={{ ...buttonStyle, pl: 4 }}
                >
                  <ListItemText primary={undecidedGroup.name} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </List>
      </Popover>
    );
  };

  return (
    <div>
      {renderSpecifyUndecidedGroupUI()}
    </div>
  );
}

function mapStateToProps(state: TedTaggerState): Partial<SetUndecidedGroupDerivedStateProps> {
  return {
    selectedMediaItemIds: getSelectedMediaItemIds(state),
    displayedAlbumNodeIds: getDisplayedAlbumNodeIds(state),
    albumNodes: getMediaContentTree(state),
    undecidedGroups: getUndecidedGroups(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onAddUndecidedGroup: addUndecidedGroup,
    onAssignMediaItemsToUndecidedGroup: assignMediaItemsToUndecidedGroup,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SetUndecidedGroup) as React.FC<any>;
