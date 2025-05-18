import { Dimensions, GridRowData, MediaItem } from '../types';

export const getGridRowHeight = (
  availableWidth: number,  // Renamed from rowWidth to match dynamic calculations
  targetHeight: number,
  mediaItems: MediaItem[],
  startingMediaItemIndex: number,
  maxMediaItemIndex: number,
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
  for (let i = startingMediaItemIndex; i <= maxMediaItemIndex; i++) {
    const item = mediaItems[i];
    if (!item.width || !item.height) continue; // Ensure valid dimensions

    const { width, height }: Dimensions = getWidthHeightFromOrientation(item);
    const itemAspectRatio = width / height;
    const scaledWidth = itemAspectRatio * targetHeight;
    const scaledWidthWithMargin = scaledWidth + margin;

    // Stop adding items if row width is exceeded
    if (totalWidth + scaledWidthWithMargin > availableWidth) {
      // This code should be reached for all except the last row
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
    const { width, height }: Dimensions = getWidthHeightFromOrientation(item);
    const itemAspectRatio = width! / height!;
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

const getWidthHeightFromOrientation = (mediaItem: MediaItem): Dimensions => {

  let width = mediaItem.width!;
  let height = mediaItem.height!;

  // swap width and height if orientation is portrait
  switch (mediaItem.orientation) {
    case 6:
    case 8:
      const tmp = width;
      width = height;
      height = tmp;
      break;
    case undefined:
    case null:
    case 0:
    case 1:
    case 3:
      break;
    default:
      console.log('Unsupported orientation: ', mediaItem.orientation);
      debugger;
      break;
  }

  return { width, height };

}
