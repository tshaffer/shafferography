use pgPhotos;

const collections = [
  "mediaitems",
  "deletedmediaitems",
  "apptagavatars",
  "keywordnodes",
  "keywords",
  "photostodisplayspecs",
  "tags",
  "takeouts",
  "users",
  "usertagavatars",

];

const outputDir = "/Users/tedshaffer/Documents/MongoDBBackups/shafferography/backup-02-17-0-2025";

const fs = require("fs");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

collections.forEach(collectionName => {
  print(`Exporting collection: ${collectionName}`);

  const data = db.getCollection(collectionName).find().toArray();

  const outputFilePath = `${outputDir}/${collectionName}.json`;
  fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2));

  print(`Exported ${collectionName} to ${outputFilePath}`);
});

print("All collections exported successfully!");

