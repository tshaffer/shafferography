import { v4 as uuidv4 } from 'uuid';
import { isNil } from 'lodash';
import {
  getMediaContentTreeModel,
  getKeywordModel,
  getKeywordNodeModel,
  getKeywordTreeModel,
  getUserModel,
} from '../models';
import {
  // MediaItem,
  Keyword,
  KeywordNode,
  SearchSpec,
  KeywordData,
  User,
  UndecidedGroup,
  MediaContentNode,
} from '../types';
import { Document } from 'mongoose';


import { getUndecidedGroupModel } from '../models/UndecidedGroup';
import { MediaItem } from '@shared/types/mediaItem';


//
export const getMediaItemsToDisplayFromDbUsingSearchSpec = async (
  searchSpec: SearchSpec,
): Promise<MediaItem[]> => {

  throw new Error('getMediaItemsToDisplayFromDbUsingSearchSpec not updated yet');

  // const { matchRule, searchRules } = searchSpec;

  // let querySpec = {};
  // let dateQuerySpec = {};
  // const keywordNodeIds: string[] = [];

  // searchRules.forEach((searchRule: SearchRule) => {
  //   if (searchRule.searchRuleType === SearchRuleType.Date) {
  //     // only support single Date rule for now
  //     const dateSearchRule: DateSearchRule = searchRule.searchRule as DateSearchRule;
  //     switch (dateSearchRule.dateSearchRuleType) {
  //       case DateSearchRuleType.IsInTheRange:
  //         const startDate = dateSearchRule.date;
  //         const endDate = dateSearchRule.date2;
  //         dateQuerySpec = { creationTime: { $gte: startDate, $lte: endDate } };
  //         break;
  //       case DateSearchRuleType.IsBefore:
  //         dateQuerySpec = { creationTime: { $lt: dateSearchRule.date } };
  //         break;
  //       case DateSearchRuleType.IsAfter:
  //         dateQuerySpec = { creationTime: { $gt: dateSearchRule.date } };
  //         break;
  //       default:
  //         throw new Error('dateSearchRuleType not recognized');
  //     }
  //   } else if (searchRule.searchRuleType === SearchRuleType.Keyword) {
  //     const keywordSearchRule: KeywordSearchRule = searchRule.searchRule as KeywordSearchRule;
  //     // only support KeywordSearchRuleType.Contains for now
  //     if (keywordSearchRule.keywordSearchRuleType === KeywordSearchRuleType.Contains) {
  //       keywordNodeIds.push(keywordSearchRule.keywordNodeId);
  //     } else if (keywordSearchRule.keywordSearchRuleType === KeywordSearchRuleType.AreEmpty) {
  //       throw new Error('KeywordSearchRuleType.AreEmpty not supported');
  //     } else if (keywordSearchRule.keywordSearchRuleType === KeywordSearchRuleType.AreNotEmpty) {
  //       throw new Error('KeywordSearchRuleType.AreNotEmpty not supported');
  //     } else {
  //       throw new Error('keywordSearchRuleType not recognized');
  //     }
  //   } else {
  //     throw new Error('searchRuleType not recognized');
  //   }
  // });

  // if (!isEmpty(dateQuerySpec)) {
  //   querySpec = dateQuerySpec;
  // }

  // // TEDTODO - need to take matchRule into account when combining dateQuerySpec and keywordQuerySpec
  // if (keywordNodeIds.length > 0) {
  //   if (matchRule === MatchRule.all) {
  //     querySpec = { ...querySpec, keywordNodeIds: { $all: keywordNodeIds } };
  //   } else {
  //     querySpec = { ...querySpec, keywordNodeIds: { $in: keywordNodeIds } };
  //   }
  // }

  // const mediaItemModel = getMediaItemModel(connection);

  // const query = mediaItemModel.find(querySpec);
  // const documents: any = await query.exec();
  // const mediaItems: MediaItem[] = [];
  // for (const document of documents) {
  //   const mediaItem: MediaItem = document.toObject() as MediaItem;
  //   mediaItem.uniqueId = document.uniqueId.toString();
  //   mediaItems.push(mediaItem);
  // }
  // return mediaItems;
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

export const getAllUndecidedGroupsFromDb = async (): Promise<UndecidedGroup[]> => {
  try {
    const undecidedGroupModel = getUndecidedGroupModel();
    const undecidedGroupDocuments = await undecidedGroupModel.find().lean().exec();
    const undecidedGroups: UndecidedGroup[] = undecidedGroupDocuments.map((undecidedGroupDocument: any) => {
      const ud: UndecidedGroup = {
        id: undecidedGroupDocument._id.toString(), // Ensure `id` is returned as a string
        name: undecidedGroupDocument.name,
        albumNodeIds: undecidedGroupDocument.albumNodeIds,
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

export const addUndecidedGroupToDb = async (albumNodeIds: string[], name: string): Promise<UndecidedGroup> => {
  try {
    const undecidedGroupModel = getUndecidedGroupModel();

    const existingGroup = await undecidedGroupModel.findOne({
      name,
      albumNodeIds: { $in: albumNodeIds } // Checks for overlap between provided albumNodeIds and existing ones
    });

    if (existingGroup) {
      throw new Error('Group name must be unique within each album');
    }

    const createdAt: string = new Date().toISOString();

    // Create the new group using Mongoose's model method
    const newGroupDoc = await undecidedGroupModel.create({ albumNodeIds, name, createdAt });

    return {
      id: newGroupDoc._id.toString(), // Convert MongoDB ObjectId to string
      name,
      albumNodeIds,
      createdAt
    };
  } catch (error) {
    console.error('Error adding undecided group:', error);
    throw error;
  }
};

export const getMediaContentNodesFromDb = async (): Promise<MediaContentNode[]> => {

  const contentTreeModel = await getMediaContentTreeModel();

  const documents: any = await contentTreeModel.find().exec();

  const mediaContentNodes: MediaContentNode[] = [];
  for (const document of documents) {
    const mediaContentNode: MediaContentNode = document.toObject() as MediaContentNode;
    mediaContentNodes.push(mediaContentNode);
  }
  return mediaContentNodes;
}

export const saveAlbumTreeToDb = async (nodes: MediaContentNode[]): Promise<void> => {

  const albumTreeModel = await getMediaContentTreeModel();

  // Assuming you have a singleton document for the album tree
  await albumTreeModel.findByIdAndUpdate(
    'singleton',
    { nodes },
    { upsert: true, new: true }
  );
}

export const moveAlbumNodeInDb = async (nodeId: string, newParentId: string): Promise<void> => {

  const albumTreeModel = await getMediaContentTreeModel();

  const treeDoc = await albumTreeModel.findOne(); // adjust if you support multi-user
  if (!treeDoc) return Promise.reject('Tree not found');

  const findAndRemove = (nodes: any[]): [any | null, any[]] => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.id === nodeId) {
        return [node, [...nodes.slice(0, i), ...nodes.slice(i + 1)]];
      }
      if (node.type === 'group') {
        const [found, updatedChildren] = findAndRemove(node.children);
        if (found) {
          node.children = updatedChildren;
          return [found, nodes];
        }
      }
    }
    return [null, nodes];
  };

  const insertNode = (nodes: any[], nodeToInsert: any): boolean => {
    for (const node of nodes) {
      if (node.id === newParentId && node.type === 'group') {
        node.children.push(nodeToInsert);
        return true;
      }
      if (node.type === 'group' && insertNode(node.children, nodeToInsert)) {
        return true;
      }
    }
    return false;
  };

  let movedNode: any;
  [movedNode, treeDoc.nodes] = findAndRemove(treeDoc.nodes);
  if (!movedNode) return Promise.reject('Node not found');

  const inserted = insertNode(treeDoc.nodes, movedNode);
  if (!inserted) return Promise.reject('Node not found');

  await treeDoc.save();
}
