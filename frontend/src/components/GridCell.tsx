import * as React from 'react';
import { useSelector } from 'react-redux';
import { MediaItem } from '../types';
import { getPhotoUrl } from '../utilities';
import { borderSizeStr } from '../constants';
import { isMediaItemSelected } from '../selectors';

import { Tooltip, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

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

export interface GridCellProps {
  mediaItemIndex: number;
  mediaItem: MediaItem;
  rowHeight: number;
  cellWidth: number;
  onClickPhoto: (id: string, commandKey: boolean, shiftKey: boolean) => void;
  onSetLoupeViewMediaItemId: (id: string) => void;
  onSetPhotoLayoutRedux: () => void;
  displayMetadata: boolean; // ✅ Ensure this is passed correctly
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
  top: '8px',
  left: '8px',
  fontSize: '20px',
  color: mutedWhite,
};

const GridCell = React.memo((props: GridCellProps) => {
  const mediaItem: MediaItem = props.mediaItem;
  const photoUrl = getPhotoUrl(mediaItem);

  // ✅ Fetch selection state inside GridCell instead of passing it as a prop
  const isSelected = useSelector((state: any) => isMediaItemSelected(state, mediaItem));

  const handleDoubleClick = () => {
    props.onSetLoupeViewMediaItemId(props.mediaItem.uniqueId);
    props.onSetPhotoLayoutRedux();
  };

  const handleClickPhoto = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    props.onClickPhoto(props.mediaItem.uniqueId, e.metaKey, e.shiftKey);
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

  const getMetadataJsx = (): JSX.Element | null => {

    if (!props.displayMetadata) {
      return null;
    }

    const creationDate: Dayjs = dayjs(mediaItem.creationTime!);
    const formattedCreationDate: string = creationDate.format('MM/DD/YYYY hh:mm A');
    // const keywords: string = props.keywordLabels.join(', ');

    return (
      <Tooltip
        title={props.mediaItem.fileName}
        placement='top'
        slotProps={{
          popper: {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, -32],
                },
              },
            ],
          },
        }}
      >
        <div style={{
          backgroundColor: 'silver',
          minHeight: '60px',
        }}
        >
          <Typography variant='body2' color='black' fontSize='12px'>
            {mediaItem.fileName}
            <br />
            {formattedCreationDate}
            {/* <br /> */}
            {/* {keywords} */}
          </Typography>
        </div >
      </Tooltip>
    );

  };

  const widthAttribute = `${props.cellWidth}px`;

  // ✅ Ensure image height is ONLY based on image area, NOT full row height
  const imageHeight = props.rowHeight - (props.displayMetadata ? 60 : 0); // Subtract metadata height
  const divHeightAttribute = `${props.rowHeight}px`; // Full row height, including metadata

  const metadataJsx: JSX.Element | null = getMetadataJsx();

  let borderAttr = `${borderSizeStr} ${isSelected ? 'solid blue' : 'solid white'}`;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        width: widthAttribute,
        height: divHeightAttribute, // ✅ Full row height (including metadata)
        border: borderAttr,
      }}
      onClick={handleClickPhoto}
      onDoubleClick={handleDoubleClick}
    >
      {metadataJsx}
      <img
        src={photoUrl}
        width={widthAttribute}
        height={`${imageHeight}px`} // ✅ Image should stay within its original height
        loading="lazy"
        style={{
          objectFit: 'contain', // ✅ Maintain correct aspect ratio
          display: 'block', // ✅ Prevents unwanted spacing
        }}
      />
      {/* Icon overlay */}
      {renderReviewLevelIcon()}
    </div>
  );
});

export default GridCell;
