// src/components/CropperModal.tsx
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, IconButton, ToggleButtonGroup, ToggleButton } from '@mui/material';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Cropper, ReactCropperElement } from 'react-cropper';
import type { MediaItem } from '../types'; // your app's type
import 'cropperjs/dist/cropper.css';
import { getPhotoUrl } from '../utilities';

type AspectRatio = number | 'free';

type CropData = {
  x: number; y: number; width: number; height: number;
  rotate: number; scaleX: number; scaleY: number;
  naturalWidth: number; naturalHeight: number;
  aspectRatio?: AspectRatio;
};

type Props = {
  open: boolean;
  onClose: () => void;
  mediaItem: MediaItem;
  onOverwriteOriginal?: (args: { mediaItemId: string; cropData: CropData; backupOriginal?: boolean }) => Promise<void>;
};

const ASPECTS = [
  { label: 'Free', value: 'free' as const },
  { label: '1:1', value: 1 as const },
  { label: '3:2', value: 1.5 as const },
  { label: '4:3', value: 1.3333333333 as const },
  { label: '16:9', value: 1.7777777778 as const },
  { label: '5:4', value: 1.25 as const },
] as const;

export const CropperModal: React.FC<Props> = ({
  open, onClose, mediaItem, onOverwriteOriginal,
}) => {
  const cropperRef = useRef<ReactCropperElement>(null);
  // const [aspect, setAspect] = useState<number | 'free'>('free');
  const [aspect, setAspect] = useState<AspectRatio>('free');

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const c = cropperRef.current?.cropper;
      if (!c) return;
      switch (e.key) {
        case 'Escape': onClose(); break;
        // case 'Enter': handleSaveMeta(); break;
        case '+':
        case '=': c.zoom(0.1); break;
        case '-':
        case '_': c.zoom(-0.1); break;
        case 'r':
        case 'R': c.rotate(90); break;
        case 'a':
        case 'A': cycleAspect(); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, aspect]);

  const cycleAspect = () => {
    const idx = ASPECTS.findIndex(a => a.value === aspect);
    const next = ASPECTS[(idx + 1) % ASPECTS.length];
    setAspect(next.value);
  };

  const setAspectOnCropper = (value: number | 'free') => {
    const c = cropperRef.current?.cropper;
    if (!c) return;
    if (value === 'free') c.setAspectRatio(NaN);
    else c.setAspectRatio(value);
  };

  useEffect(() => {
    if (open) setTimeout(() => setAspectOnCropper(aspect), 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    setAspectOnCropper(aspect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspect]);

  const getCropPayload = (): CropData | null => {
    const c = cropperRef.current?.cropper;
    if (!c) return null;
    const data = c.getData(true);
    const img = c.getImageData();
    const ar: AspectRatio = typeof aspect === 'number' ? aspect : 'free';

    return {
      x: Math.round(data.x),
      y: Math.round(data.y),
      width: Math.round(data.width),
      height: Math.round(data.height),
      rotate: data.rotate || 0,
      scaleX: data.scaleX || 1,
      scaleY: data.scaleY || 1,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      aspectRatio: ar,
    };
  };

  const handleOverwriteOriginal = async () => {
    if (!onOverwriteOriginal) return;
    const payload = getCropPayload();
    if (!payload) return;
    await onOverwriteOriginal({
      mediaItemId: mediaItem.uniqueId,
      cropData: payload,
      backupOriginal: true, // or expose a checkbox in the UI
    });
    onClose();
  };

  const toolbar = (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
      <ToggleButtonGroup
        size="small"
        value={aspect}
        exclusive
        onChange={(_, val) => { if (val !== null) setAspect(val as AspectRatio); }}
      >
        {ASPECTS.map(a => (
          <ToggleButton key={String(a.value)} value={a.value}>
            {a.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <IconButton onClick={() => cropperRef.current?.cropper.rotate(-90)}><RotateLeftIcon /></IconButton>
      <IconButton onClick={() => cropperRef.current?.cropper.rotate(90)}><RotateRightIcon /></IconButton>
      <IconButton onClick={() => cropperRef.current?.cropper.zoom(0.1)}><ZoomInIcon /></IconButton>
      <IconButton onClick={() => cropperRef.current?.cropper.zoom(-0.1)}><ZoomOutIcon /></IconButton>
      <IconButton onClick={() => cropperRef.current?.cropper.reset()}><RestartAltIcon /></IconButton>
    </Stack>
  );

  const photoUrl = getPhotoUrl(mediaItem);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Crop Photo</DialogTitle>
      <DialogContent dividers>
        {toolbar}
        <Cropper
          ref={cropperRef}
          src={photoUrl}
          autoCrop
          responsive
          viewMode={1}          // restrict to image bounds
          background={false}
          checkOrientation={true} // relies on embedded EXIF
          guides={true}
          zoomOnWheel={true}
          style={{ width: '100%', height: '70vh' }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel (Esc)</Button>
        <Button variant="contained" color="error" onClick={handleOverwriteOriginal}>
          Overwrite Original (Destructive)
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CropperModal;
