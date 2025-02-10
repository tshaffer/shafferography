import React, { useState } from "react";
import { List, ListItem, ListItemText, Divider, Typography, Box, Drawer, IconButton, styled } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

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

  return (

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
        <ListItem button>
          <ListItemText primary="Unreviewed" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Ready For Review" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Ready For Upload" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Uploaded To Google" />
        </ListItem>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1">Keywords</Typography>
        <ListItem button>
          <ListItemText primary="+ Add Keyword" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
