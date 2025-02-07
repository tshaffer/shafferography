import React from "react";
import { Typography, Box, Button, Toolbar } from "@mui/material";

const SelectionToolbar: React.FC<{ selectedPhotos: number[]; setSelectedPhotos: (photos: number[]) => void }> = ({ selectedPhotos, setSelectedPhotos }) => {
  if (selectedPhotos.length === 0) return null;

  return (
    <Toolbar sx={{ backgroundColor: "#f5f5f5", display: "flex", justifyContent: "space-between", p: 2 }}>
      <Typography variant="subtitle1">{selectedPhotos.length} selected</Typography>
      <Box>
        <Button variant="contained" color="primary">Assign Keywords</Button>
        <Button variant="contained" color="secondary" sx={{ ml: 2 }}>Set Review Level</Button>
        <Button variant="outlined" color="error" sx={{ ml: 2 }} onClick={() => setSelectedPhotos([])}>Deselect All</Button>
      </Box>
    </Toolbar>
  );
};

export default SelectionToolbar;
