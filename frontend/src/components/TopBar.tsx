import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Grid, Card, CardMedia, Button, TextField, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import SettingsIcon from "@mui/icons-material/Settings";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

const TopBar: React.FC = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleViewModeChange = (mode: string) => {
    setViewMode(mode);
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, p: 1 }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Shafferography
        </Typography>

        {/* Search Bar */}
        <Box sx={{ display: "flex", alignItems: "center", mx: 2 }}>
          <SearchIcon />
          <TextField variant="outlined" size="small" placeholder="Search photos..." sx={{ ml: 1, backgroundColor: "white", borderRadius: 1 }} />
        </Box>

        {/* View Mode Toggle */}
        <IconButton color="inherit" onClick={handleMenuOpen}>
          <ViewModuleIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleViewModeChange("grid")}><ViewModuleIcon /> Grid View</MenuItem>
          <MenuItem onClick={() => handleViewModeChange("loupe")}><ViewComfyIcon /> Loupe View</MenuItem>
          <MenuItem onClick={() => handleViewModeChange("survey")}><ViewCarouselIcon /> Survey Mode</MenuItem>
          <MenuItem onClick={() => handleViewModeChange("fullscreen")}><FullscreenIcon /> Full Screen</MenuItem>
        </Menu>

        {/* Import Button */}
        <IconButton color="inherit">
          <ImportExportIcon />
        </IconButton>

        {/* Settings/Profile */}
        <IconButton color="inherit">
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
