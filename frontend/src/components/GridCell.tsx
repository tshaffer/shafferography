import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/*
  Unreviewed:     VisibilityOffIcon = 'unreviewed',
  ReadyForReview: GradingIcon = 'readyForReview',
  UploadIcon:     ReadyForUpload = 'readyForUpload',
  CloudQueueIcon: UploadedToGoogle = 'uploadedToGoogle',
*/
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GradingIcon from '@mui/icons-material/Grading';
import UploadIcon from '@mui/icons-material/Upload';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';

import { TedTaggerDispatch, setLoupeViewMediaItemIdRedux, setPhotoLayoutRedux } from '../models';

import '../styles/TedTagger.css';
import { MediaItem, PhotoLayout } from '../types';
import { getDisplayMetadata, getKeywordLabelsForMediaItem, getMediaItems, isMediaItemSelected } from '../selectors';
import { getPhotoUrl } from '../utilities';
import { Tooltip, Typography } from '@mui/material';
import { selectPhoto } from '../controllers';
import { borderSizeStr } from '../constants';

export interface GridCellPropsFromParent {
  mediaItemIndex: number;
  mediaItem: MediaItem;
  rowHeight: number;
  cellWidth: number;
}

export interface GridCellProps extends GridCellPropsFromParent {
  displayMetadata: boolean;
  isSelected: boolean;
  keywordLabels: string[];
  onClickPhoto: (id: string, commandKey: boolean, shiftKey: boolean) => void;
  onSetLoupeViewMediaItemId: (id: string) => void;
  onSetPhotoLayoutRedux: (photoLayout: PhotoLayout) => void;
}

// const softGray = 'rgba(255, 255, 255, 0.8)';
const mutedWhite = 'rgba(255, 255, 255, 0.9)';
// const softBlack = 'rgba(0, 0, 0, 0.6)';
// const lightBlue = '#80D8FF';
// const mutedYellow = '#FFD54F';
// const desaturatedGreen = '#A5D6A7';
// const transparentAccent = 'rgba(255, 87, 34, 0.7)';

const reviewLevelIconStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '8px',
  left: '8px',
  fontSize: '20px',
  color: mutedWhite,
};

const GridCell = (props: GridCellProps) => {

  console.log(`Rendering GridCell for: ${props.mediaItem.fileName}`);

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

  const getMetadataJsx = (): JSX.Element | null => {
    if (!props.displayMetadata) return null;

    return (
      <div style={{ backgroundColor: 'silver', minHeight: '60px' }}>
        <Typography variant='body2' color='black' fontSize='12px'>
          {mediaItem.fileName}
        </Typography>
      </div>
    );
  };

  const renderReviewLevelIcon = (): JSX.Element => {
    switch (props.mediaItem.reviewLevel) {
      case 'unreviewed':
      default:
        return <VisibilityOffIcon style={reviewLevelIconStyle} />;
      case 'readyForReview':
        return <GradingIcon style={reviewLevelIconStyle} />;
      case 'readyForUpload':
        return <UploadIcon style={reviewLevelIconStyle} />;
      case 'uploadedToGoogle':
        return <CloudQueueIcon style={reviewLevelIconStyle} />;
    }
  }
  const widthAttribute = `${props.cellWidth}px`;
  const metadataHeight = props.displayMetadata ? 60 : 0;
  const imgHeightAttribute = `${props.rowHeight}px`;
  const divHeightAttribute = `${props.rowHeight + metadataHeight}px`;

  let borderAttr = `${borderSizeStr} solid ${props.isSelected ? 'white' : 'white'}`;

  // console.log("GridCell rerendered for:", props.mediaItem.fileName, "isSelected:", props.isSelected);
  console.log("GridCell rerendered");

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
        {getMetadataJsx()}
        {/* Icon overlay */}
        {renderReviewLevelIcon()}
      </div>
    </Tooltip>
  );
};

function mapStateToProps(state: any, ownProps: GridCellPropsFromParent) {
  const displayMetadata = getDisplayMetadata(state);
  const isSelected = isMediaItemSelected(state, ownProps.mediaItem);
  const keywordLabels = getKeywordLabelsForMediaItem(state, ownProps.mediaItem);

  return {
    displayMetadata,
    isSelected,
    keywordLabels,
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
  console.log("GridCell re-render check");

  if (prevProps.isSelected !== nextProps.isSelected) {
    console.log(`GridCell ${prevProps.mediaItem.fileName} re-rendered because isSelected changed.`);
  }
  if (prevProps.mediaItem.uniqueId !== nextProps.mediaItem.uniqueId) {
    console.log(`GridCell ${prevProps.mediaItem.fileName} re-rendered because mediaItem changed.`);
  }
  if (prevProps.displayMetadata !== nextProps.displayMetadata) {
    console.log(`GridCell ${prevProps.mediaItem.fileName} re-rendered because displayMetadata changed.`);
  }
  if (prevProps.keywordLabels.length !== nextProps.keywordLabels.length) {
    console.log(`GridCell ${prevProps.mediaItem.fileName} re-rendered because keywordLabels changed.`);
  }

  return (
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.mediaItem.uniqueId === nextProps.mediaItem.uniqueId &&
    prevProps.displayMetadata === nextProps.displayMetadata &&
    prevProps.keywordLabels.length === nextProps.keywordLabels.length
  );
});

export default connect(mapStateToProps, mapDispatchToProps)(MemoizedGridCell);
