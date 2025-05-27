// Run this in mongosh connected to the pgPhotos database

// Set DRY_RUN to true for a safe test run (no DB writes)
const DRY_RUN = true;

const albumsCollection = db.getCollection('albums');
const mediaItemsCollection = db.getCollection('mediaitems');
const albumTreesCollection = db.getCollection('albumtrees');

// 1️⃣ Build album nodes
const albums = albumsCollection.find().toArray();
const albumIdToNodeId = {};

const albumNodes = albums.map(album => {
  const newId = ObjectId().toHexString();  // Use ObjectId directly in mongosh
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

if (DRY_RUN) {
  print('--- DRY RUN: albumtrees document would be: ---');
  printjson(albumTreesDoc);
} else {
  albumTreesCollection.deleteMany({});
  albumTreesCollection.insertOne(albumTreesDoc);
  print('Inserted albumtrees document with _id: "singleton".');
}

// 3️⃣ Update mediaitems with albumNodeId
let updatedCount = 0;
let sampleUpdates = [];

mediaItemsCollection.find().forEach(mediaItem => {
  const albumId = mediaItem.albumId;
  const albumNodeId = albumIdToNodeId[albumId];

  if (albumNodeId) {
    updatedCount++;
    if (DRY_RUN) {
      if (sampleUpdates.length < 5) {
        sampleUpdates.push({
          _id: mediaItem._id,
          albumId: mediaItem.albumId,
          newAlbumNodeId: albumNodeId
        });
      }
    } else {
      mediaItemsCollection.updateOne(
        { _id: mediaItem._id },
        { $set: { albumNodeId: albumNodeId } }
      );
    }
  }
});

if (DRY_RUN) {
  print(`--- DRY RUN: ${updatedCount} mediaitems would be updated. Sample updates: ---`);
  printjson(sampleUpdates);
} else {
  print(`Updated ${updatedCount} mediaitems with albumNodeId.`);
}
