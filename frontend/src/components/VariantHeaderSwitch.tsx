// frontend/src/components/VariantHeaderSwitch.tsx
import React from "react";
import { ToggleButton, ToggleButtonGroup, FormControl, InputLabel, Select, MenuItem, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { selectManifest, selectCurrentVariant } from "../store/selectors";
import { setViewVariant } from "../store/mediaViewSlice";

export const VariantHeaderSwitch: React.FC<{ mediaId: string }> = ({ mediaId }) => {
  const dispatch = useDispatch();
  const manifest = useSelector((s: RootState) => selectManifest(s, mediaId));
  const variant = useSelector((s: RootState) => selectCurrentVariant(s, mediaId));
  const derivativeId = variant?.kind === "derivative" ? variant.derivativeId : "";

  const onToggle = (_: any, val: "original" | "preferred" | null) => {
    if (!val) return;
    dispatch(setViewVariant({ mediaId, variant: { kind: val } as any }));
  };

  const onChooseDerivative = (e: any) => {
    const id = e.target.value as string;
    if (id) dispatch(setViewVariant({ mediaId, variant: { kind: "derivative", derivativeId: id } }));
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <ToggleButtonGroup
        value={variant?.kind === "original" ? "original" : "preferred"}
        exclusive
        onChange={onToggle}
        size="small"
      >
        <ToggleButton value="original">Original</ToggleButton>
        <ToggleButton value="preferred">Preferred</ToggleButton>
      </ToggleButtonGroup>

      <FormControl size="small" sx={{ minWidth: 240 }}>
        <InputLabel id="deriv-label">Derivative</InputLabel>
        <Select
          labelId="deriv-label"
          label="Derivative"
          value={derivativeId}
          onChange={onChooseDerivative}
          displayEmpty
        >
          <MenuItem value=""><em>— choose —</em></MenuItem>
          {manifest?.derivatives.map(d => (
            <MenuItem key={d.id} value={d.id}>
              {d.label} ({d.width}×{d.height})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};
