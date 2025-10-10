use pgPhotos;

const collectionName = "mediaitems";
const inputFilePath = "/Users/tedshaffer/Documents/MongoDBBackups/shafferography/backup-10-05-1/mediaitems.json";

const fs = require("fs");
const data = JSON.parse(fs.readFileSync(inputFilePath));

db[collectionName].deleteMany({});
db[collectionName].insertMany(data);

print("Restored mediaitems collection from backup.");