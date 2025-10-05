export type AspectRatio = number | 'free';

export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  naturalWidth: number;
  naturalHeight: number;
  aspectRatio: AspectRatio;
}

export interface CreateDerivativeRequestBody {
  cropData: CropData;
  format?: 'heic' | 'jpeg' | 'jpg' | 'png'; // optional client override
  quality?: number;                         // 1..100
  heifCompression?: 'av1' | 'hevc';         // if format is heic
  markPreferred?: boolean;                  // optional
}

export interface DerivativeRecord {
  _id: string;
  mediaItemId: string;
  absolutePath: string;
  mimeType: string;
  width: number;
  height: number;
  isPreferred: boolean;
  createdAt: string;
}
