import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { getAppInitialized } from '../selectors';
import { Button, DialogActions, DialogContent } from '@mui/material';

import { PhotoState } from '../types';
import { reloadMediaItemsByViewSpec } from '../controllers';

export interface ViewByReviewsLevelDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
}

export interface ViewByReviewsLevelDialogProps extends ViewByReviewsLevelDialogPropsFromParent {
  appInitialized: boolean;
  onReloadMediaItemsByViewSpec: () => void;
}

const photoStates = [
  { key: 'Unreviewed', value: PhotoState.Unreviewed },
  { key: 'Undecided', value: PhotoState.Undecided },
  { key: 'Ready For Upload', value: PhotoState.ReadyForUpload },
  { key: 'Uploaded', value: PhotoState.Uploaded },
  { key: 'Deleted', value: PhotoState.Deleted },
];

const ViewByReviewsLevelDialog = (props: ViewByReviewsLevelDialogProps) => {
  const { open, onClose } = props;

  const [selectedPhotoStates, setSelectedPhotoStates] = React.useState<PhotoState[]>([]);

  if (!props.appInitialized) {
    return null;
  }

  if (!open) {
    return null;
  }

  const handleClose = () => {
    onClose();
  };

  const handleViewByPhotoStates = () => {
    props.onReloadMediaItemsByViewSpec();
    onClose();
  };

  const handleCheckboxChange = (level: PhotoState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedPhotoStates((prev) => [...prev, level]);
    } else {
      setSelectedPhotoStates((prev) => prev.filter((l) => l !== level));
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Review Levels</DialogTitle>
      <DialogContent style={{ paddingBottom: '0px' }}>
        <Box component="form" noValidate autoComplete="off">
          <FormGroup>
            {photoStates.map(({ key, value }) => (
              <FormControlLabel
                key={value}
                control={
                  <Checkbox
                    checked={selectedPhotoStates.includes(value)}
                    onChange={handleCheckboxChange(value)}
                  />
                }
                label={key}
              />
            ))}
          </FormGroup>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleViewByPhotoStates} autoFocus>
          OK
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

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onReloadMediaItemsByViewSpec: reloadMediaItemsByViewSpec,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewByReviewsLevelDialog);
