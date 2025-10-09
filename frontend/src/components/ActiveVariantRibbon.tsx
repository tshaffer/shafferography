// frontend/src/components/ActiveVariantRibbon.tsx
import { Box } from "@mui/material";
import { connect } from "react-redux";
import { MediaItem, ViewVariant } from "../types";
import { bindActionCreators } from "redux";
import { TedTaggerDispatch, setViewVariant } from "../models";
import { getViewVariant } from "../selectors/mediaView";
import { getMediaItemById } from "../selectors";

export interface ActiveVariantRibbonPropsFromParent {
  mediaId: string;
};

export interface ActiveVariantRibbonProps extends ActiveVariantRibbonPropsFromParent {
  mediaItem: MediaItem | null;
  variant?: ViewVariant | null;
};

const ActiveVariantRibbon = (props: ActiveVariantRibbonProps) => {
  
  if (!props.variant) return null;

  if ((props.variant as any).kind && (props.variant as any).kind === "preferred") return null;

  const label =
    (props.variant as any) === "original"
      ? "ORIGINAL"
      : props.mediaItem?.derivatives.find(d => d.derivativeId === (props.variant as any).id)?.label ?? "DERIVATIVE";

  return (
    <Box
      sx={{
        position: "absolute",
        left: -8,
        top: 10,
        bgcolor: "primary.main",
        color: "primary.contrastText",
        px: 1,
        py: 0.25,
        fontSize: 10,
        transform: "rotate(-10deg)",
        boxShadow: 2,
        borderRadius: 0.5,
      }}
    >
      {label}
    </Box>
  );
};

function mapStateToProps(state: any, ownProps: any) {
  return {
    variant: getViewVariant(state, ownProps.mediaId),
    mediaItem: getMediaItemById(state, ownProps.mediaId),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onSetViewVariant: setViewVariant,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveVariantRibbon);
