import { PhotoState, PhotoStateOption } from "../types";

export const toolbarHeight = 85;
export const bodyMargins = 16;

export const centerColumnWidth = 1800;
export const drawerWidth = 240;

export const sliderContainerXTranslate = 74;

export const bordersSize: number = 8;
export const borderSizeStr: string = '4px';

export const targetHeights = [140, 160, 180, 220, 260, 400, 500, 600, 700, 800, 900, 1000];

export const surveyRowHeights = [741, 350, 220];

export const photoStateOptions: PhotoStateOption[] = [
  { label: "Unreviewed", value: PhotoState.Unreviewed, icon: "●" },
  { label: "Ready for Upload", value: PhotoState.ReadyForUpload, icon: "☁" },
  { label: "Uploaded", value: PhotoState.Uploaded, icon: "✅" },
  { label: "Deleted", value: PhotoState.Deleted, icon: "🗑️" },
  { label: "Undecided", value: PhotoState.Undecided, icon: "❓" },
];

// Define photo states with icons
// const photoStateOptions = [
//   { label: "Unreviewed", value: PhotoState.Unreviewed, icon: <HourglassEmptyIcon /> },
//   { label: "Ready for Upload", value: PhotoState.ReadyForUpload, icon: <CloudUploadIcon /> },
//   { label: "Uploaded", value: PhotoState.Uploaded, icon: <CloudDoneIcon /> },
//   { label: "Deleted", value: PhotoState.Deleted, icon: <DeleteIcon /> },
//   { label: "Undecided", value: PhotoState.Undecided, icon: <HelpOutlineIcon /> },
// ];

