import { ReviewLevel, ReviewLevelOption } from "../types";

export const toolbarHeight = 85;
export const bodyMargins = 16;

export const centerColumnWidth = 1800;

export const sliderContainerXTranslate = 74;

export const bordersSize: number = 8;
export const borderSizeStr: string = '4px';

export const targetHeights = [140, 160, 180, 220, 260, 400, 500, 600, 700, 800, 900, 1000];

export const surveyRowHeights = [741, 350, 220];

export const reviewLevelOptions: ReviewLevelOption[] = [
  { value: ReviewLevel.Unreviewed, label: "Unreviewed" },
  { value: ReviewLevel.Undecided, label: "Undecided" },
  { value: ReviewLevel.ReadyForUpload, label: "Ready for Upload" },
  { value: ReviewLevel.Uploaded, label: "Uploaded" },
];
