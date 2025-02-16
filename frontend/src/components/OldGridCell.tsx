import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { TedTaggerDispatch, setLoupeViewMediaItemIdRedux, setPhotoLayoutRedux } from '../models';

import '../styles/TedTagger.css';
import { MediaItem, PhotoLayout } from '../types';
import { isMediaItemSelected } from '../selectors';
import { getPhotoUrl } from '../utilities';
import { Tooltip } from '@mui/material';
import { selectPhoto } from '../controllers';
import { borderSizeStr } from '../constants';

export interface OldGridCellPropsFromParent {
  mediaItemIndex: number;
  mediaItem: MediaItem;
  rowHeight: number;
  cellWidth: number;
}

export interface OldGridCellProps extends OldGridCellPropsFromParent {
  isSelected: boolean;
  onClickPhoto: (id: string, commandKey: boolean, shiftKey: boolean) => void;
  onSetLoupeViewMediaItemId: (id: string) => void;
  onSetPhotoLayoutRedux: (photoLayout: PhotoLayout) => void;
}

const OldGridCell = (props: OldGridCellProps) => {

  // console.log(`Rendering OldGridCell for: ${props.mediaItem.fileName}`);

  const [hovered, setHovered] = React.useState(false);
  const [clickTimeout, setClickTimeout] = React.useState<NodeJS.Timeout | null>(null);

  const mediaItem: MediaItem = props.mediaItem;
  const photoUrl = getPhotoUrl(mediaItem);

  const handleDoubleClick = () => {
    props.onSetLoupeViewMediaItemId(props.mediaItem.uniqueId);
    props.onSetPhotoLayoutRedux(PhotoLayout.Loupe);
  };

  const handleClickPhoto = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    props.onClickPhoto(props.mediaItem.uniqueId, e.metaKey || e.ctrlKey, e.shiftKey);
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  const handleClicks = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (clickTimeout !== null) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      handleDoubleClick();
    } else {
      const clickTimeout = setTimeout(() => {
        clearTimeout(clickTimeout);
        setClickTimeout(null);
        handleClickPhoto(e);
      }, 200);
      setClickTimeout(clickTimeout);
    }
  };

  const widthAttribute = `${props.cellWidth}px`;
  const imgHeightAttribute = `${props.rowHeight}px`;
  const divHeightAttribute = `${props.rowHeight}px`;

  let borderAttr = `${borderSizeStr} solid ${props.isSelected ? 'white' : 'white'}`;

  // console.log("OldGridCell rerendered for:", props.mediaItem.fileName, "isSelected:", props.isSelected);
  // console.log("OldGridCell rerendered");

  // if (props.mediaItemIndex < 8) {
  //   console.log('render oldGridCell, index:', props.mediaItemIndex);
  //   console.log('height:', divHeightAttribute);
  // }

  return (
    <Tooltip title={props.mediaItem.fileName} placement='top'>
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          width: widthAttribute,
          height: divHeightAttribute,
          border: borderAttr,
          cursor: 'pointer',
        }}
        onClick={handleClicks}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Selection Checkmark */}
        {(hovered || props.isSelected) && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              width: '24px',
              height: '24px',
              backgroundColor: props.isSelected ? 'blue' : 'rgba(255,255,255,0.7)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
            onClick={handleClicks}
          >
            {props.isSelected && <span style={{ color: 'white', fontWeight: 'bold' }}>✔</span>}
          </div>
        )}

        {/* Blue overlay when selected */}
        {props.isSelected && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 255, 0.3)',
              zIndex: 5,
            }}
          />
        )}

        <img src={photoUrl} width={widthAttribute} height={imgHeightAttribute} loading='lazy' />
      </div>
    </Tooltip>
  );
};

function mapStateToProps(state: any, ownProps: OldGridCellPropsFromParent) {
  return {
    isSelected: isMediaItemSelected(state, ownProps.mediaItem),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators(
    {
      onClickPhoto: selectPhoto,
      onSetLoupeViewMediaItemId: setLoupeViewMediaItemIdRedux,
      onSetPhotoLayoutRedux: setPhotoLayoutRedux,
    },
    dispatch
  );
};

const MemoizedOldGridCell = React.memo(OldGridCell, (prevProps, nextProps) => {
  // console.log("OldGridCell re-render check");

  // if (prevProps.isSelected !== nextProps.isSelected) {
  //   console.log(`OldGridCell ${prevProps.mediaItem.fileName} re-rendered because isSelected changed.`);
  // }
  // if (prevProps.mediaItem.uniqueId !== nextProps.mediaItem.uniqueId) {
  //   console.log(`OldGridCell ${prevProps.mediaItem.fileName} re-rendered because mediaItem changed.`);
  // }

  return (
    prevProps.rowHeight === nextProps.rowHeight &&
    prevProps.cellWidth === nextProps.cellWidth &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.mediaItem.uniqueId === nextProps.mediaItem.uniqueId
  );
});

export default connect(mapStateToProps, mapDispatchToProps)(MemoizedOldGridCell);
