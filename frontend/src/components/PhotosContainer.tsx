import React, { } from 'react';
import { connect } from 'react-redux';

import '../styles/TedTagger.css';
import LoupeViewController from './LoupeViewController';
import SurveyView from './SurveyView';
import { getAppInitialized, getMediaItems, getPhotoLayout } from '../selectors';
import { PhotoLayout, MediaItem } from '../types';
import GridView from './GridView';
import GridViewContainer from './GridViewContainer';

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
            <LoupeViewController />
          </div>
        </React.Fragment>
      );
    } else if (props.photoLayout === PhotoLayout.Survey) {
      return (
        <React.Fragment>
          <div id='centerColumn' className='centerColumnStyle'>
            <SurveyView />
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div id='centerColumn'>
            <GridViewContainer />
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

export default connect(mapStateToProps)(PhotosContainer);
