// src/components/CropWatcher.tsx
import { useEffect, useRef, useState } from "react";
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Stack
} from "@mui/material";
import { getFileStat } from "../controllers";

type Props = {
  mediaItemId: string;
  onReimport: (mediaItemId: string) => Promise<void>;
  onDone: () => void;             // will set isCropping = false
  pollMs?: number;                // default 1500ms
  autoStopMs?: number | null;     // e.g., 10 * 60 * 1000 for 10min, or null to disable
  showStopButton?: boolean;       // default true
  promptOnFocusReturn?: boolean;  // default true
};

export default function CropWatcher({
  mediaItemId,
  onReimport,
  onDone,
  pollMs = 1500,
  autoStopMs = 10 * 60 * 1000,
  showStopButton = true,
  promptOnFocusReturn = true,
}: Props) {
  const [baseline, setBaseline] = useState<number | null>(null);
  const [changed, setChanged] = useState(false);
  const [showNoChangePrompt, setShowNoChangePrompt] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const autoStopRef = useRef<number | null>(null);
  const leftWindowRef = useRef(false);

  // Poll for changes
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const s = await getFileStat(mediaItemId);
        if (!cancelled) setBaseline(s.mtimeMs);
      } catch {}
      intervalRef.current = window.setInterval(async () => {
        try {
          const s = await getFileStat(mediaItemId);
          if (baseline !== null && s.mtimeMs > baseline && !cancelled) {
            setChanged(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        } catch {}
      }, pollMs) as unknown as number;
    };

    init();

    return () => {
      cancelled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [mediaItemId, pollMs, baseline]);

  // Optional auto-stop timer
  useEffect(() => {
    if (autoStopMs == null) return;
    autoStopRef.current = window.setTimeout(() => {
      // If nothing changed by now, prompt to stop
      setShowNoChangePrompt(true);
    }, autoStopMs) as unknown as number;

    return () => {
      if (autoStopRef.current) clearTimeout(autoStopRef.current);
    };
  }, [autoStopMs]);

  // Optional: when user returns focus to the tab, check once and prompt if unchanged
  useEffect(() => {
    if (!promptOnFocusReturn) return;

    const onBlur = () => {
      leftWindowRef.current = true;
    };

    const onFocus = async () => {
      if (!leftWindowRef.current) return;
      leftWindowRef.current = false;

      // quick re-check
      try {
        const s = await getFileStat(mediaItemId);
        if (baseline !== null && s.mtimeMs <= baseline && !changed) {
          setShowNoChangePrompt(true);
        }
      } catch {}
    };

    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, [mediaItemId, baseline, changed, promptOnFocusReturn]);

  return (
    <>
      {/* Change detected → ask to reimport */}
      <Dialog open={changed} onClose={onDone}>
        <DialogTitle>Reimport cropped photo?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            We detected that this file was modified. Reimport now?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDone}>Not now</Button>
          <Button variant="contained" onClick={async () => { await onReimport(mediaItemId); onDone(); }}>
            Reimport
          </Button>
        </DialogActions>
      </Dialog>

      {/* No change detected (auto-stop/focus-return) */}
      <Dialog open={showNoChangePrompt && !changed} onClose={() => setShowNoChangePrompt(false)}>
        <DialogTitle>No changes detected</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            We didn’t detect a saved edit to this file. Do you want to keep watching or stop?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNoChangePrompt(false)}>Keep watching</Button>
          <Button variant="contained" onClick={onDone}>Stop watching</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
