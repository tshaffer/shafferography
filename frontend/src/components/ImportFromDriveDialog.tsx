import * as React from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Button, DialogActions, DialogContent, IconButton } from '@mui/material';

import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { getAppInitialized, getPhotoSets } from '../selectors';
import { PhotoSet } from '../types';
import { TedTaggerDispatch } from '../models';
import { bindActionCreators } from 'redux';
import { addPhotoSet } from '../controllers';

export interface ImportFromDriveDialogPropsFromParent {
  open: boolean;
  photoSets: PhotoSet[];
  onImportFromDrive: (files: FileList, photoSetId: string) => void;
  onClose: () => void;
}

export interface ImportFromDriveDialogProps extends ImportFromDriveDialogPropsFromParent {
  appInitialized: boolean;
  onAddPhotoSet: (photoSet: PhotoSet) => void;
}

const ImportFromDriveDialog = (props: ImportFromDriveDialogProps) => {
  const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(null);
  const [selectedPhotoSet, setSelectedPhotoSet] = React.useState<string>('');
  const [newPhotoSetName, setNewPhotoSetName] = React.useState<string>('');
  const [lastAddedPhotoSetId, setLastAddedPhotoSetId] = React.useState<string | null>(null);

  const [isAddingNew, setIsAddingNew] = React.useState<boolean>(false);

  // ✅ Ensure the selection is only overridden when no selection exists
  React.useEffect(() => {
    if (lastAddedPhotoSetId) {
      setSelectedPhotoSet(lastAddedPhotoSetId);
      setLastAddedPhotoSetId(null); // Reset tracking
    } else if (!selectedPhotoSet && props.photoSets.length > 0) {
      setSelectedPhotoSet(props.photoSets[0].photoSetId); // Default to first available photoSet
    }
  }, [props.photoSets, lastAddedPhotoSetId, selectedPhotoSet]);

  if (!props.appInitialized || !props.open) {
    return null;
  }

  const handleClose = () => {
    props.onClose();
  };

  const handleImportFilesSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };

  const handleImport = () => {
    if (selectedFiles) {
      console.log('import files: ', selectedFiles, selectedPhotoSet);
      props.onImportFromDrive(selectedFiles, selectedPhotoSet);
      props.onClose();
    }
  };

  const handleCreatePhotoSet = () => {
    if (!newPhotoSetName.trim()) return;

    const newPhotoSet: PhotoSet = {
      photoSetId: uuidv4(),
      photoSetName: newPhotoSetName,
    };

    props.onAddPhotoSet(newPhotoSet); // Callback to update parent state
    setLastAddedPhotoSetId(newPhotoSet.photoSetId); // ✅ Track newly added photoSet
    setSelectedPhotoSet(newPhotoSet.photoSetId);
    setNewPhotoSetName("");
    setIsAddingNew(false);
  };

  return (
    <Dialog onClose={handleClose} open={props.open}>
      <DialogTitle>Import Photos</DialogTitle>
      <DialogContent style={{ paddingBottom: '0px' }}>
        <Box component="form" noValidate autoComplete="off">

          <Box>
            {isAddingNew ? (
              <Box display="flex" gap={1} alignItems="center">
                <TextField
                  label="New Photo Set Name"
                  value={newPhotoSetName}
                  onChange={(e) => setNewPhotoSetName(e.target.value)}
                  fullWidth
                  autoFocus
                />
                <IconButton onClick={handleCreatePhotoSet} disabled={!newPhotoSetName.trim()}>
                  <CheckIcon color={newPhotoSetName.trim() ? "primary" : "disabled"} />
                </IconButton>
                <IconButton onClick={() => setIsAddingNew(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            ) : (
              <TextField
                select
                label="Choose a Photo Set"
                value={selectedPhotoSet}
                onChange={(e) => setSelectedPhotoSet(e.target.value)}
                fullWidth
                disabled={props.photoSets.length === 0}
              >
                <MenuItem onClick={() => setIsAddingNew(true)}>
                  <AddIcon fontSize="small" sx={{ marginRight: 1 }} />
                  Add New Photo Set
                </MenuItem>
                {props.photoSets.map((set) => (
                  <MenuItem key={set.photoSetId} value={set.photoSetId}>
                    {set.photoSetName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Box>

          {/* File Upload Section */}
          <input
            type="file"
            accept=".jpg,.heic,image/jpeg,image/heic"
            onChange={handleImportFilesSelect}
            id="importFilesInput"
            name="file"
            multiple
            style={{ marginTop: '1rem' }}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleImport} autoFocus disabled={!selectedFiles || selectedFiles.length === 0}>
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Map Redux state to component props
function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    photoSets: getPhotoSets(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onAddPhotoSet: addPhotoSet,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportFromDriveDialog);
