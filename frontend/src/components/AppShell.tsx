import React, { useEffect, useState } from "react";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Toolbar, IconButton, Typography, Box, TextField, CssBaseline, Tooltip, Divider, Button, Dialog, DialogContent, DialogTitle, Slider, Drawer, styled } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import SettingsIcon from "@mui/icons-material/Settings";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import LabelIcon from "@mui/icons-material/Label";
import StarIcon from "@mui/icons-material/Star";
import ClearIcon from "@mui/icons-material/Clear";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PhotoGrid from "./PhotoGrid";
import Sidebar from "./Sidebar";

const drawerWidth = 240;

type ViewMode = "grid" | "loupe" | "survey" | "fullscreen";

const photos = [
  { id: 1, src: "/images/J&M-2.jpg" },
  { id: 2, src: "/images/J&M-3.jpg" },
  { id: 3, src: "/images/J&M-4.jpg" },
  { id: 4, src: "/images/J&M-5.jpg" },
  { id: 5, src: "/images/J&M-10.jpg" },
  { id: 6, src: "/images/J&M-11.jpg" },
  { id: 7, src: "/images/J&M-12.jpg" },
  { id: 8, src: "/images/J&M-13.jpg" },
  { id: 9, src: "/images/J&M-14.jpg" },
  { id: 11, src: "/images/J&M-15.jpg" },
  { id: 12, src: "/images/J&M-16.jpg" },
  { id: 13, src: "/images/J&M-17.jpg" },
  { id: 14, src: "/images/J&M-18.jpg" },
  { id: 15, src: "/images/J&M-19.jpg" },
  { id: 16, src: "/images/J&M-20.jpg" },
  { id: 17, src: "/images/J&M-21.jpg" },
  { id: 18, src: "/images/J&M-22.jpg" },
  { id: 19, src: "/images/J&M-23.jpg" },
  { id: 20, src: "/images/J&M-24.jpg" },
  { id: 21, src: "/images/J&M-25.jpg" },
];

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


const AppShell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [loupeIndex, setLoupeIndex] = useState<number>(0);
  const [magnificationFactor, setMagnificationFactor] = useState(1.0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (viewMode === "loupe") {
      if (selectedPhotos.length === 1) {
        console.log('useEffect: selectedPhotos.length === 1');
        setLoupeIndex(0);
      } else if (selectedPhotos.length > 1) {
        // const minSelectedPhoto = Math.min(...selectedPhotos);
        // setLoupeIndex(minSelectedPhoto);
        console.log('useEffect: selectedPhotos.length > 1');
        setLoupeIndex(0);
      }
      setLoupeIndex(0);
    }
  }, [viewMode, selectedPhotos]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('handleKeyDown', event.key);
      console.log('loupeIndex', loupeIndex);
      if (viewMode === "loupe") {
        if (selectedPhotos.length > 1) {
          if (event.key === "ArrowRight" && loupeIndex < selectedPhotos.length - 1) {
            setLoupeIndex(loupeIndex + 1);
          } else if (event.key === "ArrowLeft" && loupeIndex > 0) {
            setLoupeIndex(loupeIndex - 1);
          }
        } else {
          if (event.key === "ArrowRight" && loupeIndex < photos.length - 1) {
            setLoupeIndex(loupeIndex + 1);
          } else if (event.key === "ArrowLeft" && loupeIndex > 0) {
            setLoupeIndex(loupeIndex - 1);
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, loupeIndex, selectedPhotos]);

  const getShafferographyPaddingLeft = (): any => {
    if (open) {
      return '240px';
    } else {
      return 0;
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Top Navigation Bar */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ paddingLeft: getShafferographyPaddingLeft() , flexGrow: 1 }}>Shafferography</Typography>

          <Tooltip title="Adjust Grid Size">
            <IconButton color="inherit" onClick={() => setIsSettingsOpen(true)}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          {/* Search Bar */}
          <Box sx={{ display: "flex", alignItems: "center", mx: 2 }}>
            <SearchIcon />
            <TextField variant="outlined" size="small" placeholder="Search photos..." sx={{ ml: 1, backgroundColor: "white", borderRadius: 1 }} />
          </Box>

          {/* Selection Count & Actions */}
          {selectedPhotos.length > 0 && (
            <Typography variant="subtitle1" sx={{ mx: 2 }}>{selectedPhotos.length} selected</Typography>
          )}
          <Tooltip title="Assign Keywords">
            <IconButton color="inherit" disabled={selectedPhotos.length === 0}><LabelIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Set Review Level">
            <IconButton color="inherit" disabled={selectedPhotos.length === 0}><StarIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Deselect All">
            <IconButton color="inherit" onClick={() => setSelectedPhotos([])} disabled={selectedPhotos.length === 0}><ClearIcon /></IconButton>
          </Tooltip>


          {/* Divider for better grouping */}
          <Divider orientation="vertical" flexItem sx={{ mx: 2, alignSelf: 'stretch', backgroundColor: "white" }} />

          {/* View Mode Toggle Group */}
          <Tooltip title="Grid View">
            <IconButton color="inherit" onClick={() => setViewMode("grid")}><ViewModuleIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Loupe View">
            <IconButton color="inherit" onClick={() => setViewMode("loupe")} disabled={selectedPhotos.length === 0}><ViewComfyIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Survey Mode">
            <IconButton color="inherit" onClick={() => setViewMode("survey")} disabled={selectedPhotos.length < 2}><ViewCarouselIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Full Screen">
            <IconButton color="inherit" onClick={() => setViewMode("fullscreen")} disabled={selectedPhotos.length !== 1}><FullscreenIcon /></IconButton>
          </Tooltip>

          {/* Divider for better grouping */}
          <Divider orientation="vertical" flexItem sx={{ mx: 2, alignSelf: 'stretch', backgroundColor: "white" }} />

          {/* Import/Export & Settings */}
          <Tooltip title="Import/Export">
            <IconButton color="inherit"><ImportExportIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton color="inherit"><SettingsIcon /></IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
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
          <IconButton onClick={() => setOpen(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Sidebar/>
      </Drawer>

      <Main open={open}>
        <Toolbar />
        <DrawerHeader />
        <PhotoGrid selectedPhotos={selectedPhotos} setSelectedPhotos={setSelectedPhotos} viewMode={viewMode} loupeIndex={loupeIndex} setLoupeIndex={setLoupeIndex} magnificationFactor={magnificationFactor} />
      </Main>

      {/* Settings Dialog for Magnification */}
      <Dialog open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
        <DialogTitle>Adjust Grid Magnification</DialogTitle>
        <DialogContent>
          <Slider
            value={magnificationFactor}
            onChange={(e, newValue) => setMagnificationFactor(newValue as number)}
            step={0.25}
            min={0.25}
            max={2.0}
            valueLabelDisplay="auto"
          />
          <Button onClick={() => setIsSettingsOpen(false)} fullWidth variant="contained" sx={{ mt: 2 }}>
            Close
          </Button>
        </DialogContent>
      </Dialog>

    </Box>
  );
};

export default AppShell;
