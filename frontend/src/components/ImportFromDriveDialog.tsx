import * as React from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Button, DialogActions, DialogContent, IconButton, Stack, Typography } from '@mui/material';

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { getAppInitialized, getPhotoSets, getPhotoSetId } from '../selectors';
import { apiUrlFragment, FileToImport, PhotoSet, serverUrl } from '../types';
import { setPhotoSetId, TedTaggerDispatch } from '../models';
import { bindActionCreators } from 'redux';
import { addPhotoSet } from '../controllers';
import axios from 'axios';

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
  const [baseDirectory, setBaseDirectory] = React.useState<string>('');
  const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(null);
  const [newPhotoSetName, setNewPhotoSetName] = React.useState<string>('');
  const [lastAddedPhotoSetId, setLastAddedPhotoSetId] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);

  const [isAddingNew, setIsAddingNew] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (props.open) {
      setProgress(0);
      setIsAddingNew(props.photoSets.length === 0);
    }
  }, [props.open]);

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

    setLastAddedPhotoSetId(newPhotoSet.photoSetId);
    setNewPhotoSetName("");
    setIsAddingNew(false);

    return newPhotoSet;
  };

  const handleImportFromDrive = async (baseDirectory: string, photoSetId: string, selectedFiles: FileList) => {

    console.log('handleImportFromDrive', selectedFiles, photoSetId);

    const uploadUrl = serverUrl + apiUrlFragment + 'uploadAndImport';

    const files: FileToImport[] = [];
    for (const key in selectedFiles) {
      if (Object.prototype.hasOwnProperty.call(selectedFiles, key)) {
        const selectedFile: File = selectedFiles[key];
        const file: FileToImport = {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          lastModified: selectedFile.lastModified,
          lastModifiedDate: (selectedFile as any).lastModifiedDate,
        }
        files.push(file);
      }
    }

    const uploadBody = {
      baseDirectory,
      photoSetId,
      files,
    };

    return axios.post(
      uploadUrl,
      uploadBody
    ).then((response) => {
      return Promise.resolve(response);
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return '';
    });

  };

  const handleImport = async () => {
    if (selectedFiles && (baseDirectory !== '')) {
      let photoSetId = props.photoSetId;
      if (isAddingNew) {
        const newPhotoSet: PhotoSet | undefined = createPhotoSet();
        if (!newPhotoSet) return;
        photoSetId = newPhotoSet.photoSetId;
      }

      console.log('import files: ', baseDirectory, photoSetId, selectedFiles);
      await handleImportFromDrive(baseDirectory, photoSetId, selectedFiles);
      props.onClose();
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      open={props.open}
      maxWidth="md"  // Makes dialog wider (options: 'xs', 'sm', 'md', 'lg', 'xl')
      fullWidth  // Ensures it takes the full available width
    >
      <DialogTitle>Import Photos</DialogTitle>
      <DialogContent style={{ paddingTop: '6px', paddingBottom: '0px'}} sx={{ width: '100%', minWidth: '500px' }}>
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
                <IconButton onClick={() => setIsAddingNew(false)} disabled={props.photoSets.length === 0 && newPhotoSetName.trim() === ''}> 
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
                <MenuItem onClick={() => setIsAddingNew(true)} key={'newPhotoSet'} value={''}>
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
          <Stack sx={{ marginTop: '16px', width: '100%', minWidth: '500px' }}>
            <TextField
              label="Base Directory"
              value={baseDirectory}
              onChange={(e) => setBaseDirectory(e.target.value)}
              fullWidth
              sx={{ paddingBottom: '8px' }}
            />
            <input
              type="file"
              accept=".jpg,.heic,image/jpeg,image/heic"
              onChange={handleImportFilesSelect}
              id="importFilesInput"
              name="file"
              multiple
              style={{ marginTop: '1rem' }}
            />
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleImport} autoFocus disabled={!selectedFiles || selectedFiles.length === 0 || (baseDirectory === '') || (isAddingNew && !newPhotoSetName.trim())}>
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function mapStateToProps(state: any) {
  console.log('mapStateToProps photoSetId: ', getPhotoSetId(state));
  console.log('mapStateToProps photoSets: ', getPhotoSets(state));
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
