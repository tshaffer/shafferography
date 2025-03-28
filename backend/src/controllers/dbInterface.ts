import { v4 as uuidv4 } from 'uuid';
import { isEmpty, isNil } from 'lodash';
import mongoose from "mongoose";
import {
  getKeywordModel,
  getKeywordNodeModel,
  getKeywordTreeModel,
  getMediaitemModel,
  getUserModel,
} from '../models';
import {
  MediaItem,
  Keyword,
  KeywordNode,
  SearchSpec,
  SearchRule,
  KeywordSearchRule,
  DateSearchRule,
  KeywordData,
  User,
  Album,
  UndecidedGroup,
  // MediaItemCounts,
  MediaItemCountByUndecidedGroupPerAlbum,
  StringToNumberLUT,
} from '../types';
import { Document } from 'mongoose';
import { DateSearchRuleType, KeywordSearchRuleType, MatchRule, PhotoState, SearchRuleType } from '../types/enums';

import { AlbumModel } from '../models';
import { IAlbum } from '../models';
import { getUndecidedGroupModel } from '../models/UndecidedGroup';

export const getMediaItemFromDb = async (mediaItemId: string): Promise<MediaItem> => {
  const mediaItemModel = getMediaitemModel();
  const filter = { uniqueId: mediaItemId };
  const mediaItemDocument: Document = await mediaItemModel.findOne(filter);
  const mediaItem: MediaItem = mediaItemDocument.toObject() as MediaItem;
  return mediaItem;
}

export const getAllMediaItemsFromDb = async (): Promise<MediaItem[]> => {

  const mediaItemModel = getMediaitemModel();

  const mediaItems: MediaItem[] = [];
  const documents: any = await (mediaItemModel as any).find().exec();
  for (const document of documents) {
    const mediaItem: MediaItem = document.toObject() as MediaItem;
    mediaItem.uniqueId = document.uniqueId.toString();
    mediaItems.push(mediaItem);
  }
  return mediaItems;
}

export const getMediaItemsToDisplayFromDb = async (
  specifyDateRange: boolean,
  startDate: string | null,
  endDate: string | null,
): Promise<MediaItem[]> => {

  let querySpec = {};

  if (specifyDateRange) {
    querySpec = { creationTime: { $gte: startDate, $lte: endDate } };
  }

  const mediaItemModel = getMediaitemModel();

  const query = mediaItemModel.find(querySpec).sort({ creationTime: -1 });

  const documents: any = await query.exec();
  const mediaItems: MediaItem[] = [];
  for (const document of documents) {
    const mediaItem: MediaItem = document.toObject() as MediaItem;
    mediaItem.uniqueId = document.uniqueId.toString();  // is this still necessary?
    mediaItems.push(mediaItem);
  }
  return mediaItems;
}

export const getMediaItemsByViewSpecFromDb = async (
  albumIds: string[],
  photoStates: PhotoState[],
  groupUndecidedPhotos: boolean,
  undecidedGroupIds: string[],
): Promise<MediaItem[]> => {
  const mediaItemModel = getMediaitemModel();

  const baseConditions: any[] = [
    { albumId: { $in: albumIds } },
    { photoState: { $in: photoStates } },
  ];

  // Only modify behavior for PhotoState.Undecided
  if (photoStates.includes(PhotoState.Undecided)) {
    if (groupUndecidedPhotos) {
      // When grouping Undecided photos, filter such that:
      // - Items not having PhotoState.Undecided are returned as-is.
      // - Items with PhotoState.Undecided must have an undecidedGroupId in the provided array.
      baseConditions.push({
        $or: [
          { photoState: { $ne: PhotoState.Undecided } },
          {
            $and: [
              { photoState: PhotoState.Undecided },
              { undecidedGroupId: { $in: undecidedGroupIds } },
            ],
          },
        ],
      });
    }
    // If groupUndecidedPhotos is false, then all media items with PhotoState.Undecided are returned.
  }

  const query = mediaItemModel
    .find({ $and: baseConditions })
    .sort({ creationTime: -1 });

  const documents: any = await query.exec();
  return documents.map((document: any) => {
    const mediaItem: MediaItem = document.toObject() as MediaItem;
    mediaItem.uniqueId = document.uniqueId.toString();
    return mediaItem;
  });
};

