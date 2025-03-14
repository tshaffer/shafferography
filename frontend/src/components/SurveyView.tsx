import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import '../styles/TedTagger.css';
import SurveyViewGridItem from './SurveyViewGridItem';
import { Box, Grid } from '@mui/material';
import { TedTaggerDispatch } from '../models';
import { getAppInitialized, getSelectedMediaItems } from '../selectors';
import { MediaItem } from '../types';

export interface SurveyViewProps {
  appInitialized: boolean;
  selectedMediaItems: MediaItem[],
}

const SurveyView = (props: SurveyViewProps) => {

  if (!props.appInitialized) {
    return null;
  }

  const numSelectedMediaItems: number = props.selectedMediaItems.length;

  if (numSelectedMediaItems < 2) {
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
  if (numSelectedMediaItems > 10) {
    numGridRows = 3;
  } else if (numSelectedMediaItems > 3) {
    numGridRows = 2;
  }

  let numGridColumns = Math.trunc(numSelectedMediaItems / numGridRows);
  if ((numGridRows * numGridColumns) < numSelectedMediaItems) {
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
    selectedMediaItems: getSelectedMediaItems(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyView);
