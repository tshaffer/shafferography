import React from 'react';
import { Box, Typography, Card, CardContent, Divider, IconButton, Tooltip, MenuItem, Select, FormControl, InputLabel, Button, styled, Drawer } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LabelIcon from "@mui/icons-material/Label";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { MediaItem } from "../types";

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface RightPanelProps {
  selectedMediaItems: MediaItem[];
  open: boolean;
  onClose: () => void;
}

const RightPanel: React.FC<RightPanelProps> = (props: RightPanelProps) => {

  const { open, onClose } = props;

  if (props.selectedMediaItems.length === 0) return null;

  const firstPhoto = props.selectedMediaItems[0];

  console.log("RightPanel Render - Open:", open);

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

      <Box sx={{ width: 300, p: 2, borderLeft: "1px solid #ddd", backgroundColor: "#f9f9f9", position: "relative" }}>
        <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6">Photo Details</Typography>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1">Filename: {firstPhoto.filePath}</Typography>
            <Typography variant="body2">Dimensions: {firstPhoto.width} x {firstPhoto.height}</Typography>
            {/* <Typography variant="body2">Date Taken: {firstPhoto.dateTaken}</Typography>
          <Typography variant="body2">Location: {firstPhoto.location || "Unknown"}</Typography> */}
          </CardContent>
        </Card>
        <Divider sx={{ my: 2 }} />
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
            <MenuItem value="Uploaded To Google">Uploaded To Google</MenuItem>
          </Select>
        </FormControl>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Quick Actions</Typography>
        <Box sx={{ display: "flex", gap: 1, my: 1 }}>
          <Tooltip title="Upload to Google Photos">
            <IconButton color="success">
              <CloudUploadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Drawer>
  );
};

export default RightPanel;
