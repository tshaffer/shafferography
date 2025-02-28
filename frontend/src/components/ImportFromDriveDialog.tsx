import * as React from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Button, DialogActions, DialogContent, IconButton, Stack, Typography, Alert } from '@mui/material';

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { getAppInitialized, getPhotoSets, getPhotoSetId } from '../selectors';
import { apiUrlFragment, FileToImport, PhotoSet, serverUrl } from '../types';
import { setPhotoSetId, TedTaggerDispatch } from '../models';
import { bindActionCreators } from 'redux';
import { addPhotoSet, reloadMediaItemsByPhotoSet } from '../controllers';
import axios from 'axios';

export interface ImportFromDriveDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
}

export interface ImportFromDriveDialogProps extends ImportFromDriveDialogPropsFromParent {
  appInitialized: boolean;
  photoSetId: string;
  photoSets: PhotoSet[];
  onAddPhotoSet: (photoSet: PhotoSet) => any;
  onSetPhotoSetId: (photoSetId: string) => any;
  onReloadMediaItemsByPhotoSet: (photoSetId: string) => void;
}

const ImportFromDriveDialog = (props: ImportFromDriveDialogProps) => {
  const [localPhotoSetId, setLocalPhotoSetId] = React.useState<string>(props.photoSetId);
  const [baseDirectory, setBaseDirectory] = React.useState<string>('');
  const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(null);
  const [newPhotoSetName, setNewPhotoSetName] = React.useState<string>('');
  const [lastAddedPhotoSetId, setLastAddedPhotoSetId] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);

  const [fileProgress, setFileProgress] = React.useState<Record<string, number>>({});
  const [fileStatuses, setFileStatuses] = React.useState<Record<string, "uploading" | "processing" | "completed">>({});
  const [processingComplete, setProcessingComplete] = React.useState<boolean>(false);

  const [isAddingNew, setIsAddingNew] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (props.open) {
      setLocalPhotoSetId(props.photoSetId);
      setProgress(0);
      setIsAddingNew(props.photoSets.length === 0);
      setFileProgress({});
      setFileStatuses({});
      setProcessingComplete(false);
      // setBaseDirectory('');
      setSelectedFiles(null);
      setNewPhotoSetName('');
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

  const createPhotoSet = async (): Promise<PhotoSet | undefined> => {

    if (!newPhotoSetName.trim()) return Promise.resolve(undefined);

    const newPhotoSet: PhotoSet = {
      photoSetId: uuidv4(),
      photoSetName: newPhotoSetName,
    };

    return props.onAddPhotoSet(newPhotoSet).then(() => {
      console.log('Photo Set added: ', newPhotoSet);
      setLocalPhotoSetId(newPhotoSet.photoSetId);
      setLastAddedPhotoSetId(newPhotoSet.photoSetId);
      setNewPhotoSetName("");
      setIsAddingNew(false);

      return Promise.resolve(newPhotoSet);
    });
  };

  const checkProcessingComplete = async (importId: string): Promise<void> => {
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        try {
          const response = await axios.get(`/api/v1/import-photos-status/${importId}`);

          if (!response.data || response.data.files.length === 0) return;

          const updatedStatuses: Record<string, "uploading" | "processing" | "completed"> = {};

          response.data.files.forEach((file: { filename: string; status: string }) => {
            updatedStatuses[file.filename] = file.status as "uploading" | "processing" | "completed";
          });

          setFileStatuses(updatedStatuses);

          if (Object.values(updatedStatuses).every((status) => status === "completed")) {
            clearInterval(interval);
            console.log("All files processed!");
            props.onSetPhotoSetId(localPhotoSetId);
            localStorage.setItem('photoSetId', localPhotoSetId);
            props.onReloadMediaItemsByPhotoSet(localPhotoSetId);
            setProcessingComplete(true);
            resolve();
          }
        } catch (error) {
          console.error("Error checking status", error);
        }
      }, 500);
    });
  };

  const handleImportFromDrive = async (baseDirectory: string, photoSetId: string, selectedFiles: FileList) => {

    setFileProgress({});
    setFileStatuses({});
    setProcessingComplete(false);

    const uploadUrl = serverUrl + apiUrlFragment + 'importPhotos';

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
        };
        files.push(file);
      }
    }

    const uploadBody = {
      baseDirectory,
      photoSetId,
      files,
    };

    try {
      const response = await axios.post(uploadUrl, uploadBody, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
          );

          // ✅ Update each file's progress separately
          const updatedProgress = { ...fileProgress };
          files.forEach((file) => (updatedProgress[file.name] = percentCompleted));
          setFileProgress(updatedProgress);
        },
      });

      console.log("Upload started:", response.data);
      files.forEach((file) => setFileStatuses((prev) => ({ ...prev, [file.name]: "processing" })));

      await checkProcessingComplete(response.data.importId);

      console.log("Processing is fully complete!");

    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleImport = async () => {
    if (selectedFiles && (baseDirectory !== '')) {
      let photoSetId = localPhotoSetId;
      if (isAddingNew) {
        const newPhotoSet: PhotoSet | undefined = await createPhotoSet();
        if (!newPhotoSet) return;
        photoSetId = newPhotoSet.photoSetId;
      }

      console.log('import files: ', baseDirectory, photoSetId, selectedFiles);
      await handleImportFromDrive(baseDirectory, photoSetId, selectedFiles);
    }
  };

  return (
    <Dialog onClose={handleClose} open={props.open} maxWidth="md" fullWidth>
      <DialogTitle>Import Photos</DialogTitle>
      <DialogContent style={{ paddingTop: '6px', paddingBottom: '0px' }} sx={{ width: '100%', minWidth: '500px' }}>
        {processingComplete && (
          <Alert severity="success" sx={{ mb: 2, fontSize: '1.2rem', textAlign: 'center' }}>
            Processing Complete!
          </Alert>
        )}
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
                value={localPhotoSetId}
                onChange={(e) => setLocalPhotoSetId(e.target.value)}
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
            {Object.keys(fileProgress).map((fileName) => (
              <Stack key={fileName} direction="row" justifyContent="space-between" sx={{ fontSize: '0.9rem', padding: '4px 0' }}>
                <Typography>{fileName}</Typography>
                <Typography>{fileStatuses[fileName] === "processing" ? "Processing..." : "✅ Done"}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleImport} autoFocus disabled={!selectedFiles || selectedFiles.length === 0 || (baseDirectory === '') || (isAddingNew && !newPhotoSetName.trim())}>
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
};

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
    onReloadMediaItemsByPhotoSet: reloadMediaItemsByPhotoSet,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportFromDriveDialog);
