import React, { useEffect, useRef, useState } from "react";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { Box, Grid, Card, CardMedia } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GridCell from "./GridCell";
import { selectPhoto, deselectAllPhotos, selectAllPhotos } from "../controllers";
import { TedTaggerDispatch } from "../models";
import { getAppInitialized, getMediaItems } from "../selectors";
import { MediaItem } from "../types";

export interface PhotoGridProps {
  allMediaItems: MediaItem[];
  onClickPhoto: (id: string, commandKey: boolean, shiftKey: boolean) => void;
  onDeselectAllMediaItems: () => void;
  onSelectAllPhotos: () => void;
}

const PhotoGrid = (props: PhotoGridProps) => {

  console.log('NewPhotoGrid: props', props);

  const { allMediaItems } = props;

  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

  /** Handles keyboard shortcuts (Ctrl + A for select all, Esc for deselect all) */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'a' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        props.onSelectAllPhotos();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        props.onDeselectAllMediaItems();
        setLastSelectedIndex(null);
      }
    };

    if (document.getElementById("global-keydown-listener") === null) {
      document.addEventListener('keydown', handleKeyDown);
      const marker = document.createElement("div");
      marker.id = "global-keydown-listener";
      document.body.appendChild(marker);
    }

    return () => {
      if (document.getElementById("global-keydown-listener") !== null) {
        document.removeEventListener('keydown', handleKeyDown);
        document.getElementById("global-keydown-listener")?.remove();
      }
    };
  }, []);


  if (allMediaItems.length === 0) {
    return null;
  }

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {allMediaItems.map((mediaItem, index: number) => {
        return (
          <GridCell key={mediaItem.baseUrl} mediaItem={mediaItem} />
        );
      })}
    </Grid>
  );
};

function mapStateToProps(state: any, ownProps: any) {
  return {
    appInitialized: getAppInitialized(state),
    allMediaItems: getMediaItems(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators(
    {
      onClickPhoto: selectPhoto,
      onDeselectAllMediaItems: deselectAllPhotos,
      onSelectAllPhotos: selectAllPhotos,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoGrid);
