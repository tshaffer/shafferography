// frontend/src/components/ActiveVariantRibbon.tsx
import React from "react";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { selectCurrentVariant, selectManifest } from "../store/selectors";

export const ActiveVariantRibbon: React.FC<{ mediaId: string }> = ({ mediaId }) => {
  const v = useSelector((s: RootState) => selectCurrentVariant(s, mediaId));
  const manifest = useSelector((s: RootState) => selectManifest(s, mediaId));
  if (!v || v.kind === "preferred") return null;

  const label =
    v.kind === "original"
      ? "ORIGINAL"
      : manifest?.derivatives.find(d => d.id === v.derivativeId)?.label ?? "DERIVATIVE";

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
