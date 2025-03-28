import { useState, useEffect } from "react";
import {
  List,
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
  items: T[];
  selectedItems: T[];
  getItemLabel: (item: T) => string;
  getItemCount?: (item: T) => string;
  onChange: (selected: T[]) => void;
  onDeleteItem?: (item: T) => void;
  showCount?: boolean;
  showSelectAll?: boolean;
  showDeleteItem?: boolean;
  maxHeight?: number; // New property for scrolling support
}

function CheckboxListSelector<T>({
  items,
  selectedItems,
  showCount = false,
  showDeleteItem = false,
  showSelectAll = true,
  maxHeight,
  getItemLabel,
  getItemCount,
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
      {showSelectAll && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: '10px', marginBottom: 0, marginTop: 1 }}>
          <ButtonGroup size="small">
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
              onClick={() => handleSelectAllOrNoneChange(false)}
            >
              Deselect All
            </Button>
          </ButtonGroup>
        </Box>
      )}
      <List
        id='checkboxListSelectorList'
        dense
        sx={maxHeight ? { maxHeight: maxHeight, overflowY: 'auto' } : {}}
      >
        {items.map((item) => (
          <ListItemButton
            key={getItemLabel(item)}
            onClick={() => toggleSelection(item)}
            sx={{ paddingLeft: '5px', paddingY: 0.2 }}
          >
            <Checkbox checked={tempSelected.includes(item)} />
            <ListItemText primary={getItemLabel(item)} />
            {showCount && (
              <span>({getItemCount!(item)})</span>
            )}
            {showDeleteItem && (
              <IconButton
                edge="end"
                sx={{ marginLeft: 'auto' }}
                onClick={(e) => {
                  e.stopPropagation();
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
