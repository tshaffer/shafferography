// src/routes/openInPreview.ts
import { Request, Response } from 'express';
import { spawn } from "child_process";
import { getMediaItemFromDb } from '../repositories/mediaItem.repo';
import { getOriginalMediaItemFilePath } from '../utilities';
import { MediaItemDTO } from '../../../shared/types/mediaItem';

export const openInPreview = async (request: Request, response: Response, next: any) => {

  try {
    const { mediaItemId } = request.body as { mediaItemId?: string };
    if (!mediaItemId) return response.status(400).json({ error: "mediaItemId is required" });

    const mediaItem: MediaItemDTO | undefined = await getMediaItemFromDb(mediaItemId);
    if (!mediaItem) {
      console.error('Media item not found for ID:', mediaItemId);
      return response.status(404).json({ error: 'Media item not found' });
    }

    const mediaFilePath: string = getOriginalMediaItemFilePath(mediaItem);

    const appleScript = `
on run argv
  set p to POSIX file (item 1 of argv)
  tell application "Preview"
    activate
    open p
  end tell
  delay 0.3
  tell application "System Events"
    tell process "Preview"
      -- Show Markup Toolbar if hidden (View > Show Markup Toolbar)
      try
        tell menu bar 1 to tell menu bar item "View" to tell menu 1
          if exists menu item "Show Markup Toolbar" then click menu item "Show Markup Toolbar"
        end tell
      end try

      -- Ensure the selection tool is Rectangular (Tools > Rectangular Selection)
      try
        tell menu bar 1 to tell menu bar item "Tools" to tell menu 1
          if exists menu item "Rectangular Selection" then click menu item "Rectangular Selection"
        end tell
      end try

      -- Select the entire image
      keystroke "a" using {command down}
    end tell
  end tell
end run
`;

    // macOS: open the file specifically in Preview.app
    // Equivalent Terminal: open -a Preview "/path/to/file"
    const child = spawn("osascript", ["-e", appleScript, mediaFilePath], {
      stdio: "ignore",
      detached: true,
    });
    child.unref();

    return response.json({ ok: true });
  } catch (err: any) {
    return response.status(500).json({ error: err?.message ?? String(err) });
  }
};

