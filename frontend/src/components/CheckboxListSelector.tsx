import { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  ListItemButton,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { photoStateOptions } from "../constants";

interface CheckboxListSelectorProps<T> {
  label: string;
  items: T[];
  selectedItems: T[];
  getItemLabel: (item: T) => string;
  onChange: (selected: T[]) => void;
  onDeleteItem?: (item: T) => void;
  showSelectAll?: boolean;
  showDeleteItem?: boolean;
}

function CheckboxListSelector<T>({
  label,
  items,
  selectedItems,
  showSelectAll = true,
  showDeleteItem = false,
  getItemLabel,
  onChange,
  onDeleteItem = () => { console.log('onDeleteItem not implemented'); },
}: CheckboxListSelectorProps<T>) {

  const [tempSelected, setTempSelected] = useState<T[]>(selectedItems ?? []);

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

  const handleSelectAllOrNoneChange = (selectAll: boolean) => {
    if (selectAll) {
      setTempSelected(items);
      onChange(items);
    } else {
      setTempSelected([]);
      onChange([]);
    }
  };

  const handleDelete = (item: T) => {
    console.log('handleDelete:', item);
    onDeleteItem(item);
  };

  return (
    <Box id='checkboxListSelectorBox'>
      <List id='checkboxListSelectorList' dense>
        {showSelectAll && (
          <ListItem sx={{ paddingY: 0.2, paddingLeft: '10px' }}>
            <ButtonGroup size="small" sx={{ mb: 1 }}>
              <Button
                variant="outlined"
                disabled={tempSelected.length === photoStateOptions.length}
                onClick={() => handleSelectAllOrNoneChange(true)}
              >
                Select All
              </Button>
              <Button
                variant="outlined"
                disabled={tempSelected.length === 0}
                onClick={() => handleSelectAllOrNoneChange(false)} // Select all
              >
                Deselect All
              </Button>
            </ButtonGroup>
          </ListItem>
        )}

        {items.map((item) => (
          <ListItemButton
            key={getItemLabel(item)}
            onClick={() => toggleSelection(item)}
            sx={{ paddingLeft: '5px', paddingY: 0.2 }} // Reduced paddingY here
          >
            <Checkbox checked={tempSelected.includes(item)} />
            <ListItemText primary={getItemLabel(item)} />
            {showDeleteItem && (
              <IconButton
                edge="end"
                sx={{ marginLeft: 'auto' }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the ListItem onClick from firing.
                  handleDelete(item);
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

export default CheckboxListSelector;
