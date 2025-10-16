import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Menu, MenuItem } from "@mui/material";
import { deselectMediaItem, TedTaggerDispatch } from '../models';
import { getSurveyModeZoomFactor, getMediaItemZoomFactor, getFocusedSurveyViewMediaItemId } from '../selectors';
import { MediaItem } from '../types';
import { getCacheBustedPhotoUrl, getPhotoUrl } from '../utilities';
import { borderSizeStr } from '../constants';

export interface SurveyViewImagePropsFromParent {
  mediaItem: MediaItem;
}

export interface SurveyViewImageProps extends SurveyViewImagePropsFromParent {
  focusedSurveyViewMediaItemId: string;
  surveyModeZoomFactor: number;
  mediaItemZoomFactor: number;
  onDeselectMediaItem: (uniqueId: string) => void;
}

function SurveyViewImage(props: SurveyViewImageProps) {
  const photoUrl = getPhotoUrl(props.mediaItem);
  const elementId: string = 'surveyImage' + props.mediaItem.uniqueId;
  const imageElement = document.getElementById(elementId) as HTMLImageElement | null;
  const zoomFactor = props.surveyModeZoomFactor * props.mediaItemZoomFactor;
  if (imageElement) {
    imageElement.style.transform = `translate(-50%, -50%) scale(${zoomFactor})`;
  }

  const isFocused: boolean = props.focusedSurveyViewMediaItemId === props.mediaItem.uniqueId;

  // State to track the position of the context menu
  const [menuPosition, setMenuPosition] = React.useState<{ top: number; left: number } | null>(null);

  // Handler for right-click event: set the menu position based on the pointer's coordinates
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuPosition({ top: event.clientY, left: event.clientX });
  };

  const handleClose = () => {
    setMenuPosition(null);
  };

  const handleMenuItemClick = (action: string) => {
    console.log(`Context menu action selected: ${action}`);
    switch (action) {
      case "deselectImage":
        props.onDeselectMediaItem(props.mediaItem.uniqueId);
        break;
      default:
        break;
    }
    handleClose();
  };

  return (
    <>
      <img
        id={elementId}
        src={getCacheBustedPhotoUrl(photoUrl, props.mediaItem)}
        className='surveyImageStyle'
        style={{
          border: isFocused ? '6px solid #1976d2' : '2px solid #ccc',
          boxShadow: isFocused ? '0 0 10px rgba(25, 118, 210, 0.5)' : 'none',
        }}
        loading="lazy"
        onContextMenu={handleContextMenu}
      />
      <Menu
        anchorReference="anchorPosition"
        anchorPosition={menuPosition ? { top: menuPosition.top, left: menuPosition.left } : undefined}
        open={Boolean(menuPosition)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleMenuItemClick("deselectImage")}>Deselect Image</MenuItem>
      </Menu>
    </>
  );
}

function mapStateToProps(state: any, ownProps: any) {
  return {
    mediaItem: ownProps.mediaItem,
    focusedSurveyViewMediaItemId: getFocusedSurveyViewMediaItemId(state),
    surveyModeZoomFactor: getSurveyModeZoomFactor(state),
    mediaItemZoomFactor: getMediaItemZoomFactor(state, ownProps.mediaItem.uniqueId),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onDeselectMediaItem: deselectMediaItem,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyViewImage);
