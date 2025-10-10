import { AlbumNode, Derivative, MediaContentNode, MediaItem, ViewVariant } from '../types';

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

const isNode = (node: MediaContentNode | null): boolean => {
  return node !== null;
};

export const isAlbumNode = (node: MediaContentNode | null): node is AlbumNode => {
  return isNode(node) && node?.type === 'album';
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

export const getMediaItemUrl = (mediaItem: MediaItem, variant: ViewVariant | null | undefined): string => {
  if (!variant || variant === 'preferred') {
    const preferredId: string = mediaItem.preferredDerivativeId ? mediaItem.preferredDerivativeId : mediaItem.uniqueId;
    const derivative: Derivative | undefined = mediaItem.derivatives.find(d => d.derivativeId === preferredId);
    if (derivative) {
      return derivative.url!;
    } else {
      return getPhotoUrl(mediaItem);
    }
  }
  if (variant === 'original') {
    return mediaItem.url!;
  } else {
    const derivative: Derivative | undefined = mediaItem.derivatives.find(d => d.derivativeId === variant.id);
    if (derivative) {
      return derivative.url!;
    } else {
      return getPhotoUrl(mediaItem);
    }
  }
}

