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

import { getAppInitialized, getDisplayedAlbumIds, getAlbums } from '../selectors';
import { apiUrlFragment, FileToImport, Album, serverUrl } from '../types';
import { setDisplayedAlbumIds, TedTaggerDispatch } from '../models';
import { bindActionCreators } from 'redux';
import { addAlbum, reloadMediaItemsByViewSpec } from '../controllers';
import axios from 'axios';

export interface ImportFromDriveDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
}

export interface ImportFromDriveDialogProps extends ImportFromDriveDialogPropsFromParent {
  appInitialized: boolean;
  displayedAlbumIds: string[];
  albums: Album[];
  onAddAlbum: (album: Album) => any;
  onSetDisplayedAlbumIds: (displayedAlbumIds: string[]) => any;
  onReloadMediaItemsByViewSpec: () => void;
}

type FileStatus = "uploading" | "processing" | "completed" | "conversion failed";
type FileStatuses = Record<string, FileStatus>;

const ImportFromDriveDialog = (props: ImportFromDriveDialogProps) => {
  const [baseDirectory, setBaseDirectory] = React.useState<string>('');
  const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(null);
  const [newAlbumName, setNewAlbumName] = React.useState<string>('');
  const [lastAddedAlbumId, setLastAddedAlbumId] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);

  const [fileProgress, setFileProgress] = React.useState<Record<string, number>>({});
  const [fileStatuses, setFileStatuses] = React.useState<FileStatuses>({});
  const [processingComplete, setProcessingComplete] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [isAddingNew, setIsAddingNew] = React.useState<boolean>(false);
  const localAlbumIdRef = React.useRef<string>(props.displayedAlbumIds[0]);

  const updateLocalAlbumId = (newId: string) => {
    localAlbumIdRef.current = newId;
    console.log("Updated localAlbumId (ref):", localAlbumIdRef.current);
  };

  React.useEffect(() => {
    if (props.open) {
      updateLocalAlbumId(props.displayedAlbumIds[0]);
      setProgress(0);
      setIsAddingNew(props.albums.length === 0);
      setFileProgress({});
      setFileStatuses({});
      setProcessingComplete(false);
      // setBaseDirectory('');
      setSelectedFiles(null);
      setNewAlbumName('');
      setErrorMessage(null);
    }
  }, [props.open]);

  const handleClose = () => {
    props.onClose();
  };

  const handleImportFilesSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };

  const createAlbum = async (): Promise<Album | undefined> => {
    if (!newAlbumName.trim()) return Promise.resolve(undefined);

    const newAlbum: Album = {
      albumId: uuidv4(),
      albumName: newAlbumName,
    };

    return props.onAddAlbum(newAlbum).then(() => {
      console.log('Album added: ', newAlbum);
      updateLocalAlbumId(newAlbum.albumId);
      setLastAddedAlbumId(newAlbum.albumId);
      setNewAlbumName("");
      setIsAddingNew(false);

      return Promise.resolve(newAlbum);
    });
  };

  const checkProcessingComplete = async (importId: string): Promise<void> => {
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        try {
          const response = await axios.get(`/api/v1/import-photos-status/${importId}`);

          if (!response.data || response.data.files.length === 0) return;

          const updatedStatuses: FileStatuses = {};

          response.data.files.forEach((file: { filename: string; status: string }) => {
            updatedStatuses[file.filename] = file.status as FileStatus;
          });

          setFileStatuses(updatedStatuses);

          if (Object.values(updatedStatuses).every((status) => ((status === "completed") || (status === "conversion failed")))) {
            clearInterval(interval);
            console.log("All files processed!");
            props.onSetDisplayedAlbumIds([localAlbumIdRef.current]);
            localStorage.setItem('displayedAlbumIds', localAlbumIdRef.current);
            props.onReloadMediaItemsByViewSpec();
            setProcessingComplete(true);
            resolve();
          }
        } catch (error) {
          console.error("Error checking status", error);
        }
      }, 500);
    });
  };

  const albumExists = (albumName: string): boolean => {
    return props.albums.some((album) => album.albumName === albumName);
  };

  const handleImport = async () => {
    if (selectedFiles && (baseDirectory !== '')) {
      let albumId = localAlbumIdRef.current;
      if (isAddingNew) {
        if (albumExists(newAlbumName)) {
          // Instead of logging an error, set an error message to display in a modal dialog.
          setErrorMessage('Album already exists');
          return;
        }
        const newAlbum: Album | undefined = await createAlbum();
        if (!newAlbum) return;
        albumId = newAlbum.albumId;
      } else if (!albumId) {
        // Instead of logging an error, set an error message to display in a modal dialog.
        setErrorMessage('No album selected');
        return;
      }
      console.log('import files: ', baseDirectory, albumId, selectedFiles);
      await handleImportFromDrive(baseDirectory, albumId, selectedFiles);
    }
  };

  const handleImportFromDrive = async (baseDirectory: string, albumId: string, selectedFiles: FileList) => {
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
      albumId,
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

  const getFileStatusLabel = (status: FileStatus): string => {
    switch (status) {
      case "uploading":
        return "Uploading...";
      case "processing":
        return "Processing...";
      case "completed":
        return "✅ Done"; 
        case "conversion failed":
        return "❌ Conversion Failed";
      default:
        return "Unknown Status";
    }
  };

  return (
    <>
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
                    label="New Album Name"
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    fullWidth
                    autoFocus
                  />
                  <IconButton onClick={() => setIsAddingNew(false)} disabled={props.albums.length === 0 && newAlbumName.trim() === ''}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              ) : (
                <TextField
                  select
                  label="Choose an Album"
                  value={localAlbumIdRef.current}
                  onChange={(e) => updateLocalAlbumId(e.target.value)}
                  fullWidth
                >
                  <MenuItem onClick={() => setIsAddingNew(true)} key={'newAlbum'} value={''}>
                    <AddIcon fontSize="small" sx={{ marginRight: 1 }} />
                    Add New Album
                  </MenuItem>
                  {props.albums.map((set) => (
                    <MenuItem key={set.albumId} value={set.albumId}>
                      {set.albumName}
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
                  <Typography>{getFileStatusLabel(fileStatuses[fileName])}</Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleImport} autoFocus disabled={!selectedFiles || selectedFiles.length === 0 || (baseDirectory === '') || (isAddingNew && !newAlbumName.trim())}>
            Import
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Modal Dialog */}
      {errorMessage && (
        <Dialog open={true} onClose={() => setErrorMessage(null)}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <Alert severity="error">{errorMessage}</Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setErrorMessage(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    displayedAlbumIds: getDisplayedAlbumIds(state),
    albums: getAlbums(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onAddAlbum: addAlbum,
    onSetDisplayedAlbumIds: setDisplayedAlbumIds,
    onReloadMediaItemsByViewSpec: reloadMediaItemsByViewSpec,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportFromDriveDialog);
