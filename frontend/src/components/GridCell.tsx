import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { TedTaggerDispatch, setLoupeViewMediaItemIdRedux, setPhotoLayoutRedux } from '../models';

import '../styles/TedTagger.css';
import { MediaItem, PhotoLayout, PhotoState } from '../types';
import { getDisplayMetadata, isMediaItemSelected } from '../selectors';
import { getCacheBustedPhotoUrl, getPhotoUrl } from '../utilities';
import { selectPhoto } from '../controllers';
import { borderSizeStr } from '../constants';
import { Icon, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

import HelpOutline from '@mui/icons-material/HelpOutline';
import CloudUpload from '@mui/icons-material/CloudUpload';
import CloudDone from '@mui/icons-material/CloudDone';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import ConstructionIcon from '@mui/icons-material/Construction';

export interface GridCellPropsFromParent {
  mediaItemIndex: number;
  mediaItem: MediaItem;
  rowHeight: number;
  cellWidth: number;
  setTooltip: (tooltip: { text: string; position: { top: number; left: number } } | null) => void;
}

export interface GridCellPropsDerivedStateProps {
  displayMetadata: boolean;
  isSelected: boolean;
}

export interface GridCellPropsDerivedActionCreatorProps {
  onClickPhoto: (id: string, commandKey: boolean, shiftKey: boolean) => void;
  onSetLoupeViewMediaItemId: (id: string) => void;
  onSetPhotoLayoutRedux: (photoLayout: PhotoLayout) => void;
}

export interface GridCellProps extends GridCellPropsDerivedStateProps, GridCellPropsDerivedActionCreatorProps, GridCellPropsFromParent { }

const GridCell = (props: GridCellProps) => {

  // console.log('GridCell:', props);

  const [hovered, setHovered] = React.useState(false);
  const [clickTimeout, setClickTimeout] = React.useState<NodeJS.Timeout | null>(null);

  const mediaItem: MediaItem = props.mediaItem;
  let photoUrl = getPhotoUrl(mediaItem);

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

  const getMetadataJsx = (): JSX.Element | null => {

    if (!props.displayMetadata) {
      return null;
    }

    const creationDate: Dayjs = dayjs(mediaItem.exif.takenAt!);
    const formattedCreationDate: string = creationDate.format('MM/DD/YYYY hh:mm A');
    // const keywords: string = props.keywordLabels.join(', ');

    let icon: JSX.Element | null = null;
    switch (mediaItem.photoState) {
      case PhotoState.Undecided:
        icon = <HelpOutline />;
        break;
      case PhotoState.ReadyForUpload:
        icon = <CloudUpload />;
        break;
      case PhotoState.Uploaded:
        icon = <CloudDone />;
        break;
      case PhotoState.Unreviewed:
        icon = <MoreHoriz />;
        break;
      case PhotoState.Deleted:
        icon = <DeleteIcon />;
        break;
      case PhotoState.PendingEdits:
        icon = <ConstructionIcon />;
        break;
    }

    return (
      <div style={{
        backgroundColor: 'silver',
        minHeight: '60px',
      }}
      >
        <Typography variant='body2' color='black' fontSize='12px'>
          <Icon color="inherit" >
            {icon}
          </Icon>
          <br />
          {mediaItem.fileName}
          <br />
          {formattedCreationDate}
        </Typography>
      </div >
    );

  };

  const widthAttribute: string = props.cellWidth.toString() + 'px';
  const metadataHeight: number = props.displayMetadata ? 60 : 0;
  const imgHeightAttribute: string = props.rowHeight.toString() + 'px';
  const divHeightAttribute: string = (props.rowHeight + metadataHeight).toString() + 'px';

  const metadataJsx: JSX.Element | null = getMetadataJsx();

  // console.log('render GridCell');
  // console.log('displayMetadata', props.displayMetadata);
  // console.log('imgHeightAttribute', imgHeightAttribute);
  // console.log('divHeightAttribute', divHeightAttribute);
  // console.log('widthAttribute', widthAttribute);

  // console.log('gridCell rerender:');

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        width: widthAttribute,
        height: divHeightAttribute,
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
            width: widthAttribute,
            height: imgHeightAttribute,
            backgroundColor: 'rgba(0, 0, 255, 0.3)',
            zIndex: 5,
          }}
        />
      )}

      {metadataJsx}

      <img
        src={getCacheBustedPhotoUrl(photoUrl, props.mediaItem!)}
        width={widthAttribute}
        height={imgHeightAttribute}
        loading='lazy'
        style={{ display: 'block' }}
      />
    </div>
  );
};

function mapStateToProps(state: any, ownProps: GridCellPropsFromParent) {
  return {
    displayMetadata: getDisplayMetadata(state),
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
    prevProps.mediaItem.uniqueId === nextProps.mediaItem.uniqueId &&
    prevProps.mediaItem.exif.fileModifiedAt === nextProps.mediaItem.exif.fileModifiedAt &&
    prevProps.mediaItem.exif.exifModifiedAt === nextProps.mediaItem.exif.exifModifiedAt &&
    prevProps.displayMetadata === nextProps.displayMetadata
  );
});

export default connect(mapStateToProps, mapDispatchToProps)(MemoizedGridCell);
