// Restore mediaitems from JSON dump
// Usage (inside mongosh):
//   load("/Users/tedshaffer/Documents/Projects/shafferography/mongoshScripts/restoreMediaItems.mjs")

const fs = require('fs');

// Step 1: Path to your JSON file
const filePath = '/Users/tedshaffer/Documents/MongoDBBackups/shafferography/backup-10-05-1/mediaitems.json';
print(`Reading backup file from: ${filePath}`);

const rawData = fs.readFileSync(filePath, 'utf8');
const docs = JSON.parse(rawData);
print(`Parsed ${docs.length} documents from JSON file.`);

// Step 2: Drop existing collection (optional safety check)
const coll = db.getCollection('mediaitems');
const existingCount = coll.countDocuments();

if (existingCount > 0) {
  print(`⚠️  Existing mediaitems collection has ${existingCount} documents.`);
  const confirm = prompt('Drop existing collection and restore from backup? (y/N): ');
  if (confirm.toLowerCase() !== 'y') {
    print('Restore cancelled.');
    quit();
  }
  coll.drop();
  print('Dropped existing mediaitems collection.');
}

// Step 3: Insert all documents
const BATCH_SIZE = 1000;
let inserted = 0;

for (let i = 0; i < docs.length; i += BATCH_SIZE) {
  const batch = docs.slice(i, i + BATCH_SIZE);
  const result = coll.insertMany(batch);
  inserted += Object.keys(result.insertedIds).length;
  print(`Inserted ${inserted}/${docs.length} documents...`);
}

print(`✅ Restore complete. Inserted ${inserted} total documents into 'mediaitems'.`);