export const getMediaItemsToDisplayFromDbUsingSearchSpec = async (
  searchSpec: SearchSpec,
): Promise<MediaItem[]> => {

  const { matchRule, searchRules } = searchSpec;

  let querySpec = {};
  let dateQuerySpec = {};
  const keywordNodeIds: string[] = [];

  searchRules.forEach((searchRule: SearchRule) => {
    if (searchRule.searchRuleType === SearchRuleType.Date) {
      // only support single Date rule for now
      const dateSearchRule: DateSearchRule = searchRule.searchRule as DateSearchRule;
      switch (dateSearchRule.dateSearchRuleType) {
        case DateSearchRuleType.IsInTheRange:
          const startDate = dateSearchRule.date;
          const endDate = dateSearchRule.date2;
          dateQuerySpec = { creationTime: { $gte: startDate, $lte: endDate } };
          break;
        case DateSearchRuleType.IsBefore:
          dateQuerySpec = { creationTime: { $lt: dateSearchRule.date } };
          break;
        case DateSearchRuleType.IsAfter:
          dateQuerySpec = { creationTime: { $gt: dateSearchRule.date } };
          break;
        default:
          throw new Error('dateSearchRuleType not recognized');
      }
    } else if (searchRule.searchRuleType === SearchRuleType.Keyword) {
      const keywordSearchRule: KeywordSearchRule = searchRule.searchRule as KeywordSearchRule;
      // only support KeywordSearchRuleType.Contains for now
      if (keywordSearchRule.keywordSearchRuleType === KeywordSearchRuleType.Contains) {
        keywordNodeIds.push(keywordSearchRule.keywordNodeId);
      } else if (keywordSearchRule.keywordSearchRuleType === KeywordSearchRuleType.AreEmpty) {
        throw new Error('KeywordSearchRuleType.AreEmpty not supported');
      } else if (keywordSearchRule.keywordSearchRuleType === KeywordSearchRuleType.AreNotEmpty) {
        throw new Error('KeywordSearchRuleType.AreNotEmpty not supported');
      } else {
        throw new Error('keywordSearchRuleType not recognized');
      }
    } else {
      throw new Error('searchRuleType not recognized');
    }
  });

  if (!isEmpty(dateQuerySpec)) {
    querySpec = dateQuerySpec;
  }

  // TEDTODO - need to take matchRule into account when combining dateQuerySpec and keywordQuerySpec
  if (keywordNodeIds.length > 0) {
    if (matchRule === MatchRule.all) {
      querySpec = { ...querySpec, keywordNodeIds: { $all: keywordNodeIds } };
    } else {
      querySpec = { ...querySpec, keywordNodeIds: { $in: keywordNodeIds } };
    }
  }

  const mediaItemModel = getMediaitemModel();

  const query = mediaItemModel.find(querySpec);
  const documents: any = await query.exec();
  const mediaItems: MediaItem[] = [];
  for (const document of documents) {
    const mediaItem: MediaItem = document.toObject() as MediaItem;
    mediaItem.uniqueId = document.uniqueId.toString();
    mediaItems.push(mediaItem);
  }
  return mediaItems;
}

export const getKeywordsFromDb = async (): Promise<Keyword[]> => {
  const keywordModel = getKeywordModel();
  const keywords: Keyword[] = [];
  const keywordDocuments: any = await (keywordModel as any).find().exec();
  for (const document of keywordDocuments) {
    const keyword: Keyword = document.toObject() as Keyword;
    keyword.keywordId = document.keywordId.toString();
    keyword.label = document.label.toString();
    keyword.type = document.type.toString();
    keywords.push(keyword);
  }
  return keywords;
}

export const getKeywordNodesFromDb = async (): Promise<KeywordNode[]> => {
  const keywordNodeModel = getKeywordNodeModel();
  const keywordNodes: KeywordNode[] = [];
  const keywordNodeDocuments: any = await (keywordNodeModel as any).find().exec();
  for (const document of keywordNodeDocuments) {
    const keywordNode: KeywordNode = document.toObject() as KeywordNode;
    keywordNode.nodeId = document.nodeId.toString();
    keywordNode.keywordId = document.keywordId.toString();
    keywordNodes.push(keywordNode);
  }
  return keywordNodes;
}

