// frontend/src/components/VariantHeaderSwitch.tsx
import React from "react";
import { ToggleButton, ToggleButtonGroup, FormControl, InputLabel, Select, MenuItem, Stack } from "@mui/material";
import { connect, useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { setViewVariant, TedTaggerDispatch } from "../models";
import { getMediaItemById } from "../selectors";
import { getViewVariant } from "../selectors/mediaView";
import { MediaItem, ViewVariant } from "../types";

export interface VariantHeaderSwitchPropsFromParent {
  mediaId: string;
};

export interface VariantHeaderSwitchProps extends VariantHeaderSwitchPropsFromParent {
  mediaItem: MediaItem | null;
  variant?: ViewVariant | null;
  onSetViewVariant: (mediaId: string, variant: ViewVariant) => void;
};

const VariantHeaderSwitch = (props: VariantHeaderSwitchProps) => {

  const derivativeId = (props.variant) && ((props.variant as any).kind === "derivative" ? (props.variant as any).id : "");

  const onToggle = (_: any, val: "original" | "preferred" | null) => {
    if (!val) return;
    props.onSetViewVariant(props.mediaId, { kind: val } as any);
  };

  const onChooseDerivative = (e: any) => {
    const id = e.target.value as string;
    if (id) props.onSetViewVariant(props.mediaId, { kind: "derivative", id });
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <ToggleButtonGroup
        value={(props.variant) && (props.variant as any).kind === "original" ? "original" : "preferred"}
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
          {props.mediaItem?.derivatives.map(d => (
            <MenuItem key={d.derivativeId} value={d.derivativeId}>
              {d.label} ({d.width}×{d.height})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};
function mapStateToProps(state: any, ownProps: any) {
  return {
    mediaItem: getMediaItemById(state, ownProps.mediaId),
    variant: getViewVariant(state, ownProps.mediaId),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onSetViewVariant: setViewVariant,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(VariantHeaderSwitch);
