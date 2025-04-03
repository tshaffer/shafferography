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
  const photoUrl = mediaItem.url!;
  return photoUrl;
};