export const getAllKeywordDataFromDb = async (): Promise<any> => {

  const keywords: Keyword[] = await getKeywordsFromDb();
  const keywordNodes: KeywordNode[] = await getKeywordNodesFromDb();
  const keywordRootNodeId: string = 'rootKeywordNodeId';

  return {
    keywords,
    keywordNodes,
    keywordRootNodeId,
  };
}

export const createKeywordDocument = async (keyword: Keyword): Promise<string> => {
  const keywordModel = getKeywordModel();
  return keywordModel.create(keyword)
    .then((keywordDocument: any) => {
      const keyword: Keyword = keywordDocument.toObject() as Keyword;
      return Promise.resolve(keyword.keywordId);
    }).catch((err: any) => {
      return Promise.reject(err);
    });
}

export const createKeywordNodeDocument = async (keywordNode: KeywordNode): Promise<string> => {
  const keywordNodeModel = getKeywordNodeModel();
  return keywordNodeModel.create(keywordNode)
    .then((keywordNodeDocument: any) => {
      const keywordNode: KeywordNode = keywordNodeDocument.toObject() as KeywordNode;
      return Promise.resolve(keywordNode.nodeId);
    }).catch((err: any) => {
      return Promise.reject(err);
    });
}

export const setRootKeywordNodeDb = async (rootNodeId: string): Promise<void> => {
  const keywordTreeModel = getKeywordTreeModel();
  return keywordTreeModel.create({ rootNodeId })
    .then((keywordTreeDocument: any) => {
      return Promise.resolve();
    }).catch((err: any) => {
      return Promise.reject(err);
    });
}

export const updateKeywordNodeDb = async (keywordNode: KeywordNode): Promise<any> => {
  const keywordNodeModel = getKeywordNodeModel();
  const filter = { nodeId: keywordNode.nodeId };
  const updatedDoc = await keywordNodeModel.findOneAndUpdate(filter, keywordNode, {
    new: true,
  }).exec();
}

export const getUserFromDb = async (googleId: string): Promise<User> => {
  const userModel = getUserModel();
  const filter = { googleId };
  const userDocument: Document = await userModel.findOne(filter);
  if (!isNil(userDocument)) {
    const user: User = userDocument.toObject() as User;
    return user;
  }
  return null;
}

export const updateUserInDb = async (googleId: string, update: Object): Promise<any> => {
  const userModel = getUserModel();
  const filter = { googleId };
  const updatedDoc = await userModel.findOneAndUpdate(filter, update, {
    upsert: true,
    new: true,
  }).exec();
}

export const getAutoPersonKeywordNodesFromDb = async (): Promise<KeywordNode[]> => {

  const autoPersonKeywordNodes: KeywordNode[] = [];

  const keywordNodes: KeywordNode[] = await getKeywordNodesFromDb();

  const keywordNodesByNodeId: Map<string, KeywordNode> = new Map<string, KeywordNode>();
  keywordNodes.forEach((keywordNode: KeywordNode) => {
    keywordNodesByNodeId.set(keywordNode.nodeId, keywordNode);
  });

  let peopleKeywordNode: KeywordNode = null;
  keywordNodes.forEach((keywordNode: KeywordNode) => {
    if (keywordNode.nodeId === 'peopleKeywordNodeId') {
      peopleKeywordNode = keywordNode;
      return;
    }
  });

  if (isNil(peopleKeywordNode)) {
    debugger;
  }

  const autoPersonKeywordNodeIds: string[] = peopleKeywordNode.childrenNodeIds;
  autoPersonKeywordNodeIds.forEach((autoPersonKeywordNodeId: string) => {
    autoPersonKeywordNodes.push(keywordNodesByNodeId.get(autoPersonKeywordNodeId));
  });

  return autoPersonKeywordNodes;
}

