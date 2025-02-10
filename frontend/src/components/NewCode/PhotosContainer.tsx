import React, { } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import '../../styles/TedTagger.css';
import { TedTaggerDispatch } from '../../models';
import { getAppInitialized, getMediaItems, getPhotoLayout } from '../../selectors';

import { MediaItem, PhotoLayout } from '../../types';
import NewPhotoGrid from './NewPhotoGrid';
import NewLoupeViewController from './NewLoupeViewController';
import NewSurveyView from './NewSurveyView';

export interface PhotosContainerProps {
  appInitialized: boolean;
  photoLayout: PhotoLayout;
  allMediaItems: MediaItem[];
}

const PhotosContainer = (props: PhotosContainerProps) => {

  if (!props.appInitialized) {
    return null;
  }

  if (props.allMediaItems.length === 0) {
    return null;
  }


  const renderPhotoDisplay = (): JSX.Element => {
    if (props.photoLayout === PhotoLayout.Loupe) {
      return (
        <React.Fragment>
          <div id='centerColumn'>
            <NewLoupeViewController />
          </div>
        </React.Fragment>
      );
    } else if (props.photoLayout === PhotoLayout.Survey) {
      return (
        <React.Fragment>
          <div id='centerColumn' className='centerColumnStyle'>
            <NewSurveyView />
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div id='centerColumn'>
            <NewPhotoGrid />
          </div>
        </React.Fragment>
      );
    }
  };

  const photoDisplay: JSX.Element = renderPhotoDisplay();

  return (
    <div>
      {photoDisplay}
    </div>
  );
}

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    allMediaItems: getMediaItems(state),
    photoLayout: getPhotoLayout(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    // onLoadKeywordData: loadKeywordData,
    // onLoadMediaItems: loadMediaItems,
    // onLoadDeletedMediaItems: loadDeletedMediaItems,
    // onSetAppInitialized: setAppInitialized,
    // onLoadTakeouts: loadTakeouts,
    // onImportFromTakeout: importFromTakeout,
    // onSetGoogleUserProfile: setGoogleUserProfile,
  }, dispatch);
};

export default connect(mapStateToProps)(PhotosContainer);
