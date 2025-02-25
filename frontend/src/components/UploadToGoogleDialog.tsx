import * as React from 'react';
import { connect } from 'react-redux';

import axios from 'axios';
import { serverUrl, apiUrlFragment, FileToImport, MediaItem } from '../types';
import { isNil, isEmpty, isString } from 'lodash';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, DialogActions, DialogContent, Alert, Stack, Typography } from '@mui/material';
import { getAppInitialized } from '../selectors';

export interface UploadToGoogleDialogPropsFromParent {
  open: boolean;
  mediaItemIds: string[];
  mediaItems: MediaItem[];
  onClose: () => void;
}

export interface UploadToGoogleDialogProps extends UploadToGoogleDialogPropsFromParent {
  appInitialized: boolean;
}

const UploadToGoogleDialog = (props: UploadToGoogleDialogProps) => {

  const [albumName, setAlbumName] = React.useState('');
  const [fileProgress, setFileProgress] = React.useState<Record<string, number>>({});
  const [fileStatuses, setFileStatuses] = React.useState<Record<string, "uploading" | "processing" | "completed">>({});
  const [processingComplete, setProcessingComplete] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (props.open) {
      setFileProgress({});
      setFileStatuses({});
      setProcessingComplete(false);
    }
  }, [props.open]);

  const { open, onClose } = props;

  if (!props.appInitialized) {
    return null;
  }

  if (!open) {
    return null;
  }

  const checkProcessingComplete = async (uploadId: string): Promise<void> => {
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        try {
          const response = await axios.get(`/api/v1/upload-to-google-status/${uploadId}`);

          if (!response.data || response.data.files.length === 0) return;

          const updatedStatuses: Record<string, "uploading" | "processing" | "completed"> = {};

          console.log('checkProcessingComplete response.data.files: ', response.data.files);

          response.data.files.forEach((file: { filename: string; status: string }) => {
            updatedStatuses[file.filename] = file.status as "uploading" | "processing" | "completed";
          });

          setFileStatuses(updatedStatuses);

          if (Object.values(updatedStatuses).every((status) => status === "completed")) {
            clearInterval(interval);
            console.log("All files processed!");
            setProcessingComplete(true);
            resolve();
          }
        } catch (error) {
          console.error("Error checking status", error);
        }
      }, 500);
    });
  };

  const uploadToGoogle = async (): Promise<void> => {

    const googleAccessToken: string = localStorage.getItem('googleAccessToken') as string;
    if (isNil(googleAccessToken) || !isString(googleAccessToken) || isEmpty(googleAccessToken)) {
      throw new Error('googleAccessToken is invalid');
    }

    setFileProgress({});
    setFileStatuses({});
    setProcessingComplete(false);

    const uploadUrl = serverUrl + apiUrlFragment + 'uploadToGoogle';

    const files: FileToImport[] = [];
    for (const key in props.mediaItems) {
      if (Object.prototype.hasOwnProperty.call(props.mediaItems, key)) {
        const mediaItem: MediaItem = props.mediaItems[key];
        const file: FileToImport = {
          name: mediaItem.fileName,
          size: 0,
          type: '',
          lastModified: 0,
          lastModifiedDate: '',
        };
        files.push(file);
      }
    }

    const uploadToGoogleBody = {
      googleAccessToken,
      albumName,
      mediaItemIds: props.mediaItemIds,
    };

    try {
      const response = await axios.post(uploadUrl, uploadToGoogleBody, {
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

      await checkProcessingComplete(response.data.uploadId);

      console.log("Processing is fully complete!");

    } catch (error) {
      console.error("Error during upload", error);
    }
  };

  const handleUploadToGoogle = async (): Promise<void> => {
    if (albumName !== '') {
      try {
        const response = await uploadToGoogle();
        // if (response.ok) {
        //   setSuccessMessage('Upload to google completed successfully!');
        // } else {
        //   const errorMessage = await response.text();
        //   setError(`Upload to google failed: ${errorMessage}`);
        // }
      } catch (error) {
        console.log('Error uploading to Google:', error);
        // } finally {
        //   setUploadingToGoogle(false);
      }
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="md" fullWidth>
      <DialogTitle>Upload to Google</DialogTitle>
      <DialogContent style={{ paddingTop: '6px', paddingBottom: '0px' }} sx={{ width: '100%', minWidth: '500px' }}>
        {processingComplete && (
          <Alert severity="success" sx={{ mb: 2, fontSize: '1.2rem', textAlign: 'center' }}>
            Processing Complete!
          </Alert>
        )}
        <Box
          component="form"
          noValidate
          autoComplete="off"
        >
          <Stack sx={{ marginTop: '16px', width: '100%', minWidth: '500px' }}>
            <TextField
              style={{ paddingBottom: '8px' }}
              label="Album Name"
              value={albumName}
              onChange={(event) => setAlbumName(event.target.value)}
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
      <DialogActions
      >
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleUploadToGoogle} autoFocus>
          Upload
        </Button>
      </DialogActions>

    </Dialog>
  );
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
  };
}

export default connect(mapStateToProps)(UploadToGoogleDialog);



