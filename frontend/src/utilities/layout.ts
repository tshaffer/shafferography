import { GridRowData, MediaItem } from '../types';

export const getGridRowHeight = (
  availableWidth: number,  // Renamed from rowWidth to match dynamic calculations
  targetHeight: number,
  mediaItems: MediaItem[],
  startingMediaItemIndex: number,
  maxRowIndex: number,
  margin: number = 8 // Optional, default to 8px (4px left + 4px right)
): GridRowData => {
  let totalWidth = 0;
  let totalImageWidth = 0;
  let itemCount = 0;
  let adjustedHeight = targetHeight;
  const itemWidthsWithoutMargin: number[] = [];

  const roundToPrecision = (value: number, precision: number): number => {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  };

  /** Pass 1: Determine how many items can fit using target height */
  for (let i = startingMediaItemIndex; i <= maxRowIndex; i++) {
    const item = mediaItems[i];
    if (!item.width || !item.height) continue; // Ensure valid dimensions

    const itemAspectRatio = item.width / item.height;
    const scaledWidth = itemAspectRatio * targetHeight;
    const scaledWidthWithMargin = scaledWidth + margin;

    // Stop adding items if row width is exceeded
    if (totalWidth + scaledWidthWithMargin > availableWidth) {
      break;
    }

    totalWidth += scaledWidthWithMargin;
    totalImageWidth += scaledWidth;
    itemCount++;
  }

  /** Adjust height if the row wasn't fully filled */
  if (totalWidth < availableWidth && itemCount > 0) {
    const availableSpace = availableWidth - itemCount * margin;
    adjustedHeight = targetHeight * (availableSpace / totalImageWidth);
  }

  /** Pass 2: Calculate exact rendered widths using adjusted height */
  for (let i = startingMediaItemIndex; i < startingMediaItemIndex + itemCount; i++) {
    const item = mediaItems[i];
    const itemAspectRatio = item.width! / item.height!;
    const scaledWidthWithoutMargin = itemAspectRatio * adjustedHeight;
    itemWidthsWithoutMargin.push(roundToPrecision(scaledWidthWithoutMargin, 2));
  }

  return {
    mediaItemIndex: startingMediaItemIndex,
    numMediaItems: itemCount,
    rowHeight: adjustedHeight,
    cellWidths: itemWidthsWithoutMargin,
  };
};
