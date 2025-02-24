import * as React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import { getAppInitialized } from '../selectors';
import { Button, DialogActions, DialogContent, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import { getAlbumNamesWherePeopleNotRetrieved } from '../controllers/googleUploader';

export interface MergePeopleDialogPropsFromParent {
  open: boolean;
  onMergePeople: (albumName: string) => void;
  onClose: () => void;
}

export interface MergePeopleDialogProps extends MergePeopleDialogPropsFromParent {
  appInitialized: boolean;
}

const MergePeopleDialog = (props: MergePeopleDialogProps) => {

  const { open, onClose } = props;

  const [albumNames, setAlbumNames] = React.useState<string[]>([]);
  const [selectedAlbum, setSelectedAlbum] = React.useState<string>('');

  React.useEffect(() => {

    if (!props.open) {
      return;
    }

    console.log('getAlbumNamesWherePeopleNotRetrieved');
    getAlbumNamesWherePeopleNotRetrieved().then((albumNames) => {
      console.log('retrievedAlbumNames', albumNames);
      setAlbumNames(albumNames);
      setSelectedAlbum(albumNames[0]);
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

  function handleMerge(): void {
    props.onMergePeople(selectedAlbum);
  }

  const handleAlbumChange = (event: SelectChangeEvent<string>) => {
    const selectedAlbum = event.target.value as string;
    console.log('handleAlbumChange', selectedAlbum);
    setSelectedAlbum(selectedAlbum);
  };

  const renderAlbumNameMenuItem = (albumName: string): JSX.Element => {
    return (
      <MenuItem
        key={albumName}
        value={albumName}
      >
        {albumName}
      </MenuItem>
    );
  };

  const renderAlbumNameMenuItems = (): JSX.Element[] => {
    const albumNameMenuItems: JSX.Element[] = albumNames.map((albumName) => {
      return renderAlbumNameMenuItem(albumName);
    }
    );
    return albumNameMenuItems;
  }

  const renderAlbumNamesSelect = (): JSX.Element => {
    const albumNameMenuItems = renderAlbumNameMenuItems();
    function handleChangeAlbumName(event: SelectChangeEvent<any>): void {
      throw new Error('Function not implemented.');
    }

    return (
      <Select
        value={selectedAlbum}
        onChange={handleAlbumChange}
        input={<OutlinedInput label="Album" />}
      >
        {albumNameMenuItems}
      </Select>
    );

  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Merge People</DialogTitle>
      <DialogContent>
        {renderAlbumNamesSelect()}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleMerge} disabled={(albumNames.length === 0) || (selectedAlbum === '')}>
          Merge
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

export default connect(mapStateToProps)(MergePeopleDialog);
