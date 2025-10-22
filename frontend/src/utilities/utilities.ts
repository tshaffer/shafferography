import { AlbumNode, MediaContentNode } from '../types';
import { MediaItem } from '@shared/types/mediaItem';

export const formatISOString = (ISOString: string): string => {

  const date = new Date(ISOString);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  return formattedDate;
};

export const getPhotoUrl = (mediaItem: MediaItem): string => {
  const backendUrl = (window as any).__ENV__?.BACKEND_URL || 'http://localhost:8080';

  // Strip off the protocol and host only
  const originalUrl = mediaItem.url!;
  const mediaPath = originalUrl.replace(/^https?:\/\/[^/]+/, '');

  // Construct the full path using the runtime backend URL
  const url = `${backendUrl.replace(/\/$/, '')}/${mediaPath.replace(/^\//, '')}`;
  return url;
};

export const getCacheBustedPhotoUrl = (src: string, mediaItem: MediaItem): string => {

  const url = `${src}?v=${encodeURIComponent(
    mediaItem?.exif?.fileModifiedAt
    ?? mediaItem?.exif?.exifModifiedAt
    ?? ''
  )}`;
  return url;
}

const isNode = (node: MediaContentNode | null): boolean => {
  return node !== null;
};

export const isAlbumNode = (node: MediaContentNode | null): node is AlbumNode => {
  return isNode(node) && node?.type === 'album';
};

