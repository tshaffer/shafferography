// Run with: mongosh restoreMediaitems.mjs

const fs = require('fs');

// Step 1: Load and parse the deduplicated JSON file
const filePath = '/Users/tedshaffer/Documents/MongoDBBackups/shafferography/backup-07-11-1/deduplicated-file.json';
const rawData = fs.readFileSync(filePath, 'utf8');
const docs = JSON.parse(rawData);

// Step 2: Connect to the correct DB and drop the collection
const db = connect("mongodb://localhost:27017/pgPhotos"); // Adjust URI if needed

if (db.getCollection('mediaitems').countDocuments() > 0) {
  db.mediaitems.drop();
  print("Dropped existing mediaitems collection.");
}

// Step 3: Insert the documents
const result = db.mediaitems.insertMany(docs);
print(`✅ Inserted ${result.insertedIds.length} documents into mediaitems.`);
