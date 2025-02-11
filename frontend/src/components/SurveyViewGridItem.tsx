import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Grid, Card, GridSize } from '@mui/material';
import NewSurveyViewImageContainer from './SurveyViewImageContainer';
import { TedTaggerDispatch } from '../models';
import { getSurveyModeZoomFactor } from '../selectors';
import { MediaItem } from '../types';

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  margin: '8px',
  width: '100%',
  height: '100%',
  backgroundColor: 'lightcoral',
  boxShadow: 'none',
};

export interface NewSurveyViewGridItemsPropsFromParent {
  mediaItem: MediaItem;
  numGridColumns: number;
  numGridRows: number;
}

export interface NewSurveyViewGridItemsProps extends NewSurveyViewGridItemsPropsFromParent {
  surveyModeZoomFactor: number;
}

function NewSurveyViewGridItems(props: NewSurveyViewGridItemsProps) {

  const numColumns: number = props.numGridColumns;
  const gridItemSize: GridSize = 12 / numColumns;

  return (
    <Grid item lg={gridItemSize}>
      <Card
        sx={cardStyle}
      >
        <NewSurveyViewImageContainer
          mediaItem={props.mediaItem}
          numGridColumns={props.numGridColumns}
          numGridRows={props.numGridRows}
        >
        </NewSurveyViewImageContainer>
      </Card>
    </Grid>
  );
}

function mapStateToProps(state: any, ownProps: any) {
  return {
    mediaItem: ownProps.mediaItem,
    surveyModeZoomFactor: getSurveyModeZoomFactor(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NewSurveyViewGridItems);