export const addAutoPersonKeywordsToDb = async (keywordsSet: Set<string>): Promise<KeywordData> => {

  let peopleKeywordNode: KeywordNode = null;
  const keywordNodes: KeywordNode[] = await getKeywordNodesFromDb();
  keywordNodes.forEach((keywordNode: KeywordNode) => {
    if (keywordNode.nodeId === 'peopleKeywordNodeId') {
      peopleKeywordNode = keywordNode;
      return;
    }
  });
  if (isNil(peopleKeywordNode)) {
    throw new Error('peopleKeywordNode not found');
  }

  const existingKeywords: Keyword[] = await getKeywordsFromDb();
  const existingKeywordNames: string[] = existingKeywords.map((aKeyword: Keyword) => {
    return aKeyword.label;
  })
  const existingKeywordsSet: Set<string> = new Set<string>(existingKeywordNames);

  const keywordsToAddToDb: Keyword[] = [];
  const addedKeywordNodes: KeywordNode[] = [];

  for (let keywordLabel of keywordsSet) {
    if (!existingKeywordsSet.has(keywordLabel)) {
      const keyword: Keyword = {
        keywordId: uuidv4(),
        label: keywordLabel,
        type: 'autoPerson',
      };
      keywordsToAddToDb.push(keyword);
    }
  }

  try {
    if (keywordsToAddToDb.length > 0) {
      const keywordModel = getKeywordModel();
      return keywordModel.collection.insertMany(keywordsToAddToDb)
        .then((retVal: any) => {

          const createKeywordNodePromises: Promise<string>[] = [];

          const keywords: Keyword[] = retVal.ops;
          keywords.forEach((keyword: Keyword) => {
            const keywordNode: KeywordNode = {
              nodeId: uuidv4(),
              keywordId: keyword.keywordId,
              parentNodeId: 'peopleKeywordNodeId',
              childrenNodeIds: [],
            };
            createKeywordNodePromises.push(createKeywordNodeDocument(keywordNode));
            addedKeywordNodes.push(keywordNode);
          });
          return Promise.all(createKeywordNodePromises)
            .then((keywordNodeIds: string[]) => {

              keywordNodeIds.forEach((keywordNodeId: string) => {
                peopleKeywordNode.childrenNodeIds.push(keywordNodeId);
              });
              updateKeywordNodeDb(peopleKeywordNode);

              const keywordData: KeywordData = {
                keywords: keywordsToAddToDb,
                keywordNodes: addedKeywordNodes,
                keywordRootNodeId: 'rootKeywordNodeId',
              };
              return keywordData;
            });
        })
    }
  } catch (error: any) {
    debugger;
    return null;
  }

  return null;
}

export const updateMediaItemInDb = async (mediaItem: MediaItem): Promise<any> => {
  const mediaItemModel = getMediaitemModel();
  const filter = { uniqueId: mediaItem.uniqueId };
  const updatedDoc = await mediaItemModel.findOneAndUpdate(filter, mediaItem, {
    new: true,
  }).exec();
};

export const updateMediaItemFieldsInDb = async (
  uniqueId: string,
  updates: Partial<MediaItem>
): Promise<any> => {
  const mediaItemModel = getMediaitemModel();

  try {
    // Construct the filter
    const filter = { uniqueId };

    // Perform the update with the fields specified at runtime
    const updatedDoc = await mediaItemModel
      .findOneAndUpdate(filter, updates, { new: true }) // `new: true` returns the updated document
      .exec();

    return updatedDoc;
  } catch (err) {
    console.error('Error updating media item:', err);
    throw err;
  }
};

export const updateMediaItemsFieldsInDb = async (
  uniqueIds: string[],
  updates: Partial<MediaItem>
): Promise<any> => {
  const mediaItemModel = getMediaitemModel();

  try {
    // Construct the filter to match multiple documents
    const filter = { uniqueId: { $in: uniqueIds } };

    // Perform the update for all matching documents
    const updateResult = await mediaItemModel.updateMany(filter, updates).exec();

    return updateResult; // Contains metadata about the update operation
  } catch (err) {
    console.error('Error updating media items:', err);
    throw err;
  }
};

const addMediaItemToDb = async (mediaItemModel: any, mediaItem: MediaItem): Promise<any> => {

  try {
    return mediaItemModel.collection.insertOne(mediaItem)
      .then((retVal: any) => {
        const dbRecordId: string = retVal.insertedId._id.toString();
        return;
      })
      .catch((error: any) => {
        console.error('db add error: ', error);
        if (error.code === 11000) {
          return;
        } else {
          debugger;
        }
      });
  } catch (error: any) {
    debugger;
  }
};

