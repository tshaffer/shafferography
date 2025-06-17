import { MediaItem } from '../types';

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
