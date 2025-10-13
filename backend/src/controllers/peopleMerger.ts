
import { Keyword, KeywordData, KeywordNode, MediaItem, PersonInPhoto, StringToStringLUT } from '../types';
import { isNil } from 'lodash';
import { getJsonFromFile } from '../utilities';
import { addAutoPersonKeywordsToDb, getAutoPersonKeywordNodesFromDb, getKeywordsFromDb, getMediaItemsInNamedAlbumFromDb, updateMediaItemFieldsInDb } from './dbInterface';
import { getTakeoutMetaDataFilePath } from './app';

export const mergePeople = async (baseDirectory: string, albumName: string) => {

  try {
    const mediaItemsInAlbum: MediaItem[] = await getMediaItemsInNamedAlbumFromDb(albumName);

    const personKeywordNames: Set<string> = new Set<string>();

    for (const mediaItemInAlbum of mediaItemsInAlbum) {

      const takeoutMetaDataFilePath: string = getTakeoutMetaDataFilePath(baseDirectory, albumName, mediaItemInAlbum.fileName);

      // NOTE the current (as of 2/21/2025 file naming convention)
      const encodedFilePath = takeoutMetaDataFilePath.replace(/&/g, "&amp_");
      const takeoutMetadata: any = await getJsonFromFile(encodedFilePath);
      if (!isNil(takeoutMetadata.people)) {
        takeoutMetadata.people.forEach((person: any) => {
          personKeywordNames.add(person.name);
        });
      }
    }

    let addedKeywordData: KeywordData = null;
    const addedMediaItems: MediaItem[] = [];

    if (personKeywordNames.size > 0) {
      addedKeywordData = await (addAutoPersonKeywordsToDb(personKeywordNames));
    }

    const keywords: Keyword[] = await getKeywordsFromDb();

    const autoPersonKeywordNodes: KeywordNode[] = await getAutoPersonKeywordNodesFromDb();

    const personNameToAutoPersonKeywordNodeId: StringToStringLUT = {};
    personKeywordNames.forEach((personName: string) => {
      autoPersonKeywordNodes.forEach((autoPersonKeywordNode: KeywordNode) => {
        const autoPersonKeywordId: string = autoPersonKeywordNode.keywordId;
        const keyword: Keyword = keywords.find((keyword: Keyword) => keyword.keywordId === autoPersonKeywordId);
        if (keyword.label === personName) {
          personNameToAutoPersonKeywordNodeId[personName] = autoPersonKeywordNode.nodeId;
        }
      });
    });

    const keywordIdByKeywordLabel: StringToStringLUT = {};
    keywords.forEach((keyword: Keyword) => {
      keywordIdByKeywordLabel[keyword.label] = keyword.keywordId;
    })

    for (const mediaItemInAlbum of mediaItemsInAlbum) {
      const takeoutMetaDataFilePath: string = getTakeoutMetaDataFilePath(baseDirectory, albumName, mediaItemInAlbum.fileName);
      const encodedFilePath = takeoutMetaDataFilePath.replace(/&/g, "&amp_");
      const takeoutMetadata: any = await getJsonFromFile(encodedFilePath);

      const keywordNodeIds: string[] = [];

      if (!isNil(takeoutMetadata.people)) {
        takeoutMetadata.people.forEach((person: any) => {
          const name: string = person.name;
          keywordNodeIds.push(personNameToAutoPersonKeywordNodeId[name]);
        })
      }

      const people: PersonInPhoto[] | null = takeoutMetadata.people ? takeoutMetadata.people : null;

      const updates: Partial<MediaItem> = {
        people,
        keywordNodeIds,
        peopleRetrievedFromGoogle: true,
      };
      await updateMediaItemFieldsInDb(mediaItemInAlbum.uniqueId, updates);
    }

  } catch (error) {
    console.error('Error in uploadPeopleTakeoutsEndpoint:', error);
  }

}
