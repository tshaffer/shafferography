import React from "react";
import { connect } from 'react-redux';
import { Grid, Card, CardMedia } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { bindActionCreators } from "redux";
import { selectPhoto } from "../controllers";
import { TedTaggerDispatch, setLoupeViewMediaItemIdRedux, setPhotoLayoutRedux } from "../models";
import { getNumGridColumns, isMediaItemSelected } from "../selectors";
import { MediaItem, PhotoLayout } from "../types";
import { getPhotoUrl } from "../utilities";

export interface NewGridCellPropsFromParent {
  mediaItem: MediaItem;
}

export interface NewGridCellProps extends NewGridCellPropsFromParent {
  numGridColumns: number;
  isSelected: boolean;
  onClickPhoto: (id: string, commandKey: boolean, shiftKey: boolean) => void;
  onSetLoupeViewMediaItemId: (id: string) => void;
  onSetPhotoLayoutRedux: (photoLayout: PhotoLayout) => void;
}

const NewGridCell = (props: NewGridCellProps) => {

  const [clickTimeout, setClickTimeout] = React.useState<NodeJS.Timeout | null>(null);

  const getColumnsSpanned = (): number => {
    const numColumnsSpanned = 12/ props.numGridColumns;
    return numColumnsSpanned;
  }

  const photoUrl: string = getPhotoUrl(props.mediaItem);

  const handleDoubleClick = () => {
    props.onSetLoupeViewMediaItemId(props.mediaItem.uniqueId);
    props.onSetPhotoLayoutRedux(PhotoLayout.Loupe);
  };

  const handleClickPhoto = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    props.onClickPhoto(props.mediaItem.uniqueId, e.metaKey || e.ctrlKey, e.shiftKey);
  };

  const handleClicks = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    console.log('handleClicks');
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
    <Grid
      item
      key={photoUrl}
      lg={getColumnsSpanned()}
      onClick={handleClicks}
    >
      <Card
        sx={{
          position: "relative",
          border: props.isSelected ? "2px solid blue" : "none",
          cursor: "pointer",
          '&:hover': {
            opacity: 0.8,
          }
        }}
      >
        <CardMedia component="img" image={photoUrl} />
        {props.isSelected && (
          <CheckCircleIcon
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: "50%",
            }}
          />
        )}
      </Card>
    </Grid>
  );
};

function mapStateToProps(state: any, ownProps: any) {
  return {
    numGridColumns: getNumGridColumns(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(NewGridCell);
