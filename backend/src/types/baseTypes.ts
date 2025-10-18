import { MediaItem } from "../types";
import { Tags } from "exiftool-vendored";
import { Response } from 'express';

// export type TypedResponse<T> = Response & {
//   json: (body: T) => Response;
// };

export type StringToStringLUT = {
  [key: string]: string;
}

export type StringToNumberLUT = {
  [key: string]: number;
}

export interface FilePathToExifTags {
  [key: string]: Tags;
}

export type StringToMediaItem = {
  [key: string]: MediaItem;
}

export type TypedResponse<T> = Response & {
  json: (body: T) => Response;
};

