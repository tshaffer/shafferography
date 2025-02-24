import * as React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import { getAppInitialized } from '../selectors';
import { Button, DialogActions, DialogContent, List, ListItemText } from '@mui/material';
import { getAlbumNamesWherePeopleNotRetrieved } from '../controllers/googleUploader';

export interface RetrievePeopleDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
}

export interface RetrievePeopleDialogProps extends RetrievePeopleDialogPropsFromParent {
  appInitialized: boolean;
}

const RetrievePeopleDialog = (props: RetrievePeopleDialogProps) => {

  const { open, onClose } = props;

  const [albumNames, setAlbumNames] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!props.open) {
      return;
    }
    console.log('getAlbumNamesWherePeopleNotRetrieved');
    getAlbumNamesWherePeopleNotRetrieved().then((albumNames) => {
      console.log('retrievedAlbumNames', albumNames);
      setAlbumNames(albumNames);
    });
  }, [props.open]);


  if (!props.appInitialized) {
    return null;
  }

  if (!open) {
    return null;
  }

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Albums Pending People Merge</DialogTitle>
      <DialogContent>
        <List>
          {albumNames.map((albumName) => {
            return (
              <ListItemText key={albumName}>
                {albumName}
              </ListItemText>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
  };
}

export default connect(mapStateToProps)(RetrievePeopleDialog);
