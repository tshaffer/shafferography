import React from "react";
import { connect } from "react-redux";
import { clearSelectedMediaItems } from "../models";
import { getSelectedMediaItemIds } from "../selectors";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";

interface SelectionToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
}

const SelectionToolbar: React.FC<SelectionToolbarProps> = ({ selectedCount, onClearSelection }) => {
  if (selectedCount === 0) return null; // Hide if no items are selected

  return (
    <AppBar position="fixed" color="primary" style={{ top: 0, zIndex: 1200 }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          {selectedCount} Selected
        </Typography>
        <Button color="inherit" onClick={onClearSelection}>
          Clear Selection
        </Button>
        <Button color="inherit">Share</Button>
        <Button color="inherit">Add to Album</Button>
        <Button color="inherit">Delete</Button>
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = (state: any) => ({
  selectedCount: getSelectedMediaItemIds(state).length,
});

const mapDispatchToProps = {
  onClearSelection: clearSelectedMediaItems,
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectionToolbar);
