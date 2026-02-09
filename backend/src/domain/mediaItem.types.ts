import { MediaItemPropertiesFromExif } from '@shared/types/mediaItem';
import { PhotoState } from '@shared/types/enums';

export interface CreateMediaItemInput {
  uniqueId: string;
  source?: 'canon' | 'google' | 'local';
  contentHash?: string;
  googleMediaItemId: string;
  fileName: string;
  googleAlbumId: string | null;
  googleAlbumName: string | null;
  filePath?: string;
  url?: string;
  mimeType?: string;
  creationTime?: string;
  lastModified?: string;
  peopleRetrievedFromGoogle: boolean;
  people?: string[];          // accept simple array; we’ll map to [{name}]
  keywordNodeIds: string[];
  photoState: PhotoState;
  albumNodeId: string;
  undecidedGroupId?: string;
  notes?: string;
  importRun?: string;

  // subdocuments (optional)
  exif?: MediaItemPropertiesFromExif;
  exifMeta?: {
    readAtIso: string;
    tool: string;
    toolVersion?: string;
    schemaVersion: number;
    sourcePathHash?: string;
  };
}