export const addMediaItemToMediaItemsDBTable = async (mediaItem: MediaItem): Promise<any> => {
  const mediaItemModel = getMediaitemModel();
  return addMediaItemToDb(mediaItemModel, mediaItem);
};

export const getGoogleAlbumNamesWherePeopleNotRetrieved = async (): Promise<string[]> => {
  const mediaItemModel = getMediaitemModel();

  try {
    // Query the collection to find distinct album names
    const googleAlbumNames = await mediaItemModel.distinct('googleAlbumName', {
      peopleRetrievedFromGoogle: false,
      googleAlbumName: { $ne: '' }, // Exclude empty strings at the query level
    });

    return googleAlbumNames; // Returns an array of album names
  } catch (error) {
    console.error('Error retrieving albums:', error);
    throw error;
  }
};

export const getMediaItemsInNamedAlbumFromDb = async (googleAlbumName: string): Promise<MediaItem[]> => {
  const mediaItemModel = getMediaitemModel();

  const mediaItems: MediaItem[] = [];
  const documents: any = await (mediaItemModel as any).find({ googleAlbumName }).exec();
  for (const document of documents) {
    const mediaItem: MediaItem = document.toObject() as MediaItem;
    mediaItems.push(mediaItem);
  }
  return mediaItems;
}

export const getAllAlbumsFromDb = async (): Promise<IAlbum[]> => {
  try {
    const albums = await AlbumModel.find().exec();
    return albums;
  } catch (error) {
    console.error('Error retrieving photo sets:', error);
    throw error;
  }
};

export const addAlbumToDb = async (album: Required<Album>): Promise<IAlbum> => {
  try {
    const newAlbum = new AlbumModel(album);
    await newAlbum.save();
    return newAlbum;
  } catch (error) {
    console.error('Error adding album:', error);
    throw error;
  }
};

export const getAlbumById = async (albumId: string): Promise<Album> => {
  try {
    const querySpec = { albumId };
    const album = await AlbumModel.find(querySpec).exec();
    return album[0];
  } catch (error) {
    console.error('Error retrieving photo set:', error);
    throw error;
  }
};

export const getAllUndecidedGroupsFromDb = async (): Promise<UndecidedGroup[]> => {
  try {
    const undecidedGroupModel = getUndecidedGroupModel();
    const undecidedGroupDocuments = await undecidedGroupModel.find().lean().exec();
    const undecidedGroups: UndecidedGroup[] = undecidedGroupDocuments.map((undecidedGroupDocument: any) => {
      const ud: UndecidedGroup = {
        id: undecidedGroupDocument._id.toString(), // Ensure `id` is returned as a string
        name: undecidedGroupDocument.name,
        albumIds: undecidedGroupDocument.albumIds,
        createdAt: undecidedGroupDocument.createdAt,
      }
      return ud;
    });
    return undecidedGroups;
  } catch (error) {
    console.error('Error retrieving undecided groups:', error);
    throw error;
  }
};

export const addUndecidedGroupToDb = async (albumIds: string[], name: string): Promise<UndecidedGroup> => {
  try {
    const undecidedGroupModel = getUndecidedGroupModel();

    // Ensure group name is unique within at least one of the provided albumIds
    const existingGroup = await undecidedGroupModel.findOne({
      name,
      albumIds: { $in: albumIds } // Checks for overlap between provided albumIds and existing ones
    });

    if (existingGroup) {
      throw new Error('Group name must be unique within each album');
    }

    const createdAt: string = new Date().toISOString();

    // Create the new group using Mongoose's model method
    const newGroupDoc = await undecidedGroupModel.create({ albumIds, name, createdAt });

    return {
      id: newGroupDoc._id.toString(), // Convert MongoDB ObjectId to string
      name,
      albumIds,
      createdAt
    };
  } catch (error) {
    console.error('Error adding undecided group:', error);
    throw error;
  }
};

