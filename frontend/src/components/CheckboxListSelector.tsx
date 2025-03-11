import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Box,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"; // Correct dropdown arrow

interface CheckboxListSelectorProps<T> {
  label: string;
  items: T[];
  selectedItems: T[];
  getItemLabel: (item: T) => string;
  onChange: (selected: T[]) => void;
}

function CheckboxListSelector<T>({
  label,
  items,
  selectedItems,
  getItemLabel,
  onChange,
}: CheckboxListSelectorProps<T>) {
  const [tempSelected, setTempSelected] = useState<T[]>(selectedItems);

  useEffect(() => {
    setTempSelected(selectedItems);
  }, [selectedItems]);

  const toggleSelection = (item: T) => {
    const newSelected = tempSelected.includes(item)
      ? tempSelected.filter((i) => i !== item)
      : [...tempSelected, item];

    setTempSelected(newSelected);
    onChange(newSelected);
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
    <Box>
      <List dense>
        {/* Selection dropdown with checkbox icon */}
        <ListItem sx={{ paddingY: 0.2, paddingLeft: '10px', maxWidth: '92px' }}>
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
          <ListItem
            key={getItemLabel(item)}
            button
            onClick={() => toggleSelection(item)}
            sx={{ paddingLeft: '5px', paddingY: 0.2 }} // Reduced paddingY here
          >
            <Checkbox checked={tempSelected.includes(item)} />
            <ListItemText primary={getItemLabel(item)} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default CheckboxListSelector;
