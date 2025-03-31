import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import '../styles/TedTagger.css';
import LoupeViewController from './LoupeViewController';
import SurveyView from './SurveyView';
import { getAppInitialized, getFilteredMediaItems, getMediaItems, getPhotoLayout } from '../selectors';
import { PhotoLayout, MediaItem, FilteredMediaItemPropertyName } from '../types';
import GridViewContainer from './GridViewContainer';
import GridView from './GridView';

export interface PhotosContainerProps {
  appInitialized: boolean;
  photoLayout: PhotoLayout;
  allMediaItems: Pick<MediaItem, FilteredMediaItemPropertyName>[]; // Match filtered type
}

const PhotosContainer = React.memo((props: PhotosContainerProps) => {

  const [tooltip, setTooltip] = React.useState<{ text: string; position: { top: number; left: number } } | null>(null);

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
        changedProps.allMediaItems = props.allMediaItems;
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

  return (
    <div id='centerColumn' style={{ width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <GridView setTooltip={setTooltip} />
      </div>
    </div>
  );
});

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    allMediaItems: getFilteredMediaItems(state),
    photoLayout: getPhotoLayout(state),
  };
}

export default connect(mapStateToProps)(PhotosContainer);
