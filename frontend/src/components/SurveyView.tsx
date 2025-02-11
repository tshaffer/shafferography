import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import '../styles/TedTagger.css';
import NewSurveyViewGridItem from './SurveyViewGridItem';
import { Box, Card, CardMedia, Grid } from '@mui/material';
import { TedTaggerDispatch } from '../models';
import { getAppInitialized, getSelectedMediaItems } from '../selectors';
import { MediaItem } from '../types';
import { getPhotoUrl } from '../utilities';

export interface NewSurveyViewProps {
  appInitialized: boolean;
  selectedMediaItems: MediaItem[],
}

const NewSurveyView = (props: NewSurveyViewProps) => {

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
      <NewSurveyViewGridItem
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


  /*
    equation / calculation for ngc


    one row
      nsmi <= 3
        ngc = nsmi
    two rows
      nsmi = 4
        ngc = 2
      nsmi = 5
        ngc = 3
      nsmi = 6
        ngc = 3
      nsmi = 7
        ngc = 4
      nsmi = 8
        ngc = 4
      nsmi = 9
        ngc = 5
      nsmi = 10
        ngc = 5
    three rows
  */
  // const numGridColumns = Math.trunc(numSelectedMediaItems / numRows);

  const photoComponents: JSX.Element[] = props.selectedMediaItems.map((mediaItem) => {
    return getPhotoComponent(mediaItem, numGridRows, numGridColumns);
  });

  // return (
  //   <Box className='gridView' sx={{ flexGrow: 1 }}>
  //     <Grid container spacing={2}>
  //       {photoComponents}
  //     </Grid>
  //   </Box>
  // );

  return (
    <Grid container spacing={2} sx={{ p: 2, justifyContent: "center" }}>
      {props.selectedMediaItems.map((selectedMediaItem: MediaItem) => {
        const mediaItem: MediaItem | undefined = props.selectedMediaItems.find((p) => p.filePath! === selectedMediaItem.filePath);
        return mediaItem ? (
          <Grid item key={mediaItem.filePath} lg={6}>
            <Card sx={{ position: "relative", border: "2px solid blue", cursor: "pointer", '&:hover': { opacity: 0.8 } }}>
              <CardMedia component="img" image={getPhotoUrl(mediaItem)} />
            </Card>
          </Grid>
        ) : null;
      })}
    </Grid>
  );

};


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

export default connect(mapStateToProps, mapDispatchToProps)(NewSurveyView);
