// LoupeVariantHeaderSwitch.tsx
import * as React from 'react';
import { Stack, ToggleButton, ToggleButtonGroup, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { ViewVariant } from '../types';

export type DerivativeInfo = {
  id: string;
  label: string;
  width: number;
  height: number;
  mimeType: string;
};

export type MediaManifest = {
  mediaItemId: string;
  original: { width: number; height: number; mimeType: string };
  derivatives: DerivativeInfo[];
  preferredDerivativeId: string | null;
};

export function LoupeVariantHeaderSwitch(props: {
  manifest: MediaManifest | null;
  value: ViewVariant;
  onChange: (next: ViewVariant) => void;
}) {
  const { manifest, value, onChange } = props;

  const toggleVal =
    value === 'original' ? 'original'
    : value === 'preferred' ? 'preferred'
    : 'preferred';

  const selectedDerivativeId = typeof value === 'object' && value.kind === 'derivative'
    ? value.id
    : '';

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <ToggleButtonGroup
        value={toggleVal}
        exclusive
        onChange={(_, val) => {
          if (val === 'original') onChange('original');
          else if (val === 'preferred') onChange('preferred');
        }}
        size="small"
      >
        <ToggleButton value="original">Original</ToggleButton>
        <ToggleButton value="preferred" disabled={!manifest}>Preferred</ToggleButton>
      </ToggleButtonGroup>

      <FormControl size="small" sx={{ minWidth: 240 }}>
        <InputLabel id="loupe-deriv-label">Derivative</InputLabel>
        <Select
          labelId="loupe-deriv-label"
          label="Derivative"
          value={selectedDerivativeId}
          onChange={(e) => onChange({ kind: 'derivative', id: e.target.value as string })}
          displayEmpty
          disabled={!manifest || manifest.derivatives.length === 0}
        >
          <MenuItem value=""><em>— choose —</em></MenuItem>
          {manifest?.derivatives.map(d => (
            <MenuItem key={d.id} value={d.id}>
              {d.label} ({d.width}×{d.height})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {!manifest ? (
        <Typography variant="body2" color="text.secondary">Loading…</Typography>
      ) : null}
    </Stack>
  );
}
