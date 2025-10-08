// frontend/src/components/DerivativesBadge.tsx
import React from "react";
import {
  Box,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Radio,
} from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
import StarIcon from "@mui/icons-material/Star";
import PhotoIcon from "@mui/icons-material/Photo";
import RecommendIcon from "@mui/icons-material/Recommend"; // "Preferred" glyph
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { TedTaggerDispatch } from "../models";
import { getFullScreenMediaItemId, getMediaItemById } from "../selectors";
import { MediaItem, ViewVariant } from "../types";
import { setViewVariant } from "../models/mediaView";
import { getViewVariant } from "../selectors/mediaView";

export interface DerivativesBadgePropsFromParent {
  mediaId: string;
};

export interface DerivativesBadgeProps extends DerivativesBadgePropsFromParent {
  mediaItem: MediaItem | null;
  variant?: ViewVariant | null;
  onSetViewVariant: (mediaId: string, variant: ViewVariant) => void;
};

const DerivativesBadge = (props: DerivativesBadgeProps) => {
  const { mediaId } = props;
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);

  const count = props.mediaItem?.derivatives.length ?? 0;
  if (!count) return null;

  const preferredId = props.mediaItem?.preferredDerivativeId ?? null;
  const currentKey =
    props.variant === "original"
      ? "original"
      : props.variant === "preferred"
        ? "preferred"
        : props.variant?.kind === "derivative"
          ? props.variant.id
          : "preferred";

  const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
  const closeMenu = () => setAnchor(null);

  const chooseOriginal = () => {
    props.onSetViewVariant( mediaId, "original" );
    closeMenu();
  };
  const choosePreferred = () => {
    props.onSetViewVariant( mediaId, "preferred" );
    closeMenu();
  };

  const chooseDerivative = (id: string) => {
    // props.onSetViewVariant({ mediaId, variant: { kind: "derivative", derivativeId: id } }));
    closeMenu();
  };

  return (
    <>
      <Tooltip title="This item has derivatives">
        <Chip
          size="small"
          icon={<LayersIcon fontSize="small" />}
          label={count}
          onClick={openMenu}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "background.paper",
            boxShadow: 2,
          }}
        />
      </Tooltip>

      <Menu anchorEl={anchor} open={!!anchor} onClose={closeMenu}>
        <MenuItem onClick={chooseOriginal} dense>
          <ListItemIcon>
            <PhotoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Original" />
          <Radio edge="end" checked={currentKey === "original"} />
        </MenuItem>

        <MenuItem onClick={choosePreferred} dense disabled={!preferredId}>
          <ListItemIcon>
            <RecommendIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Preferred"
            secondary={preferredId ? undefined : "No preferred set"}
          />
          <Radio edge="end" checked={currentKey === "preferred"} />
        </MenuItem>

        <Divider />

        {props.mediaItem?.derivatives.map((d) => {
          const isPreferred = d.derivativeId === preferredId;
          const isCurrent = currentKey === d.derivativeId;
          return (
            <MenuItem key={d.derivativeId} onClick={() => chooseDerivative(d.derivativeId)} dense>
              <ListItemIcon>
                {isPreferred ? <StarIcon fontSize="small" /> : <LayersIcon fontSize="small" />}
              </ListItemIcon>
              <ListItemText
                primary={`${d.label}`}
                secondary={`${d.width}×${d.height} • ${d.mimeType}`}
              />
              <Radio edge="end" checked={isCurrent} />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

function mapStateToProps(state: any, ownProps: any) {
  return {
    mediaItem: getMediaItemById(state, getFullScreenMediaItemId(state)),
    variant: getViewVariant(state, ownProps.mediaId),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onSetViewVariant: setViewVariant,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DerivativesBadge);
