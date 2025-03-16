import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import '../styles/TedTagger.css';
import LoupeViewController from './LoupeViewController';
import SurveyView from './SurveyView';
import { getAppInitialized, getFilteredMediaItems, getMediaItems, getPhotoLayout } from '../selectors';
import { PhotoLayout, MediaItem } from '../types';
import GridViewContainer from './GridViewContainer';

export interface PhotosContainerProps {
  appInitialized: boolean;
  photoLayout: PhotoLayout;
  allMediaItems: Pick<MediaItem, 'uniqueId' | 'fileName'>[]; // Match filtered type
}

const PhotosContainer = React.memo((props: PhotosContainerProps) => {

// const PhotosContainer = (props: PhotosContainerProps) => {
  const prevProps = useRef<PhotosContainerProps | null>(null);

  useEffect(() => {
    if (prevProps.current) {
      const changedProps: Partial<PhotosContainerProps> = {};
  
      if (prevProps.current.appInitialized !== props.appInitialized) {
        changedProps.appInitialized = props.appInitialized;
      }
      if (prevProps.current.photoLayout !== props.photoLayout) {
        changedProps.photoLayout = props.photoLayout;
      }
      if (prevProps.current.allMediaItems !== props.allMediaItems) {
        console.log("Previous allMediaItems:", prevProps.current.allMediaItems);
        console.log("New allMediaItems:", props.allMediaItems);
        console.log(
          "Shallow comparison:",
          prevProps.current.allMediaItems === props.allMediaItems
        );
        changedProps.allMediaItems = props.allMediaItems;
      }
  
      if (Object.keys(changedProps).length > 0) {
        console.log("PhotosContainer: rerender due to changes in:", changedProps);
      }
    }
    prevProps.current = props;
  }, [props]);
  
  if (!props.appInitialized) {
    return null;
  }

  if (props.allMediaItems.length === 0) {
    return null;
  }

  const renderPhotoDisplay = (): JSX.Element => {
    if (props.photoLayout === PhotoLayout.Loupe) {
      return (
        <div id='centerColumn'>
          <LoupeViewController />
        </div>
      );
    } else if (props.photoLayout === PhotoLayout.Survey) {
      return (
        <div id='centerColumn' className='centerColumnStyle'>
          <SurveyView />
        </div>
      );
    } else {
      return (
        <div id='centerColumn'>
          <GridViewContainer />
        </div>
      );
    }
  };

  return (
    <div>
      {renderPhotoDisplay()}
    </div>
  );
});

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    allMediaItems: getFilteredMediaItems(state), // Use optimized selector
    photoLayout: getPhotoLayout(state),
  };
}

export default connect(mapStateToProps)(PhotosContainer);
