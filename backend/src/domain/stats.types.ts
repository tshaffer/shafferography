export type StringToNumberLUT = Record<string, number>;

export type MediaItemCountByPhotoStateByAlbumNodeId =
  Record<string, Record<string, number>>;

export interface MediaItemCountByUndecidedGroupPerAlbumNode {
  undecidedGroupId: string;
  albumNodeId: string;
  count: number;
}

export interface MediaItemCounts {
  mediaItemCountByAlbumNode: StringToNumberLUT;
  mediaItemCountByPhotoState: StringToNumberLUT;
  mediaItemCountByPhotoStateByAlbumNodeId: MediaItemCountByPhotoStateByAlbumNodeId;
  mediaItemCountByUndecidedGroupPerAlbumNode: MediaItemCountByUndecidedGroupPerAlbumNode[];
}
