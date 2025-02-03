import React from 'react';
import { connect, useSelector } from 'react-redux';
import { MediaItem, PhotoLayout } from '../types';
import { getMediaItems, isMediaItemSelected } from '../selectors';
import GridCell from './GridCell';
import { TedTaggerDispatch, setLoupeViewMediaItemIdRedux, setPhotoLayoutRedux } from '../models';
import { bindActionCreators } from 'redux';
import { selectPhoto } from '../controllers';

export interface GridRowProps {
  mediaItemIndex: number;
  numMediaItems: number;
  rowHeight: number;
  cellWidths: number[];
  allMediaItems: MediaItem[];
  displayMetadata: boolean;
  onClickPhoto: (id: string, commandKey: boolean, shiftKey: boolean) => void;
  onSetLoupeViewMediaItemId: (id: string) => void;
  onSetPhotoLayoutRedux: (photoLayout: PhotoLayout) => void;
}

const GridRow = React.memo((props: GridRowProps) => {
  if (!props.allMediaItems.length) return null;

  return (
    <div style={{ height: props.rowHeight, backgroundColor: 'white', position: 'relative' }}>
      <div style={{ display: 'flex' }}>
        {props.cellWidths.map((cellWidth, index) => {
          const mediaIndex = props.mediaItemIndex + index;
          if (mediaIndex >= props.allMediaItems.length) return null;
          const mediaItem = props.allMediaItems[mediaIndex];

          return (
            <GridCell
              key={mediaItem.uniqueId}
              mediaItemIndex={mediaIndex}
              mediaItem={mediaItem}
              rowHeight={props.rowHeight}
              cellWidth={cellWidth}
              displayMetadata={props.displayMetadata}
              onClickPhoto={props.onClickPhoto}
              onSetLoupeViewMediaItemId={props.onSetLoupeViewMediaItemId}
              onSetPhotoLayoutRedux={() => props.onSetPhotoLayoutRedux(PhotoLayout.Loupe)}
            />
          );
        })}
      </div>
    </div>
  );
});

export default connect((state: any) => ({
  allMediaItems: getMediaItems(state),
}))(GridRow);
