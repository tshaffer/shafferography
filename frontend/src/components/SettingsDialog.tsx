import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Box,
  Button,
  Tooltip,
  FormGroup,
} from "@mui/material";
import { Settings } from "../types";
import React from "react";

export interface SettingsDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
  settings: Settings;
  onSetSettings: (settings: Settings) => void;
}

export interface SettingsDialogProps extends SettingsDialogPropsFromParent { }

const SettingsDialog: React.FC<SettingsDialogProps> = (props: SettingsDialogProps) => {

  const [showMetadata, setShowMetadata] = React.useState(props.settings.showMetadata);

  const handleSetSettings = () => {
    const updatedSettings: Settings = {
      showMetadata: showMetadata,
    };
    props.onSetSettings(updatedSettings);
    props.onClose();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowMetadata(event.target.checked);
  };

  const handleClose = () => {
    props.onClose();
  };

  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent style={{ paddingBottom: "0px" }}>
        <Box sx={{ padding: "8px", overflowY: "auto" }}>
          <FormGroup>
            <FormControlLabel control={
              <Checkbox
                checked={showMetadata}
                onChange={handleChange}
              />
            }
              label="Display image metadata"
            />
          </FormGroup>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Tooltip title="Press Enter to save settings" arrow>
          <Button
            onClick={handleSetSettings}
            autoFocus
            variant="contained"
            color="primary"
          >
            OK
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
