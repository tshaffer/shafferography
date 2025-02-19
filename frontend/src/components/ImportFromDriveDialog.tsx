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

import { getAppInitialized, getPhotoSets, getPhotoSetId } from '../selectors';
import { PhotoSet } from '../types';
import { setPhotoSetId, TedTaggerDispatch } from '../models';
import { bindActionCreators } from 'redux';
import { addPhotoSet } from '../controllers';

export interface ImportFromDriveDialogPropsFromParent {
  open: boolean;
  onImportFromDrive: (files: FileList, photoSetId: string) => void;
  onClose: () => void;
}

export interface ImportFromDriveDialogProps extends ImportFromDriveDialogPropsFromParent {
  appInitialized: boolean;
  photoSetId: string;
  photoSets: PhotoSet[];
  onAddPhotoSet: (photoSet: PhotoSet) => void;
  onSetPhotoSetId: (photoSetId: string) => void;
}

const ImportFromDriveDialog = (props: ImportFromDriveDialogProps) => {
  const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(null);
  const [newPhotoSetName, setNewPhotoSetName] = React.useState<string>('');
  const [lastAddedPhotoSetId, setLastAddedPhotoSetId] = React.useState<string | null>(null);

  const [isAddingNew, setIsAddingNew] = React.useState<boolean>(false);

  // ✅ Ensure the selection is only overridden when no selection exists
  // React.useEffect(() => {
  //   if (lastAddedPhotoSetId) {
  //     props.onSetPhotoSetId(lastAddedPhotoSetId);
  //     setLastAddedPhotoSetId(null); // Reset tracking
  //   } else if (!props.photoSetId && props.photoSets.length > 0) {
  //     props.onSetPhotoSetId(props.photoSets[0].photoSetId); // Default to first available photoSet
  //   }
  // }, [props.photoSets, lastAddedPhotoSetId, props.photoSetId]);

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

  const createPhotoSet = (): PhotoSet | undefined => {
    if (!newPhotoSetName.trim()) return;

    const newPhotoSet: PhotoSet = {
      photoSetId: uuidv4(),
      photoSetName: newPhotoSetName,
    };

    props.onAddPhotoSet(newPhotoSet);
    props.onSetPhotoSetId(newPhotoSet.photoSetId);
    localStorage.setItem('photoSetId', newPhotoSet.photoSetId);

    setLastAddedPhotoSetId(newPhotoSet.photoSetId); // ✅ Track newly added photoSet
    props.onSetPhotoSetId(newPhotoSet.photoSetId);
    setNewPhotoSetName("");
    setIsAddingNew(false);

    return newPhotoSet;
  };

  const handleImport = () => {
    if (selectedFiles) {
      let photoSetId = props.photoSetId;
      if (isAddingNew) {
        const newPhotoSet: PhotoSet | undefined = createPhotoSet();
        if (!newPhotoSet) return;
        photoSetId = newPhotoSet.photoSetId;
      }

      console.log('import files: ', selectedFiles, photoSetId);
      props.onImportFromDrive(selectedFiles, photoSetId);
      props.onClose();
    }
  };

  return (
    <Dialog onClose={handleClose} open={props.open}>
      <DialogTitle>Import Photos</DialogTitle>
      <DialogContent style={{ paddingTop: '6px', paddingBottom: '0px' }}>
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
                <IconButton onClick={() => setIsAddingNew(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            ) : (
              <TextField
                select
                label="Choose a Photo Set"
                value={props.photoSetId}
                onChange={(e) => props.onSetPhotoSetId(e.target.value)}
                fullWidth
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
        <Button onClick={handleImport} autoFocus disabled={!selectedFiles || selectedFiles.length === 0 || (isAddingNew && !newPhotoSetName.trim())}>
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
    photoSetId: getPhotoSetId(state),
    photoSets: getPhotoSets(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onAddPhotoSet: addPhotoSet,
    onSetPhotoSetId: setPhotoSetId,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportFromDriveDialog);
