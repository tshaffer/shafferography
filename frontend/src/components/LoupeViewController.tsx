import * as React from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import LoupeView from './LoupeView';
import { setPhotoState, loadAndReplaceMediaItemsByViewSpec } from '../controllers';
import { TedTaggerDispatch, setLoupeViewMediaItemIdRedux, setFullScreenMode } from '../models';
import { getLoupeViewMediaItemId, getLoupeViewMediaItemIds, getMediaItems } from '../selectors';
import { MediaItem, PhotoState } from '../types';

export interface LoupeViewControllerProps {
  loupeViewMediaItemId: string;
  loupeViewMediaItemIds: string[];
  mediaItems: MediaItem[];
  onSetLoupeViewMediaItemId: (id: string) => any;
  onSetFullScreenMode: (fullScreenMode: boolean) => any;
  onSetPhotoState: (mediaItemIds: string[], photoState: PhotoState) => any;
  onReloadMediaItemsByViewSpec: () => any;
}

const LoupeViewController = (props: LoupeViewControllerProps) => {

  React.useEffect(() => {

    // console.log('NewLoupeViewController: React.useEffect - invoked');

    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
          handleDisplayNextPhoto();
          break;
        case 'ArrowLeft':
          handleDisplayPreviousPhoto();
          break;
        case 'Delete':
          handleDeletePhoto();
          break;
        default:
          break;
      }
    };

    const handleDisplayPreviousPhoto = () => {

      if (props.loupeViewMediaItemIds.length === 0) {
        return;
      }

      const loupeViewMediaItemId = props.loupeViewMediaItemId;

      const loupeViewMediaItemIndex = props.loupeViewMediaItemIds.indexOf(loupeViewMediaItemId);
      if (loupeViewMediaItemIndex < 0) {
        debugger;
      }

      const previousMediaItemIndex = loupeViewMediaItemIndex - 1;
      if (previousMediaItemIndex < 0) {
        return;
      } else {
        const previousMediaItemId: string = props.loupeViewMediaItemIds[previousMediaItemIndex];
        const previousMediaItem = props.mediaItems.find((mediaItem: MediaItem) => mediaItem.uniqueId === previousMediaItemId);
        props.onSetLoupeViewMediaItemId(previousMediaItem!.uniqueId);
      }
    };

    const handleDisplayNextPhoto = () => {

      if (props.loupeViewMediaItemIds.length === 0) {
        return;
      }

      const loupeViewMediaItemId = props.loupeViewMediaItemId;

      const loupeViewMediaItemIndex = props.loupeViewMediaItemIds.indexOf(loupeViewMediaItemId);
      if (loupeViewMediaItemIndex < 0) {
        debugger;
      }

      const nextMediaItemIndex = loupeViewMediaItemIndex + 1;
      if (nextMediaItemIndex >= props.loupeViewMediaItemIds.length) {
        // console.log('at end');
        return;
      } else {
        const nextMediaItemId: string = props.loupeViewMediaItemIds[nextMediaItemIndex];
        const nextMediaItem = props.mediaItems.find((mediaItem: MediaItem) => mediaItem.uniqueId === nextMediaItemId);
        // console.log('nextMediaItem: ' + nextMediaItem);
        props.onSetLoupeViewMediaItemId(nextMediaItem!.uniqueId);
      }
    };

    const handleDeletePhoto = () => {
      props.onSetPhotoState([props.loupeViewMediaItemId], PhotoState.Deleted)
        .then(() => {
          props.onReloadMediaItemsByViewSpec()
            .then(() => { });
        });
    }

    const handleFullScreenChange = () => {
      const enterFullScreenMode = document.fullscreenElement !== null;
      props.onSetFullScreenMode(enterFullScreenMode);
    };

    document.addEventListener('keydown', handleKeyPress);

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    // Remove the event listener when the component unmounts
    return () => {
      // console.log('NewLoupeViewController: React.useEffect - component unmounts');
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [props.loupeViewMediaItemId]);

  return (
    <LoupeView />
  );
};

function mapStateToProps(state: any) {
  return {
    loupeViewMediaItemId: getLoupeViewMediaItemId(state),
    loupeViewMediaItemIds: getLoupeViewMediaItemIds(state),
    mediaItems: getMediaItems(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onSetLoupeViewMediaItemId: setLoupeViewMediaItemIdRedux,
    onSetFullScreenMode: setFullScreenMode,
    onSetPhotoState: setPhotoState,
    onReloadMediaItemsByViewSpec: loadAndReplaceMediaItemsByViewSpec,
  }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(LoupeViewController);
