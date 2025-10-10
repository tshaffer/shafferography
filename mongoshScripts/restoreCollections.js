use pgPhotos;

const collections = [
  "mediaitems",
  // "undecidedgroups",
  "mediacontenttree",
];

const inputDir = "/Users/tedshaffer/Documents/MongoDBBackups/shafferography/backup-10-02-1";

const fs = require("fs");

collections.forEach(collectionName => {
  const inputFilePath = `${inputDir}/${collectionName}.json`;

  if (!fs.existsSync(inputFilePath)) {
    print(`Skipping ${collectionName} — file not found at ${inputFilePath}`);
    return;
  }

  print(`Restoring collection: ${collectionName}`);

  // Read and parse the JSON file
  const rawData = fs.readFileSync(inputFilePath, "utf8");
  const docs = JSON.parse(rawData);

  // Drop existing collection (optional — comment this out if you just want to append)
  db.getCollection(collectionName).drop();

  // Insert the documents
  if (docs.length > 0) {
    db.getCollection(collectionName).insertMany(docs);
    print(`Restored ${docs.length} documents into ${collectionName}`);
  } else {
    print(`No documents found in ${collectionName}.json`);
  }
});

print("All specified collections restored successfully!");
