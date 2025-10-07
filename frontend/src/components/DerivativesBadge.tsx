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
import { useDispatch, useSelector } from "react-redux";
import { fetchManifest, setViewVariant } from "../store/mediaViewSlice";
import { selectManifest, selectCurrentVariant } from "../store/selectors";

type Props = {
  mediaId: string;
};

export const DerivativesBadge: React.FC<Props> = ({ mediaId }) => {
  const dispatch = useDispatch();
  const manifest = useSelector((s: RootState) => selectManifest(s, mediaId));
  const variant = useSelector((s: RootState) => selectCurrentVariant(s, mediaId));
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!manifest) dispatch(fetchManifest({ mediaId }));
  }, [dispatch, manifest, mediaId]);

  const count = manifest?.derivatives.length ?? 0;
  if (!count) return null;

  const preferredId = manifest?.preferredDerivativeId ?? null;
  const currentKey =
    variant?.kind === "original"
      ? "original"
      : variant?.kind === "preferred"
        ? "preferred"
        : variant?.kind === "derivative"
          ? variant.derivativeId
          : "preferred";

  const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
  const closeMenu = () => setAnchor(null);

  const chooseOriginal = () => {
    dispatch(setViewVariant({ mediaId, variant: { kind: "original" } }));
    closeMenu();
  };
  const choosePreferred = () => {
    dispatch(setViewVariant({ mediaId, variant: { kind: "preferred" } }));
    closeMenu();
  };
  const chooseDerivative = (id: string) => {
    dispatch(setViewVariant({ mediaId, variant: { kind: "derivative", derivativeId: id } }));
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

        {manifest?.derivatives.map((d) => {
          const isPreferred = d.id === preferredId;
          const isCurrent = currentKey === d.id;
          return (
            <MenuItem key={d.id} onClick={() => chooseDerivative(d.id)} dense>
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
