import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import '../styles/TedTagger.css';
import SurveyViewGridItem from './SurveyViewGridItem';
import { Box, Grid } from '@mui/material';
import { setFocusedSurveyViewMediaItemId, TedTaggerDispatch } from '../models';
import { getAppInitialized, getFocusedSurveyViewMediaItemId, getSelectedMediaItems, getSurveyViewMediaItemIds } from '../selectors';
import { MediaItem } from '../types';
import React from 'react';

export interface SurveyViewProps {
  appInitialized: boolean;
  selectedMediaItems: MediaItem[],
  focusedSurveyViewMediaItemId: string;
  surveyViewMediaItemIds: string[];
  onSetFocusedSurveyViewMediaItemId: (id: string) => any;
}

const SurveyView = (props: SurveyViewProps) => {

  React.useEffect(() => {

    console.log('SurveyView: React.useEffect - invoked');

    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
          handleFocusNextPhoto();
          break;
        case 'ArrowLeft':
          handleFocusPreviousPhoto();
          break;
        default:
          break;
      }
    };

    const handleFocusPreviousPhoto = () => {

      console.log('SurveyView: handleFocusPreviousPhoto - invoked');

      const focusedSurveyViewMediaItemId = props.focusedSurveyViewMediaItemId;

      const focusedSurveyViewMediaItemIndex = props.surveyViewMediaItemIds.indexOf(focusedSurveyViewMediaItemId);
      if (focusedSurveyViewMediaItemIndex < 0) {
        debugger;
      }

      const previousMediaItemIndex = focusedSurveyViewMediaItemIndex - 1;
      if (previousMediaItemIndex < 0) {
        console.log('at beginning');
        return;
      } else {
        const previousMediaItemId: string = props.surveyViewMediaItemIds[previousMediaItemIndex];
        const previousMediaItem = props.selectedMediaItems.find((mediaItem: MediaItem) => mediaItem.uniqueId === previousMediaItemId);
        props.onSetFocusedSurveyViewMediaItemId(previousMediaItem!.uniqueId);
        // if (props.surveyViewMediaItemIds.length === 1) {
        //   props.onDeselectAllPhotos(); // only perform the deselect if there's only a single selected item.
        //   props.onSelectPhoto(previousMediaItem!.uniqueId, false, false);
        // }
      }
    }

    const handleFocusNextPhoto = () => {
      console.log('SurveyView: handleFocusNextPhoto - invoked');

      const focusedSurveyViewMediaItemId = props.focusedSurveyViewMediaItemId;

      const focusedSurveyViewMediaItemIndex = props.surveyViewMediaItemIds.indexOf(focusedSurveyViewMediaItemId);
      if (focusedSurveyViewMediaItemIndex < 0) {
        debugger;
      }

      const nextMediaItemIndex = focusedSurveyViewMediaItemIndex + 1;
      if (nextMediaItemIndex >= props.surveyViewMediaItemIds.length) {
        console.log('at end');
        return;
      } else {
        const nextMediaItemId: string = props.surveyViewMediaItemIds[nextMediaItemIndex];
        const nextMediaItem = props.selectedMediaItems.find((mediaItem: MediaItem) => mediaItem.uniqueId === nextMediaItemId);
        console.log('nextMediaItem: ', nextMediaItem);
        props.onSetFocusedSurveyViewMediaItemId(nextMediaItem!.uniqueId);
        // if (props.surveyViewMediaItemIds.length === 1) {
        //   props.onDeselectAllPhotos(); // only perform the deselect if there's only a single selected item.
        //   props.onSelectPhoto(nextMediaItem!.uniqueId, false, false);
        // }
      }

    }

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [props.focusedSurveyViewMediaItemId]);


  if (!props.appInitialized) {
    return null;
  }

  const numSurveyViewMediaItems: number = props.surveyViewMediaItemIds.length;

  if (numSurveyViewMediaItems < 2) {
    return null;
  }

  const getPhotoComponent = (
    mediaItem: MediaItem,
    numGridRows: number,
    numGridColumns: number
  ): JSX.Element => {
    return (
      <SurveyViewGridItem
        key={mediaItem.uniqueId}
        mediaItem={mediaItem}
        numGridRows={numGridRows}
        numGridColumns={numGridColumns}
      />
    );
  };


  let numGridRows = 1;
  if (numSurveyViewMediaItems > 10) {
    numGridRows = 3;
  } else if (numSurveyViewMediaItems > 3) {
    numGridRows = 2;
  }

  let numGridColumns = Math.trunc(numSurveyViewMediaItems / numGridRows);
  if ((numGridRows * numGridColumns) < numSurveyViewMediaItems) {
    numGridColumns += 1;
  }

  const photoComponents: JSX.Element[] = props.selectedMediaItems.map((mediaItem) => {
    return getPhotoComponent(mediaItem, numGridRows, numGridColumns);
  });

  return (
    <Box
      id='surveyView'
      sx={{
        flexGrow: 1,
        maxHeight: '100%',
      }}>
      <Grid container spacing={2}>
        {photoComponents}
      </Grid>
    </Box>
  );
}

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    focusedSurveyViewMediaItemId: getFocusedSurveyViewMediaItemId(state),
    surveyViewMediaItemIds: getSurveyViewMediaItemIds(state),
    selectedMediaItems: getSelectedMediaItems(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onSetFocusedSurveyViewMediaItemId: setFocusedSurveyViewMediaItemId,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyView);
