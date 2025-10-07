// LoupeView.tsx
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import '../styles/TedTagger.css';
import { isNil } from 'lodash';
import { Box, Tooltip } from '@mui/material';
import { TedTaggerDispatch } from '../models';
import { getLoupeViewMediaItemId, getMediaItemById, getFullScreenMode } from '../selectors';
import { MediaItem } from '../types';
import { getPhotoUrl } from '../utilities';

export interface LoupeViewProps {
  mediaItem: MediaItem | null;
  fullScreenMode: boolean;

  /** (NEW) If provided, this overrides the default image source */
  imgSrcOverride?: string;
  /** (NEW) Optional header UI to render above the image (e.g., variant switcher) */
  header?: React.ReactNode;
}

const LoupeView = (props: LoupeViewProps) => {
  if (isNil(props.mediaItem)) return null;

  const defaultSrc = getPhotoUrl(props.mediaItem);
  const src = props.imgSrcOverride ?? defaultSrc;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: 'calc(100vh - 112px)', bgcolor: 'black' }}>
      {props.header ? (
        <Box sx={{ px: 2, py: 1, bgcolor: 'black' }}>
          {props.header}
        </Box>
      ) : null}

      <Box
        id="loupeViewImage"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Tooltip
          title={props.mediaItem.fileName}
          placement="top"
          slotProps={{
            popper: { modifiers: [{ name: "offset", options: { offset: [0, -32] } }] },
          }}
        >
          <img
            src={src}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          />
        </Tooltip>
      </Box>
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

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LoupeView);
