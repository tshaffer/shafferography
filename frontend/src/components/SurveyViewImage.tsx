import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TedTaggerDispatch } from '../models';
import { getSurveyModeZoomFactor, getMediaItemZoomFactor, getFocusedSurveyViewMediaItemId } from '../selectors';
import { MediaItem } from '../types';
import { getPhotoUrl } from '../utilities';
import { borderSizeStr } from '../constants';


export interface SurveyViewImagePropsFromParent {
  mediaItem: MediaItem;
}

export interface SurveyViewImageProps extends SurveyViewImagePropsFromParent {
  focusedSurveyViewMediaItemId: string;
  surveyModeZoomFactor: number;
  mediaItemZoomFactor: number;
}

function SurveyViewImage(props: SurveyViewImageProps) {

  const photoUrl = getPhotoUrl(props.mediaItem);

  const elementId: string = 'surveyImage' + props.mediaItem.uniqueId;
  const imageElement = document.getElementById(elementId) as HTMLImageElement | null;
  const zoomFactor = props.surveyModeZoomFactor * props.mediaItemZoomFactor;
  if (imageElement) {
    imageElement.style.transform = `translate(-50%, -50%) scale(${zoomFactor})`;
  }

  const isFocused: boolean = props.focusedSurveyViewMediaItemId === props.mediaItem.uniqueId;
  
  return (
    <img
      id={elementId}
      src={photoUrl}
      className='surveyImageStyle'
      style={{ border: `${borderSizeStr} solid ${isFocused ? 'black' : 'white'}` }}
      loading="lazy"
    />
  );
}

function mapStateToProps(state: any, ownProps: any) {
  return {
    mediaItem: ownProps.mediaItem,
    focusedSurveyViewMediaItemId: getFocusedSurveyViewMediaItemId(state),
    surveyModeZoomFactor: getSurveyModeZoomFactor(state),
    mediaItemZoomFactor: getMediaItemZoomFactor(state, ownProps.mediaItem.uniqueId),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyViewImage);
