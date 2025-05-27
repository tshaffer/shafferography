const { ObjectId } = require('mongodb');

const dbName = 'pgPhotos';
const albumsCollection = db.getCollection('albums');
const mediaItemsCollection = db.getCollection('mediaitems');
const albumTreesCollection = db.getCollection('albumtrees');

// 1️⃣ Build album nodes
const albums = albumsCollection.find().toArray();
const albumIdToNodeId = {};

const albumNodes = albums.map(album => {
  const newId = new ObjectId().toHexString();
  albumIdToNodeId[album.albumId] = newId;

  return {
    id: newId,
    name: album.albumName,
    type: 'album',
    children: []
  };
});

print(`Prepared ${albumNodes.length} album nodes.`);

// 2️⃣ Insert albumtrees document
const albumTreesDoc = {
  _id: 'singleton',
  __v: 0,
  nodes: albumNodes
};

albumTreesCollection.deleteMany({}); // Clear any existing data just in case
albumTreesCollection.insertOne(albumTreesDoc);
print('Inserted albumtrees document with _id: "singleton".');

// 3️⃣ Update mediaitems with albumNodeId
let updatedCount = 0;

mediaItemsCollection.find().forEach(mediaItem => {
  const albumId = mediaItem.albumId;
  const albumNodeId = albumIdToNodeId[albumId];

  if (albumNodeId) {
    mediaItemsCollection.updateOne(
      { _id: mediaItem._id },
      { $set: { albumNodeId: albumNodeId } }
    );
    updatedCount++;
  }
});

print(`Updated ${updatedCount} mediaitems with albumNodeId.`);
