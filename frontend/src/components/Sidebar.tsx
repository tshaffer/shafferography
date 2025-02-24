import React from "react";
import { List, ListItem, ListItemText, Divider, Typography, Box, Drawer, IconButton, styled, ListItemButton } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import MergePeopleDialog from './MergePeopleDialog';
import RetrievePeopleDialog from "./RetrievePeopleDialog";
import { getAlbumNamesWherePeopleNotRetrieved, mergePeopleTakeout } from "../controllers";

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = (props: SidebarProps) => {

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

          <ListItem button>
            <ListItemText primary="Unreviewed" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Ready For Review" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Ready For Upload" />
          </ListItem>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1">Keywords</Typography>
          <ListItem button>
            <ListItemText primary="+ Add Keyword" />
          </ListItem>
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

export default Sidebar;
