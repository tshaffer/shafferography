import React from "react";
import { List, ListItem, ListItemText, Divider, Typography, Box } from "@mui/material";

const Sidebar: React.FC = () => {
  return (
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
  );
};

export default Sidebar;
