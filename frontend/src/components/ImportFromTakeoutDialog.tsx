import * as React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';

import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';

import { getAppInitialized, getTakeouts } from '../selectors';
import { Button, DialogActions, DialogContent } from '@mui/material';

import { Takeout } from '../types';

import { useGooglePhotosPicker } from "../hooks/useGooglePhotosPicker";

export interface ImportFromTakeoutDialogPropsFromParent {
  open: boolean;
  onImportFromTakeout: (id: string) => void;
  onClose: () => void;
}

export interface ImportFromTakeoutDialogProps extends ImportFromTakeoutDialogPropsFromParent {
  takeouts: Takeout[];
  appInitialized: boolean;
}

const ImportFromTakeoutDialog = (props: ImportFromTakeoutDialogProps) => {

  const { open, onClose } = props;

  if (!props.appInitialized) {
    return null;
  }

  if (!open) {
    return null;
  }

  const [takeoutId, setTakeoutId] = React.useState(props.takeouts[0].id);

  const isGoogleLoaded = useGooglePhotosPicker();

  const handleChange = (event: SelectChangeEvent<typeof takeoutId>) => {
    setTakeoutId(event.target.value || '');
  };

  const handleClose = () => {
    onClose();
  };

  function handleImport(): void {
    console.log('Importing from Takeout', takeoutId);
    props.onImportFromTakeout(takeoutId);
    onClose();
  }

  function handleSelectedPhotos(photos: any[]) {
    console.log("handleSelectedPhotos:", photos);
  }


  function launchPhotosPicker() {
    if (!isGoogleLoaded) {
      console.warn("Google API not loaded yet.");
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    const appId = import.meta.env.VITE_GOOGLE_APP_ID;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    console.log("launchPhotosPicker");
    console.log("apiKey", apiKey);
    console.log("appId", appId);
    console.log("clientId", clientId);
    
    google.photos.picker.configure({
      apiKey,
      clientId,
      appId,
      scopes: ["https://www.googleapis.com/auth/photoslibrary.readonly"],
    });

    google.photos.picker.selectMedia({
      mediaType: "photos",
      multiSelect: true,
      onSelect: (photos) => {
        console.log("Selected Photos:", photos);
        handleSelectedPhotos(photos);
      },
    });
  }
  const renderTakeout = (takeout: Takeout): JSX.Element => {
    return (
      <MenuItem key={takeout.id} value={takeout.id}>{takeout.label}</MenuItem>
    );
  };

  const renderTakeouts = (): JSX.Element[] => {
    const takeouts = props.takeouts;
    const takeoutItems: JSX.Element[] = takeouts.map((takeout: Takeout) => {
      return renderTakeout(takeout);
    });
    return takeoutItems;
  };

  const takeoutItems: JSX.Element[] = renderTakeouts();

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Import from Takeout</DialogTitle>
      <DialogContent style={{ paddingBottom: '0px' }}>
        <div>
          <Box
            component="form"
            noValidate
            autoComplete="off"
          >
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-dialog-select-label">Takeout</InputLabel>
              <Select
                value={takeoutId}
                onChange={handleChange}
                input={<OutlinedInput label="Parent Keyword" />}
              >
                {takeoutItems}
              </Select>
            </FormControl>
          </Box>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={launchPhotosPicker} disabled={!isGoogleLoaded} autoFocus>
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    takeouts: getTakeouts(state),
  };
}

export default connect(mapStateToProps)(ImportFromTakeoutDialog);
