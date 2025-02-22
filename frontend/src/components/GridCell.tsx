import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { TedTaggerDispatch, setLoupeViewMediaItemIdRedux, setPhotoLayoutRedux } from '../models';

import '../styles/TedTagger.css';
import { MediaItem, PhotoLayout } from '../types';
import { isMediaItemSelected } from '../selectors';
import { getPhotoUrl } from '../utilities';
import { selectPhoto } from '../controllers';
import { borderSizeStr } from '../constants';

export interface GridCellPropsFromParent {
  mediaItemIndex: number;
  mediaItem: MediaItem;
  rowHeight: number;
  cellWidth: number;
  setTooltip: (tooltip: { text: string; position: { top: number; left: number } } | null) => void;
}

export interface GridCellProps extends GridCellPropsFromParent {
  isSelected: boolean;
  onClickPhoto: (id: string, commandKey: boolean, shiftKey: boolean) => void;
  onSetLoupeViewMediaItemId: (id: string) => void;
  onSetPhotoLayoutRedux: (photoLayout: PhotoLayout) => void;
}

const GridCell = (props: GridCellProps) => {

  // console.log(`Rendering GridCell for: ${props.mediaItem.fileName}`);

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

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    props.setTooltip({
      text: mediaItem.fileName,
      position: { top: rect.top + 30, left: rect.left + rect.width / 2 },
    });
    setHovered(true);
  };
  const handleMouseLeave = () => {
    props.setTooltip(null);
    setHovered(false);
  }

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

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        width: `${props.cellWidth}px`,
        height: `${props.rowHeight}px`,
        border: `${borderSizeStr} solid ${props.isSelected ? 'white' : 'white'}`,
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

      <img src={photoUrl} width={props.cellWidth} height={props.rowHeight} loading='lazy' />
    </div>
  );
};

function mapStateToProps(state: any, ownProps: GridCellPropsFromParent) {
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

const MemoizedGridCell = React.memo(GridCell, (prevProps, nextProps) => {
  // console.log("GridCell re-render check");

  // if (prevProps.isSelected !== nextProps.isSelected) {
  //   console.log(`GridCell ${prevProps.mediaItem.fileName} re-rendered because isSelected changed.`);
  // }
  // if (prevProps.mediaItem.uniqueId !== nextProps.mediaItem.uniqueId) {
  //   console.log(`GridCell ${prevProps.mediaItem.fileName} re-rendered because mediaItem changed.`);
  // }

  return (
    prevProps.rowHeight === nextProps.rowHeight &&
    prevProps.cellWidth === nextProps.cellWidth &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.mediaItem.uniqueId === nextProps.mediaItem.uniqueId
  );
});

export default connect(mapStateToProps, mapDispatchToProps)(MemoizedGridCell);
