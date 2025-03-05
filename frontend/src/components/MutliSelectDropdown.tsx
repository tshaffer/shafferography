import React, { useState, useEffect } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  Checkbox,
  ListItemText,
  List,
  ListItem,
  Box,
  Button,
  Select,
  FormControl,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"; // Correct dropdown arrow

interface MultiSelectDropdownProps<T> {
  label: string;
  items: T[];
  selectedItems: T[];
  getItemLabel: (item: T) => string;
  onChange: (selected: T[]) => void;
}

function MultiSelectDropdown<T>({
  label,
  items,
  selectedItems,
  getItemLabel,
  onChange,
}: MultiSelectDropdownProps<T>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tempSelected, setTempSelected] = useState<T[]>(selectedItems);
  const [prevSelected, setPrevSelected] = useState<T[]>(selectedItems);

  useEffect(() => {
    setTempSelected(selectedItems);
    setPrevSelected(selectedItems);
  }, [selectedItems]);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOk = () => {
    if (tempSelected.length === 0) return;
    onChange(tempSelected);
    setPrevSelected(tempSelected);
    handleClose();
  };

  const handleCancel = () => {
    setTempSelected(prevSelected);
    handleClose();
  };

  const toggleSelection = (item: T) => {
    const newSelected = tempSelected.includes(item)
      ? tempSelected.filter((i) => i !== item)
      : [...tempSelected, item];

    setTempSelected(newSelected);
  };

  const handleSelectionChange = (event: any) => {
    const value = event.target.value;
    if (value === "all") {
      setTempSelected(items);
    } else if (value === "none") {
      setTempSelected([]);
    }
  };

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ color: "white" }} aria-label={label}>
        <SearchIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCancel}
        sx={{ minWidth: 280 }} // Ensures better layout
      >
        <List dense sx={{ paddingTop: 0, paddingBottom: 0 }}>
          {/* Selection dropdown with checkbox icon */}
          <ListItem sx={{ paddingY: 0.5, paddingLeft: '25px', maxWidth: '92px' }}>
            <FormControl fullWidth>
              <Select
                displayEmpty
                value={tempSelected.length === items.length ? "all" : tempSelected.length === 0 ? "none" : ""}
                onChange={handleSelectionChange}
                variant="standard"
                IconComponent={KeyboardArrowDownIcon} // Ensures only one arrow is rendered
                renderValue={() => (
                  <Box display="flex" alignItems="center">
                    <CheckBoxOutlinedIcon sx={{ marginRight: "8px" }} />
                  </Box>
                )}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="none">None</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
          {/* Individual checkboxes */}
          {items.map((item) => (
            <MenuItem key={getItemLabel(item)} onClick={() => toggleSelection(item)} sx={{ paddingY: 0.5 }}>
              <Checkbox checked={tempSelected.includes(item)} />
              <ListItemText primary={getItemLabel(item)} />
            </MenuItem>
          ))}
        </List>
        {/* Cancel & OK buttons with proper spacing */}
        <Box display="flex" justifyContent="space-between" p={1} gap={2}>
          <Button onClick={handleCancel} disabled={tempSelected.length === 0} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleOk} disabled={tempSelected.length === 0} variant="contained">
            OK
          </Button>
        </Box>
      </Menu>
    </>
  );
}

export default MultiSelectDropdown;
