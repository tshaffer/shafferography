import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { CardMedia, IconButton } from '@mui/material';


import NewSurveyViewImage from './NewSurveyViewImage';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { surveyRowHeights } from '../../constants';
import { deleteSurveyViewImageContainerItem } from '../../controllers';
import { TedTaggerDispatch, setMediaItemZoomFactor } from '../../models';
import { getSurveyModeZoomFactor, getMediaItemZoomFactor } from '../../selectors';
import { MediaItem } from '../../types';
import { getPhotoUrl } from '../../utilities';
import ConfirmationDialog from '../ConfirmationDialog';

const cardMediaStyle = {
  objectFit: 'contain',
  height: '1080px',
  backgroundColor: 'purple',
};

export interface NewSurveyViewImageContainerPropsFromParent {
  mediaItem: MediaItem;
  numGridColumns: number;
  numGridRows: number;
}

export interface NewSurveyViewImageContainerProps extends NewSurveyViewImageContainerPropsFromParent {
  surveyModeZoomFactor: number;
  mediaItemZoomFactor: number;
  onDeleteSurveyViewImageContainerItem: (mediaItemId: string) => any;
  onSetMediaItemZoomFactor: (mediaItemId: string, zoomFactor: number) => any;
}

function NewSurveyViewImageContainer(props: NewSurveyViewImageContainerProps) {

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleSurveyViewImageZoomIn = () => {
    props.onSetMediaItemZoomFactor(props.mediaItem.uniqueId, props.mediaItemZoomFactor + 0.2);
  };

  const handleSurveyViewImageZoomOut = () => {
    props.onSetMediaItemZoomFactor(props.mediaItem.uniqueId, props.mediaItemZoomFactor - 0.2);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  function handleDeleteSurveyPhoto() {
    setOpenDialog(true);
  }

  const handleConfirmDelete = () => {
    setOpenDialog(false);
    props.onDeleteSurveyViewImageContainerItem(props.mediaItem.uniqueId);
  };

  const photoUrl = getPhotoUrl(props.mediaItem);

  const cardMediaHeight: number = surveyRowHeights[props.numGridRows - 1];
  cardMediaStyle.height = cardMediaHeight.toString() + 'px';

  return (
    <React.Fragment>
      <div>
        <ConfirmationDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmDelete}
          title="Confirm Delete"
          message={'Are you sure you want to delete ' + props.mediaItem.fileName + '?'}
        />
      </div>
      <CardMedia
        id={props.mediaItem.uniqueId}
        className='survey-image-container'
        title={photoUrl}
        sx={cardMediaStyle}
      >
        <div>
          <NewSurveyViewImage
            mediaItem={props.mediaItem}
          />
          <div
            className='overlayIconStyle'>
            <IconButton
              onClick={() => {
                handleSurveyViewImageZoomIn();
              }}>
              <AddIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                handleSurveyViewImageZoomOut();
              }}>
              <RemoveIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                handleDeleteSurveyPhoto();
              }}>
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      </CardMedia>
    </React.Fragment>
  );
}

function mapStateToProps(state: any, ownProps: any) {
  return {
    mediaItem: ownProps.mediaItem,
    surveyModeZoomFactor: getSurveyModeZoomFactor(state),
    mediaItemZoomFactor: getMediaItemZoomFactor(state, ownProps.mediaItem.uniqueId),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onDeleteSurveyViewImageContainerItem: deleteSurveyViewImageContainerItem,
    onSetMediaItemZoomFactor: setMediaItemZoomFactor,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NewSurveyViewImageContainer);
