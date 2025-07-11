use pgPhotos;

const collectionName = "mediacontenttree";
const inputFilePath = "/Users/tedshaffer/Documents/MongoDBBackups/shafferography/restore 6-30-2025/mediacontenttree.json";

const fs = require("fs");
const data = JSON.parse(fs.readFileSync(inputFilePath));

db[collectionName].deleteMany({});
db[collectionName].insertMany(data);

print("Restored entire collection from backup.");