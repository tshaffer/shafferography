import React from 'react';
import { Box, Typography, Card, CardContent, Divider, IconButton, Tooltip, MenuItem, Select, FormControl, InputLabel, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LabelIcon from "@mui/icons-material/Label";
import StarIcon from "@mui/icons-material/Star";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { MediaItem } from "../types";

interface RightPanelProps {
  selectedMediaItems: MediaItem[];
}

const RightPanel: React.FC<RightPanelProps> = ({ selectedMediaItems }) => {
  if (selectedMediaItems.length === 0) return null;

  const firstPhoto = selectedMediaItems[0];

  return (
    <Box sx={{ width: 300, p: 2, borderLeft: "1px solid #ddd", backgroundColor: "#f9f9f9" }}>
      <Typography variant="h6">Photo Details</Typography>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1">Filename: {firstPhoto.fileName}</Typography>
          <Typography variant="body2">Dimensions: {firstPhoto.width} x {firstPhoto.height}</Typography>
          <Typography variant="body2">Date Taken: {firstPhoto.creationTime}</Typography>
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
  );
};

export default RightPanel;
