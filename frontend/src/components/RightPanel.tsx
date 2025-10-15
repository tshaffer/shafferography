import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Box, Typography, Card, CardContent, Divider, IconButton, Tooltip,
  MenuItem, Select, FormControl, InputLabel, Button, styled, Drawer, TextField
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LabelIcon from "@mui/icons-material/Label";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { MediaItem } from "../types";
import { setMediaItemNotesRedux, TedTaggerDispatch } from '../models';
import { getMediaItemNotes } from '../selectors';
import { drawerWidth } from '../constants';
import { setMediaItemNotes } from '../controllers';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export interface RightPanelPropsFromParent {
  mediaItem: MediaItem;
  open: boolean;
  onClose: () => void;
}

export interface RightPanelDerivedStateProps {
  notes: string | undefined;
}

export interface RightPanelDerivedActionCreatorProps {
  onSetMediaItemNotes: (uniqueId: string, notes: string) => void;
}

export interface RightPanelAllProps extends RightPanelDerivedStateProps, RightPanelDerivedActionCreatorProps, RightPanelPropsFromParent { }

const RightPanel: React.FC<RightPanelAllProps> = (props: RightPanelAllProps) => {
  const { open, onClose } = props;

  // Use local state for notes to avoid updating Redux on every keystroke.
  const [localNotes, setLocalNotes] = React.useState(props.notes || "");

  // Sync local state when props.notes changes
  React.useEffect(() => {
    setLocalNotes(props.notes || "");
  }, [props.notes]);

  if (!props.mediaItem) {
    return null; // or some loading state
  }

  return (
    <Drawer
      sx={{
        width: open ? drawerWidth : 0,  // Only apply width when open
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="right"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={() => onClose()}>
          <ChevronRightIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />

      <Box id='rightPanelBox' sx={{ width: drawerWidth, p: 2, borderLeft: "1px solid #ddd", backgroundColor: "#f9f9f9", position: "relative" }}>
        <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6">Photo Details</Typography>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1">Filename: {props.mediaItem.fileName}</Typography>
            <Typography variant="body2">Dimensions: {props.mediaItem.exif.width} x {props.mediaItem.exif.height}</Typography>
          </CardContent>
        </Card>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Notes</Typography>
        <TextField
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={localNotes}
          onChange={(e) => setLocalNotes(e.target.value)}
          onBlur={() => props.onSetMediaItemNotes(props.mediaItem.uniqueId, localNotes)}
          sx={{ my: 2 }}
        />
        {/* <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Assigned Keywords</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 1 }}>
          <Tooltip title="Assign Keywords">
            <IconButton color="primary">
              <LabelIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="body2">(Click to assign keywords)</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Review Level</Typography>
        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel>Review Level</InputLabel>
          <Select defaultValue="Unreviewed">
            <MenuItem value="Unreviewed">Unreviewed</MenuItem>
            <MenuItem value="Ready For Review">Ready For Review</MenuItem>
            <MenuItem value="Ready For Upload">Ready For Upload</MenuItem>
          </Select>
        </FormControl>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Quick Actions</Typography>
        <Box sx={{ display: "flex", gap: 1, my: 1 }}>
          <Tooltip title="Delete">
            <IconButton color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box> */}
      </Box>
    </Drawer>
  );
};

function mapStateToProps(state: any, ownProps: RightPanelPropsFromParent): Partial<RightPanelDerivedStateProps> {
  return {
    notes: ownProps.mediaItem ? getMediaItemNotes(state, ownProps.mediaItem.uniqueId) : "",
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onSetMediaItemNotes: setMediaItemNotes,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(RightPanel);