export const assignMediaItemsToUndecidedGroupDb = async (undecidedGroupId: string, mediaItemIds: string[]): Promise<void> => {
  try {
    const mediaItemModel = getMediaitemModel(); // Get MediaItems collection model

    // Ensure undecidedGroupId is a valid ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(undecidedGroupId)) {
      throw new Error(`Invalid undecidedGroupId: ${undecidedGroupId}`);
    }

    // Update MediaItems by setting the undecidedGroupId
    await mediaItemModel.updateMany(
      { uniqueId: { $in: mediaItemIds } }, // Match media items by uniqueId
      { $set: { undecidedGroupId } } // Assign the group ID to these media items
    );

  } catch (error) {
    console.error('Error assigning media items to undecided group:', error);
    throw error;
  }
};

export const deleteUndecidedGroupFromDb = async (undecidedGroupId: string): Promise<void> => {
  try {
    // Validate the provided undecidedGroupId
    if (!mongoose.Types.ObjectId.isValid(undecidedGroupId)) {
      throw new Error(`Invalid undecidedGroupId: ${undecidedGroupId}`);
    }

    // Remove the reference to the undecided group from all media items.
    const mediaItemModel = getMediaitemModel();
    await mediaItemModel.updateMany(
      { undecidedGroupId },
      { $unset: { undecidedGroupId: "" } }
    );

    // Delete the undecided group document itself.
    const undecidedGroupModel = getUndecidedGroupModel();
    await undecidedGroupModel.deleteOne({ _id: undecidedGroupId });

  } catch (error) {
    console.error('Error deleting undecided group:', error);
    throw error;
  }
};

export const getMediaItemCountByAlbumFromDb = async (): Promise<StringToNumberLUT> => {
  const mediaItemModel = getMediaitemModel();
  const counts = await mediaItemModel.aggregate([
    {
      $group: {
        _id: "$albumId",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        albumId: "$_id",
        count: 1,
        _id: 0
      }
    }
  ]);

  const mapping: StringToNumberLUT = {};
  counts.forEach((entry: { albumId: string; count: number }) => {
    mapping[entry.albumId] = entry.count;
  });

  return mapping;
};

export const getMediaItemCountByPhotoStateFromDb = async (): Promise<StringToNumberLUT> => {
  const mediaItemModel = getMediaitemModel();
  const counts = await mediaItemModel.aggregate([
    {
      $group: {
        _id: "$photoState",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        photoState: "$_id",
        count: 1,
        _id: 0
      }
    }
  ]);

  const mapping: StringToNumberLUT = {};
  counts.forEach((entry: { photoState: string; count: number }) => {
    mapping[entry.photoState] = entry.count;
  });

  return mapping;
};

export const getMediaItemCountByUndecidedGroupPerAlbumFromDb = async (): Promise<MediaItemCountByUndecidedGroupPerAlbum[]> => {
  const undecidedGroupModel = getUndecidedGroupModel();
  const result = await undecidedGroupModel.aggregate([
    { $unwind: "$albumIds" },
    {
      $lookup: {
        from: "mediaitems",
        let: { albumId: "$albumIds", groupId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$albumId", "$$albumId"] },
                  { $eq: ["$photoState", "undecided"] },
                  { $eq: ["$undecidedGroupId", { $toString: "$$groupId" }] }
                ]
              }
            }
          }
        ],
        as: "mediaItems"
      }
    },
    {
      $project: {
        _id: 0,
        undecidedGroupId: { $toString: "$_id" },
        albumId: "$albumIds",
        count: { $size: "$mediaItems" }
      }
    }
  ]);
  return result;
};

// export const getMediaItemsCountsFromDb = async (): Promise<MediaItemCounts> => {
//   const mediaItemModel = getMediaitemModel();
//   const result = await mediaItemModel.aggregate([
//     {
//       $facet: {
//         byPhotoState: [
//           { $group: { _id: "$photoState", count: { $sum: 1 } } },
//           { $project: { photoState: "$_id", count: 1, _id: 0 } }
//         ],
//         byAlbum: [
//           { $group: { _id: "$albumId", count: { $sum: 1 } } },
//           { $project: { albumId: "$_id", count: 1, _id: 0 } }
//         ]
//       }
//     }
//   ]);

//   // Since the aggregation returns an array with a single document, return that document.
//   return result[0];
// };

