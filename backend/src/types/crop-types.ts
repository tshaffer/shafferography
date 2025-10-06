export type AspectRatio = number | 'free';

import { z } from 'zod';

// export interface CropData {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   rotate: number;
//   scaleX: number;
//   scaleY: number;
//   naturalWidth: number;
//   naturalHeight: number;
//   aspectRatio: AspectRatio;
// }

// export interface CreateDerivativeRequestBody {
//   cropData: CropData;
//   format?: 'heic' | 'jpeg' | 'jpg' | 'png'; // optional client override
//   quality?: number;                         // 1..100
//   heifCompression?: 'av1' | 'hevc';         // if format is heic
//   markPreferred?: boolean;                  // optional
// }

export interface DerivativeRecord {
  derivativeId: string;
  mediaItemId: string;
  absolutePath: string;
  mimeType: string;
  width: number;
  height: number;
  isPreferred: boolean;
  createdAt: string;
}

export const cropDataSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  rotate: z.number().default(0),
  scaleX: z.number().default(1),
  scaleY: z.number().default(1),
  naturalWidth: z.number().positive(),
  naturalHeight: z.number().positive(),
  aspectRatio: z.union([z.number(), z.literal('free')]).default('free'),
});


export const bodySchema = z.object({
  cropData: cropDataSchema,
  format: z.enum(['heic', 'jpeg', 'jpg', 'png']).optional(),
  quality: z.number().min(1).max(100).optional(),
  heifCompression: z.enum(['av1', 'hevc']).optional(),
  markPreferred: z.boolean().optional(),
});

export type CropData = z.infer<typeof cropDataSchema>;
export type CreateDerivativeRequestBody = z.infer<typeof bodySchema>;