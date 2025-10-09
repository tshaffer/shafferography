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
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { MediaManifest, ViewVariant } from '../types';

export function LoupeVariantHeaderSwitch(props: {
  manifest: MediaManifest | null;
  viewVariant: ViewVariant;
  onChange: (next: ViewVariant) => void;
}) {
  const { manifest, viewVariant, onChange } = props;

  console.log(props.manifest);
  console.log(props.manifest?.derivatives);

  const toggleVal =
    viewVariant === 'original' ? 'original'
      : viewVariant === 'preferred' ? 'preferred'
        : 'preferred';

  const selectedDerivativeId =
    typeof viewVariant === 'object' && viewVariant.kind === 'derivative' ? viewVariant.id : '';

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
          t.palette.mode === 'dark' ? 'inset 0 1px 0 rgba(255,255,255,0.06)' : '0 1px 2px rgba(0,0,0,0.06)',
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
          onChange={(_, val) => {
            if (!val) return;
            if (val === 'original') onChange('original');
            else if (val === 'preferred') onChange('preferred');
          }}
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
          <ToggleButton
            value="original"
            aria-label="Original"
          >
            Original
          </ToggleButton>
          <ToggleButton
            value="preferred"
            aria-label="Preferred derivative"
            disabled={!manifest}
          >
            Preferred
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
          <InputLabel id="loupe-deriv-label">Derivative</InputLabel>
          <Select
            labelId="loupe-deriv-label"
            label="Derivative"
            value={selectedDerivativeId}
            onChange={(e) =>
              onChange({ kind: 'derivative', id: e.target.value as string })
            }
            displayEmpty
            disabled={!manifest || manifest.derivatives.length === 0}
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
            {manifest?.derivatives.map((d, index) => (
              <MenuItem key={d.derivativeId} value={d.derivativeId}>
                {d.label} ({d.width}×{d.height})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {!manifest ? (
          <Typography variant="body2" color="text.secondary">
            Loading…
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
}
