// LoupeVariantHeaderSwitch.tsx
import {
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
  Tooltip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import * as React from 'react';
import { MediaManifest, ViewVariant } from '../types';

export function LoupeVariantHeaderSwitch(props: {
  manifest: MediaManifest | null;
  viewVariant: ViewVariant;
  onChange: (next: ViewVariant) => void;
  onRequestSelectFirstDerivative?: () => void; // ask controller to set the first derivative
  onSetAsPreferred?: () => void;               // explicit persist action
}) {
  const { manifest, viewVariant, onChange, onRequestSelectFirstDerivative, onSetAsPreferred } = props;

  const hasDerivatives = !!manifest && manifest.derivatives.length > 0;

  // Map the union to a 3-state toggle value: original | preferred | derivative
  const toggleVal: 'original' | 'preferred' | 'derivative' =
    viewVariant === 'original'
      ? 'original'
      : typeof viewVariant === 'object' && viewVariant.kind === 'derivative'
        ? 'derivative'
        : 'preferred';

  const selectedDerivativeId =
    typeof viewVariant === 'object' && viewVariant.kind === 'derivative' ? viewVariant.id : '';

  const handleToggleChange = (_: any, val: 'original' | 'preferred' | 'derivative' | null) => {
    if (!val) return;

    if (val === 'original') {
      onChange('original');
    } else if (val === 'preferred') {
      onChange('preferred');
    } else if (val === 'derivative') {
      // If Derivative is clicked with none selected yet, choose first derivative by default
      if (!selectedDerivativeId && hasDerivatives) {
        if (onRequestSelectFirstDerivative) onRequestSelectFirstDerivative();
      } else {
        // Keep current derivative selection if one is already chosen
        if (selectedDerivativeId) onChange({ kind: 'derivative', id: selectedDerivativeId });
      }
    }
  };

  return (
    <Box
      sx={{
        px: 1.5,
        py: 1,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: (t) => alpha(t.palette.background.paper, 0.9),
        boxShadow: (t) =>
          t.palette.mode === 'dark'
            ? 'inset 0 1px 0 rgba(255,255,255,0.06)'
            : '0 1px 2px rgba(0,0,0,0.06)',
        color: 'text.primary',
        display: 'inline-block',
        maxWidth: '100%',
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ flexWrap: 'wrap', rowGap: 1 }}
      >
        <ToggleButtonGroup
          value={toggleVal}
          exclusive
          onChange={handleToggleChange}
          size="small"
          color="primary"
          sx={{
            '& .MuiToggleButton-root': {
              color: 'text.primary',
              borderColor: 'divider',
              bgcolor: (t) => alpha(t.palette.background.default, 0.2),
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                borderColor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' },
              },
            },
          }}
          aria-label="View variant"
        >
          <ToggleButton value="original" aria-label="Original">
            Original
          </ToggleButton>
          <ToggleButton value="preferred" aria-label="Preferred derivative" disabled={!manifest}>
            Preferred
          </ToggleButton>
          <ToggleButton
            value="derivative"
            aria-label="Specific derivative"
            disabled={!hasDerivatives}
          >
            Derivative
          </ToggleButton>
        </ToggleButtonGroup>

        <FormControl
          size="small"
          sx={{
            minWidth: 260,
            '& .MuiInputLabel-root': { color: 'text.secondary' },
            '& .MuiInputBase-root': {
              color: 'text.primary',
              bgcolor: (t) => alpha(t.palette.background.default, 0.2),
            },
          }}
        >
          {/* Force the label to float so it never overlaps the displayed value */}
          <InputLabel id="loupe-deriv-label" shrink>
            Derivative
          </InputLabel>

          <Select
            labelId="loupe-deriv-label"
            label="Derivative"
            value={selectedDerivativeId}
            onChange={(e) => {
              const id = e.target.value as string;
              if (!id) onChange('preferred'); // back to Preferred when clearing
              else onChange({ kind: 'derivative', id });
            }}
            // Keep the field populated even when value === ''
            displayEmpty
            // Render a proper placeholder when empty
            renderValue={(val) => {
              if (!val) return <em>— choose —</em>;
              const d = manifest?.derivatives.find(x => x.derivativeId === val);
              return d ? `${d.label} (${d.width}×${d.height})` : '';
            }}
            disabled={!hasDerivatives}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  border: '1px solid',
                  borderColor: 'divider',
                },
              },
            }}
          >
            <MenuItem value="">
              <em>— choose —</em>
            </MenuItem>
            {manifest?.derivatives.map((d) => (
              <MenuItem key={d.derivativeId} value={d.derivativeId}>
                {d.label} ({d.width}×{d.height})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Tooltip
          title="Persist the currently visible image (Original or the selected Derivative) as the preferred image for this photo."
          arrow
        >
          <span>
            <Button
              variant="outlined"
              size="small"
              disabled={!manifest}
              onClick={() => onSetAsPreferred && onSetAsPreferred()}
            >
              Set as Preferred
            </Button>
          </span>
        </Tooltip>

        {!manifest ? (
          <Typography variant="body2" color="text.secondary">
            Loading…
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
}
