import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Box, Typography, Card, CardContent, Divider, IconButton,
  styled, Drawer, TextField
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { MediaItem } from "../types";
import { TedTaggerDispatch } from '../models';
import { getMediaItemNotes } from '../selectors';
import { drawerWidth } from '../constants';
import { setMediaItemNotes } from '../controllers';

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

// ---- helpers ----
function formatDateTimeLine(iso: string | null | undefined, opts?: { timeZone?: string }) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  // We aim for: "<Month> <day>, <year>. <weekday>, <h:mm><AM/PM>"
  const monthDayYear = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    ...(opts?.timeZone ? { timeZone: opts.timeZone } : {})
  }).format(date);

  const weekday = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    ...(opts?.timeZone ? { timeZone: opts.timeZone } : {})
  }).format(date);

  const time = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    ...(opts?.timeZone ? { timeZone: opts.timeZone } : {})
  }).format(date);

  return `${monthDayYear}. ${weekday}, ${time}`;
}

function nonEmptyJoin(parts: Array<string | number | null | undefined>, sep: string) {
  return parts
    .filter((p) => p !== null && p !== undefined && String(p).trim().length > 0)
    .join(sep);
}

function formatAperture(fNumber?: number) {
  if (fNumber === null || fNumber === undefined) return null;
  // Show up to one decimal if needed
  const val = Number.isInteger(fNumber) ? `${fNumber}` : fNumber.toFixed(1);
  return `f/${val}`;
}

function formatShutter(exposureTime?: string) {
  if (!exposureTime) return null;
  return exposureTime; // typically already like "1/120"
}

function formatFocal(focalLengthMm?: number) {
  if (focalLengthMm === null || focalLengthMm === undefined) return null;
  const val = Number.isInteger(focalLengthMm) ? `${focalLengthMm}` : focalLengthMm.toFixed(1);
  return `${val} mm`;
}

const RightPanel: React.FC<RightPanelAllProps> = (props: RightPanelAllProps) => {
  const { open, onClose, mediaItem } = props;

  const [localNotes, setLocalNotes] = React.useState(props.notes || "");
  React.useEffect(() => {
    setLocalNotes(props.notes || "");
  }, [props.notes]);

  if (!mediaItem) return null;

  console.log('props:', props);
  
  // Date/time lines (note: without a known timezone for the photo location,
  // we fall back to the browser's local timezone).
  const takenLine = formatDateTimeLine(mediaItem.creationTime ?? mediaItem.takenAt ?? null);
  const modifiedLine = formatDateTimeLine(mediaItem.lastModified ?? mediaItem.fileModifiedAt ?? null);

  // Dimensions
  const dims =
    mediaItem.width && mediaItem.height
      ? `${mediaItem.width} x ${mediaItem.height}`
      : null;

  // Exposure / optics
  const aperture = formatAperture(mediaItem.exif?.fNumber);
  const shutter = formatShutter(mediaItem.exif?.exposureTime);
  const focal = formatFocal(mediaItem.exif?.focalLengthMm);
  const exposureLine = nonEmptyJoin([aperture, shutter, focal], ' ');

  // Location (no commas per spec; only include present fields)
  const locationLine = nonEmptyJoin(
    [mediaItem.exif?.city, mediaItem.exif?.state, mediaItem.exif?.country],
    ' '
  );

  // People
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
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {mediaItem.fileName}
            </Typography>

            <Typography variant="body2">
              <strong>Photo taken:</strong>{' '}
              {takenLine ?? '—'}
            </Typography>

            <Typography variant="body2">
              <strong>Last modified:</strong>{' '}
              {modifiedLine ?? '—'}
            </Typography>

            <Typography variant="body2">
              <strong>Dimensions:</strong>{' '}
              {dims ?? '—'}
            </Typography>

            <Typography variant="body2">
              {nonEmptyJoin(
                [
                  mediaItem.exif?.fNumber !== undefined ? formatAperture(mediaItem.exif?.fNumber) : null,
                  mediaItem.exif?.exposureTime ? formatShutter(mediaItem.exif?.exposureTime) : null,
                  mediaItem.exif?.focalLengthMm !== undefined ? formatFocal(mediaItem.exif?.focalLengthMm) : null
                ],
                ' '
              ) || '—'}
            </Typography>

            <Typography variant="body2">
              <strong>Location:</strong>{' '}
              {locationLine || '—'}
            </Typography>

            <Typography variant="body2">
              <strong>People:</strong>{' '}
              {peopleLine || '—'}
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
