import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import '../../styles/TedTagger.css';
import { isNil } from 'lodash';
import { Box, Tooltip } from '@mui/material';
import { TedTaggerDispatch } from '../models';
import { getLoupeViewMediaItemId, getMediaItemById, getFullScreenMode } from '../selectors';
import { MediaItem } from '../types';
import { getPhotoUrl } from '../utilities';

export interface NewLoupeViewProps {
  mediaItem: MediaItem | null;
  fullScreenMode: boolean;
}

const NewLoupeView = (props: NewLoupeViewProps) => {

  const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

  React.useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isNil(props.mediaItem)) {
    return null;
  }

  const src = getPhotoUrl(props.mediaItem);

  return (
    <Box id='loupeViewImage' sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "calc(100vh - 112px)", backgroundColor: "white" }}>
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
        <img
          src={src}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      </Tooltip>
    </Box>
  )
};

function mapStateToProps(state: any) {
  const loupeViewMediaItemId = getLoupeViewMediaItemId(state);
  return {
    mediaItem: getMediaItemById(state, loupeViewMediaItemId),
    fullScreenMode: getFullScreenMode(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NewLoupeView);
