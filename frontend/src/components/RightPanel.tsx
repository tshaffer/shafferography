import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Box, Typography, Card, CardContent, Divider, IconButton,
  styled, Drawer, TextField
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { MediaItem } from '@shared/types/mediaItem';
import { TedTaggerDispatch } from '../models';
import { getMediaItemNotes } from '../selectors';
import { drawerWidth } from '../constants';
import { setMediaItemNotes } from '../controllers';
import { isString } from 'lodash';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export interface RightPanelPropsFromParent {
  mediaItem: MediaItem;
  open: boolean;
  onClose: () => void;
}

export interface RightPanelDerivedStateProps {
  notes: string | undefined | null;
}

export interface RightPanelDerivedActionCreatorProps {
  onSetMediaItemNotes: (uniqueId: string, notes: string) => void;
}

export interface RightPanelAllProps extends RightPanelDerivedStateProps, RightPanelDerivedActionCreatorProps, RightPanelPropsFromParent { }

// ---------- helpers ----------
type TZOpts = { timeZone?: string };

function fmtWeekdayMonthDayYearAbbrev(iso?: string | null, opts?: TZOpts) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;

  const weekday = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    ...(opts?.timeZone ? { timeZone: opts.timeZone } : {})
  }).format(d);

  const monthDayYear = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...(opts?.timeZone ? { timeZone: opts.timeZone } : {})
  }).format(d);

  // "<Wed>, <Oct> 21, 2025"
  return `${weekday}, ${monthDayYear}`;
}

function fmtTime12h(iso?: string | null, opts?: TZOpts) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    ...(opts?.timeZone ? { timeZone: opts.timeZone } : {})
  }).format(d);
}

function nonEmpty(parts: Array<string | number | null | undefined>) {
  return parts.filter(p => p !== null && p !== undefined && String(p).trim() !== '');
}

function formatAperture(fNumber?: number) {
  if (fNumber === null || fNumber === undefined) return null;
  const s = Number.isInteger(fNumber) ? `${fNumber}` : fNumber.toFixed(1);
  return `f/${s}`;
}

function formatShutter(exposureTime?: string) {
  if (!exposureTime) return null;
  return exposureTime; // e.g., "1/120"
}

function formatFocal(focalLengthMm?: number | string) {
  if (focalLengthMm === null || focalLengthMm === undefined) return null;
  if (isString(focalLengthMm)) {
    return `${focalLengthMm} mm`;
  }
  const s = Number.isInteger(focalLengthMm) ? `${focalLengthMm}` : focalLengthMm.toFixed(1);
  return `${s} mm`;
}

function formatLocation(city?: string, state?: string, country?: string) {
  const stateFiltered = (state && state.trim().toLowerCase() === 'california') ? '' : state;
  const countryFiltered = (country && country.trim().toLowerCase() === 'united states') ? '' : country;
  return nonEmpty([city, stateFiltered, countryFiltered]).join(' ');
}

const RightPanel: React.FC<RightPanelAllProps> = (props: RightPanelAllProps) => {
  const { open, onClose, mediaItem } = props;

  const [localNotes, setLocalNotes] = React.useState(props.notes || "");
  React.useEffect(() => {
    setLocalNotes(props.notes || "");
  }, [props.notes]);

  if (!mediaItem) return null;

  // If you capture real timezones (from GPS), pass { timeZone } to the fmt* helpers.
  const exifTakenIso = mediaItem.exif?.takenAt ?? mediaItem.takenAt ?? null;
  const takenIso = exifTakenIso ?? mediaItem.googleTakenAtIso ?? null;
  const takenFromGoogleTakeout = !exifTakenIso && !!mediaItem.googleTakenAtIso;
  const modifiedIso = mediaItem.lastModified ?? mediaItem.fileModifiedAt ?? null;

  const takenDateLine = fmtWeekdayMonthDayYearAbbrev(takenIso);
  const takenTimeLine = fmtTime12h(takenIso);

  const modifiedDateLine = fmtWeekdayMonthDayYearAbbrev(modifiedIso);
  const modifiedTimeLine = fmtTime12h(modifiedIso);

  const dims = (mediaItem.width && mediaItem.height) ? `${mediaItem.width} x ${mediaItem.height}` : null;

  const aperture = formatAperture(mediaItem.exif?.fNumber);
  const shutter = formatShutter(mediaItem.exif?.exposureTime);
  const focal = formatFocal(mediaItem.exif?.focalLengthMm);

  const locationLine = formatLocation(
    mediaItem.exif?.city,
    mediaItem.exif?.state,
    mediaItem.exif?.country
  );

  const peopleLine = (mediaItem.people && mediaItem.people.length > 0)
    ? mediaItem.people.map(p => p.name).join(', ')
    : '';

  return (
    <Drawer
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="right"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={onClose}>
          <ChevronRightIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />

      <Box
        id='rightPanelBox'
        sx={{
          width: drawerWidth,
          p: 2,
          borderLeft: "1px solid #ddd",
          backgroundColor: "#f9f9f9",
          position: "relative"
        }}
      >
        <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={onClose}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" sx={{ mb: 1 }}>Photo Details</Typography>

        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ lineHeight: 1.8 }}>
            {/* <file name> */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {mediaItem.fileName}
            </Typography>

            {/* Photo taken: */}
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Photo taken:
            </Typography>
            <Typography variant="body2">
              {takenDateLine ?? '—'}
            </Typography>
            <Typography variant="body2">
              {takenTimeLine ?? '—'}
            </Typography>
            {takenFromGoogleTakeout && (
              <Typography variant="body2">
                <strong>Source:</strong> Google Takeout
              </Typography>
            )}

            {/* Last modified: */}
            <Typography variant="body2" sx={{ fontWeight: 600, mt: 1 }}>
              Last modified:
            </Typography>
            <Typography variant="body2">
              {modifiedDateLine ?? '—'}
            </Typography>
            <Typography variant="body2">
              {modifiedTimeLine ?? '—'}
            </Typography>

            {/* Dimensions */}
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Dimensions:</strong> {dims ?? '—'}
            </Typography>

            {/* Exposure lines */}
            <Typography variant="body2">
              <strong>Aperture:</strong> {aperture ?? '—'}
            </Typography>
            <Typography variant="body2">
              <strong>Shutter speed:</strong> {shutter ?? '—'}
            </Typography>
            <Typography variant="body2">
              <strong>Focal length:</strong> {focal ?? '—'}
            </Typography>

            {/* Location */}
            <Typography variant="body2">
              <strong>Location:</strong> {locationLine || '—'}
            </Typography>

            {/* People */}
            <Typography variant="body2">
              <strong>People:</strong> {peopleLine || '—'}
            </Typography>
          </CardContent>
        </Card>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Notes</Typography>
        <TextField
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={localNotes}
          onChange={(e) => setLocalNotes(e.target.value)}
          onBlur={() => props.onSetMediaItemNotes(mediaItem.uniqueId, localNotes)}
          sx={{ my: 2 }}
        />
      </Box>
    </Drawer>
  );
};

function mapStateToProps(state: any, ownProps: RightPanelPropsFromParent): Partial<RightPanelDerivedStateProps> {
  return {
    notes: ownProps.mediaItem ? getMediaItemNotes(state, ownProps.mediaItem.uniqueId) : "",
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onSetMediaItemNotes: setMediaItemNotes,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(RightPanel);
