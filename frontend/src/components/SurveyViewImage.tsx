import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TedTaggerDispatch } from '../models';
import { getSurveyModeZoomFactor, getMediaItemZoomFactor } from '../selectors';
import { MediaItem } from '../types';
import { getPhotoUrl } from '../utilities';


export interface NewSurveyViewImagePropsFromParent {
  mediaItem: MediaItem;
}

export interface NewSurveyViewImageProps extends NewSurveyViewImagePropsFromParent {
  surveyModeZoomFactor: number;
  mediaItemZoomFactor: number;
}

function NewSurveyViewImage(props: NewSurveyViewImageProps) {

  const photoUrl = getPhotoUrl(props.mediaItem);

  const elementId: string = 'surveyImage' + props.mediaItem.uniqueId;
  const imageElement = document.getElementById(elementId) as HTMLImageElement | null;
  const zoomFactor = props.surveyModeZoomFactor * props.mediaItemZoomFactor;
  if (imageElement) {
    imageElement.style.transform = `translate(-50%, -50%) scale(${zoomFactor})`;
  }

  return (
    <img
      id={elementId}
      src={photoUrl}
      className='surveyImageStyle'
      loading="lazy"
    />
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
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NewSurveyViewImage);
