// client/components/EditInPhotosButtons.tsx
import axios from "axios";
import { useState } from "react";
import { getServerUrl, apiUrlFragment } from "../types";

// interface Props {
//   absoluteFilePath: string;
//   onAfterOverwrite?: () => void; // e.g., trigger your Reimport check
// }

//   const [busy, setBusy] = useState(false);

export const editInPhotos = async (mediaItemId: string): Promise<any> => {

  const body = { mediaItemId };
  const path = getServerUrl() + apiUrlFragment + 'import-and-edit';

  try {
    const response = await axios.post(path, body);
    if (response.status !== 200) {
      throw new Error(`Edit failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("Edit failed", error);
  }

}

export const exportEditedBack = async (mediaItemId: string): Promise<any> => {

  const body = { mediaItemId };
  const path = getServerUrl() + apiUrlFragment + 'export-selection-back';

  try {
    const response = await axios.post(path, body);
    if (response.status !== 200) {
      throw new Error(`Edit failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("Edit failed", error);
  }

}

// async function handleEditInPhotos() {
//   // setBusy(true);
//   try {
//     await fetch("/api/photos-flow/import-and-edit", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ originalPath: absoluteFilePath }),
//     }).then(r => {
//       if (!r.ok) throw new Error("Failed to open in Photos");
//       return r.json();
//     });
//     // Optional: set an isCropping flag in your Redux state here
//   } finally {
//     // setBusy(false);
//   }
// }

// async function handleExportEditedBack() {
//   setBusy(true);
//   try {
//     await fetch("/api/photos-flow/export-selection-back", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ originalPath: absoluteFilePath }),
//     }).then(r => {
//       if (!r.ok) throw new Error("Export from Photos failed");
//       return r.json();
//     });
//     onAfterOverwrite?.(); // e.g. trigger your Reimport pass
//   } finally {
//     setBusy(false);
//   }
// }

