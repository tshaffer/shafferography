import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import '../styles/TedTagger.css';
import { isNil } from 'lodash';
import { Box, Tooltip } from '@mui/material';
import { TedTaggerDispatch } from '../models';
import { getLoupeViewMediaItemId, getMediaItemById, getFullScreenMode } from '../selectors';
import { MediaItem } from '@shared/types/mediaItem';
import { getCacheBustedPhotoUrl, getPhotoUrl } from '../utilities';

export interface LoupeViewProps {
  mediaItem: MediaItem | null;
  fullScreenMode: boolean;
}

const LoupeView = (props: LoupeViewProps) => {

  if (isNil(props.mediaItem)) {
    return null;
  }

  const src = getPhotoUrl(props.mediaItem);

  return (
    <Box
      id="loupeViewImage"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "calc(100vh - 112px)",
        backgroundColor: "black"
      }}
    >
      <Tooltip
        title={props.mediaItem.fileName}
        placement="top"
        slotProps={{
          popper: {
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -32],
                },
              },
            ],
          },
        }}
      >
        <img
          src={getCacheBustedPhotoUrl(src, props.mediaItem!)}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      </Tooltip>
    </Box>
  );
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

export default connect(mapStateToProps, mapDispatchToProps)(LoupeView);
