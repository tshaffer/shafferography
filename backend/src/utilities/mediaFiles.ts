import path from "path";
import * as fse from 'fs-extra';
import { MediaItemDTO,  } from '@shared/types/mediaItem';

export const getOriginalMediaItemFilePath = (mediaItem: MediaItemDTO): string => {
  let mediaFilePath: string = mediaItem.filePath;
  const fileExtension = path.extname(mediaFilePath);
  const dirname = path.dirname(mediaFilePath); // Extracts the directory path
  const heicFileName = path.basename(mediaFilePath, fileExtension) + ".heic";
  const heicFilePath = path.join(dirname, heicFileName);
  if (fse.existsSync(heicFilePath)) {
    console.log('HEIC file exists:', heicFilePath);
    mediaFilePath = heicFilePath;
  }
  return mediaFilePath;
}